using Acervo.Application.Contents.ListContents;
using Acervo.Application.Tests.Support;

namespace Acervo.Application.Tests;

public class ListContentsUseCaseTests
{
    private readonly InMemoryContentRepository _contents = new();

    private async Task<Acervo.Application.Contents.Shared.ContentQuery> RunAsync(ListContentsInput input)
    {
        await new ListContentsUseCase(_contents).ExecuteAsync(input, CancellationToken.None);
        return _contents.LastQuery!;
    }

    [Fact]
    public async Task Execute_UsesDefaultsWhenNothingIsInformed()
    {
        var query = await RunAsync(new ListContentsInput());

        Assert.Equal(1, query.Page);
        Assert.Equal(ListContentsUseCase.DefaultPageSize, query.PageSize);
        Assert.Empty(query.SearchWords);
    }

    [Fact]
    public async Task Execute_ClampsPageAndPageSize()
    {
        var query = await RunAsync(new ListContentsInput(Page: -4, PageSize: 9999));

        Assert.Equal(1, query.Page);
        Assert.Equal(ListContentsUseCase.MaxPageSize, query.PageSize);
    }

    [Fact]
    public async Task Execute_PassesFiltersAndNormalizedSearchWords()
    {
        var groupId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();

        var query = await RunAsync(new ListContentsInput(groupId, categoryId, "Álgebra Relacional"));

        Assert.Equal(groupId, query.GroupId);
        Assert.Equal(categoryId, query.CategoryId);
        Assert.Equal(["algebra", "relacional"], query.SearchWords.ToArray());
    }
}
