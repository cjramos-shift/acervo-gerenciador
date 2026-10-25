using Acervo.Application.Ports;

namespace Acervo.Application.Groups.ListGroups;

public sealed class ListGroupsUseCase(IGroupRepository groups)
{
    public Task<IReadOnlyList<GroupNodeOutput>> ExecuteAsync(CancellationToken cancellationToken) =>
        groups.ListTreeAsync(cancellationToken);
}
