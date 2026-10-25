namespace Acervo.Api.Configuration;

internal static class SecurityHeaders
{
    public static Task AddNoSniff(HttpContext context, Func<Task> next)
    {
        context.Response.Headers.XContentTypeOptions = "nosniff";
        return next();
    }
}
