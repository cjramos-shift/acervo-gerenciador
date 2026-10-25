using Acervo.Domain.Groups;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Categories;

public sealed class Category
{
    private Category()
    {
        Name = null!;
        NormalizedName = null!;
        Group = null!;
    }

    public Guid Id { get; private set; }
    public Guid GroupId { get; private set; }
    public Group Group { get; private set; }
    public string Name { get; private set; }
    public string NormalizedName { get; private set; }
    public DateTime CreatedAt { get; private set; }

    internal static Category CreateIn(Group group, string cleanName, DateTime createdAtUtc) => new()
    {
        Id = Guid.CreateVersion7(),
        GroupId = group.Id,
        Group = group,
        Name = cleanName,
        NormalizedName = TextNormalizer.ForUniqueness(cleanName),
        CreatedAt = createdAtUtc
    };
}
