using Acervo.Application.Contents.Shared;
using Acervo.Application.Shared;
using Acervo.Application.Tests.Support;

namespace Acervo.Application.Tests;

public class DeleteContentUseCaseTests
{
    private readonly UseCaseFixture _fixture = new();

    [Fact]
    public async Task Execute_RemovesTheContentAndItsPhysicalFiles()
    {
        var form = UseCaseFixture.ValidForm() with { Files = [TestUploads.Pdf()] };
        var contentId = await _fixture.Register.ExecuteAsync(form, CancellationToken.None);

        await _fixture.Delete.ExecuteAsync(contentId, CancellationToken.None);

        Assert.Empty(_fixture.Contents.Items);
        Assert.Empty(_fixture.Storage.Files);
    }

    [Fact]
    public async Task Execute_ForUnknownContent_ThrowsNotFound() =>
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _fixture.Delete.ExecuteAsync(Guid.NewGuid(), CancellationToken.None));
}
