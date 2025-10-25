# Sistema de Gestão de Igreja

Sistema completo de gestão para igrejas, desenvolvido com React, TypeScript, Tailwind CSS e Supabase (Lovable Cloud).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Páginas](#páginas)
- [Componentes](#componentes)
- [Hooks Customizados](#hooks-customizados)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Como Executar](#como-executar)
- [Deploy](#deploy)

## 🎯 Sobre o Projeto

Sistema de gestão completo para igrejas que permite gerenciar membros, ministérios, eventos, louvor, finanças, frequência e comunicações internas. O sistema possui controle de acesso baseado em roles (PASTOR, LEADER, MINISTER, MEMBER, VISITOR).

## 🚀 Tecnologias Utilizadas

### Core
- **React 18.3.1** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **React Router DOM 6.30.1** - Gerenciamento de rotas

### UI/Styling
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **Radix UI** - Primitivos acessíveis para componentes
- **Lucide React 0.462.0** - Ícones
- **tailwindcss-animate** - Animações CSS
- **class-variance-authority** - Gerenciamento de variantes de componentes
- **tailwind-merge** - Merge de classes Tailwind

### Backend/Database
- **Supabase JS 2.58.0** - Cliente Supabase (Lovable Cloud)
- **TanStack Query 5.83.0** - Gerenciamento de estado servidor/cache

### Formulários e Validação
- **React Hook Form 7.61.1** - Gerenciamento de formulários
- **Zod 3.25.76** - Validação de schemas
- **@hookform/resolvers 3.10.0** - Resolvers para validação

### Data Visualization
- **Recharts 2.15.4** - Gráficos e visualizações
- **date-fns 3.6.0** - Manipulação de datas

### UI Components Específicos
- **Sonner 1.7.4** - Toast notifications
- **cmdk 1.1.1** - Command palette
- **embla-carousel-react 8.6.0** - Carrossel
- **input-otp 1.4.2** - Input para OTP
- **react-day-picker 8.10.1** - Seletor de datas
- **react-resizable-panels 2.1.9** - Painéis redimensionáveis
- **vaul 0.9.9** - Drawer component
- **next-themes 0.3.0** - Gerenciamento de temas

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx       # Proteção de rotas
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx      # Layout principal
│   │   │   └── Sidebar.tsx              # Menu lateral
│   │   └── ui/                          # Componentes shadcn/ui
│   ├── hooks/
│   │   ├── useAuth.tsx                  # Hook de autenticação
│   │   ├── useAnnouncements.tsx         # Gerenciamento de avisos
│   │   ├── useAttendance.tsx            # Gerenciamento de frequência
│   │   ├── useChurchStats.tsx           # Estatísticas da igreja
│   │   ├── useChurches.tsx              # Gerenciamento de igrejas
│   │   ├── useCostCenters.tsx           # Gerenciamento de centros de custo
│   │   ├── useEvents.tsx                # Gerenciamento de eventos
│   │   ├── useFinancialAccounts.tsx     # Contas financeiras
│   │   ├── useFinancialCategories.tsx   # Categorias financeiras
│   │   ├── useFinancialContacts.tsx     # Contatos financeiros
│   │   ├── useFinancialTransactions.tsx # Transações financeiras
│   │   ├── useMembers.tsx               # Gerenciamento de membros
│   │   ├── useMinistries.tsx            # Gerenciamento de ministérios
│   │   ├── useMinistryRoles.tsx         # Papéis em ministérios
│   │   ├── useProfiles.tsx              # Perfis de usuários
│   │   ├── useSchedules.tsx             # Escalas/agendamentos
│   │   ├── useSongs.tsx                 # Gerenciamento de músicas
│   │   └── useWorshipSets.tsx           # Sets de louvor
│   ├── pages/
│   │   ├── Index.tsx                    # Página inicial
│   │   ├── Login.tsx                    # Login
│   │   ├── Register.tsx                 # Registro de igreja
│   │   ├── UserRegister.tsx             # Registro de usuário
│   │   ├── Dashboard.tsx                # Dashboard principal
│   │   ├── Members.tsx                  # Gestão de membros
│   │   ├── Ministries.tsx               # Gestão de ministérios
│   │   ├── Events.tsx                   # Gestão de eventos
│   │   ├── Worship.tsx                  # Gestão de louvor
│   │   ├── Announcements.tsx            # Gestão de avisos
│   │   ├── Attendance.tsx               # Gestão de frequência
│   │   ├── Reports.tsx                  # Relatórios
│   │   ├── Finance.tsx                  # Dashboard financeiro
│   │   ├── FinancialTransactions.tsx    # Transações financeiras
│   │   ├── FinancialCategories.tsx      # Categorias financeiras
│   │   ├── FinancialAccounts.tsx        # Contas financeiras
│   │   ├── FinancialContacts.tsx        # Contatos financeiros
│   │   ├── CostCenters.tsx              # Centros de custo
│   │   ├── AccessDenied.tsx             # Acesso negado
│   │   └── NotFound.tsx                 # Página não encontrada
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Cliente Supabase (auto-gerado)
│   │       └── types.ts                 # Tipos TypeScript (auto-gerado)
│   ├── lib/
│   │   └── utils.ts                     # Utilitários
│   ├── App.tsx                          # Componente raiz
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Estilos globais
│   └── vite-env.d.ts                    # Tipos Vite
├── supabase/
│   ├── config.toml                      # Configuração Supabase
│   ├── functions/
│   │   └── create-member/
│   │       └── index.ts                 # Edge function para criar membros
│   └── migrations/                      # Migrações do banco de dados
├── public/
│   ├── robots.txt                       # Configuração SEO
│   └── favicon.ico                      # Ícone do site
├── index.html                           # HTML principal
├── tailwind.config.ts                   # Configuração Tailwind
├── vite.config.ts                       # Configuração Vite
└── package.json                         # Dependências e scripts
```

## ✨ Funcionalidades

### Módulos Principais

1. **Autenticação e Autorização**
   - Login/logout
   - Registro de igrejas
   - Registro de usuários
   - Sistema de roles (PASTOR, LEADER, MINISTER, MEMBER, VISITOR)
   - Proteção de rotas baseada em roles

2. **Dashboard**
   - Visão geral de estatísticas
   - Membros ativos
   - Novos membros
   - Eventos agendados
   - Frequência média

3. **Gestão de Membros**
   - CRUD completo de membros
   - Perfis individuais
   - Status (ACTIVE, INACTIVE, VISITOR)
   - Upload de fotos

4. **Gestão de Ministérios**
   - CRUD de ministérios
   - Designação de líderes
   - Membros por ministério
   - Papéis específicos em cada ministério

5. **Gestão de Eventos**
   - CRUD de eventos
   - Tipos de eventos (CULTO, REUNIAO, ESTUDO, etc.)
   - Status (SCHEDULED, ONGOING, FINISHED, CANCELLED)
   - Escalas de ministérios
   - Detecção de conflitos de escala

6. **Gestão de Louvor**
   - Biblioteca de músicas (título, artista, tom, BPM, letras, cifras)
   - Sets de louvor
   - Histórico de músicas tocadas
   - Duração total dos sets

7. **Gestão de Avisos**
   - CRUD de avisos
   - Categorias (GERAL, EVENTO, MINISTERIO, URGENTE)
   - Publicação agendada
   - Data de expiração
   - Avisos fixados
   - Direcionamento por roles ou ministérios
   - Controle de visualizações

8. **Gestão de Frequência**
   - Registro de presença em eventos
   - Status (PRESENT, ABSENT, EXCUSED, LATE)
   - Relatórios de frequência

9. **Módulo Financeiro**
   - **Dashboard Financeiro**: Visão geral com indicadores
   - **Transações**: CRUD completo de receitas e despesas
   - **Categorias**: Organização de transações por categorias
   - **Contas**: Gestão de contas bancárias/caixas
   - **Contatos**: Cadastro de fornecedores e doadores
   - **Centros de Custo**: Organização por departamentos/projetos
   - **Tipos de Pagamento**: Único, parcelado, recorrente
   - **Status**: Pago, pendente, vencido, cancelado
   - **Anexos**: Upload de comprovantes

10. **Relatórios**
    - Relatórios estatísticos
    - Visualizações gráficas
    - Exportação de dados

## 📄 Páginas

### Públicas

#### `Index.tsx`
- Página inicial do site
- Landing page com informações sobre o sistema
- Links para login e registro

#### `Login.tsx`
- Formulário de login
- Autenticação via email/senha
- Redirecionamento para dashboard após login

#### `Register.tsx`
- Registro de novas igrejas
- Criação de conta de pastor (role PASTOR)
- Validação de dados

#### `UserRegister.tsx`
- Registro de usuários em igrejas existentes
- Seleção de igreja
- Atribuição de role

### Protegidas (Requer Autenticação)

#### `Dashboard.tsx`
- Dashboard principal com cards estatísticos
- Gráficos de crescimento
- Próximos eventos
- Acesso rápido aos módulos

#### `Members.tsx`
- Listagem de membros com filtros
- Criação, edição e exclusão de membros
- Visualização de perfis
- Upload de fotos
- **Roles permitidas**: PASTOR, LEADER

#### `Ministries.tsx`
- Gestão completa de ministérios
- Designação de líderes
- Adição/remoção de membros
- Papéis customizados por ministério
- **Roles permitidas**: PASTOR, LEADER

#### `Events.tsx`
- Calendário de eventos
- CRUD de eventos
- Criação de escalas
- Verificação de conflitos
- **Roles permitidas**: PASTOR, LEADER

#### `Worship.tsx`
- Biblioteca de músicas
- Criação de sets de louvor
- Histórico de músicas
- **Roles permitidas**: PASTOR, LEADER, MINISTER

#### `Announcements.tsx`
- Visualização de avisos
- CRUD de avisos (pastores e líderes)
- Filtros por categoria
- Marcação de leitura
- **Roles permitidas**: Todos autenticados

#### `Attendance.tsx`
- Registro de frequência em eventos
- Relatórios de presença
- Status de participação
- **Roles permitidas**: PASTOR, LEADER

#### `Reports.tsx`
- Relatórios estatísticos
- Gráficos e visualizações
- Exportação de dados
- **Roles permitidas**: PASTOR

#### `Finance.tsx`
- Dashboard financeiro com indicadores
- Saldo total das contas
- Receitas e despesas do mês
- Transações recentes
- Navegação rápida para submódulos
- **Roles permitidas**: PASTOR, LEADER

#### `FinancialTransactions.tsx`
- Listagem de transações com filtros
- Criação de receitas e despesas
- Edição e exclusão
- Anexos e comprovantes
- Tipos: único, parcelado, recorrente
- **Roles permitidas**: PASTOR, LEADER

#### `FinancialCategories.tsx`
- Gestão de categorias de receitas
- Gestão de categorias de despesas
- Cores personalizadas
- Ativação/desativação
- **Roles permitidas**: PASTOR, LEADER

#### `FinancialAccounts.tsx`
- CRUD de contas financeiras
- Saldo inicial e atual
- Ativação/desativação
- **Roles permitidas**: PASTOR, LEADER

#### `FinancialContacts.tsx`
- CRUD de contatos (fornecedores/doadores)
- Dados completos (documento, telefone, endereço)
- Notas adicionais
- **Roles permitidas**: PASTOR, LEADER

#### `CostCenters.tsx`
- CRUD de centros de custo
- Organização por departamentos/projetos
- Ativação/desativação
- **Roles permitidas**: PASTOR, LEADER

#### `AccessDenied.tsx`
- Página de acesso negado
- Exibida quando usuário sem permissão tenta acessar rota protegida

#### `NotFound.tsx`
- Página 404
- Exibida para rotas não encontradas

## 🧩 Componentes

### Layout

#### `DashboardLayout.tsx`
- Layout principal do dashboard
- Header com informações do usuário
- Sidebar colapsável
- Área de conteúdo responsiva

#### `Sidebar.tsx`
- Menu lateral de navegação
- Links para todos os módulos
- Estado colapsável/expandido
- Controle de visibilidade baseado em roles
- Ícones do Lucide React

### Autenticação

#### `ProtectedRoute.tsx`
- Higher-Order Component para proteção de rotas
- Verifica autenticação
- Verifica roles permitidas
- Redireciona para login ou access-denied

### UI Components (shadcn/ui)

Componentes reutilizáveis baseados em Radix UI:
- `Button`, `Input`, `Label`, `Textarea`
- `Dialog`, `Sheet`, `Drawer`
- `DropdownMenu`, `Select`, `Popover`
- `Table`, `Card`, `Badge`
- `Tabs`, `Accordion`, `Collapsible`
- `Toast`, `Alert`, `AlertDialog`
- `Calendar`, `DatePicker`
- `Form`, `Checkbox`, `Switch`, `RadioGroup`
- `Avatar`, `Tooltip`, `HoverCard`
- `Progress`, `Slider`, `Separator`
- `Skeleton`, `ScrollArea`
- E muitos outros...

## 🪝 Hooks Customizados

### `useAuth.tsx`
**Propósito**: Gerenciamento global de autenticação
- Estado do usuário autenticado
- Perfil e igreja do usuário
- Roles do usuário
- Funções: `signIn`, `signUp`, `signOut`
- Helpers: `hasRole`, `hasAnyRole`, `isAuthenticated`

### `useMembers.tsx`
**Propósito**: Gerenciamento de membros
- Listagem de membros da igreja
- Criação, atualização e exclusão
- Integração com Supabase
- React Query para cache

### `useMinistries.tsx`
**Propósito**: Gerenciamento de ministérios
- CRUD de ministérios
- Listagem com líderes
- Invalidação de cache

### `useMinistryRoles.tsx`
**Propósito**: Papéis customizados em ministérios
- CRUD de papéis por ministério
- Filtro por ministério

### `useEvents.tsx`
**Propósito**: Gerenciamento de eventos
- CRUD de eventos
- Tipos e status de eventos
- Integração com escalas

### `useSchedules.tsx`
**Propósito**: Escalas de ministérios em eventos
- CRUD de escalas
- Detecção de conflitos
- Confirmação de escalas

### `useSongs.tsx`
**Propósito**: Biblioteca de músicas
- CRUD de músicas
- Metadados (tom, BPM, letra, cifra)

### `useWorshipSets.tsx`
**Propósito**: Sets de louvor
- CRUD de sets
- Ordem de músicas
- Cálculo de duração

### `useAnnouncements.tsx`
**Propósito**: Gestão de avisos
- CRUD de avisos
- Filtros por categoria
- Marcação de leitura

### `useAttendance.tsx`
**Propósito**: Registro de frequência
- CRUD de registros de presença
- Estatísticas por evento

### `useChurchStats.tsx`
**Propósito**: Estatísticas da igreja
- Cálculo de métricas
- Histórico de estatísticas

### `useFinancialAccounts.tsx`
**Propósito**: Gestão de contas financeiras
- CRUD de contas
- Saldo inicial e atual
- Ativação/desativação

### `useFinancialCategories.tsx`
**Propósito**: Gestão de categorias financeiras
- CRUD de categorias
- Separação: receitas e despesas
- Cores personalizadas

### `useFinancialTransactions.tsx`
**Propósito**: Gestão de transações financeiras
- CRUD de transações
- Tipos: INCOME, EXPENSE
- Status: PAID, PENDING, OVERDUE, CANCELLED
- Pagamento: UNICO, PARCELADO, RECORRENTE
- Relacionamentos: conta, categoria, contato, centro de custo

### `useFinancialContacts.tsx`
**Propósito**: Gestão de contatos financeiros
- CRUD de contatos (fornecedores/doadores)
- Dados completos de contato

### `useCostCenters.tsx`
**Propósito**: Gestão de centros de custo
- CRUD de centros de custo
- Organização por projetos/departamentos

### `useProfiles.tsx`
**Propósito**: Gestão de perfis de usuários
- Atualização de perfil
- Upload de foto

### `useChurches.tsx`
**Propósito**: Gestão de igrejas
- Atualização de dados da igreja
- Configurações

## 🗄️ Banco de Dados

### Tabelas Principais

#### `churches`
- Dados da igreja (nome, endereço, telefone, email)
- Configurações gerais

#### `profiles`
- Perfis de usuários
- Referência à igreja
- Status (ACTIVE, INACTIVE, VISITOR)
- Foto de perfil

#### `user_roles`
- Roles dos usuários (PASTOR, LEADER, MINISTER, MEMBER, VISITOR)
- Relacionamento many-to-many

#### `ministries`
- Ministérios da igreja
- Líder designado
- Ícone e cor

#### `ministry_members`
- Membros de ministérios
- Papel específico no ministério

#### `ministry_roles`
- Papéis customizados por ministério

#### `events`
- Eventos da igreja
- Tipo (CULTO, REUNIAO, ESTUDO, etc.)
- Status (SCHEDULED, ONGOING, FINISHED, CANCELLED)

#### `schedules`
- Escalas de ministérios em eventos
- Confirmação de participação

#### `attendance`
- Registro de frequência
- Status (PRESENT, ABSENT, EXCUSED, LATE)

#### `songs`
- Biblioteca de músicas
- Metadados completos

#### `worship_sets`
- Sets de louvor
- Ordem de músicas (JSON)

#### `song_history`
- Histórico de músicas tocadas

#### `announcements`
- Avisos da igreja
- Publicação agendada e expiração
- Direcionamento por roles/ministérios

#### `announcement_views`
- Controle de visualizações

#### `church_stats`
- Estatísticas agregadas da igreja

#### `financial_accounts`
- Contas financeiras
- Saldo inicial e atual

#### `financial_categories`
- Categorias de receitas e despesas
- Tipo (INCOME, EXPENSE)
- Cor personalizada

#### `financial_contacts`
- Fornecedores e doadores
- Dados completos de contato

#### `cost_centers`
- Centros de custo
- Departamentos/projetos

#### `financial_transactions`
- Transações financeiras
- Tipo (INCOME, EXPENSE)
- Status (PAID, PENDING, OVERDUE, CANCELLED)
- Pagamento (UNICO, PARCELADO, RECORRENTE)
- Relacionamentos com conta, categoria, contato, centro de custo

#### `transaction_attachments`
- Anexos de transações
- Comprovantes e documentos

### Enums

- `app_role`: PASTOR, LEADER, MINISTER, MEMBER, VISITOR
- `transaction_type`: INCOME, EXPENSE
- `transaction_status`: PAID, PENDING, OVERDUE, CANCELLED
- `payment_type`: UNICO, PARCELADO, RECORRENTE

### Funções do Banco

#### `get_user_church_id(user_id)`
Retorna o ID da igreja do usuário

#### `has_role(user_id, role)`
Verifica se usuário possui determinada role

#### `check_schedule_conflicts(user_id, event_date, exclude_event_id)`
Detecta conflitos de escala

#### `calculate_church_stats(church_id, stat_date)`
Calcula estatísticas da igreja

#### `handle_new_user()`
Trigger para criar perfil ao cadastrar usuário

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS implementadas:
- Filtro automático por `church_id`
- Controle de acesso por roles
- Isolamento de dados entre igrejas

## 🔐 Autenticação e Autorização

### Sistema de Roles

```typescript
type UserRole = 'PASTOR' | 'LEADER' | 'MINISTER' | 'MEMBER' | 'VISITOR';
```

### Hierarquia de Permissões

1. **PASTOR** - Acesso total
   - Todos os módulos
   - Relatórios
   - Configurações da igreja

2. **LEADER** - Gestão operacional
   - Membros
   - Ministérios
   - Eventos
   - Frequência
   - Finanças

3. **MINISTER** - Gestão de louvor
   - Músicas
   - Sets de louvor
   - Visualização de escalas

4. **MEMBER** - Acesso limitado
   - Dashboard
   - Avisos
   - Confirmar escalas

5. **VISITOR** - Acesso mínimo
   - Dashboard
   - Avisos públicos

### Proteção de Rotas

```tsx
<ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
  <Component />
</ProtectedRoute>
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre na pasta do projeto
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📦 Deploy

### Deploy via Lovable

1. Acesse o projeto no [Lovable](https://lovable.dev/projects/7bf91da6-c778-49f1-acdb-122cf820499f)
2. Clique em "Share" → "Publish"
3. Seu app será publicado automaticamente

### Deploy Manual

O projeto pode ser deployado em qualquer plataforma que suporte aplicações Vite/React:
- Vercel
- Netlify
- AWS Amplify
- Google Cloud Platform
- Cloudflare Pages

## 🔧 Configuração

### Variáveis de Ambiente

As variáveis de ambiente são gerenciadas automaticamente pelo Lovable Cloud:

```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

### Configuração de Temas

O sistema suporta temas claro e escuro, configurados em:
- `src/index.css` - Tokens CSS customizáveis
- `tailwind.config.ts` - Configuração do Tailwind

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Design System

### Cores Semânticas (HSL)

Definidas em `src/index.css`:
- `--primary` - Cor primária
- `--secondary` - Cor secundária
- `--accent` - Cor de destaque
- `--background` - Cor de fundo
- `--foreground` - Cor de texto
- `--muted` - Cor neutra
- `--destructive` - Cor de erro

### Componentes Estilizados

Todos os componentes seguem o design system e utilizam:
- Tokens semânticos (não cores diretas)
- Variantes via `class-variance-authority`
- Animações via `tailwindcss-animate`

## 🤝 Contribuindo

Este é um projeto gerenciado pelo Lovable. Para contribuir:

1. Faça alterações via interface do Lovable
2. Ou clone o repositório e faça push das alterações
3. As mudanças sincronizam automaticamente

## 📝 Licença

Este projeto é privado e pertence à igreja que o utiliza.

## 🐛 Suporte

Para suporte e dúvidas:
- Documentação: [docs.lovable.dev](https://docs.lovable.dev)
- Comunidade: [Discord do Lovable](https://discord.com/channels/1119885301872070706/1280461670979993613)

## 🎯 Roadmap

Funcionalidades planejadas:
- [ ] Módulo de doações online
- [ ] Integração com gateways de pagamento
- [ ] App mobile nativo
- [ ] Sistema de mensagens entre membros
- [ ] Notificações push
- [ ] Relatórios financeiros avançados
- [ ] Exportação para Excel/PDF
- [ ] Dashboard público para visitantes
- [ ] Sistema de agendamento de salas
- [ ] Controle de patrimônio

---

**Desenvolvido com ❤️ usando Lovable**
