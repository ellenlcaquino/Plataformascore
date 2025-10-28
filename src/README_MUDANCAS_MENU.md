# 🔄 Reorganização do Menu e Cadastros - QualityMap App

## 📋 Resumo das Mudanças

Três mudanças principais foram implementadas para melhorar a organização e clareza do sistema:

1. ✅ **Garantia de Leader por Empresa**
2. ✅ **Menu Cadastros substituindo Personas**
3. ✅ **Report View integrado ao QualityScore**

---

## 1️⃣ Garantia de Leader por Empresa

### ✅ Implementação Existente

A lógica já estava corretamente implementada no `AuthContext.tsx`:

```typescript
// Linha 184 - AuthContext.tsx
role: isNewCompany ? 'leader' : 'member', // Primeiro usuário da empresa vira leader
```

### Como Funciona

**Quando um usuário se registra:**

1. **Empresa Nova**
   ```typescript
   // Sistema verifica se empresa existe
   if (!company) {
     // Cria nova empresa
     companyId = 'company-' + Date.now();
     isNewCompany = true;
     
     // Usuário vira LEADER
     role: 'leader'
     
     // Define leaderId da empresa
     company.leaderId = newUser.id;
   }
   ```

2. **Empresa Existente**
   ```typescript
   else {
     // Empresa já existe
     companyId = company.id;
     isNewCompany = false;
     
     // Usuário vira MEMBER
     role: 'member'
   }
   ```

### Regra de Negócio

- ✅ **Toda empresa tem pelo menos 1 leader**
- ✅ **Primeiro usuário = Leader automático**
- ✅ **Usuários subsequentes = Members**
- ✅ **Leader ID é registrado na empresa**

### Exemplo Prático

```
Passo 1: João cria conta
├─ Empresa: "TechCorp" (nova)
├─ Role: LEADER
└─ leaderId da empresa: id do João

Passo 2: Maria cria conta
├─ Empresa: "TechCorp" (existente)
├─ Role: MEMBER
└─ leaderId da empresa: continua sendo id do João
```

---

## 2️⃣ Menu "Cadastros" Substituindo "Personas"

### Alterações no AppSidebar.tsx

**ANTES:**
```typescript
const getMainMenuItems = (permissions: any) => [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: Home,
    show: true,
  },
  {
    title: 'Personas',  // ← Antigo
    url: 'personas',
    icon: Users,
    show: true,
  },
  // ...
];
```

**DEPOIS:**
```typescript
const getMainMenuItems = (permissions: any) => [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: Home,
    show: true,
  },
  {
    title: 'Cadastros',  // ← Novo
    url: 'personas',
    icon: Database,
    show: true,
  },
];
```

### Alterações no PersonaSwitcher.tsx

**ANTES:**
- Componente mostrava cards com personas (Manager, Leader, Member)
- Permitia alternar entre roles
- Exibia tabela de comparação de permissões
- ~185 linhas de código

**DEPOIS:**
```typescript
import React from 'react';
import { CadastrosManagement } from './CadastrosManagement';

// PersonaSwitcher agora é uma tela de Cadastros
export function PersonaSwitcher() {
  return <CadastrosManagement />;
}
```

### Funcionalidades Agora Disponíveis

O menu "Cadastros" agora mostra:

1. **Tab Empresas**
   - ✅ Lista todas as empresas
   - ✅ Criar nova empresa
   - ✅ Editar empresa existente
   - ✅ Ver status (ativa/inativa)
   - ✅ Ver líder da empresa
   - ✅ Ver cor primária (whitelabel)

2. **Tab Usuários**
   - ✅ Lista todos os usuários do sistema
   - ✅ Ver role (Leader/Member)
   - ✅ Ver empresa associada
   - ✅ Ver status (ativo/inativo)
   - ✅ Ver último login
   - ✅ Criar novo usuário
   - ✅ Editar usuário existente

### Permissões

**Quem vê o menu Cadastros?**
- ✅ **Manager** - Vê todas as empresas e usuários
- ✅ **Leader** - Vê apenas sua empresa e seus membros
- ✅ **Member** - Vê apenas informações básicas de sua empresa

### Remoção do Menu Administração

**REMOVIDO do SidebarFooter:**
```typescript
// Não existe mais esta seção separada
{user?.role === 'manager' && (
  <SidebarGroup>
    <SidebarGroupLabel>Administração</SidebarGroupLabel>
    <SidebarMenuItem>Cadastros</SidebarMenuItem>
  </SidebarGroup>
)}
```

