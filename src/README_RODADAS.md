# 🔄 Rodadas - Sistema de Versionamento e Evolução QualityScore

## 🎯 O que são Rodadas?

**Rodadas** são ciclos de avaliação QualityScore que permitem capturar a maturidade em qualidade de software de uma equipe ou empresa em um momento específico do tempo. Cada rodada é uma **fotografia imutável** do estado da qualidade, permitindo comparações temporais e acompanhamento de evolução.

### 📸 Conceito de Snapshot Imutável

Uma vez que uma rodada é **encerrada**, seus resultados se tornam **imutáveis** - como uma fotografia que nunca muda. Isso garante:
- ✅ **Rastreabilidade histórica** confiável
- ✅ **Comparações justas** entre períodos
- ✅ **Evidências objetivas** de evolução ou regressão
- ✅ **Auditabilidade** completa dos dados

---

## 📋 Estrutura de uma Rodada

Cada rodada possui os seguintes elementos:

### 🆔 Identificação
- **ID Único**: Identificador exclusivo da rodada (`rodada-001`)
- **Versão**: Nomenclatura versionada (`V2024.01.001`)
  - Formato: `VAAAA.MM.NNN` onde:
    - `AAAA` = Ano
    - `MM` = Mês
    - `NNN` = Número sequencial no mês

### 🏢 Contexto Organizacional
- **Nome da Empresa**: Empresa avaliada
- **ID da Empresa**: Identificador único da empresa
- **Criado por**: Usuário que iniciou a rodada
- **Papel do Criador**: Manager ou Líder

### 📅 Temporalidade
- **Data de Criação**: Quando a rodada foi criada
- **Prazo (Due Date)**: Data limite para conclusão
- **Data de Encerramento**: Quando foi finalizada (se aplicável)

### 👥 Participantes
Cada rodada contém uma lista de participantes com:
- Nome e email
- Cargo/função
- Status individual:
  - 🔴 **Pendente**: Não iniciou a avaliação
  - 🟡 **Respondendo**: Avaliação em andamento
  - 🟢 **Concluído**: Finalizou todas as 91 perguntas
  - 🔴 **Atrasado**: Não finalizou dentro do prazo
- Progresso (0-100%)
- Data de conclusão (se aplicável)
- Última atividade
- Permissão para visualizar resultados

### 📊 Métricas de Progresso
- **Total de Participantes**: Quantas pessoas foram convidadas
- **Respostas Completas**: Quantos finalizaram
- **Respostas em Progresso**: Quantos estão respondendo
- **Respostas Pendentes**: Quantos não iniciaram
- **Progresso Geral**: Percentual consolidado (0-100%)

### ⚙️ Configurações
- **Status da Rodada**:
  - 📝 **Rascunho**: Em preparação, ainda não enviada
  - ▶️ **Ativa**: Em andamento, participantes respondendo
  - ⏹️ **Encerrada**: Finalizada, resultados gerados
- **Critério de Encerramento**:
  - 🤖 **Automático**: Encerra quando todos respondem ou prazo expira
  - 👤 **Manual**: Líder/Manager decide quando encerrar
- **Resultados Parciais**: Permitir visualização antes de 100% de conclusão

### 📈 Resultados
- **Resultado Gerado**: Se já foi processado
- **ID do Resultado**: Link para os dados consolidados
- **QualityScore**: Dados importados e processados

---

## 🔄 Ciclo de Vida de uma Rodada

```
┌─────────────┐
│  RASCUNHO   │ ← Criação inicial
└──────┬──────┘
       │ Configurar participantes e prazo
       ↓
┌─────────────┐
│    ATIVA    │ ← Enviar convites
└──────┬──────┘
       │ Participantes respondem
       │ Acompanhar progresso
       ↓
┌─────────────┐
│  ENCERRADA  │ ← Resultados gerados
└─────────────┘
       ↓
   📊 Análise e Comparação
```

### 1️⃣ **Fase de Rascunho**

