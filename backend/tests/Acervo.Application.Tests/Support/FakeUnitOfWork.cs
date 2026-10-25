using Acervo.Application.Ports;

namespace Acervo.Application.Tests.Support;

internal sealed class FakeUnitOfWork : IUnitOfWork
{
    public int CommitCount { get; private set; }
    public bool ShouldFail { get; set; }

    public Task CommitAsync(CancellationToken cancellationToken)
    {
        if (ShouldFail)
            throw new InvalidOperationException("Falha simulada ao confirmar.");

        CommitCount++;
        return Task.CompletedTask;
    }
}
