# Acervo

POC de gerenciamento de conteúdos para leitura, estudo, organização e anotação.
Organize por **Grupo › Categoria**, escreva num **editor WYSIWYG** (armazenado como Markdown), anexe **links, imagens e arquivos** e encontre tudo pela **busca**.

A especificação completa (requisitos, decisões, critérios de aceite) está em [`docs/ESPECIFICACAO-POC-ACERVO.md`](docs/ESPECIFICACAO-POC-ACERVO.md).

## Estrutura

```
acervo/
├── backend/    .NET 10 · ASP.NET Core · EF Core + SQLite    (Clean Architecture)
├── frontend/   React 19.3 · TypeScript · Vite                (Clean Architecture)
└── docs/       Especificação
```

| Camada (Clean Architecture) | Back-end (`backend/src`) | Front-end (`frontend/src`) |
|---|---|---|
| 1. Entities | `Acervo.Domain` | `domain/` |
| 2. Use Cases | `Acervo.Application` | `application/` |
| 3. Interface Adapters | `Acervo.InterfaceAdapters` (Controllers, Presenters) | `interface-adapters/` (gateways, presenters, controllers/hooks) |
| 4. Frameworks & Drivers | `Acervo.Infrastructure` (EF Core, disco) e `Acervo.Api` (host) | `frameworks/` (React, rotas, `fetch`, CSS) |

A regra de dependência é verificada: no back, pelas referências entre projetos (não compilam se violadas); no front, pela regra de lint `no-restricted-imports` (`npm run lint`).

## Pré-requisitos

- **.NET SDK 10**
- **Node.js 24 LTS** (mínimo aceito: 22.22.2). Há um `frontend/.nvmrc`.

## Primeira execução

### 1. Back-end

```bash
cd backend

# Ferramenta do EF Core (versão fixada em .config/dotnet-tools.json)
dotnet tool restore

# Gera a migration inicial (apenas uma vez)
## Linux
dotnet ef migrations add InitialCreate \
  --project src/Acervo.Infrastructure \
  --startup-project src/Acervo.Api \
  --output-dir Persistence/Migrations
## Windows
dotnet ef migrations add InitialCreate --project src/Acervo.Infrastructure --startup-project src/Acervo.Api --output-dir Persistence/Migrations

# Sobe a API em http://localhost:5080
dotnet run --project src/Acervo.Api
```

Em desenvolvimento a API aplica as migrations sozinha e cadastra o conteúdo de exemplo
(**"Livros interessantes para análise"**, em *Livros › TI*) se o banco estiver vazio.

- Banco SQLite: `backend/data/acervo.db`
- Uploads: `backend/storage/uploads/` (fora de qualquer pasta servida estaticamente)
- Documento OpenAPI (apenas em Development): http://localhost:5080/openapi/v1.json
- Saúde: http://localhost:5080/health

### 2. Front-end

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173
```

O servidor de desenvolvimento encaminha `/api` para `http://localhost:5080` (sem CORS).
Para apontar para outra API, defina `VITE_API_BASE_URL` (ex.: `https://api.meudominio.com`).

## Comandos úteis

| O quê | Comando |
|---|---|
| Testes do back-end (Domain e Application) | `cd backend && dotnet test` |
| Testes do front-end | `cd frontend && npm test` |
| Verificação de tipos | `cd frontend && npm run typecheck` |
| Lint (inclui a regra de dependência entre camadas) | `cd frontend && npm run lint` |
| Build de produção do front | `cd frontend && npm run build` |

## Funcionalidades

- Menu lateral de **dois níveis** (Grupo › Categoria) com contadores; só o grupo ativo vem expandido.
- Listagens **paginadas** (12 por página); detalhe em **abas** (Conteúdo, Referências, Imagens, Arquivos — abas vazias ficam ocultas).
- **Busca** global por título, texto, grupo, categoria e rótulos de links (ignora acentos e maiúsculas).
- Cadastro/edição com **editor WYSIWYG**: títulos 2–4, negrito, itálico, código, listas, citação, link, linha horizontal; atalhos de teclado e ajuda (botão do teclado na barra).
- Grupos e categorias são criados no próprio formulário (digite um nome novo).
- Upload de **imagens** (png, jpg, webp, gif · até 5 MB) e **arquivos** (pdf, txt, md, docx, xlsx, pptx, zip · até 20 MB), com validação de extensão, tamanho e assinatura binária das imagens.
- Acessibilidade: WCAG 2.2 AA como meta — navegação por teclado, foco visível, ARIA, contraste verificado, alvos de 44 px, `prefers-reduced-motion`.

## Notas

- O editor grava Markdown válido; por isso `&` pode aparecer como `&amp;` no texto armazenado. A leitura, a prévia dos cards e a busca decodificam esses casos.
- `TreatWarningsAsErrors` está ativo em Domain, Application e InterfaceAdapters. Em Infrastructure, Api e nos projetos de teste está desativado por padrão; ative-o (`<TreatWarningsAsErrors>true`) depois do primeiro build limpo.
- Os pacotes NuGet têm versão centralizada em `backend/Directory.Packages.props`.
