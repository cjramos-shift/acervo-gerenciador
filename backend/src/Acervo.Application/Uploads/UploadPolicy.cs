using Acervo.Application.Shared;
using Acervo.Domain.Contents;

namespace Acervo.Application.Uploads;

public sealed class UploadPolicy
{
    public const long MaxImageBytes = 5L * 1024 * 1024;
    public const long MaxFileBytes = 20L * 1024 * 1024;
    private const long RequestOverheadBytes = 1L * 1024 * 1024;
    private const int MaxFileNameLength = 255;

    public const long MaxRequestBytes =
        ContentRules.MaxImages * MaxImageBytes + ContentRules.MaxFiles * MaxFileBytes + RequestOverheadBytes;

    private static readonly IReadOnlyDictionary<string, string> ImageTypes = new Dictionary<string, string>
    {
        [".png"] = "image/png",
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg",
        [".webp"] = "image/webp",
        [".gif"] = "image/gif"
    };

    private static readonly IReadOnlyDictionary<string, string> FileTypes = new Dictionary<string, string>
    {
        [".pdf"] = "application/pdf",
        [".txt"] = "text/plain",
        [".md"] = "text/markdown",
        [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        [".xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        [".pptx"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        [".zip"] = "application/zip"
    };

    public ValidatedUpload Validate(UploadedFileInput file, AttachmentKind kind, string field)
    {
        var allowedTypes = kind == AttachmentKind.Image ? ImageTypes : FileTypes;
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedTypes.TryGetValue(extension, out var contentType))
            throw Reject(field, FileRejectionReason.UnsupportedType,
                $"Tipo de arquivo não permitido. Use: {string.Join(", ", allowedTypes.Keys)}.");

        EnsureSize(file, kind, field);

        if (kind == AttachmentKind.Image && !HasImageSignature(file, extension))
            throw Reject(field, FileRejectionReason.UnsupportedType,
                $"O conteúdo do arquivo não corresponde a uma imagem {extension}.");

        return new ValidatedUpload(file, kind, extension, contentType);
    }

    public static string CleanFileName(string fileName)
    {
        var nameOnly = Path.GetFileName(fileName);
        var printable = new string(nameOnly.Where(character => !char.IsControl(character)).ToArray());
        return printable.Length <= MaxFileNameLength ? printable : printable[^MaxFileNameLength..];
    }

    private static void EnsureSize(UploadedFileInput file, AttachmentKind kind, string field)
    {
        var maxBytes = kind == AttachmentKind.Image ? MaxImageBytes : MaxFileBytes;

        if (file.Length <= 0)
            throw Reject(field, FileRejectionReason.Invalid, "O arquivo está vazio.");

        if (file.Length > maxBytes)
            throw Reject(field, FileRejectionReason.TooLarge,
                $"O arquivo ultrapassa o limite de {maxBytes / (1024 * 1024)} MB.");
    }

    private static bool HasImageSignature(UploadedFileInput file, string extension)
    {
        using var stream = file.OpenRead();
        var header = new byte[ImageSignature.HeaderLength];
        var bytesRead = stream.ReadAtLeast(header, header.Length, throwOnEndOfStream: false);
        return ImageSignature.Matches(extension, header.AsSpan(0, bytesRead));
    }

    private static FileRejectedException Reject(string field, FileRejectionReason reason, string message) =>
        new(field, reason, message);
}
