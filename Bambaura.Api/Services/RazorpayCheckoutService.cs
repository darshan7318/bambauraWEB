using Bambaura.Api.Data;
using Bambaura.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Bambaura.Api.Services;

public interface IRazorpayCheckoutService
{
    RazorpayOrderResponse CreateOrder(CreateOrderRequest request);
    Task<OrderReceipt> VerifyPaymentAsync(VerifyPaymentRequest request);
    Task<OrderReceipt?> GetOrderAsync(string orderId);
}

public class RazorpayCheckoutService : IRazorpayCheckoutService
{
    private readonly IBambauraDataService _dataService;
    private readonly IConfiguration _configuration;
    private readonly BambauraDbContext? _db;
    private readonly DatabaseAvailabilityState _dbState;
    private readonly ILogger<RazorpayCheckoutService> _logger;
    private static readonly Dictionary<string, OrderReceipt> ConfirmedOrders = new(StringComparer.OrdinalIgnoreCase);

    public RazorpayCheckoutService(
        IBambauraDataService dataService,
        IConfiguration configuration,
        ILogger<RazorpayCheckoutService> logger,
        DatabaseAvailabilityState dbState,
        BambauraDbContext? db = null)
    {
        _dataService = dataService;
        _configuration = configuration;
        _logger = logger;
        _dbState = dbState;
        _db = db;
    }

    public RazorpayOrderResponse CreateOrder(CreateOrderRequest request)
    {
        var region = _dataService.GetRegion(request.RegionCode);
        var subtotalUSD = request.Items.Sum(item => item.PriceUSD * item.Quantity);

        // Apply 15% discount if subscription
        if (string.Equals(request.PurchaseType, "subscription", StringComparison.OrdinalIgnoreCase))
        {
            subtotalUSD = Math.Round(subtotalUSD * 0.85m, 2);
        }

        var isFreeShipping = (subtotalUSD * region.ExchangeRate) >= region.FreeShippingThreshold;
        var shippingUSD = isFreeShipping ? 0m : 8m;
        var totalUSD = subtotalUSD + shippingUSD;
        var totalInCurrency = Math.Round(totalUSD * region.ExchangeRate, 2);

        var razorpayKeyId = _configuration["Razorpay:KeyId"] ?? "rzp_test_bambaura_reserve";
        var orderId = $"order_RZP_{Guid.NewGuid().ToString("N")[..14].ToUpper()}";

        return new RazorpayOrderResponse(
            OrderId: orderId,
            RazorpayKeyId: razorpayKeyId,
            AmountInCurrency: totalInCurrency,
            Currency: region.CurrencyCode,
            TotalUSD: totalUSD,
            ShippingFeeUSD: shippingUSD,
            IsFreeShipping: isFreeShipping,
            Customer: request.Customer,
            Items: request.Items,
            CreatedAtUtc: DateTime.UtcNow
        );
    }

