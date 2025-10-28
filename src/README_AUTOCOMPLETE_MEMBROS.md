# Sistema de Autocomplete para Membros em Rodadas

## 🎯 Objetivo

Implementar um sistema de autocomplete inteligente que permite buscar e reutilizar membros já cadastrados ao criar rodadas, evitando duplicações e facilitando o processo de criação.

## ✨ Funcionalidades Implementadas

### 1. **Busca Inteligente de Membros**
- ✅ Autocomplete com busca em tempo real
- ✅ Busca por nome, email ou função
- ✅ Filtro automático por empresa (apenas membros da mesma empresa)
- ✅ Limitado a 5 sugestões mais relevantes
- ✅ Indicador visual de quantos membros foram encontrados

### 2. **Preenchimento Automático**
- ✅ Ao selecionar um membro existente, preenche automaticamente:
  - Nome completo
  - Email
  - Função/Cargo
- ✅ Indicador visual mostrando se é membro existente ou novo
- ✅ Permite edição manual após seleção

### 3. **Criação de Novos Membros**
- ✅ Se não encontrar, permite criar novo membro
- ✅ Mensagem clara quando nenhum membro é encontrado
- ✅ Novo membro é criado automaticamente na seção de Cadastros

### 4. **UX Otimizada**
- ✅ Dropdown elegante com informações completas
- ✅ Ícones visuais para fácil identificação
- ✅ Fecha ao clicar fora
- ✅ Dica contextual sobre como usar o autocomplete

## 📁 Arquivos Criados/Modificados

### 1. Novo: `/components/MemberAutocomplete.tsx`

Componente reutilizável de autocomplete para membros:

```typescript
interface MemberAutocompleteProps {
  companyId: string;        // ID da empresa para filtrar membros
  members: UserType[];      // Lista de todos os membros
  value: string;            // Valor atual do input
  onSelect: (member: UserType) => void;  // Callback ao selecionar
  onChange: (value: string) => void;     // Callback ao digitar
  placeholder?: string;
  disabled?: boolean;
}
```

**Recursos:**
- Busca case-insensitive
- Filtro por empresa automático
- Debounce implícito (mínimo 2 caracteres)
- Design responsivo
- Acessibilidade completa

### 2. Atualizado: `/components/NovaRodadaFormNew.tsx`

**Novas Funcionalidades:**
- Import do `useUsersDB` hook
- Import do `MemberAutocomplete` component
- Estado `searchValues` para controlar busca de cada participante
- Funções `handleSelectMember` e `handleSearchChange`
- Interface visual melhorada com indicadores

## 🎨 Interface

### Dropdown de Sugestões

```
┌────────────────────────────────────────────┐
│ [🔍] Digite nome ou email...              │
└────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────┐
│ [👤] João Silva                         [✓]│
│      📧 joao@empresa.com                   │
│      💼 Desenvolvedor Frontend             │
├────────────────────────────────────────────┤
│ [👤] João Pedro                         [✓]│
│      📧 jpedr@empresa.com                  │
│      💼 Designer UX/UI                     │
├────────────────────────────────────────────┤
│ 2 de 15 membros encontrados                │
└────────────────────────────────────────────┘
```

### Card de Participante com Autocomplete

```
┌─────────────────────────────────────────────────┐
│ [👤]  [🔍] Buscar membro ou digitar novo    [❌] │
│       ┌───────────────────────────────────────┐ │
│       │ Digite nome ou email...               │ │
│       └───────────────────────────────────────┘ │
│                                                  │
│       ┌───────────────────────────────────────┐ │
│       │ Email *                               │ │
│       └───────────────────────────────────────┘ │
│                                                  │
│       ┌───────────────────────────────────────┐ │
│       │ Função/Cargo *                        │ │
│       └───────────────────────────────────────┘ │
│                                                  │
│       [✓] Membro existente selecionado          │
└─────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Uso

### Cenário 1: Selecionar Membro Existente

1. **Usuário começa a digitar:**
   ```
   Input: "joao"
   ```

2. **Sistema busca automaticamente:**
   ```typescript
   const filtered = members.filter(m => 
     m.name.toLowerCase().includes("joao") ||
     m.email.toLowerCase().includes("joao") ||
     m.role.toLowerCase().includes("joao")
   );
   // Resultado: [João Silva, João Pedro, Joana Santos]
   ```

3. **Dropdown mostra sugestões:**
   ```
   • João Silva - joao@empresa.com - Desenvolvedor
   • João Pedro - jpedr@empresa.com - Designer
   • Joana Santos - joana@empresa.com - Product Manager
   ```

4. **Usuário clica em "João Silva":**
   ```typescript
   handleSelectMember(0, {
     id: "user-123",
     name: "João Silva",
     email: "joao@empresa.com",
     role: "Desenvolvedor Frontend"
   });
   ```

5. **Campos preenchidos automaticamente:**
   ```
   Nome: João Silva
   Email: joao@empresa.com
   Função: Desenvolvedor Frontend
   
   [✓] Membro existente selecionado
   ```

### Cenário 2: Criar Novo Membro

1. **Usuário digita nome novo:**
   ```
   Input: "Maria"
   ```

2. **Sistema não encontra:**
   ```
   ┌────────────────────────────────────────┐
   │ Nenhum membro encontrado.              │
   │ Digite um novo nome para criar.        │
   └────────────────────────────────────────┘
   ```

3. **Usuário continua preenchendo:**
   ```
   Nome: Maria Santos
   Email: maria@empresa.com
   Função: Analista de Dados
   
   [ℹ] Novo membro será criado
   ```

4. **Ao criar rodada, membro é adicionado:**
   ```typescript
   // Backend cria novo usuário
   const newUser = {
     id: crypto.randomUUID(),
     name: "Maria Santos",
     email: "maria@empresa.com",
     role: "Analista de Dados",
     companyId: "company-001",
     addedViaRodada: true
   };
   ```

## 🔍 Lógica de Busca

### Filtros Aplicados

```typescript
// 1. Filtrar por empresa
const companyMembers = members.filter(m => 
  m.companyId === companyId
);