**Ações Disponíveis:**
- ✏️ Adicionar/remover participantes
- 📅 Definir prazo de conclusão
- ⚙️ Configurar critério de encerramento
- 🔍 Revisar configurações
- 🚀 Ativar e enviar convites

**Quem pode criar:**
- System Managers (podem criar para qualquer empresa)
- Líderes da Empresa (podem criar para sua empresa)

**Características:**
- Não é visível para participantes
- Pode ser editada livremente
- Não gera notificações

---

### 2️⃣ **Fase Ativa**

**Ações Disponíveis:**
- 📧 Enviar lembretes para pendentes
- 👀 Acompanhar progresso em tempo real
- 📊 Visualizar resultados parciais (se permitido)
- ⏸️ Encerrar manualmente (se critério manual)
- 📨 Reenviar convites

**Status dos Participantes:**

#### 🔴 **Pendente** (0%)
- Recebeu convite mas não iniciou
- Ações sugeridas:
  - Enviar lembrete
  - Verificar se recebeu o email
  - Contato direto do líder

#### 🟡 **Respondendo** (1-99%)
- Iniciou mas não concluiu
- Mostra progresso parcial
- Ações sugeridas:
  - Enviar lembrete se próximo ao prazo
  - Verificar se há dificuldades

#### 🟢 **Concluído** (100%)
- Respondeu todas as 91 perguntas
- Data de conclusão registrada
- Pode acessar resultados (se tiver permissão)

#### 🔴 **Atrasado**
- Passou do prazo sem concluir
- Pode ainda concluir (se rodada ativa)
- Ações sugeridas:
  - Contato urgente
  - Extensão de prazo
  - Considerar remoção se não responder

**Encerramento Automático:**
- ✅ 100% de conclusão OU
- ⏰ Prazo expirado

**Encerramento Manual:**
- 👤 Líder/Manager decide o momento
- Útil para:
  - Gerar resultados parciais
  - Lidar com ausências justificadas
  - Flexibilidade de gestão

---

### 3️⃣ **Fase Encerrada**

**Características:**
- 🔒 **Dados imutáveis** - Nada pode ser alterado
- 📊 **Resultados consolidados** gerados
- 📈 **QualityScore disponível** para análise
- 🔗 **Link público** pode ser criado
- 📄 **Relatórios** podem ser exportados

**O que NÃO pode ser feito:**
- ❌ Adicionar/remover participantes
- ❌ Alterar respostas
- ❌ Modificar prazos
- ❌ Deletar a rodada
- ❌ Reabrir para edição

**Ações Disponíveis:**
- 👀 Visualizar resultados completos
- 📊 Comparar com rodadas anteriores
- 🔗 Gerar links públicos de compartilhamento
- 📥 Exportar relatórios
- 📁 Arquivar (oculta da visualização principal)

---

## 📊 Tela de Gerenciamento de Rodadas

A interface de Rodadas possui **3 abas principais**:

### 1️⃣ **Aba "Rodadas"**

**Objetivo:** Gerenciar rodadas ativas e criar novas.

**Conteúdo:**

#### 📋 Lista de Rodadas Ativas
Cards exibindo:
- **Versão e Status** (badge colorido)
- **Data de criação e prazo**
- **Progresso geral** com barra visual
- **Contador de participantes** por status
- **Ações rápidas:**
  - 👀 Visualizar detalhes
  - 📧 Enviar lembretes
  - ⏹️ Encerrar rodada (se manual)
  - ⚙️ Configurações

#### ➕ Botão "Nova Rodada"
Abre diálogo para:
1. Nomear a rodada
2. Definir prazo
3. Selecionar critério de encerramento
4. Adicionar participantes
5. Configurar permissões

**Fluxo de Criação:**
```
Clicar "Nova Rodada"
    ↓
Configurar dados básicos
    ↓
Adicionar participantes (emails)
    ↓
Definir permissões de visualização
    ↓
Revisar e Salvar como Rascunho
    ↓
[Opcional] Ativar e Enviar Convites
```

---

