using Acervo.Domain.Categories;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Groups;

public sealed class Group
{
    private readonly List<Category> _categories = [];

    private Group()
    {
        Name = null!;
        NormalizedName = null!;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string NormalizedName { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public IReadOnlyCollection<Category> Categories => _categories.AsReadOnly();

    public static Group Create(string name, DateTime createdAtUtc)
    {
        var cleanName = NameRules.Clean(name, "groupName");

        return new Group
        {
            Id = Guid.CreateVersion7(),
            Name = cleanName,
            NormalizedName = TextNormalizer.ForUniqueness(cleanName),
            CreatedAt = createdAtUtc
        };
    }

    public Category GetOrAddCategory(string categoryName, DateTime nowUtc)
    {
        var cleanName = NameRules.Clean(categoryName, "categoryName");
        var normalizedName = TextNormalizer.ForUniqueness(cleanName);

        var existing = _categories.FirstOrDefault(category => category.NormalizedName == normalizedName);
        if (existing is not null)
            return existing;

        var created = Category.CreateIn(this, cleanName, nowUtc);
        _categories.Add(created);
        return created;
    }
}
