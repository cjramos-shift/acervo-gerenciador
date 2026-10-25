using Acervo.Domain.Shared;

namespace Acervo.Domain.Contents;

public sealed record ContentText
{
    private ContentText(string title, string body)
    {
        Title = title;
        Body = body;
    }

    public string Title { get; }
    public string Body { get; }

    public static ContentText Create(string? title, string? body) =>
        new(CleanTitle(title), CleanBody(body));

    private static string CleanTitle(string? title)
    {
        var cleanTitle = (title ?? string.Empty).Trim();

        if (cleanTitle.Length is < ContentRules.TitleMinLength or > ContentRules.TitleMaxLength)
            throw new DomainException("title",
                $"Informe de {ContentRules.TitleMinLength} a {ContentRules.TitleMaxLength} caracteres.");

        return cleanTitle;
    }

    private static string CleanBody(string? body)
    {
        var cleanBody = (body ?? string.Empty).Trim();

        if (cleanBody.Length == 0)
            throw new DomainException("body", "Escreva o conteúdo.");

        if (cleanBody.Length > ContentRules.BodyMaxLength)
            throw new DomainException("body",
                $"O conteúdo ultrapassa o limite de {ContentRules.BodyMaxLength:N0} caracteres.");

        return cleanBody;
    }
}