### 2️⃣ **Aba "Histórico"**

**Objetivo:** Visualizar rodadas encerradas e arquivadas.

**Conteúdo:**

#### 📜 Lista Cronológica
Rodadas organizadas da mais recente para a mais antiga:
- **Nome da versão**
- **Período** (data início - data fim)
- **Participantes** que concluíram
- **Score geral** alcançado
- **Badge de status** (Encerrada/Arquivada)

#### 🔍 Filtros e Busca
- Por período (último trimestre, semestre, ano)
- Por status (encerrada, arquivada)
- Por score (faixa de maturidade)
- Busca por nome da versão

#### 📊 Ações Disponíveis
- 👀 **Ver Resultados**: Abre página de análise completa
- 📈 **Comparar**: Seleciona para comparação com outra rodada
- 🔗 **Compartilhar**: Gera link público
- 📁 **Arquivar/Desarquivar**: Organiza visualização

---

### 3️⃣ **Aba "Comparação"**

**Objetivo:** Analisar evolução entre duas ou mais rodadas.

**Conteúdo:**

#### 🔄 Seletor de Rodadas
- Escolher 2 ou mais rodadas para comparar
- Filtros: Por período, por participantes comuns

#### 📊 Visualizações Comparativas

**1. Gráfico de Evolução por Pilar**
- Linha temporal mostrando cada pilar
- Cores diferentes para cada rodada
- Destaque para melhorias e regressões

**2. Tabela de Deltas**
```
Pilar                    | Rodada 1 | Rodada 2 | Delta | Tendência
──────────────────────────────────────────────────────────────────
Processos e Estratégia   |   3.5    |   4.1    | +0.6  |    ↗️
Testes Automatizados     |   1.8    |   2.9    | +1.1  |    ↗️
Métricas                 |   2.9    |   2.7    | -0.2  |    ↘️
```

**3. Heatmap de Evolução**
- Verde: Melhorou
- Amarelo: Manteve
- Vermelho: Regrediu

**4. Insights Automáticos**
- "✨ Maior evolução: Testes Automatizados (+1.1 pontos)"
- "⚠️ Atenção: Métricas apresentou queda"
- "🎯 Objetivo alcançado: Score geral acima de 3.0"

#### 📈 Métricas de Evolução
- **Taxa de melhoria geral** (%)
- **Pilares que evoluíram** vs **pilares que regrediram**
- **Velocidade de maturação** (pontos por trimestre)
- **Projeção** para próxima rodada

---

## 👥 Controle de Acesso e Permissões

### 🔐 Quem pode criar rodadas?

#### **System Manager** 🔑
- Criar rodadas para **qualquer empresa**
- Gerenciar todas as rodadas do sistema
- Acessar dados consolidados globais
- Arquivar ou deletar rodadas

#### **Líder da Empresa** 👨‍💼
- Criar rodadas para **sua empresa**
- Gerenciar rodadas que criou
- Ver resultados de sua empresa
- Convidar participantes da empresa

#### **Membro** 👤
- **Não pode** criar rodadas
- Pode responder rodadas das quais participa
- Visualiza resultados conforme permissão

---

### 👀 Quem pode ver resultados?

**Definido por rodada, para cada participante:**

#### ✅ **Com Permissão**
- Acessa aba Resultados completa
- Vê todas as análises e gráficos
- Pode gerar links públicos
- Compara com rodadas anteriores

#### ❌ **Sem Permissão**
- Vê apenas seu próprio progresso
- Recebe notificação quando resultados são gerados
- Pode solicitar acesso ao líder

**Casos de Uso:**
- QA Lead: ✅ Sempre tem permissão
- QA Seniores: ✅ Geralmente tem permissão
- QA Júnior: ❌ Pode ou não ter (decisão do líder)
- Outras áreas (Dev, PO): ❌ Geralmente não têm (focam em responder)

---

## 📧 Notificações e Comunicação

### Emails Automáticos

