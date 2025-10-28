# 🧪 Teste Rápido: Dados de Participantes

## ✅ Problema Corrigido

Dados de participantes não carregavam. Agora deve mostrar nome, email, função e iniciais corretas.

## 🎯 Teste Rápido (3 minutos)

### Cenário 1: Criar Rodada com Novo Membro

```
1. Login como Leader
2. Ir em "Rodadas"
3. Clicar "Nova Rodada"
4. Preencher:
   - Nome: "Maria Silva"
   - Email: "maria@empresa.com"
   - Função: "QA Analyst"
5. Criar

✅ ESPERADO - Card da Rodada:
   - Avatar: "MS" (não "??")
   - Nome: "Maria Silva" (não "Carregando...")
   - Função: "QA Analyst" (não "member")
   - Email visível ao clicar detalhes

❌ NÃO DEVE APARECER:
   - "Carregando..."
   - "??"
   - Dados vazios
```

### Cenário 2: Verificar em Cadastros

```
1. Ir em menu "Cadastros"
2. Procurar "Maria Silva"

✅ ESPERADO:
   - Maria Silva aparece na lista
   - Email: maria@empresa.com
   - Função: QA Analyst
   - Badge: "Adicionado via Rodada"

❌ NÃO DEVE APARECER:
   - Lista vazia
   - Usuário não encontrado
```

### Cenário 3: Múltiplos Participantes

```
1. Criar nova rodada
2. Adicionar 3 participantes:
   - "João Pedro" - joao@empresa.com - Tech Lead
   - "Ana Costa" - ana@empresa.com - QA Senior
   - "Paulo Santos" - paulo@empresa.com - Developer

✅ ESPERADO:
   - Card mostra: 3 participantes
   - Ao abrir detalhes:
     * JP - João Pedro - Tech Lead
     * AC - Ana Costa - QA Senior
     * PS - Paulo Santos - Developer
   - Todos com iniciais corretas

❌ NÃO DEVE APARECER:
   - Carregando...
   - ??
   - Nomes duplicados
```

### Cenário 4: Atualizar Página

```
1. Com rodadas criadas
2. Apertar F5 (recarregar)
3. Aguardar carregamento

✅ ESPERADO:
   - Todas as rodadas carregam
   - Todos os participantes com dados corretos
   - Sem "Carregando..."

❌ NÃO DEVE APARECER:
   - Dados perdidos
   - Carregando permanente
```

---

## 🔍 Verificação Visual

### ✅ Correto
```
┌─────────────────────────────┐
│ 📊 Rodada Ativa             │
├─────────────────────────────┤
│ Participantes:              │
│                             │
│ ┌──┐  Maria Silva           │
│ │MS│  QA Analyst             │
│ └──┘  maria@empresa.com     │
│                             │
│ ┌──┐  João Pedro            │
│ │JP│  Tech Lead              │
│ └──┘  joao@empresa.com      │
└─────────────────────────────┘
```

### ❌ Errado (Problema Antigo)
```
┌─────────────────────────────┐
│ 📊 Rodada Ativa             │
├─────────────────────────────┤
│ Participantes:              │
│                             │
│ ┌──┐  Carregando...         │
│ │??│  member                 │
│ └──┘                        │
│                             │
│ ┌──┐  Carregando...         │
│ │??│  member                 │
│ └──┘                        │
└─────────────────────────────┘
```

---

## 🐛 Checklist de Validação

### Rodadas
- [ ] Avatar mostra iniciais corretas (não "??")
- [ ] Nome mostra nome real (não "Carregando...")
- [ ] Função mostra função real (não genérico "member")
- [ ] Email disponível nos detalhes
- [ ] Contador de participantes correto

### Cadastros
- [ ] Novos membros aparecem na lista
- [ ] Dados completos (nome, email, função)
- [ ] Badge "Adicionado via Rodada" presente
- [ ] Filtros funcionam corretamente
- [ ] Busca encontra membros

### Geral
- [ ] Sem "Carregando..." permanente
- [ ] Sem avatares "??"
- [ ] Dados sincronizados entre áreas
- [ ] Atualização sem reload da página
- [ ] Performance fluida

---

## 📊 Console (DevTools)

### Logs Corretos

Ao criar rodada, deve aparecer:

```
✅ Logs Esperados:
📝 Creating rodada: {participantes: [...]}
✅ Novo usuário criado: maria@empresa.com - Nome: Maria Silva - Função: QA Analyst
✅ Rodada created in KV store: xxx-xxx-xxx
📥 GET /rodadas - returning 1 rodadas
✅ GET /rodadas - Returning enriched rodadas: 1

❌ NÃO deve ter:
⚠️ Error fetching user data
❌ Failed to load participants
⚠️ User data not found
```

### Estrutura de Dados

Ao inspecionar rodada no Console:

```javascript
// ✅ Correto:
rodada.rodada_participantes[0] = {
  user_id: 'xxx',
  users: {              // ✅ Dados presentes!
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    role: 'member'
  }
}

// ❌ Errado (problema antigo):
rodada.rodada_participantes[0] = {
  user_id: 'xxx',
  users: null          // ❌ Dados ausentes!
}
```

---

## 🚨 Se Ainda Houver Problema

### 1. Limpar Cache do Navegador

```
1. F12 (DevTools)
2. Aba "Application" ou "Armazenamento"
3. Limpar:
   - Local Storage
   - Session Storage
   - Cache Storage
4. Ctrl+Shift+R (hard reload)
```

### 2. Verificar Console

```
1. F12 > Console
2. Procurar por erros em vermelho
3. Copiar mensagem de erro completa
4. Reportar com contexto:
   - O que estava fazendo
   - Erro exato
   - Passos para reproduzir
```

### 3. Verificar Estado (React DevTools)

```
1. Instalar React DevTools (extensão)
2. F12 > Components
3. Selecionar RodadasContent
4. Ver hooks > rodadas
5. Verificar se dados estão corretos
```

### 4. Verificar Backend

```
1. F12 > Network
2. Filtrar por "rodadas"
3. Clicar na request GET /rodadas
4. Ver "Response"
5. Verificar se users está presente:
   {
     rodada_participantes: [{
       users: {name, email, role}  // ✅ Deve estar aqui
     }]
   }
```

---

## ✅ Resultado Final

Se todos os testes passaram:

✅ **Correção bem-sucedida!**
- Dados de participantes carregam corretamente
- Sincronização entre Rodadas e Cadastros
- Interface mostra informações completas
- Sem "Carregando..." permanente

Caso algum teste falhe:
- Consultar `/README_CORRECAO_DADOS_PARTICIPANTES.md`
- Verificar logs no console
- Limpar cache do navegador
- Verificar network requests

---

**Tempo total do teste:** 3-5 minutos  
**Requisitos:** Acesso ao app + permissão de Leader/Manager  
**Documentação completa:** `/README_CORRECAO_DADOS_PARTICIPANTES.md`
