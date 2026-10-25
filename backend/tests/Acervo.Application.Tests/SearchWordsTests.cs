using Acervo.Application.Contents.ListContents;
using Acervo.Domain.Shared;

namespace Acervo.Application.Tests;

public class SearchWordsTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void From_ReturnsNoWordsWhenTermIsBlank(string? term) =>
        Assert.Empty(SearchWords.From(term));

    [Fact]
    public void From_NormalizesAccentsCaseAndDuplicates() =>
        Assert.Equal(["algebra", "relacional"], SearchWords.From("  ÁLGEBRA  Relacional algebra ").ToArray());

    [Fact]
    public void From_RejectsTermShorterThanMinimum()
    {
        var error = Assert.Throws<DomainException>(() => SearchWords.From("a"));

        Assert.True(error.Errors.ContainsKey("search"));
    }

    [Fact]
    public void From_RejectsTermLongerThanMaximum() =>
        Assert.Throws<DomainException>(() => SearchWords.From(new string('a', SearchWords.MaxTermLength + 1)));

    [Fact]
    public void From_RejectsTooManyWords()
    {
        var term = string.Join(' ', Enumerable.Range(0, SearchWords.MaxWords + 1).Select(index => $"palavra{index}"));

        Assert.Throws<DomainException>(() => SearchWords.From(term));
    }
}
