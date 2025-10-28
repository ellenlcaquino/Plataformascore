# Sistema Completo de Participantes em Rodadas

## 📋 Visão Geral

Implementação de um formulário completo para adicionar participantes em rodadas de avaliação, com cadastro automático de usuários incluindo **Nome**, **E-mail** e **Função**.

## 🎯 Requisitos Implementados

### 1. Campos Obrigatórios para Participantes

Cada participante agora deve ter:
- ✅ **Nome completo** - Campo de texto obrigatório
- ✅ **E-mail** - Campo de email obrigatório com validação
- ✅ **Função/Cargo** - Campo de texto obrigatório (ex: "Desenvolvedor", "Designer", "Gerente")

### 2. Criação Automática de Usuários

Quando uma rodada é criada:
- ✅ O sistema verifica se o email já existe no banco
- ✅ Se não existe, cria automaticamente um novo usuário
- ✅ Se existe, atualiza os dados (nome e função) se fornecidos
- ✅ O usuário é marcado como `addedViaRodada: true`
- ✅ Registra quem convidou (`invitedBy`)

### 3. Interface Melhorada

- ✅ Formulário card-based para cada participante
- ✅ Botão "Adicionar" para novos participantes
- ✅ Botão "Remover" (X) para excluir participantes
- ✅ Validação de email em tempo real
- ✅ Mensagens claras de erro
- ✅ Ícones visuais para melhor UX

## 📁 Arquivos Modificados

### 1. Novo Componente: `/components/NovaRodadaFormNew.tsx`

Componente separado com o novo formulário completo:

```typescript
interface ParticipanteForm {
  name: string;    // Nome completo
  email: string;   // Email
  role: string;    // Função/Cargo
}
```

**Recursos:**
- Estado local para lista de participantes
- Funções para adicionar/remover participantes
- Validação de email com regex
- Formulário responsivo com scroll
- Cards visuais para cada participante

### 2. Atualizado: `/components/Rodadas.tsx`

- ✅ Import do novo componente `NovaRodadaFormNew`
- ✅ Removida definição antiga do formulário
- ✅ Mantida integração com banco de dados

### 3. Atualizado: `/supabase/functions/server/index.tsx`

**Lógica de criação/atualização de usuários:**

```typescript
// Verificar se usuário existe
const emailKey = `users_by_email:${p.email.toLowerCase()}`;
const existingUserId = await kv.get(emailKey);

if (existingUserId) {
  // Atualizar dados se fornecidos
  const existingUser = await kv.get(`users:${existingUserId}`);
  const updatedUser = {
    ...existingUser,
    name: p.name || existingUser.name,
    role: p.role || existingUser.role,
  };
  await kv.set(`users:${existingUserId}`, updatedUser);
} else {
  // Criar novo usuário
  const newUser = {
    id: userId,
    email: p.email.toLowerCase(),
    name: p.name || p.email.split('@')[0],
    role: p.role || 'member',
    companyId: body.company_id,
    addedViaRodada: true,
    invitedBy: body.created_by,
    // ...
  };
  await kv.set(`users:${userId}`, newUser);
  await kv.set(emailKey, userId);
}
```

## 🎨 Interface do Novo Formulário

### Antes
```
┌─────────────────────────────────────┐
│ Participantes (emails por linha)   │
│ ┌─────────────────────────────────┐ │
│ │ email1@empresa.com              │ │
│ │ email2@empresa.com              │ │
│ │ email3@empresa.com              │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Depois
```
┌─────────────────────────────────────┐
│ Participantes         [+ Adicionar] │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 👤 Nome completo *          ❌ │   │
│ │    Email *                    │   │
│ │    Função/Cargo *             │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 👤 Nome completo *          ❌ │   │
│ │    Email *                    │   │
│ │    Função/Cargo *             │   │
│ └───────────────────────────────┘   │
│                                     │
│ * Todos os campos são obrigatórios  │
│ Os usuários serão criados           │
│ automaticamente se não existirem    │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Criação de Rodada

### 1. Frontend (NovaRodadaFormNew.tsx)

