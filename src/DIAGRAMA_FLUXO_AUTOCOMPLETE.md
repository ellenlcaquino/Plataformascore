# 🔄 Diagrama de Fluxo Completo - Sistema de Autocomplete

## 📐 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUALITYMAP APP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   RODADAS       │◄────────────►│   CADASTROS     │          │
│  │                 │   Integração  │   (Personas)    │          │
│  │ • Nova Rodada   │   Bidirecional│                 │          │
│  │ • Participantes │              │ • Membros       │          │
│  │ • Autocomplete  │              │ • Edição        │          │
│  └────────┬────────┘              └────────┬────────┘          │
│           │                                │                   │
│           │         ┌──────────────────────┘                   │
│           │         │                                          │
│           ▼         ▼                                          │
│  ┌─────────────────────────────────────────────────┐          │
│  │          KV STORE (Database)                    │          │
│  │                                                 │          │
│  │  • users:{id}                                   │          │
│  │  • users_by_email:{email}                       │          │
│  │  • company_users:{companyId}  ◄── NOVO          │          │
│  │  • rodadas:{companyId}:{rodadaId}              │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Fluxo 1: Criar Rodada com Autocomplete

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO ABRE FORMULÁRIO                                      │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. NovaRodadaFormNew.tsx                                         │
│    • useUsersDB() carrega membros                                │
│    • GET /users                                                  │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. SERVIDOR RETORNA USUÁRIOS                                     │
│    • users = kv.getByPrefix('users:')                            │
│    • Retorna array com todos os usuários                         │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. FRONTEND FILTRA POR EMPRESA                                   │
│    • Se Leader: filter(u => u.companyId === user.companyId)     │
│    • Se Manager: mostra todos                                    │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. USUÁRIO DIGITA NO AUTOCOMPLETE                                │
│    • MemberAutocomplete recebe: users[], companyId, value        │
│    • Filtra: name/email/role.includes(searchTerm)                │
│    • Limita: .slice(0, 5)                                        │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. DROPDOWN MOSTRA SUGESTÕES                                     │
│    ┌────────────────────────────────────────┐                   │
│    │ [👤] João Silva                    [✓] │                   │
│    │      📧 joao@empresa.com               │                   │
│    │      💼 Desenvolvedor Frontend         │                   │
│    └────────────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 7. USUÁRIO SELECIONA                                             │
│    • onSelect(member) callback                                   │
│    • handleSelectMember() preenche campos                        │
│    • selectedMembers[index] = member.id                          │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 8. INTERFACE ATUALIZA                                            │
│    • Campos preenchidos: name, email, role                       │
│    • Badge verde: "Membro existente selecionado"                 │
│    • Avatar verde, campos destacados                             │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 9. USUÁRIO CLICA "CRIAR RODADA"                                  │
│    • Validações                                                  │
│    • POST /rodadas                                               │
│    • body: { participantes: [{name, email, role}] }             │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 10. SERVIDOR PROCESSA                                            │
│     Para cada participante:                                      │
│     ┌────────────────────────────────────────┐                  │
│     │ emailKey = users_by_email:{email}      │                  │
│     │ userId = kv.get(emailKey)              │                  │
│     │                                        │                  │
│     │ SE userId existe:                      │                  │
│     │   ✅ Reutilizar                        │                  │
│     │   • Atualizar dados se necessário      │                  │
│     │                                        │                  │
│     │ SE NÃO existe:                         │                  │
│     │   ✅ Criar novo                        │                  │
│     │   • kv.set(users:{id}, userData)       │                  │
│     │   • kv.set(users_by_email:{email}, id) │                  │
│     │   • Adicionar a company_users:{cId}    │                  │
│     └────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 11. CRIAR RODADA                                                 │
│     • kv.set(rodadas:{companyId}:{rodadaId}, rodadaData)        │
│     • rodadaData.participantes = [{ user_id, status, ... }]     │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 12. RESPOSTA AO FRONTEND                                         │
│     • 200 OK                                                     │
│     • { rodada: {...} }                                          │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 13. SUCESSO!                                                     │
│     • Toast: "Rodada criada com sucesso!"                        │
│     • Fechar modal                                               │
│     • Atualizar lista de rodadas                                 │
│     • Novos usuários agora em Cadastros                          │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo 2: Criar Novo Membro via Rodada

