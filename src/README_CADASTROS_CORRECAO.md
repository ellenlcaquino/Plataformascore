# ✅ Correção: Sistema de Cadastros - Separação de Responsabilidades

## 🎯 Problema Identificado

Havia uma **inconsistência importante** no sistema de cadastros:

### ❌ Antes (Incorreto)
- Leaders podiam ver e gerenciar empresas
- Confusão sobre o que Leaders podem fazer
- Tab "Usuários Admins" criava ambiguidade

### ✅ Depois (Correto)

**Separação clara de responsabilidades:**

1. **System Manager** = Gerencia sistema completo
   - ✅ Cadastra e edita **empresas**
   - ✅ Gerencia **todos os usuários** de todas as empresas
   - ✅ Vê duas tabs: "Empresas" e "Usuários"

2. **Leader** = Gerencia apenas sua equipe
   - ❌ **NÃO** cadastra empresas
   - ✅ Gerencia apenas **membros de sua empresa**
   - ✅ Vê apenas lista de "Membros da Equipe"
   - ✅ Usuários adicionados em rodadas aparecem automaticamente

3. **Member** = Visualiza equipe
   - ❌ Não cadastra nada
   - ✅ Apenas visualiza membros de sua empresa

---

## 🔄 Mudanças Implementadas

### 1. Interface Adaptativa por Role

**Para Manager:**
```
┌─────────────────────────────────────────────────────┐
│ Cadastros                                           │
│ Gerencie empresas e usuários do sistema            │
├─────────────────────────────────────────────────────┤
│ [Empresas] [Usuários]  ← Tabs                      │
│                                                     │
│ Tab Empresas:                                       │
│ - TechCorp Brasil                                   │
│ - InnovateTech Solutions                            │
│ - [+ Nova Empresa]                                  │
│                                                     │
│ Tab Usuários:                                       │
│ - Ver TODOS os usuários de TODAS as empresas        │
│ - Coluna "Empresa" visível                          │
│ - [+ Novo Usuário]                                  │
└─────────────────────────────────────────────────────┘
```

**Para Leader:**
```
┌─────────────────────────────────────────────────────┐
│ Membros da Equipe                                   │
│ Gerencie os membros da TechCorp Brasil              │
├─────────────────────────────────────────────────────┤
│ 👥 Membros da Equipe  ← Sem tabs                   │
│                                                     │
│ ┌─────┬─────┬─────┬─────┐  ← Dashboard             │
│ │  8  │  5  │  3  │  4  │                          │
│ │Total│Logou│Nunca│Rodada                          │
│ └─────┴─────┴─────┴─────┘                          │
│                                                     │
│ ℹ️ Membros Adicionados via Rodadas                 │
│ Quando você adiciona participantes em rodadas...   │
│                                                     │
│ Lista de Membros:                                   │
│ - João Silva (Líder) ✓ Logou                       │
│ - Maria Santos (Membro) ✓ Logou                    │
│ - Carlos [Rodada] (Membro) ✗ Nunca logou          │
│ - [+ Adicionar Membro]                              │
└─────────────────────────────────────────────────────┘
```

**Para Member:**
```
┌─────────────────────────────────────────────────────┐
│ Membros da Equipe                                   │
│ Visualize os membros da TechCorp Brasil             │
├─────────────────────────────────────────────────────┤
│ 👥 Membros da Equipe  ← Read-only                  │
│                                                     │
│ Lista de Membros:                                   │
│ - João Silva (Líder)                                │
│ - Maria Santos (Membro)                             │
│ - Carlos (Membro)                                   │
│                                                     │
│ [Sem botão de adicionar]                            │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Código Atualizado

### Título Dinâmico

```typescript
<h1 className="text-2xl font-semibold text-gray-900">
  {user?.role === 'manager' ? 'Cadastros' : 'Membros da Equipe'}
</h1>
<p className="text-sm text-muted-foreground mt-1">
  {user?.role === 'manager' 
    ? 'Gerencie empresas e usuários do sistema'
    : user?.role === 'leader'
    ? `Gerencie os membros da ${user.companyName}`
    : `Visualize os membros da ${user?.companyName}`
  }
