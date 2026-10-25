using Acervo.Domain.Contents;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Tests;

public class ContentTextTests
{
    [Fact]
    public void Create_TrimsTitleAndBody()
    {
        var text = ContentText.Create("  Meu título  ", "  corpo  ");

        Assert.Equal("Meu título", text.Title);
        Assert.Equal("corpo", text.Body);
    }

    [Theory]
    [InlineData("")]
    [InlineData("ab")]
    [InlineData("   ")]
    public void Create_RejectsShortTitle(string title)
    {
        var error = Assert.Throws<DomainException>(() => ContentText.Create(title, "corpo"));

        Assert.True(error.Errors.ContainsKey("title"));
    }

    [Fact]
    public void Create_RejectsTitleAboveLimit()
    {
        var title = new string('a', ContentRules.TitleMaxLength + 1);

        Assert.Throws<DomainException>(() => ContentText.Create(title, "corpo"));
    }

    [Fact]
    public void Create_RejectsEmptyBody()
    {
        var error = Assert.Throws<DomainException>(() => ContentText.Create("Título", "  \n "));

        Assert.True(error.Errors.ContainsKey("body"));
    }

    [Fact]
    public void Create_RejectsBodyAboveLimit()
    {
        var body = new string('a', ContentRules.BodyMaxLength + 1);

        Assert.Throws<DomainException>(() => ContentText.Create("Título", body));
    }
}
