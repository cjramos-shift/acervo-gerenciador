namespace Acervo.Domain.Contents;

public sealed record AttachmentFileInfo(
    AttachmentKind Kind,
    string OriginalFileName,
    string StorageKey,
    string ContentType,
    long SizeInBytes);
