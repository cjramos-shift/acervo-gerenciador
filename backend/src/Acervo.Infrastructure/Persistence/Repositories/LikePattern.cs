namespace Acervo.Infrastructure.Persistence.Repositories;

internal static class LikePattern
{
    public const string EscapeCharacter = "\\";

    public static string Contains(string word) => $"%{Escape(word)}%";

    private static string Escape(string word) => word
        .Replace(EscapeCharacter, EscapeCharacter + EscapeCharacter)
        .Replace("%", EscapeCharacter + "%")
        .Replace("_", EscapeCharacter + "_");
}
