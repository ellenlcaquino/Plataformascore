# 🗄️ QualityMap App - Integração com Banco de Dados

## 📋 Visão Geral

O QualityMap App agora está integrado com **Supabase** (PostgreSQL) para persistência de dados. Este documento detalha a estrutura do banco de dados, serviços implementados e como usar.

---

## 🏗️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **companies** - Empresas (Multi-Tenant)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  leader_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_leader ON companies(leader_id);
```

**Campos:**
- `id`: ID único da empresa
- `name`: Nome da empresa
- `domain`: Domínio (ex: techcorp.com.br)
- `logo_url`: URL do logo (opcional)
- `primary_color`: Cor primária para whitelabel
- `status`: 'active' ou 'inactive'
- `leader_id`: ID do líder responsável

---

#### 2. **rodadas** - Ciclos de Avaliação

```sql
CREATE TABLE rodadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('rascunho', 'ativa', 'encerrada')) DEFAULT 'ativa',
  criterio_encerramento TEXT CHECK (criterio_encerramento IN ('manual', 'automatico')) DEFAULT 'manual',
  due_date TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  encerrado_em TIMESTAMPTZ,
  
  UNIQUE(company_id, versao_id)
);

-- Índices
CREATE INDEX idx_rodadas_company ON rodadas(company_id);
CREATE INDEX idx_rodadas_status ON rodadas(status);
CREATE INDEX idx_rodadas_versao ON rodadas(versao_id);
```

**Campos:**
- `id`: ID único da rodada
- `company_id`: Empresa dona da rodada
- `versao_id`: Versão no formato V2024.01.001
- `status`: 'rascunho', 'ativa' ou 'encerrada'
- `criterio_encerramento`: 'manual' ou 'automatico'
- `due_date`: Data limite para conclusão
- `created_by`: ID do usuário que criou
- `encerrado_em`: Timestamp de encerramento

---

#### 3. **rodada_participantes** - Participantes das Rodadas

```sql
CREATE TABLE rodada_participantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT CHECK (status IN ('pendente', 'respondendo', 'concluido', 'atrasado')) DEFAULT 'pendente',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  can_view_results BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(rodada_id, user_id)
);

-- Índices
CREATE INDEX idx_participantes_rodada ON rodada_participantes(rodada_id);
CREATE INDEX idx_participantes_user ON rodada_participantes(user_id);
CREATE INDEX idx_participantes_status ON rodada_participantes(status);
```

**Campos:**
- `id`: ID único do participante
- `rodada_id`: Rodada à qual pertence
- `user_id`: ID do usuário participante
- `status`: 'pendente', 'respondendo', 'concluido', 'atrasado'
- `progress`: Progresso de 0 a 100%
- `can_view_results`: Permissão para ver resultados
- `last_activity`: Última vez que respondeu
- `completed_date`: Data de conclusão

---

#### 4. **assessments** - Avaliações (Formulários)

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  rodada_id UUID REFERENCES rodadas(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  overall_score DECIMAL(3, 1) DEFAULT 0.0,
  status TEXT CHECK (status IN ('draft', 'completed')) DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_rodada ON assessments(rodada_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_company ON assessments(company_id);
```

**Campos:**
- `id`: ID único da avaliação
- `user_id`: Usuário que fez a avaliação
- `rodada_id`: Rodada à qual pertence (opcional)
- `company_id`: Empresa
- `versao_id`: Versão da avaliação
- `overall_score`: Score geral (0.0 a 5.0)
- `status`: 'draft' (em andamento) ou 'completed'
- `completed_at`: Timestamp de conclusão

---

#### 5. **assessment_answers** - Respostas Individuais

```sql
CREATE TABLE assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  pilar_id INTEGER NOT NULL CHECK (pilar_id >= 1 AND pilar_id <= 7),
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(assessment_id, question_id)
);

-- Índices
CREATE INDEX idx_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX idx_answers_pilar ON assessment_answers(pilar_id);
```

**Campos:**
- `id`: ID único da resposta
- `assessment_id`: Avaliação à qual pertence
- `question_id`: ID da pergunta (ex: "p1_q1")
- `pilar_id`: ID do pilar (1-7)
- `value`: Valor da resposta (0-5)

