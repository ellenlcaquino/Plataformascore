# 🧪 Teste do Autocomplete Híbrido

## ✅ Checklist de Testes

### Teste 1: Buscar Membro Existente

**Cenário**: Usuário quer adicionar "Ellen Silva" que já está cadastrada

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "e" no campo de busca | Mostra sugestões começando com "e" | ⬜ |
| 2 | Continuar "el" | Atualiza sugestões, mostra "Ellen..." | ⬜ |
| 3 | Ver campo "Nome completo" | Deve mostrar "el" automaticamente | ⬜ |
| 4 | Ver sugestão "Ellen Silva" | Mostra nome, email e cargo | ⬜ |
| 5 | Clicar na sugestão | Preenche nome, email e função | ⬜ |
| 6 | Ver campos preenchidos | Todos com borda verde | ⬜ |
| 7 | Verificar campo nome | Readonly, não editável | ⬜ |

### Teste 2: Adicionar Novo Membro

**Cenário**: Usuário quer adicionar "João Paulo Mendes" que NÃO existe

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "joão" | Pode mostrar sugestões ou não | ⬜ |
| 2 | Continuar "joão paulo" | Campo nome mostra "joão paulo" | ⬜ |
| 3 | Completar "joão paulo mendes" | Campo nome mostra "joão paulo mendes" | ⬜ |
| 4 | Ver dropdown | Não mostra ou mostra outras sugestões | ⬜ |
| 5 | Continuar sem clicar sugestão | Campo nome permanece com texto digitado | ⬜ |
| 6 | Preencher email manualmente | Email aceita digitação | ⬜ |
| 7 | Preencher função manualmente | Função aceita digitação | ⬜ |
| 8 | Ver campos | SEM borda verde (novo membro) | ⬜ |

### Teste 3: Buscar e Trocar de Ideia

**Cenário**: Usuário busca um membro mas depois quer adicionar outro

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "ellen" | Mostra sugestão de Ellen Silva | ⬜ |
| 2 | Clicar em Ellen Silva | Preenche tudo, borda verde | ⬜ |
| 3 | Limpar campo de busca | Remove nome, email e função | ⬜ |
| 4 | Digitar novo nome "maria" | Campo nome mostra "maria" | ⬜ |
| 5 | Verificar bordas verdes | Devem sumir (não é mais seleção) | ⬜ |

### Teste 4: Busca com Resultados Parciais

**Cenário**: Buscar por email ou função

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "@empresa" | Mostra todos com email @empresa.com | ⬜ |
| 2 | Digitar "líder" | Mostra todos com função Líder | ⬜ |
| 3 | Ver contador | "X de Y membros • Clique ou continue..." | ⬜ |

### Teste 5: Múltiplos Participantes

**Cenário**: Adicionar 3 participantes (2 existentes, 1 novo)

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Adicionar Ellen (existente) | Participante 1 com borda verde | ⬜ |
| 2 | Clicar "Adicionar Participante" | Cria slot vazio para participante 2 | ⬜ |
| 3 | Adicionar Maria (nova) | Participante 2 sem borda verde | ⬜ |
| 4 | Clicar "Adicionar Participante" | Cria slot vazio para participante 3 | ⬜ |
| 5 | Adicionar Carlos (existente) | Participante 3 com borda verde | ⬜ |
| 6 | Ver lista | 3 participantes, 2 verdes, 1 branco | ⬜ |

### Teste 6: Validações

**Cenário**: Testar validações do formulário

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar nome sem email | Erro ao submeter | ⬜ |
| 2 | Digitar email inválido | Erro "Email inválido" | ⬜ |
| 3 | Deixar função vazia | Erro ao submeter | ⬜ |
| 4 | Preencher tudo corretamente | Submit com sucesso | ⬜ |

### Teste 7: Sincronização dos Campos

**Cenário**: Verificar sincronização bidirecional

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "maria" no campo de busca | Campo nome mostra "maria" | ⬜ |
| 2 | Digitar " silva" no campo nome | Campo de busca mostra "maria silva" | ⬜ |
| 3 | Limpar campo de busca | Campo nome limpa também | ⬜ |
| 4 | Digitar direto no campo nome | Campo de busca sincroniza | ⬜ |
| 5 | Ambos os campos | Totalmente editáveis | ⬜ |

