namespace Bambaura.Api.Models;

public record AdminLoginRequest(string Passcode);

public record AdminLoginResponse(
    bool Success,
    string Token,
    string Message
);

public record AdminDashboardStats(
    int TotalOrders,
    decimal TotalRevenueUSD,
    int TotalInquiries,
    int TotalAmbassadors,
    int TotalVariants,
    string DatabaseStatus,
    TimeSpan Uptime,
    DateTime ServerTimeUtc
);

public record UpdateGramVariantRequest(
    string? Name,
    string? Subtext,
    decimal PriceUSD,
    decimal AmazonUSD,
    bool InStock,
    bool Popular
);

public record UpdateOrderStatusRequest(
    string Status,
    string? TrackingNumber,
    string? EstimatedDelivery
);

public record UpdateInquiryStatusRequest(
    string Status
);

public record UpdateAmbassadorStatusRequest(
    string Status
);