**Os 7 Pilares:**
1. Processos e Estratégia
2. Testes Automatizados
3. Métricas
4. Documentações
5. Modalidades de Testes
6. QAOps
7. Liderança

---

#### 6. **results** - Resultados Calculados

```sql
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  overall_score DECIMAL(3, 1) NOT NULL,
  pilar_scores JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(rodada_id)
);

-- Índices
CREATE INDEX idx_results_rodada ON results(rodada_id);
CREATE INDEX idx_results_versao ON results(versao_id);
```

**Campos:**
- `id`: ID único do resultado
- `rodada_id`: Rodada à qual pertence
- `versao_id`: Versão (V2024.01.001)
- `overall_score`: Score geral agregado
- `pilar_scores`: JSON com scores por pilar
- `metadata`: JSON com metadados

**Exemplo de pilar_scores:**
```json
[
  {
    "pilar_id": 1,
    "pilar_name": "Processos e Estratégia",
    "score": 3.8,
    "maturity_level": "Experiência"
  },
  {
    "pilar_id": 2,
    "pilar_name": "Testes Automatizados",
    "score": 4.2,
    "maturity_level": "Domínio"
  }
  // ... demais pilares
]
```

**Exemplo de metadata:**
```json
{
  "total_participants": 8,
  "total_responses": 728,
  "completion_rate": 100,
  "created_by": "user-id",
  "calculation_date": "2024-10-27T10:00:00Z"
}
```

---

#### 7. **public_shares** - Compartilhamentos Públicos

```sql
CREATE TABLE public_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT UNIQUE NOT NULL,
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  result_id UUID NOT NULL REFERENCES results(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_shares_share_id ON public_shares(share_id);
CREATE INDEX idx_shares_rodada ON public_shares(rodada_id);
CREATE INDEX idx_shares_active ON public_shares(is_active);
```

**Campos:**
- `id`: ID único do share
- `share_id`: ID curto para URL (ex: "abc123xy")
- `rodada_id`: Rodada compartilhada
- `result_id`: Resultado compartilhado
- `created_by`: Quem criou o share
- `expires_at`: Data de expiração (null = sem expiração)
- `is_active`: Se está ativo
- `views`: Contador de visualizações

---

## 📦 Serviços Implementados

### 1. **AssessmentService** (`/services/AssessmentService.ts`)

Gerencia formulários de avaliação e respostas.

**Métodos Principais:**

```typescript
// Criar nova avaliação
createAssessment(data: CreateAssessmentData): Promise<Assessment | null>

// Buscar assessment atual do usuário
getCurrentUserAssessment(userId: string, rodadaId?: string): Promise<Assessment | null>

// Salvar uma resposta
saveAnswer(data: SaveAnswerData): Promise<boolean>

// Salvar múltiplas respostas
saveBatchAnswers(assessmentId: string, answers: SaveAnswerData[]): Promise<boolean>

// Completar avaliação
completeAssessment(assessmentId: string): Promise<boolean>

// Calcular progresso
getAssessmentProgress(assessmentId: string, totalQuestions: number): Promise<number>

// Buscar assessments de uma rodada
getCompletedAssessmentsByRodada(rodadaId: string): Promise<Assessment[]>
```

---

### 2. **RodadaService** (`/services/RodadaService.ts`)

Gerencia rodadas e participantes.

**Métodos Principais:**

```typescript
// Gerar ID de versão automaticamente
generateVersionId(companyId: string): Promise<string>

// Criar rodada
createRodada(data: CreateRodadaData): Promise<Rodada | null>

// Buscar rodada por ID
getRodadaById(rodadaId: string): Promise<Rodada | null>

// Buscar rodadas de uma empresa
getRodadasByCompany(companyId: string, status?: string): Promise<Rodada[]>

// Atualizar status da rodada
updateRodadaStatus(rodadaId: string, status: string): Promise<boolean>

// Adicionar participante
addParticipante(rodadaId: string, userId: string): Promise<boolean>

// Atualizar progresso do participante
updateParticipanteProgress(rodadaId: string, userId: string, progress: number): Promise<boolean>

// Toggle acesso aos resultados
toggleParticipanteResultAccess(participanteId: string, canViewResults: boolean): Promise<boolean>

// Permitir/restringir todos
allowAllParticipantsViewResults(rodadaId: string): Promise<boolean>
restrictAllParticipantsViewResults(rodadaId: string): Promise<boolean>

// Calcular estatísticas
getRodadaStats(rodadaId: string): Promise<RodadaStats>
```

