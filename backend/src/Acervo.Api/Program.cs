using Acervo.Api.Configuration;
using Acervo.Api.ExceptionHandling;
using Acervo.Application.Uploads;
using Acervo.Infrastructure;
using Acervo.InterfaceAdapters.Controllers;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
    .AddApplicationPart(typeof(GroupsController).Assembly);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddInfrastructure(InfrastructureSettingsFactory.Create(builder.Configuration, builder.Environment));
builder.Services.AddUseCases();

if (builder.Environment.IsDevelopment())
    builder.Services.AddHostedService<DevelopmentDatabaseInitializer>();

builder.WebHost.ConfigureKestrel(server => server.Limits.MaxRequestBodySize = UploadPolicy.MaxRequestBytes);

var app = builder.Build();

app.UseExceptionHandler();
app.Use(SecurityHeaders.AddNoSniff);

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