</p>
```

### Tabs Condicionais

```typescript
{/* Tab List - apenas Manager vê tab Empresas */}
{user?.role === 'manager' ? (
  <TabsList className="grid w-full grid-cols-2 max-w-md">
    <TabsTrigger value="empresas">
      <Building className="h-4 w-4" />
      Empresas
    </TabsTrigger>
    <TabsTrigger value="usuarios">
      <Users className="h-4 w-4" />
      Usuários
    </TabsTrigger>
  </TabsList>
) : (
  <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-fit">
    <Users className="h-4 w-4 text-muted-foreground" />
    <span className="font-medium">Membros da Equipe</span>
  </div>
)}
```

### Tab Empresas Protegida

```typescript
{/* Tab Empresas - Apenas para Manager */}
{user?.role === 'manager' && (
  <TabsContent value="empresas" className="space-y-4">
    {/* ... conteúdo da tab empresas ... */}
  </TabsContent>
)}
```

### Alerta Informativo para Leaders

```typescript
{/* Alerta informativo para Leaders */}
{user?.role === 'leader' && filteredUsers.filter(u => u.addedViaRodada).length > 0 && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h3>Membros Adicionados via Rodadas</h3>
    <p>
      Quando você adiciona participantes em uma rodada, eles aparecem 
      automaticamente nesta lista. Use os badges para identificar status.
    </p>
  </div>
)}
```

---

## 🎨 Elementos Visuais por Role

### Manager
- ✅ Duas tabs: Empresas | Usuários
- ✅ Botão: "Novo Usuário"
- ✅ Coluna "Empresa" na tabela
- ✅ Sem dashboard de métricas
- ✅ Sem alerta sobre rodadas

### Leader
- ✅ Título fixo: "👥 Membros da Equipe"
- ✅ Dashboard com 4 cards de métricas
- ✅ Alerta informativo sobre rodadas (se houver)
- ✅ Botão: "Adicionar Membro"
- ❌ Sem coluna "Empresa" (redundante)
- ✅ Descrição: "Usuários adicionados em rodadas aparecem aqui automaticamente"

### Member
- ✅ Título fixo: "👥 Membros da Equipe"
- ❌ Sem dashboard
- ❌ Sem alerta
- ❌ Sem botão de adicionar
- ❌ Sem coluna "Empresa"
- ✅ Visualização read-only

---

## 🔐 Matriz de Permissões Atualizada

| Funcionalidade | Manager | Leader | Member |
|----------------|---------|--------|--------|
| **Ver Tab Empresas** | ✅ Sim | ❌ Não | ❌ Não |
| **Criar Empresa** | ✅ Sim | ❌ Não | ❌ Não |
| **Editar Empresa** | ✅ Sim | ❌ Não | ❌ Não |
| **Ver Todas Empresas** | ✅ Sim | ❌ Não | ❌ Não |
| **Ver Tab Usuários** | ✅ Sim | N/A* | N/A* |
| **Ver Lista Membros** | ✅ Todos | ✅ Sua empresa | ✅ Sua empresa |
| **Dashboard Métricas** | ❌ Não | ✅ Sim | ❌ Não |
| **Alerta Rodadas** | ❌ Não | ✅ Sim (se houver) | ❌ Não |
| **Adicionar Membro** | ✅ Sim | ✅ Sim | ❌ Não |
| **Editar Membro** | ✅ Sim | ✅ Sua empresa | ❌ Não |
| **Coluna Empresa** | ✅ Visível | ❌ Oculta | ❌ Oculta |

*N/A = Não aplicável (Leaders/Members não veem tabs, vão direto para lista)

---

## 🎯 Fluxos de Uso Corrigidos

### Fluxo 1: Manager Cadastra Nova Empresa

```
1. Login como Manager
2. Menu: Cadastros
3. Tab: Empresas ✓
4. Botão: [+ Nova Empresa]
5. Preencher formulário
6. Salvar
```

### Fluxo 2: Leader Adiciona Membro

```
1. Login como Leader
2. Menu: Cadastros (ou "Membros da Equipe")
3. Ver automaticamente lista de membros ✓
4. Dashboard mostra: 8 total, 3 nunca logaram
5. Botão: [+ Adicionar Membro]
6. Preencher nome, email
7. Membro criado com role 'member' e companyId automático
```

### Fluxo 3: Leader Adiciona via Rodada

```
1. Login como Leader
2. Menu: Rodadas
3. Criar Nova Rodada
4. Adicionar emails: carlos@empresa.com, maria@empresa.com
5. Sistema cria usuários automaticamente:
   - carlos@empresa.com (addedViaRodada: true, invitedBy: "João Silva")
   - maria@empresa.com (addedViaRodada: true, invitedBy: "João Silva")
