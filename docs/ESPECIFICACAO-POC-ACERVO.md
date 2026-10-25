# Acervo — Especificação da POC

| Item | Valor |
|---|---|
| Documento | Especificação técnica e funcional da POC (pré-implementação) |
| Versão | **1.3** (implementação entregue — ver §14) |
| Nome do projeto | **Acervo** *(provisório — ver ND-07)* |
| Data | 24/10/2026 |
| Status | 🟢 **Implementação entregue (Fases 1 a 4).** Veja em §14 o que foi verificado, o que **não** pôde ser verificado no ambiente de desenvolvimento e os desvios em relação ao combinado |
| Stack solicitada | .NET 10 · React 19.3 · SQLite |
| Verificação de versão | React **19.3.0** confirmado como release estável em out/2026 |

> **Regra de trabalho deste documento**
> A implementação só começa quando: **(a)** todas as dúvidas **impeditivas** (§12.1) estiverem respondidas — ✅ **já estão (ID-01 a ID-07)** — e **(b)** as premissas das **não impeditivas** (§12.2) estiverem confirmadas ou ajustadas — ⏳ **é o que falta**. Você pode aprovar em bloco respondendo *"premissas ok"* para a §12.2.

## Histórico de revisões

| Versão | O que mudou |
|---|---|
| 1.0 | Primeira versão da especificação |
| 1.1 | **(a)** Incorporadas suas respostas (ID-01 a ID-06) e suas alterações em ND-11 e ND-15 · **(b)** Novo requisito: **editor WYSIWYG** para o campo Conteúdo (nova dúvida **ID-07**) · **(c)** **Busca textual** passa a ser escopo (ND-11) · **(d)** Hierarquia **Grupo › Categoria** (ID-01 = B) propagada para modelo, API, UI e testes · **(e)** Seção de riscos técnicos (§11.4) |
| 1.2 | **ID-07 respondida**: editor **Tiptap** aprovado (7a), armazenamento em **Markdown** (7b), formatações **baseline CommonMark** (7c), imagens **fora** do texto (7d) · Dependências do editor passam a ✅ (§10.3) · Definido o **contrato do componente `RichTextEditor`** e a configuração do editor (§8.6) · Novo risco R6 (§11.4) · Status geral: só falta confirmar as premissas ND |
| 1.3 | **Implementação entregue**: back-end (.NET 10) e front-end (React 19.3 + TypeScript) · `Microsoft.AspNetCore.OpenApi` instalado (ND-19) · busca, editor WYSIWYG, menu de dois níveis e anexos · **§14 Registro de implementação** (verificações, limites e desvios) |

### Como suas decisões alteraram a especificação

| Sua decisão | Onde e como foi aplicada |
|---|---|
| **ID-01 = B** (hierarquia) | Categoria pertence a um Grupo; `Content` referencia **só a Categoria** (AD7); menu em **dois níveis**; novas rotas; `GET /api/groups` devolve a árvore; unicidade de categoria **por grupo** (§2, §6, §7, §8) |
| **ID-02 = B** (Markdown) **+ pedido de WYSIWYG** | O usuário **escreve** no editor WYSIWYG e o sistema **armazena Markdown**; leitura com `react-markdown` (aprovado). Biblioteca aprovada em **ID-07**: **Tiptap** (§8.6, §10.3) |
| **ID-03** aceito | Grupo/Categoria criados no formulário; Categoria passa a ser **dependente** do Grupo escolhido |
| **ID-04 = A** | "Anotação" é a finalidade do campo Conteúdo; sem entidade `Annotation` |
| **ID-05** (5a–5d) | Dependências necessárias, recomendadas e `react-markdown` **aprovadas**; front em **TypeScript**; **CSS Modules** (§10) |
| **ID-06 = A** | Arquivos e imagens em **disco local** |
| **ND-11** → dentro do escopo | Busca textual global: RF14/RF15, `search` na API, coluna `SearchText`, rota `/busca` e premissas ND-16 a ND-18 |
| **ID-07** (7a–7d) | **Tiptap** aprovado; armazenamento em **Markdown**; formatações **baseline CommonMark** (sem `remark-gfm`); imagens continuam **somente como anexos** (§1.3, §8.6, §10.3) |
| **ND-15** | .NET 10 já instalado; **escolha do Node.js delegada a mim** → recomendação **Node.js 24 LTS** (§12.2) |

## Sumário

