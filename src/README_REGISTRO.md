# 📝 Sistema de Registro de Usuários - QualityMap App

## 🎯 Visão Geral

Sistema completo de registro de novos usuários com validação de dados, criação automática de empresas e integração com o sistema de autenticação.

---

## ✨ Funcionalidades Implementadas

### 1. **Formulário de Registro**

**Componente:** `/components/Register.tsx`

**Campos do Formulário:**
- ✅ Nome completo (mínimo 2 caracteres)
- ✅ Email (validação de formato)
- ✅ Nome da Empresa (mínimo 2 caracteres, não pode ser apenas números)
- ✅ Senha (mínimo 6 caracteres)
- ✅ Confirmação de Senha

**Validações em Tempo Real:**
- Validação ao sair do campo (onBlur)
- Validação ao digitar (onChange)
- Feedback visual imediato (bordas vermelhas/verdes)
- Mensagens de erro específicas para cada campo

---

## 🏢 Lógica de Empresas

### Criação/Associação Automática

**Quando um usuário se registra:**

1. **Empresa Nova**
   - Se o nome da empresa não existe → cria nova empresa
   - Usuário vira **Leader** da empresa
   - Empresa recebe ID único: `company-{timestamp}`
   - Leader ID é automaticamente atribuído ao usuário

2. **Empresa Existente**
   - Se o nome da empresa já existe → associa à empresa existente
   - Usuário vira **Member** da empresa
   - Empresa não é modificada
   - Leader existente permanece inalterado

**Exemplo de Fluxo:**

```typescript
// Primeiro usuário da "TechCorp"
{
  name: "João Silva",
  email: "joao@techcorp.com",
  companyName: "TechCorp",
  password: "senha123"
}
// Resultado: João vira Leader da nova empresa TechCorp

// Segundo usuário da "TechCorp"
{
  name: "Maria Santos",
  email: "maria@techcorp.com",
  companyName: "TechCorp",  // ← Mesmo nome!
  password: "senha456"
}
// Resultado: Maria vira Member da TechCorp (João continua Leader)
```

---

## 👥 Sistema de Roles (Funções)

### Leader (Líder da Empresa)

**Quando se torna Leader:**
- Primeiro usuário a registrar uma empresa

**Permissões:**
```typescript
{
  canViewAllCompanies: false,      // Vê apenas sua empresa
  canImportData: false,            // Não pode importar dados
  canViewResults: true,            // Pode ver resultados
  canInviteMembers: true,          // Pode convidar membros
  canEditMemberPermissions: true,  // Pode editar permissões
  canViewProgress: true            // Pode ver progresso
}
```

### Member (Membro da Equipe)

**Quando se torna Member:**
- Usuários subsequentes que se registram em empresa existente

**Permissões:**
```typescript
{
  canViewAllCompanies: false,      // Vê apenas sua empresa
  canImportData: false,            // Não pode importar dados
  canViewResults: true,            // Pode ver resultados
  canInviteMembers: false,         // NÃO pode convidar membros
  canEditMemberPermissions: false, // NÃO pode editar permissões
  canViewProgress: false           // NÃO pode ver progresso
}
```

### Manager (Gerente do Sistema)

**Nota:** Não pode ser criado via registro. Apenas usuários pré-existentes (admin@qualitymap.app)

---

## 🔐 Validações Implementadas

### 1. **Validação de Email**

```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

**Regras:**
- ✅ Formato válido: usuario@dominio.com
- ❌ Email duplicado: verifica se já existe
- ✅ Case-insensitive: converte para lowercase

**Exemplos:**

| Email | Válido? | Motivo |
|-------|---------|--------|
| `joao@empresa.com` | ✅ | Formato correto |
| `maria@empresa` | ❌ | Falta domínio |
| `@empresa.com` | ❌ | Falta usuário |
| `joao@` | ❌ | Falta domínio |
| `joao empresa@test.com` | ❌ | Contém espaço |

---

### 2. **Validação de Nome da Empresa**

```typescript
const validateCompanyName = (name: string): boolean => {
  if (name.trim().length < 2) return false;
  if (/^\d+$/.test(name.trim())) return false; // Não pode ser só números
  return true;
};
```

**Regras:**
- ✅ Mínimo 2 caracteres
- ❌ Não pode ser apenas números
- ✅ Pode conter letras, números e caracteres especiais
- ✅ Espaços são permitidos

**Exemplos:**

| Nome da Empresa | Válido? | Motivo |
|-----------------|---------|--------|
| `TechCorp` | ✅ | Nome válido |
| `Tech Corp Brasil` | ✅ | Espaços permitidos |
| `Tech123` | ✅ | Mix de letras e números |
| `123` | ❌ | Apenas números |
| `T` | ❌ | Menos de 2 caracteres |
| `  ` | ❌ | Apenas espaços |

---

### 3. **Validação de Senha**

```typescript
const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
```

**Regras:**
- ✅ Mínimo 6 caracteres
- ✅ Qualquer combinação de caracteres
- ✅ Confirmação de senha deve coincidir

---

### 4. **Validação de Nome**

**Regras:**
- ✅ Mínimo 2 caracteres
- ✅ Qualquer combinação de caracteres

---

## 🎨 Design e UX

### Layout

**Estrutura:**
- **Lado Esquerdo (55%):** Branding e benefícios
- **Lado Direito (45%):** Formulário de registro

**Cores:**
- Verde primário: `#16a34a` (diferente do login que é azul)
- Gradiente: `from-[#16a34a] via-[#15803d] to-[#166534]`

