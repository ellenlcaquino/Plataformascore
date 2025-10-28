# 🔍 Sistema de Autocomplete Híbrido de Membros

## 📋 Visão Geral

O sistema de autocomplete de membros foi aprimorado para funcionar de forma **híbrida**: permite tanto **buscar membros existentes** quanto **adicionar novos membros** no mesmo campo, oferecendo uma experiência fluida e intuitiva.

## ✨ Funcionalidades

### 1. **Busca em Tempo Real**

Quando o usuário digita no campo "Buscar membro existente ou adicionar novo":
- ✅ A partir de **1 caractere**, já mostra sugestões
- ✅ Busca em **nome, email e função**
- ✅ Limita a **5 sugestões** para não sobrecarregar
- ✅ Mostra contador: "X de Y membros • Clique para selecionar ou continue digitando"

### 2. **Sincronização Bidirecional dos Campos**

- O que você digita no campo de busca **preenche automaticamente** o campo "Nome completo"
- O que você digita no campo "Nome completo" **sincroniza com** o campo de busca
- **Ambos os campos são editáveis** - use o que preferir
- Editar qualquer um dos campos remove a seleção de membro existente (se houver)

### 3. **Seleção de Membro Existente**

Quando clica em uma sugestão:
- ✅ Preenche **nome, email e função** automaticamente
- ✅ Marca os campos com **borda verde** indicando seleção
- ✅ Armazena ID do membro para rastreamento

### 4. **Adição de Novo Membro**

Quando não encontra o membro:
- ✅ Continue digitando normalmente
- ✅ O nome vai sendo preenchido automaticamente
- ✅ Depois preencha manualmente email e função
- ✅ Sistema detecta automaticamente que é um novo membro

## 🎯 Fluxo de Uso

### Exemplo 1: Buscar membro existente

```
1. Usuário digita: "ellen"
2. Sistema mostra sugestões:
   - Ellen Silva (ellen.silva@empresa.com) - Líder
   - Ellen Costa (ellen.costa@empresa.com) - Membro
3. Usuário clica em "Ellen Silva"
4. Campos preenchidos automaticamente:
   - Nome: Ellen Silva ✓
   - Email: ellen.silva@empresa.com ✓
   - Função: Líder ✓
```

### Exemplo 2: Adicionar novo membro

```
1. Usuário digita: "joão paulo mendes"
2. Sistema não encontra sugestões (ou mostra outras pessoas)
3. Usuário continua digitando normalmente
4. Campo "Nome completo" já mostra: "joão paulo mendes"
5. Usuário preenche:
   - Email: joao.paulo@empresa.com
   - Função: Membro
6. Sistema cria novo membro ao salvar
```

## 🔧 Implementação Técnica

### Componente: `MemberAutocomplete.tsx`

```tsx
// Busca a partir de 1 caractere
if (!value || value.length < 1) {
  setFilteredMembers([]);
  setShowSuggestions(false);
  return;
}

// Filtra em nome, email e função
const filtered = companyMembers.filter(member => 
  member.name.toLowerCase().includes(searchTerm) ||
  member.email.toLowerCase().includes(searchTerm) ||
  member.role.toLowerCase().includes(searchTerm)
).slice(0, 5);
```

### Integração: `NovaRodadaFormNew.tsx`

```tsx
const handleSearchChange = (index: number, value: string) => {
  // Atualiza valor de busca
  const updatedSearch = [...searchValues];
  updatedSearch[index] = value;
  setSearchValues(updatedSearch);
  
  // SEMPRE atualizar o campo nome em tempo real
  const updated = [...participantes];
  updated[index].name = value;
  setParticipantes(updated);
  
  // Se limpar, remove seleção
  if (!value) {
    const updatedSelected = [...selectedMembers];
    updatedSelected[index] = null;
    setSelectedMembers(updatedSelected);
  }
};
```

### Campo Nome (Editável e Sincronizado)

```tsx
<Input
  placeholder="Nome completo *"
  value={participante.name}
  onChange={(e) => updateParticipante(index, 'name', e.target.value)}
  required
  className={selectedMembers[index] ? 'border-green-300 bg-green-50/50' : ''}
/>

// updateParticipante sincroniza automaticamente com o campo de busca
const updateParticipante = (index: number, field: keyof ParticipanteForm, value: string) => {
  const updated = [...participantes];
  updated[index][field] = value;
  setParticipantes(updated);
  
  // Se editar o campo nome, sincronizar com o campo de busca
  if (field === 'name') {
    const updatedSearch = [...searchValues];
    updatedSearch[index] = value;
    setSearchValues(updatedSearch);
  }
  
  // Remove seleção de membro existente ao editar manualmente
  const updatedSelected = [...selectedMembers];
  updatedSelected[index] = null;
  setSelectedMembers(updatedSelected);
};
```

## 🎨 Indicadores Visuais

### Estado Normal
- Campo de busca: branco, editável
- Campo nome: branco, editável
- Campos email/função: branco, editáveis

### Membro Selecionado
- Todos os campos: **borda verde + fundo verde claro**
- Indica visualmente que foi selecionado da base
- Ainda editáveis (se editar, perde o verde)

### Novo Membro
- Todos os campos: brancos, editáveis
- Sem borda verde
- Pronto para preenchimento manual

## 🔍 Filtros e Validações

### Durante Busca
- ✅ Filtra apenas membros da mesma empresa
- ✅ Busca case-insensitive
- ✅ Busca parcial (inclui substring)
- ✅ Mostra até 5 resultados

### Durante Submit
- ✅ Valida nome, email e função preenchidos
- ✅ Valida formato de email
- ✅ Remove espaços extras
- ✅ Normaliza email para lowercase

## 📱 UX/UI

### Mensagens ao Usuário
- "Digite o nome completo (ex: Ellen Silva)..." - Placeholder claro no campo de busca
- "Nome completo *" - Placeholder no campo nome (também editável)
- "X de Y membros • Clique para selecionar ou continue digitando" - Rodapé informativo

### Comportamento do Dropdown
- Aparece automaticamente ao digitar
- Fecha ao clicar fora
- Fecha ao selecionar um membro
- Não mostra mensagem "não encontrado" (modo híbrido)

## ✅ Benefícios

1. **Velocidade**: 1 caractere já busca
2. **Flexibilidade**: Busca OU criação, use o campo que preferir
3. **Sincronização**: Ambos os campos funcionam juntos
4. **Feedback Visual**: Bordas verdes indicam seleção de membro existente
5. **Liberdade**: Edite qualquer campo a qualquer momento
6. **Inteligente**: Detecta automaticamente se é novo ou existente

## 🚀 Próximas Melhorias Possíveis

- [ ] Destacar termo buscado nas sugestões (bold/highlight)
- [ ] Atalhos de teclado (setas + Enter)
- [ ] Sugestões baseadas em histórico recente
- [ ] Cache de buscas para performance
- [ ] Foto/avatar nos resultados
- [ ] Ordenação por relevância (exact match primeiro)

## 📝 Notas Importantes

- **Ambos os campos são editáveis** - use o que preferir (busca ou nome direto)
- **Sincronização automática** - digitar em um atualiza o outro
- Sistema diferencia automaticamente novo vs existente
- Seleção é por empresa (multi-tenant)
- Membros existentes têm `selectedMembers[index] = member.id`
- Novos membros têm `selectedMembers[index] = null`
- Editar qualquer campo manualmente remove a seleção verde

---

**Data da Implementação**: 27/10/2025  
**Arquivo Principal**: `/components/MemberAutocomplete.tsx`  
**Integração**: `/components/NovaRodadaFormNew.tsx`
