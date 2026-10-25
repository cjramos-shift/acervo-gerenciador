using System.Globalization;
using Acervo.Application.Groups.ListGroups;
using Acervo.Application.Ports;
using Acervo.Domain.Groups;
using Acervo.Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Acervo.Infrastructure.Persistence.Repositories;

internal sealed class EfGroupRepository(AcervoDbContext database) : IGroupRepository
{
    private static readonly StringComparer NameComparer =
        StringComparer.Create(CultureInfo.GetCultureInfo("pt-BR"), ignoreCase: true);

    public Task<Group?> FindByNameAsync(string name, CancellationToken cancellationToken)
    {
        var normalizedName = TextNormalizer.ForUniqueness(name);

        return database.Groups
            .Include(group => group.Categories)
            .FirstOrDefaultAsync(group => group.NormalizedName == normalizedName, cancellationToken);
    }

    public async Task<IReadOnlyList<GroupNodeOutput>> ListTreeAsync(CancellationToken cancellationToken)
    {
        var groups = await database.Groups
            .AsNoTracking()
            .Include(group => group.Categories)
            .ToListAsync(cancellationToken);

        var countsByCategory = await CountContentsByCategoryAsync(cancellationToken);

        return groups
            .OrderBy(group => group.Name, NameComparer)
            .Select(group => ToNode(group, countsByCategory))
            .ToList();
    }

    public void Add(Group group) => database.Groups.Add(group);

    private async Task<Dictionary<Guid, int>> CountContentsByCategoryAsync(CancellationToken cancellationToken) =>
        await database.Contents
            .AsNoTracking()
            .GroupBy(content => content.CategoryId)
            .Select(grouping => new { CategoryId = grouping.Key, Total = grouping.Count() })
            .ToDictionaryAsync(entry => entry.CategoryId, entry => entry.Total, cancellationToken);

    private static GroupNodeOutput ToNode(Group group, IReadOnlyDictionary<Guid, int> countsByCategory)
    {
        var categories = group.Categories
            .OrderBy(category => category.Name, NameComparer)
            .Select(category => new CategoryNodeOutput(
                category.Id, category.Name, countsByCategory.GetValueOrDefault(category.Id)))
            .ToList();

        return new GroupNodeOutput(group.Id, group.Name, categories.Sum(category => category.ContentCount), categories);
    }
}
