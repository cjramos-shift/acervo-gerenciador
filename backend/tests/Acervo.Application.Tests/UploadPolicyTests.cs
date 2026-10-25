using Acervo.Application.Shared;
using Acervo.Application.Tests.Support;
using Acervo.Application.Uploads;
using Acervo.Domain.Contents;

namespace Acervo.Application.Tests;

public class UploadPolicyTests
{
    private readonly UploadPolicy _policy = new();

    [Fact]
    public void Validate_AcceptsPngWithValidSignature()
    {
        var upload = _policy.Validate(TestUploads.Png("Foto.PNG"), AttachmentKind.Image, "images[0].file");

        Assert.Equal(".png", upload.Extension);
        Assert.Equal("image/png", upload.ContentType);
    }

    [Fact]
    public void Validate_AcceptsPdfAsFile()
    {
        var upload = _policy.Validate(TestUploads.Pdf(), AttachmentKind.File, "files[0]");

        Assert.Equal("application/pdf", upload.ContentType);
    }

    [Theory]
    [InlineData("script.exe")]
    [InlineData("desenho.svg")]
    [InlineData("semextensao")]
    public void Validate_RejectsImageExtensionsOutsideTheWhitelist(string fileName)
    {
        var error = Assert.Throws<FileRejectedException>(() =>
            _policy.Validate(TestUploads.FromBytes(fileName, [1, 2, 3]), AttachmentKind.Image, "images[0].file"));

        Assert.Equal(FileRejectionReason.UnsupportedType, error.Reason);
    }

    [Fact]
    public void Validate_RejectsFileExtensionOutsideTheWhitelist()
    {
        var error = Assert.Throws<FileRejectedException>(() =>
            _policy.Validate(TestUploads.FromBytes("setup.exe", [1]), AttachmentKind.File, "files[0]"));

        Assert.Equal(FileRejectionReason.UnsupportedType, error.Reason);
    }

    [Fact]
    public void Validate_RejectsImageWhoseContentDoesNotMatchItsExtension()
    {
        var disguised = TestUploads.FromBytes("foto.png", "isto nao e uma imagem"u8.ToArray());

        var error = Assert.Throws<FileRejectedException>(() =>
            _policy.Validate(disguised, AttachmentKind.Image, "images[0].file"));

        Assert.Equal(FileRejectionReason.UnsupportedType, error.Reason);
    }

    [Fact]
    public void Validate_RejectsImageAboveSizeLimit()
    {
        var huge = TestUploads.WithDeclaredLength("foto.png", [0x89], UploadPolicy.MaxImageBytes + 1);

        var error = Assert.Throws<FileRejectedException>(() =>
            _policy.Validate(huge, AttachmentKind.Image, "images[0].file"));

        Assert.Equal(FileRejectionReason.TooLarge, error.Reason);
    }

    [Fact]
    public void Validate_RejectsEmptyFile()
    {
        var empty = TestUploads.WithDeclaredLength("livro.pdf", [], 0);

        var error = Assert.Throws<FileRejectedException>(() =>
            _policy.Validate(empty, AttachmentKind.File, "files[0]"));

        Assert.Equal(FileRejectionReason.Invalid, error.Reason);
    }

    [Fact]
    public void CleanFileName_RemovesDirectoryTraversal() =>
        Assert.Equal("passwd.txt", UploadPolicy.CleanFileName("../../etc/passwd.txt"));
}
