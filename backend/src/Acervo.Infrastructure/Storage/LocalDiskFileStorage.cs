using Acervo.Application.Ports;
using Microsoft.Extensions.Logging;

namespace Acervo.Infrastructure.Storage;

internal sealed class LocalDiskFileStorage : IFileStorage
{
    private const int BufferSize = 81920;

    private readonly string _rootPath;
    private readonly TimeProvider _clock;
    private readonly ILogger<LocalDiskFileStorage> _logger;

    public LocalDiskFileStorage(string rootPath, TimeProvider clock, ILogger<LocalDiskFileStorage> logger)
    {
        _rootPath = Path.GetFullPath(rootPath);
        _clock = clock;
        _logger = logger;
    }

    public async Task<string> SaveAsync(Stream content, string extension, CancellationToken cancellationToken)
    {
        var storageKey = NewStorageKey(extension);
        var fullPath = ResolvePath(storageKey);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        try
        {
            await using var file = new FileStream(
                fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, BufferSize, useAsync: true);
            await content.CopyToAsync(file, cancellationToken);
        }
        catch
        {
            File.Delete(fullPath);
            throw;
        }

        return storageKey;
    }

    public Task<Stream> OpenReadAsync(string storageKey, CancellationToken cancellationToken)
    {
        var fullPath = ResolvePath(storageKey);

        if (!File.Exists(fullPath))
            throw new FileNotFoundException("Arquivo não encontrado no armazenamento.", storageKey);

        Stream stream = new FileStream(
            fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, BufferSize,
            FileOptions.Asynchronous | FileOptions.SequentialScan);

        return Task.FromResult(stream);
    }

    public Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
    {
        try
        {
            File.Delete(ResolvePath(storageKey));
        }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException)
        {
            _logger.LogWarning(error, "Não foi possível remover o arquivo {StorageKey}.", storageKey);
        }

        return Task.CompletedTask;
    }

    private string NewStorageKey(string extension)
    {
        var now = _clock.GetUtcNow();
        return $"{now:yyyy}/{now:MM}/{Guid.CreateVersion7():N}{extension}";
    }

    private string ResolvePath(string storageKey)
    {
        var fullPath = Path.GetFullPath(Path.Combine(_rootPath, storageKey));
        var isInsideRoot = fullPath.StartsWith(_rootPath + Path.DirectorySeparatorChar, StringComparison.Ordinal);

        return isInsideRoot
            ? fullPath
            : throw new ArgumentException("Chave de armazenamento inválida.", nameof(storageKey));
    }
}
