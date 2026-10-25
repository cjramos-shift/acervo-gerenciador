using Acervo.Domain.Contents;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Tests;

public class ReferenceLinkTests
{
    [Theory]
    [InlineData("")]
    [InlineData("javascript:alert(1)")]
    [InlineData("/relativo")]
    [InlineData("ftp://servidor.com/arquivo")]
    [InlineData("www.site.com")]
    public void Create_RejectsInvalidUrl(string url)
    {
        var error = Assert.Throws<DomainException>(() => ReferenceLink.Create(url, null));

        Assert.True(error.Errors.ContainsKey("url"));
    }

    [Fact]
    public void Create_AcceptsHttpsAndTrimsLabel()
    {
        var link = ReferenceLink.Create(" https://exemplo.com/artigo ", "  Artigo  ");

        Assert.Equal("https://exemplo.com/artigo", link.Url);
        Assert.Equal("Artigo", link.Label);
    }

    [Fact]
    public void Create_TreatsBlankLabelAsNull() =>
        Assert.Null(ReferenceLink.Create("https://exemplo.com", "   ").Label);

    [Fact]
    public void Create_RejectsLabelAboveLimit()
    {
        var label = new string('a', ContentRules.LinkLabelMaxLength + 1);

        Assert.Throws<DomainException>(() => ReferenceLink.Create("https://exemplo.com", label));
    }
}
