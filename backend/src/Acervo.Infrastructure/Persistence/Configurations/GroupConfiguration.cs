using Acervo.Domain.Groups;
using Acervo.Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Acervo.Infrastructure.Persistence.Configurations;

internal sealed class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups");
        builder.HasKey(group => group.Id);
        builder.Property(group => group.Id).ValueGeneratedNever();
        builder.Property(group => group.Name).HasMaxLength(NameRules.MaxLength).IsRequired();
        builder.Property(group => group.NormalizedName).HasMaxLength(NameRules.MaxLength * 2).IsRequired();
        builder.Property(group => group.CreatedAt).HasUtcConversion();
        builder.HasIndex(group => group.NormalizedName).IsUnique();

        builder.HasMany(group => group.Categories)
            .WithOne(category => category.Group)
            .HasForeignKey(category => category.GroupId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(group => group.Categories).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