```typescript
// Usuário preenche o formulário
const participantes = [
  {
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Desenvolvedor Frontend"
  },
  {
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Designer UX/UI"
  }
];

// Validações
- ✅ Todos os campos preenchidos
- ✅ Emails válidos (regex)
- ✅ Data limite definida
- ✅ Empresa selecionada

// Envio para servidor
POST /rodadas
{
  company_id: "company-001",
  due_date: "2024-02-14",
  participantes: [
    { name: "João Silva", email: "joao@empresa.com", role: "Desenvolvedor Frontend" },
    { name: "Maria Santos", email: "maria@empresa.com", role: "Designer UX/UI" }
  ]
}
```

### 2. Backend (index.tsx)

```typescript
// Para cada participante
for (const p of body.participantes) {
  const email = p.email.toLowerCase();
  
  // Verificar se usuário existe
  const existingUserId = await kv.get(`users_by_email:${email}`);
  
  if (existingUserId) {
    // Atualizar usuário existente
    console.log('✅ Usuário já existe:', email);
    // Atualizar nome/role se fornecidos
  } else {
    // Criar novo usuário
    const newUser = {
      id: crypto.randomUUID(),
      email: email,
      name: p.name,
      role: p.role,
      companyId: body.company_id,
      addedViaRodada: true,
      invitedBy: body.created_by,
      hasLoggedIn: false
    };
    
    await kv.set(`users:${userId}`, newUser);
    await kv.set(`users_by_email:${email}`, userId);
    console.log('✅ Novo usuário criado:', email, '- Nome:', p.name, '- Função:', p.role);
  }
  
  // Adicionar à rodada
  participantes.push({
    id: crypto.randomUUID(),
    user_id: userId,
    name: p.name,
    email: p.email,
    role: p.role,
    status: 'pendente',
    progress: 0
  });
}
```

### 3. Resultado

```typescript
// Rodada criada com participantes completos
{
  id: "rodada-xxx",
  company_id: "company-001",
  participantes: [
    {
      id: "part-1",
      user_id: "user-1",
      name: "João Silva",
      email: "joao@empresa.com",
      role: "Desenvolvedor Frontend",
      status: "pendente",
      progress: 0
    },
    {
      id: "part-2",
      user_id: "user-2",
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "Designer UX/UI",
      status: "pendente",
      progress: 0
    }
  ]
}
```

## ✅ Validações Implementadas

### No Frontend

1. **Campos obrigatórios**
   ```typescript
   if (!p.name.trim() || !p.email.trim() || !p.role.trim()) {
     toast.error('Todos os campos são obrigatórios');
     return;
   }
   ```

2. **Email válido**
   ```typescript
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(p.email)) {
     toast.error(`Email inválido: ${p.email}`);
     return;
   }
   ```

3. **Pelo menos um participante**
   ```typescript
   if (participantesValidos.length === 0) {
     toast.error('Adicione pelo menos um participante');
     return;
   }
   ```

### No Backend

1. **Email normalizado**
   ```typescript
   email: p.email.toLowerCase().trim()
   ```

2. **Dados fallback**
   ```typescript
   name: p.name || p.email.split('@')[0]
   role: p.role || 'member'
   ```

## 📊 Estrutura de Dados

### Usuário Criado via Rodada

```typescript
{
  id: "user-uuid",
  email: "joao@empresa.com",
  name: "João Silva",
  role: "Desenvolvedor Frontend",
  companyId: "company-001",
  companyName: "TechCorp Brasil",
  hasLoggedIn: false,
  addedViaRodada: true,
  invitedBy: "leader-001",
  createdAt: "2024-01-27T10:30:00Z"
}
```

### Participante na Rodada

```typescript
{
  id: "participante-uuid",
  user_id: "user-uuid",
  rodada_id: "rodada-uuid",
  name: "João Silva",
  email: "joao@empresa.com",
  role: "Desenvolvedor Frontend",
  status: "pendente",
  progress: 0,
  can_view_results: false,
  last_activity: null,
  completed_date: null
}
```

## 🎯 Benefícios

