using Acervo.Application.Groups.ListGroups;
using Acervo.InterfaceAdapters.Presenters;
using Acervo.InterfaceAdapters.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Acervo.InterfaceAdapters.Controllers;

[ApiController]
[Route("api/groups")]
public sealed class GroupsController(ListGroupsUseCase listGroups) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GroupNodeViewModel>>> List(CancellationToken cancellationToken)
    {
        var groups = await listGroups.ExecuteAsync(cancellationToken);
        return Ok(GroupPresenter.Present(groups));
    }
}
