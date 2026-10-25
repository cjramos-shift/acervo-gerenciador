namespace Acervo.Domain.Shared;

public class DomainException : Exception
{
    private readonly Dictionary<string, string[]> _errors;

    public DomainException(string field, string message) : base(message)
    {
        _errors = new Dictionary<string, string[]> { [field] = [message] };
    }

    private DomainException(Dictionary<string, string[]> errors, string message) : base(message)
    {
        _errors = errors;
    }

    public IReadOnlyDictionary<string, string[]> Errors => _errors;

    public DomainException WithFieldPrefix(string prefix)
    {
        var prefixedErrors = _errors.ToDictionary(error => $"{prefix}.{error.Key}", error => error.Value);
        return new DomainException(prefixedErrors, Message);
    }
}
