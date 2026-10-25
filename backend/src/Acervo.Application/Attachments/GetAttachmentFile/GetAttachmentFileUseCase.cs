using Acervo.Application.Ports;
using Acervo.Application.Shared;

namespace Acervo.Application.Attachments.GetAttachmentFile;

public sealed class GetAttachmentFileUseCase(IContentRepository contents, IFileStorage storage)
{
    public async Task<AttachmentFileOutput> ExecuteAsync(Guid attachmentId, CancellationToken cancellationToken)
    {
        var attachment = await contents.FindAttachmentAsync(attachmentId, cancellationToken)
                         ?? throw new NotFoundException("Anexo não encontrado.");

        var content = await OpenFileAsync(attachment.StorageKey, cancellationToken);

        return new AttachmentFileOutput(content, attachment.OriginalFileName, attachment.ContentType, attachment.Kind);
    }

    private async Task<Stream> OpenFileAsync(string storageKey, CancellationToken cancellationToken)
    {
        try
        {
            return await storage.OpenReadAsync(storageKey, cancellationToken);
        }
        catch (FileNotFoundException)
        {
            throw new NotFoundException("O arquivo não está mais disponível.");
        }
    }
}
