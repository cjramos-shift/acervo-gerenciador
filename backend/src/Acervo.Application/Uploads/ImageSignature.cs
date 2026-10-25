namespace Acervo.Application.Uploads;

public static class ImageSignature
{
    public const int HeaderLength = 12;

    private static readonly byte[] Png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    private static readonly byte[] Jpeg = [0xFF, 0xD8, 0xFF];
    private static readonly byte[] Gif87 = "GIF87a"u8.ToArray();
    private static readonly byte[] Gif89 = "GIF89a"u8.ToArray();
    private static readonly byte[] Riff = "RIFF"u8.ToArray();
    private static readonly byte[] Webp = "WEBP"u8.ToArray();

    public static bool Matches(string extension, ReadOnlySpan<byte> header) => extension switch
    {
        ".png" => header.StartsWith(Png),
        ".jpg" or ".jpeg" => header.StartsWith(Jpeg),
        ".gif" => header.StartsWith(Gif87) || header.StartsWith(Gif89),
        ".webp" => header.StartsWith(Riff) && header.Length >= HeaderLength && header[8..12].SequenceEqual(Webp),
        _ => false
    };
}
