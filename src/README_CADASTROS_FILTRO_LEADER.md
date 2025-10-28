# 👥 Cadastros Filtrados por Empresa - Sistema de Gestão de Membros

## 🎯 Visão Geral

Sistema aprimorado de cadastros que permite aos líderes visualizarem apenas os membros de sua empresa, incluindo identificação de status de login e origem do convite (via rodada).

---

## ✨ Funcionalidades Implementadas

### 1. **Filtro por Empresa baseado em Role**

**Manager (System Manager):**
- ✅ Vê **todas as empresas**
- ✅ Vê **todos os usuários** de todas as empresas
- ✅ Pode criar e editar qualquer empresa/usuário

**Leader (Líder da Empresa):**
- ✅ Vê **apenas sua empresa**
- ✅ Vê **apenas usuários de sua empresa**
- ✅ Pode criar e editar usuários de sua empresa
- ✅ Dashboard com estatísticas da equipe

**Member (Membro):**
- ✅ Vê **apenas sua empresa** (read-only)
- ✅ Vê **apenas usuários de sua empresa** (read-only)
- ❌ Não pode criar ou editar

---

## 🔐 Implementação do Filtro

### Código no CadastrosManagement.tsx

```typescript
// Filtrar usuários baseado no role do usuário logado
const filteredUsers = MOCK_ADMIN_USERS.filter(userItem => {
  // Manager vê todos os usuários
  if (user?.role === 'manager') {
    return userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.companyName.toLowerCase().includes(searchTerm.toLowerCase());
  }
  
  // Leader vê apenas usuários de sua empresa
  if (user?.role === 'leader') {
    return userItem.companyId === user.companyId &&
      (userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  
  // Member vê apenas usuários de sua empresa (read-only)
  return userItem.companyId === user?.companyId &&
    (userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()));
});
```

---

## 📊 Indicadores de Status de Login

### Campos Adicionados ao Interface

```typescript
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'leader' | 'member';
  companyId: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  hasLoggedIn: boolean;          // ← NOVO: Indica se já fez login alguma vez
  createdAt: string;
  addedViaRodada?: boolean;      // ← NOVO: Indica se foi adicionado via rodada
  invitedBy?: string;            // ← NOVO: Quem convidou
}
```

### Visual na Tabela

**Coluna "Status Login":**

| Status | Badge | Cor | Ícone |
|--------|-------|-----|-------|
| Já logou | `Logou` | Verde (bg-green-500) | `UserCheck` |
| Nunca logou | `Nunca logou` | Laranja (border-orange-300) | `UserX` |

**Tooltip ao passar o mouse:**
- Se logou: "Fez login pela primeira vez em [data]"
- Se nunca logou: "Convidado em [data] mas ainda não acessou o sistema"

---

## 🏷️ Identificação de Origem (Via Rodada)

### Badge "Rodada"

Usuários adicionados através de rodadas recebem um badge especial:

```tsx
{userItem.addedViaRodada && (
  <Tooltip>
    <TooltipTrigger>
      <Badge variant="outline" className="text-xs">
        Rodada
      </Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>Adicionado via rodada por {userItem.invitedBy}</p>
    </TooltipContent>
  </Tooltip>
)}
```

**Exemplo:**
```
Nome: Carlos Mendes [Rodada]
      ↑ Tooltip: "Adicionado via rodada por João Silva"
```

---

## 📈 Dashboard de Estatísticas (Leader)

### Cards de Métricas

Quando um **Leader** acessa a aba "Usuários", vê 4 cards de estatísticas:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     Total       │   Já logaram    │  Nunca logaram  │   Via Rodada    │
│       8         │       5         │       3         │       4         │
│   👥 Users      │  ✓ UserCheck    │   ✗ UserX       │    [R] Badge    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

**Cálculos:**
```typescript
Total: filteredUsers.length
Já logaram: filteredUsers.filter(u => u.hasLoggedIn).length
Nunca logaram: filteredUsers.filter(u => !u.hasLoggedIn).length
Via Rodada: filteredUsers.filter(u => u.addedViaRodada).length
```

---

## 🗂️ Dados de Exemplo (TechCorp Brasil)

### Leaders
```typescript
{
  id: '2',
  name: 'João Silva',
  role: 'leader',
  companyId: 'comp1',
  hasLoggedIn: true,
  lastLogin: '2024-03-15'
}

{
  id: '5',
  name: 'Ana Rodrigues',
  role: 'leader',
  companyId: 'comp1',
  hasLoggedIn: true,
  lastLogin: '2024-03-14'
}
```

### Members - Já Logaram
```typescript
{
  id: '3',
  name: 'Maria Santos',
  role: 'member',
  companyId: 'comp1',
  hasLoggedIn: true,
  lastLogin: '2024-03-15',
  addedViaRodada: false
}

{
  id: '4',
  name: 'Pedro Oliveira',
  role: 'member',
  companyId: 'comp1',
  hasLoggedIn: true,
  lastLogin: '2024-03-14',
  addedViaRodada: true,
  invitedBy: 'João Silva'
}
```

