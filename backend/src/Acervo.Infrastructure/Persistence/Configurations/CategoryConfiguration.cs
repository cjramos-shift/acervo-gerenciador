using Acervo.Domain.Categories;
using Acervo.Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Acervo.Infrastructure.Persistence.Configurations;

internal sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(category => category.Id);
        builder.Property(category => category.Id).ValueGeneratedNever();
        builder.Property(category => category.Name).HasMaxLength(NameRules.MaxLength).IsRequired();
        builder.Property(category => category.NormalizedName).HasMaxLength(NameRules.MaxLength * 2).IsRequired();
        builder.Property(category => category.CreatedAt).HasUtcConversion();
        builder.HasIndex(category => new { category.GroupId, category.NormalizedName }).IsUnique();
    }
}
