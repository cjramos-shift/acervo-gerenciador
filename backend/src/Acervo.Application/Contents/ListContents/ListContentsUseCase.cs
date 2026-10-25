using Acervo.Application.Contents.Shared;
using Acervo.Application.Ports;
using Acervo.Application.Shared;

namespace Acervo.Application.Contents.ListContents;

public sealed class ListContentsUseCase(IContentRepository contents)
{
    public const int DefaultPageSize = 12;
    public const int MaxPageSize = 50;

    public Task<PagedResult<ContentSummaryOutput>> ExecuteAsync(
        ListContentsInput input, CancellationToken cancellationToken) =>
        contents.ListSummariesAsync(BuildQuery(input), cancellationToken);

    private static ContentQuery BuildQuery(ListContentsInput input) => new(
        input.GroupId,
        input.CategoryId,
        SearchWords.From(input.SearchTerm),
        Math.Max(input.Page, 1),
        Math.Clamp(input.PageSize, 1, MaxPageSize));
}
