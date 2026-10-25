using Acervo.Domain.Categories;
using Acervo.Domain.Shared;

namespace Acervo.Domain.Contents;

public sealed class Content
{
    private readonly List<ReferenceLink> _referenceLinks = [];
    private readonly List<Attachment> _attachments = [];

    private Content()
    {
        Title = null!;
        Body = null!;
        SearchText = null!;
        Category = null!;
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public string Body { get; private set; }
    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; }
    public string SearchText { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public IReadOnlyCollection<ReferenceLink> ReferenceLinks =>
        _referenceLinks.OrderBy(link => link.Position).ToArray();

    public IReadOnlyCollection<Attachment> Attachments =>
        _attachments.OrderBy(attachment => attachment.Position).ToArray();

    public static Content Create(ContentText text, Category category, DateTime nowUtc)
    {
        var content = new Content
        {
            Id = Guid.CreateVersion7(),
            CreatedAt = nowUtc
        };

        content.Edit(text, category, nowUtc);
        return content;
    }

    public void Edit(ContentText text, Category category, DateTime nowUtc)
    {
        Title = text.Title;
        Body = text.Body;
        Category = category;
        CategoryId = category.Id;
        UpdatedAt = nowUtc;
    }

    public void ReplaceReferenceLinks(IReadOnlyList<ReferenceLink> links)
    {
        EnsureLinksAreValid(links);

        _referenceLinks.Clear();
        for (var position = 0; position < links.Count; position++)
        {
            links[position].MoveTo(position);
            _referenceLinks.Add(links[position]);
        }
    }

    public void AddAttachments(IReadOnlyCollection<Attachment> newAttachments)
    {
        var allAttachments = _attachments.Concat(newAttachments).ToList();
        EnsureWithinLimit(allAttachments, AttachmentKind.Image, ContentRules.MaxImages, "images", "imagens");
        EnsureWithinLimit(allAttachments, AttachmentKind.File, ContentRules.MaxFiles, "files", "arquivos");

        foreach (var attachment in newAttachments)
        {
            attachment.MoveTo(NextAttachmentPosition());
            _attachments.Add(attachment);
        }
    }

    public IReadOnlyList<Attachment> RemoveAttachments(IReadOnlyCollection<Guid> attachmentIds)
    {
        var toRemove = attachmentIds.Select(FindAttachment).ToList();
        _attachments.RemoveAll(attachment => toRemove.Contains(attachment));
        return toRemove;
    }

    public void UpdateSearchText(string normalizedSearchText) => SearchText = normalizedSearchText;

    private Attachment FindAttachment(Guid attachmentId) =>
        _attachments.FirstOrDefault(attachment => attachment.Id == attachmentId)
        ?? throw new DomainException("removedAttachmentIds", "O anexo informado não pertence a este conteúdo.");

    private int NextAttachmentPosition() =>
        _attachments.Count == 0 ? 0 : _attachments.Max(attachment => attachment.Position) + 1;

    private static void EnsureLinksAreValid(IReadOnlyList<ReferenceLink> links)
    {
        if (links.Count > ContentRules.MaxReferenceLinks)
            throw new DomainException("links", $"Use no máximo {ContentRules.MaxReferenceLinks} links.");

        var seenUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var index = 0; index < links.Count; index++)
        {
            if (!seenUrls.Add(links[index].Url))
                throw new DomainException($"links[{index}].url", "Esta URL já foi adicionada.");
        }
    }

    private static void EnsureWithinLimit(
        IEnumerable<Attachment> attachments, AttachmentKind kind, int limit, string field, string label)
    {
        if (attachments.Count(attachment => attachment.Kind == kind) > limit)
            throw new DomainException(field, $"Use no máximo {limit} {label} por conteúdo.");
    }
}
