using Acervo.Application.Groups.ListGroups;
using Acervo.Application.Ports;
using Acervo.Domain.Groups;
using Acervo.Domain.Shared;

namespace Acervo.Application.Tests.Support;

internal sealed class InMemoryGroupRepository : IGroupRepository
{
    public List<Group> Items { get; } = [];

    public Task<Group?> FindByNameAsync(string name, CancellationToken cancellationToken)
    {
        var normalizedName = TextNormalizer.ForUniqueness(name);
        return Task.FromResult(Items.FirstOrDefault(group => group.NormalizedName == normalizedName));
    }

    public Task<IReadOnlyList<GroupNodeOutput>> ListTreeAsync(CancellationToken cancellationToken) =>
        Task.FromResult<IReadOnlyList<GroupNodeOutput>>([]);

    public void Add(Group group) => Items.Add(group);
}
