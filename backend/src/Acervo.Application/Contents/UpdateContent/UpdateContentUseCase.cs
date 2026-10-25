using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;
using Acervo.Domain.Contents;

namespace Acervo.Application.Contents.UpdateContent;

public sealed class UpdateContentUseCase(
    ContentAssembler assembler,
    IContentRepository contents,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    public async Task<Guid> ExecuteAsync(UpdateContentInput input, CancellationToken cancellationToken)
    {
        var content = await contents.FindByIdAsync(input.ContentId, cancellationToken)
                      ?? throw new NotFoundException("Conteúdo não encontrado.");

        var nowUtc = clock.GetUtcNow().UtcDateTime;
        var form = input.Form;
        var text = ContentText.Create(form.Title, form.Body);
        var links = assembler.BuildLinks(form.Links);
        var category = await assembler.ResolveCategoryAsync(form.Category, nowUtc, cancellationToken);

        content.Edit(text, category, nowUtc);
        content.ReplaceReferenceLinks(links);
        var removed = content.RemoveAttachments(input.RemovedAttachmentIds);

        var added = await assembler.StoreAttachmentsAsync(form.Images, form.Files, cancellationToken);
        try
        {
            content.AddAttachments(added);
            ContentAssembler.RefreshSearchText(content);
            await unitOfWork.CommitAsync(cancellationToken);
        }
        catch
        {
            await assembler.DiscardAsync(added, cancellationToken);
            throw;
        }

        await assembler.DiscardAsync(removed, cancellationToken);
        return content.Id;
    }
}
