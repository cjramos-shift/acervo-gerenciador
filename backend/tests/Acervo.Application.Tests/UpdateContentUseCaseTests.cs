using Acervo.Application.Contents.Shared;
using Acervo.Application.Contents.UpdateContent;
using Acervo.Application.Shared;
using Acervo.Application.Tests.Support;

namespace Acervo.Application.Tests;

public class UpdateContentUseCaseTests
{
    private readonly UseCaseFixture _fixture = new();

    private async Task<Guid> RegisterContentWithImageAsync()
    {
        var form = UseCaseFixture.ValidForm() with { Images = [new ImageUploadInput(TestUploads.Png(), null)] };
        return await _fixture.Register.ExecuteAsync(form, CancellationToken.None);
    }

    [Fact]
    public async Task Execute_UpdatesTextAndMovesTheContentToAnotherCategory()
    {
        var contentId = await RegisterContentWithImageAsync();
        var form = UseCaseFixture.ValidForm() with
        {
            Title = "Título atualizado",
            Category = new CategoryReference("Artigos", "Saúde")
        };

        await _fixture.Update.ExecuteAsync(new UpdateContentInput(contentId, form, []), CancellationToken.None);

        var content = _fixture.Contents.Items[0];
        Assert.Equal("Título atualizado", content.Title);
        Assert.Equal("Artigos", content.Category.Group.Name);
        Assert.Contains("saude", content.SearchText);
    }

    [Fact]
    public async Task Execute_RemovingAnAttachmentDeletesItsFileAfterCommit()
    {
        var contentId = await RegisterContentWithImageAsync();
        var attachmentId = _fixture.Contents.Items[0].Attachments.Single().Id;

        await _fixture.Update.ExecuteAsync(
            new UpdateContentInput(contentId, UseCaseFixture.ValidForm(), [attachmentId]), CancellationToken.None);

        Assert.Empty(_fixture.Contents.Items[0].Attachments);
        Assert.Empty(_fixture.Storage.Files);
    }

    [Fact]
    public async Task Execute_WhenCommitFails_KeepsOldFilesAndDiscardsNewOnes()
    {
        var contentId = await RegisterContentWithImageAsync();
        var oldKey = _fixture.Contents.Items[0].Attachments.Single().StorageKey;
        _fixture.UnitOfWork.ShouldFail = true;
        var form = UseCaseFixture.ValidForm() with { Files = [TestUploads.Pdf()] };

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _fixture.Update.ExecuteAsync(new UpdateContentInput(contentId, form, []), CancellationToken.None));

        Assert.Equal([oldKey], _fixture.Storage.Files.Keys.ToArray());
    }

    [Fact]
    public async Task Execute_ForUnknownContent_ThrowsNotFound() =>
        await Assert.ThrowsAsync<NotFoundException>(() => _fixture.Update.ExecuteAsync(
            new UpdateContentInput(Guid.NewGuid(), UseCaseFixture.ValidForm(), []), CancellationToken.None));
}
