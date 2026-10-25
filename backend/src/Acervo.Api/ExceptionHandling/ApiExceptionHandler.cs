using Acervo.Application.Shared;
using Acervo.Domain.Shared;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Acervo.Api.ExceptionHandling;

internal sealed class ApiExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var problem = ToProblemDetails(exception);

        if (problem.Status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Erro não tratado na requisição.");

        httpContext.Response.StatusCode = problem.Status!.Value;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });
    }

    private static ProblemDetails ToProblemDetails(Exception exception) => exception switch
    {
        FileRejectedException rejected => ValidationProblem(rejected, StatusFor(rejected.Reason)),
        DomainException domain => ValidationProblem(domain, StatusCodes.Status400BadRequest),
        NotFoundException notFound => Problem(StatusCodes.Status404NotFound, notFound.Message),
        BadHttpRequestException badRequest => Problem(badRequest.StatusCode, "Requisição inválida."),
        InvalidDataException => Problem(StatusCodes.Status400BadRequest, "Os dados enviados são inválidos."),
        _ => Problem(StatusCodes.Status500InternalServerError, "Ocorreu um erro inesperado. Tente novamente.")
    };

    private static int StatusFor(FileRejectionReason reason) => reason switch
    {
        FileRejectionReason.TooLarge => StatusCodes.Status413PayloadTooLarge,
        FileRejectionReason.UnsupportedType => StatusCodes.Status415UnsupportedMediaType,
        _ => StatusCodes.Status400BadRequest
    };

    private static ProblemDetails ValidationProblem(DomainException exception, int status) =>
        new HttpValidationProblemDetails(exception.Errors.ToDictionary(error => error.Key, error => error.Value))
        {
            Title = "Dados inválidos",
            Status = status
        };

    private static ProblemDetails Problem(int status, string title) => new() { Title = title, Status = status };
}
