using Acervo.Application.Contents.Shared;
using Acervo.Application.Shared;
using Acervo.Domain.Contents;

namespace Acervo.Application.Ports;

public interface IContentRepository
{
    Task<Content?> FindByIdAsync(Guid contentId, CancellationToken cancellationToken);
    Task<Attachment?> FindAttachmentAsync(Guid attachmentId, CancellationToken cancellationToken);
    Task<PagedResult<ContentSummaryOutput>> ListSummariesAsync(ContentQuery query, CancellationToken cancellationToken);
    void Add(Content content);
    void Remove(Content content);
}
