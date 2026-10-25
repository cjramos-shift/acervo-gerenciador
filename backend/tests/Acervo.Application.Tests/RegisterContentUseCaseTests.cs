using Acervo.Application.Contents.Shared;
using Acervo.Application.Tests.Support;
using Acervo.Domain.Contents;
using Acervo.Domain.Shared;

namespace Acervo.Application.Tests;

public class RegisterContentUseCaseTests
{
    private readonly UseCaseFixture _fixture = new();

    [Fact]
    public async Task Execute_CreatesGroupCategoryAndContentInOneCommit()
    {
        var contentId = await _fixture.Register.ExecuteAsync(UseCaseFixture.ValidForm(), CancellationToken.None);

        var content = Assert.Single(_fixture.Contents.Items);
        Assert.Equal(contentId, content.Id);
        Assert.Equal("Livros", content.Category.Group.Name);
        Assert.Equal("TI", content.Category.Name);
        Assert.Single(_fixture.Groups.Items);
        Assert.Equal(1, _fixture.UnitOfWork.CommitCount);
    }

    [Fact]
    public async Task Execute_FillsSearchTextWithNormalizedTerms()
    {
        await _fixture.Register.ExecuteAsync(UseCaseFixture.ValidForm(), CancellationToken.None);

        var searchText = _fixture.Contents.Items[0].SearchText;

        Assert.Contains("livros interessantes para analise", searchText);
        Assert.Contains("c how to program", searchText);
    }

    [Fact]
    public async Task Execute_ReusesExistingGroupIgnoringCaseAndAddsNewCategory()
    {
        await _fixture.Register.ExecuteAsync(UseCaseFixture.ValidForm(), CancellationToken.None);
        var second = UseCaseFixture.ValidForm() with { Category = new CategoryReference("  livros ", "Eletrônica") };

        await _fixture.Register.ExecuteAsync(second, CancellationToken.None);

        var group = Assert.Single(_fixture.Groups.Items);
        Assert.Equal(2, group.Categories.Count);
        Assert.Equal(2, _fixture.Contents.Items.Count);
    }

    [Fact]
    public async Task Execute_StoresLinksAndAttachmentsOnTheContent()
    {
        var form = UseCaseFixture.ValidForm() with
        {
            Links = [new ReferenceLinkInput("https://exemplo.com", "Documentação")],
            Images = [new ImageUploadInput(TestUploads.Png(), "Capa do livro")],
            Files = [TestUploads.Pdf("resumo.pdf")]
        };

        await _fixture.Register.ExecuteAsync(form, CancellationToken.None);

        var content = _fixture.Contents.Items[0];
        Assert.Single(content.ReferenceLinks);
        Assert.Equal(2, content.Attachments.Count);
        Assert.Equal(2, _fixture.Storage.Files.Count);
        Assert.Contains("documentacao", content.SearchText);
    }

    [Fact]
    public async Task Execute_StoresTheCanonicalContentTypeAndCleanFileName()
    {
        var form = UseCaseFixture.ValidForm() with { Files = [TestUploads.Pdf("../pasta/resumo.pdf")] };

        await _fixture.Register.ExecuteAsync(form, CancellationToken.None);

        var attachment = _fixture.Contents.Items[0].Attachments.Single();
        Assert.Equal("resumo.pdf", attachment.OriginalFileName);
        Assert.Equal("application/pdf", attachment.ContentType);
    }

    [Fact]
    public async Task Execute_WithInvalidTitle_StoresNothingAndDoesNotCommit()
    {
        var form = UseCaseFixture.ValidForm() with { Title = "ab", Files = [TestUploads.Pdf()] };

        await Assert.ThrowsAsync<DomainException>(() => _fixture.Register.ExecuteAsync(form, CancellationToken.None));

        Assert.Empty(_fixture.Storage.Files);
        Assert.Equal(0, _fixture.UnitOfWork.CommitCount);
        Assert.Empty(_fixture.Contents.Items);
    }

    [Fact]
    public async Task Execute_WithInvalidLink_ReportsTheIndexedField()
    {
        var form = UseCaseFixture.ValidForm() with
        {
            Links = [new ReferenceLinkInput("https://ok.com", null), new ReferenceLinkInput("javascript:x", null)]
        };

        var error = await Assert.ThrowsAsync<DomainException>(() =>
            _fixture.Register.ExecuteAsync(form, CancellationToken.None));

        Assert.True(error.Errors.ContainsKey("links[1].url"));
    }

    [Fact]
    public async Task Execute_WithInvalidImageDescription_ReportsFieldAndStoresNoFile()
    {
        var form = UseCaseFixture.ValidForm() with
        {
            Images = [new ImageUploadInput(TestUploads.Png(), new string('d', ContentRules.AttachmentDescriptionMaxLength + 1))]
        };

        var error = await Assert.ThrowsAsync<DomainException>(() =>
            _fixture.Register.ExecuteAsync(form, CancellationToken.None));

        Assert.True(error.Errors.ContainsKey("images[0].description"));
        Assert.Empty(_fixture.Storage.Files);
    }

    [Fact]
    public async Task Execute_WhenCommitFails_DiscardsTheStoredFiles()
    {
        _fixture.UnitOfWork.ShouldFail = true;
        var form = UseCaseFixture.ValidForm() with { Files = [TestUploads.Pdf()] };

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _fixture.Register.ExecuteAsync(form, CancellationToken.None));

        Assert.Empty(_fixture.Storage.Files);
        Assert.Single(_fixture.Storage.DeletedKeys);
    }
}
