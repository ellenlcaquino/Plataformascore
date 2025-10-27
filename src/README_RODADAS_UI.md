# 🎨 Rodadas - Interface e Detalhamento Visual

## 📐 Visão Geral da Interface

A tela de **Rodadas** (`/components/Rodadas.tsx`) é o centro de gerenciamento de ciclos de avaliação QualityScore. Este documento detalha **todos os elementos visuais**, interações, cores, espaçamentos e componentes da interface.

---

## 🏗️ Estrutura de Layout

### Hierarquia Visual

```
QualityScoreLayout (Container Principal)
  └── Background: bg-gray-50
      └── Container: max-w-7xl mx-auto p-6
          ├── Header Section
          ├── Filters & Search Card
          ├── Tabs (Ativas/Encerradas)
          │   ├── Tab Content: Rodadas Ativas
          │   └── Tab Content: Rodadas Encerradas
          └── Modals (Detalhes, Nova Rodada, Convite)
```

---

## 🎯 Componentes da Interface

### 1. **Header Section**

#### Layout
```tsx
<div className="flex items-center justify-between">
  <div> {/* Título e descrição */} </div>
  <div> {/* Ações */} </div>
</div>
```

#### Elementos Visuais

**Lado Esquerdo:**
- **Título**: `text-2xl font-semibold text-gray-900`
  - Texto: "Rodadas de Avaliação"
- **Subtítulo**: `text-gray-600 mt-1`
  - Texto: "Gerencie rodadas de QualityScore e acompanhe o progresso das equipes"

**Lado Direito:**
- **Botão "Nova Rodada"**
  - Componente: `<Button>`
  - Cor: Azul primário
  - Ícone: `<Plus />` (Lucide)
  - Texto: "Nova Rodada"
  - Ação: Abre modal de criação

#### Espaçamento
- Container: `space-y-6` (24px entre seções)
- Margem inferior: `mb-6`

---

### 2. **Barra de Busca e Filtros**

#### Estrutura Visual

```tsx
<Card className="p-4">
  <div className="flex items-center gap-4">
    {/* Campo de busca */}
    {/* Filtros adicionais (futuro) */}
  </div>
</Card>
```

#### Campo de Busca

**Design:**
- Container: `flex-1` (ocupa espaço disponível)
- Posicionamento relativo para ícone
- Background: Branco (Card)
- Border: Cinza claro

**Ícone de Busca:**
- Componente: `<Search />` (Lucide)
- Tamanho: `h-4 w-4`
- Cor: `text-gray-400`
- Posição: `absolute left-3 top-1/2 -translate-y-1/2`

**Input:**
- Componente: `<Input />`
- Placeholder: "Buscar por empresa ou versão..."
- Padding esquerdo: `pl-10` (para acomodar ícone)
- Texto: `text-gray-900`

#### Comportamento
- Busca em tempo real (sem delay)
- Filtra por: nome da empresa, versão da rodada
- Case-insensitive

---

### 3. **Sistema de Tabs**

#### Componentes

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="ativas">
      Rodadas Ativas ({count})
    </TabsTrigger>
    <TabsTrigger value="encerradas">
      Encerradas ({count})
    </TabsTrigger>
  </TabsList>
  {/* Tab Contents */}
