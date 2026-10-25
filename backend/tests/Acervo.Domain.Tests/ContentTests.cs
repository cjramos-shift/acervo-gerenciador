using Acervo.Domain.Contents;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Tests;

public class ContentTests
{
    [Fact]
    public void Create_SetsCategoryAndTimestamps()
    {
        var category = TestData.NewCategory();

        var content = Content.Create(TestData.NewText(), category, TestData.Now);

        Assert.Equal(category.Id, content.CategoryId);
        Assert.Equal(TestData.Now, content.CreatedAt);
        Assert.Equal(TestData.Now, content.UpdatedAt);
    }

    [Fact]
    public void Edit_UpdatesFieldsAndUpdatedAtButKeepsCreatedAt()
    {
        var content = TestData.NewContent();
        var later = TestData.Now.AddHours(1);
        var newCategory = TestData.NewCategory("Artigos", "Saúde");

        content.Edit(ContentText.Create("Novo título", "Novo corpo"), newCategory, later);

        Assert.Equal("Novo título", content.Title);
        Assert.Equal(newCategory.Id, content.CategoryId);
        Assert.Equal(later, content.UpdatedAt);
        Assert.Equal(TestData.Now, content.CreatedAt);
    }

    [Fact]
    public void ReplaceReferenceLinks_KeepsInputOrder()
    {
        var content = TestData.NewContent();

        content.ReplaceReferenceLinks([TestData.NewLink("https://b.com"), TestData.NewLink("https://a.com")]);

        Assert.Equal(["https://b.com", "https://a.com"], content.ReferenceLinks.Select(link => link.Url).ToArray());
    }

    [Fact]
    public void ReplaceReferenceLinks_RejectsDuplicateUrlsIgnoringCase()
    {
        var content = TestData.NewContent();
        var links = new[] { TestData.NewLink("https://a.com"), TestData.NewLink("HTTPS://A.COM") };

        var error = Assert.Throws<DomainException>(() => content.ReplaceReferenceLinks(links));

        Assert.True(error.Errors.ContainsKey("links[1].url"));
    }

    [Fact]
    public void ReplaceReferenceLinks_RejectsMoreLinksThanTheLimit()
    {
        var content = TestData.NewContent();
        var links = Enumerable.Range(0, ContentRules.MaxReferenceLinks + 1)
            .Select(index => TestData.NewLink($"https://site{index}.com"))
            .ToList();

        Assert.Throws<DomainException>(() => content.ReplaceReferenceLinks(links));
    }

    [Fact]
    public void AddAttachments_RejectsMoreImagesThanTheLimit()
    {
        var content = TestData.NewContent();
        var images = Enumerable.Range(0, ContentRules.MaxImages + 1).Select(_ => TestData.NewAttachment()).ToList();

        var error = Assert.Throws<DomainException>(() => content.AddAttachments(images));

        Assert.True(error.Errors.ContainsKey("images"));
    }

    [Fact]
    public void AddAttachments_CountsImagesAndFilesSeparately()
    {
        var content = TestData.NewContent();
        var images = Enumerable.Range(0, ContentRules.MaxImages).Select(_ => TestData.NewAttachment()).ToList();
        var files = Enumerable.Range(0, ContentRules.MaxFiles).Select(_ => TestData.NewAttachment(AttachmentKind.File)).ToList();

        content.AddAttachments(images);
        content.AddAttachments(files);

        Assert.Equal(ContentRules.MaxImages + ContentRules.MaxFiles, content.Attachments.Count);
    }

    [Fact]
    public void RemoveAttachments_ReturnsTheRemovedOnes()
    {
        var content = TestData.NewContent();
        var keep = TestData.NewAttachment();
        var remove = TestData.NewAttachment();
        content.AddAttachments([keep, remove]);

        var removed = content.RemoveAttachments([remove.Id]);

        Assert.Single(removed);
        Assert.Same(remove, removed[0]);
        Assert.Single(content.Attachments);
    }

    [Fact]
    public void RemoveAttachments_RejectsAttachmentFromAnotherContent()
    {
        var content = TestData.NewContent();

        var error = Assert.Throws<DomainException>(() => content.RemoveAttachments([Guid.NewGuid()]));

        Assert.True(error.Errors.ContainsKey("removedAttachmentIds"));
    }
}
