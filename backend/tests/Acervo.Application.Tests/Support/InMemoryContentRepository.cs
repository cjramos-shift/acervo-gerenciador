using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;
using Acervo.Domain.Contents;

namespace Acervo.Application.Tests.Support;

internal sealed class InMemoryContentRepository : IContentRepository
{
    public List<Content> Items { get; } = [];
    public ContentQuery? LastQuery { get; private set; }

    public Task<Content?> FindByIdAsync(Guid contentId, CancellationToken cancellationToken) =>
        Task.FromResult(Items.FirstOrDefault(content => content.Id == contentId));

    public Task<Attachment?> FindAttachmentAsync(Guid attachmentId, CancellationToken cancellationToken) =>
        Task.FromResult(Items.SelectMany(content => content.Attachments).FirstOrDefault(a => a.Id == attachmentId));

    public Task<PagedResult<ContentSummaryOutput>> ListSummariesAsync(
        ContentQuery query, CancellationToken cancellationToken)
    {
        LastQuery = query;
        return Task.FromResult(new PagedResult<ContentSummaryOutput>([], query.Page, query.PageSize, 0));
    }

    public void Add(Content content) => Items.Add(content);

    public void Remove(Content content) => Items.Remove(content);
}
