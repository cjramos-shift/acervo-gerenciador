namespace Acervo.Application.Contents.ListContents;

public sealed record ListContentsInput(
    Guid? GroupId = null,
    Guid? CategoryId = null,
    string? SearchTerm = null,
    int Page = 1,
    int PageSize = ListContentsUseCase.DefaultPageSize);