**AGORA:**
- Cadastros está no menu principal
- Acessível para todos (com filtros por permissão)

---

## 3️⃣ Report View no Submenu QualityScore

### Alterações no Menu

**ANTES:**
```
Menu Principal
├─ Dashboard
├─ Personas
└─ Demo Público  ← Aqui

QualityScore
├─ Formulário
├─ Rodadas
├─ Resultados
└─ Importar
```

**DEPOIS:**
```
Menu Principal
├─ Dashboard
└─ Cadastros

QualityScore
├─ Formulário
├─ Rodadas
├─ Resultados
├─ Importar
└─ Report View  ← Movido para cá
```

### Código Atualizado

**AppSidebar.tsx:**
```typescript
const getQualityScoreMenuItems = (permissions: any) => [
  {
    title: 'Formulário',
    url: 'qualityscore-formulario',
    icon: FileText,
    show: true,
  },
  {
    title: 'Rodadas',
    url: 'qualityscore-progresso',
    icon: TrendingUp,
    show: permissions.canViewProgress,
  },
  {
    title: 'Resultados',
    url: 'qualityscore-resultados',
    icon: BarChart3,
    show: permissions.canViewResults,
  },
  {
    title: 'Importar',
    url: 'qualityscore-importar',
    icon: Upload,
    show: permissions.canImportData,
  },
  {
    title: 'Report View',  // ← NOVO
    url: 'public-demo',
    icon: ExternalLink,
    show: permissions.canInviteMembers, // Apenas managers e leaders
  },
];
```

### Simplificação do PublicDemo.tsx

**REMOVIDO - Seção "Como Acessar":**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Como Acessar</CardTitle>
    <CardDescription>
      Formas de visualizar a demo pública
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    <div>1. URL Direta: /score/demo-results</div>
    <div>2. Parâmetro URL: ?demo=score/demo-results</div>
    <div>3. Preview Interno: Use o botão abaixo</div>
  </CardContent>
</Card>
```

**ATUALIZADO - Header mais limpo:**
```typescript
<div>
  <h2 className="text-2xl">Report View</h2>
  <p className="text-muted-foreground">
    Visualize como seus resultados aparecem para o público
  </p>
</div>
```

### Benefícios da Mudança

1. **Organização Lógica**
   - Report View está relacionado ao QualityScore
   - Faz mais sentido estar no mesmo grupo

2. **Menos Confusão**
   - Usuários não precisam entender URLs públicas
   - Foco na visualização de resultados

3. **Hierarquia Clara**
   - QualityScore agrupa todas as funcionalidades relacionadas
   - Menu principal tem apenas itens principais

---

## 📊 Estrutura Final do Menu

### Menu Principal
```
Dashboard
└─ Visão geral do sistema

Cadastros (ex-Personas)
└─ Gestão de empresas e usuários
```

### QualityScore
```
Formulário
└─ Preencher avaliação

Rodadas
└─ Gerenciar rodadas de avaliação

Resultados
└─ Ver resultados consolidados

Importar
└─ Importar dados de planilhas