</Tabs>
```

#### Design das Tabs

**Tab List:**
- Background: Cinza claro
- Border radius: Arredondado
- Sombra sutil

**Tab Trigger (Inativa):**
- Cor do texto: `text-gray-600`
- Background: Transparente
- Hover: `hover:text-gray-800`

**Tab Trigger (Ativa):**
- Cor do texto: `text-gray-900`
- Background: Branco
- Sombra: Elevação sutil
- Font weight: `font-medium`

**Contador:**
- Texto: Número de rodadas na categoria
- Cor: Mesma do título
- Formato: `(8)` entre parênteses

---

### 4. **Cards de Rodada** (RodadaCard)

#### Estrutura Visual Completa

```
┌─────────────────────────────────────────────────────────────┐
│ [Empresa]  [Badge Status]  [Badge Versão]      [Botões]    │
│ Criada em DD/MM/AAAA • Prazo: DD/MM/AAAA                    │
│ Critério: Encerramento automático                           │
│                                                              │
│ ┌─────┬─────┬─────┬─────┬─────┐                           │
│ │  8  │  3  │  2  │  2  │  1  │  <- Estatísticas          │
│ │Total│Concl│Prog │Pend │Acess│                            │
│ └─────┴─────┴─────┴─────┴─────┘                           │
│                                                              │
│ Progresso Geral                             52%             │
│ [████████████████░░░░░░░░░░░░] <- Barra                   │
└─────────────────────────────────────────────────────────────┘
```

#### Elementos Detalhados

**Container Card:**
- Componente: `<Card />`
- Padding: `p-6`
- Hover: `hover:shadow-md transition-shadow`
- Border: `border-gray-200`
- Background: Branco

---

#### Header do Card

**Nome da Empresa:**
- Font: `font-semibold text-gray-900`
- Tamanho: Padrão

**Badge de Status:**
- Componente: `<Badge />`
- Cores por status:
  - 🔵 **Ativa**: `bg-blue-100 text-blue-800`
  - 🟢 **Encerrada**: `bg-green-100 text-green-800`
  - ⚫ **Rascunho**: `bg-gray-100 text-gray-800`
- Border radius: Arredondado
- Padding: `px-2 py-1`
- Font size: `text-xs`

**Badge de Versão:**
- Componente: `<Badge variant="outline" />`
- Texto: Ex: `V2024.01.001`
- Cor: Cinza com borda
- Font: Monospace feel

**Metadados:**
- Font size: `text-sm`
- Cor: `text-gray-600`
- Formato: "Criada em DD/MM/AAAA • Prazo: DD/MM/AAAA"
- Separador: Bullet point (•)

**Critério de Encerramento:**
- Font size: `text-xs`
- Cor: `text-gray-500`
- Formato: "Critério: [Automático/Manual]"

---

#### Botões de Ação

**Posicionamento:**
- Alinhamento: Direita superior
- Display: `flex items-center gap-2`

**Botão "Gerar Resultado"** (Condicional):
- Visível quando:
  - Status = Ativa
  - Critério = Manual OU 100% de conclusão
- Componente: `<Button size="sm" />`
- Ícone: `<BarChart3 />` (Lucide)
- Texto: "Gerar Resultado"
- Cor: Azul primário

**Botão "Encerrar"** (Condicional):
- Visível quando: Status = Ativa
- Componente: `<Button variant="outline" size="sm" />`
- Ícone: `<Square />` (Lucide)
- Texto: "Encerrar"
- Cor: Cinza com borda

**Botão "Ver Resultados"** (Condicional):
- Visível quando: Resultado gerado = true
- Componente: `<Button variant="outline" size="sm" />`
- Ícone: `<BarChart3 />` (Lucide)
- Texto: "Ver Resultados"
- Cor: Cinza com borda

**Botão de Menu (Mais Opções):**
- Componente: `<Button variant="ghost" size="sm" />`
- Ícone: `<MoreHorizontal />` (Lucide)
- Cor: Cinza transparente
- Ação: Abre modal de detalhes

---

#### Estatísticas (Grid 5 Colunas)

**Layout:**
```tsx
<div className="grid grid-cols-5 gap-4 mb-4">
```

**Cada Coluna (Estatística):**
- Alinhamento: `text-center`
- Padding: Automático pelo grid

**Estrutura Individual:**
```
┌─────────────┐
│     8       │ <- Número (font-semibold text-xl)
│   Total     │ <- Label (text-xs text-gray-600)
└─────────────┘
```

**Cores dos Números:**
1. **Total**: `text-gray-900`
2. **Concluídas**: `text-green-600`
3. **Em Progresso**: `text-blue-600`
4. **Pendentes**: `text-gray-600`
5. **Com Acesso**: `text-purple-600`

**Quinta Estatística (Com Acesso):**
- Ícone adicional: `<Eye className="h-3 w-3" />`
- Display: `flex items-center justify-center gap-1`

---

#### Barra de Progresso Geral

**Container:**
```tsx
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Progresso Geral
    </span>
    <span className="text-sm text-gray-600">52%</span>
  </div>
  <Progress value={52} className="h-2" />
</div>
```

**Progress Bar:**
- Componente: `<Progress />` (ShadCN)
- Altura: `h-2` (8px)
- Cor de preenchimento: Azul primário
- Background: Cinza claro
- Border radius: Arredondado
- Transição: Suave

---

### 5. **Modal de Detalhes da Rodada** (RodadaDetailsModal)

#### Estrutura Visual Completa

```
┌───────────────────────────────────────────────────────────────┐
│ [HEADER]                                                       │
│ Empresa • Versão • X participantes               [X] Fechar   │
│ Criada em DD/MM • Prazo: DD/MM                                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ [4 CARDS DE ESTATÍSTICAS]                                     │
│                                                                │
│ [BARRA DE PROGRESSO GERAL]                                    │
│                                                                │
│ [BUSCA E FILTROS]                                             │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ Membros da Rodada (8)      [👁️ Permitir] [👁️ Restringir] │  │
│ ├─────────────────────────────────────────────────────────┤  │
│ │ [Avatar] Nome                [Status] [Progress] [Switch]│  │
│ │          email@empresa.com.br                             │  │
│ │          Cargo                                            │  │
│ ├─────────────────────────────────────────────────────────┤  │
│ │ ... mais participantes ...                                │  │
│ └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

#### Design Detalhado

