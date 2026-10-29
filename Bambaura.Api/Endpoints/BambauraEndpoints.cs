using Bambaura.Api.Data;
using Bambaura.Api.Models;
using Bambaura.Api.Services;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace Bambaura.Api.Endpoints;

public static class BambauraEndpoints
{
    private static readonly DateTime StartTimeUtc = DateTime.UtcNow;

    public static WebApplication MapBambauraEndpoints(this WebApplication app)
    {
        // 1. HEALTH & SYSTEM DIAGNOSTICS (CROSS-PLATFORM LINUX & WINDOWS)
        app.MapGet("/api/health", (DatabaseAvailabilityState dbState) =>
        {
            return Results.Ok(new
            {
                status = "Healthy",
                database = dbState.Status,
                dotNetVersion = Environment.Version.ToString(),
                osDescription = RuntimeInformation.OSDescription,
                osArchitecture = RuntimeInformation.OSArchitecture.ToString(),
                machineName = Environment.MachineName,
                uptime = DateTime.UtcNow - StartTimeUtc,
                timestampUtc = DateTime.UtcNow
            });
        })
        .WithName("GetHealth")
        .WithTags("Diagnostics")
        .WithSummary("System health and runtime environment (Windows / Linux / Docker / PostgreSQL)");

        // 2. PRODUCT ENDPOINTS (FLAGSHIP SINGLE PRODUCT & GRAMS)
        var productsGroup = app.MapGroup("/api/products").WithTags("Products");

        productsGroup.MapGet("/", async (IAdminService adminService, IBambauraDataService dataService) =>
        {
            var baseProduct = dataService.GetFlagshipProduct();
            try
            {
                var adminProd = await adminService.GetProductsAsync();
                if (adminProd?.GramVariants?.Any() == true)
                {
                    var updatedVariants = adminProd.GramVariants.Select(v => new GramVariant(
                        v.Grams,
                        v.Label,
                        v.Name,
                        v.Subtext,
                        v.PriceUSD,
                        v.AmazonUSD,
                        v.InStock,
                        v.Popular,
                        v.Image
                    )).ToList();

                    return Results.Ok(baseProduct with { GramVariants = updatedVariants });
                }
            }
            catch
            {
                // Fallback to base
            }
            return Results.Ok(baseProduct);
        })
        .WithName("GetProducts")
        .WithSummary("Retrieves product catalog with live variant pricing and stock availability");

        productsGroup.MapGet("/flagship", async (IAdminService adminService, IBambauraDataService dataService) =>
        {
            var baseProduct = dataService.GetFlagshipProduct();
            try
            {
                var adminProd = await adminService.GetProductsAsync();
                if (adminProd?.GramVariants?.Any() == true)
                {
                    var updatedVariants = adminProd.GramVariants.Select(v => new GramVariant(
                        v.Grams,
                        v.Label,
                        v.Name,
                        v.Subtext,
                        v.PriceUSD,
                        v.AmazonUSD,
                        v.InStock,
                        v.Popular,
                        v.Image
                    )).ToList();

                    return Results.Ok(baseProduct with { GramVariants = updatedVariants });
                }
            }
            catch
            {
                // Fallback to base
            }
            return Results.Ok(baseProduct);
        })
        .WithName("GetFlagshipProduct")
        .WithSummary("Retrieves the single flagship Bambaura 9X Bamboo Roasted Salt specification");

        productsGroup.MapGet("/grams/{grams}", (string grams, IBambauraDataService dataService) =>
        {
            var variant = dataService.GetGramVariant(grams);
            return variant is not null
                ? Results.Ok(variant)
                : Results.NotFound(new { message = $"Gram variant '{grams}' not found." });
        })
        .WithName("GetGramVariant")
        .WithSummary("Retrieves specific gram format details (50g, 100g, 250g, 500g)");

        // 3. REGIONS & CURRENCY EXCHANGE ENDPOINTS
        var regionsGroup = app.MapGroup("/api/regions").WithTags("Regions");

        regionsGroup.MapGet("/", (IBambauraDataService dataService) =>
        {
            var regions = dataService.GetRegions();
            return Results.Ok(regions);
        })
        .WithName("GetRegions")
        .WithSummary("Retrieves supported countries, currencies, and exchange rates");

        regionsGroup.MapGet("/{code}", (string code, IBambauraDataService dataService) =>
        {
            var region = dataService.GetRegion(code);
            return Results.Ok(region);
        })
        .WithName("GetRegionByCode")
        .WithSummary("Retrieves region currency configuration by country code (e.g. US, GB, IN)");

        // 4. CHECKOUT & RAZORPAY INTEGRATION ENDPOINTS
        var checkoutGroup = app.MapGroup("/api/checkout").WithTags("Checkout");

        checkoutGroup.MapPost("/razorpay/create-order", (CreateOrderRequest request, IRazorpayCheckoutService checkoutService) =>
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                return Results.BadRequest(new { message = "Selection bag cannot be empty." });
            }

            var order = checkoutService.CreateOrder(request);
            return Results.Ok(order);
        })
        .WithName("CreateRazorpayOrder")
        .WithSummary("Initializes a new order and prepares Razorpay checkout payload");

        checkoutGroup.MapPost("/razorpay/verify-payment", async (VerifyPaymentRequest request, IRazorpayCheckoutService checkoutService) =>
        {
            try
            {
                var receipt = await checkoutService.VerifyPaymentAsync(request);
                return Results.Ok(receipt);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        })
        .WithName("VerifyRazorpayPayment")
        .WithSummary("Verifies Razorpay payment signature and confirms order receipt");

        checkoutGroup.MapGet("/orders/{orderId}", async (string orderId, IRazorpayCheckoutService checkoutService) =>
        {
            var order = await checkoutService.GetOrderAsync(orderId);
            return order is not null
                ? Results.Ok(order)
                : Results.NotFound(new { message = $"Order '{orderId}' not found." });
        })
        .WithName("GetOrderReceipt")
        .WithSummary("Retrieves confirmed order receipt by Order ID");

        // 5. GOOGLE SSO & AUTHENTICATION ENDPOINTS
        var authGroup = app.MapGroup("/api/auth").WithTags("Authentication");

        authGroup.MapPost("/google-sso", async (GoogleSsoRequest request, IAuthService authService) =>
        {
            var user = await authService.HandleGoogleSsoAsync(request);
            return Results.Ok(user);
        })
        .WithName("GoogleSsoLogin")
        .WithSummary("Authorizes user session via Google SSO");

        authGroup.MapGet("/profile/{userId}", async (string userId, IAuthService authService) =>
        {
            var profile = await authService.GetProfileAsync(userId);
            return Results.Ok(profile);
        })
        .WithName("GetUserProfile")
        .WithSummary("Retrieves patron profile by User ID");

        // 6. CONCIERGE & INQUIRIES ENDPOINTS
        var conciergeGroup = app.MapGroup("/api/concierge").WithTags("Concierge");

        conciergeGroup.MapPost("/inquire", async (ConciergeInquiryRequest request, IBambauraDataService dataService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Message))
            {
                return Results.BadRequest(new { message = "Email and message are required." });
            }

            var response = await dataService.RecordInquiryAsync(request);
            return Results.Ok(response);
        })
        .WithName("SubmitConciergeInquiry")
        .WithSummary("Submits a customer dispatch or wholesale inquiry to the private concierge");

        // 7. AMBASSADOR & AFFILIATE PROGRAM ENDPOINTS
        var affiliateGroup = app.MapGroup("/api/affiliate").WithTags("Affiliate");

        affiliateGroup.MapPost("/calculate", (AffiliateCalculationRequest request, IBambauraDataService dataService) =>
        {
            var result = dataService.CalculateAffiliateCommission(request);
            return Results.Ok(result);
        })
        .WithName("CalculateAffiliateCommission")
        .WithSummary("Computes real-time projected ambassador earnings at 15% tier");

        affiliateGroup.MapPost("/apply", async (AffiliateApplicationRequest request, DatabaseAvailabilityState dbState, BambauraDbContext? db) =>
        {
            var applicationId = $"AMB-APP-{Random.Shared.Next(10000, 99999)}";
            var entity = new AmbassadorApplicationEntity
            {
                Id = $"amb-{Guid.NewGuid():N}",
                ApplicationId = applicationId,
                Name = request.Name,
                Email = request.Email,
                PlatformOrChannel = request.PlatformOrChannel,
                AudienceSize = request.AudienceSize,
                Notes = request.Notes,
                Status = "Under Review",
                CreatedAtUtc = DateTime.UtcNow
            };

            // Instantly register with Admin Nexus
            AdminService.RecordMemoryAmbassador(entity);

            if (dbState.IsAvailable && db != null)
            {
                try
                {
                    await db.AmbassadorApplications.AddAsync(entity);
                    await db.SaveChangesAsync();
                }
                catch
                {
                    // Graceful fallback
                }
            }

            return Results.Ok(new
            {
                applicationId,
                status = "Under Review",
                message = "Thank you for applying to the Bambaura Ambassador Circle. Our partnership director will contact you.",
                appliedAtUtc = DateTime.UtcNow
            });
        })
        .WithName("SubmitAffiliateApplication")
        .WithSummary("Applies to join the Bambaura Creator & Ambassador Program");

        return app;
    }
}

