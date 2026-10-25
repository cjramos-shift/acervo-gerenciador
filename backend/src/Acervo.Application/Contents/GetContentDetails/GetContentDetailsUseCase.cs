using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;

namespace Acervo.Application.Contents.GetContentDetails;

public sealed class GetContentDetailsUseCase(IContentRepository contents)
{
    public async Task<ContentDetailsOutput> ExecuteAsync(Guid contentId, CancellationToken cancellationToken)
    {
        var content = await contents.FindByIdAsync(contentId, cancellationToken)
                      ?? throw new NotFoundException("Conteúdo não encontrado.");

        return ContentOutputMapper.ToDetails(content);
    }
}
