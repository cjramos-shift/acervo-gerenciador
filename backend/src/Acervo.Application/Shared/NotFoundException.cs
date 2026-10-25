namespace Acervo.Application.Shared;

public sealed class NotFoundException(string message) : Exception(message);
