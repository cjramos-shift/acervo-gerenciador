namespace Acervo.InterfaceAdapters.ViewModels;

public sealed record ContentIdViewModel(Guid Id);

public sealed record ReferenceLinkViewModel(Guid Id, string Url, string? Label);

public sealed record ImageViewModel(Guid Id, string FileName, string? Description, long SizeInBytes, string Url);

public sealed record FileViewModel(Guid Id, string FileName, string ContentType, long SizeInBytes, string Url);

public sealed record ContentDetailsViewModel(
    Guid Id,
    string Title,
    string Body,
    Guid GroupId,
    string GroupName,
    Guid CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<ReferenceLinkViewModel> Links,
    IReadOnlyList<ImageViewModel> Images,
    IReadOnlyList<FileViewModel> Files);

public sealed record ContentSummaryViewModel(
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

public sealed record PagedViewModel<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages);
