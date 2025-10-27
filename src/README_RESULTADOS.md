# 📊 Resultados QualityScore - Lógica e Estrutura

## 🎯 Visão Geral

O módulo de **Resultados** do QualityMap App é responsável por processar, calcular e visualizar os dados coletados no formulário de avaliação QualityScore. Ele transforma as 91 respostas em insights acionáveis através de múltiplas perspectivas analíticas.

---

## 📐 Lógica de Cálculo

### 1. **Cálculo de Score por Pilar**

Cada pilar possui um número específico de perguntas:

- **Processos e Estratégia**: 16 perguntas
- **Testes Automatizados**: 16 perguntas
- **Métricas**: 14 perguntas
- **Documentações**: 11 perguntas
- **Modalidades de Testes**: 12 perguntas
- **QAOps**: 10 perguntas
- **Liderança**: 12 perguntas

**Fórmula de Cálculo:**
```
Score do Pilar = Soma de todas as respostas do pilar / Número de perguntas respondidas
```

**Tratamento de Dados:**
- Respostas vazias ou não respondidas são excluídas do cálculo
- Perguntas do tipo checkbox contam como score 3 se houver ao menos uma opção selecionada
- Perguntas de escala (0-5) usam o valor direto da resposta

### 2. **Cálculo de Score Geral**

```
Score Geral = Soma dos scores de todos os pilares / 7 pilares
```

O score geral representa a média aritmética simples dos 7 pilares, garantindo peso igual para cada dimensão de qualidade.

### 3. **Níveis de Maturidade**

Os scores são classificados em 5 níveis de maturidade:

