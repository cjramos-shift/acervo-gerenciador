using Acervo.Domain.Contents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Acervo.Infrastructure.Persistence.Configurations;

internal sealed class ContentConfiguration : IEntityTypeConfiguration<Content>
{
    public void Configure(EntityTypeBuilder<Content> builder)
    {
        builder.ToTable("Contents");
        builder.HasKey(content => content.Id);
        builder.Property(content => content.Id).ValueGeneratedNever();
        builder.Property(content => content.Title).HasMaxLength(ContentRules.TitleMaxLength).IsRequired();
        builder.Property(content => content.Body).IsRequired();
        builder.Property(content => content.SearchText).IsRequired();
        builder.Property(content => content.CreatedAt).HasUtcConversion();
        builder.Property(content => content.UpdatedAt).HasUtcConversion();

        builder.HasOne(content => content.Category)
            .WithMany()
            .HasForeignKey(content => content.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(content => content.ReferenceLinks)
            .WithOne()
            .HasForeignKey(link => link.ContentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(content => content.Attachments)
            .WithOne()
            .HasForeignKey(attachment => attachment.ContentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(content => content.ReferenceLinks).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(content => content.Attachments).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(content => new { content.CategoryId, content.UpdatedAt }).IsDescending(false, true);
    }
}