---

### 3. **ResultsService** (`/services/ResultsService.ts`)

Gerencia resultados e compartilhamentos públicos.

**Métodos Principais:**

```typescript
// Gerar resultado de uma rodada
generateResult(rodadaId: string, createdBy: string): Promise<Result | null>

// Buscar resultado por rodada
getResultByRodada(rodadaId: string): Promise<Result | null>

// Criar compartilhamento público
createPublicShare(rodadaId: string, resultId: string, createdBy: string, expiresAt?: string): Promise<PublicShare | null>

// Buscar dados públicos por shareId
getPublicShareData(shareId: string): Promise<any | null>

// Revogar share
revokePublicShare(shareId: string): Promise<boolean>

// Calcular divergência entre participantes
calculateDivergence(rodadaId: string): Promise<any>
```

---

## 🎣 Hooks Customizados

### 1. **useAssessment** (`/hooks/useAssessment.ts`)

Hook para gerenciar avaliações no componente.

```typescript
const {
  currentAssessment,  // Assessment ativo
  loading,            // Carregando?
  saving,             // Salvando?
  createAssessment,   // Criar nova avaliação
  saveAnswer,         // Salvar resposta
  completeAssessment, // Completar avaliação
  getProgress,        // Calcular progresso
  getAnswer,          // Buscar resposta de uma pergunta
  reload              // Recarregar assessment
} = useAssessment(userId, rodadaId);

// Exemplo de uso:
await saveAnswer('p1_q1', 1, 4); // questionId, pilarId, value
```

---

### 2. **useRodadas** (`/hooks/useRodadas.ts`)

Hook para gerenciar lista de rodadas.

```typescript
const {
  rodadas,            // Lista de rodadas
  loading,            // Carregando?
  createRodada,       // Criar nova rodada
  encerrarRodada,     // Encerrar rodada
  toggleResultAccess, // Toggle acesso individual
  allowAllResults,    // Permitir todos verem
  restrictAllResults, // Restringir todos
  reload              // Recarregar lista
} = useRodadas(companyId);

// Para rodada específica:
const {
  rodada,                    // Dados da rodada
  stats,                     // Estatísticas
  loading,
  updateParticipanteProgress,
  reload
} = useRodada(rodadaId);
```

---

### 3. **useResults** (`/hooks/useResults.ts`)

Hook para gerenciar resultados.

```typescript
// Resultado de uma rodada
const {
  result,         // Dados do resultado
  loading,
  generateResult, // Gerar resultado
  reload
} = useResults(rodadaId);

// Compartilhamento público
const {
  publicShares,   // Lista de shares ativos
  loading,
  createShare,    // Criar novo share
  revokeShare,    // Revogar share
  reload
} = usePublicShare(rodadaId, resultId);

// Dados públicos (sem auth)
const {
  data,    // Dados públicos
  loading,
  error,
  reload
} = usePublicData(shareId);

// Análise de divergência
const {
  divergence, // Dados de divergência
  loading,
  reload
} = useDivergence(rodadaId);
```

---

## 🚀 Como Usar nos Componentes

### Exemplo 1: Salvar respostas do formulário

```typescript
import { useAssessment } from '../hooks/useAssessment';
import { useAuth } from '../components/AuthContext';

function QualityScoreAssessment() {
  const { user } = useAuth();
  const { 
    currentAssessment, 
    saveAnswer, 
    completeAssessment,
    getAnswer 
  } = useAssessment(user.id);

  const handleAnswerChange = async (questionId: string, pilarId: number, value: number) => {
    const success = await saveAnswer(questionId, pilarId, value);
    
    if (success) {
      console.log('Resposta salva!');
    }
  };

  const handleComplete = async () => {
    const success = await completeAssessment();
    
    if (success) {
      navigate('/resultados');
    }
  };

  const currentAnswer = getAnswer('p1_q1'); // Pega resposta salva

  return (
    <div>
      {/* Renderizar perguntas */}
      <QuestionRenderer 
        value={currentAnswer}
        onChange={(value) => handleAnswerChange('p1_q1', 1, value)}
      />
      
      <Button onClick={handleComplete}>
        Concluir Avaliação
      </Button>
    </div>
  );
}
```

