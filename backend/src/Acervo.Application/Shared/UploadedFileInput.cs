namespace Acervo.Application.Shared;

public sealed record UploadedFileInput(Func<Stream> OpenRead, string FileName, long Length);
