using Microsoft.AspNetCore.Http;

namespace Acervo.InterfaceAdapters.Requests;

public sealed class ReferenceLinkRequest
{
    public string? Url { get; set; }
    public string? Label { get; set; }
}

public sealed class ImageUploadRequest
{
    public IFormFile? File { get; set; }
    public string? Description { get; set; }
}

public class SaveContentRequest
{
    public string? Title { get; set; }
    public string? Body { get; set; }
    public string? GroupName { get; set; }
    public string? CategoryName { get; set; }
    public List<ReferenceLinkRequest>? Links { get; set; }
    public List<ImageUploadRequest>? Images { get; set; }
    public List<IFormFile>? Files { get; set; }
}

public sealed class UpdateContentRequest : SaveContentRequest
{
    public List<Guid>? RemovedAttachmentIds { get; set; }
}