---

### Exemplo 2: Gerenciar rodadas

```typescript
import { useRodadas } from '../hooks/useRodadas';
import { useAuth } from '../components/AuthContext';

function Rodadas() {
  const { user } = useAuth();
  const { 
    rodadas, 
    loading, 
    createRodada, 
    encerrarRodada 
  } = useRodadas(user.companyId);

  const handleCreateRodada = async () => {
    const rodada = await createRodada({
      company_id: user.companyId!,
      versao_id: '', // Será gerado automaticamente
      criterio_encerramento: 'manual',
      due_date: new Date('2024-12-31').toISOString(),
      created_by: user.id,
      participantes: ['user-1', 'user-2', 'user-3']
    });

    if (rodada) {
      console.log('Rodada criada:', rodada.versao_id);
    }
  };

  const handleEncerrar = async (rodadaId: string) => {
    const success = await encerrarRodada(rodadaId);
    
    if (success) {
      console.log('Rodada encerrada!');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <Button onClick={handleCreateRodada}>Nova Rodada</Button>
      
      {rodadas.map(rodada => (
        <RodadaCard 
          key={rodada.id}
          rodada={rodada}
          onEncerrar={() => handleEncerrar(rodada.id)}
        />
      ))}
    </div>
  );
}
```

---

### Exemplo 3: Gerar e compartilhar resultado

```typescript
import { useResults, usePublicShare } from '../hooks/useResults';
import { useAuth } from '../components/AuthContext';

function ResultadosTab() {
  const { user } = useAuth();
  const rodadaId = 'rodada-123';
  
  const { result, generateResult } = useResults(rodadaId);
  const { publicShares, createShare } = usePublicShare(
    rodadaId, 
    result?.id || ''
  );

  const handleGenerate = async () => {
    const newResult = await generateResult(user.id);
    
    if (newResult) {
      console.log('Score geral:', newResult.overall_score);
      console.log('Scores por pilar:', newResult.pilar_scores);
    }
  };

  const handleCreateShare = async () => {
    const shareUrl = await createShare(user.id);
    
    if (shareUrl) {
      // Copiar para clipboard
      navigator.clipboard.writeText(shareUrl);
      console.log('Link copiado:', shareUrl);
    }
  };

  return (
    <div>
      {!result && (
        <Button onClick={handleGenerate}>
          Gerar Resultado
        </Button>
      )}

      {result && (
        <>
          <h1>Score: {result.overall_score}</h1>
          
          <Button onClick={handleCreateShare}>
            Gerar Link Público
          </Button>

          {publicShares.map(share => (
            <div key={share.id}>
              URL: /score/{share.share_id}
              Views: {share.views}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

As credenciais do Supabase são obtidas automaticamente via `/utils/supabase/info.tsx`:

```typescript
import { projectId, publicAnonKey } from './utils/supabase/info';
```

Não é necessário criar arquivo `.env` - o sistema usa as variáveis fornecidas pelo Figma Make.

---

### 2. Cliente Supabase

O cliente é criado automaticamente em `/utils/supabase/client.ts`:

```typescript
import { supabase } from '../utils/supabase/client';

// Usar em qualquer lugar:
const { data, error } = await supabase
  .from('rodadas')
  .select('*');
```

---

### 3. Criar Tabelas no Supabase

**Importante:** Execute estes scripts SQL no painel do Supabase (SQL Editor):

```sql
-- 1. Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabelas na ordem correta
-- (Copie os CREATE TABLE acima, na ordem: companies, rodadas, rodada_participantes, assessments, assessment_answers, results, public_shares)

-- 3. Configurar RLS (Row Level Security) - Opcional
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Criar políticas de acesso conforme necessário
```

---

## 📊 Fluxo Completo de Dados

### 1. Usuário responde formulário

```
1. useAssessment cria/carrega assessment
2. Usuário responde perguntas
3. Cada resposta é salva em assessment_answers via saveAnswer()
4. Progresso é atualizado automaticamente
5. Ao finalizar, completeAssessment() marca como completed
6. Se houver rodada, updateParticipanteProgress() atualiza status
```

### 2. Geração de resultado

```
1. Manager clica em "Gerar Resultado"
2. ResultsService.generateResult():
   - Busca todos os assessments completos da rodada
   - Agrega respostas de todos os participantes
   - Calcula score por pilar (média)
   - Calcula score geral (média dos pilares)
   - Determina nível de maturidade
   - Salva em results
