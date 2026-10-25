using Acervo.Application.Ports;
using Acervo.Application.Shared;
using Acervo.Application.Uploads;
using Acervo.Domain.Categories;
using Acervo.Domain.Contents;
using Acervo.Domain.Groups;
using Acervo.Domain.Shared;

namespace Acervo.Application.Contents.Shared;

public sealed class ContentAssembler(IGroupRepository groups, IFileStorage storage, UploadPolicy uploadPolicy)
{
    public async Task<Category> ResolveCategoryAsync(
        CategoryReference reference, DateTime nowUtc, CancellationToken cancellationToken)
    {
        var groupName = NameRules.Clean(reference.GroupName, "groupName");
        var categoryName = NameRules.Clean(reference.CategoryName, "categoryName");

        var group = await groups.FindByNameAsync(groupName, cancellationToken);
        if (group is null)
        {
            group = Group.Create(groupName, nowUtc);
            groups.Add(group);
        }

        return group.GetOrAddCategory(categoryName, nowUtc);
    }

    public IReadOnlyList<ReferenceLink> BuildLinks(IReadOnlyList<ReferenceLinkInput> inputs) =>
        inputs.Select(BuildLink).ToList();

    public async Task<IReadOnlyList<Attachment>> StoreAttachmentsAsync(
        IReadOnlyList<ImageUploadInput> images, IReadOnlyList<UploadedFileInput> files,
        CancellationToken cancellationToken)
    {
        var uploads = ValidateUploads(images, files);
        var stored = new List<Attachment>();

        try
        {
            foreach (var (upload, description) in uploads)
                stored.Add(await StoreAsync(upload, description, cancellationToken));
        }
        catch
        {
            await DiscardAsync(stored, cancellationToken);
            throw;
        }

        return stored;
    }

    public async Task DiscardAsync(IEnumerable<Attachment> attachments, CancellationToken cancellationToken)
    {
        foreach (var attachment in attachments)
            await storage.DeleteAsync(attachment.StorageKey, cancellationToken);
    }

    public static void RefreshSearchText(Content content) =>
        content.UpdateSearchText(SearchTextBuilder.Build(content));

    private static ReferenceLink BuildLink(ReferenceLinkInput input, int index)
    {
        try
        {
            return ReferenceLink.Create(input.Url, input.Label);
        }
        catch (DomainException error)
        {
            throw error.WithFieldPrefix($"links[{index}]");
        }
    }

    private List<(ValidatedUpload Upload, string? Description)> ValidateUploads(
        IReadOnlyList<ImageUploadInput> images, IReadOnlyList<UploadedFileInput> files)
    {
        var imageUploads = images.Select((image, index) => (
            uploadPolicy.Validate(image.File, AttachmentKind.Image, $"images[{index}].file"),
            CleanImageDescription(image.Description, index)));

        var fileUploads = files.Select((file, index) =>
            (uploadPolicy.Validate(file, AttachmentKind.File, $"files[{index}]"), (string?)null));

        return imageUploads.Concat(fileUploads).ToList();
    }

    private static string? CleanImageDescription(string? description, int index)
    {
        try
        {
            return Attachment.CleanDescription(description);
        }
        catch (DomainException error)
        {
            throw error.WithFieldPrefix($"images[{index}]");
        }
    }

    private async Task<Attachment> StoreAsync(
        ValidatedUpload upload, string? description, CancellationToken cancellationToken)
    {
        await using var stream = upload.File.OpenRead();
        var storageKey = await storage.SaveAsync(stream, upload.Extension, cancellationToken);

        var fileInfo = new AttachmentFileInfo(
            upload.Kind,
            UploadPolicy.CleanFileName(upload.File.FileName),
            storageKey,
            upload.ContentType,
            upload.File.Length);

        return Attachment.Create(fileInfo, description);
    }
}