6. Menu: Cadastros
7. Ver usuários com badge [Rodada]
8. Ver alerta: "Membros Adicionados via Rodadas"
9. Dashboard mostra: +2 "Nunca logaram", +2 "Via Rodada"
```

### Fluxo 4: Member Consulta Equipe

```
1. Login como Member
2. Menu: Cadastros
3. Ver lista de colegas (read-only) ✓
4. Identificar líder(es)
5. Ver quem está na equipe
[Sem opção de editar ou adicionar]
```

---

## 🧪 Testes de Validação

### Teste 1: Leader NÃO vê tab Empresas

**Setup:** Login como Leader

**Esperado:**
- ❌ Tab "Empresas" não existe
- ✅ Vê apenas "👥 Membros da Equipe"
- ✅ Título é "Membros da Equipe", não "Cadastros"
- ✅ Descrição: "Gerencie os membros da TechCorp Brasil"

### Teste 2: Manager vê ambas as tabs

**Setup:** Login como Manager

**Esperado:**
- ✅ Tab "Empresas" existe
- ✅ Tab "Usuários" existe
- ✅ Título é "Cadastros"
- ✅ Pode criar empresa
- ✅ Pode criar usuário em qualquer empresa

### Teste 3: Dashboard apenas para Leaders

**Setup:** 
- Login como Leader → Ver dashboard ✓
- Login como Manager → NÃO ver dashboard
- Login como Member → NÃO ver dashboard

### Teste 4: Alerta de Rodadas

**Setup:** Login como Leader com membros adicionados via rodada

**Esperado:**
- ✅ Alerta azul aparece
- ✅ Texto: "Membros Adicionados via Rodadas"
- ✅ Explicação sobre badges
- ✅ Exemplos visuais de badges

**Setup:** Login como Leader sem membros via rodada

**Esperado:**
- ❌ Alerta NÃO aparece

---

## 📊 Comparação Antes/Depois

### Manager (sem mudanças)
| Aspecto | Antes | Depois |
|---------|-------|--------|
| Tabs | Empresas, Usuários Admins | Empresas, Usuários |
| Empresas | ✅ Gerencia todas | ✅ Gerencia todas |
| Usuários | ✅ Gerencia todos | ✅ Gerencia todos |
| Dashboard | ❌ Não | ❌ Não |

### Leader (GRANDE MUDANÇA)
| Aspecto | Antes | Depois |
|---------|-------|--------|
| Tab Empresas | ❌ Via (incorreto) | ✅ Não vê (correto) |
| Tab Usuários | ✅ Via "Usuários Admins" | ✅ Lista direta |
| Título | "Cadastros" | "Membros da Equipe" |
| Dashboard | ❌ Não | ✅ SIM (4 cards) |
| Alerta Rodadas | ❌ Não | ✅ SIM (condicional) |
| Botão Adicionar | "Novo Usuário" | "Adicionar Membro" |
| Coluna Empresa | ✅ Via (desnecessária) | ❌ Oculta (correto) |

### Member (sem mudanças funcionais)
| Aspecto | Antes | Depois |
|---------|-------|--------|
| Acesso | Read-only | Read-only |
| Título | "Cadastros" | "Membros da Equipe" |

---

## 💡 Benefícios da Correção

### 1. Clareza de Responsabilidades
- ✅ **Manager** = Sistema completo
- ✅ **Leader** = Apenas equipe
- ✅ **Member** = Apenas visualização

### 2. Interface Mais Intuitiva
- ✅ Leaders não veem opções que não podem usar
- ✅ Títulos refletem o que o usuário realmente faz
- ✅ Dashboard aparece para quem precisa (Leaders)

### 3. Prevenção de Erros
- ✅ Impossível Leader tentar criar empresa
- ✅ Impossível Member tentar editar
- ✅ Menos confusão sobre permissões

### 4. Melhor Experiência
- ✅ Leaders veem métricas de equipe imediatamente
- ✅ Alerta contextual sobre rodadas
- ✅ Menos cliques para acessar informações

---

## 🔄 Integração com Rodadas

### Como Funciona (Correto)

```typescript
// Quando Leader cria rodada e adiciona emails
const criarRodada = async (emails: string[]) => {
  for (const email of emails) {
    const existingUser = await getUser(email);
    
    if (!existingUser) {
      // Criar novo membro automaticamente
      await createUser({
        email,
        name: extractNameFromEmail(email),
        role: 'member',  // ← Sempre member
        companyId: currentUser.companyId,  // ← Mesma empresa do leader
        hasLoggedIn: false,
        addedViaRodada: true,
        invitedBy: currentUser.name
      });
    }
    
    // Adicionar à rodada
    await addParticipante(rodadaId, email);
  }
};
```

### Onde Aparecem

1. **Em Rodadas:**
   - Lista de participantes da rodada
   - Status: Pendente/Respondendo/Concluído

2. **Em Cadastros:**
   - Lista de membros da equipe
   - Badge [Rodada]
   - Badge "Nunca logou" (se ainda não acessou)
   - Dashboard: Contabilizados em "Via Rodada" e "Nunca logaram"

---

## 📁 Arquivos Modificados

1. ✅ `/components/CadastrosManagement.tsx`
   - Tabs condicionais por role
   - Títulos dinâmicos
   - Dashboard para Leaders
   - Alerta sobre rodadas
   - Proteção da tab Empresas
   - Coluna Empresa condicional

2. ✅ `/README_CADASTROS_CORRECAO.md`
   - Esta documentação

---

## 🎯 Checklist Final

- [x] Manager vê tabs Empresas e Usuários
- [x] Leader NÃO vê tab Empresas
- [x] Leader vê apenas membros de sua empresa
- [x] Leader vê dashboard com 4 métricas
- [x] Leader vê alerta sobre rodadas (se aplicável)
- [x] Member vê apenas membros (read-only)
- [x] Títulos adaptados por role
- [x] Descrições adaptadas por role
- [x] Botões adaptados por role
- [x] Coluna "Empresa" oculta para Leaders/Members
- [x] Tab empresas protegida (apenas Manager)
- [x] Nomenclatura correta ("Membros da Equipe" vs "Cadastros")

---

## 🚀 Próximos Passos (Opcionais)

### 1. Renomear Menu para Leaders

Atualmente: Menu "Cadastros"  
Proposta: Menu "Equipe" ou "Membros"

```typescript
// AppSidebar.tsx
{
  title: user?.role === 'manager' ? 'Cadastros' : 'Equipe',
  url: 'personas',
  icon: user?.role === 'manager' ? Database : Users,
  show: true,
}
```

### 2. Separar Componentes

Criar componentes específicos:
- `EmpresasManagement.tsx` (apenas Manager)
- `EquipeManagement.tsx` (Leaders e Members)

### 3. Notificações para Leaders

Quando membro adicionado via rodada faz primeiro login:
- Notificação para Leader
- "Carlos Mendes fez login pela primeira vez!"

---

**Status:** ✅ **Corrigido e Documentado**  
**Versão:** 2.0  
**Data:** Outubro 2025  
**Mudanças:** Separação clara de responsabilidades, interface adaptativa, dashboard para Leaders
