using Acervo.Domain.Shared;

namespace Acervo.Application.Shared;

public enum FileRejectionReason
{
    UnsupportedType,
    TooLarge,
    Invalid
}

public sealed class FileRejectedException(string field, FileRejectionReason reason, string message)
    : DomainException(field, message)
{
    public FileRejectionReason Reason { get; } = reason;
}
