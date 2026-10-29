namespace Bambaura.Api.Models;

public record GramVariant(
    string Grams,
    string Label,
    string Name,
    string Subtext,
    decimal PriceUSD,
    decimal AmazonUSD,
    bool InStock,
    bool Popular,
    string Image
);

public record GrindVariant(
    string Id,
    string Title,
    string Subtitle,
    string Description
);

public record GalleryItem(
    string Src,
    string Title,
    string Type
);

public record FlagshipProduct(
    string Id,
    string Name,
    string Badge,
    string Tagline,
    string ShortDescription,
    decimal Rating,
    int ReviewsCount,
    List<GramVariant> GramVariants,
    List<GrindVariant> GrindVariants,
    List<GalleryItem> Gallery,
    Dictionary<string, string> AmazonLinks
);

public record RegionConfig(
    string Code,
    string Name,
    string Flag,
    string CurrencyCode,
    string CurrencySymbol,
    decimal ExchangeRate,
    decimal FreeShippingThreshold,
    string AmazonDomain
);