**Container Principal:**
- Posição: `fixed inset-0`
- Background overlay: `bg-black/50` (50% transparência)
- Z-index: `z-50`
- Centralização: `flex items-center justify-center`
- Padding: `p-4`

**Card do Modal:**
- Background: Branco
- Border radius: `rounded-lg`
- Largura: `max-w-6xl w-full`
- Altura máxima: `max-h-[90vh]`
- Overflow: `overflow-hidden`

---

#### Header do Modal

**Container:**
- Padding: `p-6`
- Border inferior: `border-b border-gray-200`

**Layout:**
```tsx
<div className="flex items-center justify-between">
```

**Lado Esquerdo:**
- **Título**: Nome da empresa (`text-xl font-semibold text-gray-900`)
- **Subtítulo**: Versão • Participantes (`text-gray-600`)
- **Info adicional**: Datas (`text-sm text-gray-500 mt-1`)

**Lado Direito:**
- **Botão "Convidar Membro"** (se ativa)
  - Variant: `outline`
  - Ícone: `<Plus />`
  - Texto: "Convidar Membro"
- **Botão Fechar**
  - Variant: `ghost`
  - Texto: "×"
  - Tamanho: Grande

---

#### Área de Conteúdo (Scrollable)

**Container:**
- Padding: `p-6`
- Overflow: `overflow-y-auto`
- Altura máxima: `max-h-[calc(90vh-120px)]`
- Espaçamento: `space-y-6` (24px entre elementos)

---

#### Cards de Estatísticas (4 colunas)

**Grid Layout:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
```

**Estrutura de Cada Card:**
```
┌─────────────────────────────┐
│ [Ícone colorido]  Label     │
│                   Número    │
└─────────────────────────────┘
```

**Card 1: Total de Membros**
- Ícone: `<Users />` em `bg-blue-100 text-blue-600`
- Label: "Total de Membros" (`text-sm text-gray-600`)
- Valor: Número (`text-xl font-semibold`)

**Card 2: Respostas Completas**
- Ícone: `<CheckCircle />` em `bg-green-100 text-green-600`
- Label: "Respostas Completas"
- Valor: Número

**Card 3: Em Progresso**
- Ícone: `<Clock />` em `bg-yellow-100 text-yellow-600`
- Label: "Em Progresso"
- Valor: Número

**Card 4: Pendentes/Atrasados**
- Ícone: `<AlertCircle />` em `bg-red-100 text-red-600`
- Label: "Pendentes/Atrasados"
- Valor: Número (soma pendentes + atrasados)

**Design do Ícone:**
- Container: `p-2 rounded-lg`
- Tamanho do ícone: `h-5 w-5`
- Border radius: Arredondado

---

#### Barra de Progresso Geral (no Modal)

**Componente:**
```tsx
<Card className="p-4">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Progresso Geral da Rodada
    </span>
    <span className="text-sm text-gray-600">52%</span>
  </div>
  <Progress value={52} className="h-3" />
</Card>
```

**Diferenças vs Card de Rodada:**
- Altura da barra: `h-3` (12px, mais grossa)
- Dentro de um Card branco
- Label mais descritivo

---

#### Busca e Filtros de Participantes

**Layout:**
```tsx
<Card className="p-4">
  <div className="flex items-center gap-4">
    {/* Campo de busca */}
    {/* Select de filtro por status */}
  </div>
</Card>
```

**Campo de Busca:**
- Similar ao da tela principal
- Placeholder: "Buscar por nome ou email..."
- Ícone: `<Search />`
- Flex: `flex-1`

**Select de Status:**
- Componente: `<Select />`
- Largura: `w-48`
- Trigger text: "Filtrar por status"
- Opções:
  - Todos os Status
  - Concluído
  - Respondendo
  - Pendente
  - Atrasado

---

#### Lista de Participantes

**Container Principal:**
```tsx
<Card className="overflow-hidden">
  <div className="px-6 py-4 border-b"> {/* Header */} </div>
  <div className="divide-y divide-gray-200"> {/* Lista */} </div>
