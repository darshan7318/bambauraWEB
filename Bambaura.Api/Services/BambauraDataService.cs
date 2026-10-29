using Bambaura.Api.Data;
using Bambaura.Api.Models;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Bambaura.Api.Services;

public interface IBambauraDataService
{
    FlagshipProduct GetFlagshipProduct();
    GramVariant? GetGramVariant(string grams);
    IReadOnlyDictionary<string, RegionConfig> GetRegions();
    RegionConfig GetRegion(string code);
    Task<ConciergeInquiryResponse> RecordInquiryAsync(ConciergeInquiryRequest request);
    AffiliateCalculationResponse CalculateAffiliateCommission(AffiliateCalculationRequest request);
}

public class BambauraDataService : IBambauraDataService
{
    private static readonly ConcurrentBag<ConciergeInquiryRequest> FallbackInquiries = new();
    private readonly BambauraDbContext? _db;
    private readonly DatabaseAvailabilityState _dbState;
    private readonly ILogger<BambauraDataService> _logger;

    private static FlagshipProduct? _cachedProduct;
    private static Dictionary<string, RegionConfig>? _cachedRegions;
    private static readonly object _lock = new();

    public BambauraDataService(
        ILogger<BambauraDataService> logger,
        DatabaseAvailabilityState dbState,
        BambauraDbContext? db = null)
    {
        _logger = logger;
        _dbState = dbState;
        _db = db;
        EnsureDataLoaded();
    }

    private void EnsureDataLoaded()
    {
        if (_cachedProduct != null && _cachedRegions != null) return;

        lock (_lock)
        {
            _cachedProduct ??= LoadProductFromJson();
            _cachedRegions ??= LoadRegionsFromJson();
        }
    }

