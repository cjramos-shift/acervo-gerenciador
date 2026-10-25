namespace Acervo.Domain.Shared;

public static class NameRules
{
    public const int MinLength = 2;
    public const int MaxLength = 60;

    public static string Clean(string? rawName, string field)
    {
        var name = TextNormalizer.CollapseWhitespace(rawName);

        if (name.Length is < MinLength or > MaxLength)
            throw new DomainException(field, $"Informe de {MinLength} a {MaxLength} caracteres.");

        return name;
    }
}
