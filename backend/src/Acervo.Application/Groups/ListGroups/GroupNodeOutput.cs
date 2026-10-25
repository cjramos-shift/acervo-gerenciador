namespace Acervo.Application.Groups.ListGroups;

public sealed record CategoryNodeOutput(Guid Id, string Name, int ContentCount);

public sealed record GroupNodeOutput(
    Guid Id,
    string Name,
    int ContentCount,
    IReadOnlyList<CategoryNodeOutput> Categories);