```
┌──────────────────────────────────────────────────────────────────┐
│ USUÁRIO DIGITA NOME NÃO ENCONTRADO                               │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ MemberAutocomplete                                               │
│ • filteredMembers = []                                           │
│ • Mostra: "Nenhum membro encontrado"                             │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ USUÁRIO PREENCHE MANUALMENTE                                     │
│ • Nome: Maria Santos                                             │
│ • Email: maria@empresa.com                                       │
│ • Função: Designer UX/UI                                         │
│ • selectedMembers[index] = null (não selecionado)                │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ INTERFACE MOSTRA                                                 │
│ • Badge azul: "Novo membro será criado"                          │
│ • Avatar cinza                                                   │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ CRIAR RODADA → POST /rodadas                                     │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ SERVIDOR VERIFICA EMAIL                                          │
│ • emailKey = users_by_email:maria@empresa.com                    │
│ • userId = kv.get(emailKey) → null ❌                            │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ CRIAR NOVO USUÁRIO                                               │
│ const newUser = {                                                │
│   id: crypto.randomUUID(),                                       │
│   email: 'maria@empresa.com',                                    │
│   name: 'Maria Santos',                                          │
│   role: 'Designer UX/UI',                                        │
│   companyId: 'company-001',                                      │
│   addedViaRodada: true,                                          │
│   invitedBy: 'leader-001'                                        │
│ }                                                                │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ SALVAR EM 3 LUGARES                                              │
│                                                                  │
│ 1. kv.set('users:user-456', newUser)                             │
│    ✅ Usuário principal                                          │
│                                                                  │
│ 2. kv.set('users_by_email:maria@...', 'user-456')               │
│    ✅ Índice para busca por email                                │
│                                                                  │
│ 3. company_users = kv.get('company_users:company-001')          │
│    company_users.push('user-456')                                │
│    kv.set('company_users:company-001', company_users)            │
│    ✅ Lista de usuários da empresa                               │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ ADICIONAR À RODADA                                               │
│ • rodada.participantes.push({ user_id: 'user-456', ... })       │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ LOGS                                                             │
│ ✅ Novo usuário criado: maria@empresa.com                        │
│ ✅ Nome: Maria Santos - Função: Designer UX/UI                   │
│ ✅ Usuário adicionado à lista da empresa                         │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ AGORA DISPONÍVEL                                                 │
│ • Em Cadastros (Personas)                                        │
│ • No autocomplete de próximas rodadas                            │
│ • Para edição de dados                                           │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 Estrutura de Dados no KV Store

```
KV STORE
├── users:{userId}
│   ├── users:user-123
│   │   └── { id, email, name, role, companyId, ... }
│   ├── users:user-456
│   │   └── { id, email, name, role, companyId, addedViaRodada: true }
│   └── users:user-789
│       └── { id, email, name, role, companyId, ... }
│
├── users_by_email:{email}  ← Índice para busca rápida
│   ├── users_by_email:joao@empresa.com → 'user-123'
│   ├── users_by_email:maria@empresa.com → 'user-456'
│   └── users_by_email:pedro@empresa.com → 'user-789'
│
├── company_users:{companyId}  ← NOVO - Lista de IDs
│   ├── company_users:company-001 → ['user-123', 'user-456', 'user-789']
│   ├── company_users:company-002 → ['user-100', 'user-101']
│   └── company_users:company-003 → ['user-200', 'user-201', 'user-202']
│
└── rodadas:{companyId}:{rodadaId}
    └── rodadas:company-001:rodada-abc
        └── {
              id: 'rodada-abc',
              company_id: 'company-001',
              rodada_participantes: [
                { user_id: 'user-123', status: 'pendente' },
                { user_id: 'user-456', status: 'pendente' }
              ]
            }
