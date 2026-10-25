using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Acervo.Infrastructure.Persistence;

internal static class UtcDateTimeConversion
{
    private static readonly ValueConverter<DateTime, DateTime> Converter = new(
        value => value,
        stored => DateTime.SpecifyKind(stored, DateTimeKind.Utc));

    public static PropertyBuilder<DateTime> HasUtcConversion(this PropertyBuilder<DateTime> property) =>
        property.HasConversion(Converter);
}
