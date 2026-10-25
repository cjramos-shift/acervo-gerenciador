using Acervo.Domain.Contents;
using Acervo.Domain.Shared;

namespace Acervo.Application.Contents.Shared;

public static class SearchTextBuilder
{
    public static string Build(Content content)
    {
        var linkLabels = content.ReferenceLinks.Select(link => link.Label).OfType<string>();

        var parts = new[]
        {
            content.Title,
            MarkdownPlainText.From(content.Body),
            content.Category.Group.Name,
            content.Category.Name
        };

        return TextNormalizer.ForSearch(string.Join(' ', parts.Concat(linkLabels)));
    }
}
