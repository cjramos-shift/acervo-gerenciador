using Acervo.Application.Ports;

namespace Acervo.Application.Tests.Support;

internal sealed class FakeFileStorage : IFileStorage
{
    public Dictionary<string, byte[]> Files { get; } = new();
    public List<string> DeletedKeys { get; } = [];

    public async Task<string> SaveAsync(Stream content, string extension, CancellationToken cancellationToken)
    {
        using var buffer = new MemoryStream();
        await content.CopyToAsync(buffer, cancellationToken);

        var key = $"file-{Files.Count + DeletedKeys.Count + 1}{extension}";
        Files[key] = buffer.ToArray();
        return key;
    }

    public Task<Stream> OpenReadAsync(string storageKey, CancellationToken cancellationToken)
    {
        if (!Files.TryGetValue(storageKey, out var bytes))
            throw new FileNotFoundException(storageKey);

        return Task.FromResult<Stream>(new MemoryStream(bytes));
    }

    public Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
    {
        Files.Remove(storageKey);
        DeletedKeys.Add(storageKey);
        return Task.CompletedTask;
    }
}
