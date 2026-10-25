using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;

namespace Acervo.Application.Contents.DeleteContent;

public sealed class DeleteContentUseCase(
    ContentAssembler assembler,
    IContentRepository contents,
    IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(Guid contentId, CancellationToken cancellationToken)
    {
        var content = await contents.FindByIdAsync(contentId, cancellationToken)
                      ?? throw new NotFoundException("Conteúdo não encontrado.");

        var attachments = content.Attachments.ToList();

        contents.Remove(content);
        await unitOfWork.CommitAsync(cancellationToken);

        await assembler.DiscardAsync(attachments, cancellationToken);
    }
}