</Card>
```

**Header da Lista:**

**Lado Esquerdo:**
- Título: "Membros da Rodada (8)" (`text-lg font-medium`)
- Subtítulo: "Gerencie quem pode visualizar..." (`text-sm text-gray-600`)

**Lado Direito:**
- **Contador de Acesso**:
  - Texto: "X com acesso aos resultados" (destaque verde)
  - Subtexto: "de Y participantes" (cinza menor)
- **Botões de Ação em Massa**:
  - 👁️ **Permitir Todos**: `variant="outline" size="sm"`
  - 🚫 **Restringir Todos**: `variant="outline" size="sm"`
  - Tooltips explicativos em hover

---

#### Card de Participante Individual

**Estrutura Visual Completa:**

```
┌─────────────────────────────────────────────────────────────┐
│ [Avatar] Nome Completo        [Status] [Progress] [Switch]  │
│   AS     email@empresa.com.br  Badge    ████░░     On/Off   │
│          Cargo/Função                    52%                 │
│                                                               │
│                                          [Última Atividade]  │
│                                          DD/MM/AAAA          │
│                                                               │
│                                          [Acesso Resultados] │
│                                          👁️ Permitido        │
│                                          [📧 Lembrete]       │
└─────────────────────────────────────────────────────────────┘
```

**Container:**
- Padding: `p-6`
- Hover: `hover:bg-gray-50 transition-colors`
- Animação: Motion (fade in + slide up)
- Border: Divider entre participantes

---

**Lado Esquerdo - Informações do Participante:**

**Avatar:**
- Componente: `<Avatar />` (ShadCN)
- Tamanho: `h-10 w-10`
- Fallback: Iniciais
- Background: `bg-blue-100`
- Texto: `text-blue-700 font-medium`

**Textos:**
- **Nome**: `font-medium text-gray-900`
- **Email**: `text-sm text-gray-600`
- **Cargo**: `text-xs text-gray-500 mt-1`

**Layout:**
```tsx
<div className="flex items-center gap-4">
  <Avatar />
  <div>
    <h4>Nome</h4>
    <p>Email</p>
    <p>Cargo</p>
  </div>
</div>
```

---

**Lado Direito - Status e Ações:**

**1. Badge de Status:**
- Layout: `flex items-center gap-2`
- Ícone: Dinâmico por status
- Badge: Cor dinâmica

**Status e Cores:**
- ✅ **Concluído**: 
  - Ícone: `<CheckCircle className="h-4 w-4 text-green-600" />`
  - Badge: `bg-green-100 text-green-800`
- 🔵 **Respondendo**:
  - Ícone: `<Clock className="h-4 w-4 text-blue-600" />`
  - Badge: `bg-blue-100 text-blue-800`
- ⏸️ **Pendente**:
  - Ícone: `<Clock className="h-4 w-4 text-gray-600" />`
  - Badge: `bg-gray-100 text-gray-800`
- 🔴 **Atrasado**:
  - Ícone: `<AlertCircle className="h-4 w-4 text-red-600" />`
  - Badge: `bg-red-100 text-red-800`

---

**2. Barra de Progresso Individual:**

**Container:**
- Largura fixa: `w-32`

**Estrutura:**
```tsx
<div className="w-32">
  <div className="flex items-center justify-between mb-1">
    <span className="text-xs text-gray-600">Progresso</span>
    <span className="text-xs text-gray-600">52%</span>
  </div>
  <Progress value={52} className="h-2" />
</div>
```

**Design:**
- Labels: `text-xs text-gray-600`
- Altura da barra: `h-2` (fina)
- Cor: Azul primário (padrão)

---

**3. Data de Atividade:**

**Container:**
- Alinhamento: `text-right`
- Largura mínima: `min-w-[120px]`

**Três Estados Possíveis:**

**Estado 1: Concluído** (se `completedDate` existe)
```
Concluído em     <- text-xs text-gray-500
DD/MM/AAAA       <- text-sm text-gray-900
```

**Estado 2: Em Atividade** (se `lastActivity` existe)
```
Última atividade <- text-xs text-gray-500
DD/MM/AAAA       <- text-sm text-gray-900
```

**Estado 3: Não Iniciado** (sem datas)
```
Não iniciado     <- text-xs text-gray-500
```

---

**4. Controle de Acesso aos Resultados:**

**Container:**
- Layout: `flex flex-col items-end gap-2`
- Largura mínima: `min-w-[160px]`

**Header do Controle:**
```tsx
<div className="flex items-center justify-end gap-2">
  <p className="text-xs text-gray-600 font-medium">
    Acesso aos Resultados
  </p>
  <Tooltip>
    <Settings className="h-3 w-3 text-gray-400" />
    <TooltipContent>
      Controle se este participante poderá visualizar...
    </TooltipContent>
  </Tooltip>
</div>
```

**Indicador de Status + Switch:**

**Layout:**
```tsx
<div className="flex items-center justify-end gap-2">
  <div className="flex items-center gap-1">
    {/* Ícone + Texto */}
  </div>
  <Switch checked={...} />
</div>
```

**Estado: Permitido**
- Ícone: `<Eye className="h-3 w-3 text-green-600" />`
- Texto: "Permitido" (`text-xs text-green-600 font-medium`)
- Switch: Ativado (azul)

**Estado: Restrito**
- Ícone: `<EyeOff className="h-3 w-3 text-gray-400" />`
- Texto: "Restrito" (`text-xs text-gray-500`)
- Switch: Desativado (cinza)

**Componente Switch:**
- Componente: `<Switch />` (ShadCN)
- Margem esquerda: `ml-2`
- Cor ativa: Azul primário
- Cor inativa: Cinza
- Transição: Suave

---

**5. Botão de Lembrete** (Condicional)

**Visibilidade:**
- Apenas se: `status !== 'concluido'` E `rodada.status === 'ativa'`

**Design:**
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-xs px-2 py-1 h-7"
    >
      <Mail className="h-3 w-3" />
      Lembrete
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Enviar lembrete por email para concluir a avaliação
  </TooltipContent>
</Tooltip>
```

