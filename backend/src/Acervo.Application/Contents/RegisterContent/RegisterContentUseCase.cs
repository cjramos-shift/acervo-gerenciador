using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Domain.Contents;

namespace Acervo.Application.Contents.RegisterContent;

public sealed class RegisterContentUseCase(
    ContentAssembler assembler,
    IContentRepository contents,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    public async Task<Guid> ExecuteAsync(ContentFormInput form, CancellationToken cancellationToken)
    {
        var nowUtc = clock.GetUtcNow().UtcDateTime;
        var text = ContentText.Create(form.Title, form.Body);
        var links = assembler.BuildLinks(form.Links);
        var category = await assembler.ResolveCategoryAsync(form.Category, nowUtc, cancellationToken);

        var content = Content.Create(text, category, nowUtc);
        content.ReplaceReferenceLinks(links);

        var attachments = await assembler.StoreAttachmentsAsync(form.Images, form.Files, cancellationToken);
        try
        {
            content.AddAttachments(attachments);
            ContentAssembler.RefreshSearchText(content);
            contents.Add(content);
            await unitOfWork.CommitAsync(cancellationToken);
        }
        catch
        {
            await assembler.DiscardAsync(attachments, cancellationToken);
            throw;
        }

        return content.Id;
    }
}
