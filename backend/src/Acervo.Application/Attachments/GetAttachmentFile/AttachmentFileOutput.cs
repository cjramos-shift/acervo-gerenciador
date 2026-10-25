using Acervo.Domain.Contents;

namespace Acervo.Application.Attachments.GetAttachmentFile;

public sealed record AttachmentFileOutput(
    Stream Content,
    string FileName,
    string ContentType,
    AttachmentKind Kind);
