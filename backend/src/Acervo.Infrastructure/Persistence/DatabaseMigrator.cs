using Microsoft.EntityFrameworkCore;

namespace Acervo.Infrastructure.Persistence;

public static class DatabaseMigrator
{
    private const string MissingMigrationsMessage =
        "Nenhuma migration encontrada. Gere a migration inicial (veja o README, passo 'Banco de dados'): " +
        "dotnet ef migrations add InitialCreate --project src/Acervo.Infrastructure " +
        "--startup-project src/Acervo.Api --output-dir Persistence/Migrations";

    public static async Task MigrateAsync(AcervoDbContext database, CancellationToken cancellationToken)
    {
        if (!database.Database.GetMigrations().Any())
            throw new InvalidOperationException(MissingMigrationsMessage);

        await database.Database.MigrateAsync(cancellationToken);
    }
}