```

## 🔗 Relacionamentos

```
                    ┌──────────────┐
                    │   EMPRESA    │
                    │ company-001  │
                    └──────┬───────┘
                           │
                           │ tem
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
    ┌──────────────┐            ┌──────────────┐
    │   USUÁRIOS   │            │   RODADAS    │
    │              │            │              │
    │ • user-123   │◄───────────│ • rodada-abc │
    │ • user-456   │ participa  │ • rodada-def │
    │ • user-789   │            │              │
    └──────────────┘            └──────────────┘
            │
            │ cadastrado via
            │
            ▼
    ┌──────────────┐
    │  CADASTROS   │
    │  (Personas)  │
    │              │
    │ • Editar     │
    │ • Visualizar │
    │ • Gerenciar  │
    └──────────────┘
```

## 🎯 Pontos de Integração

```
┌─────────────────────────────────────────────────────────────┐
│                   PONTOS DE INTEGRAÇÃO                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. CRIAR RODADA COM PARTICIPANTE NOVO                       │
│    Rodadas → POST /rodadas → Cria usuário → Cadastros      │
│    ✅ Automático                                            │
│                                                             │
│ 2. BUSCAR PARTICIPANTE EXISTENTE                            │
│    Cadastros → GET /users → Autocomplete → Rodadas         │
│    ✅ Automático                                            │
│                                                             │
│ 3. ATUALIZAR DADOS DE PARTICIPANTE                          │
│    Cadastros → PUT /users → Atualiza em Rodadas            │
│    ⚠️ Funcionalidade futura                                 │
│                                                             │
│ 4. VISUALIZAR HISTÓRICO DE PARTICIPAÇÃO                     │
│    Cadastros → Lista rodadas do usuário                     │
│    ⚠️ Funcionalidade futura                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Performance

```
BUSCA DE AUTOCOMPLETE
┌────────────────────────────────────────────┐
│ 1. Frontend filtra localmente             │
│    • users[] já carregado                  │
│    • Filtro em memória (rápido)            │
│    • < 10ms                                │
│    ✅ SEM chamada ao servidor              │
└────────────────────────────────────────────┘

CRIAR RODADA COM NOVO MEMBRO
┌────────────────────────────────────────────┐
│ 1. Verificar email: kv.get()              │
│    • ~50ms                                 │
│                                            │
│ 2. Criar usuário: kv.set() x 3            │
│    • users:{id}                            │
│    • users_by_email:{email}                │
│    • company_users:{companyId}             │
│    • ~150ms total                          │
│                                            │
│ 3. Criar rodada: kv.set()                 │
│    • ~50ms                                 │
│                                            │
│ TOTAL: ~250ms                              │
│ ✅ Muito rápido!                           │
└────────────────────────────────────────────┘

REUTILIZAR MEMBRO EXISTENTE
┌────────────────────────────────────────────┐
│ 1. Verificar email: kv.get()              │
│    • ~50ms                                 │
│                                            │
│ 2. Criar rodada: kv.set()                 │
│    • ~50ms                                 │
│                                            │
│ TOTAL: ~100ms                              │
│ ✅ 60% mais rápido!                        │
└────────────────────────────────────────────┘
```

## ✅ Validações

```
FRONTEND
┌────────────────────────────────────────────┐
│ ✅ Empresa selecionada                     │
│ ✅ Data limite definida                    │
│ ✅ Pelo menos 1 participante               │
│ ✅ Nome preenchido                         │
│ ✅ Email válido (regex)                    │
│ ✅ Função preenchida                       │
└────────────────────────────────────────────┘
                 ↓
BACKEND
┌────────────────────────────────────────────┐
│ ✅ Email normalizado (lowercase)           │
│ ✅ Dados completos                         │
│ ✅ Verificação de duplicados               │
│ ✅ Indexação correta                       │
└────────────────────────────────────────────┘
```

---

**Este diagrama mostra o fluxo completo do sistema de autocomplete, desde a busca até a persistência dos dados, incluindo todas as integrações entre Rodadas e Cadastros.**