3. Resultado fica disponível na aba Resultados
```

### 3. Compartilhamento público

```
1. Leader clica em "Gerar Link Público"
2. ResultsService.createPublicShare():
   - Gera shareId aleatório (ex: "abc123xy")
   - Salva em public_shares com referência ao result
3. URL gerada: /score/abc123xy
4. Ao acessar:
   - getPublicShareData() busca resultado
   - Incrementa contador de views
   - Retorna dados públicos (sem informações sensíveis)
5. Página pública renderiza sem autenticação
```

---

## 🔐 Segurança

### Row Level Security (RLS)

Recomenda-se configurar políticas RLS no Supabase para:

1. **companies**: Apenas managers e leaders da empresa podem ver
2. **rodadas**: Apenas usuários da empresa podem acessar
3. **assessments**: Apenas o próprio usuário e managers podem ver
4. **results**: Apenas usuários da rodada com permissão
5. **public_shares**: Qualquer um pode ler se is_active=true

**Exemplo de política:**

```sql
-- Usuários só veem assessments próprios ou da sua empresa
CREATE POLICY "Users can view own assessments" 
ON assessments FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  company_id IN (
    SELECT id FROM companies WHERE leader_id = auth.uid()
  )
);
```

---

## 📈 Performance

### Índices Criados

Todos os índices importantes foram criados para otimizar queries:

- `idx_rodadas_company`: Buscar rodadas por empresa
- `idx_participantes_rodada`: Buscar participantes de uma rodada
- `idx_answers_assessment`: Buscar respostas de um assessment
- `idx_results_rodada`: Buscar resultado de uma rodada
- `idx_shares_share_id`: Buscar share público por ID

### Queries Otimizadas

Os serviços usam:
- `select()` com joins quando necessário
- Filtros específicos com `eq()`, `like()`, etc.
- `single()` quando espera-se um único registro
- `order()` para ordenação
- Índices para todas as colunas frequentemente filtradas

---

## 🧪 Testes

### Dados de Teste

Para popular o banco com dados de teste:

```typescript
// Script de seed (criar em /scripts/seed.ts)
import { supabase } from '../utils/supabase/client';

async function seed() {
  // Criar empresa
  const { data: company } = await supabase
    .from('companies')
    .insert({
      name: 'Tech Corp Brasil',
      domain: 'techcorp.com.br',
      status: 'active',
      leader_id: 'user-123'
    })
    .select()
    .single();

  // Criar rodada
  const { data: rodada } = await supabase
    .from('rodadas')
    .insert({
      company_id: company.id,
      versao_id: 'V2024.01.001',
      status: 'ativa',
      criterio_encerramento: 'manual',
      due_date: new Date('2024-12-31').toISOString(),
      created_by: 'user-123'
    })
    .select()
    .single();

  console.log('Seed completo!', { company, rodada });
}

seed();
```

---

## 🚨 Troubleshooting

### Erro: "relation does not exist"

**Solução:** Certifique-se de que as tabelas foram criadas no Supabase SQL Editor.

### Erro: "permission denied"

**Solução:** Verifique as políticas RLS ou desabilite temporariamente para testes:

```sql
ALTER TABLE nome_tabela DISABLE ROW LEVEL SECURITY;
```

### Dados não aparecem

**Solução:** Verifique:
1. Console do Supabase → Table Editor (veja se há dados)
2. Network tab do navegador (erros de API)
3. Console.log nos serviços (veja erros retornados)

---

## 📚 Recursos Adicionais

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 💡 Próximos Passos

- [ ] Implementar autenticação real com Supabase Auth
- [ ] Configurar RLS policies completas
- [ ] Adicionar triggers para atualização automática de `updated_at`
- [ ] Implementar soft deletes ao invés de deletes físicos
- [ ] Adicionar auditoria de mudanças
- [ ] Implementar cache com React Query
- [ ] Adicionar validação de dados no backend (Supabase Functions)

---

**Versão:** 1.0  
**Última atualização:** Outubro 2025  
**Status:** ✅ Integração Completa
