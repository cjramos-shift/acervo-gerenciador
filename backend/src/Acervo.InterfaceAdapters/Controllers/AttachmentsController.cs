using Acervo.Application.Attachments.GetAttachmentFile;
using Acervo.Domain.Contents;
using Microsoft.AspNetCore.Mvc;

namespace Acervo.InterfaceAdapters.Controllers;

[ApiController]
[Route("api/attachments")]
public sealed class AttachmentsController(GetAttachmentFileUseCase getAttachmentFile) : ControllerBase
{
    [HttpGet("{id:guid}/file")]
    public async Task<IActionResult> Download(Guid id, CancellationToken cancellationToken)
    {
        var attachment = await getAttachmentFile.ExecuteAsync(id, cancellationToken);

        return attachment.Kind == AttachmentKind.Image
            ? File(attachment.Content, attachment.ContentType)
            : File(attachment.Content, attachment.ContentType, attachment.FileName);
    }
}
