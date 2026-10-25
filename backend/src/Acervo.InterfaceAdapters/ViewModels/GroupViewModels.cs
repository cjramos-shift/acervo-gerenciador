namespace Acervo.InterfaceAdapters.ViewModels;

public sealed record CategoryNodeViewModel(Guid Id, string Name, int ContentCount);

public sealed record GroupNodeViewModel(
    Guid Id,
    string Name,
    int ContentCount,
    IReadOnlyList<CategoryNodeViewModel> Categories);
