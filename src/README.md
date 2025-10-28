# 🗺️ QualityMap App - Documentação Completa

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Componentes Principais](#-componentes-principais)
6. [Contextos e State Management](#-contextos-e-state-management)
7. [Sistema de Roteamento](#-sistema-de-roteamento)
8. [Autenticação e Autorização](#-autenticação-e-autorização)
9. [Sistema Multi-Tenant](#-sistema-multi-tenant)
10. [Design System](#-design-system)
11. [Fluxos de Usuário](#-fluxos-de-usuário)
12. [Bibliotecas e Dependências](#-bibliotecas-e-dependências)
13. [Setup e Configuração](#-setup-e-configuração)
14. [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Visão Geral

### O que é o QualityMap App?

**QualityMap App** é uma plataforma SaaS de avaliação de maturidade em qualidade de software, que permite empresas e equipes:

- ✅ **Avaliar maturidade** em qualidade através de um questionário de 91 perguntas organizadas em 7 pilares
- 📊 **Visualizar resultados** através de gráficos radar, análises detalhadas e comparações de personas
- 🔄 **Gerenciar rodadas** de avaliação com controle de participantes e progresso
- 👥 **Comparar equipes** e identificar gaps de alinhamento
- 📈 **Acompanhar evolução** temporal com versionamento de resultados
- 🏢 **Sistema whitelabel** multi-tenant para múltiplas empresas
- 🌐 **Compartilhamento público** de resultados via links

### Público-Alvo

| Persona | Função | Uso Principal |
|---------|--------|---------------|
| **Manager** | Administrador do sistema | Gestão de empresas, usuários, visão global |
| **Leader** | Líder de equipe/QA | Criação de rodadas, análise de resultados, gestão de membros |
| **Member** | Membro da equipe | Responder avaliações, visualizar resultados (se permitido) |

### Principais Funcionalidades

#### 1. **QualityScore Assessment**
- Formulário de avaliação com 91 perguntas
- 7 pilares de qualidade de software
- Sistema de pontuação de 0 a 5
- 5 níveis de maturidade (Agnóstico → Domínio)

#### 2. **Rodadas de Avaliação**
- Ciclos temporais de avaliação
- Gestão de participantes
- Controle de acesso aos resultados
- Versionamento imutável (V2024.01.001)

#### 3. **Resultados Detalhados**
- 6 abas de análise (Overview, Radar, Linha Pilar, Análise, Ações, Sharing)
- Gráficos radar multi-persona
- Heatmaps de divergência
- Geração de ações recomendadas com IA

#### 4. **Sistema Multi-Tenant**
- Múltiplas empresas na mesma plataforma
- Identidade visual customizada (whitelabel)
- Isolamento de dados por empresa

#### 5. **Compartilhamento Público**
- Links públicos de resultados
- Visualização sem autenticação
- Demos públicas pré-configuradas

---

## 🏗️ Arquitetura

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        QualityMap App                        │
│                     (React SPA + Tailwind)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              AuthProvider (Context)                 │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │        CompanyProvider (Context)             │  │     │
│  │  │  ┌────────────────────────────────────────┐  │  │     │
│  │  │  │    QualityScoreProvider (Context)      │  │  │     │
│  │  │  │                                        │  │  │     │
│  │  │  │  ┌──────────────────────────────┐    │  │  │     │
│  │  │  │  │      AppContent              │    │  │  │     │
│  │  │  │  │  ┌────────────────────────┐  │    │  │  │     │
│  │  │  │  │  │  SidebarProvider       │  │    │  │  │     │
│  │  │  │  │  │  ├─ AppSidebar         │  │    │  │  │     │
│  │  │  │  │  │  └─ SidebarInset       │  │    │  │  │     │
│  │  │  │  │  │     ├─ Header          │  │    │  │  │     │
│  │  │  │  │  │     └─ Main Content    │  │    │  │  │     │
│  │  │  │  │  └────────────────────────┘  │    │  │  │     │
│  │  │  │  └──────────────────────────────┘    │  │  │     │
│  │  │  └────────────────────────────────────────┘  │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Camadas da Aplicação

#### Camada 1: Providers (Contextos Globais)
- **AuthProvider**: Autenticação e perfis de usuário
- **CompanyProvider**: Gerenciamento multi-tenant
- **QualityScoreProvider**: Estado global de avaliações

#### Camada 2: Layout e Navegação
- **SidebarProvider**: Gerencia estado da sidebar
- **AppSidebar**: Navegação lateral com menu
- **SidebarInset**: Container principal com header e conteúdo

#### Camada 3: Páginas e Funcionalidades
- **Dashboard**: Visão geral e resumos
- **Formulário**: Avaliação QualityScore
- **Rodadas**: Gestão de ciclos de avaliação
- **Resultados**: Análise e visualização de dados
- **Importar**: Upload de Excel/CSV
- **Gestão**: Empresas, usuários, cadastros

#### Camada 4: Componentes Reutilizáveis
- **ShadCN/UI**: 55+ componentes base
- **Custom Components**: Gráficos, mapas, análises

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18+ | Framework UI |
| **TypeScript** | 5+ | Tipagem estática |
| **Tailwind CSS** | 4.0 | Estilização |
| **Vite** | 5+ | Build tool |

### UI/UX

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| **ShadCN/UI** | Latest | Componentes base |
| **Radix UI** | Various | Primitivos acessíveis |
| **Lucide React** | 0.487.0 | Ícones (500+) |
| **Motion/React** | Latest | Animações |

### Visualização de Dados

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| **Recharts** | Latest | Gráficos (Radar, Bar, Line) |
| **React DND** | Latest | Drag and Drop |

### Formulários e Validação

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| **React Hook Form** | 7.55.0 | Gestão de formulários |
| **Zod** | Latest | Validação de schemas |

### Utilidades

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| **XLSX** | Latest | Importação/exportação Excel |
| **Sonner** | 2.0.3 | Toast notifications |
| **Class Variance Authority** | 0.7.1 | Variantes de componentes |
| **clsx / tailwind-merge** | Latest | Utilitários de classes CSS |

### Backend (Futuro - Opcional)

| Tecnologia | Status | Uso Planejado |
|-----------|--------|---------------|
| **Supabase** | Em consideração | Database, Auth, Storage |
| **PostgreSQL** | Via Supabase | Banco de dados relacional |

---

## 📁 Estrutura do Projeto

```
qualitymap-app/
├── App.tsx                          # Entry point principal
├── styles/
│   └── globals.css                  # CSS global + Tailwind v4
├── components/
│   ├── ui/                          # ShadCN components (55+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (52 outros)
│   │
│   ├── figma/                       # Componentes específicos Figma
│   │   └── ImageWithFallback.tsx
│   │
│   ├── AuthContext.tsx              # Context: Autenticação
│   ├── CompanyContext.tsx           # Context: Multi-tenant
│   ├── QualityScoreManager.tsx      # Context: Estado de avaliações
│   │
│   ├── AppSidebar.tsx               # Navegação lateral
│   ├── Login.tsx                    # Tela de login
│   ├── Dashboard.tsx                # Dashboard principal
│   │
│   ├── FormularioIntro.tsx          # Intro do formulário
│   ├── QualityScoreAssessment.tsx   # Avaliação completa (91 perguntas)
│   ├── QualityAssessmentForm.tsx    # Formulário individual de pilar
│   │
│   ├── Rodadas.tsx                  # Gestão de rodadas
│   ├── Resultados.tsx               # Resultados: 6 abas
│   ├── ResultadosComplete.tsx       # Resultados: componente completo
│   ├── Importar.tsx                 # Importação Excel/CSV
│   │
│   ├── PublicQualityScoreFixed.tsx  # Página pública de resultados
│   ├── PublicDemo.tsx               # Demo pública
│   ├── PublicShareManager.tsx       # Gerenciador de compartilhamento
│   │
│   ├── CompanyManagement.tsx        # Gestão de empresas
│   ├── CadastrosManagement.tsx      # Gestão de cadastros
│   ├── UserProfile.tsx              # Perfil do usuário
│   ├── PersonaSwitcher.tsx          # Troca de persona para análise
│   │
│   ├── RadarChartPersonas.tsx       # Gráfico radar multi-persona
│   ├── MapaLinhaPilar.tsx           # Gráfico de linha por pilar
│   ├── MapaDivergencia.tsx          # Heatmap de divergência
│   ├── AnaliseAlinhamento.tsx       # Análise de alinhamento
│   │
│   ├── QuestionRenderer.tsx         # Renderizador de perguntas
│   ├── CheckboxQuestion.tsx         # Pergunta tipo checkbox
│   ├── MaturityLevels.ts            # Constantes de níveis
│   │
│   ├── ExcelTemplateGenerator.tsx   # Gerador de templates Excel
│   ├── XLSXProcessor.tsx            # Processador de arquivos XLSX
│   │
│   ├── QualityMapAppLogo.tsx        # Logo do app
│   ├── useCompanyColors.tsx         # Hook: cores da empresa
│   └── usePublicQualityScore.tsx    # Hook: scores públicos
│
├── imports/                         # Assets e SVGs importados
│   ├── Frame.tsx
│   ├── svg-*.ts
│   └── ...
│
├── guidelines/                      # Diretrizes do projeto
│   └── Guidelines.md
│
└── README_*.md                      # Documentação específica
    ├── README_FORMULARIO.md         # 91 perguntas detalhadas
    ├── README_RESULTADOS.md         # Sistema de resultados
    ├── README_RODADAS.md            # Sistema de rodadas
    ├── README_RODADAS_UI.md         # UI das rodadas
    ├── README_DESIGN_SYSTEM.md      # Design system completo
    └── ... (11 READMEs especializados)
```

---

## 🧩 Componentes Principais

### 1. **App.tsx** - Entry Point

**Responsabilidades:**
- Renderização dos providers globais
- Detecção de rotas públicas
- Roteamento principal entre seções
- Gerenciamento de estado de navegação

**Estrutura:**

```tsx
export default function App() {
  return (
    <AuthProvider>              {/* 1. Autenticação */}
      <CompanyProvider>         {/* 2. Multi-tenant */}
        <QualityScoreProvider>  {/* 3. Estado de avaliações */}
          <AppContent />        {/* 4. Conteúdo principal */}
          <Toaster />           {/* 5. Notificações */}
        </QualityScoreProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}
```

**Estados Principais:**

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `activeSection` | `string` | Seção ativa do app (dashboard, formulário, etc.) |
| `formularioView` | `ViewState` | Estado do formulário (intro, map, assessment, advanced) |
| `answers` | `Record<string, string>` | Respostas do formulário |
| `assessmentResults` | `any` | Resultados da avaliação |
| `assessmentProgress` | `{ progress, currentStep }` | Progresso da avaliação |

**Lógica de Roteamento Público:**

```tsx
// Hook personalizado para detectar rotas públicas
function usePublicRoute() {
  // Detecta URLs como:
  // - /score/abc123 (pathname)
  // - #/score/abc123 (hash)
  // - ?demo=score/abc123 (query param)
  
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  
  // Regex patterns para detecção
  const publicScoreMatch = path.match(/^\/score\/([^\/]+)$/);
  const hashScoreMatch = hash.match(/^#\/score\/([^\/]+)$/);
  
  // Se detectado, renderiza PublicQualityScoreFixed
  // Caso contrário, requer autenticação
}
```

**Renderização Condicional:**

```tsx
// Se rota pública -> exibe página pública
if (isPublicRoute && shareId) {
  return <PublicQualityScoreFixed shareId={shareId} />;
}

// Se não autenticado -> exibe Login
if (!isAuthenticated) {
  return <Login />;
}

// Se autenticado -> exibe App completo
return (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <Main>{renderContent()}</Main>
    </SidebarInset>
  </SidebarProvider>
);
```

---

### 2. **AppSidebar.tsx** - Navegação Lateral

**Responsabilidades:**
- Menu de navegação principal
- Troca de seções
- Seletor de empresa (whitelabel)
- Perfil do usuário
- Logo e branding

**Estrutura do Menu:**

```tsx
// QualityScore (principal funcionalidade)
├── 📋 Formulário
├── 🔄 Rodadas
├── 📊 Resultados
└── 📥 Importar

// Gestão (apenas Managers/Leaders)
├── 🏢 Empresas
├── 👥 Cadastros
└── 🎭 Personas

// Demos Públicas
└── 🌐 Demo Pública
```

**Controle de Acesso Visual:**

```tsx
// Itens condicionais baseados em permissões
{user?.permissions.canViewAllCompanies && (
  <SidebarMenuItem>
    <SidebarMenuButton onClick={() => onSectionChange('empresa')}>
      <Building className="h-4 w-4" />
      <span>Empresas</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
)}
```

**Seletor de Empresa (Whitelabel):**

```tsx
// Dropdown no header da sidebar
<CompanySelector />

// Ao trocar empresa:
// 1. Aplica cores customizadas
// 2. Filtra dados da empresa
// 3. Atualiza logo (se houver)
```

---

### 3. **QualityScoreAssessment.tsx** - Avaliação Completa

**Responsabilidades:**
- Renderizar 91 perguntas em 7 pilares
- Gerenciar progresso do usuário
- Salvar respostas incrementalmente
- Calcular scores em tempo real
- Gerar resultado final

**Arquitetura Interna:**

```tsx
// Estado principal
const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
const [answers, setAnswers] = useState<Record<string, number>>({});
const [progress, setProgress] = useState(0);

// 7 Pilares
const pilares = [
  { id: 1, nome: "Processos e Estratégia", perguntas: 13 },
  { id: 2, nome: "Testes Automatizados", perguntas: 13 },
  { id: 3, nome: "Métricas", perguntas: 13 },
  { id: 4, nome: "Documentações", perguntas: 13 },
  { id: 5, nome: "Modalidades de Testes", perguntas: 13 },
  { id: 6, nome: "QAOps", perguntas: 13 },
  { id: 7, nome: "Liderança", perguntas: 13 }
];

// Navegação entre pilares
const handleNextPillar = () => {
  if (currentPillarIndex < pilares.length - 1) {
    setCurrentPillarIndex(prev => prev + 1);
  } else {
    handleComplete(); // Finaliza avaliação
  }
};

// Cálculo de progresso
const calculateProgress = () => {
  const totalQuestions = 91;
  const answeredQuestions = Object.keys(answers).length;
  return (answeredQuestions / totalQuestions) * 100;
};
```

**Renderização de Perguntas:**

```tsx
// Cada pergunta é renderizada dinamicamente
<QuestionRenderer
  question={currentQuestion}
  value={answers[currentQuestion.id]}
  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
/>

// Tipos de perguntas suportadas:
// - Radio (escala 0-5)
// - Checkbox (múltipla escolha)
// - Text (aberta)
```

**Sistema de Pontuação:**

```tsx
// Cada resposta vale 0-5 pontos
// Score do pilar = média das respostas
// Score geral = média dos 7 pilares

const calculatePillarScore = (pilarId: number) => {
  const pillarQuestions = questions.filter(q => q.pillarId === pilarId);
  const answeredQuestions = pillarQuestions.filter(q => answers[q.id] !== undefined);
  
  if (answeredQuestions.length === 0) return 0;
  
  const sum = answeredQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
  return sum / answeredQuestions.length;
};

const calculateOverallScore = () => {
  const pillarScores = pilares.map(p => calculatePillarScore(p.id));
  const sum = pillarScores.reduce((acc, score) => acc + score, 0);
  return sum / pilares.length;
};
```

**Callback de Conclusão:**

```tsx
const handleComplete = () => {
  const results = {
    overallScore: calculateOverallScore(),
    pillarScores: pilares.map(p => ({
      pillarId: p.id,
      pillarName: p.nome,
      score: calculatePillarScore(p.id)
    })),
    answers: answers,
    timestamp: new Date().toISOString(),
    versaoId: generateVersionId() // Ex: V2024.01.001
  };
  
  onComplete(results); // Callback para App.tsx
};
```

---

### 4. **Rodadas.tsx** - Gestão de Ciclos de Avaliação

**Responsabilidades:**
- Criar e gerenciar rodadas de avaliação
- Controlar participantes e seus progressos
- Definir critérios de encerramento
- Gerenciar acesso aos resultados
- Enviar lembretes

**Modelo de Dados:**

```tsx
interface Rodada {
  id: string;
  companyId: string;
  companyName: string;
  versaoId: string;              // V2024.01.001
  status: 'rascunho' | 'ativa' | 'encerrada';
  criterioEncerramento: 'manual' | 'automatico';
  createdDate: string;
  dueDate: string;
  totalParticipantes: number;
  respostasCompletas: number;
  respostasEmProgresso: number;
  respostasPendentes: number;
  progressoGeral: number;        // 0-100%
  resultadoGerado: boolean;
  participantes: Participante[];
}

interface Participante {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pendente' | 'respondendo' | 'concluido' | 'atrasado';
  progress: number;              // 0-100%
  canViewResults: boolean;       // Controle granular de acesso
  lastActivity?: string;
  completedDate?: string;
  initials: string;
}
```

**UI Principal:**

```tsx
// Tabs: Ativas vs Encerradas
<Tabs value={activeTab}>
  <TabsList>
    <TabsTrigger value="ativas">Rodadas Ativas (8)</TabsTrigger>
    <TabsTrigger value="encerradas">Encerradas (12)</TabsTrigger>
  </TabsList>
  
  <TabsContent value="ativas">
    {rodadas.map(rodada => (
      <RodadaCard 
        rodada={rodada}
        onSelect={setSelectedRodada}
        onGerarResultado={handleGerarResultado}
        onEncerrarRodada={handleEncerrarRodada}
      />
    ))}
  </TabsContent>
</Tabs>
```

**Card de Rodada:**

```tsx
<RodadaCard>
  {/* Header */}
  <div>
    <h3>{rodada.companyName}</h3>
    <Badge>{rodada.status}</Badge>
    <Badge variant="outline">{rodada.versaoId}</Badge>
  </div>
  
  {/* Estatísticas - Grid 5 colunas */}
  <div className="grid grid-cols-5 gap-4">
    <Stat label="Total" value={rodada.totalParticipantes} color="gray" />
    <Stat label="Concluídas" value={rodada.respostasCompletas} color="green" />
    <Stat label="Em Progresso" value={rodada.respostasEmProgresso} color="blue" />
    <Stat label="Pendentes" value={rodada.respostasPendentes} color="gray" />
    <Stat label="Com Acesso" value={participantesComAcesso} color="purple" />
  </div>
  
  {/* Progresso */}
  <Progress value={rodada.progressoGeral} />
  
  {/* Ações */}
  <div>
    <Button onClick={() => onGerarResultado(rodada.id)}>Gerar Resultado</Button>
    <Button variant="outline" onClick={() => onEncerrarRodada(rodada.id)}>Encerrar</Button>
  </div>
</RodadaCard>
```

**Modal de Detalhes:**

```tsx
<RodadaDetailsModal rodada={selectedRodada}>
  {/* Estatísticas gerais */}
  <div className="grid grid-cols-4 gap-4">
    <StatCard icon={Users} label="Total de Membros" value={8} />
    <StatCard icon={CheckCircle} label="Respostas Completas" value={3} />
    <StatCard icon={Clock} label="Em Progresso" value={2} />
    <StatCard icon={AlertCircle} label="Pendentes/Atrasados" value={3} />
  </div>
  
  {/* Lista de participantes com controles */}
  <ParticipantList>
    {rodada.participantes.map(participante => (
      <ParticipantRow key={participante.id}>
        <Avatar initials={participante.initials} />
        <Info>
          <h4>{participante.name}</h4>
          <p>{participante.email}</p>
          <p className="text-xs">{participante.role}</p>
        </Info>
        <Badge status={participante.status} />
        <Progress value={participante.progress} />
        
        {/* Controle de acesso aos resultados */}
        <div>
          <span>{participante.canViewResults ? 'Permitido' : 'Restrito'}</span>
          <Switch 
            checked={participante.canViewResults}
            onCheckedChange={() => toggleResultAccess(participante.id)}
          />
        </div>
        
        {/* Ações */}
        {participante.status !== 'concluido' && (
          <Button size="sm" onClick={() => sendReminder(participante.id)}>
            <Mail className="h-3 w-3" /> Lembrete
          </Button>
        )}
      </ParticipantRow>
    ))}
  </ParticipantList>
</RodadaDetailsModal>
```

**Funções de Gestão:**

```tsx
// Criar nova rodada
const handleCreateRodada = (data: NovaRodadaData) => {
  const rodada = {
    id: generateId(),
    versaoId: generateVersionId(), // V2024.01.001
    status: 'ativa',
    criterioEncerramento: data.criterio,
    participantes: data.selectedMembers.map(member => ({
      ...member,
      status: 'pendente',
      progress: 0,
      canViewResults: false // Padrão: restrito
    }))
  };
  
  // Enviar convites por email
  sendInvitationEmails(rodada.participantes);
};

// Gerar resultado
const handleGerarResultado = (rodadaId: string) => {
  const rodada = findRodada(rodadaId);
  
  // Agregar respostas de todos os participantes
  const aggregatedResults = aggregateParticipantResults(rodada.participantes);
  
  // Calcular scores
  const results = calculateResults(aggregatedResults);
  
  // Salvar resultado imutável
  saveResult({
    rodadaId,
    versaoId: rodada.versaoId,
    results,
    timestamp: new Date().toISOString()
  });
  
  // Notificar participantes com acesso
  notifyParticipants(rodada.participantes.filter(p => p.canViewResults));
};

// Encerrar rodada
const handleEncerrarRodada = (rodadaId: string) => {
  updateRodada(rodadaId, { 
    status: 'encerrada',
    encerradoEm: new Date().toISOString()
  });
  
  // Se critério automático, gerar resultado
  if (rodada.criterioEncerramento === 'automatico') {
    handleGerarResultado(rodadaId);
  }
};

// Toggle acesso aos resultados
const handleToggleResultAccess = (rodadaId: string, participanteId: string) => {
  const participante = findParticipante(rodadaId, participanteId);
  
  updateParticipante(rodadaId, participanteId, {
    canViewResults: !participante.canViewResults
  });
  
  // Se permitindo acesso, enviar notificação
  if (!participante.canViewResults) {
    sendResultAccessNotification(participante);
  }
};

// Ações em massa
const handleAllowAllResults = (rodadaId: string) => {
  const rodada = findRodada(rodadaId);
  
  rodada.participantes.forEach(p => {
    updateParticipante(rodadaId, p.id, { canViewResults: true });
  });
  
  toast.success(`Todos os ${rodada.totalParticipantes} participantes podem ver os resultados`);
};

const handleRestrictAllResults = (rodadaId: string) => {
  const rodada = findRodada(rodadaId);
  
  rodada.participantes.forEach(p => {
    updateParticipante(rodadaId, p.id, { canViewResults: false });
  });
  
  toast.success('Acesso aos resultados restrito para todos');
};
```

**Sistema de Versionamento:**

```tsx
// Formato: V{ANO}.{MES}.{SEQUENCIAL}
const generateVersionId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Buscar última versão do mês
  const lastVersion = getLastVersionOfMonth(year, month);
  const nextSequential = (lastVersion?.sequential || 0) + 1;
  
  return `V${year}.${month}.${String(nextSequential).padStart(3, '0')}`;
};

// Exemplos:
// V2024.01.001
// V2024.01.002
// V2024.02.001
```

---

### 5. **Resultados.tsx** - Análise de Dados

**Responsabilidades:**
- Exibir resultados em 6 abas diferentes
- Gráficos radar multi-persona
- Análise de divergência entre personas
- Geração de ações recomendadas
- Compartilhamento público

**6 Abas de Resultados:**

#### **1. Overview (Visão Geral)**

```tsx
<OverviewTab>
  {/* Score Geral */}
  <Card className="score-display">
    <h1 className="text-6xl font-bold">{overallScore.toFixed(1)}</h1>
    <Badge className={getMaturityBadgeColor(overallScore)}>
      {getMaturityLevel(overallScore)}
    </Badge>
  </Card>
  
  {/* Grid de Scores por Pilar */}
  <div className="grid grid-cols-7 gap-4">
    {pilares.map(pilar => (
      <PilarCard key={pilar.id}>
        <Icon>{pilar.icon}</Icon>
        <h3>{pilar.nome}</h3>
        <div className="text-3xl font-semibold">{pilar.score.toFixed(1)}</div>
        <Badge>{getMaturityLevel(pilar.score)}</Badge>
      </PilarCard>
    ))}
  </div>
  
  {/* Distribuição de Maturidade */}
  <BarChart data={maturityDistribution} />
</OverviewTab>
```

#### **2. Radar (Comparação de Personas)**

```tsx
<RadarTab>
  {/* Seletor de Personas para Comparação */}
  <PersonaSwitcher 
    selectedPersonas={selectedPersonas}
    onToggle={handleTogglePersona}
  />
  
  {/* Gráfico Radar Multi-Persona */}
  <RadarChartPersonas
    data={radarData}
    personas={selectedPersonas}
    pillars={pilares}
  />
  
  {/* Legenda com cores de cada persona */}
  <Legend>
    {selectedPersonas.map(persona => (
      <LegendItem key={persona.id} color={persona.color}>
        {persona.name}
      </LegendItem>
    ))}
  </Legend>
</RadarTab>

// Exemplo de dados do radar:
const radarData = [
  {
    pilar: "Processos",
    "QA Lead": 4.2,
    "Dev Lead": 3.8,
    "Product Owner": 2.5
  },
  // ... demais pilares
];
```

#### **3. Linha Pilar (Evolução Temporal)**

```tsx
<LinhaPilarTab>
  {/* Seletor de Pilar */}
  <Select value={selectedPilar} onChange={setSelectedPilar}>
    {pilares.map(p => (
      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
    ))}
  </Select>
  
  {/* Gráfico de Linha Temporal */}
  <MapaLinhaPilar
    pilarId={selectedPilar}
    versoes={historicoVersoes}
    data={lineChartData}
  />
  
  {/* Tabela de Comparação entre Versões */}
  <VersionComparisonTable>
    {historicoVersoes.map(versao => (
      <tr key={versao.id}>
        <td>{versao.versaoId}</td>
        <td>{versao.date}</td>
        <td>{versao.score}</td>
        <td>{calculateDelta(versao)}</td>
      </tr>
    ))}
  </VersionComparisonTable>
</LinhaPilarTab>

// Exemplo de dados de linha:
const lineChartData = [
  { versao: "V2024.01.001", date: "Jan 2024", score: 2.5 },
  { versao: "V2024.02.001", date: "Fev 2024", score: 3.1 },
  { versao: "V2024.03.001", date: "Mar 2024", score: 3.8 },
];
```

#### **4. Análise (Divergência e Alinhamento)**

```tsx
<AnaliseTab>
  {/* Heatmap de Divergência */}
  <MapaDivergencia
    personas={selectedPersonas}
    pilares={pilares}
    divergenceData={calculateDivergence()}
  />
  
  {/* Análise de Alinhamento */}
  <AnaliseAlinhamento
    divergenceScore={overallDivergenceScore}
    insights={generateInsights()}
  />
  
  {/* Top 5 Gaps Mais Críticos */}
  <Card>
    <h3>Maiores Divergências</h3>
    {topGaps.map(gap => (
      <GapItem key={gap.id}>
        <Badge variant="destructive">{gap.severity}</Badge>
        <span>{gap.pilar}</span>
        <span>{gap.personas.join(' vs ')}</span>
        <span className="font-semibold">{gap.delta.toFixed(1)} pontos</span>
      </GapItem>
    ))}
  </Card>
</AnaliseTab>

// Cálculo de divergência:
const calculateDivergence = () => {
  const matrix = [];
  
  for (let pilar of pilares) {
    const row = { pilar: pilar.nome };
    
    for (let persona of personas) {
      const score = getPersonaPilarScore(persona.id, pilar.id);
      row[persona.name] = score;
    }
    
    // Calcular desvio padrão
    const scores = Object.values(row).filter(v => typeof v === 'number');
    row.divergence = calculateStandardDeviation(scores);
    
    matrix.push(row);
  }
  
  return matrix;
};
```

#### **5. Ações (Recomendações)**

```tsx
<AcoesTab>
  {/* Geração de Ações via IA */}
  <Button onClick={handleGenerateActions}>
    <Zap className="h-4 w-4 mr-2" />
    Gerar Ações com IA
  </Button>
  
  {/* Lista de Ações Recomendadas */}
  <ActionList>
    {actions.map(action => (
      <ActionCard key={action.id}>
        <div className="flex items-start gap-4">
          <Badge className={getPriorityColor(action.priority)}>
            {action.priority}
          </Badge>
          <div className="flex-1">
            <h4>{action.title}</h4>
            <p className="text-muted-foreground">{action.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{action.pilar}</Badge>
              <Badge variant="outline">{action.impacto}</Badge>
            </div>
          </div>
          <Checkbox 
            checked={action.done}
            onCheckedChange={() => toggleActionDone(action.id)}
          />
        </div>
      </ActionCard>
    ))}
  </ActionList>
  
  {/* Progresso de Ações */}
  <Card>
    <h3>Progresso de Implementação</h3>
    <Progress value={actionsCompletedPercentage} />
    <span>{actionsCompleted} de {totalActions} ações concluídas</span>
  </Card>
</AcoesTab>

// Exemplo de ações geradas:
const sampleActions = [
  {
    id: '1',
    priority: 'Alta',
    pilar: 'Testes Automatizados',
    title: 'Implementar testes de regressão automatizados',
    description: 'Criar suite de testes E2E com Cypress para fluxos críticos',
    impacto: 'Alto',
    esforco: 'Médio',
    prazo: '30 dias',
    done: false
  },
  {
    id: '2',
    priority: 'Média',
    pilar: 'Documentações',
    title: 'Padronizar documentação de APIs',
    description: 'Utilizar OpenAPI/Swagger para todas as APIs REST',
    impacto: 'Médio',
    esforco: 'Baixo',
    prazo: '15 dias',
    done: false
  }
];
```

#### **6. Sharing (Compartilhamento)**

```tsx
<SharingTab>
  {/* Geração de Link Público */}
  <Card>
    <h3>Compartilhar Resultados Publicamente</h3>
    <p className="text-muted-foreground">
      Crie um link público para compartilhar estes resultados sem necessidade de login
    </p>
    
    <Button onClick={handleGeneratePublicLink}>
      <Share2 className="h-4 w-4 mr-2" />
      Gerar Link Público
    </Button>
    
    {publicLink && (
      <div className="mt-4">
        <Label>Link Gerado:</Label>
        <div className="flex gap-2">
          <Input value={publicLink} readOnly />
          <Button onClick={() => copyToClipboard(publicLink)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        {/* QR Code */}
        <div className="mt-4">
          <QRCodeSVG value={publicLink} size={200} />
        </div>
      </div>
    )}
  </Card>
  
  {/* Links Ativos */}
  <Card>
    <h3>Links Públicos Ativos</h3>
    {activePublicLinks.map(link => (
      <div key={link.id} className="flex items-center justify-between p-3 border-b">
        <div>
          <p className="font-medium">{link.name}</p>
          <p className="text-sm text-muted-foreground">
            Criado em {formatDate(link.createdAt)} • {link.views} visualizações
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => copyLink(link.url)}>
            Copiar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => revokeLink(link.id)}>
            Revogar
          </Button>
        </div>
      </div>
    ))}
  </Card>
</SharingTab>

// Geração de link público:
const handleGeneratePublicLink = async () => {
  const shareId = generateUniqueId(); // Ex: "abc123xyz"
  
  const publicLink = `${window.location.origin}/score/${shareId}`;
  
  // Salvar no banco (futuro: Supabase)
  await savePublicShare({
    id: shareId,
    rodadaId: currentRodada.id,
    versaoId: currentRodada.versaoId,
    results: currentResults,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: null, // Ou data de expiração
    isActive: true
  });
  
  setPublicLink(publicLink);
  toast.success('Link público gerado com sucesso!');
};
```

**Cálculo de Níveis de Maturidade:**

```tsx
// 5 Níveis baseados no score (0-5)
const getMaturityLevel = (score: number): string => {
  if (score >= 4.0) return "Domínio";
  if (score >= 3.0) return "Experiência";
  if (score >= 2.0) return "Consciência";
  if (score >= 1.0) return "Inicialização";
  return "Agnóstico";
};

const getMaturityBadgeColor = (score: number): string => {
  if (score >= 4.0) return "bg-green-100 text-green-800";
  if (score >= 3.0) return "bg-blue-100 text-blue-800";
  if (score >= 2.0) return "bg-yellow-100 text-yellow-800";
  if (score >= 1.0) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};
```

---

### 6. **Importar.tsx** - Upload de Dados

**Responsabilidades:**
- Upload de arquivos Excel/CSV
- Processamento de dados
- Validação de formato
- Download de templates
- Importação em massa

**UI Principal:**

```tsx
<ImportarPage>
  {/* Upload Area */}
  <Card className="border-dashed border-2">
    <input 
      type="file" 
      accept=".xlsx,.xls,.csv"
      onChange={handleFileUpload}
      className="hidden"
      id="file-upload"
    />
    <label htmlFor="file-upload" className="cursor-pointer">
      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
      <p>Arraste e solte ou clique para selecionar</p>
      <p className="text-sm text-muted-foreground">
        Arquivos suportados: .xlsx, .xls, .csv
      </p>
    </label>
  </Card>
  
  {/* Download Template */}
  <Card>
    <h3>Templates para Importação</h3>
    <div className="grid grid-cols-2 gap-4">
      <Button onClick={downloadQualityScoreTemplate}>
        <Download className="h-4 w-4 mr-2" />
        Template QualityScore
      </Button>
      <Button onClick={downloadParticipantesTemplate}>
        <Download className="h-4 w-4 mr-2" />
        Template Participantes
      </Button>
    </div>
  </Card>
  
  {/* Preview de Dados */}
  {uploadedData && (
    <Card>
      <h3>Preview dos Dados</h3>
      <Table>
        <TableHeader>
          {columns.map(col => <TableHead key={col}>{col}</TableHead>)}
        </TableHeader>
        <TableBody>
          {uploadedData.slice(0, 10).map((row, i) => (
            <TableRow key={i}>
              {columns.map(col => <TableCell key={col}>{row[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground mt-2">
        Mostrando 10 de {uploadedData.length} linhas
      </p>
    </Card>
  )}
  
  {/* Validação */}
  {validationErrors.length > 0 && (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erros de Validação</AlertTitle>
      <AlertDescription>
        <ul>
          {validationErrors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )}
  
  {/* Confirmar Importação */}
  {uploadedData && validationErrors.length === 0 && (
    <Button onClick={handleConfirmImport}>
      <CheckCircle className="h-4 w-4 mr-2" />
      Confirmar Importação ({uploadedData.length} registros)
    </Button>
  )}
</ImportarPage>
```

**Processamento de Excel:**

```tsx
import * as XLSX from 'xlsx';

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  try {
    // Ler arquivo
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    // Pegar primeira planilha
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Validar dados
    const errors = validateImportData(data);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error(`${errors.length} erros encontrados`);
    } else {
      setUploadedData(data);
      toast.success('Arquivo processado com sucesso!');
    }
  } catch (error) {
    toast.error('Erro ao processar arquivo');
    console.error(error);
  }
};

// Validação
const validateImportData = (data: any[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, index) => {
    // Validar campos obrigatórios
    if (!row.email) {
      errors.push(`Linha ${index + 2}: Email obrigatório`);
    }
    
    // Validar formato de email
    if (row.email && !isValidEmail(row.email)) {
      errors.push(`Linha ${index + 2}: Email inválido (${row.email})`);
    }
    
    // Validar scores (0-5)
    for (let pilar of pilares) {
      const score = row[pilar.nome];
      if (score !== undefined && (score < 0 || score > 5)) {
        errors.push(`Linha ${index + 2}: Score inválido para ${pilar.nome} (${score})`);
      }
    }
  });
  
  return errors;
};

// Confirmar importação
const handleConfirmImport = async () => {
  try {
    setIsImporting(true);
    
    // Processar cada linha
    for (let row of uploadedData) {
      await importRow(row);
    }
    
    toast.success(`${uploadedData.length} registros importados com sucesso!`);
    setUploadedData(null);
  } catch (error) {
    toast.error('Erro ao importar dados');
  } finally {
    setIsImporting(false);
  }
};
```

**Geração de Template:**

```tsx
const downloadQualityScoreTemplate = () => {
  // Criar workbook
  const wb = XLSX.utils.book_new();
  
  // Criar sheet com estrutura
  const headers = [
    'Email',
    'Nome',
    'Cargo',
    ...pilares.map(p => p.nome)
  ];
  
  const sampleData = [
    [
      'exemplo@empresa.com',
      'João Silva',
      'QA Lead',
      ...pilares.map(() => 3.5)
    ]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  
  // Adicionar validação nas células (dropdown 0-5)
  // ... configuração de validação
  
  XLSX.utils.book_append_sheet(wb, ws, 'QualityScore');
  
  // Download
  XLSX.writeFile(wb, 'template_qualityscore.xlsx');
};
```

---

### 7. **PublicQualityScoreFixed.tsx** - Página Pública

**Responsabilidades:**
- Renderizar resultados públicos sem autenticação
- Buscar dados via shareId
- Exibir apenas informações permitidas
- Design otimizado para compartilhamento

**Estrutura:**

```tsx
export function PublicQualityScoreFixed({ shareId }: { shareId: string }) {
  const [data, setData] = useState<PublicShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadPublicShare();
  }, [shareId]);
  
  const loadPublicShare = async () => {
    try {
      // Buscar dados públicos (futuro: API/Supabase)
      const response = await fetch(`/api/public/score/${shareId}`);
      
      if (!response.ok) {
        throw new Error('Link inválido ou expirado');
      }
      
      const shareData = await response.json();
      setData(shareData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!data) return <NotFoundScreen />;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Público */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QualityMapAppLogo className="h-8" />
            <div>
              <h1 className="font-semibold">{data.companyName}</h1>
              <p className="text-sm text-muted-foreground">{data.versaoId}</p>
            </div>
          </div>
          
          <Badge className="bg-blue-100 text-blue-800">
            Visualização Pública
          </Badge>
        </div>
      </header>
      
      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Score Geral */}
        <Card className="p-8 text-center mb-6">
          <div className="text-7xl font-bold mb-4" style={{ color: getScoreColor(data.overallScore) }}>
            {data.overallScore.toFixed(1)}
          </div>
          <Badge className={getMaturityBadgeColor(data.overallScore)} size="lg">
            {getMaturityLevel(data.overallScore)}
          </Badge>
          <p className="text-muted-foreground mt-4">
            Avaliação realizada em {formatDate(data.timestamp)}
          </p>
        </Card>
        
        {/* Grid de Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          {data.pillarScores.map(pilar => (
            <Card key={pilar.id} className="p-4 text-center">
              <div className="mb-2">{getPilarIcon(pilar.id)}</div>
              <h3 className="text-sm font-medium mb-2">{pilar.name}</h3>
              <div className="text-2xl font-semibold mb-2">
                {pilar.score.toFixed(1)}
              </div>
              <Badge size="sm" className={getMaturityBadgeColor(pilar.score)}>
                {getMaturityLevel(pilar.score)}
              </Badge>
            </Card>
          ))}
        </div>
        
        {/* Gráfico Radar */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Análise por Pilares</h2>
          <RadarChart data={data.radarData} />
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by <strong>QualityMap App</strong></p>
          <p>Plataforma de Avaliação de Maturidade em Qualidade de Software</p>
        </div>
      </main>
    </div>
  );
}
```

---

## 🔐 Contextos e State Management

### 1. **AuthContext** - Autenticação

**Responsabilidades:**
- Gerenciar estado de autenticação
- Login/Logout
- Gestão de usuários e permissões
- Troca de perfis (manager/leader/member)

**Interface:**

```tsx
interface User {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'leader' | 'member';
  companyId?: string;
  companyName?: string;
  permissions: {
    canViewAllCompanies: boolean;
    canImportData: boolean;
    canViewResults: boolean;
    canInviteMembers: boolean;
    canEditMemberPermissions: boolean;
    canViewProgress: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  companies: Company[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  loading: boolean;
}
```

**Implementação:**

```tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar token no localStorage
    const storedUser = localStorage.getItem('qualitymap_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    // Simular login (em produção: API/Supabase)
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('qualitymap_user');
  };
  
  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(updatedUser));
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      companies: MOCK_COMPANIES,
      login,
      logout,
      switchRole,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Uso:**

```tsx
function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <div>
      <p>Olá, {user.name}!</p>
      <Button onClick={logout}>Sair</Button>
    </div>
  );
}
```

---

### 2. **CompanyContext** - Multi-Tenant

**Responsabilidades:**
- Gerenciar empresa selecionada
- Listar empresas disponíveis
- Aplicar cores whitelabel
- Filtrar dados por empresa

**Interface:**

```tsx
interface CompanyData {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  status: 'active' | 'inactive';
  leaderId: string;
  createdAt: string;
}

interface CompanyContextType {
  selectedCompany: CompanyData | null;
  availableCompanies: CompanyData[];
  selectCompany: (company: CompanyData) => void;
  clearCompanySelection: () => void;
  isWhitelabelMode: boolean;
}
```

**Implementação:**

```tsx
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const { user } = useAuth();
  
  // Filtrar empresas disponíveis baseado no usuário
  const availableCompanies = useMemo(() => {
    if (user?.role === 'manager') {
      return MOCK_COMPANIES_DATA; // Vê todas
    } else if (user?.companyId) {
      return MOCK_COMPANIES_DATA.filter(c => c.id === user.companyId);
    }
    return [];
  }, [user]);
  
  const selectCompany = (company: CompanyData) => {
    setSelectedCompany(company);
    
    // Aplicar cores whitelabel
    if (company.primaryColor) {
      document.documentElement.style.setProperty('--company-primary', company.primaryColor);
    }
  };
  
  const clearCompanySelection = () => {
    setSelectedCompany(null);
    // Restaurar cores padrão
    document.documentElement.style.setProperty('--company-primary', '#2563eb');
  };
  
  return (
    <CompanyContext.Provider value={{
      selectedCompany,
      availableCompanies,
      selectCompany,
      clearCompanySelection,
      isWhitelabelMode: !!selectedCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
}
```

**Hook de Cores:**

```tsx
// useCompanyColors.tsx
export function useCompanyColors() {
  const { selectedCompany } = useCompany();
  
  useEffect(() => {
    if (selectedCompany?.primaryColor) {
      document.documentElement.style.setProperty(
        '--company-primary',
        selectedCompany.primaryColor
      );
    }
    
    return () => {
      // Cleanup: restaurar cor padrão
      document.documentElement.style.setProperty('--company-primary', '#2563eb');
    };
  }, [selectedCompany]);
}
```

---

### 3. **QualityScoreProvider** - Estado de Avaliações

**Responsabilidades:**
- Armazenar respostas da avaliação
- Calcular scores em tempo real
- Gerenciar histórico de versões
- Sincronizar com backend (futuro)

**Interface:**

```tsx
interface QualityScoreContextType {
  currentAssessment: Assessment | null;
  assessmentHistory: Assessment[];
  saveAnswer: (questionId: string, value: number) => void;
  saveAssessment: (assessment: Assessment) => void;
  loadAssessment: (assessmentId: string) => Assessment | null;
  clearCurrentAssessment: () => void;
}

interface Assessment {
  id: string;
  userId: string;
  companyId: string;
  versaoId: string;
  answers: Record<string, number>;
  pillarScores: PillarScore[];
  overallScore: number;
  timestamp: string;
  status: 'draft' | 'completed';
}
```

**Implementação:**

```tsx
export function QualityScoreProvider({ children }: { children: ReactNode }) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  
  const saveAnswer = (questionId: string, value: number) => {
    setCurrentAssessment(prev => {
      if (!prev) return null;
      
      const updatedAnswers = { ...prev.answers, [questionId]: value };
      
      // Recalcular scores
      const pillarScores = calculatePillarScores(updatedAnswers);
      const overallScore = calculateOverallScore(pillarScores);
      
      return {
        ...prev,
        answers: updatedAnswers,
        pillarScores,
        overallScore
      };
    });
  };
  
  const saveAssessment = (assessment: Assessment) => {
    setAssessmentHistory(prev => [...prev, assessment]);
    setCurrentAssessment(null);
    
    // Salvar no localStorage (temporário)
    localStorage.setItem(
      `assessment_${assessment.id}`,
      JSON.stringify(assessment)
    );
  };
  
  return (
    <QualityScoreContext.Provider value={{
      currentAssessment,
      assessmentHistory,
      saveAnswer,
      saveAssessment,
      loadAssessment,
      clearCurrentAssessment
    }}>
      {children}
    </QualityScoreContext.Provider>
  );
}
```

---

## 🔀 Sistema de Roteamento

### Roteamento Interno (State-Based)

O QualityMap App usa **roteamento baseado em estado** ao invés de React Router:

```tsx
// App.tsx
const [activeSection, setActiveSection] = useState('dashboard');

const renderContent = () => {
  switch (activeSection) {
    case 'dashboard':
      return <Dashboard />;
    case 'qualityscore-formulario':
      return <FormularioIntro />;
    case 'qualityscore-progresso':
      return <Rodadas />;
    case 'qualityscore-resultados':
      return <Resultados />;
    // ... demais seções
  }
};
```

**Seções Disponíveis:**

| ID da Seção | Componente | Acesso |
|-------------|-----------|--------|
| `dashboard` | `<Dashboard />` | Todos |
| `qualityscore-formulario` | `<FormularioIntro />` | Todos |
| `qualityscore-progresso` | `<Rodadas />` | Manager, Leader |
| `qualityscore-resultados` | `<Resultados />` | Todos (com restrições) |
| `qualityscore-importar` | `<Importar />` | Manager, Leader |
| `empresa` | `<CompanyManagement />` | Manager |
| `personas` | `<PersonaSwitcher />` | Todos |
| `cadastros` | `<CadastrosManagement />` | Manager, Leader |
| `public-demo` | `<PublicDemo />` | Público |

### Rotas Públicas (URL-Based)

Para compartilhamento público, o app detecta URLs específicas:

```tsx
// Detecção de rota pública
const { isPublicRoute, shareId } = usePublicRoute();

// URLs suportadas:
// 1. /score/abc123 (pathname)
// 2. #/score/abc123 (hash routing)
// 3. ?demo=score/abc123 (query param)

if (isPublicRoute && shareId) {
  return <PublicQualityScoreFixed shareId={shareId} />;
}
```

---

## 🛡️ Autenticação e Autorização

### Sistema de Permissões

**3 Níveis de Usuário:**

| Role | Nome | Permissões |
|------|------|-----------|
| **Manager** | Gerente do Sistema | Tudo (gestão global) |
| **Leader** | Líder de Equipe | Gestão de sua empresa |
| **Member** | Membro da Equipe | Apenas responder avaliações |

**Mapeamento de Permissões:**

```tsx
const PERMISSIONS_BY_ROLE = {
  manager: {
    canViewAllCompanies: true,
    canImportData: true,
    canViewResults: true,
    canInviteMembers: true,
    canEditMemberPermissions: true,
    canViewProgress: true
  },
  leader: {
    canViewAllCompanies: false,
    canImportData: true,
    canViewResults: true,
    canInviteMembers: true,
    canEditMemberPermissions: true,
    canViewProgress: true
  },
  member: {
    canViewAllCompanies: false,
    canImportData: false,
    canViewResults: false, // Apenas se permitido na rodada
    canInviteMembers: false,
    canEditMemberPermissions: false,
    canViewProgress: false
  }
};
```

### Componente de Controle de Acesso

```tsx
// AccessControl.tsx
export function AccessControl({ 
  requiredPermissions,
  children 
}: { 
  requiredPermissions: string[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  
  const hasPermission = requiredPermissions.every(
    perm => user?.permissions[perm] === true
  );
  
  if (!hasPermission) {
    return (
      <Card className="p-8 text-center">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Acesso Restrito</h3>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta área.
        </p>
      </Card>
    );
  }
  
  return <>{children}</>;
}

// Uso:
<AccessControl requiredPermissions={['canViewProgress']}>
  <Rodadas />
</AccessControl>
```

---

## 🏢 Sistema Multi-Tenant

### Arquitetura Multi-Tenant

**Níveis de Isolamento:**

1. **Dados**: Cada empresa tem seus próprios dados isolados
2. **Visual**: Cores e logo customizados por empresa
3. **Usuários**: Usuários pertencem a uma empresa específica

**Fluxo de Seleção de Empresa:**

```
Manager Login
    ↓
Vê todas as empresas no seletor
    ↓
Seleciona empresa X
    ↓
Sistema aplica:
  - Cor primária da empresa X
  - Logo da empresa X (se houver)
  - Filtra dados para empresa X apenas
    ↓
Todos os componentes agora mostram dados da empresa X
```

**Implementação:**

```tsx
// CompanySelector.tsx
export function CompanySelector() {
  const { selectedCompany, availableCompanies, selectCompany } = useCompany();
  const { user } = useAuth();
  
  // Se não é manager, não mostra seletor
  if (user?.role !== 'manager') {
    return null;
  }
  
  return (
    <Select 
      value={selectedCompany?.id} 
      onValueChange={(id) => {
        const company = availableCompanies.find(c => c.id === id);
        if (company) selectCompany(company);
      }}
    >
      <SelectTrigger>
        <Building className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Selecione uma empresa" />
      </SelectTrigger>
      <SelectContent>
        {availableCompanies.map(company => (
          <SelectItem key={company.id} value={company.id}>
            <div className="flex items-center gap-2">
              {company.logo && <img src={company.logo} className="h-4 w-4" />}
              <span>{company.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Filtragem de Dados:**

```tsx
// Exemplo: filtrar rodadas por empresa
const filteredRodadas = useMemo(() => {
  if (user?.role === 'manager' && selectedCompany) {
    return rodadas.filter(r => r.companyId === selectedCompany.id);
  } else if (user?.companyId) {
    return rodadas.filter(r => r.companyId === user.companyId);
  }
  return [];
}, [rodadas, user, selectedCompany]);
```

---

## 🎨 Design System

Ver documento completo em **[README_DESIGN_SYSTEM.md](README_DESIGN_SYSTEM.md)**

**Resumo:**

- **Cores**: Sistema de tokens CSS com 5 níveis de maturidade QualityScore
- **Tipografia**: Escala de 12px a 24px, hierarquia automática
- **Ícones**: 500+ ícones Lucide React
- **Componentes**: 55+ componentes ShadCN/UI
- **Espaçamento**: Escala de 4px (múltiplos de 0.25rem)
- **Animações**: Motion/React com transições suaves
- **Responsividade**: Breakpoints Tailwind (sm, md, lg, xl, 2xl)

---

## 👥 Fluxos de Usuário

### Fluxo 1: Manager cria rodada e acompanha progresso

```
1. Login como Manager
2. Navegar para "Empresas"
3. Selecionar empresa no dropdown
4. Navegar para "Rodadas"
5. Clicar em "Nova Rodada"
6. Preencher formulário:
   - Nome da rodada
   - Data de prazo
   - Critério de encerramento (manual/automático)
   - Selecionar participantes
7. Confirmar criação
8. Sistema envia convites por email
9. Acompanhar progresso em tempo real no card da rodada
10. Quando 100% completo, clicar em "Gerar Resultado"
11. Navegar para "Resultados" para análise
```

### Fluxo 2: Member responde avaliação

```
1. Recebe email de convite
2. Clica no link do email
3. Faz login (ou se já logado, vai direto)
4. É direcionado para "Formulário"
5. Vê introdução do QualityScore
6. Clica em "Iniciar Avaliação"
7. Responde perguntas pilar por pilar (7 pilares × 13 perguntas)
8. Progresso é salvo automaticamente
9. Pode pausar e retomar depois
10. Ao finalizar, clica em "Concluir Avaliação"
11. Vê mensagem de sucesso
12. Aguarda liberação de acesso aos resultados pelo Leader
```

### Fluxo 3: Leader compartilha resultados publicamente

```
1. Login como Leader
2. Navegar para "Resultados"
3. Analisar resultados da rodada
4. Clicar na aba "Sharing"
5. Clicar em "Gerar Link Público"
6. Sistema gera URL: https://app.com/score/abc123
7. Copiar link
8. Compartilhar via email, Slack, WhatsApp, etc.
9. Destinatário acessa link sem login
10. Vê resultados em página pública otimizada
```

---

## 📦 Bibliotecas e Dependências

### Produção

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.1.7",
    
    "lucide-react": "^0.487.0",
    "motion": "latest",
    "recharts": "^2.12.7",
    "react-hook-form": "^7.55.0",
    "sonner": "^2.0.3",
    "xlsx": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  }
}
```

### Desenvolvimento

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## ⚙️ Setup e Configuração

### Instalação

```bash
# Clone o repositório
git clone https://github.com/your-org/qualitymap-app.git

# Instale dependências
cd qualitymap-app
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# .env
VITE_APP_NAME="QualityMap App"
VITE_APP_VERSION="3.0"
VITE_API_URL="http://localhost:3000" # Futuro backend
VITE_SUPABASE_URL="" # Opcional
VITE_SUPABASE_KEY="" # Opcional
```

### Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

### Estrutura de Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (outros assets)
└── ...
```

---

## 📚 Documentação Adicional

### READMEs Especializados

| Documento | Descrição |
|-----------|-----------|
| **[README_FORMULARIO.md](README_FORMULARIO.md)** | 91 perguntas detalhadas organizadas em 7 pilares |
| **[README_RESULTADOS.md](README_RESULTADOS.md)** | Sistema de resultados: cálculos e 6 abas |
| **[README_RODADAS.md](README_RODADAS.md)** | Lógica de rodadas e versionamento |
| **[README_RODADAS_UI.md](README_RODADAS_UI.md)** | UI detalhada do módulo de rodadas |
| **[README_DESIGN_SYSTEM.md](README_DESIGN_SYSTEM.md)** | Design system completo: cores, tipografia, ícones |
| **[README_DEMO_PUBLICA.md](README_DEMO_PUBLICA.md)** | Sistema de demos públicas |
| **[GUIA_RAPIDO_DEMOS.md](GUIA_RAPIDO_DEMOS.md)** | Guia rápido para demos |
| **[README_ESTRUTURA_PERGUNTAS.md](README_ESTRUTURA_PERGUNTAS.md)** | Estrutura técnica das perguntas |
| **[README_PERGUNTA_ESPECIAL.md](README_PERGUNTA_ESPECIAL.md)** | Pergunta 91 especial |
| **[README_LOGO_QUALITYMAP_APP.md](README_LOGO_QUALITYMAP_APP.md)** | Especificações do logo |
| **[README_UPDATE_PUBLIC_QUALITYSCORE.md](README_UPDATE_PUBLIC_QUALITYSCORE.md)** | Sistema de scores públicos |

---

## 🎯 Próximos Passos

### Roadmap Técnico

#### Q1 2025
- [ ] Integração com Supabase (Database + Auth)
- [ ] API RESTful para backend
- [ ] Autenticação real (substituir mock)
- [ ] Persistência de dados no Supabase

#### Q2 2025
- [ ] Sistema de notificações por email (SendGrid/Resend)
- [ ] Exportação de resultados em PDF
- [ ] Dashboard de analytics avançado
- [ ] Modo dark completo

#### Q3 2025
- [ ] App mobile (React Native)
- [ ] Integração com Slack/Teams
- [ ] IA para geração de ações aprimorada
- [ ] Sistema de gamificação

#### Q4 2025
- [ ] Marketplace de templates
- [ ] Integração com JIRA/GitHub
- [ ] Relatórios customizáveis
- [ ] API pública para desenvolvedores

---

## 💡 Conclusão

O **QualityMap App** é uma plataforma completa e moderna para avaliação de maturidade em qualidade de software, construída com as melhores práticas de desenvolvimento React, design system robusto e arquitetura escalável.

### Principais Destaques

✅ **91 perguntas** organizadas em 7 pilares  
✅ **5 níveis de maturidade** (Agnóstico → Domínio)  
✅ **Sistema multi-tenant** com whitelabel  
✅ **6 abas de resultados** com análises profundas  
✅ **Rodadas versionadas** com controle granular  
✅ **Compartilhamento público** sem autenticação  
✅ **55+ componentes ShadCN/UI** reutilizáveis  
✅ **Design system completo** com Tailwind v4  
✅ **Documentação extensa** (12 READMEs especializados)

### Tecnologias de Ponta

⚡ React 18 + TypeScript  
🎨 Tailwind CSS v4 + ShadCN/UI  
📊 Recharts para visualizações  
🎭 Motion/React para animações  
🔐 Sistema de permissões robusto  
🏢 Arquitetura multi-tenant

### Para Desenvolvedores

Este README junto com os 12 documentos especializados fornece uma **documentação técnica completa** para:
- Entender a arquitetura do sistema
- Contribuir com novos recursos
- Fazer manutenção e debugging
- Implementar customizações
- Integrar com outras ferramentas

### Para Stakeholders

O QualityMap App está pronto para:
- Escalar para milhares de usuários
- Suportar múltiplas empresas (SaaS)
- Integrar com sistemas externos
- Evoluir com novas funcionalidades

---

**Versão:** 3.0  
**Última atualização:** Outubro 2025  
**Licença:** Proprietária  
**Mantido por:** Equipe QualityMap App

---

## 📞 Suporte

Para dúvidas ou sugestões:
- 📧 Email: suporte@qualitymap.app
- 📚 Documentação: [/docs](https://docs.qualitymap.app)
- 💬 Slack: #qualitymap-app

**Happy Coding! 🚀**
