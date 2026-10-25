namespace Acervo.Domain.Contents;

public static class ContentRules
{
    public const int TitleMinLength = 3;
    public const int TitleMaxLength = 150;
    public const int BodyMaxLength = 50_000;
    public const int MaxReferenceLinks = 20;
    public const int LinkLabelMaxLength = 100;
    public const int MaxImages = 10;
    public const int MaxFiles = 10;
    public const int AttachmentDescriptionMaxLength = 200;
}
