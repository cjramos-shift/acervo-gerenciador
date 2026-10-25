using Acervo.Application.Ports;

namespace Acervo.Infrastructure.Persistence.Repositories;

internal sealed class EfUnitOfWork(AcervoDbContext database) : IUnitOfWork
{
    public Task CommitAsync(CancellationToken cancellationToken) =>
        database.SaveChangesAsync(cancellationToken);
}
