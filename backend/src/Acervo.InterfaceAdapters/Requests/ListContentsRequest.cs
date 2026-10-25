using Acervo.Application.Contents.ListContents;

namespace Acervo.InterfaceAdapters.Requests;

public sealed class ListContentsRequest
{
    public Guid? GroupId { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = ListContentsUseCase.DefaultPageSize;

    public ListContentsInput ToInput() => new(GroupId, CategoryId, Search, Page, PageSize);
}