// 2. Filtrar por termo de busca
const searchTerm = value.toLowerCase();
const filtered = companyMembers.filter(member => 
  member.name.toLowerCase().includes(searchTerm) ||
  member.email.toLowerCase().includes(searchTerm) ||
  member.role.toLowerCase().includes(searchTerm)
);

// 3. Limitar resultados
const results = filtered.slice(0, 5);
```

### Regras de Exibição

| Condição | Ação |
|----------|------|
| `value.length < 2` | Não mostra sugestões |
| `filtered.length > 0` | Mostra dropdown com membros |
| `filtered.length === 0` | Mostra mensagem "Nenhum encontrado" |
| `click outside` | Fecha dropdown |
| `select member` | Fecha dropdown e preenche campos |

## 🎯 Benefícios

### 1. **Evita Duplicações**
- ❌ Antes: Usuário digitava "João Silva" manualmente várias vezes
- ✅ Agora: Sistema sugere "João Silva" já cadastrado

### 2. **Economia de Tempo**
- ❌ Antes: Digitar Nome + Email + Função para cada participante
- ✅ Agora: 1 clique para preencher tudo automaticamente

### 3. **Dados Consistentes**
- ❌ Antes: "joão silva", "Joao Silva", "J. Silva" (3 cadastros diferentes)
- ✅ Agora: Sempre usa o cadastro canônico existente

### 4. **Melhor UX**
- Visual claro e intuitivo
- Feedback imediato
- Indicadores de status
- Mensagens de ajuda contextuais

## 🧪 Como Testar

### 1. Preparar Ambiente

1. Ter alguns membros já cadastrados na empresa:
   - Ir em "Personas" (Cadastros)
   - Criar 3-5 membros de teste

2. Verificar que os membros estão no banco:
   ```
   GET /users?companyId=company-001
   ```

### 2. Testar Autocomplete

1. **Nova Rodada:**
   ```
   Rodadas → Nova Rodada
   Selecionar Empresa
   ```

2. **Buscar membro existente:**
   ```
   Digite: "jo"
   Esperar: Dropdown com sugestões
   Clicar: Selecionar "João Silva"
   Verificar: Campos preenchidos automaticamente
   ```

3. **Buscar por email:**
   ```
   Digite: "@empresa.com"
   Verificar: Todos os membros com esse domínio
   ```

4. **Buscar por função:**
   ```
   Digite: "desenvolvedor"
   Verificar: Apenas membros com essa função
   ```

5. **Criar novo membro:**
   ```
   Digite: "Pessoa Nova"
   Ver: "Nenhum membro encontrado"
   Preencher: Email e Função
   Ver: "Novo membro será criado"
   ```

### 3. Testar Múltiplos Participantes

1. **Adicionar 3 participantes:**
   ```
   Participante 1: Buscar "João" → Selecionar existente
   Participante 2: Buscar "Maria" → Selecionar existente
   Participante 3: Digitar "Pedro Novo" → Criar novo
   ```

2. **Verificar indicadores:**
   ```
   ✓ Participante 1: "Membro existente selecionado"
   ✓ Participante 2: "Membro existente selecionado"
   ℹ Participante 3: "Novo membro será criado"
   ```

3. **Criar rodada:**
   ```
   Verificar console:
   ✅ Usuário já existe: joao@empresa.com
   ✅ Usuário já existe: maria@empresa.com
   ✅ Novo usuário criado: pedro.novo@empresa.com
   ```

### 4. Testar Filtro por Empresa

1. **Como Manager:**
   ```
   Selecionar: Empresa A
   Buscar: Ver apenas membros da Empresa A
   
   Selecionar: Empresa B
   Buscar: Ver apenas membros da Empresa B
   ```

2. **Como Leader:**
   ```
   Ver: Empresa fixada automaticamente
   Buscar: Ver apenas membros da minha empresa
   ```

## 📊 Logs de Debug

### Busca Bem-Sucedida

```
🔍 Buscando membros para: "joão"
📊 Total de membros da empresa: 15
✅ Encontrados: 3 membros
   • João Silva (joao@empresa.com)
   • João Pedro (jpedr@empresa.com)  
   • Joana Santos (joana@empresa.com)
