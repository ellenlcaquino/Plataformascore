# 🧪 Teste Rápido: Autocomplete de Membros

## ✅ Passo a Passo para Testar

### 1️⃣ Preparar Dados de Teste

**Ir em: Cadastros (ícone de pessoas no menu)**

Criar 2 membros manualmente:
```
Membro 1:
  Nome: João Silva
  Email: joao@democompany.com
  Função: Desenvolvedor Frontend
  
Membro 2:
  Nome: Maria Santos
  Email: maria@democompany.com
  Função: Designer UX/UI
```

---

### 2️⃣ Testar Autocomplete com Membro Existente

**Ir em: Rodadas → Nova Rodada**

1. Selecionar empresa: **Demo Company**
2. Data limite: Escolher data futura
3. No campo de participante, **digitar**: `joão`

**Resultado esperado:**
```
┌────────────────────────────────────────┐
│ [👤] João Silva                    [✓] │
│      📧 joao@democompany.com           │
│      💼 Desenvolvedor Frontend         │
└────────────────────────────────────────┘
```

4. **Clicar** em "João Silva"

**Resultado esperado:**
```
✅ Campos preenchidos automaticamente
✅ Badge verde: "Membro existente selecionado"
✅ Avatar verde
✅ Campos com fundo verde claro
```

---

### 3️⃣ Testar Criação de Novo Membro

1. **Clicar** em "+ Adicionar" para novo participante
2. **Digitar** no campo de busca: `pedro`

**Resultado esperado:**
```
Nenhum membro encontrado.
Digite um novo nome para criar.
```

3. **Preencher manualmente:**
```
Nome: Pedro Alves
Email: pedro@democompany.com
Função: Product Manager
```

**Resultado esperado:**
```
✅ Badge azul: "Novo membro será criado"
✅ Avatar cinza
✅ Campos normais
```

---

### 4️⃣ Criar Rodada

1. **Clicar**: "Criar Rodada"

**Resultado esperado no console (F12):**
```
✅ Usuário já existe: joao@democompany.com
✅ Novo usuário criado: pedro@democompany.com - Nome: Pedro Alves - Função: Product Manager
✅ Usuário adicionado à lista da empresa: company-xxx
✅ Rodada criada com sucesso
```

**Resultado na interface:**
```
🎉 Toast: "Rodada criada com sucesso!"
📋 Rodada aparece na lista
👥 2 participantes: João Silva + Pedro Alves
```

---

### 5️⃣ Verificar em Cadastros

**Ir em: Cadastros (Personas)**

**Resultado esperado:**
```
✅ João Silva (já existia)
✅ Maria Santos (já existia)
✅ Pedro Alves (NOVO - criado via rodada!)
```

---

### 6️⃣ Reutilizar Novo Membro

**Ir em: Rodadas → Nova Rodada**

1. **Digitar** no campo de busca: `pedro`

**Resultado esperado:**
```
┌────────────────────────────────────────┐
│ [👤] Pedro Alves                   [✓] │
│      📧 pedro@democompany.com          │
│      💼 Product Manager                │
└────────────────────────────────────────┘
```

✅ **SUCESSO!** Pedro agora está disponível para reutilização!

---

## 🎯 Checklist de Validação

Marque cada item conforme testa:

- [ ] Autocomplete mostra membros existentes
- [ ] Busca funciona por nome
- [ ] Busca funciona por email  
- [ ] Busca funciona por função
- [ ] Dropdown fecha ao clicar fora
- [ ] Seleção preenche campos automaticamente
- [ ] Badge verde aparece para membro existente
- [ ] Badge azul aparece para novo membro
- [ ] Novo membro é criado ao salvar rodada
- [ ] Novo membro aparece em Cadastros
- [ ] Novo membro fica disponível para reutilização
- [ ] Filtro por empresa funciona (apenas membros da mesma empresa)
- [ ] Múltiplos participantes funcionam
- [ ] Pode remover participantes (botão X)
- [ ] Validação de email funciona

---

## 🐛 O que fazer se algo não funcionar?

### Autocomplete não aparece
1. Verificar que digitou pelo menos 2 caracteres
2. Verificar que empresa está selecionada
3. Abrir console (F12) e procurar erros

### Membro não preenche automaticamente
1. Verificar que clicou no item do dropdown
2. Recarregar página e tentar novamente

### Novo membro não aparece em Cadastros
1. Verificar console: deve ter log "✅ Novo usuário criado"
2. Recarregar página de Cadastros
3. Verificar empresa selecionada (se for Manager)

### Logs importantes para debug
```javascript
// Abrir Console (F12) e procurar por:
✅ Usuário já existe: ...
✅ Novo usuário criado: ...
✅ Usuário adicionado à lista da empresa: ...
```

---

## 🎉 Teste Completo!

Se todos os itens do checklist estão marcados, o sistema está funcionando perfeitamente! 🚀

**Próximos passos:**
- Criar rodadas reais com sua equipe
- Adicionar mais membros via Cadastros
- Reutilizar membros em múltiplas rodadas

---

**Tempo estimado do teste:** 5-10 minutos  
**Dificuldade:** Fácil  
**Requer:** Nenhuma configuração adicional