| Faixa | Nível | Cor | Descrição |
|-------|-------|-----|-----------|
| **4.0 - 5.0** | 🟢 **Domínio** | Verde (#16a34a) | Práticas otimizadas e referência no mercado |
| **3.0 - 3.9** | 🔵 **Experiência** | Azul (#2563eb) | Práticas bem estabelecidas e efetivas |
| **2.0 - 2.9** | 🟡 **Consciência** | Laranja (#d97706) | Práticas em evolução, requer atenção |
| **1.0 - 1.9** | 🔴 **Inicialização** | Vermelho (#dc2626) | Práticas básicas, necessita melhorias urgentes |
| **0.0 - 0.9** | ⚫ **Agnóstico** | Cinza (#64748b) | Práticas não implementadas |

---

## 🗂️ Estrutura das Abas de Resultados

O módulo de resultados possui **6 abas** principais, cada uma com um propósito específico:

### 1️⃣ **Visão Geral (Overview)**

**Objetivo:** Fornecer um resumo executivo completo da avaliação.

**Conteúdo:**

#### 📋 Resumo Executivo
- Nome da empresa avaliada
- Número de participantes da avaliação
- Data de realização da avaliação

#### 🎯 Score Geral
- **Pontuação geral** (0-5) destacada em tamanho grande
- **Nível de maturidade** (Domínio, Experiência, Consciência, etc.)
- **Descrição textual** do nível alcançado
- Cor dinâmica baseada no nível de maturidade

#### 📊 Cards de Pilares
Grid de 7 cards (um para cada pilar) exibindo:
- **Ícone temático** do pilar
- **Nome do pilar**
- **Score numérico** (0-5)
- **Nível de maturidade** do pilar
- **Barra de progresso visual** (0-100%)
- **Descrição** do nível alcançado

**Utilidade:**
- Ideal para **apresentações executivas**
- Visão rápida da saúde geral da qualidade
- Identificação imediata de pilares fortes e fracos

---

### 2️⃣ **Radar**

**Objetivo:** Visualizar o perfil de maturidade de múltiplos participantes/personas através de um gráfico radar sobreposto.

**Conteúdo:**

#### 📊 Gráfico Radar Interativo
- **Eixos:** Um eixo para cada um dos 7 pilares
- **Linhas:** Uma linha colorida para cada participante/persona
- **Escala:** 0-5 pontos em cada eixo
- **Cores diferenciadas** para cada persona

#### 🎨 Legenda de Personas
- Lista de todos os participantes com cores correspondentes
- Nome e cargo de cada persona
- Opção de mostrar/ocultar personas individuais

#### 📈 Insights Visuais
- **Sobreposição de linhas** permite comparar visualmente diferentes visões
- **Forma do polígono** indica áreas de força e fraqueza
- **Amplitude das linhas** mostra consistência ou divergência entre participantes

**Utilidade:**
- **Comparação entre diferentes perfis** (QA Lead, Dev, PO, etc.)
- Identificar **divergências de percepção** entre áreas
- Visualizar se há alinhamento ou desalinhamento organizacional

---

### 3️⃣ **Linha Pilar**

**Objetivo:** Analisar a distribuição e dispersão das avaliações individuais em cada pilar através de visualização de linha com pontos.

**Conteúdo:**

#### 📊 Gráficos de Linha por Pilar
Para cada um dos 7 pilares:
- **Eixo X:** Participantes (personas)
- **Eixo Y:** Score (0-5)
- **Linha conectando** os pontos de avaliação
- **Pontos individuais** representando cada participante
- **Cores** baseadas no nível de maturidade

#### 📏 Métricas de Dispersão
Para cada pilar:
- **Média:** Score médio do pilar
- **Amplitude:** Diferença entre maior e menor score
- **Desvio padrão:** Indica dispersão/alinhamento

#### 🎯 Indicadores Visuais
- **Linha de referência** na média
- **Zona de maturidade** colorida ao fundo
- **Highlights** em outliers (valores muito distantes da média)

**Utilidade:**
- Identificar **consenso ou divergência** por pilar
- Detectar **avaliações discrepantes** (outliers)
- Analisar **consistência de percepção** entre participantes
- Priorizar onde alinhar expectativas da equipe

---

### 4️⃣ **Análise de Alinhamento**

**Objetivo:** Quantificar e visualizar o grau de alinhamento/divergência entre os participantes através de métricas estatísticas e heatmaps.

**Conteúdo:**

#### 🔥 Heatmap de Divergências
- **Matriz** de participantes x pilares
- **Cores** indicando desvio da média:
  - 🟢 Verde: Próximo da média (alinhado)
  - 🟡 Amarelo: Divergência moderada
  - 🔴 Vermelho: Divergência alta (desalinhado)

#### 📊 Métricas de Alinhamento
Para cada pilar:
- **Índice de alinhamento** (0-100%)
- **Nível de consenso** (Alto, Médio, Baixo)
- **Participantes mais alinhados** com a média
- **Participantes com maior divergência**

#### 🎯 Análise Detalhada
- **Pilares com maior alinhamento** (todos concordam)
- **Pilares com maior divergência** (visões conflitantes)
- **Personas outliers** (consistentemente fora da média)
- **Sugestões de ações** baseadas nas divergências

**Utilidade:**
- Identificar **falta de alinhamento** organizacional
- Detectar **silos de informação** ou visões departamentais
- Priorizar **comunicação e alinhamento** entre áreas
- Validar se a organização tem **visão compartilhada** de qualidade

---

### 5️⃣ **Ações (Recomendações)**

**Objetivo:** Fornecer recomendações práticas e acionáveis baseadas nos resultados, organizadas por nível estratégico.

**Conteúdo:**

#### 📋 Recomendações por Pilar
Para cada pilar, organizado do menor score para o maior:

**Card de Pilar com:**
- **Nome e ícone** do pilar
- **Score atual** e nível de maturidade
- **Badge de prioridade** (se score < 3.0: "Oportunidade de Melhoria")

**3 Níveis de Recomendações:**

##### 🎯 **Estratégicas**
Ações de longo prazo, visão macro:
- Estabelecer governança
- Definir políticas organizacionais
- Criar programas de transformação

##### ⚙️ **Táticas**
Ações de médio prazo, implementação:
- Padronizar processos
- Implementar ferramentas
- Capacitar equipes

##### 🔧 **Operacionais**
Ações de curto prazo, execução imediata:
- Criar templates e checklists
- Implementar rotinas específicas
- Executar melhorias pontuais

#### 📌 Exemplos por Pilar:

**Processos e Estratégia:**
- Estratégica: "Estabelecer governança de qualidade com processos padronizados"
- Tática: "Implementar Definition of Ready e Definition of Done"
- Operacional: "Criar templates de documentação e checklists de processo"

**Testes Automatizados:**
- Estratégica: "Estruturar pipeline de CI/CD com gates de qualidade"
- Tática: "Definir estratégia de cobertura de testes automatizados"
- Operacional: "Implementar suíte básica de testes unitários e integração"

**Métricas:**
- Estratégica: "Definir KPIs de qualidade alinhados aos objetivos de negócio"
- Tática: "Implementar coleta automatizada de métricas"
- Operacional: "Criar dashboards de acompanhamento em tempo real"

**Documentações:**
- Estratégica: "Estabelecer política de documentação técnica"
- Tática: "Padronizar templates e ferramentas de documentação"
- Operacional: "Criar rotina de atualização e versionamento de docs"

**Modalidades de Testes:**
- Estratégica: "Ampliar cobertura de modalidades de teste"
- Tática: "Capacitar equipe em testes de performance e segurança"
- Operacional: "Implementar testes de acessibilidade e usabilidade"

**QAOps:**
- Estratégica: "Integrar QA ao ciclo DevOps completo"
- Tática: "Implementar observabilidade e monitoramento contínuo"
- Operacional: "Automatizar deploy e rollback baseado em métricas"

**Liderança:**
- Estratégica: "Estabelecer visão estratégica de qualidade organizacional"
- Tática: "Definir plano de carreira e desenvolvimento para QAs"
- Operacional: "Implementar rituais de feedback e melhoria contínua"

**Utilidade:**
- **Roadmap acionável** de melhoria
- **Priorização clara** por urgência
- **Comunicação** com diferentes níveis hierárquicos
- **Plano de ação** estruturado

---

### 6️⃣ **Compartilhamento (Sharing)**

**Objetivo:** Gerar e gerenciar links públicos para compartilhar resultados de forma profissional e segura.

**Conteúdo:**

#### 🔗 Gerenciador de Links Públicos
- **Criar novo link público** para a avaliação atual
- **Lista de links compartilhados** anteriormente
- **Status** de cada link (ativo, expirado)
- **Data de criação** e validade
- **Ações:** Copiar URL, Visualizar, Desativar

#### 🎨 Página Pública Profissional
Ao acessar o link público, visitantes veem:
- **Logo da empresa** (whitelabel)
- **Design clean e profissional**
- **Resumo executivo** da avaliação
- **Gráfico radar** dos 7 pilares
- **Cards de scores** por pilar
- **Sem necessidade de login**

#### 🔒 Segurança
- **ID único** não-adivinhável (SHA-256 hash)
- **Read-only** - Nenhuma edição possível
- **Controle de acesso** - Apenas quem tem o link acessa
- **Versionamento** - Links são imutáveis (snapshot do momento)

**Utilidade:**
- **Apresentações executivas** para stakeholders externos
- **Compartilhamento** com consultores ou parceiros
- **Documentação** de progresso ao longo do tempo
- **Transparência** com clientes e investidores

---

## 🧮 Fórmulas e Algoritmos

### Cálculo de Divergência (Análise de Alinhamento)

```javascript
// Para cada participante em cada pilar:
desvio = Math.abs(scoreParticipante - scoreMedioPilar)
percentualDesvio = (desvio / 5) * 100

// Classificação:
if (percentualDesvio < 10%) → 🟢 Alinhado
if (percentualDesvio < 25%) → 🟡 Divergência Moderada
if (percentualDesvio >= 25%) → 🔴 Divergência Alta
```

### Índice de Alinhamento

```javascript
// Para cada pilar:
desvioPadrao = calcularDesvioPadrao(scoresDosParticipantes)
indiceAlinhamento = 100 - (desvioPadrao / 5 * 100)

// Interpretação:
if (indiceAlinhamento >= 80%) → "Alto consenso"
if (indiceAlinhamento >= 60%) → "Consenso moderado"
if (indiceAlinhamento < 60%) → "Baixo consenso"
```

### Priorização de Recomendações

```javascript
// Pilares são ordenados por score (menor primeiro)
pilares.sort((a, b) => a.score - b.score)

// Pilares com score < 3.0 recebem badge de "Oportunidade de Melhoria"
// Recomendações são sempre em 3 níveis: Estratégico, Tático, Operacional
```

---

## 🎨 Design e UX

### Cores Dinâmicas
Todas as visualizações utilizam cores baseadas no nível de maturidade:
- Verde para Domínio
- Azul para Experiência
- Laranja para Consciência
- Vermelho para Inicialização
- Cinza para Agnóstico

### Responsividade
- Layouts adaptáveis para **desktop, tablet e mobile**
- Cards empilhados em telas menores
- Gráficos responsivos usando **Recharts**

### Interatividade
- **Tooltips** em todos os gráficos
- **Hover states** para revelar detalhes
- **Animações suaves** (motion/react)
- **Tabs navegáveis** para organizar conteúdo

---

## 📊 Tipos de Dados

### Estrutura de Dados de Entrada

```typescript
interface AssessmentResults {
  // Respostas das 91 perguntas
  process1: number;      // 0-5
  process2: number;
  // ... até process16
  
  auto1: number;         // 0-5
  // ... até auto16
  
  metric1: number;       // 0-5
  // ... até metric14
  
  doc1: number;          // 0-5
  // ... até doc11
  
  test1: number;         // 0-5
  // ... até test11
  test12: string[];      // Checkbox - array de strings
  
  qaops1: number;        // 0-5
  // ... até qaops10
  
  leader1: number;       // 0-5
  // ... até leader12
}
```

### Estrutura de Dados Processados

```typescript
interface DadosProcessados {
  empresa: string;
  participantes: number;
  dataAvaliacao: string;
  scoreGeral: number;                    // 0-5
  pilarMaisForte: { nome: string; score: number };
  pilarMaisFrago: { nome: string; score: number };
  scoresPorPilar: Array<{
    pilar: string;                       // Nome do pilar
    score: number;                       // 0-5
    categoria: string;                   // ID do pilar
  }>;
}
```

### Estrutura de Persona

```typescript
interface Persona {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  respostas: {
    [questionId: string]: number | string[];
  };
}
```

---

## 🔄 Fluxo de Dados

1. **Coleta:** Formulário captura 91 respostas
2. **Armazenamento:** Dados salvos no QualityScoreManager (Rodadas)
3. **Processamento:** Cálculo de scores por pilar e geral
4. **Classificação:** Atribuição de níveis de maturidade
5. **Visualização:** Renderização nas 6 abas de resultados
6. **Exportação:** Geração de links públicos e relatórios

---

## 🎯 Casos de Uso

### 1. **Avaliação Individual**
- 1 participante preenche o formulário
- Resultados mostram visão única
- Foco em ações de melhoria

### 2. **Avaliação de Equipe**
- Múltiplos participantes preenchem
- Radar mostra sobreposição de visões
- Análise de alinhamento detecta divergências

### 3. **Comparação Temporal**
- Rodadas múltiplas ao longo do tempo
- Seletor permite comparar períodos
- Identificação de evolução ou regressão

### 4. **Apresentação Executiva**
- Uso da aba Overview para resumo
- Link público para compartilhamento
- Design profissional e whitelabel

---

## 📈 Métricas e KPIs Gerados

### Métricas Principais
- ✅ **Score Geral** (0-5)
- ✅ **Score por Pilar** (0-5 para cada um dos 7)
- ✅ **Nível de Maturidade** (Agnóstico → Domínio)

### Métricas de Alinhamento
- ✅ **Índice de Alinhamento** por pilar (%)
- ✅ **Desvio Padrão** das avaliações
- ✅ **Amplitude** (diferença entre maior e menor)

### Métricas de Priorização
- ✅ **Pilares críticos** (score < 2.0)
- ✅ **Oportunidades de melhoria** (score < 3.0)
- ✅ **Pontos fortes** (score >= 4.0)

---

## 🚀 Melhorias Futuras

### Planejadas
- [ ] Exportação PDF dos resultados
- [ ] Comparação lado a lado de múltiplas rodadas
- [ ] Benchmarking com outras empresas (anonimizado)
- [ ] IA para gerar recomendações personalizadas
- [ ] Gráficos de evolução temporal automáticos

### Em Consideração
- [ ] Integração com ferramentas de gestão (Jira, Asana)
- [ ] Notificações de mudanças significativas
- [ ] Templates de plano de ação exportáveis
- [ ] API pública para integração

---

## 📞 Suporte

Para dúvidas sobre os resultados ou interpretação dos dados, consulte:
- **README_FORMULARIO.md** - Estrutura das perguntas
- **MaturityLevels.ts** - Lógica de classificação
- **Resultados.tsx** - Implementação completa

**Versão:** 3.0  
**Última atualização:** Outubro 2025
