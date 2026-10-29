using Bambaura.Api.Data;
using Bambaura.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Bambaura.Api.Services;

public interface IAuthService
{
    Task<AuthUserResponse> HandleGoogleSsoAsync(GoogleSsoRequest request);
    Task<AuthUserResponse> GetProfileAsync(string userId);
}

public class AuthService : IAuthService
{
    private static readonly Dictionary<string, AuthUserResponse> CachedUsers = new(StringComparer.OrdinalIgnoreCase);
    private readonly BambauraDbContext? _db;
    private readonly DatabaseAvailabilityState _dbState;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ILogger<AuthService> logger,
        DatabaseAvailabilityState dbState,
        BambauraDbContext? db = null)
    {
        _logger = logger;
        _dbState = dbState;
        _db = db;
    }

    public async Task<AuthUserResponse> HandleGoogleSsoAsync(GoogleSsoRequest request)
    {
        var email = !string.IsNullOrWhiteSpace(request.Email)
            ? request.Email.Trim().ToLowerInvariant()
            : "patron@gmail.com";

        var name = !string.IsNullOrWhiteSpace(request.Name)
            ? request.Name.Trim()
            : email.Split('@')[0];

        var avatar = !string.IsNullOrWhiteSpace(request.AvatarUrl)
            ? request.AvatarUrl
            : $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(name)}&backgroundColor=401010,b28346";

        var userId = $"usr_google_{Guid.NewGuid().ToString("N")[..10]}";
        var token = $"ey_bambaura_jwt_{Guid.NewGuid():N}.{DateTime.UtcNow.Ticks}";
        var expires = DateTime.UtcNow.AddDays(30);

        var user = new AuthUserResponse(
            UserId: userId,
            Name: name,
            Email: email,
            AvatarUrl: avatar,
            Provider: "google",
            IsVerified: true,
            Token: token,
            ExpiresAtUtc: expires
        );

        CachedUsers[userId] = user;

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (existingUser != null)
                {
                    existingUser.Name = name;
                    existingUser.AvatarUrl = avatar;
                    existingUser.LastLoginAtUtc = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                    _logger.LogInformation("👤 Updated existing user {Email} in PostgreSQL", email);
                    user = user with { UserId = existingUser.Id };
                }
                else
                {
                    var userEntity = new UserEntity
                    {
                        Id = userId,
                        Name = name,
                        Email = email,
                        AvatarUrl = avatar,
                        Provider = "google",
                        GoogleId = request.GoogleIdToken,
                        IsVerified = true,
                        CreatedAtUtc = DateTime.UtcNow,
                        LastLoginAtUtc = DateTime.UtcNow
                    };
                    await _db.Users.AddAsync(userEntity);
                    await _db.SaveChangesAsync();
                    _logger.LogInformation("👤 Created new user {Email} in PostgreSQL", email);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not persist user to PostgreSQL ({Message}). Using cached identity.", ex.Message);
            }
        }

        return user;
    }

    public async Task<AuthUserResponse> GetProfileAsync(string userId)
    {
        if (CachedUsers.TryGetValue(userId, out var user))
        {
            return user;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var entity = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (entity != null)
                {
                    var profile = new AuthUserResponse(
                        UserId: entity.Id,
                        Name: entity.Name,
                        Email: entity.Email,
                        AvatarUrl: entity.AvatarUrl ?? $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(entity.Name)}",
                        Provider: entity.Provider,
                        IsVerified: entity.IsVerified,
                        Token: string.Empty,
                        ExpiresAtUtc: DateTime.UtcNow.AddDays(30)
                    );
                    CachedUsers[userId] = profile;
                    return profile;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not query user from PostgreSQL: {Message}", ex.Message);
            }
        }

        return new AuthUserResponse(
            UserId: "usr_guest",
            Name: "Guest Connoisseur",
            Email: "guest@bambaura.com",
            AvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
            Provider: "guest",
            IsVerified: false,
            Token: string.Empty,
            ExpiresAtUtc: DateTime.UtcNow
        );
    }
}
