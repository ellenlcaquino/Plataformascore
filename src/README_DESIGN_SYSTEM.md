# 🎨 QualityMap App - Design System

## 📐 Visão Geral

Este documento detalha o **sistema de design completo** do QualityMap App, incluindo paleta de cores, tipografia, iconografia, componentes visuais, espaçamento, animações e todas as bibliotecas utilizadas.

**Versão do Design System:** 3.0  
**Última atualização:** Outubro 2025  
**Framework CSS:** Tailwind CSS v4.0  
**Biblioteca de Componentes:** ShadCN/UI

---

## 🎨 Paleta de Cores

### Sistema de Cores Base

O QualityMap App utiliza um sistema de cores baseado em **CSS Custom Properties** (variáveis CSS) para suportar temas e customização whitelabel.

#### Cores Principais

| Nome | Variável CSS | Hex (Light) | Uso |
|------|-------------|-------------|-----|
| **Primary** | `--primary` | `#2563eb` | Botões principais, links, elementos de destaque |
| **Primary Foreground** | `--primary-foreground` | `#ffffff` | Texto sobre primary |
| **Success** | `--success` | `#16a34a` | Ações positivas, confirmações |
| **Warning** | `--warning` | `#d97706` | Alertas, atenção |
| **Destructive** | `--destructive` | `#dc2626` | Erros, ações destrutivas |

#### Cores Neutras

| Nome | Variável CSS | Hex (Light) | Uso |
|------|-------------|-------------|-----|
| **Background** | `--background` | `#ffffff` | Fundo principal da aplicação |
| **Foreground** | `--foreground` | `#1a1a1a` | Texto principal |
| **Muted** | `--muted` | `#f1f5f9` | Backgrounds secundários |
| **Muted Foreground** | `--muted-foreground` | `#64748b` | Texto secundário |
| **Border** | `--border` | `#e2e8f0` | Bordas de componentes |

#### Cores de Superfície

| Nome | Variável CSS | Hex (Light) | Uso |
|------|-------------|-------------|-----|
| **Card** | `--card` | `#ffffff` | Background de cards |
| **Card Foreground** | `--card-foreground` | `#1a1a1a` | Texto em cards |
| **Popover** | `--popover` | `#ffffff` | Background de popovers |
| **Accent** | `--accent` | `#e2e8f0` | Elementos de destaque secundários |

---

### 🎯 Cores QualityScore (Níveis de Maturidade)

Sistema de cores específico para representar os **5 níveis de maturidade** em qualidade de software:

| Nível | Variável CSS | Hex | Faixa | Uso Visual |
|-------|-------------|-----|-------|------------|
| **🟢 Domínio** | `--quality-dominio` | `#16a34a` | 4.0 - 5.0 | Verde - Excelência |
| **🔵 Experiência** | `--quality-experiencia` | `#2563eb` | 3.0 - 3.9 | Azul - Consolidado |
| **🟡 Consciência** | `--quality-consciencia` | `#d97706` | 2.0 - 2.9 | Laranja - Em evolução |
| **🔴 Inicialização** | `--quality-inicializacao` | `#dc2626` | 1.0 - 1.9 | Vermelho - Atenção |
| **⚫ Agnóstico** | `--quality-agnostico` | `#64748b` | 0.0 - 0.9 | Cinza - Não implementado |

**Aplicação Prática:**
```css
/* Badge de nível Domínio */
.badge-dominio {
  background-color: var(--quality-dominio);
  color: white;
}

/* Score numérico colorido */
.score-display {
  color: var(--quality-experiencia); /* Muda dinamicamente */
}
```

---

### 🏢 Cores Whitelabel (Multi-Tenant)

Sistema de cores dinâmicas para suportar identidade visual de múltiplas empresas:

| Variável CSS | Default | Descrição |
|--------------|---------|-----------|
| `--company-primary` | `#2563eb` | Cor principal da empresa |
| `--company-primary-foreground` | `#ffffff` | Texto sobre primary |
| `--company-accent` | `#e2e8f0` | Cor de acento |
| `--company-accent-foreground` | `#1e293b` | Texto sobre accent |

