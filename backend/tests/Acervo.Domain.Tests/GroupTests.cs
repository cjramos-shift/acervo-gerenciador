using Acervo.Domain.Groups;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Tests;

public class GroupTests
{
    [Fact]
    public void GetOrAddCategory_ReusesExistingCategoryIgnoringCase()
    {
        var group = Group.Create("Livros", TestData.Now);

        var first = group.GetOrAddCategory("TI", TestData.Now);
        var second = group.GetOrAddCategory("  ti ", TestData.Now);

        Assert.Same(first, second);
        Assert.Single(group.Categories);
    }

    [Fact]
    public void GetOrAddCategory_AllowsSameNameInDifferentGroups()
    {
        var books = Group.Create("Livros", TestData.Now).GetOrAddCategory("TI", TestData.Now);
        var articles = Group.Create("Artigos", TestData.Now).GetOrAddCategory("TI", TestData.Now);

        Assert.NotEqual(books.Id, articles.Id);
        Assert.NotEqual(books.GroupId, articles.GroupId);
    }

    [Fact]
    public void GetOrAddCategory_LinksCategoryToItsGroup()
    {
        var group = Group.Create("Livros", TestData.Now);

        var category = group.GetOrAddCategory("TI", TestData.Now);

        Assert.Equal(group.Id, category.GroupId);
        Assert.Same(group, category.Group);
    }

    [Theory]
    [InlineData("")]
    [InlineData("a")]
    public void Create_RejectsInvalidName(string name)
    {
        var error = Assert.Throws<DomainException>(() => Group.Create(name, TestData.Now));

        Assert.True(error.Errors.ContainsKey("groupName"));
    }

    [Fact]
    public void GetOrAddCategory_RejectsInvalidName()
    {
        var group = Group.Create("Livros", TestData.Now);

        var error = Assert.Throws<DomainException>(() => group.GetOrAddCategory(" ", TestData.Now));

        Assert.True(error.Errors.ContainsKey("categoryName"));
    }
}
