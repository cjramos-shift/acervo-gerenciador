using System.Net;
using System.Text.RegularExpressions;

namespace Acervo.Application.Contents.Shared;

public static partial class MarkdownPlainText
{
    public static string From(string markdown)
    {
        var text = ImageSyntax().Replace(markdown, "$1");
        text = LinkSyntax().Replace(text, "$1");
        text = LineMarkers().Replace(text, string.Empty);
        text = HorizontalRule().Replace(text, string.Empty);
        text = InlineMarkers().Replace(text, string.Empty);
        text = EdgeUnderscores().Replace(text, string.Empty);
        text = EscapedCharacter().Replace(text, "$1");
        return WebUtility.HtmlDecode(text);
    }

    [GeneratedRegex(@"!\[([^\]]*)\]\([^)]*\)")]
    private static partial Regex ImageSyntax();

    [GeneratedRegex(@"\[([^\]]*)\]\([^)]*\)")]
    private static partial Regex LinkSyntax();

    [GeneratedRegex(@"^[ \t]*(#{1,6}[ \t]+|>[ \t]?|[-*+][ \t]+|\d+\.[ \t]+|```.*$)", RegexOptions.Multiline)]
    private static partial Regex LineMarkers();

    [GeneratedRegex(@"^[ \t]*([-*_][ \t]*){3,}$", RegexOptions.Multiline)]
    private static partial Regex HorizontalRule();

    [GeneratedRegex(@"(?<!\\)(\*|`|~~)")]
    private static partial Regex InlineMarkers();

    [GeneratedRegex(@"(?<![\\\w])_|(?<!\\)_(?!\w)")]
    private static partial Regex EdgeUnderscores();

    [GeneratedRegex(@"\\([\\`*_{}\[\]()#+\-.!|<>~&])")]
    private static partial Regex EscapedCharacter();
}