    private FlagshipProduct LoadProductFromJson()
    {
        var candidatePaths = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "Data", "SeedData", "product.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Data", "SeedData", "product.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Bambaura.Api", "Data", "SeedData", "product.json")
        };

        foreach (var p in candidatePaths)
        {
            if (File.Exists(p))
            {
                try
                {
                    var json = File.ReadAllText(p);
                    var prod = JsonSerializer.Deserialize<FlagshipProduct>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (prod != null)
                    {
                        _logger.LogInformation("📂 Loaded flagship product catalog from JSON: {Path}", p);
                        return prod;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("⚠️ Could not parse product.json at {Path}: {Message}", p, ex.Message);
                }
            }
        }

        _logger.LogWarning("⚠️ product.json not found in candidate paths. Using fallback instance.");
        return FallbackProduct;
    }

    private Dictionary<string, RegionConfig> LoadRegionsFromJson()
    {
        var candidatePaths = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "Data", "SeedData", "regions.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Data", "SeedData", "regions.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Bambaura.Api", "Data", "SeedData", "regions.json")
        };

        foreach (var p in candidatePaths)
        {
            if (File.Exists(p))
            {
                try
                {
                    var json = File.ReadAllText(p);
                    var regions = JsonSerializer.Deserialize<Dictionary<string, RegionConfig>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (regions != null)
                    {
                        _logger.LogInformation("📂 Loaded regions configuration from JSON: {Path}", p);
                        return new Dictionary<string, RegionConfig>(regions, StringComparer.OrdinalIgnoreCase);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("⚠️ Could not parse regions.json at {Path}: {Message}", p, ex.Message);
                }
            }
        }

        _logger.LogWarning("⚠️ regions.json not found in candidate paths. Using fallback instance.");
        return new Dictionary<string, RegionConfig>(FallbackRegions, StringComparer.OrdinalIgnoreCase);
    }

    public FlagshipProduct GetFlagshipProduct()
    {
        EnsureDataLoaded();
        return _cachedProduct ?? FallbackProduct;
    }

    public GramVariant? GetGramVariant(string grams)
    {
        EnsureDataLoaded();
        var prod = _cachedProduct ?? FallbackProduct;
        return prod.GramVariants.FirstOrDefault(g => string.Equals(g.Grams, grams, StringComparison.OrdinalIgnoreCase));
    }

    public IReadOnlyDictionary<string, RegionConfig> GetRegions()
    {
        EnsureDataLoaded();
        return _cachedRegions ?? FallbackRegions;
    }

    public RegionConfig GetRegion(string code)
    {
        EnsureDataLoaded();
        var regions = _cachedRegions ?? FallbackRegions;
        return regions.TryGetValue(code, out var region) ? region : regions["US"];
    }

    private static readonly FlagshipProduct FallbackProduct = new(
        Id: "bambaura-9x-salt",
        Name: "Bambaura 9X Himalayan Roasted Bamboo Salt",
        Badge: "Imperial 9-Stage Alchemy",
        Tagline: "Hand-packed in giant mountain bamboo & fired 9 times at 1,500°C over natural pine wood.",
        ShortDescription: "The world’s most potent bio-active mineral salt. Fired through 9 iterative cycles in mountain bamboo sealed with yellow clay, neutralizing acidic toxicity while enriching with -400 mV ORP antioxidant power and pH 10.5+ alkalinity.",
        Rating: 4.96m,
        ReviewsCount: 489,
        GramVariants: new List<GramVariant>
        {
            new("50g", "50 g", "50 g — Discovery Flask", "Pocket travel tin for pure hydration & tabletop tasting", 15m, 28m, true, false, "/images/extracted/hi_salt_bowl.png"),
            new("100g", "100 g", "100 g — Signature Cylinder Canister", "Iconic gold foil-embossed cylinder with barrier pouch (Most Popular)", 24m, 45m, true, true, "/images/extracted/hi_canister_100g.png"),
            new("250g", "250 g", "250 g — Chef’s Reserve Canister", "Generous culinary cylinder for passionate home chefs & families", 42m, 90m, true, false, "/images/extracted/hi_canister_250g.png"),
            new("500g", "500 g", "500 g — Eco Master Kitchen Refill Pouch", "Triple-barrier nitrogen-sealed gold pouch. Best value (Save 25%)", 68m, 145m, true, false, "/images/extracted/hi_pouch_gold.png")
        },
        GrindVariants: new List<GrindVariant>
        {
            new("coarse", "Coarse Crystals", "Crisp Finishing Crystals", "Prismatic jewel-like crystals delivering an explosive burst of minerality and crunchy finish. Perfect for prime steaks, grilled greens, artisan bread, and finishing salts."),
            new("fine", "Fine Powder", "Silky Dissolving Powder", "Micro-ground velvet powder that dissolves instantly. Crafted for delicate salad vinaigrettes, broths, baking, and morning warm lemon-alkaline hydration elixirs.")
        },
        Gallery: new List<GalleryItem>
        {
            new("/images/extracted/hi_canister_100g.png", "100g Signature Canister", "canister"),
            new("/images/extracted/hi_canister_250g.png", "250g Chef Reserve", "canister"),
            new("/images/extracted/hi_pouch_gold.png", "Freshness Barrier Gold Pouch", "pouch"),
            new("/images/extracted/hi_salt_bowl.png", "Purple Roasted Finishing Crystals", "crystals"),
            new("/images/extracted/step_4_clean.png", "Velvet Crystal Texture", "detail"),
            new("/images/extracted/hi_packaging_combo.png", "Full Packaging Experience", "package")
        },
        AmazonLinks: new Dictionary<string, string>
        {
            ["US"] = "https://www.amazon.com/s?k=bambaura+bamboo+salt",
            ["UK"] = "https://www.amazon.co.uk/s?k=bambaura+bamboo+salt"
        }
    );

    private static readonly Dictionary<string, RegionConfig> FallbackRegions = new(StringComparer.OrdinalIgnoreCase)
    {
        ["US"] = new("US", "United States", "🇺🇸", "USD", "$", 1.0m, 50m, "amazon.com"),
        ["GB"] = new("GB", "United Kingdom", "🇬🇧", "GBP", "£", 0.8m, 40m, "amazon.co.uk"),
        ["IN"] = new("IN", "India", "🇮🇳", "INR", "₹", 40.0m, 999m, "amazon.in"),
        ["CA"] = new("CA", "Canada", "🇨🇦", "CAD", "C$", 1.35m, 70m, "amazon.ca"),
        ["AU"] = new("AU", "Australia", "🇦🇺", "AUD", "A$", 1.5m, 75m, "amazon.com.au"),
        ["AE"] = new("AE", "United Arab Emirates", "🇦🇪", "AED", "د.إ", 3.67m, 180m, "amazon.ae"),
        ["EU"] = new("EU", "European Union", "🇪🇺", "EUR", "€", 0.92m, 45m, "amazon.de")
    };

    public async Task<ConciergeInquiryResponse> RecordInquiryAsync(ConciergeInquiryRequest request)
    {
        var ticket = $"TKT-BAMB-{Random.Shared.Next(100000, 999999)}";
        var entity = new InquiryEntity
        {
            Id = $"inq-{Guid.NewGuid():N}",
            TicketId = ticket,
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            Phone = request.Phone,
            Status = "Received",
            CreatedAtUtc = DateTime.UtcNow
        };

        // Instantly register with Admin Nexus
        AdminService.RecordMemoryInquiry(entity);

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                await _db.Inquiries.AddAsync(entity);
                await _db.SaveChangesAsync();
                _logger.LogInformation("💾 Saved inquiry {TicketId} to PostgreSQL", ticket);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not persist inquiry to PostgreSQL ({Message}). Using in-memory fallback.", ex.Message);
                FallbackInquiries.Add(request);
            }
        }
        else
        {
            FallbackInquiries.Add(request);
        }

        return new ConciergeInquiryResponse(
            TicketId: ticket,
            Status: "Received",
            Message: "Thank you for contacting the Bambaura Concierge. A senior cellar officer will review your dispatch.",
            ReceivedAtUtc: DateTime.UtcNow
        );
    }

    public AffiliateCalculationResponse CalculateAffiliateCommission(AffiliateCalculationRequest request)
    {
        var referrals = Math.Max(1, request.MonthlyReferrals);
        var avgOrder = Math.Max(10, request.AverageOrderUSD);
        var monthlyVolume = referrals * avgOrder;
        var monthlyCommission = Math.Round(monthlyVolume * 0.15m, 2);
        var annualCommission = monthlyCommission * 12;

        return new AffiliateCalculationResponse(
            MonthlyReferrals: referrals,
            AverageOrderUSD: avgOrder,
            MonthlyGrossVolumeUSD: monthlyVolume,
            MonthlyCommissionUSD: monthlyCommission,
            AnnualCommissionUSD: annualCommission,
            CommissionRatePercent: 15.0m
        );
    }
}

