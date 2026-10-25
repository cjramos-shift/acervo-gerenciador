using Acervo.Application.Contents.Shared;

namespace Acervo.Application.Contents.UpdateContent;

public sealed record UpdateContentInput(
    Guid ContentId,
    ContentFormInput Form,
    IReadOnlyCollection<Guid> RemovedAttachmentIds);
