using Acervo.Domain.Categories;
using Acervo.Domain.Contents;
using Acervo.Domain.Groups;

namespace Acervo.Domain.Tests;

internal static class TestData
{
    public static readonly DateTime Now = new(2026, 10, 24, 12, 0, 0, DateTimeKind.Utc);

    public static Category NewCategory(string groupName = "Livros", string categoryName = "TI") =>
        Group.Create(groupName, Now).GetOrAddCategory(categoryName, Now);

    public static ContentText NewText() => ContentText.Create("Título válido", "Corpo válido");

    public static Content NewContent() => Content.Create(NewText(), NewCategory(), Now);

    public static ReferenceLink NewLink(string url) => ReferenceLink.Create(url, null);

    public static Attachment NewAttachment(AttachmentKind kind = AttachmentKind.Image)
    {
        var storageKey = $"{Guid.NewGuid():N}.png";
        return Attachment.Create(new AttachmentFileInfo(kind, "arquivo.png", storageKey, "image/png", 10), null);
    }
}
