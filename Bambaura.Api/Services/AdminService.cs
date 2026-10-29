using Bambaura.Api.Data;
using Bambaura.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace Bambaura.Api.Services;

public interface IAdminService
{
    AdminLoginResponse VerifyLogin(string passcode);
    Task<AdminDashboardStats> GetDashboardStatsAsync();
    Task<ProductEntity> GetProductsAsync();
    Task<GramVariantEntity?> UpdateGramVariantAsync(string grams, UpdateGramVariantRequest request);
    Task<List<OrderEntity>> GetOrdersAsync();
    Task<OrderEntity?> UpdateOrderStatusAsync(string orderId, UpdateOrderStatusRequest request);
    Task<List<InquiryEntity>> GetInquiriesAsync();
    Task<InquiryEntity?> UpdateInquiryStatusAsync(string ticketId, string status);
    Task<List<AmbassadorApplicationEntity>> GetAmbassadorsAsync();
    Task<AmbassadorApplicationEntity?> UpdateAmbassadorStatusAsync(string applicationId, string status);
}

public class AdminService : IAdminService
{
    private static readonly DateTime AppStartTime = DateTime.UtcNow;
    private readonly BambauraDbContext? _db;
    private readonly DatabaseAvailabilityState _dbState;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminService> _logger;

    // Resilient in-memory fallbacks when PostgreSQL is offline in local development
    private static readonly List<GramVariantEntity> MemoryVariants = new()
    {
        new() { Id = "var-50g", ProductId = "bambaura-9x-salt", Grams = "50g", Label = "50 g", Name = "50 g — Discovery Flask", Subtext = "Pocket travel tin for pure hydration & tabletop tasting", PriceUSD = 15m, AmazonUSD = 28m, InStock = true, Popular = false, Image = "/images/extracted/hi_salt_bowl.png" },
        new() { Id = "var-100g", ProductId = "bambaura-9x-salt", Grams = "100g", Label = "100 g", Name = "100 g — Signature Cylinder Canister", Subtext = "Iconic gold foil-embossed cylinder with barrier pouch (Most Popular)", PriceUSD = 24m, AmazonUSD = 45m, InStock = true, Popular = true, Image = "/images/extracted/hi_canister_100g.png" },
        new() { Id = "var-250g", ProductId = "bambaura-9x-salt", Grams = "250g", Label = "250 g", Name = "250 g — Chef's Reserve Canister", Subtext = "Generous culinary cylinder for passionate home chefs & families", PriceUSD = 42m, AmazonUSD = 90m, InStock = true, Popular = false, Image = "/images/extracted/hi_canister_250g.png" },
        new() { Id = "var-500g", ProductId = "bambaura-9x-salt", Grams = "500g", Label = "500 g", Name = "500 g — Eco Master Kitchen Refill Pouch", Subtext = "Triple-barrier nitrogen-sealed gold pouch. Best value (Save 25%)", PriceUSD = 68m, AmazonUSD = 145m, InStock = true, Popular = false, Image = "/images/extracted/hi_pouch_gold.png" }
    };