### 1. **Dados Mais Ricos**
- Nome real em vez de apenas email
- Função/cargo para melhor contexto
- Informações completas desde o início

### 2. **Melhor UX**
- Interface visual clara
- Validação em tempo real
- Mensagens de erro específicas

### 3. **Automação Completa**
- Usuários criados automaticamente
- Sem necessidade de cadastro prévio
- Atualização inteligente de dados

### 4. **Rastreabilidade**
- Sabe quem convidou cada usuário
- Data de criação registrada
- Flag `addedViaRodada` para filtros

## 🧪 Como Testar

### 1. Criar Nova Rodada

1. Navegar para "Rodadas"
2. Clicar em "Nova Rodada"
3. Preencher dados da rodada:
   - Empresa (se Manager)
   - Data Limite
   - Critério de Encerramento

### 2. Adicionar Participantes

1. Preencher primeiro participante:
   ```
   Nome: João Silva
   Email: joao@empresa.com
   Função: Desenvolvedor Frontend
   ```

2. Clicar em "+ Adicionar" para mais participantes

3. Remover participantes clicando no "X" se necessário

### 3. Criar e Verificar

1. Clicar em "Criar Rodada"
2. Verificar console para logs:
   ```
   📝 Criando rodada com participantes: {...}
   ✅ Novo usuário criado: joao@empresa.com - Nome: João Silva - Função: Desenvolvedor Frontend
   ✅ Rodada criada com sucesso
   ```

3. Verificar lista de rodadas atualizada
4. Ver participantes com nomes completos

### 4. Testar Usuário Existente

1. Criar outra rodada com mesmo email
2. Verificar console:
   ```
   ✅ Usuário já existe: joao@empresa.com
   ✅ Dados do usuário atualizados: joao@empresa.com
   ```

## 📝 Logs para Debug

### Criação Bem-Sucedida

```
📝 Iniciando criação de rodada...
📝 Criando rodada com participantes: {
  company_id: "company-001",
  participantes: [
    { name: "João Silva", email: "joao@empresa.com", role: "Desenvolvedor" }
  ]
}
📝 Processing participant (SQL): { name: "João Silva", email: "joao@empresa.com", role: "Desenvolvedor" }
✅ Novo usuário criado: joao@empresa.com - Nome: João Silva - Função: Desenvolvedor
✅ Added participants: 1
📝 Response status: 200
✅ Rodada criada com sucesso: { rodada: {...} }
```

### Usuário Já Existe

```
📝 Processing participant: { name: "João Silva", email: "joao@empresa.com", role: "Senior Developer" }
✅ Usuário já existe: joao@empresa.com
✅ Dados do usuário atualizados: joao@empresa.com
```

### Email Inválido

```
❌ Email inválido: joao@empresa
```

## 🚨 Troubleshooting

### Problema: "Adicione pelo menos um participante"

**Causa:** Todos os campos não foram preenchidos  
**Solução:** Preencher Nome, Email E Função para todos os participantes

### Problema: "Email inválido"

**Causa:** Email não segue formato válido  
**Solução:** Usar formato `usuario@dominio.com`

### Problema: Participante aparece como "Carregando..."

**Causa:** Nome não foi salvo corretamente  
**Solução:** Verificar logs do servidor e garantir que `p.name` está sendo enviado

## 🎉 Resultado Final

Ao criar uma rodada, cada participante agora aparece com:

```
┌─────────────────────────────────────────┐
│ 👤 João Silva                          │
│    member                              │
│    joao@empresa.com                    │
│    ⏱️  Pendente         Progresso  0%   │
│    🔒 Acesso aos Resultados: Restrito  │
│    [📧 Lembrete]                       │
└─────────────────────────────────────────┘
```

Em vez de:

```
┌─────────────────────────────────────────┐
│ ?? Carregando...                       │
│    member                              │
│    ⏱️  Pendente         Progresso  0%   │
└─────────────────────────────────────────┘
```

---

**Data:** 27/10/2025  
**Versão:** QualityMap App v2.0  
**Status:** ✅ Implementado e Testado
