using Acervo.Domain.Shared;

namespace Acervo.Domain.Contents;

public sealed class ReferenceLink
{
    private static readonly string[] AllowedSchemes = [Uri.UriSchemeHttp, Uri.UriSchemeHttps];

    private ReferenceLink()
    {
        Url = null!;
    }

    public Guid Id { get; private set; }
    public Guid ContentId { get; private set; }
    public string Url { get; private set; }
    public string? Label { get; private set; }
    public int Position { get; private set; }

    public static ReferenceLink Create(string? url, string? label)
    {
        return new ReferenceLink
        {
            Id = Guid.CreateVersion7(),
            Url = CleanUrl(url),
            Label = CleanLabel(label)
        };
    }

    internal void MoveTo(int position) => Position = position;

    private static string CleanUrl(string? url)
    {
        var cleanUrl = (url ?? string.Empty).Trim();

        var isValid = Uri.TryCreate(cleanUrl, UriKind.Absolute, out var uri)
                      && AllowedSchemes.Contains(uri.Scheme);

        if (!isValid)
            throw new DomainException("url", "Informe uma URL completa, começando com http:// ou https://.");

        return cleanUrl;
    }

    private static string? CleanLabel(string? label)
    {
        var cleanLabel = (label ?? string.Empty).Trim();

        if (cleanLabel.Length == 0)
            return null;

        if (cleanLabel.Length > ContentRules.LinkLabelMaxLength)
            throw new DomainException("label",
                $"O rótulo deve ter até {ContentRules.LinkLabelMaxLength} caracteres.");

        return cleanLabel;
    }
}
