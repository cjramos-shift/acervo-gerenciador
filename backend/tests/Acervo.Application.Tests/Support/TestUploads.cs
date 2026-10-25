using Acervo.Application.Shared;

namespace Acervo.Application.Tests.Support;

internal static class TestUploads
{
    private static readonly byte[] PngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    public static UploadedFileInput Png(string fileName = "foto.png") =>
        FromBytes(fileName, [.. PngHeader, 1, 2, 3, 4]);

    public static UploadedFileInput Pdf(string fileName = "livro.pdf") =>
        FromBytes(fileName, "%PDF-1.4 conteudo"u8.ToArray());

    public static UploadedFileInput FromBytes(string fileName, byte[] bytes) =>
        new(() => new MemoryStream(bytes), fileName, bytes.Length);

    public static UploadedFileInput WithDeclaredLength(string fileName, byte[] bytes, long length) =>
        new(() => new MemoryStream(bytes), fileName, length);
}