**Como usar:**
```jsx
// Aplica cores da empresa dinamicamente via hook
import { useCompanyColors } from './components/useCompanyColors';

function MyComponent() {
  useCompanyColors(); // Aplica cores no :root
  
  return (
    <div className="bg-company-primary text-company-primary-foreground">
      {/* Conteúdo com cores da empresa */}
    </div>
  );
}
```

---

### 📊 Cores de Gráficos

Sistema de cores para visualizações de dados (Recharts):

| Chart | Variável CSS | Hex | Uso |
|-------|-------------|-----|-----|
| **Chart 1** | `--chart-1` | `#3b82f6` | Azul - Séries primárias |
| **Chart 2** | `--chart-2` | `#10b981` | Verde - Dados positivos |
| **Chart 3** | `--chart-3` | `#f59e0b` | Laranja - Alertas |
| **Chart 4** | `--chart-4` | `#ef4444` | Vermelho - Problemas |
| **Chart 5** | `--chart-5` | `#8b5cf6` | Roxo - Dados secundários |

---

### 🌓 Modo Escuro (Dark Mode)

O sistema suporta modo escuro com paleta OKLCH para cores mais precisas:

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  /* ... demais cores em OKLCH */
}
```

**Nota:** Dark mode está implementado mas não ativo por padrão na aplicação.

---

## 🔤 Tipografia

### Sistema de Tamanhos

O QualityMap App utiliza um sistema de escala tipográfica baseado em **CSS Variables**:

| Elemento | Classe Tailwind | Variável CSS | Tamanho (px) | Peso | Altura de linha |
|----------|----------------|-------------|--------------|------|-----------------|
| **H1** | `text-2xl` | `--text-2xl` | 24px | 500 (Medium) | 1.5 |
| **H2** | `text-xl` | `--text-xl` | 20px | 500 (Medium) | 1.5 |
| **H3** | `text-lg` | `--text-lg` | 18px | 500 (Medium) | 1.5 |
| **H4** | `text-base` | `--text-base` | 16px | 500 (Medium) | 1.5 |
| **Parágrafo** | `text-base` | `--text-base` | 16px | 400 (Normal) | 1.5 |
| **Pequeno** | `text-sm` | `--text-sm` | 14px | 400 (Normal) | 1.5 |
| **Extra Pequeno** | `text-xs` | `--text-xs` | 12px | 400 (Normal) | 1.5 |

### Font Size Base

```css
:root {
  --font-size: 14px; /* Base do sistema */
}

html {
  font-size: var(--font-size);
}
```

**Importante:** A base é 14px, mas os tamanhos acima já estão convertidos para valores absolutos.

### Pesos de Fonte

| Nome | Variável CSS | Valor | Uso |
|------|-------------|-------|-----|
| **Normal** | `--font-weight-normal` | 400 | Texto corrido, parágrafos |
| **Medium** | `--font-weight-medium` | 500 | Títulos, labels, botões |
| **Semibold** | `--font-weight-semibold` | 600 | Destaques, números grandes |

### Hierarquia Tipográfica Automática

O sistema aplica tipografia automaticamente aos elementos HTML:

```css
h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

