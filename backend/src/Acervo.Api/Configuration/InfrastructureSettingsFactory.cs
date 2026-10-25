using Acervo.Infrastructure;

namespace Acervo.Api.Configuration;

internal static class InfrastructureSettingsFactory
{
    public static InfrastructureSettings Create(IConfiguration configuration, IHostEnvironment environment) => new(
        ResolvePath(configuration, "Database:Path", environment),
        ResolvePath(configuration, "FileStorage:RootPath", environment));

    private static string ResolvePath(IConfiguration configuration, string key, IHostEnvironment environment)
    {
        var configuredPath = configuration[key]
                             ?? throw new InvalidOperationException($"Configuração '{key}' ausente.");

        return Path.GetFullPath(Path.Combine(environment.ContentRootPath, configuredPath));
    }
}
