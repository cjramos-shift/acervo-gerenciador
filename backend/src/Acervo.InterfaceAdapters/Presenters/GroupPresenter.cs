using Acervo.Application.Groups.ListGroups;
using Acervo.InterfaceAdapters.ViewModels;

namespace Acervo.InterfaceAdapters.Presenters;

public static class GroupPresenter
{
    public static IReadOnlyList<GroupNodeViewModel> Present(IReadOnlyList<GroupNodeOutput> groups) =>
        groups.Select(group => new GroupNodeViewModel(
            group.Id,
            group.Name,
            group.ContentCount,
            group.Categories
                .Select(category => new CategoryNodeViewModel(category.Id, category.Name, category.ContentCount))
                .ToList()))
            .ToList();
}