**Especificações:**
- Variant: `outline` (borda cinza)
- Tamanho customizado: `h-7` (compacto)
- Padding: `px-2 py-1`
- Font size: `text-xs`
- Ícone: `<Mail />` (envelope)
- Tooltip explicativo em hover

---

### 6. **Modal de Nova Rodada** (NovaRodadaForm)

#### Estrutura

```
┌────────────────────────────────────┐
│ Criar Nova Rodada          [X]     │
├────────────────────────────────────┤
│                                    │
│ [Formulário de criação]            │
│                                    │
│ [Botões: Cancelar | Criar]         │
└────────────────────────────────────┘
```

**Container:**
- Componente: `<DialogContent />`
- Largura máxima: `max-w-md`
- Background: Branco
- Border radius: Arredondado

**Campos do Formulário:**
(Placeholder - implementação futura)
- Nome da rodada
- Empresa
- Data de prazo
- Critério de encerramento
- Lista de participantes

---

### 7. **Modal de Convite de Membro**

#### Design

**Container:**
- Posição: `fixed inset-0`
- Background: `bg-black/50`
- Z-index: `z-50`

**Card:**
- Background: Branco
- Padding: `p-6`
- Largura: `max-w-md`
- Border radius: `rounded-lg`

**Elementos:**
- Título: "Convidar Novo Membro" (`text-lg font-medium`)
- Campos:
  - Email do membro
  - Nome completo
  - Cargo/Função
- Botões:
  - Cancelar (outline)
  - Enviar Convite (primary)

**Espaçamento:**
- Campos: `space-y-4`
- Botões: `flex gap-3 mt-6`

---

### 8. **Estado Vazio** (Empty State)

#### Rodadas Ativas Vazias

```
┌────────────────────────────────────┐
│                                    │
│         [🎯 Ícone Grande]          │
│                                    │
│    Nenhuma rodada ativa            │
│    Crie uma nova rodada para       │
│    começar a coletar avaliações    │
│                                    │
│    [➕ Criar Primeira Rodada]      │
│                                    │
└────────────────────────────────────┘
```

**Design:**
- Container: `<Card className="p-8 text-center" />`
- Ícone: `<Target className="h-12 w-12 text-gray-400" />`
- Centralização: `mx-auto mb-4`
- Título: `text-lg font-medium text-gray-900`
- Descrição: `text-gray-600 mb-4`
- Botão: Primary com ícone `<Plus />`

#### Rodadas Encerradas Vazias

```
┌────────────────────────────────────┐
│                                    │
│         [📁 Ícone Grande]          │
│                                    │
│    Nenhuma rodada encerrada        │
│    Rodadas encerradas aparecerão   │
│    aqui para consulta histórica    │
│                                    │
└────────────────────────────────────┘
```

**Design:**
- Similar ao estado ativo
- Ícone: `<Archive />` (arquivo)
- Sem botão de ação

---

## 🎨 Sistema de Cores

### Paleta de Status

#### Status de Rodada

| Status | Background | Texto | Hex |
|--------|-----------|-------|-----|
| **Ativa** | `bg-blue-100` | `text-blue-800` | #1e40af / #dbeafe |
| **Encerrada** | `bg-green-100` | `text-green-800` | #166534 / #dcfce7 |
| **Rascunho** | `bg-gray-100` | `text-gray-800` | #1f2937 / #f3f4f6 |

#### Status de Participante

| Status | Ícone | Badge BG | Badge Texto |
|--------|-------|----------|-------------|
| **Concluído** | 🟢 Green | `bg-green-100` | `text-green-800` |
| **Respondendo** | 🔵 Blue | `bg-blue-100` | `text-blue-800` |
| **Pendente** | ⚫ Gray | `bg-gray-100` | `text-gray-800` |
| **Atrasado** | 🔴 Red | `bg-red-100` | `text-red-800` |

### Cores Funcionais

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Total** | `text-gray-900` | Número total de participantes |
| **Concluídas** | `text-green-600` | Respostas completas |
| **Em Progresso** | `text-blue-600` | Avaliações em andamento |
| **Pendentes** | `text-gray-600` | Não iniciadas |
| **Com Acesso** | `text-purple-600` | Permissão para ver resultados |

### Cores de Cards de Estatísticas

| Estatística | Background Icon | Icon Color |
|-------------|----------------|------------|
| **Total** | `bg-blue-100` | `text-blue-600` |
| **Completas** | `bg-green-100` | `text-green-600` |
| **Progresso** | `bg-yellow-100` | `text-yellow-600` |
| **Pendentes** | `bg-red-100` | `text-red-600` |