    public async Task<OrderReceipt> VerifyPaymentAsync(VerifyPaymentRequest request)
    {
        var region = _dataService.GetRegion(request.RegionCode);
        var keySecret = _configuration["Razorpay:KeySecret"];

        // If a real Razorpay secret is present, verify HMAC-SHA256 signature
        if (!string.IsNullOrEmpty(keySecret) && !string.IsNullOrEmpty(request.RazorpaySignature))
        {
            var payload = $"{request.OrderId}|{request.RazorpayPaymentId}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var generatedSignature = Convert.ToHexStringLower(hash);

            if (!string.Equals(generatedSignature, request.RazorpaySignature, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Invalid Razorpay payment signature.");
            }
        }

        var confirmedId = $"BAMB-9X-{Random.Shared.Next(100000, 999999)}";
        var trackingNumber = $"INSR-{Random.Shared.Next(10000000, 99999999)}";
        var estimatedDelivery = DateTime.UtcNow.AddDays(4).ToString("MMM dd, yyyy");

        var itemsList = request.Items != null && request.Items.Count > 0
            ? request.Items
            : new List<CartItemDto>
            {
                new("bambaura-9x-salt", "Bambaura 9X Himalayan Roasted Salt", "100g", "Coarse Crystals", 24m, 1, "/images/extracted/hi_canister_100g.png")
            };

        var totalUsd = request.TotalUSD ?? itemsList.Sum(i => i.PriceUSD * i.Quantity);
        var totalInCurrency = totalUsd * region.ExchangeRate;

        var customer = request.Customer ?? new CustomerInfo(
            Name: "Honored Patron",
            Email: "patron@bambaura.com",
            Phone: null,
            ShippingAddress: "Bambaura Dedicated Reserve",
            City: region.Name,
            Country: region.Name
        );

        var receipt = new OrderReceipt(
            OrderId: confirmedId,
            PaymentId: request.RazorpayPaymentId,
            Status: "Payment Verified & Order Confirmed",
            PaymentMethod: request.PaymentMethod.ToUpper(),
            TotalAmount: totalInCurrency,
            Currency: region.CurrencyCode,
            FormattedTotal: $"{region.CurrencySymbol}{totalInCurrency:N0}",
            Customer: customer,
            Items: itemsList,
            ConfirmedAtUtc: DateTime.UtcNow,
            TrackingNumber: trackingNumber,
            EstimatedDelivery: estimatedDelivery
        );

        ConfirmedOrders[confirmedId] = receipt;

        var orderEntity = new OrderEntity
        {
            Id = confirmedId,
            RazorpayOrderId = request.OrderId,
            RazorpayPaymentId = request.RazorpayPaymentId,
            Status = "Confirmed",
            PaymentMethod = request.PaymentMethod.ToUpper(),
            TotalAmount = receipt.TotalAmount,
            Currency = receipt.Currency,
            CustomerName = receipt.Customer.Name,
            CustomerEmail = receipt.Customer.Email,
            CustomerPhone = receipt.Customer.Phone,
            ShippingAddress = receipt.Customer.ShippingAddress,
            City = receipt.Customer.City,
            Country = receipt.Customer.Country,
            ItemsJson = JsonSerializer.Serialize(itemsList),
            TrackingNumber = trackingNumber,
            EstimatedDelivery = estimatedDelivery,
            CreatedAtUtc = DateTime.UtcNow
        };

        // Instantly register with Admin Nexus so it immediately appears in the Orders list
        AdminService.RecordMemoryOrder(orderEntity);

        // Persist to PostgreSQL if database context and connection are available
        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                await _db.Orders.AddAsync(orderEntity);
                await _db.SaveChangesAsync();
                _logger.LogInformation("💾 Order {OrderId} saved to PostgreSQL successfully", confirmedId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not persist order to PostgreSQL ({Message}). Using in-memory store.", ex.Message);
            }
        }

        return receipt;
    }

    public async Task<OrderReceipt?> GetOrderAsync(string orderId)
    {
        if (ConfirmedOrders.TryGetValue(orderId, out var cached))
        {
            return cached;
        }

        if (_dbState.IsAvailable && _db != null)
        {
            try
            {
                var entity = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
                if (entity != null)
                {
                    var items = JsonSerializer.Deserialize<List<CartItemDto>>(entity.ItemsJson) ?? new List<CartItemDto>();
                    var region = _dataService.GetRegion(entity.Country ?? "US");
                    var receipt = new OrderReceipt(
                        OrderId: entity.Id,
                        PaymentId: entity.RazorpayPaymentId ?? "PAY_PROCESSED",
                        Status: entity.Status,
                        PaymentMethod: entity.PaymentMethod,
                        TotalAmount: entity.TotalAmount,
                        Currency: entity.Currency,
                        FormattedTotal: $"{region.CurrencySymbol}{entity.TotalAmount:N0}",
                        Customer: new CustomerInfo(
                            Name: entity.CustomerName,
                            Email: entity.CustomerEmail,
                            Phone: entity.CustomerPhone,
                            ShippingAddress: entity.ShippingAddress,
                            City: entity.City,
                            Country: entity.Country
                        ),
                        Items: items,
                        ConfirmedAtUtc: entity.CreatedAtUtc,
                        TrackingNumber: entity.TrackingNumber,
                        EstimatedDelivery: entity.EstimatedDelivery
                    );

                    ConfirmedOrders[orderId] = receipt;
                    return receipt;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Could not read order from PostgreSQL: {Message}", ex.Message);
            }
        }

        return null;
    }
}
