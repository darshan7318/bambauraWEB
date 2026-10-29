using Microsoft.EntityFrameworkCore;

namespace Bambaura.Api.Data;

public class BambauraDbContext : DbContext
{
    public BambauraDbContext(DbContextOptions<BambauraDbContext> options)
        : base(options)
    {
    }

    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<GramVariantEntity> GramVariants => Set<GramVariantEntity>();
    public DbSet<OrderEntity> Orders => Set<OrderEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<InquiryEntity> Inquiries => Set<InquiryEntity>();
    public DbSet<AmbassadorApplicationEntity> AmbassadorApplications => Set<AmbassadorApplicationEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product configuration
        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
            entity.HasMany(e => e.GramVariants)
                  .WithOne()
                  .HasForeignKey(v => v.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // GramVariant configuration
        modelBuilder.Entity<GramVariantEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PriceUSD).HasPrecision(10, 2);
            entity.Property(e => e.AmazonUSD).HasPrecision(10, 2);
            entity.HasIndex(e => new { e.ProductId, e.Grams }).IsUnique();
        });

        // Order configuration
        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalAmount).HasPrecision(12, 2);
            entity.HasIndex(e => e.RazorpayOrderId);
            entity.HasIndex(e => e.CustomerEmail);
            entity.HasIndex(e => e.CreatedAtUtc);
        });

        // User configuration
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.GoogleId);
        });

        // Inquiry configuration
        modelBuilder.Entity<InquiryEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TicketId).IsUnique();
            entity.HasIndex(e => e.Email);
        });

        // Ambassador application configuration
        modelBuilder.Entity<AmbassadorApplicationEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ApplicationId).IsUnique();
            entity.HasIndex(e => e.Email);
        });
    }

    /// <summary>
    /// Initializer that seeds the flagship product and variants into PostgreSQL from product.json
    /// </summary>
    public static async Task SeedInitialDataAsync(BambauraDbContext db, Microsoft.Extensions.Logging.ILogger logger)
    {
        try
        {
            if (!await db.Products.AnyAsync())
            {
                logger.LogInformation("🌱 Seeding Bambaura 9X Flagship Product & Gram Variants from JSON into PostgreSQL...");

                var candidatePaths = new[]
                {
                    Path.Combine(AppContext.BaseDirectory, "Data", "SeedData", "product.json"),
                    Path.Combine(Directory.GetCurrentDirectory(), "Data", "SeedData", "product.json"),
                    Path.Combine(Directory.GetCurrentDirectory(), "Bambaura.Api", "Data", "SeedData", "product.json")
                };

                string? jsonContent = null;
                foreach (var path in candidatePaths)
                {
                    if (File.Exists(path))
                    {
                        jsonContent = await File.ReadAllTextAsync(path);
                        logger.LogInformation("📂 Loaded seed product catalog from: {Path}", path);
                        break;
                    }
                }

                if (!string.IsNullOrWhiteSpace(jsonContent))
                {
                    var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var doc = System.Text.Json.JsonDocument.Parse(jsonContent);
                    var root = doc.RootElement;

                    var flagship = new ProductEntity
                    {
                        Id = root.GetProperty("id").GetString() ?? "bambaura-9x-salt",
                        Name = root.GetProperty("name").GetString() ?? string.Empty,
                        Badge = root.GetProperty("badge").GetString() ?? string.Empty,
                        Tagline = root.GetProperty("tagline").GetString() ?? string.Empty,
                        ShortDescription = root.GetProperty("shortDescription").GetString() ?? string.Empty,
                        Rating = root.TryGetProperty("rating", out var rVal) ? rVal.GetDecimal() : 4.96m,
                        ReviewsCount = root.TryGetProperty("reviewsCount", out var rcVal) ? rcVal.GetInt32() : 489,
                        AmazonLinkUS = root.TryGetProperty("amazonLinks", out var amz) && amz.TryGetProperty("US", out var u) ? u.GetString() ?? "" : "",
                        AmazonLinkUK = root.TryGetProperty("amazonLinks", out var amz2) && amz2.TryGetProperty("UK", out var uk) ? uk.GetString() ?? "" : ""
                    };

                    await db.Products.AddAsync(flagship);
                    await db.SaveChangesAsync();

                    if (root.TryGetProperty("gramVariants", out var variantsArray) && variantsArray.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        var variants = new List<GramVariantEntity>();
                        foreach (var v in variantsArray.EnumerateArray())
                        {
                            var grams = v.GetProperty("grams").GetString() ?? "";
                            variants.Add(new GramVariantEntity
                            {
                                Id = $"var-{grams}",
                                ProductId = flagship.Id,
                                Grams = grams,
                                Label = v.TryGetProperty("label", out var l) ? l.GetString() ?? "" : "",
                                Name = v.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
                                Subtext = v.TryGetProperty("subtext", out var s) ? s.GetString() ?? "" : "",
                                PriceUSD = v.TryGetProperty("priceUSD", out var p) ? p.GetDecimal() : 0m,
                                AmazonUSD = v.TryGetProperty("amazonUSD", out var a) ? a.GetDecimal() : 0m,
                                InStock = !v.TryGetProperty("inStock", out var stock) || stock.GetBoolean(),
                                Popular = v.TryGetProperty("popular", out var pop) && pop.GetBoolean(),
                                Image = v.TryGetProperty("image", out var img) ? img.GetString() ?? "" : ""
                            });
                        }

                        if (variants.Count > 0)
                        {
                            await db.GramVariants.AddRangeAsync(variants);
                            await db.SaveChangesAsync();
                        }
                    }

                    logger.LogInformation("✅ Bambaura 9X Database seeded successfully from product.json!");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning("⚠️ Database seeding encountered a non-fatal warning: {Message}", ex.Message);
        }
    }
}

