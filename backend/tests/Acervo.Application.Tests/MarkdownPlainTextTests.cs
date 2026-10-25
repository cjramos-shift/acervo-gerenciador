using Acervo.Application.Contents.Shared;

namespace Acervo.Application.Tests;

public class MarkdownPlainTextTests
{
    [Fact]
    public void From_RemovesListMarkersAndEmphasis() =>
        Assert.Equal("Código Limpo (Robert C. Martin): legibilidade",
            MarkdownPlainText.From("- **Código Limpo** (Robert C. Martin): legibilidade"));

    [Fact]
    public void From_KeepsLinkTextAndDropsUrl() =>
        Assert.Equal("veja a documentação", MarkdownPlainText.From("veja [a documentação](https://exemplo.com)"));

    [Fact]
    public void From_RemovesHeadingQuoteAndOrderedListMarkers() =>
        Assert.Equal("Título\ncitação\nitem", MarkdownPlainText.From("## Título\n> citação\n1. item"));

    [Fact]
    public void From_KeepsUnderscoresInsideWords() =>
        Assert.Equal("use snake_case sempre", MarkdownPlainText.From("use snake_case _sempre_"));

    [Fact]
    public void From_DecodesTheEntitiesTheEditorWrites() =>
        Assert.Equal("Troubleshooting & Repairing (a < b)",
            MarkdownPlainText.From("**Troubleshooting &amp; Repairing** (a &lt; b)"));

    [Fact]
    public void From_KeepsEscapedCharactersAsLiterals() =>
        Assert.Equal("a * b _ c C:\\pasta", MarkdownPlainText.From("a \\* b \\_ c C:\\\\pasta"));
}
