using Acervo.Domain.Contents;

namespace Acervo.Application.Contents.Shared;

public static class ContentOutputMapper
{
    public static ContentDetailsOutput ToDetails(Content content) => new(
        content.Id,
        content.Title,
        content.Body,
        content.Category.GroupId,
        content.Category.Group.Name,
        content.CategoryId,
        content.Category.Name,
        content.CreatedAt,
        content.UpdatedAt,
        content.ReferenceLinks.Select(link => new ReferenceLinkOutput(link.Id, link.Url, link.Label)).ToList(),
        content.Attachments.Select(ToAttachmentOutput).ToList());

    private static AttachmentOutput ToAttachmentOutput(Attachment attachment) => new(
        attachment.Id,
        attachment.Kind,
        attachment.OriginalFileName,
        attachment.ContentType,
        attachment.SizeInBytes,
        attachment.Description);
}
