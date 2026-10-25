using Acervo.Application.Contents.DeleteContent;
using Acervo.Application.Contents.GetContentDetails;
using Acervo.Application.Contents.ListContents;
using Acervo.Application.Contents.RegisterContent;
using Acervo.Application.Contents.UpdateContent;
using Acervo.Application.Uploads;
using Acervo.InterfaceAdapters.Presenters;
using Acervo.InterfaceAdapters.Requests;
using Acervo.InterfaceAdapters.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Acervo.InterfaceAdapters.Controllers;

[ApiController]
[Route("api/contents")]
public sealed class ContentsController(
    ListContentsUseCase listContents,
    GetContentDetailsUseCase getContentDetails,
    RegisterContentUseCase registerContent,
    UpdateContentUseCase updateContent,
    DeleteContentUseCase deleteContent) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedViewModel<ContentSummaryViewModel>>> List(
        [FromQuery] ListContentsRequest request, CancellationToken cancellationToken)
    {
        var page = await listContents.ExecuteAsync(request.ToInput(), cancellationToken);
        return Ok(ContentPresenter.PresentPage(page));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ContentDetailsViewModel>> Get(Guid id, CancellationToken cancellationToken)
    {
        var content = await getContentDetails.ExecuteAsync(id, cancellationToken);
        return Ok(ContentPresenter.PresentDetails(content));
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(UploadPolicy.MaxRequestBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = UploadPolicy.MaxRequestBytes)]
    public async Task<ActionResult<ContentIdViewModel>> Create(
        [FromForm] SaveContentRequest request, CancellationToken cancellationToken)
    {
        var contentId = await registerContent.ExecuteAsync(
            ContentRequestMapper.ToFormInput(request), cancellationToken);

        return CreatedAtAction(nameof(Get), new { id = contentId }, new ContentIdViewModel(contentId));
    }

    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(UploadPolicy.MaxRequestBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = UploadPolicy.MaxRequestBytes)]
    public async Task<ActionResult<ContentIdViewModel>> Update(
        Guid id, [FromForm] UpdateContentRequest request, CancellationToken cancellationToken)
    {
        var contentId = await updateContent.ExecuteAsync(
            ContentRequestMapper.ToUpdateInput(id, request), cancellationToken);

        return Ok(new ContentIdViewModel(contentId));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await deleteContent.ExecuteAsync(id, cancellationToken);
        return NoContent();
    }
}
