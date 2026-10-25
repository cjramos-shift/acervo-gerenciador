using Acervo.Application.Contents.RegisterContent;
using Acervo.Application.Contents.Shared;
using Acervo.Application.Groups.ListGroups;
using Acervo.Infrastructure.Persistence;

namespace Acervo.Api.Configuration;

internal sealed class DevelopmentDatabaseInitializer(IServiceProvider services) : IHostedService
{
    private const string ExampleTitle = "Livros interessantes para análise";
    private const string ExampleGroup = "Livros";
    private const string ExampleCategory = "TI";

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = services.CreateScope();

        var database = scope.ServiceProvider.GetRequiredService<AcervoDbContext>();
        await DatabaseMigrator.MigrateAsync(database, cancellationToken);

        await SeedExampleContentAsync(scope.ServiceProvider, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private static async Task SeedExampleContentAsync(IServiceProvider scopedServices, CancellationToken cancellationToken)
    {
        var groups = await scopedServices.GetRequiredService<ListGroupsUseCase>().ExecuteAsync(cancellationToken);
        if (groups.Count > 0)
            return;

        var body = await File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Seed", "example-content.md"), cancellationToken);
        var form = new ContentFormInput(ExampleTitle, body, new CategoryReference(ExampleGroup, ExampleCategory), [], [], []);

        await scopedServices.GetRequiredService<RegisterContentUseCase>().ExecuteAsync(form, cancellationToken);
    }
}
