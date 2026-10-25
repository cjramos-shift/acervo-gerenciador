using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;
using Acervo.Domain.Contents;
using Microsoft.EntityFrameworkCore;

namespace Acervo.Infrastructure.Persistence.Repositories;

internal sealed class EfContentRepository(AcervoDbContext database) : IContentRepository
{
    public Task<Content?> FindByIdAsync(Guid contentId, CancellationToken cancellationToken) =>
        database.Contents
            .Include(content => content.Category).ThenInclude(category => category.Group)
            .Include(content => content.ReferenceLinks)
            .Include(content => content.Attachments)
            .AsSplitQuery()
            .FirstOrDefaultAsync(content => content.Id == contentId, cancellationToken);

    public Task<Attachment?> FindAttachmentAsync(Guid attachmentId, CancellationToken cancellationToken) =>
        database.Attachments
            .AsNoTracking()
            .FirstOrDefaultAsync(attachment => attachment.Id == attachmentId, cancellationToken);

    public async Task<PagedResult<ContentSummaryOutput>> ListSummariesAsync(
        ContentQuery query, CancellationToken cancellationToken)
    {
        var filtered = ApplyFilters(database.Contents.AsNoTracking(), query);

        var totalItems = await filtered.CountAsync(cancellationToken);
        var items = await filtered
            .OrderByDescending(content => content.UpdatedAt)
            .ThenBy(content => content.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(content => new ContentSummaryOutput(
                content.Id,
                content.Title,
                content.Category.GroupId,
                content.Category.Group.Name,
                content.CategoryId,
                content.Category.Name,
                content.Body.Length > ContentPreview.Length
                    ? content.Body.Substring(0, ContentPreview.Length)
                    : content.Body,
                content.ReferenceLinks.Count(),
                content.Attachments.Count(attachment => attachment.Kind == AttachmentKind.Image),
                content.Attachments.Count(attachment => attachment.Kind == AttachmentKind.File),
                content.UpdatedAt))
            .ToListAsync(cancellationToken);

        return new PagedResult<ContentSummaryOutput>(items, query.Page, query.PageSize, totalItems);
    }

    public void Add(Content content) => database.Contents.Add(content);

    public void Remove(Content content) => database.Contents.Remove(content);

    private static IQueryable<Content> ApplyFilters(IQueryable<Content> contents, ContentQuery query)
    {
        if (query.GroupId is { } groupId)
            contents = contents.Where(content => content.Category.GroupId == groupId);

        if (query.CategoryId is { } categoryId)
            contents = contents.Where(content => content.CategoryId == categoryId);

        foreach (var word in query.SearchWords)
        {
            var pattern = LikePattern.Contains(word);
            contents = contents.Where(content =>
                EF.Functions.Like(content.SearchText, pattern, LikePattern.EscapeCharacter));
        }

        return contents;
    }
}
