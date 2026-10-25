using Acervo.Application.Contents.DeleteContent;
using Acervo.Application.Contents.RegisterContent;
using Acervo.Application.Contents.Shared;
using Acervo.Application.Contents.UpdateContent;
using Acervo.Application.Uploads;

namespace Acervo.Application.Tests.Support;

internal sealed class UseCaseFixture
{
    public static readonly DateTime Now = new(2026, 10, 24, 12, 0, 0, DateTimeKind.Utc);

    public UseCaseFixture()
    {
        var clock = new FixedTimeProvider(Now);
        var assembler = new ContentAssembler(Groups, Storage, new UploadPolicy());

        Register = new RegisterContentUseCase(assembler, Contents, UnitOfWork, clock);
        Update = new UpdateContentUseCase(assembler, Contents, UnitOfWork, clock);
        Delete = new DeleteContentUseCase(assembler, Contents, UnitOfWork);
    }

    public InMemoryGroupRepository Groups { get; } = new();
    public InMemoryContentRepository Contents { get; } = new();
    public FakeFileStorage Storage { get; } = new();
    public FakeUnitOfWork UnitOfWork { get; } = new();

    public RegisterContentUseCase Register { get; }
    public UpdateContentUseCase Update { get; }
    public DeleteContentUseCase Delete { get; }

    public static ContentFormInput ValidForm() => new(
        "Livros interessantes para análise",
        "- **C How to Program** (Paul Deitel): lógica e ponteiros.",
        new CategoryReference("Livros", "TI"),
        [], [], []);
}