Report View (ex-Demo Público)
└─ Visualizar como público vê resultados
```

---

## 🎯 Permissões por Role

### Manager (System Manager)

| Menu Item | Acesso |
|-----------|--------|
| Dashboard | ✅ Sim |
| Cadastros | ✅ Sim - Todas empresas |
| QualityScore → Formulário | ✅ Sim |
| QualityScore → Rodadas | ✅ Sim |
| QualityScore → Resultados | ✅ Sim |
| QualityScore → Importar | ✅ Sim |
| QualityScore → Report View | ✅ Sim |

### Leader (Líder da Empresa)

| Menu Item | Acesso |
|-----------|--------|
| Dashboard | ✅ Sim |
| Cadastros | ✅ Sim - Sua empresa |
| QualityScore → Formulário | ✅ Sim |
| QualityScore → Rodadas | ✅ Sim |
| QualityScore → Resultados | ✅ Sim |
| QualityScore → Importar | ❌ Não |
| QualityScore → Report View | ✅ Sim |

### Member (Membro da Equipe)

| Menu Item | Acesso |
|-----------|--------|
| Dashboard | ✅ Sim |
| Cadastros | ✅ Sim - Apenas visualização |
| QualityScore → Formulário | ✅ Sim |
| QualityScore → Rodadas | ❌ Não |
| QualityScore → Resultados | ✅ Sim |
| QualityScore → Importar | ❌ Não |
| QualityScore → Report View | ❌ Não |

---

## 🔧 Arquivos Modificados

### 1. `/components/AppSidebar.tsx`
- ✅ Renomeado "Personas" para "Cadastros"
- ✅ Movido "Demo Público" para submenu QualityScore
- ✅ Renomeado "Demo Público" para "Report View"
- ✅ Removida seção "Administração" do footer

### 2. `/components/PersonaSwitcher.tsx`
- ✅ Simplificado para apenas renderizar `CadastrosManagement`
- ✅ Removido todo código de alternância de personas
- ✅ Reduzido de ~185 linhas para 7 linhas

### 3. `/components/PublicDemo.tsx`
- ✅ Atualizado header de "Demo Público" para "Report View"
- ✅ Removida seção "Como Acessar" com URLs

### 4. `/App.tsx`
- ✅ Removida rota 'cadastros' (duplicada)
- ✅ Mantida apenas rota 'personas' que agora renderiza Cadastros

### 5. `/components/AuthContext.tsx`
- ✅ Verificada lógica de leader (já estava correta)
- ✅ Mantida regra: primeiro usuário = leader

---

## 🧪 Como Testar

### Teste 1: Verificar Menu Cadastros

1. Login como qualquer usuário
2. Verificar menu lateral
3. ✅ Deve mostrar "Cadastros" (não "Personas")
4. ✅ Ícone deve ser Database
5. Clicar em "Cadastros"
6. ✅ Deve mostrar tela de gestão de empresas/usuários

### Teste 2: Verificar Report View

1. Login como Manager ou Leader
2. Expandir submenu "QualityScore"
3. ✅ Deve mostrar "Report View" como último item
4. Clicar em "Report View"
5. ✅ Deve mostrar preview de resultados públicos
6. ✅ NÃO deve mostrar seção "Como Acessar"

### Teste 3: Verificar Leader em Nova Empresa

1. Criar nova conta
2. Usar nome de empresa único: "Empresa Teste 123"
3. ✅ Após registro, role deve ser "Líder da Empresa"
4. ✅ CompanyId deve estar preenchido
5. ✅ leaderId da empresa deve ser o ID do usuário

### Teste 4: Verificar Member em Empresa Existente

1. Criar segunda conta
2. Usar mesmo nome de empresa: "Empresa Teste 123"
3. ✅ Após registro, role deve ser "Membro da Equipe"
4. ✅ CompanyId deve ser o mesmo da primeira conta
5. ✅ leaderId da empresa deve continuar sendo o primeiro usuário

---

## 📈 Benefícios das Mudanças

### 1. Melhor Organização
- ✅ Funcionalidades relacionadas agrupadas
- ✅ Hierarquia clara de menus
- ✅ Menos confusão para usuários

### 2. Nomenclatura Clara
- ✅ "Cadastros" é mais intuitivo que "Personas"
- ✅ "Report View" indica claramente a função
- ✅ Menu principal mais enxuto

### 3. Segurança Garantida
- ✅ Toda empresa tem leader
- ✅ Impossível criar empresa órfã
- ✅ Roles definidos automaticamente

### 4. Experiência Melhorada
- ✅ Menos cliques para acessar funcionalidades
- ✅ Agrupamento lógico de features
- ✅ Interface mais profissional

---

## 🚀 Próximos Passos (Opcionais)

### Melhorias Futuras

1. **Dashboard de Cadastros**
   - Estatísticas de empresas e usuários
   - Gráficos de crescimento
   - Empresas mais ativas

2. **Filtros Avançados**
   - Filtrar usuários por empresa
   - Filtrar por role
   - Busca avançada

3. **Exportação de Dados**
   - Exportar lista de empresas
   - Exportar lista de usuários
   - Relatórios em PDF/Excel

4. **Gestão de Leaders**
   - Permitir transferir leadership
   - Definir co-leaders
   - Histórico de mudanças

---

**Status:** ✅ **Implementação Completa**  
**Versão:** 1.0  
**Data:** Outubro 2025  
**Mudanças:** Menu reorganizado, Cadastros integrado, Report View reposicionado
