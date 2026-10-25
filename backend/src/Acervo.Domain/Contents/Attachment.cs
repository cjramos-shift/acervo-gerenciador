using Acervo.Domain.Shared;

namespace Acervo.Domain.Contents;

public sealed class Attachment
{
    private Attachment()
    {
        OriginalFileName = null!;
        StorageKey = null!;
        ContentType = null!;
    }

    public Guid Id { get; private set; }
    public Guid ContentId { get; private set; }
    public AttachmentKind Kind { get; private set; }
    public string OriginalFileName { get; private set; }
    public string StorageKey { get; private set; }
    public string ContentType { get; private set; }
    public long SizeInBytes { get; private set; }
    public string? Description { get; private set; }
    public int Position { get; private set; }

    public static Attachment Create(AttachmentFileInfo fileInfo, string? description)
    {
        return new Attachment
        {
            Id = Guid.CreateVersion7(),
            Kind = fileInfo.Kind,
            OriginalFileName = fileInfo.OriginalFileName,
            StorageKey = fileInfo.StorageKey,
            ContentType = fileInfo.ContentType,
            SizeInBytes = fileInfo.SizeInBytes,
            Description = CleanDescription(description)
        };
    }

    internal void MoveTo(int position) => Position = position;

    public static string? CleanDescription(string? description)
    {
        var cleanDescription = (description ?? string.Empty).Trim();

        if (cleanDescription.Length == 0)
            return null;

        if (cleanDescription.Length > ContentRules.AttachmentDescriptionMaxLength)
            throw new DomainException("description",
                $"A descrição deve ter até {ContentRules.AttachmentDescriptionMaxLength} caracteres.");

        return cleanDescription;
    }
}