### Members - Nunca Logaram (Convidados via Rodada)
```typescript
{
  id: '6',
  name: 'Carlos Mendes',
  role: 'member',
  companyId: 'comp1',
  hasLoggedIn: false,
  addedViaRodada: true,
  invitedBy: 'João Silva'
}

{
  id: '7',
  name: 'Fernanda Costa',
  role: 'member',
  companyId: 'comp1',
  hasLoggedIn: false,
  addedViaRodada: true,
  invitedBy: 'Ana Rodrigues'
}

{
  id: '8',
  name: 'Ricardo Alves',
  role: 'member',
  companyId: 'comp1',
  hasLoggedIn: false,
  addedViaRodada: true,
  invitedBy: 'João Silva'
}
```

### Member Inativo
```typescript
{
  id: '9',
  name: 'Julia Ferreira',
  role: 'member',
  companyId: 'comp1',
  status: 'inactive',
  hasLoggedIn: true,
  lastLogin: '2024-01-30'
}
```

---

## 🎨 Layout da Tabela

### Para Manager (vê todas as empresas)

| Usuário | Empresa | Papel | Status Login | Status | Último acesso | Ações |
|---------|---------|-------|--------------|--------|---------------|-------|
| João Silva | TechCorp Brasil | Líder | ✓ Logou | Ativo | 15/03/2024 | ⋮ |
| Carlos [Rodada] | TechCorp Brasil | Membro | ✗ Nunca logou | Ativo | - | ⋮ |
| Marcos Dev | InnovateTech | Líder | ✓ Logou | Ativo | 13/03/2024 | ⋮ |

### Para Leader (vê apenas sua empresa)

| Usuário | Papel | Status Login | Status | Último acesso | Ações |
|---------|-------|--------------|--------|---------------|-------|
| João Silva | Líder | ✓ Logou | Ativo | 15/03/2024 | ⋮ |
| Maria Santos | Membro | ✓ Logou | Ativo | 15/03/2024 | ⋮ |
| Pedro [Rodada] | Membro | ✓ Logou | Ativo | 14/03/2024 | ⋮ |
| Carlos [Rodada] | Membro | ✗ Nunca logou | Ativo | - | ⋮ |
| Fernanda [Rodada] | Membro | ✗ Nunca logou | Ativo | - | ⋮ |
| Ricardo [Rodada] | Membro | ✗ Nunca logou | Ativo | - | ⋮ |

**Nota:** Coluna "Empresa" é omitida para Leaders (já sabem qual é)

---

## 🔄 Integração com Rodadas

### Como Funciona

1. **Leader cria uma rodada**
2. **Adiciona participantes** (emails)
3. **Sistema cria usuários automaticamente** (se não existirem)
4. **Marca como `addedViaRodada: true`**
5. **Define `invitedBy: [nome do leader]`**
6. **Define `hasLoggedIn: false`** inicialmente
7. **Usuário aparece na tela de Cadastros**

### Atualização de Status

Quando um usuário faz login pela primeira vez:

```typescript
// No login (AuthContext ou Supabase Auth)
const handleFirstLogin = (userId: string) => {
  // Atualizar usuário
  updateUser(userId, {
    hasLoggedIn: true,
    lastLogin: new Date().toISOString()
  });
};
```

---

## 🧪 Cenários de Teste

### Teste 1: Leader vê apenas sua empresa

**Setup:**
- Login como `joao.silva@techcorp.com.br` (Leader da TechCorp)

**Ações:**
1. Ir para menu "Cadastros"
2. Clicar na aba "Usuários"

**Esperado:**
- ✅ Dashboard com 4 cards de estatísticas
- ✅ Total: 8 usuários (apenas TechCorp)
- ✅ Já logaram: 5
- ✅ Nunca logaram: 3
- ✅ Via Rodada: 4
- ✅ NÃO aparecem usuários da InnovateTech

### Teste 2: Identificar usuários que nunca logaram

**Ações:**
1. Na lista de usuários, observar badges

**Esperado:**
- ✅ Carlos Mendes: Badge laranja "✗ Nunca logou"
- ✅ Fernanda Costa: Badge laranja "✗ Nunca logou"
- ✅ Ricardo Alves: Badge laranja "✗ Nunca logou"
- ✅ Maria Santos: Badge verde "✓ Logou"
- ✅ Pedro Oliveira: Badge verde "✓ Logou"

### Teste 3: Ver quem foi adicionado via rodada

**Ações:**
1. Observar badges "Rodada" ao lado dos nomes
2. Passar mouse sobre o badge

**Esperado:**
- ✅ Pedro Oliveira: Badge "Rodada" → Tooltip: "Adicionado via rodada por João Silva"
- ✅ Carlos Mendes: Badge "Rodada" → Tooltip: "Adicionado via rodada por João Silva"
- ✅ Fernanda Costa: Badge "Rodada" → Tooltip: "Adicionado via rodada por Ana Rodrigues"
- ✅ Maria Santos: SEM badge "Rodada"

### Teste 4: Manager vê todas as empresas

**Setup:**
- Login como `admin@qualitymap.app` (Manager)

**Ações:**
1. Ir para "Cadastros" → "Usuários"