### Feedback Visual

**Estados dos Campos:**

1. **Normal:**
   ```css
   border: 2px solid #e5e7eb (gray-200)
   ```

2. **Foco:**
   ```css
   border: 2px solid #16a34a (verde)
   ```

3. **Erro:**
   ```css
   border: 2px solid #fca5a5 (red-300)
   ```

4. **Válido:**
   ```css
   border: 2px solid #16a34a (verde)
   ```

### Mensagens de Erro

**Formato:**
```tsx
<p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
  <AlertCircle className="h-3 w-3" />
  Mensagem de erro específica
</p>
```

**Mensagens por Campo:**

| Campo | Erro | Mensagem |
|-------|------|----------|
| Nome | Muito curto | "Nome deve ter pelo menos 2 caracteres" |
| Email | Formato inválido | "Email inválido" |
| Email | Duplicado | "Este email já está em uso" |
| Empresa | Muito curto | "Nome da empresa deve ter pelo menos 2 caracteres" |
| Empresa | Apenas números | "Nome da empresa não pode ser apenas números" |
| Senha | Muito curta | "Senha deve ter pelo menos 6 caracteres" |
| Confirmar Senha | Não coincide | "As senhas não coincidem" |

---

## 🔄 Fluxo de Navegação

### 1. Tela de Login

```
Login.tsx
  └─ Botão "Criar conta gratuita"
      └─ onShowRegister()
          └─ App.tsx: setShowRegister(true)
```

### 2. Tela de Registro

```
Register.tsx
  ├─ Botão "Voltar para Login"
  │   └─ onBackToLogin()
  │       └─ App.tsx: setShowRegister(false)
  │
  └─ Formulário de Registro
      └─ onSubmit()
          └─ AuthContext.register()
              └─ Login automático
                  └─ Redireciona para Dashboard
```

---

## 🗄️ Persistência de Dados

### LocalStorage

**Dados Salvos:**

1. **Usuários Registrados**
   ```typescript
   localStorage.setItem('qualitymap_users', JSON.stringify(users));
   ```

2. **Empresas Criadas**
   ```typescript
   localStorage.setItem('qualitymap_companies', JSON.stringify(companies));
   ```

3. **Usuário Atual (Sessão)**
   ```typescript
   localStorage.setItem('qualitymap_user', JSON.stringify(currentUser));
   ```

**Carregamento Inicial:**

```typescript
useEffect(() => {
  const storedUsers = localStorage.getItem('qualitymap_users');
  const storedCompanies = localStorage.getItem('qualitymap_companies');
  
  if (storedUsers) setUsers(JSON.parse(storedUsers));
  if (storedCompanies) setCompanies(JSON.parse(storedCompanies));
}, []);
```

---

## 🧪 Como Testar

### Teste 1: Criar Primeira Empresa

1. Clicar em "Criar conta gratuita" no Login
2. Preencher:
   - Nome: `João Silva`
   - Email: `joao@techcorp.com`
   - Empresa: `TechCorp Brasil`
   - Senha: `senha123`
   - Confirmar: `senha123`
3. Clicar em "Criar Conta"
4. ✅ **Verificar:**
   - Login automático
   - Usuário é Leader
   - Empresa "TechCorp Brasil" foi criada
   - Dashboard é exibido

### Teste 2: Adicionar Membro à Empresa Existente

1. Fazer logout
2. Clicar em "Criar conta gratuita"
3. Preencher:
   - Nome: `Maria Santos`
   - Email: `maria@techcorp.com`
   - Empresa: `TechCorp Brasil` ← **Mesmo nome!**
   - Senha: `senha456`
   - Confirmar: `senha456`
4. Clicar em "Criar Conta"
5. ✅ **Verificar:**
   - Login automático
   - Usuário é Member
   - Associado à empresa existente "TechCorp Brasil"
   - Vê apenas dados da TechCorp

### Teste 3: Validação de Email Duplicado

1. Tentar criar conta com email já existente
2. ✅ **Verificar:**
   - Mensagem de erro: "Este email já está em uso"
   - Toast de erro exibido
   - Formulário não é enviado

### Teste 4: Validação de Campos

1. Deixar campos em branco e clicar "Criar Conta"
2. ✅ **Verificar:**
   - Mensagens de erro em todos os campos obrigatórios
   - Bordas vermelhas nos campos com erro