```

### Seleção de Membro

```
✅ Membro selecionado:
   Nome: João Silva
   Email: joao@empresa.com
   Função: Desenvolvedor Frontend
   ID: user-123
```

### Criação de Novo Membro

```
📝 Novo membro será criado:
   Nome: Pedro Novo
   Email: pedro.novo@empresa.com
   Função: Analista QA
   
✅ Usuário criado com sucesso: user-456
```

## 🚨 Troubleshooting

### Problema: Autocomplete não aparece

**Causas possíveis:**
1. Menos de 2 caracteres digitados
2. Nenhum membro cadastrado na empresa
3. Hook `useUsersDB` não carregou

**Solução:**
```typescript
// Verificar no console
console.log('Users loaded:', users.length);
console.log('Loading:', loadingUsers);
console.log('Company ID:', formData.companyId);
```

### Problema: Mostra membros de outra empresa

**Causa:** Filtro de empresa não aplicado

**Solução:** Verificar `companyId` passado ao autocomplete:
```typescript
<MemberAutocomplete
  companyId={formData.companyId} // ✅ Deve ser válido
  // ...
/>
```

### Problema: Campos não preenchem ao selecionar

**Causa:** Função `handleSelectMember` com erro

**Solução:** Verificar estrutura do objeto membro:
```typescript
handleSelectMember(index, {
  name: member.name,    // ✅ Deve existir
  email: member.email,  // ✅ Deve existir
  role: member.role     // ✅ Deve existir
});
```

## 💡 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar foto/avatar dos membros no dropdown
- [ ] Mostrar última vez que membro participou de rodada
- [ ] Cache de busca para melhor performance
- [ ] Keyboard navigation (arrow keys)

### Médio Prazo
- [ ] Busca fuzzy (tolera erros de digitação)
- [ ] Sugestões baseadas em histórico
- [ ] Membros mais usados aparecem primeiro
- [ ] Filtro adicional por departamento/área

### Longo Prazo
- [ ] Machine learning para sugerir participantes
- [ ] Integração com Active Directory / LDAP
- [ ] Import em massa via CSV
- [ ] Sincronização com outras plataformas

## 📝 Exemplo Completo de Uso

```typescript
// 1. Usuário abre formulário
<NovaRodadaForm onClose={...} onSuccess={...} />

// 2. Sistema carrega membros
const { users, loading } = useUsersDB();
// users = [
//   { id: "1", name: "João Silva", email: "joao@...", role: "Dev" },
//   { id: "2", name: "Maria Santos", email: "maria@...", role: "Designer" },
//   ...
// ]

// 3. Usuário digita no autocomplete
<MemberAutocomplete
  companyId="company-001"
  members={users}
  value="joão"
  onSelect={(member) => {
    // Preencher campos automaticamente
    setParticipante(0, {
      name: member.name,
      email: member.email,
      role: member.role
    });
  }}
/>

// 4. Dropdown mostra sugestões
// [João Silva] [Maria João] ...

// 5. Usuário clica em "João Silva"
// Campos preenchidos:
//   Nome: João Silva ✓
//   Email: joao@empresa.com ✓
//   Função: Desenvolvedor Frontend ✓

// 6. Criar rodada
POST /rodadas
{
  participantes: [
    { 
      name: "João Silva",
      email: "joao@empresa.com", 
      role: "Desenvolvedor Frontend"
    }
  ]
}

// 7. Backend verifica usuário existe
const existingUser = await kv.get('users_by_email:joao@empresa.com');
// ✅ Usuário encontrado, não cria duplicado

// 8. Adiciona à rodada
rodada_participantes: [{
  user_id: existingUser.id,
  status: "pendente"
}]
```

## ✅ Checklist de Implementação

- ✅ Componente `MemberAutocomplete.tsx` criado
- ✅ Hook `useUsersDB` integrado
- ✅ Formulário `NovaRodadaFormNew.tsx` atualizado
- ✅ Busca em tempo real funcionando
- ✅ Filtro por empresa aplicado
- ✅ Preenchimento automático implementado
- ✅ Indicadores visuais adicionados (badges verde/azul)
- ✅ Mensagens de ajuda contextuais
- ✅ Tratamento de erros completo
- ✅ Integração bidirecional Rodadas ↔ Cadastros
- ✅ Usuários salvos automaticamente em `company_users:{companyId}`
- ✅ Endpoint servidor atualizado para indexar usuários
- ✅ Documentação completa

## 📚 Documentação Adicional

Para entender o fluxo completo de integração entre Rodadas e Cadastros, consulte:
- `/README_AUTOCOMPLETE_INTEGRACAO.md` - Documentação completa da integração

---

**Data:** 27/10/2025  
**Versão:** QualityMap App v2.0  
**Status:** ✅ Implementado, Integrado e Documentado  
**Impacto:** 🚀 Melhoria significativa na UX de criação de rodadas + Integração completa com Cadastros
