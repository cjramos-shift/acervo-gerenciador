using Acervo.Application.Contents.Shared;
using Acervo.Application.Contents.UpdateContent;
using Acervo.Application.Shared;
using Acervo.Domain.Shared;
using Microsoft.AspNetCore.Http;

namespace Acervo.InterfaceAdapters.Requests;

public static class ContentRequestMapper
{
    public static ContentFormInput ToFormInput(SaveContentRequest request) => new(
        request.Title,
        request.Body,
        new CategoryReference(request.GroupName, request.CategoryName),
        (request.Links ?? []).Select(link => new ReferenceLinkInput(link.Url, link.Label)).ToList(),
        (request.Images ?? []).Select(ToImageInput).ToList(),
        (request.Files ?? []).Select(ToUploadedFile).ToList());

    public static UpdateContentInput ToUpdateInput(Guid contentId, UpdateContentRequest request) => new(
        contentId,
        ToFormInput(request),
        request.RemovedAttachmentIds ?? []);

    private static ImageUploadInput ToImageInput(ImageUploadRequest image, int index)
    {
        var file = image.File ?? throw new DomainException($"images[{index}].file", "Selecione a imagem.");
        return new ImageUploadInput(ToUploadedFile(file), image.Description);
    }

    private static UploadedFileInput ToUploadedFile(IFormFile file) =>
        new(file.OpenReadStream, file.FileName, file.Length);
}
