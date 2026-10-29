namespace Bambaura.Api.Models;

public record GoogleSsoRequest(
    string? GoogleIdToken,
    string? Email,
    string? Name,
    string? AvatarUrl
);

public record AuthUserResponse(
    string UserId,
    string Name,
    string Email,
    string AvatarUrl,
    string Provider,
    bool IsVerified,
    string Token,
    DateTime ExpiresAtUtc
);

public record ConciergeInquiryRequest(
    string Name,
    string Email,
    string Subject,
    string Message,
    string? Phone
);

public record ConciergeInquiryResponse(
    string TicketId,
    string Status,
    string Message,
    DateTime ReceivedAtUtc
);

public record AffiliateCalculationRequest(
    int MonthlyReferrals,
    decimal AverageOrderUSD
);

public record AffiliateCalculationResponse(
    int MonthlyReferrals,
    decimal AverageOrderUSD,
    decimal MonthlyGrossVolumeUSD,
    decimal MonthlyCommissionUSD,
    decimal AnnualCommissionUSD,
    decimal CommissionRatePercent
);

public record AffiliateApplicationRequest(
    string Name,
    string Email,
    string PlatformOrChannel,
    string AudienceSize,
    string Notes
);

public record SystemHealthResponse(
    string Status,
    string DotNetVersion,
    string OsDescription,
    string OsArchitecture,
    string MachineName,
    TimeSpan Uptime,
    DateTime TimestampUtc
);

