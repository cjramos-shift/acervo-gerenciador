namespace Acervo.Application.Ports;

public interface IUnitOfWork
{
    Task CommitAsync(CancellationToken cancellationToken);
}