    private static readonly List<OrderEntity> MemoryOrders = new()
    {
        new()
        {
            Id = "BAMB-9X-841920",
            RazorpayOrderId = "order_RZP_TEST841920",
            RazorpayPaymentId = "pay_BAMB_9921",
            Status = "Confirmed",
            PaymentMethod = "CARD",
            TotalAmount = 32.00m,
            Currency = "USD",
            CustomerName = "Chef Marcus Harrison",
            CustomerEmail = "marcus.harrison@michelin.com",
            CustomerPhone = "+1 212 555 0192",
            ShippingAddress = "742 Evergreen Terrace",
            City = "New York",
            Country = "United States",
            ItemsJson = "[{\"productId\":\"bambaura-9x-salt\",\"title\":\"Bambaura 9X Bamboo Salt\",\"grams\":\"100g\",\"grind\":\"Coarse Crystals\",\"priceUSD\":24,\"quantity\":1,\"image\":\"/images/extracted/hi_canister_100g.png\"}]",
            TrackingNumber = "INSR-84920194",
            EstimatedDelivery = "Oct 28, 2026",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
        },
        new()
        {
            Id = "BAMB-9X-728103",
            RazorpayOrderId = "order_RZP_TEST728103",
            RazorpayPaymentId = "pay_BAMB_4812",
            Status = "Shipped",
            PaymentMethod = "UPI",
            TotalAmount = 42.00m,
            Currency = "USD",
            CustomerName = "Aria Chen",
            CustomerEmail = "aria.chen@wellness.org",
            CustomerPhone = "+1 415 555 8392",
            ShippingAddress = "88 Pine Crest Way",
            City = "San Francisco",
            Country = "United States",
            ItemsJson = "[{\"productId\":\"bambaura-9x-salt\",\"title\":\"Bambaura 9X Bamboo Salt\",\"grams\":\"250g\",\"grind\":\"Fine Powder\",\"priceUSD\":42,\"quantity\":1,\"image\":\"/images/extracted/hi_canister_250g.png\"}]",
            TrackingNumber = "INSR-39201948",
            EstimatedDelivery = "Oct 27, 2026",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-14)
        }
    };

    public static void RecordMemoryOrder(OrderEntity order)
    {
        lock (MemoryOrders)
        {
            MemoryOrders.RemoveAll(o => o.Id == order.Id);
            MemoryOrders.Insert(0, order);
        }
    }

    public static void RecordMemoryInquiry(InquiryEntity inquiry)
    {
        lock (MemoryInquiries)
        {
            MemoryInquiries.RemoveAll(i => i.TicketId == inquiry.TicketId);
            MemoryInquiries.Insert(0, inquiry);
        }
    }

    public static void RecordMemoryAmbassador(AmbassadorApplicationEntity amb)
    {
        lock (MemoryAmbassadors)
        {
            MemoryAmbassadors.RemoveAll(a => a.ApplicationId == amb.ApplicationId);
            MemoryAmbassadors.Insert(0, amb);
        }
    }

    private static readonly List<InquiryEntity> MemoryInquiries = new()
    {
        new()
        {
            Id = "inq-101",
            TicketId = "TKT-BAMB-392104",
            Name = "Chef David Vance",
            Email = "david@vance-steaks.com",
            Subject = "Wholesale Michelin Reserve Supply",
            Message = "We are opening an omakase steakhouse and require 10kg monthly allocations of the 9X Coarse Crystals. Please advise wholesale terms.",
            Phone = "+1 312 555 8920",
            Status = "In Review",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-5)
        },
        new()
        {
            Id = "inq-102",
            TicketId = "TKT-BAMB-481920",
            Name = "Dr. Elena Rostova",
            Email = "elena.rostova@naturopathy.de",
            Subject = "ORP Analysis Certificate Request",
            Message = "Could you dispatch the certified laboratory third-party ORP analysis report showing -400 mV redox potential for clinical wellness evaluation?",
            Phone = "+49 30 555 921",
            Status = "Received",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-18)
        }
    };

    private static readonly List<AmbassadorApplicationEntity> MemoryAmbassadors = new()
    {
        new()
        {
            Id = "amb-101",
            ApplicationId = "AMB-APP-49210",
            Name = "Julian Thorne (The Salt Sommelier)",
            Email = "julian@saltsommelier.tv",
            PlatformOrChannel = "Instagram & YouTube",
            AudienceSize = "240,000 Culinary Enthusiasts",
            Notes = "Focusing on finishing salt comparisons with fleur de sel and Maldon. Eager to feature 9X bamboo salt.",
            Status = "Under Review",
            CreatedAtUtc = DateTime.UtcNow.AddDays(-1)
        }
    };

    public AdminService(
        IConfiguration configuration,
        ILogger<AdminService> logger,
        DatabaseAvailabilityState dbState,
        BambauraDbContext? db = null)
    {
        _configuration = configuration;
        _logger = logger;
        _dbState = dbState;
        _db = db;
    }

    public AdminLoginResponse VerifyLogin(string passcode)
    {
        var masterPasscode = _configuration["Admin:Passcode"] ?? "bambaura2026";
        if (string.Equals(passcode?.Trim(), masterPasscode, StringComparison.Ordinal))
        {
            var token = $"adm_token_{Guid.NewGuid():N}";
            return new AdminLoginResponse(true, token, "Authenticated successfully as Bambaura Cellar Master.");
        }

        return new AdminLoginResponse(false, string.Empty, "Invalid administrator passcode.");
    }

    public async Task<AdminDashboardStats> GetDashboardStatsAsync()
    {
        int ordersCount;
        decimal totalRevenue;
        int inquiriesCount;
        int ambassadorsCount;
        int variantsCount;

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                ordersCount = await _db.Orders.CountAsync();
                totalRevenue = await _db.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;
                inquiriesCount = await _db.Inquiries.CountAsync();
                ambassadorsCount = await _db.AmbassadorApplications.CountAsync();
                variantsCount = await _db.GramVariants.CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not fetch stats from DB: {Message}. Using memory fallback.", ex.Message);
                ordersCount = MemoryOrders.Count;
                totalRevenue = MemoryOrders.Sum(o => o.TotalAmount);
                inquiriesCount = MemoryInquiries.Count;
                ambassadorsCount = MemoryAmbassadors.Count;
                variantsCount = MemoryVariants.Count;
            }
        }
        else
        {
            ordersCount = MemoryOrders.Count;
            totalRevenue = MemoryOrders.Sum(o => o.TotalAmount);
            inquiriesCount = MemoryInquiries.Count;
            ambassadorsCount = MemoryAmbassadors.Count;
            variantsCount = MemoryVariants.Count;
        }

        return new AdminDashboardStats(
            TotalOrders: ordersCount,
            TotalRevenueUSD: totalRevenue,
            TotalInquiries: inquiriesCount,
            TotalAmbassadors: ambassadorsCount,
            TotalVariants: variantsCount,
            DatabaseStatus: _dbState.Status,
            Uptime: DateTime.UtcNow - AppStartTime,
            ServerTimeUtc: DateTime.UtcNow
        );
    }

    public async Task<ProductEntity> GetProductsAsync()
    {
        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var product = await _db.Products
                    .Include(p => p.GramVariants)
                    .FirstOrDefaultAsync(p => p.Id == "bambaura-9x-salt");

                if (product != null && product.GramVariants.Any())
                {
                    return product;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not load products from DB: {Message}", ex.Message);
            }
        }

        return new ProductEntity
        {
            Id = "bambaura-9x-salt",
            Name = "Bambaura 9X Himalayan Roasted Bamboo Salt",
            Badge = "Imperial 9-Stage Alchemy",
            Tagline = "Hand-packed in giant mountain bamboo & fired 9 times at 1,500°C over natural pine wood.",
            ShortDescription = "The world’s most potent bio-active mineral salt. Fired through 9 iterative cycles in mountain bamboo sealed with yellow clay, neutralizing acidic toxicity while enriching with -400 mV ORP antioxidant power and pH 10.5+ alkalinity.",
            Rating = 4.96m,
            ReviewsCount = 489,
            AmazonLinkUS = "https://www.amazon.com/s?k=bambaura+bamboo+salt",
            AmazonLinkUK = "https://www.amazon.co.uk/s?k=bambaura+bamboo+salt",
            GramVariants = MemoryVariants
        };
    }

    public async Task<GramVariantEntity?> UpdateGramVariantAsync(string grams, UpdateGramVariantRequest request)
    {
        // Update in-memory fallback
        var memVariant = MemoryVariants.FirstOrDefault(v => string.Equals(v.Grams, grams, StringComparison.OrdinalIgnoreCase));
        if (memVariant != null)
        {
            if (!string.IsNullOrWhiteSpace(request.Name)) memVariant.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Subtext)) memVariant.Subtext = request.Subtext;
            if (request.PriceUSD > 0) memVariant.PriceUSD = request.PriceUSD;
            if (request.AmazonUSD > 0) memVariant.AmazonUSD = request.AmazonUSD;
            memVariant.InStock = request.InStock;
            memVariant.Popular = request.Popular;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbVariant = await _db.GramVariants.FirstOrDefaultAsync(v => v.Grams.ToLower() == grams.ToLower());
                if (dbVariant != null)
                {
                    if (!string.IsNullOrWhiteSpace(request.Name)) dbVariant.Name = request.Name;
                    if (!string.IsNullOrWhiteSpace(request.Subtext)) dbVariant.Subtext = request.Subtext;
                    if (request.PriceUSD > 0) dbVariant.PriceUSD = request.PriceUSD;
                    if (request.AmazonUSD > 0) dbVariant.AmazonUSD = request.AmazonUSD;
                    dbVariant.InStock = request.InStock;
                    dbVariant.Popular = request.Popular;
                    await _db.SaveChangesAsync();
                    _logger.LogInformation("💾 Updated variant {Grams} in PostgreSQL", grams);
                    return dbVariant;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not update variant in DB: {Message}", ex.Message);
            }
        }

        return memVariant;
    }

    public async Task<List<OrderEntity>> GetOrdersAsync()
    {
        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbOrders = await _db.Orders
                    .OrderByDescending(o => o.CreatedAtUtc)
                    .ToListAsync();

                if (dbOrders.Any())
                {
                    return dbOrders;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not fetch orders from DB: {Message}", ex.Message);
            }
        }

        return MemoryOrders;
    }

    public async Task<OrderEntity?> UpdateOrderStatusAsync(string orderId, UpdateOrderStatusRequest request)
    {
        var memOrder = MemoryOrders.FirstOrDefault(o => string.Equals(o.Id, orderId, StringComparison.OrdinalIgnoreCase));
        if (memOrder != null)
        {
            memOrder.Status = request.Status;
            if (!string.IsNullOrWhiteSpace(request.TrackingNumber)) memOrder.TrackingNumber = request.TrackingNumber;
            if (!string.IsNullOrWhiteSpace(request.EstimatedDelivery)) memOrder.EstimatedDelivery = request.EstimatedDelivery;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbOrder = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
                if (dbOrder != null)
                {
                    dbOrder.Status = request.Status;
                    if (!string.IsNullOrWhiteSpace(request.TrackingNumber)) dbOrder.TrackingNumber = request.TrackingNumber;
                    if (!string.IsNullOrWhiteSpace(request.EstimatedDelivery)) dbOrder.EstimatedDelivery = request.EstimatedDelivery;
                    await _db.SaveChangesAsync();
                    _logger.LogInformation("💾 Updated order {OrderId} status to {Status}", orderId, request.Status);
                    return dbOrder;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not update order in DB: {Message}", ex.Message);
            }
        }

        return memOrder;
    }

    public async Task<List<InquiryEntity>> GetInquiriesAsync()
    {
        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbInquiries = await _db.Inquiries
                    .OrderByDescending(i => i.CreatedAtUtc)
                    .ToListAsync();

                if (dbInquiries.Any())
                {
                    return dbInquiries;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not fetch inquiries from DB: {Message}", ex.Message);
            }
        }

        return MemoryInquiries;
    }

    public async Task<InquiryEntity?> UpdateInquiryStatusAsync(string ticketId, string status)
    {
        var memInquiry = MemoryInquiries.FirstOrDefault(i => string.Equals(i.TicketId, ticketId, StringComparison.OrdinalIgnoreCase));
        if (memInquiry != null)
        {
            memInquiry.Status = status;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbInquiry = await _db.Inquiries.FirstOrDefaultAsync(i => i.TicketId == ticketId);
                if (dbInquiry != null)
                {
                    dbInquiry.Status = status;
                    await _db.SaveChangesAsync();
                    return dbInquiry;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not update inquiry in DB: {Message}", ex.Message);
            }
        }

        return memInquiry;
    }

    public async Task<List<AmbassadorApplicationEntity>> GetAmbassadorsAsync()
    {
        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbAmbassadors = await _db.AmbassadorApplications
                    .OrderByDescending(a => a.CreatedAtUtc)
                    .ToListAsync();

                if (dbAmbassadors.Any())
                {
                    return dbAmbassadors;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not fetch ambassadors from DB: {Message}", ex.Message);
            }
        }

        return MemoryAmbassadors;
    }

    public async Task<AmbassadorApplicationEntity?> UpdateAmbassadorStatusAsync(string applicationId, string status)
    {
        var memAmb = MemoryAmbassadors.FirstOrDefault(a => string.Equals(a.ApplicationId, applicationId, StringComparison.OrdinalIgnoreCase));
        if (memAmb != null)
        {
            memAmb.Status = status;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var dbAmb = await _db.AmbassadorApplications.FirstOrDefaultAsync(a => a.ApplicationId == applicationId);
                if (dbAmb != null)
                {
                    dbAmb.Status = status;
                    await _db.SaveChangesAsync();
                    return dbAmb;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not update ambassador in DB: {Message}", ex.Message);
            }
        }

        return memAmb;
    }
}