---

## 📏 Espaçamentos e Tamanhos

### Grid Systems

**Estatísticas no Card (5 colunas):**
```tsx
grid-cols-5 gap-4
```
- 5 colunas iguais
- Gap: 16px entre colunas

**Cards de Estatísticas no Modal (4 colunas):**
```tsx
grid-cols-1 md:grid-cols-4 gap-4
```
- Mobile: 1 coluna
- Desktop: 4 colunas
- Gap: 16px

### Padding e Margin

| Elemento | Padding/Margin | Valor em px |
|----------|---------------|-------------|
| Container principal | `p-6` | 24px |
| Cards | `p-6` | 24px |
| Card de filtros | `p-4` | 16px |
| Modal header | `p-6` | 24px |
| Item de participante | `p-6` | 24px |
| Espaçamento entre seções | `space-y-6` | 24px |
| Espaçamento em formulários | `space-y-4` | 16px |

### Font Sizes

| Elemento | Classe | Tamanho |
|----------|--------|---------|
| Título principal | `text-2xl` | 24px |
| Título de card | `text-lg` | 18px |
| Título de modal | `text-xl` | 20px |
| Texto normal | `text-base` | 14px (default) |
| Texto pequeno | `text-sm` | 12px |
| Texto extra pequeno | `text-xs` | 10px |
| Números grandes (estatísticas) | `text-xl` | 20px |

### Ícones

| Contexto | Tamanho | Classe |
|----------|---------|--------|
| **Ícones de ação** (botões) | 16px | `h-4 w-4` |
| **Ícones de status** | 16px | `h-4 w-4` |
| **Ícones em cards de estatísticas** | 20px | `h-5 w-5` |
| **Ícones de empty state** | 48px | `h-12 w-12` |
| **Ícones pequenos** (tooltips) | 12px | `h-3 w-3` |

---

## 🔄 Animações e Transições

### Cards de Rodada

```tsx
hover:shadow-md transition-shadow
```
- Propriedade animada: `box-shadow`
- Duração: Padrão (150ms)
- Easing: Ease-in-out

