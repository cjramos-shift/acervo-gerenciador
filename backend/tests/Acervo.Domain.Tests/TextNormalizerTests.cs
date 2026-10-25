using Acervo.Domain.Shared;

namespace Acervo.Domain.Tests;

public class TextNormalizerTests
{
    [Fact]
    public void ForSearch_RemovesAccentsCollapsesSpacesAndLowercases() =>
        Assert.Equal("algebra relacional", TextNormalizer.ForSearch("  Álgebra   Relacional "));

    [Fact]
    public void ForUniqueness_IgnoresCaseAndCollapsesSpaces() =>
        Assert.Equal("TI E REDES", TextNormalizer.ForUniqueness(" ti  e   Redes "));

    [Fact]
    public void ForUniqueness_KeepsAccents() =>
        Assert.NotEqual(TextNormalizer.ForUniqueness("Ciência"), TextNormalizer.ForUniqueness("Ciencia"));
}