### Teste 8: Performance

**Cenário**: Testar com muitos membros cadastrados

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar 1 letra com 100+ membros | Resposta em < 100ms | ⬜ |
| 2 | Ver dropdown | Máximo 5 sugestões | ⬜ |
| 3 | Scroll nas sugestões | Scroll suave se > 5 resultados | ⬜ |

### Teste 9: Empresa Multi-tenant

**Cenário**: Trocar de empresa e verificar filtros

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Selecionar Empresa A | Campo habilitado | ⬜ |
| 2 | Buscar "ellen" | Mostra Ellen da Empresa A | ⬜ |
| 3 | Trocar para Empresa B | Campo ainda habilitado | ⬜ |
| 4 | Buscar "ellen" | Mostra Ellen da Empresa B (se existir) | ⬜ |
| 5 | Sem empresa selecionada | Campo DESABILITADO | ⬜ |

### Teste 10: Edição Manual e Perda de Seleção

**Cenário**: Selecionar membro e depois editar manualmente

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Buscar e selecionar "Ellen Silva" | Campos verdes, tudo preenchido | ⬜ |
| 2 | Editar campo nome para "Ellen M. Silva" | Borda verde desaparece | ⬜ |
| 3 | Ver selectedMembers[index] | Deve ser null (não é mais seleção) | ⬜ |
| 4 | Editar campo email | Borda verde permanece null | ⬜ |
| 5 | Campos editados manualmente | Considerados novo membro | ⬜ |

### Teste 11: Fechar Dropdown

**Cenário**: Testar fechamento do dropdown

| Passo | Ação | Resultado Esperado | Status |
|-------|------|-------------------|--------|
| 1 | Digitar "ellen" | Dropdown abre | ⬜ |
| 2 | Clicar fora do campo | Dropdown fecha | ⬜ |
| 3 | Digitar novamente | Dropdown reabre | ⬜ |
| 4 | Clicar em sugestão | Dropdown fecha | ⬜ |
| 5 | Limpar campo | Dropdown fecha | ⬜ |

## 🎯 Casos de Uso Reais

### Caso 1: Time Existente
**Situação**: Criar rodada com time que já está cadastrado
- Digitar nome de cada membro
- Clicar nas sugestões
- Todos os campos verdes
- Submit rápido

### Caso 2: Time Novo
**Situação**: Primeira rodada de uma empresa nova
- Digitar nomes completos
- Preencher emails e funções manualmente
- Nenhum campo verde
- Submit cria todos novos

### Caso 3: Mix
**Situação**: Time com alguns membros novos
- Alguns verdes (existentes)
- Alguns brancos (novos)
- Submit atualiza apenas os novos

## ✨ Comportamentos Esperados

### Visual
- ✅ Dropdown: sombra, borda, scroll
- ✅ Sugestões: hover muda cor
- ✅ Campos verdes: feedback claro
- ✅ Campo nome: cinza e readonly

### Funcional
- ✅ Busca instantânea (< 100ms)
- ✅ Filtro multi-campo (nome, email, função)
- ✅ Limite de 5 sugestões
- ✅ Preenchimento automático em tempo real
- ✅ Detecção automática novo vs existente

### UX
- ✅ Placeholder claro
- ✅ Mensagem informativa no rodapé
- ✅ Tooltip explicativo
- ✅ Fechamento inteligente do dropdown

## 📊 Métricas de Sucesso

- [ ] 0 cliques extras (não precisa ir ao campo nome)
- [ ] Redução de 50% no tempo de cadastro
- [ ] 0 confusão sobre qual campo usar
- [ ] 100% dos casos de uso funcionando

## 🐛 Bugs Conhecidos

_Nenhum até o momento_

## 📝 Feedback de Testes

### Teste 1 - [Data]
- Testador: _____
- Resultado: ⬜ Passou ⬜ Falhou
- Observações: _____

### Teste 2 - [Data]
- Testador: _____
- Resultado: ⬜ Passou ⬜ Falhou
- Observações: _____

---

**Última Atualização**: 27/10/2025
