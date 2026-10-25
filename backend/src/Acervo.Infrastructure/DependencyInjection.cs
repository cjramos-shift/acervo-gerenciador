using Acervo.Application.Ports;
using Acervo.Infrastructure.Persistence;
using Acervo.Infrastructure.Persistence.Repositories;
using Acervo.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Acervo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, InfrastructureSettings settings)
    {
        EnsureDirectoriesExist(settings);

        services.AddDbContext<AcervoDbContext>(options =>
            options.UseSqlite($"Data Source={settings.DatabasePath}"));

        services.AddScoped<IUnitOfWork, EfUnitOfWork>();
        services.AddScoped<IContentRepository, EfContentRepository>();
        services.AddScoped<IGroupRepository, EfGroupRepository>();

        services.AddSingleton<IFileStorage>(provider => new LocalDiskFileStorage(
            settings.StorageRootPath,
            provider.GetRequiredService<TimeProvider>(),
            provider.GetRequiredService<ILogger<LocalDiskFileStorage>>()));

        return services;
    }

    private static void EnsureDirectoriesExist(InfrastructureSettings settings)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(settings.DatabasePath)!);
        Directory.CreateDirectory(settings.StorageRootPath);
    }
}
