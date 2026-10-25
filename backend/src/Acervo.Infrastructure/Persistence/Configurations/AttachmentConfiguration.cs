using Acervo.Domain.Contents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Acervo.Infrastructure.Persistence.Configurations;

internal sealed class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
{
    private const int MaxFileNameLength = 255;
    private const int MaxStorageKeyLength = 200;
    private const int MaxContentTypeLength = 150;
    private const int MaxKindLength = 10;

    public void Configure(EntityTypeBuilder<Attachment> builder)
    {
        builder.ToTable("Attachments");
        builder.HasKey(attachment => attachment.Id);
        builder.Property(attachment => attachment.Id).ValueGeneratedNever();
        builder.Property(attachment => attachment.Kind).HasConversion<string>().HasMaxLength(MaxKindLength);
        builder.Property(attachment => attachment.OriginalFileName).HasMaxLength(MaxFileNameLength).IsRequired();
        builder.Property(attachment => attachment.StorageKey).HasMaxLength(MaxStorageKeyLength).IsRequired();
        builder.Property(attachment => attachment.ContentType).HasMaxLength(MaxContentTypeLength).IsRequired();
        builder.Property(attachment => attachment.Description).HasMaxLength(ContentRules.AttachmentDescriptionMaxLength);
        builder.HasIndex(attachment => attachment.ContentId);
    }
}
