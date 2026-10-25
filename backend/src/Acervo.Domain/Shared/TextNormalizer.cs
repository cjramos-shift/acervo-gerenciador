using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Acervo.Domain.Shared;

public static partial class TextNormalizer
{
    public static string CollapseWhitespace(string? text) =>
        WhitespaceRun().Replace((text ?? string.Empty).Trim(), " ");

    public static string ForUniqueness(string name) =>
        CollapseWhitespace(name).ToUpperInvariant();

    public static string ForSearch(string text) =>
        RemoveDiacritics(CollapseWhitespace(text)).ToLowerInvariant();

    private static string RemoveDiacritics(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var withoutMarks = decomposed
            .Where(character => CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
            .ToArray();
        return new string(withoutMarks).Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRun();
}