1. [Entendimento da demanda](#1-entendimento-da-demanda)
2. [Modelo de domínio e regras de negócio](#2-modelo-de-domínio-e-regras-de-negócio)
3. [Requisitos funcionais](#3-requisitos-funcionais)
4. [Requisitos não funcionais](#4-requisitos-não-funcionais)
5. [Arquitetura](#5-arquitetura)
6. [Contrato da API](#6-contrato-da-api)
7. [Modelo de dados (SQLite)](#7-modelo-de-dados-sqlite)
8. [UI/UX](#8-uiux) (inclui o editor WYSIWYG em [8.6](#86-editor-de-conteúdo-wysiwyg))
9. [Padrões de código](#9-padrões-de-código)
10. [Dependências](#10-dependências)
11. [Plano de implementação, critérios de aceite e riscos](#11-plano-de-implementação-critérios-de-aceite-e-riscos)
12. [Dúvidas](#12-dúvidas)
13. [Exemplo de cadastro mapeado](#13-exemplo-de-cadastro-mapeado)

---

## 1. Entendimento da demanda

### 1.1 O que será construído

Uma POC de **gerenciamento de conteúdos pessoais** para leitura, estudo, organização e anotação. O usuário cadastra um conteúdo (título, texto formatado, links, imagens e arquivos), classifica por **Grupo › Categoria**, e consulta de forma organizada por menu, e por **busca** — sem uma página única despejando tudo.

### 1.2 Escopo da POC (dentro)

| # | Item |
|---|---|
| 1 | Telas de **exibição** por menu de dois níveis (Grupo › Categoria), com listagem paginada e tela de detalhe |
| 2 | Tela de **cadastro** (e edição) com Título, Conteúdo, Links de estudo/referência, Imagens e Arquivos |
| 3 | **Editor WYSIWYG** no campo Conteúdo (armazenamento em Markdown) |
| 4 | **Busca textual** global com resultados paginados |
| 5 | Back-end e Front-end **separados**, comunicando-se por API REST/JSON |
| 6 | Persistência em **SQLite**; arquivos e imagens em disco local |
| 7 | Clean Architecture nas duas pontas; Clean Code; UI/UX conforme os 6 princípios pedidos |

### 1.3 Fora do escopo (a menos que você peça)

Autenticação/multiusuário · versionamento de conteúdo · tags · reordenação por arrastar · tema claro/alternância de tema · internacionalização · Docker/CI/deploy · **imagens inseridas dentro do texto do editor** (imagens continuam como anexos) · edição colaborativa em tempo real · busca com ranking de relevância e destaque de termos · formatações **GFM** no editor (tachado, tabelas, listas de tarefas — evolução prevista, ID-07 · 7c).

### 1.4 Como interpretei os termos

| Termo do enunciado | Interpretação adotada |
|---|---|
| "Menu" | Navegação lateral **em dois níveis**: Grupo › Categoria (ID-01 = B) |
| "Categoria" | Subdivisão **de um Grupo** (ex.: `Livros › TI`); o mesmo nome pode existir em grupos diferentes |
| "Não exibir landing-page gigante" | Início enxuto (atalhos + poucos recentes); listagens **paginadas**; detalhe com **abas**; menu que expande só o grupo ativo |
| "Anotação" | Finalidade do campo Conteúdo (texto livre do usuário), **não** um recurso separado (ID-04 = A) |
| "Editor WYSIWYG" | O usuário formata o texto visualmente (barra de ferramentas e atalhos); o sistema converte de/para **Markdown** |
| "Imagens, arquivos" | **Anexos** do conteúdo, de dois tipos: imagem e arquivo |

---

## 2. Modelo de domínio e regras de negócio

### 2.1 Entidades (camada 1 — sem dependência de nada)

```
Group      { Id, Name, Categories[ ] }                      ← raiz de agregado das suas Categorias
Category   { Id, GroupId, Name }                            ← pertence a um Group
Content    { Id, Title, Body, CategoryId, CreatedAt, UpdatedAt,
             ReferenceLinks[ ], Attachments[ ] }            ← raiz de agregado
ReferenceLink { Url, Label? }                               ← pertence a Content
Attachment    { Id, Kind(Image|File), OriginalFileName, StorageKey,
                ContentType, SizeInBytes, Description? }    ← pertence a Content
```

- `Body` é texto em **Markdown (CommonMark)**, produzido pelo editor WYSIWYG.
- O **Grupo de um conteúdo é derivado** (`Content → Category → Group`): não existe `GroupId` em `Content`, o que torna impossível um conteúdo apontar para uma categoria de outro grupo (AD7).
- `StorageKey` é um identificador **opaco** — o domínio não sabe se é disco, nuvem ou BLOB.

### 2.2 Regras de negócio

| ID | Regra |
|---|---|
| RN01 | **Título** obrigatório, 3–150 caracteres após `trim` |
| RN02 | **Conteúdo** obrigatório (não pode ser vazio ou só espaços/parágrafos vazios), até 50.000 caracteres **do Markdown** |
| RN03 | Todo conteúdo pertence a **uma Categoria** (e, por consequência, a um Grupo); no formulário, **Grupo e Categoria** são obrigatórios |
| RN04 | Nome de **Grupo**: 2–60 caracteres, `trim` + espaços internos colapsados, **único** ignorando maiúsculas/minúsculas. Nome de **Categoria**: mesmas regras, **único dentro do seu Grupo** |
| RN05 | **Link**: URL absoluta `http`/`https` (rejeita `javascript:`, `data:` etc.); rótulo opcional até 100 caracteres; máx. **20** por conteúdo; sem URL repetida no mesmo conteúdo |
| RN06 | **Anexos**: tipos e tamanhos conforme `UploadPolicy` (ND-02); máx. **10** imagens e **10** arquivos por conteúdo |
| RN07 | Links e anexos mantêm a **ordem** de inclusão |
| RN08 | `UpdatedAt` é atualizado a cada edição; datas em **UTC** |
| RN09 | Excluir um conteúdo remove seus links e anexos (registro **e** arquivo físico) |
| RN10 | Ao cadastrar com Grupo e/ou Categoria inexistente (nome novo), são **criados na mesma operação** (atômica); uma Categoria nova é sempre criada **dentro do Grupo informado** |
| RN11 | **HTML bruto nunca é renderizado**: o `Body` é dado, não código. Só a sintaxe Markdown suportada é exibida |
| RN12 | A cada gravação o sistema recalcula o **`SearchText`** do conteúdo (título + texto puro do corpo + nome do grupo + nome da categoria + rótulos dos links), **normalizado** (minúsculas, sem acentos) |

### 2.3 Casos de uso (camada 2)

| Caso de uso | Entrada principal | Saída |
|---|---|---|
| `ListGroups` | — | **Árvore** Grupo → Categorias, cada nó com a quantidade de conteúdos |
| `ListContents` | `groupId?`, `categoryId?`, `searchTerm?`, `page`, `pageSize` | Página de resumos (filtros combinados com **E**) |
| `GetContentDetails` | `contentId` | Conteúdo completo |
| `RegisterContent` | dados + links + arquivos | `contentId` |
| `UpdateContent` | `contentId` + dados + ids de anexos removidos + novos arquivos | `contentId` |
| `DeleteContent` | `contentId` | — |
| `GetAttachmentFile` | `attachmentId` | Stream + metadados |

> A busca **reutiliza** `ListContents` (parâmetro `searchTerm`) — um único caminho de listagem (DRY).

---

## 3. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Navegar por **menu lateral de dois níveis** (Grupo › Categoria), com contadores | Must |
| RF02 | Listar os conteúdos de um **Grupo** (todas as categorias) ou de uma **Categoria** específica | Must |
| RF03 | Listagem **paginada** em cards (título, caminho Grupo › Categoria, prévia, indicadores de links/imagens/arquivos, data) | Must |
| RF04 | **Detalhe** do conteúdo com abas: Conteúdo · Referências · Imagens · Arquivos | Must |
| RF05 | **Cadastrar** conteúdo (Título, Grupo, Categoria, Conteúdo; opcionais: links, imagens, arquivos) | Must |
| RF06 | **Editar** conteúdo, incluindo adicionar/remover links e anexos | Should *(ND-01)* |
| RF07 | **Excluir** conteúdo com confirmação | Should *(ND-01)* |
| RF08 | Baixar arquivo; visualizar imagem ampliada | Must |
| RF09 | Tela **Início** com atalhos por Grupo e até 6 conteúdos recentes | Should *(ND-04)* |
| RF10 | Criar Grupo/Categoria no formulário (digitando um nome novo); a lista de Categorias **depende do Grupo escolhido** | Must *(ID-03)* |
| RF11 | Descrição opcional por imagem (usada como texto alternativo) | Should *(ND-12)* |
| RF12 | Estados de **carregando**, **vazio** e **erro** em todas as telas de dados | Must |
| RF13 | **Editor WYSIWYG** no campo Conteúdo: barra de ferramentas, atalhos de teclado, entrada/saída em Markdown, mesmo visual da leitura (§8.6) | Must *(ID-07)* |
| RF14 | **Busca textual global** por título, conteúdo, grupo, categoria e rótulos de links, insensível a maiúsculas e acentos | Must *(ND-11)* |
| RF15 | Resultados da busca **paginados**, com caminho Grupo › Categoria, e estado "nenhum resultado" | Must *(ND-11)* |

---

## 4. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | **Acessibilidade**: WCAG 2.2 nível AA como meta (contraste, teclado, foco visível, ARIA, alvo de toque mínimo de **44×44 px**) |
| RNF02 | **Responsivo**: *desktop-first*; abaixo de 900 px o menu lateral vira gaveta |
| RNF03 | **Segurança de upload**: lista de extensões permitidas + checagem de **assinatura binária** (imagens) + nome de armazenamento gerado (nunca usar o nome original no caminho) + SVG **não** aceito |
| RNF04 | **Segurança de renderização**: Markdown **sem HTML bruto**; protocolos perigosos (`javascript:` etc.) descartados nos links; links externos com `rel="noopener noreferrer"` |
| RNF05 | Erros da API padronizados em **ProblemDetails** (RFC 9457), com mapa de erros por campo |
| RNF06 | Listagens retornam **resumos** (sem corpo completo) e são paginadas |
| RNF07 | Regra de dependência da Clean Architecture **verificável**: back por referências de projeto; front por regra de lint (§10) |
| RNF08 | Configuração por `appsettings` (back) e variáveis de ambiente (front); nada *hard-coded* |
| RNF09 | **Editor WYSIWYG acessível**: operável só por teclado, **sem armadilha de foco**, botões com estado anunciado (`aria-pressed`), campo com rótulo associado (§8.6) |
| RNF10 | **Busca** tolerante a maiúsculas/minúsculas e acentos, com curingas do usuário (`%`, `_`) tratados como texto literal, termo limitado a 100 caracteres |

---

## 5. Arquitetura

### 5.1 Visão geral

```
┌──────────────────────────┐   HTTP / JSON   ┌───────────────────────────────┐
│ FRONT-END (React 19.3)   │ ──────────────► │ BACK-END (.NET 10, ASP.NET)   │
│ frontend/                │ ◄────────────── │ backend/                      │
└──────────────────────────┘  multipart p/   └──────────────┬────────────────┘
                              upload                        │
                                              ┌─────────────┴─────────────┐
                                              │ SQLite (acervo.db)        │
                                              │ Disco local (uploads/)    │
                                              └───────────────────────────┘
```

Em desenvolvimento, o servidor do front encaminha `/api` para o back (proxy do próprio bundler), evitando CORS. Em outros ambientes a URL base vem de variável de ambiente.

### 5.2 Regra de dependência (vale para back e front)

```
 Frameworks & Drivers  ──►  Interface Adapters  ──►  Use Cases  ──►  Entities
        (4)                        (3)                  (2)            (1)
          dependências apontam SEMPRE para dentro; nunca o contrário
```

### 5.3 Back-end — mapeamento das camadas

| Camada | Projeto | Conteúdo | Pode referenciar |
|---|---|---|---|
| 1. Entities | `Acervo.Domain` | `Content`, `Group`, `Category`, `ReferenceLink`, `Attachment`, regras e invariantes, `DomainException` | nada |
| 2. Use Cases | `Acervo.Application` | Casos de uso, modelos `Input`/`Output`, **portas** (`IContentRepository`, `IGroupRepository`, `IFileStorage`, `IUnitOfWork`), `UploadPolicy`, `SearchTextBuilder`, `NotFoundException` | Domain |
| 3. Interface Adapters | `Acervo.InterfaceAdapters` | **Controllers**, **Presenters** (Output → ViewModel HTTP), Requests/Responses (JSON) | Application, Domain |
| 4. Frameworks & Drivers | `Acervo.Infrastructure` | EF Core + SQLite, **Gateways** (implementação dos repositórios), `LocalDiskFileStorage`, migrations | Application, Domain |
| 4. Frameworks & Drivers | `Acervo.Api` | `Program.cs`, composição de DI, *exception handler*, config | todos (raiz de composição) |

Detalhes de projeto:

- **Casos de uso não conhecem HTTP**: arquivos chegam como `UploadedFileInput(Stream, FileName, ContentType, Length)`, nunca `IFormFile`.
- **Fluxo**: `Controller → UseCase.ExecuteAsync(Input) → Output → Presenter → ViewModel → JSON`.
- **Erros**: invariantes violadas lançam `DomainException`; recurso ausente lança `NotFoundException`; um único *exception handler* em `Acervo.Api` converte para ProblemDetails (400/404/413/415/500).
- **Transação**: `IUnitOfWork.CommitAsync()` garante que criar Grupo + Categoria + Conteúdo seja atômico (RN10).
- **Arquivos × banco**: o registro só é confirmado após o arquivo ser gravado; falha ao gravar desfaz o que foi escrito.
- **Busca**: `SearchTextBuilder` (Application) gera o `SearchText` a cada gravação — extrai texto puro do Markdown (remoção de marcadores por regras simples e testadas), junta os campos e normaliza (minúsculas, sem diacríticos, apenas com a BCL do .NET). O gateway consulta com `LIKE` parametrizado (cada palavra do termo deve casar — **E**), escapando `%`, `_` e o caractere de escape.

### 5.4 Front-end — mapeamento das camadas

| Camada | Pasta | Conteúdo |
|---|---|---|
| 1. Entities | `src/domain` | Entidades e regras de validação reutilizáveis (RN01–RN06), `UploadRules` |
| 2. Use Cases | `src/application` | `listGroups`, `listContents` (inclui busca), `getContentDetails`, `registerContent`, `updateContent`, `deleteContent`; **portas** (contratos dos gateways) |
| 3. Interface Adapters | `src/interface-adapters` | **Gateways HTTP** (implementam as portas), **Presenters** (formatação de data, tamanho de arquivo, prévia de texto sem marcação Markdown, **menu a partir da árvore**, ocultando nós com 0 conteúdos), **Controllers** (hooks que ligam a UI aos casos de uso) |
| 4. Frameworks & Drivers | `src/frameworks` | React (componentes, páginas, layout), **editor WYSIWYG** e **renderizador Markdown**, roteador, cliente `fetch`, CSS/tokens, **raiz de composição** (monta gateways → casos de uso) |

- Injeção de dependência **sem biblioteca**: a raiz de composição cria os casos de uso e os disponibiliza via React Context; os *controllers* (hooks) os consomem.
- Estado assíncrono (carregando/erro/dados) por **um único hook utilitário** próprio (`useAsync`) — sem biblioteca de *data fetching*.
- **O editor WYSIWYG é detalhe de UI (camada 4)**: recebe e emite uma **string Markdown**. Casos de uso, gateways e API nunca enxergam o editor nem sua estrutura interna — trocar a biblioteca do editor não afeta nenhuma camada interna.

### 5.5 Decisões arquiteturais registradas (para sua confirmação — ND-08)

| # | Decisão | Motivo / trade-off |
|---|---|---|
| AD1 | **Gateways concretos ficam em `Infrastructure`** (camada 4), com as interfaces (portas) em `Application` | Os gateways dependem de EF Core/SQLite; a camada 3 não pode depender de framework de persistência sem violar a regra de dependência |
| AD2 | **EF Core mapeia as entidades de domínio via Fluent API** (sem atributos no domínio), em vez de criar modelos de persistência separados | Evita duplicar classes e mapeadores (KISS/DRY) mantendo o domínio puro. Se preferir separação total (modelo de persistência + mapper), o custo é ~2× em classes de dados |
| AD3 | Casos de uso **retornam `Output`** e o Presenter converte para ViewModel (variação simplificada do *Output Boundary*) | Evita *callbacks*/inversão extra sem perder o isolamento entre regra e formato HTTP |
| AD4 | **Controllers MVC** (não Minimal APIs) | Seu enunciado cita Controllers/Presenters explicitamente na camada 3 |
| AD5 | **Upload em `multipart/form-data` numa única requisição** (dados + arquivos) | Operação atômica do ponto de vista do usuário; evita conteúdo "pela metade" |
| AD6 | Datas como `DateTime` **UTC** (não `DateTimeOffset`) | Limitação do EF Core/SQLite para ordenar `DateTimeOffset` em consultas |
| AD7 | `Content` referencia **somente a Categoria**; o Grupo é derivado | Torna **inválido por construção** um conteúdo cujo grupo e categoria não combinam (consequência de ID-01 = B) |
| AD8 | **Escrita WYSIWYG, armazenamento em Markdown** | Mantém ID-02 = B: texto portável, busca e prévia simples, renderização segura (sem HTML) e troca de editor sem migração de dados |
| AD9 | **Busca por coluna `SearchText` normalizada + `LIKE`** (sem FTS5) | Resolve acentos/maiúsculas (o `LIKE` nativo do SQLite só cobre ASCII) sem tabelas virtuais nem SQL fora do EF; custo: varredura da tabela, adequado à escala de uma POC (FTS5 fica como evolução — ND-18) |

---

## 6. Contrato da API

Base: `/api` · JSON `camelCase` · IDs `Guid` · erros em ProblemDetails.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/groups` | **Árvore** de Grupos com suas Categorias e `contentCount` (todos os nós; o front oculta os vazios no menu e usa todos no formulário) |
| GET | `/api/contents?groupId=&categoryId=&search=&page=1&pageSize=12` | Página de resumos, ordenada por `updatedAt` desc; filtros combinados com **E** |
| GET | `/api/contents/{id}` | Detalhe completo |
| POST | `/api/contents` | Cadastro (`multipart/form-data`) |
| PUT | `/api/contents/{id}` | Edição (`multipart/form-data` + `removedAttachmentIds`) |
| DELETE | `/api/contents/{id}` | Exclusão (204) |
| GET | `/api/attachments/{id}/file` | Stream do arquivo (`inline` p/ imagem, `attachment` p/ arquivo) |

**Árvore de grupos**
```json
[{
  "id": "…", "name": "Livros", "contentCount": 12,
  "categories": [
    { "id": "…", "name": "TI", "contentCount": 9 },
    { "id": "…", "name": "Eletrônica", "contentCount": 3 }
  ]
}]
```

**Resumo de listagem / resultado de busca**
```json
{
  "items": [{
    "id": "…", "title": "Livros interessantes para análise",
    "groupId": "…", "groupName": "Livros",
    "categoryId": "…", "categoryName": "TI",
    "bodyPreview": "- **C How to Program** (Paul Deitel…",
    "linkCount": 0, "imageCount": 0, "fileCount": 0,
    "updatedAt": "2026-10-24T12:00:00Z"
  }],
  "page": 1, "pageSize": 12, "totalItems": 1, "totalPages": 1
}
```

`bodyPreview` traz os primeiros 240 caracteres do **Markdown**; o Presenter do front remove a marcação para exibir texto limpo.

**Campos do `POST /api/contents`**: `title`, `body` (**Markdown**), `groupName`, `categoryName`, `links[i].url`, `links[i].label`, `images[i].file`, `images[i].description`, `files[i]`.

**Erro de validação (400)**
```json
{ "type": "…", "title": "Dados inválidos", "status": 400,
  "errors": { "title": ["Informe de 3 a 150 caracteres."], "links[0].url": ["URL inválida."] } }
```

---

## 7. Modelo de dados (SQLite)

```
Groups         Id TEXT PK · Name TEXT · NormalizedName TEXT UNIQUE · CreatedAt TEXT
Categories     Id TEXT PK · GroupId FK→Groups · Name TEXT · NormalizedName TEXT · CreatedAt TEXT
               UNIQUE (GroupId, NormalizedName)
Contents       Id TEXT PK · Title TEXT · Body TEXT (Markdown) · CategoryId FK→Categories
               · SearchText TEXT · CreatedAt TEXT · UpdatedAt TEXT
ReferenceLinks Id TEXT PK · ContentId FK→Contents · Url TEXT · Label TEXT? · Position INT
Attachments    Id TEXT PK · ContentId FK→Contents · Kind TEXT · OriginalFileName TEXT
               · StorageKey TEXT · ContentType TEXT · SizeInBytes INT · Description TEXT? · Position INT
```

| Aspecto | Decisão |
|---|---|
| IDs | `Guid` v7 (`Guid.CreateVersion7()`), armazenado como `TEXT` |
| Unicidade case-insensitive | Coluna `NormalizedName` (maiúsculas invariantes): único **global** em Grupos e único **por Grupo** em Categorias. O `COLLATE NOCASE` do SQLite só cobre ASCII, o que falharia com acentos |
| Busca | `SearchText` normalizado (minúsculas, sem diacríticos), recalculado a cada gravação (RN12); consulta `LIKE` parametrizada |
| Integridade | `Categories → Groups` e `Contents → Categories`: **Restrict** · `Contents → Links/Attachments`: **Cascade** |
| Índices | `Contents(CategoryId, UpdatedAt DESC)` · `Categories(GroupId)` · `ReferenceLinks(ContentId)` · `Attachments(ContentId)` |
| Evolução do schema | **Migrations** do EF Core; aplicadas automaticamente **apenas em desenvolvimento** |
| Arquivo do banco | `backend/data/acervo.db` (caminho em `appsettings`; fora do controle de versão) |
| Uploads | `backend/storage/uploads/` (caminho configurável; **fora** de qualquer pasta servida estaticamente) |

---

## 8. UI/UX

### 8.1 Os seis princípios → decisões concretas

| Princípio | Decisões aplicadas | Como verifico |
|---|---|---|
| **Hierarquia** | Um único `h1` por tela (títulos do Markdown são **rebaixados** na leitura para não competir com ele); título do conteúdo em 32 px/700, metadados em 14 px/400 muted; **uma** ação primária por tela (lime), demais secundárias/discretas; menu lateral separado da área de leitura | Revisão visual: o olho cai primeiro no título e na ação primária |
| **Consistência** | Design system próprio: `Button`, `TextField`, `Combobox`, `Badge`, `Tabs`, `Disclosure`, `Dialog`, `Toast`, `EmptyState`, `SearchField`, `RichTextEditor`; tokens CSS únicos; ícones SVG do mesmo traço; mesmos estados (hover/focus/disabled/error) em tudo; **a mesma tipografia de texto** no editor e na leitura | Nenhum estilo "solto" fora dos tokens; editor e leitura visualmente equivalentes |
| **Contraste** | Paleta validada (§8.2); lime reservado a ação primária, foco e destaque; texto nunca abaixo de 7:1 sobre fundos | Razões medidas (tabela §8.2) |
| **Acessibilidade** | Ver §8.5 e §8.6 | Checklist + navegação só por teclado |
| **Proximidade** | Espaçamento em grade de 4 px; campos relacionados agrupados em `fieldset`/painel; rótulo sempre colado ao seu campo; metadados do card na mesma linha; barra de ferramentas colada ao campo de texto | Espaço *entre* grupos > espaço *dentro* do grupo |
| **Divulgação progressiva** | Início enxuto → menu que **expande só o grupo ativo** → listagem paginada → Detalhe em abas (abas vazias ocultas) → Formulário com **essencial visível** e **complementos** em painéis recolhidos com contador; busca devolve resultados paginados, nunca o acervo inteiro | Nenhuma tela exibe todo o acervo de uma vez |

### 8.2 Paleta (tema escuro único — ND-06)

Contrastes **calculados** pela fórmula WCAG 2.x:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--color-bg` | `#070A0E` | Fundo da aplicação (preto) | — |
| `--color-surface` | `#0E151D` | Cards, sidebar | — |
| `--color-surface-raised` | `#15202B` | Hover, campos, painéis | — |
| `--color-navy` | `#0F2A43` | Realces secundários (item de menu ativo, cabeçalhos de painel) | texto sobre ele: 12,5:1 |
| `--color-text` | `#E8EEF4` | Texto principal | 17,0:1 (bg) · 15,7:1 (surface) |
| `--color-text-muted` | `#9FB0C0` | Metadados, ajuda | 8,9:1 (bg) · 7,4:1 (surface-raised) |
| `--color-primary` | `#A8E10C` | Verde-limão: ação primária, foco, destaque | 12,7:1 (bg) · 10,6:1 (surface-raised) |
| `--color-on-primary` | `#070A0E` | Texto sobre botão primário | 12,7:1 |
| `--color-accent` | `#2FD3A0` | Verde-esverdeado: badges de categoria, links | 10,3:1 (bg) · 8,6:1 (surface-raised) |
| `--color-border` | `#2A3A4A` | Divisores decorativos | *(decorativo, sem exigência)* |
| `--color-border-control` | `#5B6F83` | Borda de campos, controles e **área do editor** | ≥ 3,2:1 em todos os fundos (exigência 3:1) |
| `--color-danger` | `#FF6B6B` | Erro e exclusão (sempre com ícone + texto) | 6,6:1 (surface) |

### 8.3 Tipografia e espaçamento

- **Fonte**: pilha do sistema (`system-ui, "Segoe UI", Roboto, sans-serif`) — sem fontes externas (mais rápido, sem terceiros).
- **Escala**: 14 · 16 (corpo) · 20 · 24 · 32 px; `line-height` 1,6 no corpo; **largura máxima de leitura 72ch** no texto do conteúdo.
- **Texto de conteúdo** (`.markdown-content`): **uma única folha de estilos** aplicada tanto ao editor quanto à leitura (parágrafos, títulos h2–h4, listas, citação, código, links) — é o que garante o "o que você vê é o que você terá" (WYSIWYG) e evita duplicação (DRY).
- **Espaçamento**: 4 · 8 · 12 · 16 · 24 · 32 · 48 px.
- **Raio** 8 px; **foco**: anel de 2 px lime com offset de 2 px; **alvo de toque** ≥ 44×44 px.

### 8.4 Mapa de telas

| Rota | Tela | Finalidade |
|---|---|---|
| `/` | Início | Cards de Grupos (com contador) + até 6 recentes |
| `/grupos/:groupId` | Conteúdos do Grupo | Listagem paginada de **todas as categorias** do grupo |
| `/grupos/:groupId/categorias/:categoryId` | Conteúdos da Categoria | Listagem paginada de uma categoria |
| `/busca?q=` | Resultados da busca | Resultados paginados com caminho Grupo › Categoria |
| `/conteudos/:contentId` | Detalhe | Leitura em abas + Editar/Excluir |
| `/conteudos/novo` | Cadastro | Formulário |
| `/conteudos/:contentId/editar` | Edição | Mesmo formulário, preenchido |

**Estrutura comum (AppShell) — menu de dois níveis e busca**

```
┌───────────────┬──────────────────────────────────────────────────────┐
│  ◆ Acervo     │  [ 🔍 Buscar no acervo…            ]  [+ Novo conteúdo]│ ← busca + ação primária
│               │  ──────────────────────────────────────────────────  │
│  ▸ Início     │  Livros › TI                                         │ ← breadcrumb
│  ▾ Livros  12 │  Conteúdos de TI                                     │ ← h1
│     TI      9 │                                                      │
│     Eletrôn 3 │  ┌────────────────────┐  ┌────────────────────┐      │
│  ▸ Artigos  4 │  │ Livros › TI        │  │ Livros › TI        │      │
│  ▸ Vídeos   2 │  │ Livros interess…   │  │ Redes de computad… │      │ ← cards
│               │  │ C How to Program…  │  │ Pacote a pacote…   │      │
│               │  │ 🔗 0  🖼 0  📎 0    │  │ 🔗 2  🖼 1  📎 0    │      │
│               │  └────────────────────┘  └────────────────────┘      │
│               │            ‹ Anterior   1  2   Próxima ›             │
└───────────────┴──────────────────────────────────────────────────────┘
```

- Cada Grupo no menu = **link** (abre a listagem do grupo) + **botão de expandir/recolher** (`aria-expanded`); só o grupo ativo vem expandido.
- Em telas estreitas, o menu e a busca ficam numa **gaveta/linha própria**, mantendo alvos ≥ 44 px.

**Resultados da busca**

```
 Resultados para “álgebra”                          3 resultados
 ┌────────────────────────────────────────────────────────────┐
 │ Livros › TI                                                │
 │ Livros interessantes para análise                          │
 │ Introdução a Sistemas de Bancos de Dados (C. J. Date)…     │
 └────────────────────────────────────────────────────────────┘
 (sem resultados → "Nenhum resultado para “…”. Verifique a ortografia ou tente outro termo.")
```

**Detalhe (divulgação progressiva por abas)**

```
 Livros › TI
 Livros interessantes para análise                    [ Editar ]  Excluir
 Atualizado em 24/10/2026 · 0 links · 0 imagens · 0 arquivos
 ┌─────────────┬────────────────┬──────────┬──────────┐
 │ Conteúdo ▔▔ │ Referências (2)│ Imagens  │ Arquivos │   ← abas com 0 itens ficam ocultas
 └─────────────┴────────────────┴──────────┴──────────┘
 (Markdown renderizado com o mesmo estilo do editor, largura de leitura confortável)
```

**Formulário (essencial visível, complementos recolhidos)**

```
 Novo conteúdo
 ── Essencial ───────────────────────────────────────────
 Título *            [______________________________]
 Grupo *             [ Livros          ▾ ]  ← escolha ou digite para criar
 Categoria *         [ TI              ▾ ]  ← habilita após escolher o Grupo
 Conteúdo *
 ┌──────────────────────────────────────────────────────┐
 │ [T▾] [B] [I] [</>] [• ] [1.] [❝] [🔗] [―] [↶] [↷]     │ ← barra de ferramentas
 ├──────────────────────────────────────────────────────┤
 │  área de edição WYSIWYG (rolagem própria)            │
 └──────────────────────────────────────────────────────┘
                                          12.340 / 50.000
 ── Complementos (opcionais) ────────────────────────────
 ▸ Links de estudo ou referência (0)
 ▸ Imagens (0)
 ▸ Arquivos (0)
 ────────────────────────────────────────────────────────
                                   [ Cancelar ]  [ Salvar ]
```

**Estados obrigatórios**: carregando (esqueleto), vazio (mensagem + ação sugerida), erro (mensagem + "Tentar novamente"), sucesso (aviso `role="status"` discreto após salvar).

### 8.5 Checklist de acessibilidade

- `lang="pt-BR"`; *skip link* "Ir para o conteúdo"; marcos `header`/`nav`/`main`/`search`; hierarquia de títulos sem saltos
- Todo controle operável por **teclado**; foco sempre visível; ordem de foco lógica
- **Menu em dois níveis**: botão de expandir com `aria-expanded`; item ativo com `aria-current="page"`
- **Busca**: campo com rótulo (visível ou `aria-label`), região `role="search"`; resultado anunciado (`role="status"`: "3 resultados")
- Abas seguem o padrão ARIA (`tablist`/`tab`/`tabpanel`, setas do teclado)
- Diálogos usam o elemento nativo `<dialog>` com `showModal()` (foco preso, `Esc` fecha, foco devolvido ao acionador)
- Painéis recolhíveis usam `<details>/<summary>` nativo
- Campos com `<label>` associado; erros com `aria-invalid` + `aria-describedby`; ao falhar o envio, foco vai ao **resumo de erros**
- Informação **nunca só por cor**: erro = ícone + texto; categoria = texto no badge
- Imagens com `alt` (descrição informada ou nome do arquivo); ícones decorativos com `aria-hidden`
- Respeita `prefers-reduced-motion`; sem animações essenciais
- Ampliação de imagem em `<dialog>` nativo (sem biblioteca de *lightbox*)
- **Editor WYSIWYG**: ver §8.6

### 8.6 Editor de conteúdo (WYSIWYG)

> Biblioteca **aprovada em ID-07 · 7a: Tiptap**. Esta seção define o **comportamento esperado** e o **contrato do componente**; a biblioteca fica **isolada** dentro de `RichTextEditor` (§5.4), então uma troca futura não afeta nenhuma outra parte do sistema.

**Princípio**: o usuário edita visualmente; o sistema guarda **Markdown**. O editor recebe e devolve uma `string` (§5.4).

**Formatações oferecidas (baseline CommonMark)**

| Formatação | Equivalente em Markdown | Observação |
|---|---|---|
| Parágrafo / Título 2, 3, 4 | `##`, `###`, `####` | `h1` **não** é oferecido (reservado ao título da página) |
| Negrito · Itálico | `**x**` · `*x*` | Atalhos universais `Ctrl/⌘+B` e `Ctrl/⌘+I` |
| Código em linha · Bloco de código | `` `x` `` · ``` ``` ``` | |
| Lista com marcadores · Lista numerada | `-` · `1.` | A lista do exemplo (§13) usa esta + negrito |
| Citação | `>` | |
| Link | `[texto](url)` | Apenas `http`/`https`/`mailto`; mesmo critério de RN05 |
| Linha horizontal | `---` | |
| Desfazer · Refazer | — | `Ctrl/⌘+Z`, `Ctrl/⌘+Shift+Z` |

**Fora desta versão (ID-07 · 7c = baseline)**: tachado, tabelas e listas de tarefas (GFM) — evolução futura. Formatações **sem equivalente em Markdown** (sublinhado, cores, alinhamento, tamanho de fonte) **não são oferecidas** — para o armazenamento ser fiel. **Imagens não entram no texto** (ID-07 · 7d): continuam como anexos na aba "Imagens".

**Contrato do componente `RichTextEditor`** (camada 4; é o **único** ponto do sistema que conhece o Tiptap)

| Propriedade | Tipo | Descrição |
|---|---|---|
| `value` | `string` | Markdown atual do campo |
| `onChange` | `(markdown: string) => void` | Emite o Markdown a cada alteração |
| `label` | `string` | Rótulo acessível do campo ("Conteúdo") |
| `maxLength` | `number` | Limite exibido no contador (RN02) |
| `errorMessage` | `string?` | Mensagem de validação associada ao campo (`aria-describedby`) |
| `isDisabled` | `boolean?` | Bloqueia a edição durante o envio |

**Configuração do editor**: `StarterKit` com **somente** os recursos do baseline (tachado e sublinhado desativados); títulos limitados aos níveis 2–4; links restritos a `http`/`https`/`mailto`; todos os pacotes `@tiptap/*` na **mesma versão fixada**; extensão `@tiptap/markdown` para carregar e serializar Markdown; sem extensão de imagem.

**Comportamento**

- Digitar sintaxe Markdown também formata (ex.: `- ` cria lista, `## ` cria título) — útil para quem já escreve em Markdown.
- Abrir um conteúdo existente carrega o Markdown no editor; salvar devolve Markdown. O texto pode ser **normalizado** (ex.: marcador `*` vira `-`), sem mudança de sentido.
- Contador `usado / 50.000` (RN02), com aviso textual ao se aproximar do limite.
- Área do editor com **borda de controle** (`--color-border-control`), altura mínima confortável e **rolagem própria**; a barra de ferramentas permanece visível durante a rolagem do campo.
- HTML colado ou digitado **nunca é executado nem renderizado** (RN11).

**Acessibilidade do editor (RNF09)**

- Barra: `role="toolbar"` com `aria-label` ("Formatação do texto"); botões com nome acessível e `aria-pressed` para estados ativos (negrito, itálico…); navegação por **setas** dentro da barra (um único *tab stop*); alvos ≥ 44×44 px (a barra **quebra de linha** em telas estreitas).
- Área de edição: papel de caixa de texto multilinha, **rótulo associado** ("Conteúdo") e descrição com dica de atalhos; erro de validação via `aria-invalid` + `aria-describedby`.
- **Sem armadilha de foco**: `Tab` sai do editor (dentro de listas, `Tab`/`Shift+Tab` recuam/avançam o nível; `Esc` devolve o foco à barra de ferramentas — a validar na Fase 3).
- Ajuda "Atalhos de teclado" acessível por botão na barra.
- Cores e foco seguem os mesmos tokens do restante da interface.

---

## 9. Padrões de código

### 9.1 Clean Code — regras operacionais

| Diretriz | Regra aplicada no projeto |
|---|---|
| **Nomes descritivos** | Casos de uso = verbo + objeto (`RegisterContentUseCase`); booleanos com `is/has/can`; nada de abreviações (`ctx`, `mgr`, `tmp`); portas com prefixo `I` no back |
| **Funções pequenas** | Alvo ≤ 20 linhas e **uma** responsabilidade; **≤ 3 parâmetros** — acima disso, usar objeto `Input` |
| **Sem comentários explicativos** | O nome diz *o quê*; comentário só para *por quê* não óbvio (ex.: limitação do SQLite) |
| **DRY** | Validação de domínio em um único lugar por ponta; tokens de design em um único arquivo; componentes do design system reutilizados; **uma** folha de estilo para o texto de conteúdo; **um** caminho de listagem para navegar e buscar |
| **KISS** | Sem bibliotecas utilitárias onde a plataforma resolve (`fetch`, `Intl`, `<dialog>`, `<details>`) |
| **Sem números/strings mágicos** | Limites das regras (`3`, `150`, `20`…) vivem em constantes nomeadas no domínio |
| **Tratamento de erro** | Exceções tipadas no back; nunca `catch` vazio; mensagens de usuário em português, sem vazar detalhes internos |
| **Async** | `async/await` com `CancellationToken` (back) e `AbortController` (front) |

### 9.2 Convenções

- **Código, rotas da API e nomes de arquivos em inglês**; **textos da interface em pt-BR** (ND-07). *(Rotas de tela do front são em pt-BR, ex.: `/grupos`, `/busca`.)*
- Back: `PascalCase` tipos/métodos, `_camelCase` campos privados, *records* para `Input`/`Output`, *nullable reference types* habilitado, avisos tratados como erro.
- Front: **TypeScript** (ID-05 = 5c) com `strict` ligado; portas como `interface`; `PascalCase` componentes, `camelCase` funções/hooks (`use…`), um componente por arquivo, **CSS Modules** alimentado pelos tokens (ID-05 = 5d).

---

## 10. Dependências

> **Nada foi instalado.** A coluna *Status* mostra o que já foi aprovado por você e o que ainda depende de resposta. Versões exatas serão **fixadas** (sem `^`/`~` em pacotes críticos) e confirmadas no momento da instalação, na Fase 1.

### 10.1 Aprovadas (citadas no enunciado)

| Item | Versão |
|---|---|
| .NET / ASP.NET Core | 10 (LTS) — já instalado no seu ambiente |
| React / React DOM | 19.3 |
| SQLite | — |

### 10.2 Back-end

| Pacote (NuGet) | Para quê | Camada | Status |
|---|---|---|---|
| `Microsoft.EntityFrameworkCore.Sqlite` | Acesso ao SQLite + migrations | Infrastructure | ✅ Aprovado (ID-05 · 5a) |
| `Microsoft.EntityFrameworkCore.Design` | Geração de migrations (somente dev) | Infrastructure/Api | ✅ Aprovado (ID-05 · 5a) |
| `xunit` + `xunit.runner.visualstudio` + `Microsoft.NET.Test.Sdk` | Testes de Domain e Application | Tests | ✅ Aprovado (ID-05 · 5b) |
| `Microsoft.AspNetCore.OpenApi` | Documento OpenAPI do contrato | Api | ✅ Aprovado (ND-19, alterada pelo usuário) |

**Não serão usados**: MediatR, AutoMapper, FluentValidation (mapeamento e validação manuais — KISS e sem dependência extra).

### 10.3 Front-end

| Pacote (npm) | Para quê | Status |
|---|---|---|
| `vite` + `@vitejs/plugin-react` | Servidor de desenvolvimento, build, proxy `/api` | ✅ Aprovado (5a) |
| `react-router` | Rotas das telas | ✅ Aprovado (5a) |
| `typescript` + `@types/react` + `@types/react-dom` | Tipagem estática | ✅ Aprovado (5c) |
| `react-markdown` | Renderização **segura** de Markdown na leitura (traz dependências transitivas `remark`/`rehype`) | ✅ Aprovado (5b) |
| `eslint` (+ plugins do template) | Lint e **regra de dependência entre camadas** (`no-restricted-imports`) | ✅ Aprovado (5b) |
| `vitest` + `@testing-library/react` | Testes de domínio, casos de uso e telas-chave | ✅ Aprovado (5b) |
| `@tiptap/react` · `@tiptap/pm` · `@tiptap/starter-kit` · `@tiptap/markdown` | **Editor WYSIWYG** com entrada/saída em Markdown *(transitivas relevantes: ProseMirror, `marked`)* | ✅ Aprovado (ID-07 · 7a) |
| `remark-gfm` (+ extensões Tiptap de tabela/tarefa) | Tachado, tabelas e listas de tarefas | 🚫 **Não será instalado** (ID-07 · 7c = baseline); reavaliar como evolução |

**Não serão usados**: Redux/Zustand, TanStack Query, Axios (usa-se `fetch`), Tailwind/MUI/Bootstrap, bibliotecas de formulário, lodash, date-fns (usa-se `Intl`), bibliotecas de ícones (SVG próprio), bibliotecas de modal/lightbox, **bibliotecas de busca** (a busca é feita no banco).

---

## 11. Plano de implementação, critérios de aceite e riscos

### 11.1 Estrutura de pastas

```
acervo/
├── backend/
│   ├── Acervo.slnx
│   ├── src/
│   │   ├── Acervo.Domain/            # Contents/ Groups/ Categories/ Shared/
│   │   ├── Acervo.Application/       # <Feature>/<UseCase>/ · Ports/ · Shared/ (UploadPolicy, SearchTextBuilder)
│   │   ├── Acervo.InterfaceAdapters/ # Controllers/ Presenters/ ViewModels/
│   │   ├── Acervo.Infrastructure/    # Persistence/ (DbContext, Mappings, Repositories, Migrations) · Storage/
│   │   └── Acervo.Api/               # Program.cs · DependencyInjection · ExceptionHandling
│   └── tests/
│       ├── Acervo.Domain.Tests/
│       └── Acervo.Application.Tests/
├── frontend/
│   ├── .nvmrc                        # versão do Node fixada
│   └── src/
│       ├── domain/                   # entities · rules
│       ├── application/              # use-cases · ports
│       ├── interface-adapters/       # gateways · presenters · controllers
│       └── frameworks/               # ui (design-system, editor, markdown, layout, pages) · routing · http · composition
└── README.md
```

### 11.2 Fases

| Fase | Entrega | Definição de pronto |
|---|---|---|
| **0** | Esta especificação revisada e dúvidas respondidas | Impeditivas ✅ respondidas · **premissas ND confirmadas** ⏳ |
| **1** | Esqueleto: solution, projetos, referências corretas; app React base (TypeScript); pastas por camada; proxy; tokens de design; Node fixado | Back compila e responde `/health`; front sobe; regra de dependência já reprovando imports indevidos |
| **2** | Back-end por fatias verticais: Domain (+testes) → Application (+testes, incl. `SearchTextBuilder`) → Infrastructure (EF, migrations, storage, consulta de busca) → Adapters → Api | Todos os endpoints do §6 funcionando (inclusive `search`); testes de Domain/Application verdes; erros em ProblemDetails |
| **3** | Front-end: design system + AppShell (menu de 2 níveis + busca) → Início/Listagem → Resultados da busca → Detalhe (render Markdown) → Formulário + **Editor WYSIWYG** | Fluxos ponta a ponta; estados de carregando/vazio/erro; checklists §8.5 e §8.6 |
| **4** | Integração: seed de exemplo, revisão de acessibilidade, README (como rodar), revisão final de Clean Code | Critérios de aceite abaixo todos atendidos |

### 11.3 Critérios de aceite

| ID | Critério |
|---|---|
| AC01 | Cadastrar o exemplo do §13 **pelo editor WYSIWYG** sem erro; ele aparece no menu em **Livros › TI** |
| AC02 | Menu em dois níveis com contadores; só o grupo ativo vem expandido; clicar no Grupo abre a listagem de todo o grupo e clicar na Categoria abre só a categoria |
| AC03 | Toda listagem e toda busca são **paginadas** (12 por página) — nunca o acervo inteiro |
| AC04 | Detalhe exibe abas; abas sem itens não aparecem; o Markdown (listas, negrito, links) é exibido com o **mesmo visual** do editor |
| AC05 | Formulário: campos essenciais visíveis; complementos recolhidos com contador; **Categoria só habilita após o Grupo**; erros por campo anunciados e focados |
| AC06 | Upload rejeita extensão não permitida, arquivo acima do limite e imagem com assinatura inválida, com mensagem clara |
| AC07 | Download de arquivo e ampliação de imagem funcionam; nome original preservado no download |
| AC08 | Editar e excluir (com confirmação) funcionam; excluir apaga os arquivos físicos *(se ND-01 confirmado)* |
| AC09 | Todo o fluxo é operável **só pelo teclado**; contrastes conforme §8.2; alvos ≥ 44 px |
| AC10 | Em 360 px de largura a interface permanece utilizável (menu em gaveta, barra do editor quebrando linha, sem rolagem horizontal da página) |
| AC11 | Nenhuma camada interna importa/referencia camada externa (verificado por compilação/lint) |
| AC12 | Funções ≤ ~20 linhas, ≤ 3 parâmetros, sem duplicações relevantes, sem comentários explicativos |
| AC13 | Todas as formatações do §8.6 funcionam; **salvar → reabrir** preserva o sentido do texto; HTML digitado/colado **não** é executado nem renderizado |
| AC14 | Editor operável só por teclado, **sem armadilha de foco**; botões da barra anunciam seu estado (`aria-pressed`); campo possui rótulo e anuncia erros |
| AC15 | Busca: "relacional" encontra o item do exemplo; "algebra" encontra "álgebra"; "ti" encontra pelo nome da categoria; termo sem resultado mostra estado vazio |
| AC16 | Busca trata `%` e `_` como texto literal e rejeita termo acima de 100 caracteres com mensagem clara |

### 11.4 Riscos técnicos conhecidos

| # | Risco | Mitigação |
|---|---|---|
| R1 | **Colar** texto com sintaxe Markdown (ex.: a lista do enunciado) pode não ser convertido em formatação pelo editor | Validar na Fase 3; se necessário, tratar a colagem de forma mínima ou aceitar a limitação e documentá-la |
| R2 | **Normalização** do Markdown no ciclo carregar → editar → salvar (ex.: troca de marcadores) | Aceita como equivalente semanticamente; coberta por AC13 |
| R3 | Editor e leitura **divergirem visualmente** (renderizadores distintos) | Folha de estilos única (§8.3) e conferência visual com o seed |
| R4 | `LIKE '%termo%'` faz varredura da tabela | Adequado à escala da POC; evolução para FTS5 já mapeada (ND-18) |
| R5 | Requisitos de versão do Node variarem entre pacotes | Versão fixada em `.nvmrc`/`engines`; checagem na Fase 1 |
| R6 | A extensão `@tiptap/markdown` é recente (desde a 3.7) e pode ter arestas na conversão | Versão fixada; testes automatizados de *round-trip* (Markdown → editor → Markdown) com o seed e casos de borda; biblioteca isolada em `RichTextEditor`, permitindo troca |

---

## 12. Dúvidas

### 12.1 ⛔ Impeditivas — todas respondidas ✅

**Resumo de status**

| ID | Tema | Status |
|---|---|---|
| ID-01 | Relação Grupo × Categoria | ✅ Respondida — **B** |
| ID-02 | Formato do campo Conteúdo | ✅ Respondida — **B**; 🔄 complementada pelo pedido de WYSIWYG (ver ID-07) |
| ID-03 | Ciclo de vida de Grupos e Categorias | ✅ Respondida — **Aceito** |
| ID-04 | Significado de "anotação" | ✅ Respondida — **A** |
| ID-05 | Dependências e linguagem do front | ✅ Respondida |
| ID-06 | Armazenamento de arquivos | ✅ Respondida — **A** |
| **ID-07** | **Biblioteca do editor WYSIWYG e formato de armazenamento** | ✅ Respondida — **A · Markdown · baseline · imagens fora** |

---

**ID-01 — Relação entre Grupo e Categoria, e navegação** ✅
- **A) Dimensões independentes**: Grupo = *tipo de material*; Categoria = *área*; "TI" é a mesma categoria em qualquer grupo.
- **B) Hierarquia**: Categoria pertence a um Grupo ("TI" em Livros ≠ "TI" em Artigos). Menu em dois níveis.

*Recomendação original:* A.
**Sua resposta:** `B`
**➡ Aplicado:** `Category.GroupId` (§2); `Content` referencia só a Categoria (AD7); unicidade de categoria por grupo (RN04, §7); menu de dois níveis e novas rotas (§8.4); `GET /api/groups` devolve a árvore (§6).

**ID-02 — Formato do campo "Conteúdo"** ✅ 🔄
- **A)** Texto simples · **B)** Markdown (+ `react-markdown`) · **C)** Texto rico/WYSIWYG.

*Recomendação original:* B.
**Sua resposta:** `B`
**➡ Aplicado:** armazenamento em **Markdown** (RN02, RN11, AD8); leitura com `react-markdown` (aprovado).
**🔄 Complemento:** você pediu em seguida um **editor WYSIWYG**. Isso muda a *forma de escrever*, não a de armazenar: o editor converte de/para Markdown. A biblioteca foi definida em **ID-07** (Tiptap).

**ID-03 — Ciclo de vida de Grupos e Categorias** ✅
Grupos e Categorias **criados direto no formulário** (escolher existente ou digitar nome novo), **sem telas de gestão** (sem renomear/excluir na POC).
**Sua resposta:** `Aceito a proposta`
**➡ Aplicado:** RF10/RN10; campo com `<input list>` + `<datalist>` nativos; **Categoria dependente do Grupo** escolhido (por causa de ID-01 = B).

**ID-04 — O que significa "anotação"** ✅
- **A)** É só a finalidade do campo Conteúdo · **B)** Recurso adicional (entidade `Annotation`).
**Sua resposta:** `A`
**➡ Aplicado:** nenhuma entidade extra; o editor WYSIWYG reforça o uso do Conteúdo como espaço de anotação.

**ID-05 — Aprovação de dependências e linguagem do front** ✅
**Sua resposta:** `5a: Conjunto necessário aprovado · 5b: Aprovo os recomendados e o condicional · 5c: TypeScript · 5d: Aprovo`
**➡ Aplicado:** §10 (status ✅); TypeScript `strict` e CSS Modules (§9.2). *Observação:* a aprovação em 5b cobre `react-markdown`; **não** cobre bibliotecas do editor WYSIWYG, por isso ID-07.

**ID-06 — Onde guardar imagens e arquivos** ✅
**Sua resposta:** `A` (disco local)
**➡ Aplicado:** `IFileStorage` → `LocalDiskFileStorage`; só a `StorageKey` vai ao SQLite (§7).

---

**ID-07 — Biblioteca do editor WYSIWYG e formato de armazenamento** ✅

Você pediu um editor WYSIWYG "se possível". É possível, mas exige uma biblioteca **não citada** no enunciado — por isso preciso da sua aprovação antes de instalar qualquer coisa. Pesquisei as opções em 24/10/2026:

| Opção | Pacotes | Pontos fortes | Pontos de atenção |
|---|---|---|---|
| **A) Tiptap** *(recomendada)* | `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/markdown` | **Headless**: a barra de ferramentas é feita com o **nosso design system** (consistência e acessibilidade sob controle); suporta React 19; núcleo open source (MIT); extensão **oficial** de Markdown (baseada em CommonMark) desde a versão 3.7 | Extensão de Markdown relativamente recente; a barra de ferramentas é código nosso; traz dependências transitivas (ProseMirror, `marked`) |
| **B) MDXEditor** | `@mdxeditor/editor` | Markdown nativo; compatível com React 18 e 19; MIT; barra de ferramentas pronta | **UI própria** (exige sobrescrever CSS para seguir a paleta → risco de inconsistência visual); mais pesado; recursos de MDX/JSX que não usaremos |
| **C) Lexical** | `lexical`, `@lexical/react`, `@lexical/markdown` e correlatos | Mantido pela Meta; headless | Mais baixo nível: mais código a escrever que na opção A, sem ganho para esta POC |
| **D) Guardar HTML ou JSON do editor** | qualquer das acima | — | Maior superfície de XSS (HTML), busca e prévia mais complexas, **contradiz ID-02 = B** → **não recomendado** |

**Sub-perguntas**

- **7a — Biblioteca**: aprova a opção **A (Tiptap)** com os quatro pacotes listados (versões fixadas na instalação)? Se preferir B ou C, indique.
- **7b — Formato armazenado**: **Markdown** (recomendado; mantém ID-02 = B, a busca e a leitura com `react-markdown`)?
- **7c — Conjunto de formatações**: **baseline CommonMark** do §8.6 (sem biblioteca extra) ou incluir também **GFM** (tachado, tabelas, listas de tarefas), o que exigiria `remark-gfm` e extensões de tabela/tarefa do Tiptap? *Recomendo baseline agora e GFM como evolução.*
- **7d — Imagens dentro do texto**: confirmar que ficam **fora do escopo** (imagens continuam como anexos na aba "Imagens").

**Sua resposta:** `7a: Aprovo a opção A · 7b: Sim, formato Markdown · 7c: baseline · 7d: Sim, por enquanto mantém fora do escopo`
**➡ Aplicado:**
- **7a** → Tiptap com `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/markdown` ✅ (§10.3); componente isolado com contrato definido (§8.6); risco R6 (§11.4).
- **7b** → `Body` armazenado em Markdown; leitura com `react-markdown` (RN02, RN11, AD8).
- **7c** → só CommonMark; **`remark-gfm` não será instalado**; tachado, tabelas e tarefas ficam como evolução (§1.3, §8.6).
- **7d** → sem extensão de imagem no editor; imagens permanecem como anexos (§1.3, §8.6).

### 12.2 🟡 Não impeditivas (sigo com a premissa, **após sua confirmação**)

| ID | Dúvida | Premissa adotada |
|---|---|---|
| **ND-01** | Edição e exclusão entram na POC? | **Sim** (RF06/RF07), pois "organização" exige manutenção do acervo |
| **ND-02** | Tipos e tamanhos de upload | Imagens: `png, jpg, jpeg, webp, gif` até **5 MB**. Arquivos: `pdf, txt, md, docx, xlsx, pptx, zip` até **20 MB**. SVG **não** aceito (risco de script embutido). Máx. 10 imagens + 10 arquivos por conteúdo |
| **ND-03** | Autenticação | **Sem login**, usuário único, uso local. Arquitetura não impede adicioná-la depois |
| **ND-04** | Tela inicial | **Início enxuto**: cards de Grupos + até 6 recentes (nunca todo o acervo) |
| **ND-05** | Formulário: wizard ou página única? | **Página única** com essencial visível e complementos em painéis recolhidos (menos cliques, mesma divulgação progressiva) |
| **ND-06** | Tema e cores | **Tema escuro único**, com a paleta do §8.2 (limão/verde-esverdeado, azul-escuro, cinzas e preto) |
| **ND-07** | Idioma e nome | **UI em pt-BR; código, API e arquivos em inglês**; nome provisório **"Acervo"** |
| **ND-08** | Decisões AD1–AD9 (§5.5) | Aceitas como descritas, em especial **AD1** (gateways em Infrastructure), **AD2** (EF mapeando entidades via Fluent API), **AD7** (Grupo derivado da Categoria) e **AD9** (busca por `SearchText` + `LIKE`) |
| **ND-09** | Paginação e ordenação | **12 itens/página**; ordem por **atualização mais recente** (listagens e busca) |
| **ND-10** | Dados de exemplo | **Seed** apenas em desenvolvimento, com o exemplo do §13 |
| **ND-11** | Busca textual | ✅ **Confirmada por você: dentro do escopo.** Detalhes em ND-16 a ND-18 |
| **ND-12** | Descrição por imagem | **Campo opcional** usado como `alt`; sem ele, usa-se o nome do arquivo |
| **ND-13** | Grupos/Categorias sem conteúdo no menu | A API devolve **todos** os nós; o **menu oculta** os que têm 0 conteúdos (regra do Presenter); o formulário lista todos |
| **ND-14** | Repositório e ambiente | Monorepo com `backend/` e `frontend/`; **sem Docker/CI** na POC; comunicação em dev via **proxy do Vite** em `/api` |
| **ND-15** | Ambiente local | **.NET 10** já instalado ✅. **Node.js não instalado — você delegou a escolha a mim:** recomendo o **Node.js 24 (LTS)**, a linha mais madura do ecossistema (suportada até abr/2028) — o Node 26 está sendo promovido a LTS neste mês de outubro e pode ser adotado depois sem impacto. A versão será fixada em `.nvmrc` e `engines`, e os requisitos dos pacotes serão conferidos na Fase 1. **Sistema operacional não informado:** o README usará apenas comandos multiplataforma (`dotnet`, `npm`), sem scripts específicos de SO |
| **ND-16** | O que a busca procura | **Título + texto do conteúdo + nome do Grupo + nome da Categoria + rótulos dos links**, insensível a maiúsculas e acentos; várias palavras = **todas** devem aparecer (E); termo de 2 a 100 caracteres |
| **ND-17** | Como a busca aparece | Campo no **cabeçalho**, em todas as telas; envia com **Enter**/botão (sem busca a cada tecla); abre `/busca?q=`; escopo **global**; resultados paginados; **sem destaque** dos termos e **sem ranking** (ordem por atualização) |
| **ND-18** | Técnica da busca | Coluna `SearchText` normalizada + `LIKE` (AD9). **FTS5** do SQLite (ranking, destaque) fica como evolução, pois exigiria tabela virtual e SQL fora do EF Core |
| **ND-19** | `Microsoft.AspNetCore.OpenApi` | ✅ **Alterada pelo usuário: instalar.** Gera o documento OpenAPI em `/openapi/v1.json` (apenas em Development). Uma interface interativa (Swagger UI, Scalar…) seria outra biblioteca e **não** foi instalada |

---

## 13. Exemplo de cadastro mapeado

| Campo do formulário | Valor |
|---|---|
| Título | `Livros interessantes para análise` |
| Grupo | `Livros` |
| Categoria | `TI` *(dentro do grupo Livros)* |
| Links / Imagens / Arquivos | *(nenhum no exemplo)* |
| Conteúdo | Lista com 12 itens, **título da obra em negrito**, criada no editor WYSIWYG e **armazenada como Markdown** no formato abaixo |

```markdown
- **C How to Program** (Paul Deitel & Harvey Deitel): Fundamentos de lógica, vetores, ponteiros e gerenciamento manual de memória próximo ao hardware.
- **Introdução a Sistemas de Bancos de Dados** (C. J. Date): Teoria pura do modelo relacional, álgebra relacional e normalização além dos SGBDs comerciais.
- **…** (demais 10 itens exatamente como no enunciado)
```

Este registro também será o **seed de desenvolvimento** (ND-10), o **caso de teste do AC01** e a **base das buscas de AC15** (ex.: "álgebra", "relacional", "ti").

---

*Documento mantido junto ao código, em `docs/`. Veja o §14 para o estado da implementação.*

---

## 14. Registro de implementação

### 14.1 Como as premissas foram tratadas

A instrução *"Pode iniciar a implementação com a documentação OpenAPI instalada"* foi interpretada como **aprovação das premissas ND-01 a ND-18** (sem alterações) e **alteração de ND-19** (instalar o OpenAPI). Se alguma premissa precisar mudar, basta indicar o ID.

### 14.2 Entregas por fase

| Fase | Entrega |
|---|---|
| 1 · Esqueleto | Solution `.slnx` com 5 projetos + 2 de testes; pacotes NuGet com versão centralizada; front Vite + TypeScript; regra de dependência entre camadas no lint; tokens de design da paleta validada |
| 2 · Back-end | Domain, Application (casos de uso, política de upload, busca), InterfaceAdapters (Controllers/Presenters), Infrastructure (EF Core/SQLite, disco local), Api (OpenAPI, ProblemDetails, *seed*) |
| 3 · Front-end | Design system, AppShell com menu de dois níveis e busca, Início, listagens paginadas, busca, detalhe em abas, formulário com divulgação progressiva e **editor WYSIWYG** (Tiptap isolado em `RichTextEditor`) |
| 4 · Integração | *Seed* do exemplo, README, testes automatizados, revisão de segurança de upload/renderização |

### 14.3 Verificações executadas

| Item | Resultado |
|---|---|
| Back · `Domain`, `Application`, `InterfaceAdapters` | Compilam **sem avisos** (avisos tratados como erro) |
| Back · testes de Domain e Application | **75 de 75 aprovados**, executando os mesmos arquivos de teste contra o código real* |
| Front · `tsc`, `eslint`, `vite build` | Sem erros |
| Front · testes (Vitest) | **125 de 125 aprovados**: domínio, casos de uso, gateways, presenters, rascunho do formulário, Tabs, paginação, `useAsync`, Markdown seguro, ciclo Markdown↔editor e **integração do app inteiro** (menu, busca, detalhe, exclusão, formulário e payload multipart) |
| Regra de dependência (AC11) | Comprovada: uma violação proposital foi reprovada pelo lint; no back, é imposta pelas referências de projeto |
| Build de produção | Rotas do formulário carregadas sob demanda (editor fora do pacote principal: ~147 kB gzip) |

\* Os testes xUnit reais não puderam ser restaurados no ambiente de desenvolvimento (sem acesso ao NuGet). Foram executados por um executor descartável que reproduz o subconjunto da API do xUnit usado. Rode `dotnet test` na sua máquina para a confirmação definitiva.

### 14.4 O que NÃO foi verificado

| Item | Motivo | Como confirmar |
|---|---|---|
| **Compilação de `Acervo.Infrastructure` e `Acervo.Api`** | Dependem de EF Core e OpenApi (NuGet inacessível no ambiente). Verificação parcial feita: nenhum erro além das dependências ausentes | `dotnet build` na sua máquina |
| **Execução do back-end e da API ponta a ponta** | Consequência do item anterior | Seguir o README |
| **Migration inicial** | Exige a ferramenta `dotnet-ef` | Passo "Gera a migration inicial" do README |
| **Teste em navegador real** (visual, foco, leitor de tela, colagem de Markdown — R1) | Sem navegador no ambiente | Revisão manual com o checklist §8.5/§8.6 |
| **Versões NuGet** (`10.0.0` do EF/OpenApi, xunit 2.9.3, runner 3.1.0, Test.Sdk 17.14.1) | Não confirmadas contra o NuGet.org | Atualizar com `dotnet add package` se necessário |

### 14.5 Desvios e adições em relação ao combinado

| # | Desvio | Motivo |
|---|---|---|
| 1 | `jsdom` 30.1.3 e `@testing-library/dom` 10.4.2 (dev) | Exigidos para testar componentes com Vitest + Testing Library (aprovados em ID-05). **Dependências implícitas, não listadas antes** |
| 2 | `dotnet-ef` 10.0.0 como **ferramenta local** (`backend/.config/dotnet-tools.json`) | Necessária para gerar migrations; acompanha o `EntityFrameworkCore.Design` aprovado |
| 3 | TypeScript **6.0.3** (não 7.x) | `typescript-eslint` 8.72 exige TypeScript < 6.1 |
| 4 | React **19.3.1** (patch da linha 19.3) | Versão estável mais recente da linha pedida |
| 5 | `engines` do Node: `^22.22.2 \|\| ^24.15.0 \|\| >=26`; `.nvmrc` = 24 | Exigência de `react-router` 8 e `jsdom` 30 |
| 6 | `TreatWarningsAsErrors` desligado em Infrastructure, Api e projetos de teste | Código não verificável no ambiente; ligar após o primeiro build limpo |
| 7 | Pré-visualização de **imagens novas** no formulário não exibida (nome e tamanho apenas); imagens já salvas mostram miniatura | Evita *object URLs* sujeitos a vazamento e ao duplo *mount* do React em desenvolvimento |
| 8 | Preparação do banco em desenvolvimento via `IHostedService` | Evita que `dotnet ef` execute a migração/seed e impeça a criação da primeira migration |
| 9 | Porta da API: **5080**; front: **5173** | Escolha não especificada na spec |

### 14.6 Risco R6 — materializado e corrigido

O teste de ciclo Markdown↔editor revelou que o serializador do editor grava `&` como `&amp;` (e `<`, `>` como entidades; `*`, `_`, `\` com barra de escape). É Markdown válido e a leitura decodifica corretamente, mas a **prévia dos cards** e o **`SearchText`** mostrariam o texto cru. **Correção:** os extratores de texto puro (`MarkdownPlainText` no back e `toExcerpt` no front) agora decodificam entidades e escapes, com testes nos dois lados. O conteúdo de exemplo — que contém `&` em vários títulos — é coberto por teste.

### 14.7 Critérios de aceite — situação

| ID | Situação |
|---|---|
| AC01–AC05, AC08, AC13–AC16 | Cobertos por testes automatizados (integração do front e testes de domínio/aplicação), **pendente confirmação no ambiente real** |
| AC06 | Regras cobertas por testes do back (extensão, tamanho, assinatura); fluxo HTTP pendente de execução |
| AC07, AC09, AC10, AC12 | **Revisão manual necessária** (download/ampliação, teclado completo e contraste em navegador, 360 px) |
| AC11 | ✅ Verificado |
