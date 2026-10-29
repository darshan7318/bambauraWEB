using Bambaura.Api.Models;
using Bambaura.Api.Services;

namespace Bambaura.Api.Endpoints;

public static class AdminEndpoints
{
    public static WebApplication MapAdminEndpoints(this WebApplication app)
    {
        var adminGroup = app.MapGroup("/api/admin").WithTags("Admin Portal");

        // 1. Admin Authentication
        adminGroup.MapPost("/auth/login", (AdminLoginRequest request, IAdminService adminService) =>
        {
            var result = adminService.VerifyLogin(request.Passcode);
            return result.Success
                ? Results.Ok(result)
                : Results.Json(result, statusCode: 401);
        })
        .WithName("AdminLogin")
        .WithSummary("Authenticates store administrator using master passcode");

        // 2. Dashboard KPIs & Overview Stats
        adminGroup.MapGet("/stats", async (IAdminService adminService) =>
        {
            var stats = await adminService.GetDashboardStatsAsync();
            return Results.Ok(stats);
        })
        .WithName("GetAdminStats")
        .WithSummary("Retrieves aggregated dashboard statistics and system health");

        // 3. Products & Variants Management
        adminGroup.MapGet("/products", async (IAdminService adminService) =>
        {
            var products = await adminService.GetProductsAsync();
            return Results.Ok(products);
        })
        .WithName("GetAdminProducts")
        .WithSummary("Retrieves product catalog with all gram variants for editing");

        adminGroup.MapPut("/products/variants/{grams}", async (string grams, UpdateGramVariantRequest request, IAdminService adminService) =>
        {
            var updated = await adminService.UpdateGramVariantAsync(grams, request);
            return updated is not null
                ? Results.Ok(updated)
                : Results.NotFound(new { message = $"Variant '{grams}' not found." });
        })
        .WithName("UpdateGramVariant")
        .WithSummary("Updates pricing, stock availability, and badge for a specific gram format");

        // 4. Orders Management
        adminGroup.MapGet("/orders", async (IAdminService adminService) =>
        {
            var orders = await adminService.GetOrdersAsync();
            return Results.Ok(orders);
        })
        .WithName("GetAdminOrders")
        .WithSummary("Retrieves all customer orders sorted by recency");

        adminGroup.MapPut("/orders/{orderId}/status", async (string orderId, UpdateOrderStatusRequest request, IAdminService adminService) =>
        {
            var updated = await adminService.UpdateOrderStatusAsync(orderId, request);
            return updated is not null
                ? Results.Ok(updated)
                : Results.NotFound(new { message = $"Order '{orderId}' not found." });
        })
        .WithName("UpdateOrderStatus")
        .WithSummary("Updates order fulfillment status, tracking number, and delivery date");

        // 5. Concierge & Customer Inquiries
        adminGroup.MapGet("/inquiries", async (IAdminService adminService) =>
        {
            var inquiries = await adminService.GetInquiriesAsync();
            return Results.Ok(inquiries);
        })
        .WithName("GetAdminInquiries")
        .WithSummary("Retrieves customer and wholesale concierge dispatches");

        adminGroup.MapPut("/inquiries/{ticketId}/status", async (string ticketId, UpdateInquiryStatusRequest request, IAdminService adminService) =>
        {
            var updated = await adminService.UpdateInquiryStatusAsync(ticketId, request.Status);
            return updated is not null
                ? Results.Ok(updated)
                : Results.NotFound(new { message = $"Inquiry '{ticketId}' not found." });
        })
        .WithName("UpdateInquiryStatus")
        .WithSummary("Updates concierge inquiry processing status");

        // 6. Creator & Ambassador Applications
        adminGroup.MapGet("/ambassadors", async (IAdminService adminService) =>
        {
            var ambassadors = await adminService.GetAmbassadorsAsync();
            return Results.Ok(ambassadors);
        })
        .WithName("GetAdminAmbassadors")
        .WithSummary("Retrieves all ambassador and creator circle applications");

        adminGroup.MapPut("/ambassadors/{applicationId}/status", async (string applicationId, UpdateAmbassadorStatusRequest request, IAdminService adminService) =>
        {
            var updated = await adminService.UpdateAmbassadorStatusAsync(applicationId, request.Status);
            return updated is not null
                ? Results.Ok(updated)
                : Results.NotFound(new { message = $"Application '{applicationId}' not found." });
        })
        .WithName("UpdateAmbassadorStatus")
        .WithSummary("Approves, reviews, or declines ambassador applications");

        return app;
    }
}

