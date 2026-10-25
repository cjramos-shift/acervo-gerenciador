using Acervo.Application.Groups.ListGroups;
using Acervo.Domain.Groups;

namespace Acervo.Application.Ports;

public interface IGroupRepository
{
    Task<Group?> FindByNameAsync(string name, CancellationToken cancellationToken);
    Task<IReadOnlyList<GroupNodeOutput>> ListTreeAsync(CancellationToken cancellationToken);
    void Add(Group group);
}
