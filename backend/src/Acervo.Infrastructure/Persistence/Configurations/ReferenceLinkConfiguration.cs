using Acervo.Domain.Contents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Acervo.Infrastructure.Persistence.Configurations;

internal sealed class ReferenceLinkConfiguration : IEntityTypeConfiguration<ReferenceLink>
{
    private const int MaxUrlLength = 2048;

    public void Configure(EntityTypeBuilder<ReferenceLink> builder)
    {
        builder.ToTable("ReferenceLinks");
        builder.HasKey(link => link.Id);
        builder.Property(link => link.Id).ValueGeneratedNever();
        builder.Property(link => link.Url).HasMaxLength(MaxUrlLength).IsRequired();
        builder.Property(link => link.Label).HasMaxLength(ContentRules.LinkLabelMaxLength);
        builder.HasIndex(link => link.ContentId);
    }
}
