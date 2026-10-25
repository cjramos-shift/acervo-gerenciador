using Acervo.Application.Attachments.GetAttachmentFile;
using Acervo.Application.Contents.DeleteContent;
using Acervo.Application.Contents.GetContentDetails;
using Acervo.Application.Contents.ListContents;
using Acervo.Application.Contents.RegisterContent;
using Acervo.Application.Contents.Shared;
using Acervo.Application.Contents.UpdateContent;
using Acervo.Application.Groups.ListGroups;
using Acervo.Application.Uploads;

namespace Acervo.Api.Configuration;

internal static class UseCaseRegistration
{
    public static IServiceCollection AddUseCases(this IServiceCollection services)
    {
        services.AddSingleton<UploadPolicy>();
        services.AddScoped<ContentAssembler>();

        services.AddScoped<ListGroupsUseCase>();
        services.AddScoped<ListContentsUseCase>();
        services.AddScoped<GetContentDetailsUseCase>();
        services.AddScoped<RegisterContentUseCase>();
        services.AddScoped<UpdateContentUseCase>();
        services.AddScoped<DeleteContentUseCase>();
        services.AddScoped<GetAttachmentFileUseCase>();

        return services;
    }
}