#### 📬 **Convite Inicial**
Enviado quando rodada é ativada:
```
Assunto: 🎯 Você foi convidado para a Avaliação QualityScore - V2024.01.001

Olá [Nome],

Você foi convidado(a) para participar da rodada de avaliação de 
maturidade em qualidade de software da [Empresa].

Prazo: [Data]
Tempo estimado: 30-40 minutos
Total de perguntas: 91 (organizadas em 7 pilares)

[Botão: Iniciar Avaliação]

Sua participação é fundamental para mapearmos nossa evolução!
```

#### 🔔 **Lembrete de Pendência**
Enviado próximo ao prazo:
```
Assunto: ⏰ Lembrete: Avaliação QualityScore expira em 3 dias

Olá [Nome],

Você ainda não concluiu a avaliação QualityScore V2024.01.001.

Seu progresso atual: 45% (41/91 perguntas)
Prazo final: [Data]

[Botão: Continuar Avaliação]

Precisamos da sua visão para um diagnóstico completo!
```

#### ✅ **Confirmação de Conclusão**
Enviado ao finalizar:
```
Assunto: ✅ Avaliação QualityScore Concluída!

Olá [Nome],

Sua avaliação foi concluída com sucesso!

Data de conclusão: [Data e Hora]
Total respondido: 91/91 perguntas

Os resultados consolidados serão compartilhados quando a rodada 
for encerrada.

Obrigado pela sua participação! 🎉
```

#### 📊 **Resultados Disponíveis**
Enviado quando rodada é encerrada:
```
Assunto: 📊 Resultados da Avaliação QualityScore - V2024.01.001

Olá [Nome],

A rodada de avaliação V2024.01.001 foi encerrada e os resultados 
estão disponíveis!

Score Geral: 3.4 / 5.0 (Nível: Experiência)
Participantes: 8/8 concluídos (100%)

[Botão: Ver Resultados Completos]

Parabéns pela participação!
```

---

## 🎯 Melhores Práticas

### ✅ Planejamento de Rodadas

#### **Frequência Recomendada**
- **Trimestral**: Equipes em transformação ativa
- **Semestral**: Equipes maduras com evolução gradual
- **Anual**: Revisão estratégica e planejamento

#### **Prazo Adequado**
- **Mínimo**: 1 semana (permite organização)
- **Ideal**: 2-3 semanas (evita pressão)
- **Máximo**: 1 mês (evita procrastinação)

#### **Número de Participantes**
- **Pequena equipe**: 3-5 pessoas (todos os QAs)
- **Equipe média**: 6-12 pessoas (QA + Tech Leads)
- **Organização**: 15-30 pessoas (múltiplas equipes)

---

### ✅ Engajamento dos Participantes

#### **Comunicação Clara**
- Explicar o **propósito** da avaliação
- Destacar **confidencialidade** (sem exposição individual)
- Enfatizar **melhoria contínua**, não culpa
- Mostrar **resultados de rodadas anteriores** (se aplicável)

#### **Momento Adequado**
- ❌ Evitar: Fim de ano, férias, lançamentos críticos
- ✅ Preferir: Início de trimestre, pós-retrospectivas
- ✅ Sincronizar: Com planejamento estratégico

#### **Incentivos**
- 🎁 Reconhecimento público de participação
- 📊 Acesso prioritário aos resultados
- 🎯 Inclusão no planejamento de melhorias
- 🏆 Gamificação (badges, conquistas)

---

### ✅ Análise de Resultados

#### **Reunião de Apresentação**
1. **Contexto**: Relembrar objetivo da rodada
2. **Números**: Apresentar score geral e por pilar
3. **Destaques**: Pontos fortes e oportunidades
4. **Comparação**: Evolução desde última rodada
5. **Ações**: Plano de melhoria baseado em dados
6. **Próximos Passos**: Data da próxima rodada

#### **Evitar Armadilhas**
- ❌ Comparar pessoas individualmente (foco é equipe)
- ❌ Culpar por scores baixos (é diagnóstico, não julgamento)
- ❌ Ignorar resultados (precisa gerar ações)
- ❌ Esperar perfeição (maturidade é jornada)