**Esperado:**
- ✅ Vê usuários de **todas** as empresas
- ✅ TechCorp Brasil: 8 usuários
- ✅ InnovateTech Solutions: 2 usuários
- ✅ Coluna "Empresa" está visível
- ✅ NÃO aparecem cards de estatísticas (só para Leaders)

### Teste 5: Filtro de busca

**Ações:**
1. Como Leader da TechCorp
2. Buscar por "Carlos"

**Esperado:**
- ✅ Aparece apenas "Carlos Mendes"
- ✅ NÃO aparecem usuários de outras empresas com "Carlos" no nome

---

## 📋 Checklist de Implementação

- [x] Interface AdminUser atualizada com novos campos
- [x] Mock data expandido com exemplos de todos os status
- [x] Filtro por companyId para Leaders
- [x] Filtro por companyId para Members
- [x] Coluna "Status Login" adicionada
- [x] Badge "Logou" (verde) com tooltip
- [x] Badge "Nunca logou" (laranja) com tooltip
- [x] Badge "Rodada" com tooltip de quem convidou
- [x] Dashboard de estatísticas para Leaders
- [x] Ocultação da coluna "Empresa" para Leaders/Members
- [x] Título dinâmico baseado no role
- [x] Descrição dinâmica baseada no role
- [x] Mensagem "Nenhum usuário encontrado"
- [x] Importação de UserCheck e UserX icons
- [x] Importação de Tooltip components
- [x] Documentação completa

---

## 🚀 Próximos Passos (Integração com Supabase)

### 1. Atualizar Schema do Banco

```sql
ALTER TABLE user_profiles ADD COLUMN has_logged_in BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN added_via_rodada BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN invited_by VARCHAR(255);
```

### 2. Trigger para Primeiro Login

```sql
CREATE OR REPLACE FUNCTION update_first_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_login IS NOT NULL AND OLD.has_logged_in = FALSE THEN
    NEW.has_logged_in = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER first_login_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_first_login();
```

### 3. Função para Adicionar Usuário via Rodada

```typescript
const addUserViaRodada = async (
  email: string,
  name: string,
  companyId: string,
  invitedByName: string
) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      email,
      name,
      company_id: companyId,
      role: 'member',
      status: 'active',
      has_logged_in: false,
      added_via_rodada: true,
      invited_by: invitedByName
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### 4. Atualizar Componente Rodadas

Ao criar rodada e adicionar participantes:

```typescript
const handleAddParticipants = async (emails: string[]) => {
  for (const email of emails) {
    // Verificar se usuário já existe
    const existingUser = await getUser(email);
    
    if (!existingUser) {
      // Criar novo usuário marcado como via rodada
      await addUserViaRodada(
        email,
        extractNameFromEmail(email), // ou pedir nome
        user.companyId,
        user.name
      );
    }
  }
};
```

---

## 💡 Casos de Uso

### Caso 1: Leader Acompanha Onboarding

**Situação:**
- Leader criou rodada há 1 semana
- Adicionou 5 novos membros
- Quer saber quem já acessou

**Solução:**
1. Acessar "Cadastros" → "Usuários"
2. Ver dashboard:
   - Total: 10
   - Já logaram: 7
   - Nunca logaram: 3 ← **Atenção aqui!**
3. Identificar os 3 que nunca logaram
4. Enviar lembrete ou contato pessoal

### Caso 2: Manager Auditoria Geral

**Situação:**
- Manager quer ver engajamento geral
- Quantos usuários criados via rodada?
- Qual empresa tem mais usuários inativos?

**Solução:**
1. Acessar "Cadastros" → "Usuários"
2. Filtrar por empresa: "Todas"
3. Ordenar por "Status Login"
4. Ver badges "Rodada" e "Nunca logou"
5. Análise de engajamento por empresa

### Caso 3: Leader Identifica Fonte

**Situação:**
- Leader vê usuário novo na lista
- Não lembra de ter criado
- Quer saber de onde veio

**Solução:**
1. Ver badge "Rodada" ao lado do nome
2. Passar mouse → Tooltip: "Adicionado via rodada por Ana Rodrigues"
3. Entender que foi co-leader que adicionou

---

## 🎯 Benefícios

### Para Leaders

✅ **Visibilidade clara** dos membros da equipe  
✅ **Acompanhamento de onboarding** (quem já acessou)  
✅ **Rastreabilidade** de origem dos convites  
✅ **Dashboard de métricas** rápidas  
✅ **Foco apenas em sua empresa** (sem poluição)

### Para Managers

✅ **Visão global** de todas as empresas  
✅ **Auditoria completa** de usuários  
✅ **Análise de engajamento** por empresa  
✅ **Gestão centralizada** do sistema

### Para Members

✅ **Transparência** sobre colegas de equipe  
✅ **Visualização** de estrutura da empresa  
✅ **Acesso read-only** seguro

---

**Status:** ✅ **Implementação Completa**  
**Versão:** 1.0  
**Data:** Outubro 2025  
**Funcionalidades:** Filtro por empresa, Status de login, Origem via rodada, Dashboard para Leaders
