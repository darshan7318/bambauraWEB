using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bambaura.Api.Data;

[Table("products")]
public class ProductEntity
{
    [Key]
    public string Id { get; set; } = "bambaura-9x-salt";
    public string Name { get; set; } = string.Empty;
    public string Badge { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public decimal Rating { get; set; } = 4.96m;
    public int ReviewsCount { get; set; } = 489;
    public string AmazonLinkUS { get; set; } = string.Empty;
    public string AmazonLinkUK { get; set; } = string.Empty;

    public List<GramVariantEntity> GramVariants { get; set; } = new();
}

[Table("gram_variants")]
public class GramVariantEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string ProductId { get; set; } = "bambaura-9x-salt";
    public string Grams { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Subtext { get; set; } = string.Empty;
    public decimal PriceUSD { get; set; }
    public decimal AmazonUSD { get; set; }
    public bool InStock { get; set; } = true;
    public bool Popular { get; set; } = false;
    public string Image { get; set; } = string.Empty;
}

[Table("orders")]
public class OrderEntity
{
    [Key]
    public string Id { get; set; } = string.Empty; // e.g. BAMB-9X-######
    public string? RazorpayOrderId { get; set; }
    public string? RazorpayPaymentId { get; set; }
    public string Status { get; set; } = "Confirmed";
    public string PaymentMethod { get; set; } = "UPI";
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? ShippingAddress { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string ItemsJson { get; set; } = "[]";
    public string TrackingNumber { get; set; } = string.Empty;
    public string EstimatedDelivery { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

[Table("users")]
public class UserEntity
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Provider { get; set; } = "google";
    public string? GoogleId { get; set; }
    public bool IsVerified { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime LastLoginAtUtc { get; set; } = DateTime.UtcNow;
}

[Table("inquiries")]
public class InquiryEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string TicketId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Status { get; set; } = "Received";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

[Table("ambassador_applications")]
public class AmbassadorApplicationEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string ApplicationId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PlatformOrChannel { get; set; } = string.Empty;
    public string AudienceSize { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Status { get; set; } = "Under Review";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

