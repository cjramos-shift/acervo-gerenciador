using Acervo.Domain.Categories;
using Acervo.Domain.Contents;
using Acervo.Domain.Groups;
using Microsoft.EntityFrameworkCore;

namespace Acervo.Infrastructure.Persistence;

public sealed class AcervoDbContext(DbContextOptions<AcervoDbContext> options) : DbContext(options)
{
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Content> Contents => Set<Content>();
    public DbSet<ReferenceLink> ReferenceLinks => Set<ReferenceLink>();
    public DbSet<Attachment> Attachments => Set<Attachment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AcervoDbContext).Assembly);
}
