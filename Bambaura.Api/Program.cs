using Bambaura.Api.Data;
using Bambaura.Api.Endpoints;
using Bambaura.Api.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Cross-Platform Kestrel Configuration (Windows & Linux)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
    if (int.TryParse(port, out var parsedPort))
    {
        serverOptions.ListenAnyIP(parsedPort);
    }
});

// 2. Configure PostgreSQL Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? "Host=bambaura-db;Port=5432;Database=bambauradb;Username=bambaura_user;Password=bambaura_secure_password_2026;Timeout=3;Command Timeout=5;Include Error Detail=true";

if (!connectionString.Contains("Timeout=", StringComparison.OrdinalIgnoreCase))
{
    connectionString += ";Timeout=3;Command Timeout=5";
}

builder.Services.AddDbContext<BambauraDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 1,
            maxRetryDelay: TimeSpan.FromSeconds(1),
            errorCodesToAdd: null);
    });
});

// 3. Register Application Services (Scoped for EF Core DB Context injection)
builder.Services.AddSingleton<DatabaseAvailabilityState>();
builder.Services.AddScoped<IBambauraDataService, BambauraDataService>();
builder.Services.AddScoped<IRazorpayCheckoutService, RazorpayCheckoutService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// 4. Register OpenAPI (.NET 10 Built-in)
builder.Services.AddOpenApi();

// 5. Register Cross-Platform CORS (Allows React Vite dev & production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBambauraStorefront", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 6. Automatic Database Migration & Seeding on Startup
var dbState = app.Services.GetRequiredService<DatabaseAvailabilityState>();
using (var scope = app.Services.CreateScope())
{
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Bambaura.Database");
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<BambauraDbContext>();
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
        var reachable = await db.Database.CanConnectAsync(cts.Token);
        if (reachable)
        {
            startupLogger.LogInformation("PostgreSQL reachable. Verifying schema and seeding...");
            await db.Database.EnsureCreatedAsync();
            await BambauraDbContext.SeedInitialDataAsync(db, startupLogger);
            dbState.MarkAvailable();
            startupLogger.LogInformation("PostgreSQL initialized and ready.");
        }
        else
        {
            dbState.MarkUnavailable("Not reachable at startup");
            startupLogger.LogWarning("PostgreSQL was not reachable at startup. Active fallback mode enabled for local operations.");
        }
    }
    catch (Exception ex)
    {
        dbState.MarkUnavailable(ex.Message);
        startupLogger.LogWarning("PostgreSQL initialization note: {Message}. Active fallback mode enabled for local operations.", ex.Message);
    }
}

// 7. Middleware Pipeline
app.UseCors("AllowBambauraStorefront");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// 8. Cross-Platform Static Files & SPA Fallback Hosting
// When running in Docker on Linux VPS or Windows, serves React 'dist' assets directly from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// 9. Map Minimal API Endpoints
app.MapBambauraEndpoints();
app.MapAdminEndpoints();

// 10. SPA Client-Side Routing Fallback (for React Router on both Windows and Linux)
app.MapFallbackToFile("index.html");

Console.WriteLine("====================================================================");
Console.WriteLine($" Bambaura 9X Salt — .NET 10 Minimal APIs Running on {System.Runtime.InteropServices.RuntimeInformation.OSDescription}");
Console.WriteLine(" Endpoints: http://localhost:5000/api/health");
Console.WriteLine(" OpenAPI:   http://localhost:5000/openapi/v1.json");
Console.WriteLine($" Storage:   PostgreSQL (State: {dbState.Status})");
Console.WriteLine("====================================================================");

app.Run();
