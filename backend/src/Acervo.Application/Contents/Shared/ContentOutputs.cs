using Acervo.Domain.Contents;

namespace Acervo.Application.Contents.Shared;

public sealed record ReferenceLinkOutput(Guid Id, string Url, string? Label);

public sealed record AttachmentOutput(
    Guid Id,
    AttachmentKind Kind,
    string FileName,
    string ContentType,
    long SizeInBytes,
    string? Description);

public sealed record ContentDetailsOutput(
    Guid Id,
    string Title,
    string Body,
    Guid GroupId,
    string GroupName,
    Guid CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<ReferenceLinkOutput> Links,
    IReadOnlyList<AttachmentOutput> Attachments);

public sealed record ContentSummaryOutput(
    Guid Id,
    string Title,
    Guid GroupId,
    string GroupName,
    Guid CategoryId,
    string CategoryName,
    string BodyPreview,
    int LinkCount,
    int ImageCount,
    int FileCount,
    DateTime UpdatedAt);

public sealed record ContentQuery(
    Guid? GroupId,
    Guid? CategoryId,
    IReadOnlyList<string> SearchWords,
    int Page,
    int PageSize);
