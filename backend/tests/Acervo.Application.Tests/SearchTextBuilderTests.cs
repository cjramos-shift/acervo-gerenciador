using Acervo.Application.Contents.Shared;
using Acervo.Domain.Contents;
using Acervo.Domain.Groups;

namespace Acervo.Application.Tests;

public class SearchTextBuilderTests
{
    private static readonly DateTime Now = new(2026, 10, 24, 12, 0, 0, DateTimeKind.Utc);

    [Fact]
    public void Build_JoinsTitleBodyGroupCategoryAndLinkLabelsNormalized()
    {
        var category = Group.Create("Livros", Now).GetOrAddCategory("Ciência", Now);
        var content = Content.Create(ContentText.Create("Álgebra Relacional", "- **Modelo** relacional"), category, Now);
        content.ReplaceReferenceLinks([ReferenceLink.Create("https://exemplo.com", "Material Extra")]);

        var searchText = SearchTextBuilder.Build(content);

        Assert.Contains("algebra relacional", searchText);
        Assert.Contains("modelo relacional", searchText);
        Assert.Contains("livros", searchText);
        Assert.Contains("ciencia", searchText);
        Assert.Contains("material extra", searchText);
        Assert.DoesNotContain("**", searchText);
    }
}