button {
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

/* ... etc */
```

**⚠️ Importante:** Esta hierarquia é aplicada apenas quando **não há classes Tailwind de texto** no elemento ou ancestrais.

---

## 🎭 Iconografia

### Biblioteca: Lucide React

**Versão:** 0.487.0  
**Site:** https://lucide.dev  
**Licença:** ISC

O QualityMap App utiliza **Lucide React** como biblioteca de ícones principal. Lucide oferece:
- ✅ Ícones modernos e consistentes
- ✅ SVG otimizados e leves
- ✅ Fácil customização de tamanho e cor
- ✅ Tree-shaking automático (importa apenas o que usa)

### Tamanhos Padrão de Ícones

| Contexto | Classe Tailwind | Tamanho (px) | Uso |
|----------|----------------|--------------|-----|
| **Pequeno** | `h-3 w-3` | 12×12 | Ícones em badges, tooltips |
| **Padrão** | `h-4 w-4` | 16×16 | Ícones em botões, menus |
| **Médio** | `h-5 w-5` | 20×20 | Ícones em cards de estatísticas |
| **Grande** | `h-6 w-6` | 24×24 | Ícones de títulos, headers |
| **Extra Grande** | `h-12 w-12` | 48×48 | Empty states, ilustrações |

### Ícones do QualityScore

#### Ícones dos 7 Pilares

| Pilar | Ícone | Componente Lucide | Cor |
|-------|-------|-------------------|-----|
| **Processos e Estratégia** | ⚙️ | `<Settings />` | `#3b82f6` (Azul) |
| **Testes Automatizados** | 🤖 | `<Bot />` | `#10b981` (Verde) |
| **Métricas** | 📊 | `<BarChart3 />` | `#f59e0b` (Laranja) |
| **Documentações** | 📄 | `<FileText />` | `#ef4444` (Vermelho) |
| **Modalidades de Testes** | 🧪 | `<TestTube />` | `#8b5cf6` (Roxo) |
| **QAOps** | ♾️ | `<Infinity />` | `#06b6d4` (Ciano) |
| **Liderança** | 👥 | `<Users />` | `#84cc16` (Lima) |

**Exemplo de uso:**
```jsx
import { Settings, Bot, BarChart3 } from 'lucide-react';

<Settings className="h-6 w-6" style={{ color: '#3b82f6' }} />
```

#### Ícones de Status

| Status | Ícone | Componente | Cor |
|--------|-------|-----------|-----|
| **Concluído** | ✅ | `<CheckCircle />` | Verde (`#16a34a`) |
| **Em Progresso** | 🕒 | `<Clock />` | Azul (`#2563eb`) |
| **Pendente** | ⏸️ | `<Clock />` | Cinza (`#64748b`) |
| **Atrasado** | ⚠️ | `<AlertCircle />` | Vermelho (`#dc2626`) |
| **Sucesso** | 🎯 | `<Target />` | Verde |
| **Erro** | ❌ | `<AlertTriangle />` | Vermelho |

#### Ícones de Ações

| Ação | Ícone | Componente |
|------|-------|-----------|
| **Adicionar** | ➕ | `<Plus />` |
| **Editar** | ✏️ | `<Edit />` |
| **Deletar** | 🗑️ | `<Trash />` |
| **Buscar** | 🔍 | `<Search />` |
| **Filtrar** | 🔽 | `<Filter />` |
| **Download** | ⬇️ | `<Download />` |
| **Upload** | ⬆️ | `<Upload />` |
| **Compartilhar** | 🔗 | `<Share2 />` |
| **Configurações** | ⚙️ | `<Settings />` |
| **Visualizar** | 👁️ | `<Eye />` |
| **Ocultar** | 🚫 | `<EyeOff />` |
| **Menu** | ⋯ | `<MoreHorizontal />` |
| **Fechar** | ❌ | `<X />` |
| **Voltar** | ⬅️ | `<ChevronLeft />` |
| **Avançar** | ➡️ | `<ChevronRight />` |
| **Email** | 📧 | `<Mail />` |

#### Ícones de Navegação

| Elemento | Ícone | Componente |
|----------|-------|-----------|
| **Dashboard** | 📊 | `<LayoutDashboard />` |
| **Usuários** | 👥 | `<Users />` |
| **Calendário** | 📅 | `<Calendar />` |
| **Gráficos** | 📈 | `<TrendingUp />` |
| **Arquivo** | 📁 | `<Archive />` |

### Como Importar e Usar

```jsx
// Importar ícones específicos (tree-shaking)
import { Settings, Bot, FileText } from 'lucide-react';

// Uso básico
<Settings className="h-4 w-4" />

// Com cor customizada
<Bot className="h-6 w-6 text-green-600" />

// Com estilo inline
<FileText className="h-5 w-5" style={{ color: '#ef4444' }} />

// Com animação
<CheckCircle className="h-4 w-4 text-green-600 animate-pulse" />
```

---

## 📦 Componentes ShadCN/UI

O QualityMap App utiliza **ShadCN/UI** como biblioteca de componentes base. ShadCN não é um pacote NPM tradicional - os componentes são **copiados para o projeto** e customizados.

### Componentes Disponíveis

#### Layout & Estrutura

- `<Card />` - Containers de conteúdo
- `<Separator />` - Divisores visuais
- `<ScrollArea />` - Área com scroll customizado
- `<Resizable />` - Painéis redimensionáveis
- `<Sidebar />` - Barra lateral navegável

#### Navegação

- `<Tabs />` - Sistema de abas
- `<Breadcrumb />` - Navegação hierárquica
- `<Pagination />` - Paginação de listas
- `<NavigationMenu />` - Menu de navegação
- `<Menubar />` - Barra de menu

#### Formulários

- `<Input />` - Campo de texto
- `<Textarea />` - Campo de texto multilinha
- `<Select />` - Dropdown de seleção
- `<Checkbox />` - Caixa de seleção
- `<RadioGroup />` - Grupo de radio buttons
- `<Switch />` - Toggle on/off
- `<Slider />` - Controle deslizante
- `<Calendar />` - Seletor de data
- `<Form />` - Wrapper de formulário com validação

#### Feedback

- `<Alert />` - Mensagens de alerta
- `<Progress />` - Barra de progresso
- `<Skeleton />` - Placeholder de carregamento
- `<Sonner />` - Toast notifications
- `<Badge />` - Etiquetas e tags

#### Overlay

- `<Dialog />` - Modal/Dialog
- `<Sheet />` - Painel deslizante lateral
- `<Drawer />` - Gaveta inferior (mobile-first)
- `<Popover />` - Popover contextual
- `<Tooltip />` - Dica de ferramenta
- `<HoverCard />` - Card em hover
- `<ContextMenu />` - Menu de contexto
- `<DropdownMenu />` - Menu dropdown
- `<AlertDialog />` - Dialog de confirmação

#### Data Display

- `<Table />` - Tabelas
- `<Avatar />` - Foto de perfil
- `<Chart />` - Wrapper para Recharts
- `<Accordion />` - Conteúdo expansível
- `<Collapsible />` - Seção recolhível
- `<Carousel />` - Carrossel de imagens

#### Outros

- `<Button />` - Botões
- `<Toggle />` - Toggle button
- `<ToggleGroup />` - Grupo de toggles
- `<InputOtp />` - Campo OTP

### Design Tokens nos Componentes

Todos os componentes ShadCN utilizam as variáveis CSS do sistema:

```jsx
<Button className="bg-primary text-primary-foreground">
  Botão Principal
</Button>

<Card className="bg-card text-card-foreground border-border">
  Conteúdo do card
</Card>
```

---

## 📏 Sistema de Espaçamento

### Escala de Espaçamento

O QualityMap App utiliza uma escala de espaçamento baseada em **múltiplos de 4px** (0.25rem):

| Nome | Variável CSS | Classe Tailwind | Valor (rem) | Valor (px) |
|------|-------------|----------------|-------------|------------|
| **Space 1** | `--space-1` | `p-1`, `m-1` | 0.25rem | 4px |
| **Space 2** | `--space-2` | `p-2`, `m-2` | 0.5rem | 8px |
| **Space 3** | `--space-3` | `p-3`, `m-3` | 0.75rem | 12px |
| **Space 4** | `--space-4` | `p-4`, `m-4` | 1rem | 16px |
| **Space 5** | `--space-5` | `p-5`, `m-5` | 1.25rem | 20px |
| **Space 6** | `--space-6` | `p-6`, `m-6` | 1.5rem | 24px |
| **Space 8** | `--space-8` | `p-8`, `m-8` | 2rem | 32px |
| **Space 10** | `--space-10` | `p-10`, `m-10` | 2.5rem | 40px |
| **Space 12** | `--space-12` | `p-12`, `m-12` | 3rem | 48px |
| **Space 16** | `--space-16` | `p-16`, `m-16` | 4rem | 64px |
| **Space 20** | `--space-20` | `p-20`, `m-20` | 5rem | 80px |

### Espaçamento Padrão por Contexto

| Contexto | Padding | Margin | Gap |
|----------|---------|--------|-----|
| **Container Principal** | `p-6` (24px) | - | - |
| **Cards** | `p-6` (24px) | - | - |
| **Cards Compactos** | `p-4` (16px) | - | - |
| **Seções** | - | `space-y-6` (24px) | - |
| **Formulários** | - | `space-y-4` (16px) | - |
| **Grids** | - | - | `gap-4` (16px) |
| **Flex** | - | - | `gap-3` (12px) |
| **Botões (inline)** | - | - | `gap-2` (8px) |

### Border Radius

| Nome | Variável CSS | Valor | Uso |
|------|-------------|-------|-----|
| **Small** | `--radius-sm` | `calc(var(--radius) - 2px)` | Badges, tags |
| **Medium** | `--radius-md` | `var(--radius)` | Botões, inputs |
| **Large** | `--radius-lg` | `calc(var(--radius) + 2px)` | Cards |
| **Extra Large** | `--radius-xl` | `calc(var(--radius) + 4px)` | Modals |

**Base Radius:** `--radius: 0.5rem` (8px)

---

## 🎬 Animações e Transições

### Biblioteca: Motion/React

**Versão:** Latest  
**Antiga:** Framer Motion  
**Importação:** `import { motion } from 'motion/react'`

### Animações Padrão

#### Fade In + Slide Up (Lista de Items)

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>
```

#### Hover State (Cards)

```jsx
<Card className="hover:shadow-md transition-shadow duration-200">
  {/* Conteúdo do card */}
</Card>
```

#### Transitions CSS

```css
/* Cores */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

/* Sombra */
.transition-shadow {
  transition-property: box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

/* Tudo */
.transition-all {
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
```

### Animações do Sistema

| Elemento | Animação | Duração | Easing |
|----------|----------|---------|--------|
| **Hover em Cards** | Shadow elevação | 150ms | ease-in-out |
| **Hover em Botões** | Background change | 150ms | ease-in-out |
| **Switch Toggle** | Slide horizontal | 200ms | ease-in-out |
| **Modal Open** | Fade in + scale | 200ms | ease-out |
| **Modal Close** | Fade out + scale | 150ms | ease-in |
| **Toast Notification** | Slide in from right | 200ms | ease-out |
| **Progress Bar** | Width transition | 300ms | ease-in-out |
| **Lista de items** | Fade in + slide up | 300ms | spring |

---

## 📊 Bibliotecas de Visualização

### Recharts

**Versão:** Latest  
**Uso:** Gráficos e visualizações de dados

**Componentes utilizados:**
- `<RadarChart />` - Gráfico radar (comparação de personas)
- `<BarChart />` - Gráfico de barras
- `<LineChart />` - Gráfico de linhas (evolução temporal)
- `<PieChart />` - Gráfico de pizza
- `<ResponsiveContainer />` - Container responsivo

**Configuração de Cores:**
```jsx
import { RadarChart } from 'recharts';

<RadarChart>
  <Radar 
    dataKey="value" 
    stroke="var(--primary)" 
    fill="var(--primary)" 
    fillOpacity={0.3}
  />
</RadarChart>
```

**Paleta de gráficos:**
- Chart 1: `#3b82f6` (Azul)
- Chart 2: `#10b981` (Verde)
- Chart 3: `#f59e0b` (Laranja)
- Chart 4: `#ef4444` (Vermelho)
- Chart 5: `#8b5cf6` (Roxo)

---

## 🛠️ Bibliotecas e Dependências

### Principais Bibliotecas

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| **React** | 18+ | Framework UI |
| **Tailwind CSS** | 4.0 | Framework CSS |
| **Lucide React** | 0.487.0 | Ícones |
| **Motion/React** | Latest | Animações |
| **Recharts** | Latest | Gráficos |
| **ShadCN/UI** | Latest | Componentes base |
| **Radix UI** | Various | Primitivos de UI |
| **Class Variance Authority** | 0.7.1 | Variantes de componentes |
| **React Hook Form** | 7.55.0 | Gestão de formulários |
| **Sonner** | 2.0.3 | Toast notifications |
| **XLSX** | Latest | Importação/exportação Excel |
| **React DND** | Latest | Drag and Drop |

### Dependências por Componente

**ShadCN/UI usa:**
- `@radix-ui/*` - Primitivos acessíveis
- `class-variance-authority` - Sistema de variantes
- `clsx` / `tailwind-merge` - Utilitários de classes

**Formulários:**
- `react-hook-form@7.55.0` - Gestão de formulários
- `zod` - Validação de schemas (se necessário)

**Notificações:**
- `sonner@2.0.3` - Sistema de toasts

**Carousels:**
- `embla-carousel-react@8.6.0` - Engine de carousel

---

## 🎨 Guia de Uso para Designers

### Ferramentas Recomendadas

1. **Figma** - Design de interfaces
2. **Coolors.co** - Geração de paletas
3. **Lucide Icons** - Biblioteca de ícones (lucide.dev)
4. **Tailwind CSS IntelliSense** - Autocomplete de classes

### Exportando Designs para Desenvolvimento

#### Cores

Sempre use as variáveis CSS ao especificar cores:
```
❌ Não: "Use #2563eb aqui"
✅ Sim: "Use var(--primary) ou primary do Tailwind"
```

#### Espaçamento

Use múltiplos de 4px (escala Tailwind):
```
❌ Não: 18px, 22px, 30px
✅ Sim: 16px (p-4), 20px (p-5), 32px (p-8)
```

#### Tipografia

Sempre referencie a escala tipográfica:
```
❌ Não: "Fonte 17px"
✅ Sim: "text-lg (18px)"
```

#### Ícones

Sempre especifique o nome do ícone Lucide:
```
❌ Não: "Ícone de engrenagem"
✅ Sim: "Lucide: Settings, tamanho h-6 w-6"
```

---

## 🎯 Padrões de Design

### Cards

**Estrutura Padrão:**
```jsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

**Estilos:**
- Background: Branco (`bg-card`)
- Borda: Cinza claro (`border-border`)
- Padding: 24px (`p-6`)
- Border radius: 8px (`rounded-lg`)
- Sombra: Sutil (definida no componente)

### Botões

**Variantes:**

```jsx
// Primary
<Button>Ação Principal</Button>

// Secondary
<Button variant="secondary">Ação Secundária</Button>

// Outline
<Button variant="outline">Ação Terciária</Button>

// Ghost
<Button variant="ghost">Ação Sutil</Button>

// Destructive
<Button variant="destructive">Deletar</Button>
```

**Tamanhos:**
```jsx
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
```

**Com Ícone:**
```jsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Adicionar
</Button>
```

### Badges

```jsx
// Status positivo
<Badge className="bg-green-100 text-green-800">Concluído</Badge>

// Status neutro
<Badge variant="outline">V2024.01.001</Badge>

// Status de atenção
<Badge className="bg-red-100 text-red-800">Atrasado</Badge>
```

### Inputs

```jsx
<Input 
  placeholder="Digite aqui..." 
  className="bg-input-background"
/>
```

**Com ícone:**
```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input placeholder="Buscar..." className="pl-10" />
</div>
```

---

## 🌈 Acessibilidade

### Contraste de Cores

Todas as combinações de cores seguem **WCAG 2.1 AA**:
- Texto normal: Razão de contraste ≥ 4.5:1
- Texto grande: Razão de contraste ≥ 3:1
- Elementos UI: Razão de contraste ≥ 3:1

### Focus States

Todos os elementos interativos têm estados de foco visíveis:

```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

**Cor do ring:** Azul (`--ring: #3b82f6`)

### Ícones e Labels

Todos os ícones devem ter labels para screen readers:

```jsx
<Button aria-label="Adicionar item">
  <Plus className="h-4 w-4" />
</Button>
```

---

## 📱 Responsividade

### Breakpoints Tailwind

| Nome | Min Width | Uso |
|------|-----------|-----|
| **sm** | 640px | Tablets pequenos |
| **md** | 768px | Tablets |
| **lg** | 1024px | Desktops |
| **xl** | 1280px | Desktops grandes |
| **2xl** | 1536px | Telas muito grandes |

### Padrões Responsivos

```jsx
// Grid adaptativo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Padding responsivo
<div className="p-4 md:p-6 lg:p-8">

// Text size responsivo
<h1 className="text-xl md:text-2xl lg:text-3xl">
```

---

## 🎨 Customização Whitelabel

### Como Aplicar Cores de Empresa

**1. Via CSS Variables:**
```css
:root {
  --company-primary: #ff5722;
  --company-primary-foreground: #ffffff;
}
```

**2. Via Hook React:**
```jsx
import { useCompanyColors } from './components/useCompanyColors';

function App() {
  useCompanyColors(); // Aplica automaticamente
  return <div>...</div>;
}
```

**3. Componentes usam automaticamente:**
```jsx
<Button className="bg-company-primary text-company-primary-foreground">
  Botão com Cor da Empresa
</Button>
```

---

## 📚 Recursos e Links

### Documentação

- **Tailwind CSS:** https://tailwindcss.com
- **ShadCN/UI:** https://ui.shadcn.com
- **Lucide Icons:** https://lucide.dev
- **Recharts:** https://recharts.org
- **Motion React:** https://motion.dev
- **Radix UI:** https://radix-ui.com

### Ferramentas

- **Tailwind Play:** https://play.tailwindcss.com
- **Color Palette Generator:** https://uicolors.app
- **Contrast Checker:** https://webaim.org/resources/contrastchecker

---

## 📋 Checklist para Novos Designs

Ao criar novos componentes ou telas, verifique:

- [ ] Usa variáveis CSS do sistema de cores
- [ ] Espaçamento segue escala de 4px
- [ ] Tipografia usa escalas definidas (text-sm, text-base, etc.)
- [ ] Ícones são da biblioteca Lucide
- [ ] Tamanhos de ícones seguem padrão (h-4 w-4, h-6 w-6)
- [ ] Cards usam padding padrão (p-6 ou p-4)
- [ ] Componentes são responsivos (usa breakpoints md:, lg:)
- [ ] Contraste de cores é adequado (≥4.5:1)
- [ ] Estados de hover/focus estão implementados
- [ ] Animações seguem duração padrão (150-300ms)
- [ ] Border radius usa variáveis do sistema
- [ ] Componentes ShadCN são preferidos vs custom
- [ ] Suporta modo escuro (se habilitado)

---

## 🚀 Próximas Melhorias

### Planejadas

- [ ] **Storybook:** Documentação visual de componentes
- [ ] **Design Tokens JSON:** Exportação para Figma
- [ ] **Modo Escuro Completo:** Ativar dark mode no app
- [ ] **Mais variantes de cores:** Esquemas adicionais
- [ ] **Biblioteca de Templates:** Layouts pré-prontos

---

## 💡 Resumo Executivo

### O que está disponível?

✅ **55+ Componentes ShadCN** prontos para usar  
✅ **Sistema de cores completo** com 5 níveis de maturidade QualityScore  
✅ **500+ ícones Lucide** otimizados  
✅ **Tipografia escalável** baseada em CSS variables  
✅ **Espaçamento consistente** (escala de 4px)  
✅ **Animações suaves** com Motion/React  
✅ **Gráficos profissionais** com Recharts  
✅ **Suporte whitelabel** para múltiplas empresas  
✅ **Acessibilidade WCAG AA** em todos os componentes  
✅ **Responsividade** completa

### Como usar este design system?

1. **Cores:** Use classes Tailwind (`bg-primary`, `text-success`) ou variáveis CSS (`var(--primary)`)
2. **Componentes:** Importe de `/components/ui/`
3. **Ícones:** Importe de `lucide-react`
4. **Espaçamento:** Use classes Tailwind (`p-4`, `gap-6`, `space-y-4`)
5. **Tipografia:** Use classes Tailwind (`text-xl`, `font-medium`)

### Para designers:

- Use Figma com plugin Tailwind CSS
- Exporte com variáveis CSS (não hex codes)
- Sempre especifique ícones Lucide por nome
- Siga escala de espaçamento (múltiplos de 4px)

---

**Versão:** 3.0  
**Última atualização:** Outubro 2025  
**Mantido por:** Equipe QualityMap App