3. Preencher senha curta (< 6 caracteres)
4. ✅ **Verificar:**
   - Erro: "Senha deve ter pelo menos 6 caracteres"

5. Senha e Confirmação diferentes
6. ✅ **Verificar:**
   - Erro: "As senhas não coincidem"

### Teste 5: Validação de Nome da Empresa

1. Nome apenas numérico: `12345`
2. ✅ **Verificar:**
   - Erro: "Nome da empresa não pode ser apenas números"

3. Nome muito curto: `A`
4. ✅ **Verificar:**
   - Erro: "Nome da empresa deve ter pelo menos 2 caracteres"

---

## 🔌 Integração com Supabase (Futuro)

### Migration para Produção

**Quando integrar com Supabase:**

```typescript
const register = async (data: RegisterData): Promise<boolean> => {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          company_name: data.companyName
        }
      }
    });

    if (authError) throw authError;

    // 2. Verificar se empresa existe
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', data.companyName)
      .single();

    let companyId: string;

    if (existingCompany) {
      // Empresa existe - associar usuário como member
      companyId = existingCompany.id;
    } else {
      // Criar nova empresa
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          leader_id: authData.user!.id,
          status: 'active'
        })
        .select()
        .single();

      if (companyError) throw companyError;
      companyId = newCompany.id;
    }

    // 3. Criar perfil do usuário
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user!.id,
        name: data.name,
        company_id: companyId,
        role: existingCompany ? 'member' : 'leader'
      });

    if (profileError) throw profileError;

    return true;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
};
```

---

## 📊 Estrutura de Dados

### User

```typescript
interface User {
  id: string;                    // user-{timestamp}
  email: string;                 // joao@techcorp.com
  name: string;                  // João Silva
  role: 'manager' | 'leader' | 'member';
  companyId?: string;            // company-{timestamp}
  companyName?: string;          // TechCorp Brasil
  permissions: {
    canViewAllCompanies: boolean;
    canImportData: boolean;
    canViewResults: boolean;
    canInviteMembers: boolean;
    canEditMemberPermissions: boolean;
    canViewProgress: boolean;
  };
}
```

### Company

```typescript
interface Company {
  id: string;           // company-{timestamp}
  name: string;         // TechCorp Brasil
  leaderId: string;     // ID do primeiro usuário (leader)
  createdAt: string;    // ISO timestamp
}
```

---

## 🎯 Benefícios do Sistema

### 1. **Unificação de Respostas**

Usuários da mesma empresa:
- ✅ Compartilham QualityScores
- ✅ Participam das mesmas Rodadas
- ✅ Veem resultados consolidados

### 2. **Detecção de Rodadas**

Quando usuário faz login:
```typescript
// Sistema verifica automaticamente
const activeRounds = rodadas.filter(r => 
  r.companyId === user.companyId &&
  r.status === 'ativa'
);

// Se houver rodadas, exibe convite para participar
```

### 3. **Onboarding Automático**

```typescript
if (user.role === 'leader') {
  // Primeiro acesso do Leader
  showWelcomeModal({
    title: "Bem-vindo ao QualityMap!",
    message: "Você é o líder da empresa. Comece criando uma rodada de avaliação."
  });
} else {
  // Membro entrando
  showWelcomeModal({
    title: "Bem-vindo à equipe!",
    message: `Você foi associado à ${user.companyName}. Aguarde convites para rodadas.`
  });
}
```

---

## ✅ Checklist de Implementação

- [x] Componente Register.tsx criado
- [x] Validação de email
- [x] Validação de nome da empresa
- [x] Validação de senha
- [x] Função register() no AuthContext
- [x] Criação automática de empresas
- [x] Associação automática a empresas existentes
- [x] Sistema de roles (Leader/Member)
- [x] Persistência em localStorage
- [x] Login automático após registro
- [x] Navegação Login ↔ Register
- [x] Feedback visual de erros
- [x] Mensagens de sucesso/erro (toasts)
- [x] Design responsivo
- [x] Documentação completa

---

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Verificação de Email**
   - Enviar email de confirmação
   - Ativar conta após verificação

2. **Convites por Email**
   - Leader pode convidar membros diretamente
   - Token de convite com expiração

3. **Integração Supabase**
   - Supabase Auth para autenticação
   - Row Level Security (RLS)
   - Políticas de acesso por empresa

4. **Onboarding Melhorado**
   - Tour guiado para novos usuários
   - Dicas contextuais
   - Wizard de configuração inicial

5. **Validações Avançadas**
   - Verificar domínio do email vs. empresa
   - Sugerir empresas similares (typos)
   - Força da senha (fraca/média/forte)

6. **Recuperação de Senha**
   - Fluxo de "Esqueceu a senha"
   - Email com link de reset
   - Expiração de tokens

---

**Status:** ✅ **Implementação Completa e Funcional**  
**Versão:** 1.0  
**Data:** Outubro 2025  
**Funcionalidades:** Registro, Validação, Auto-Associação de Empresas
