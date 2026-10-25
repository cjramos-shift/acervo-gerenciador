using Acervo.Application.Shared;

namespace Acervo.Application.Contents.Shared;

public sealed record CategoryReference(string? GroupName, string? CategoryName);

public sealed record ReferenceLinkInput(string? Url, string? Label);

public sealed record ImageUploadInput(UploadedFileInput File, string? Description);

public sealed record ContentFormInput(
    string? Title,
    string? Body,
    CategoryReference Category,
    IReadOnlyList<ReferenceLinkInput> Links,
    IReadOnlyList<ImageUploadInput> Images,
    IReadOnlyList<UploadedFileInput> Files);
