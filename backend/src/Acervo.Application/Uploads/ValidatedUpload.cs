using Acervo.Application.Shared;
using Acervo.Domain.Contents;

namespace Acervo.Application.Uploads;

public sealed record ValidatedUpload(
    UploadedFileInput File,
    AttachmentKind Kind,
    string Extension,
    string ContentType);
