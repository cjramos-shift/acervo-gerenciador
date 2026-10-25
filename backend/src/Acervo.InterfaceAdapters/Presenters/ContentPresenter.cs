using Acervo.Application.Contents.Shared;
using Acervo.Application.Shared;
using Acervo.Domain.Contents;
using Acervo.InterfaceAdapters.ViewModels;

namespace Acervo.InterfaceAdapters.Presenters;

public static class ContentPresenter
{
    public static ContentDetailsViewModel PresentDetails(ContentDetailsOutput content) => new(
        content.Id,
        content.Title,
        content.Body,
        content.GroupId,
        content.GroupName,
        content.CategoryId,
        content.CategoryName,
        content.CreatedAt,
        content.UpdatedAt,
        content.Links.Select(link => new ReferenceLinkViewModel(link.Id, link.Url, link.Label)).ToList(),
        PresentImages(content.Attachments),
        PresentFiles(content.Attachments));

    public static PagedViewModel<ContentSummaryViewModel> PresentPage(PagedResult<ContentSummaryOutput> page) => new(
        page.Items.Select(PresentSummary).ToList(),
        page.Page,
        page.PageSize,
        page.TotalItems,
        page.TotalPages);

    private static ContentSummaryViewModel PresentSummary(ContentSummaryOutput summary) => new(
        summary.Id,
        summary.Title,
        summary.GroupId,
        summary.GroupName,
        summary.CategoryId,
        summary.CategoryName,
        summary.BodyPreview,
        summary.LinkCount,
        summary.ImageCount,
        summary.FileCount,
        summary.UpdatedAt);

    private static IReadOnlyList<ImageViewModel> PresentImages(IEnumerable<AttachmentOutput> attachments) =>
        attachments
            .Where(attachment => attachment.Kind == AttachmentKind.Image)
            .Select(image => new ImageViewModel(
                image.Id, image.FileName, image.Description, image.SizeInBytes, FileUrl(image.Id)))
            .ToList();

    private static IReadOnlyList<FileViewModel> PresentFiles(IEnumerable<AttachmentOutput> attachments) =>
        attachments
            .Where(attachment => attachment.Kind == AttachmentKind.File)
            .Select(file => new FileViewModel(
                file.Id, file.FileName, file.ContentType, file.SizeInBytes, FileUrl(file.Id)))
            .ToList();

    private static string FileUrl(Guid attachmentId) => $"/api/attachments/{attachmentId}/file";
}
