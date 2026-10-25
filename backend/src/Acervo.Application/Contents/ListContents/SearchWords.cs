using Acervo.Domain.Shared;

namespace Acervo.Application.Contents.ListContents;

public static class SearchWords
{
    public const int MinTermLength = 2;
    public const int MaxTermLength = 100;
    public const int MaxWords = 8;

    public static IReadOnlyList<string> From(string? searchTerm)
    {
        var term = TextNormalizer.CollapseWhitespace(searchTerm);

        if (term.Length == 0)
            return [];

        EnsureTermLength(term);

        var words = TextNormalizer.ForSearch(term).Split(' ').Distinct().ToList();

        if (words.Count > MaxWords)
            throw new DomainException("search", $"Use no máximo {MaxWords} palavras na busca.");

        return words;
    }

    private static void EnsureTermLength(string term)
    {
        if (term.Length is < MinTermLength or > MaxTermLength)
            throw new DomainException("search",
                $"Digite de {MinTermLength} a {MaxTermLength} caracteres para buscar.");
    }
}