### Items de Participante

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```
- **Initial**: Invisível e 20px abaixo
- **Animate**: Visível e na posição
- **Efeito**: Fade in + Slide up
- **Duração**: Padrão Motion (spring)

### Hover States

**Cards:**
```tsx
hover:bg-gray-50 transition-colors
```

**Botões:**
- Componentes ShadCN já incluem transições
- Hover: Mudança sutil de background
- Active: Scale ligeiramente menor

---

## 📱 Responsividade

### Breakpoints

**Grid de Estatísticas (Modal):**
```tsx
grid-cols-1 md:grid-cols-4
```
- Mobile (< 768px): 1 coluna (empilhado)
- Tablet/Desktop (≥ 768px): 4 colunas (lado a lado)

**Modal Width:**
```tsx
max-w-6xl w-full
```
- Largura máxima: 1152px
- Mobile: 100% - padding (16px cada lado)

**Modal Height:**
```tsx
max-h-[90vh]
```
- 90% da altura da viewport
- Previne overflow em telas pequenas

### Mobile Considerations

**Cards de Rodada:**
- Empilham naturalmente em mobile
- Botões podem quebrar para linha inferior
- Grid de 5 colunas ajusta spacing automaticamente

**Lista de Participantes:**
- Scroll horizontal em mobile para ver todos os elementos
- Avatar e nome sempre visíveis
- Ações podem ser acessadas via scroll

---

## 🎯 Estados Interativos

### Botões

**Primary Button (Nova Rodada):**
- Default: Azul sólido
- Hover: Azul mais escuro
- Active: Azul ainda mais escuro + sombra menor
- Focus: Ring azul
- Disabled: Cinza opaco

**Outline Button:**
- Default: Borda cinza, fundo transparente
- Hover: Background cinza claro
- Active: Background cinza médio
- Focus: Ring azul

**Ghost Button:**
- Default: Transparente
- Hover: Background cinza muito claro
- Active: Background cinza claro
- Focus: Ring azul

### Switch (Acesso aos Resultados)

**Estado OFF (Restrito):**
- Background: `bg-gray-200`
- Toggle: Esquerda
- Cor do toggle: Branco
- Texto: "Restrito" (cinza)
- Ícone: `<EyeOff />` (cinza)

**Estado ON (Permitido):**
- Background: Azul primário
- Toggle: Direita
- Cor do toggle: Branco
- Texto: "Permitido" (verde)
- Ícone: `<Eye />` (verde)

**Transição:**
- Duração: 200ms
- Easing: Ease-in-out
- Animação: Slide horizontal do toggle

### Progress Bar

**Estados:**
- 0-25%: Vermelho (crítico)
- 26-50%: Laranja (atenção)
- 51-75%: Azul (progresso)
- 76-100%: Verde (completo)

**Implementação Atual:**
- Cor única: Azul primário
- Possibilidade de adicionar cores dinâmicas

---

## 🔐 Controles de Acesso Visual

### Badge de Permissão

**Com Acesso:**
- Ícone: 👁️ Verde
- Texto: "Permitido"
- Switch: Ativado

**Sem Acesso:**
- Ícone: 🚫 Cinza
- Texto: "Restrito"
- Switch: Desativado

### Botões de Ação em Massa

**Permitir Todos:**
- Ícone: `<Eye />`
- Texto: "Permitir Todos"
- Tooltip: "Permitir que todos os participantes vejam os resultados"

**Restringir Todos:**
- Ícone: `<EyeOff />`
- Texto: "Restringir Todos"
- Tooltip: "Restringir o acesso aos resultados para todos os participantes"

---

## 📊 Indicadores Visuais

### Progress Indicators

**Barra de Progresso:**
- Visual: Barra horizontal com preenchimento
- Cor: Azul primário (padrão)
- Altura: 8px (card) / 12px (modal)
- Label: Percentual numérico ao lado

**Números de Estatísticas:**
- Tamanho: Grande e bold
- Cor: Contextual (verde para bom, vermelho para atenção)
- Label: Texto pequeno abaixo

### Status Badges

**Design Pattern:**
- Background: Cor pastel
- Texto: Cor escura da mesma família
- Border: Nenhuma (filled)
- Border radius: Arredondado
- Padding: Pequeno (2px vertical, 8px horizontal)
- Font size: Extra pequeno
- Font weight: Medium

---

## 🎨 Hierarquia Visual

### Níveis de Ênfase

**Nível 1: Ação Primária**
- Botão "Nova Rodada"
- Cor: Azul sólido
- Posição: Destaque no header

**Nível 2: Informação Primária**
- Nome da empresa
- Números grandes de estatísticas
- Font weight: Semibold/Bold

**Nível 3: Informação Secundária**
- Datas, emails, cargos
- Cor: Cinza médio
- Font size: Pequeno

**Nível 4: Informação Terciária**
- Labels de campos
- Tooltips
- Cor: Cinza claro
- Font size: Extra pequeno

---

## 💡 Padrões de Design

### Cards

**Estrutura Padrão:**
1. Header com título e ações
2. Conteúdo principal
3. Footer com ações ou progresso (opcional)

**Espaçamento:**
- Padding interno: 24px (p-6)
- Espaçamento entre elementos: 16px (space-y-4)

**Elevação:**
- Default: Sombra sutil
- Hover: Sombra média
- Active: Sombra pequena (efeito de "press")

### Badges

**Tamanhos:**
- Default: px-2 py-1 text-xs
- Small: px-1.5 py-0.5 text-2xs (se necessário)

**Variantes:**
- Filled: Background colorido + texto escuro
- Outline: Borda colorida + texto colorido + background transparente

### Modals

**Estrutura:**
1. Overlay escuro (50% opacidade)
2. Card centralizado
3. Header com título e botão fechar
4. Conteúdo scrollable
5. Footer fixo com ações (opcional)

**Larguras:**
- Pequeno: max-w-md (448px)
- Médio: max-w-2xl (672px)
- Grande: max-w-6xl (1152px)

---

## 🔍 Tooltips

### Design

**Aparência:**
- Background: Preto semi-transparente
- Texto: Branco
- Font size: `text-xs`
- Padding: Pequeno
- Border radius: Arredondado
- Sombra: Média

**Comportamento:**
- Trigger: Hover (desktop) / Tap (mobile)
- Delay: 200ms para aparecer
- Posição: Inteligente (evita sair da tela)
- Arrow: Ponteiro apontando para o elemento

**Uso:**
- Explicações de funcionalidades
- Textos de ajuda
- Informações adicionais não essenciais

---

## 🎯 Casos de Uso da UI

### Cenário 1: Gerente cria nova rodada

**Fluxo Visual:**
1. Clique em "Nova Rodada" (botão azul no header)
2. Modal abre com fade in
3. Preenche formulário
4. Clique em "Criar" (botão azul)
5. Modal fecha com fade out
6. Novo card aparece na lista com animação

### Cenário 2: Líder acompanha progresso

**Fluxo Visual:**
1. Visualiza cards de rodadas ativas
2. Identifica rodada pelo nome da empresa
3. Vê progresso geral na barra (52%)
4. Nota 3 concluídas (verde) e 2 pendentes (cinza)
5. Clique no ícone "..." para ver detalhes
6. Modal abre mostrando lista completa

### Cenário 3: Envio de lembrete

**Fluxo Visual:**
1. No modal de detalhes, filtra por "Pendente"
2. Identifica participante específico
3. Vê badge vermelho "Atrasado"
4. Hover no botão "Lembrete" mostra tooltip
5. Clique envia email (feedback visual: toast)

### Cenário 4: Controle de acesso aos resultados

**Fluxo Visual:**
1. No modal de detalhes, visualiza switches
2. Vê que 1 de 8 tem acesso (contador no header)
3. Toggle de switch específico (verde → cinza)
4. Ou clique em "Permitir Todos" para ação em massa
5. Visual feedback: switches animam para novo estado

---

## 📈 Métricas de UI

### Performance Visual

**Tempo de carregamento:**
- Cards renderizam progressivamente
- Animações são não-bloqueantes
- Imagens/ícones carregam instantaneamente (inline SVG)

**Suavidade:**
- 60 FPS para animações
- Transições CSS otimizadas
- Motion components com spring physics

### Acessibilidade

**Contraste:**
- Todos os textos têm razão de contraste ≥ 4.5:1
- Badges mantêm legibilidade
- Ícones têm labels para screen readers

**Navegação:**
- Tab order lógico
- Focus states visíveis (ring azul)
- Escape fecha modals
- Enter submete formulários

---

## 🎨 Customização de Tema

### Variáveis CSS Usadas

```css
/* Cores principais */
--primary: #2563eb
--success: #16a34a
--warning: #d97706
--destructive: #dc2626

