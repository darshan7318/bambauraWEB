namespace Bambaura.Api.Models;

public record CartItemDto(
    string ProductId,
    string Title,
    string Grams,
    string Grind,
    decimal PriceUSD,
    int Quantity,
    string? Image
);

public record CustomerInfo(
    string Name,
    string Email,
    string? Phone,
    string? ShippingAddress,
    string? City,
    string? Country
);

public record CreateOrderRequest(
    List<CartItemDto> Items,
    string RegionCode,
    CustomerInfo? Customer,
    string? PurchaseType // "onetime" or "subscription"
);

public record RazorpayOrderResponse(
    string OrderId,
    string RazorpayKeyId,
    decimal AmountInCurrency,
    string Currency,
    decimal TotalUSD,
    decimal ShippingFeeUSD,
    bool IsFreeShipping,
    CustomerInfo? Customer,
    List<CartItemDto> Items,
    DateTime CreatedAtUtc
);

public record VerifyPaymentRequest(
    string OrderId,
    string RazorpayPaymentId,
    string? RazorpaySignature,
    string PaymentMethod,
    string RegionCode,
    CustomerInfo? Customer = null,
    List<CartItemDto>? Items = null,
    decimal? TotalUSD = null
);

public record OrderReceipt(
    string OrderId,
    string PaymentId,
    string Status,
    string PaymentMethod,
    decimal TotalAmount,
    string Currency,
    string FormattedTotal,
    CustomerInfo Customer,
    List<CartItemDto> Items,
    DateTime ConfirmedAtUtc,
    string TrackingNumber,
    string EstimatedDelivery
);