---

## 📈 Casos de Uso Reais

### 🏢 **Caso 1: TechCorp Brasil - Transformação Ágil**

**Contexto:**
- Empresa de tecnologia, 50 pessoas, 3 squads
- Iniciando transformação de qualidade
- Objetivo: Mapear estado atual e planejar evolução

**Rodadas:**
- **V2024.01**: Baseline inicial
  - Score: 2.4 (Consciência)
  - Pilar mais fraco: Testes Automatizados (1.8)
  - 8 participantes (QA + Tech Leads)
  
- **V2024.Q2**: Pós-implementação de CI/CD
  - Score: 3.1 (Experiência)
  - Evolução: +0.7 pontos
  - Destaque: Automação subiu para 2.9 (+1.1)
  
- **V2024.Q3**: Consolidação
  - Score: 3.5 (Experiência)
  - Evolução: +0.4 pontos
  - Objetivo de 3.0 superado! 🎉

**Aprendizados:**
- Rodadas trimestrais mantiveram foco
- Comparações motivaram a equipe
- Dados embasaram investimentos em ferramentas

---

### 🚀 **Caso 2: StartupXYZ - Crescimento Rápido**

**Contexto:**
- Startup em crescimento, 15 pessoas
- Contratações rápidas, processos informais
- Objetivo: Estruturar qualidade sem perder agilidade

**Rodadas:**
- **V2024.01**: Diagnóstico inicial
  - Score: 1.9 (Inicialização)
  - Foco: Documentar o que existe
  - 4 participantes (fundadores + QA único)
  
- **V2024.06**: Pós-contratação de equipe QA
  - Score: 2.8 (Consciência)
  - 12 participantes (nova equipe)
  - Pilar Liderança melhorou significativamente

**Aprendizados:**
- Rodadas espaçadas (semestrais) adequadas
- Comparação mostrou impacto das contratações
- Participantes novos trouxeram nova perspectiva

---

## 🔮 Futuro das Rodadas

### Melhorias Planejadas

- [ ] **Templates de Rodadas**: Salvar configurações padrão
- [ ] **Agendamento Recorrente**: Criar rodadas automaticamente
- [ ] **Metas por Rodada**: Definir objetivos específicos
- [ ] **Comparação Multi-Rodada**: Gráfico de evolução temporal
- [ ] **Benchmarking Anônimo**: Comparar com outras empresas do setor
- [ ] **IA para Recomendações**: Sugestões personalizadas de melhorias
- [ ] **Integração com Jira/Azure**: Criar ações de melhoria automaticamente
- [ ] **Dashboards Executivos**: Visões customizadas por stakeholder

---

## 💡 Resumo Executivo

### O que são Rodadas?
Ciclos de avaliação QualityScore que capturam maturidade em qualidade em um momento específico.

### Por que usar?
- 📊 **Diagnosticar** estado atual objetivamente
- 📈 **Acompanhar** evolução ao longo do tempo
- 🎯 **Planejar** melhorias baseadas em dados
- 🏆 **Motivar** equipe com progresso visível
- 📑 **Documentar** jornada de maturação

### Como funciona?
1. Líder/Manager cria rodada
2. Adiciona participantes e define prazo
3. Ativa e envia convites
4. Participantes respondem 91 perguntas
5. Sistema gera resultados consolidados
6. Rodada encerrada vira snapshot imutável
7. Comparações mostram evolução

### Frequência ideal?
- 🏃 **Trimestral**: Transformação ativa
- 🚶 **Semestral**: Melhoria gradual  
- 🧘 **Anual**: Revisão estratégica

---

## 📞 Suporte

Para dúvidas sobre Rodadas:
- **README_FORMULARIO.md** - Estrutura das perguntas
- **README_RESULTADOS.md** - Como interpretar resultados
- **QualityScoreManager.tsx** - Código de gerenciamento

**Versão:** 3.0  
**Última atualização:** Outubro 2025