/* Cinzas */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-600: #4b5563
--gray-900: #111827

/* Espacamentos */
--space-4: 1rem
--space-6: 1.5rem
```

### Whitelabel Support

Para suportar identidade visual customizada:
- Substituir variáveis CSS de cor
- Manter estrutura e espaçamentos
- Ícones podem ser trocados mantendo tamanhos

---

## 🚀 Próximas Melhorias de UI

### Planejadas

- [ ] **Drag & Drop**: Reordenar participantes
- [ ] **Gráficos**: Mini charts de progresso temporal
- [ ] **Filtros Avançados**: Multi-select, ranges de data
- [ ] **Ações em Massa**: Selecionar múltiplos participantes
- [ ] **Export Visual**: Botão para exportar lista como CSV/PDF
- [ ] **Skeleton Loaders**: Durante carregamento de dados

### Em Consideração

- [ ] **Dark Mode**: Suporte completo ao tema escuro
- [ ] **Compact Mode**: Visualização mais densa para muitas rodadas
- [ ] **Calendar View**: Visualização de rodadas em calendário
- [ ] **Kanban Board**: Drag entre status de participantes

---

## 📞 Referências Técnicas

### Componentes ShadCN Utilizados

- `<Button />` - Ações principais e secundárias
- `<Card />` - Containers de conteúdo
- `<Badge />` - Status e tags
- `<Progress />` - Barras de progresso
- `<Tabs />` - Navegação entre visualizações
- `<Input />` - Campos de busca
- `<Select />` - Filtros dropdown
- `<Dialog />` - Modais
- `<Avatar />` - Fotos de perfil
- `<Switch />` - Toggle de permissões
- `<Tooltip />` - Ajuda contextual

### Ícones Lucide Utilizados

| Ícone | Contexto | Tamanho |
|-------|----------|---------|
| `<Plus />` | Nova rodada, adicionar | 16px |
| `<Search />` | Busca | 16px |
| `<BarChart3 />` | Resultados, analytics | 16px |
| `<Users />` | Participantes | 16-20px |
| `<CheckCircle />` | Concluído | 16px |
| `<Clock />` | Pendente, em progresso | 16px |
| `<AlertCircle />` | Atrasado, atenção | 16px |
| `<Eye />` | Ver, permitir acesso | 12-16px |
| `<EyeOff />` | Ocultar, restringir | 12-16px |
| `<Mail />` | Enviar email | 12px |
| `<Settings />` | Configurações | 12px |
| `<MoreHorizontal />` | Mais opções | 16px |
| `<Target />` | Empty state (ativas) | 48px |
| `<Archive />` | Empty state (encerradas) | 48px |

---

## 💡 Resumo Executivo de UI

### O que a interface oferece?

**Para Managers/Líderes:**
- ✅ Visão geral rápida de todas as rodadas
- ✅ Criação fácil de novas rodadas
- ✅ Acompanhamento detalhado de progresso
- ✅ Controle granular de acesso aos resultados
- ✅ Ações rápidas (lembretes, encerramento)

**Características Visuais:**
- 🎨 Design clean e profissional
- 📊 Informações densas mas organizadas
- 🎯 Hierarquia clara de informação
- ⚡ Interações rápidas e intuitivas
- 📱 Responsivo para todos os dispositivos

**Pontos Fortes:**
- Sistema de cores consistente e significativo
- Feedback visual imediato para todas as ações
- Empty states amigáveis
- Tooltips explicativos
- Animações sutis e funcionais

---

**Versão:** 3.0  
**Última atualização:** Outubro 2025  
**Componente:** `/components/Rodadas.tsx`
