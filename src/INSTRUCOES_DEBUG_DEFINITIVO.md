# 🔍 INSTRUÇÕES DE DEBUG DEFINITIVO

**IMPORTANTE:** Siga EXATAMENTE nesta ordem. Não pule etapas.

---

## PASSO 1: Diagnóstico SQL (5 minutos)

### 1.1. Execute o SQL completo no Supabase

1. Abra: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo `/database/DIAGNOSTICO_COMPLETO_STATUS.sql`
4. **Copie TODO o conteúdo**
5. Cole no SQL Editor
6. Clique em **RUN**

### 1.2. Copie TODOS os resultados

- Vai aparecer várias tabelas com resultados
- **COPIE TUDO** (Ctrl+A no resultado, Ctrl+C)
- **COLE AQUI NA CONVERSA**

### 1.3. O que vamos descobrir:

- ✅ Quantos assessments foram criados
- ✅ Status de cada assessment (completed ou draft)
- ✅ Status de cada participante (concluido ou pendente)
- 🚨 **DESSINCRONIAS:** Assessments completos mas participantes pendentes
- 🚨 **PROBLEMAS:** Função SQL não existe, dados corrompidos, etc.

---

## PASSO 2: Logs do Frontend (10 minutos)

### 2.1. Limpar cache e recarregar

```
1. Pressione Ctrl+Shift+Delete
2. Limpe cache do navegador (últimas 24 horas)
3. Feche todas as abas do app
4. Pressione Ctrl+F5 para hard refresh
```

### 2.2. Abrir console do desenvolvedor

```
1. Pressione F12
2. Vá na aba "Console"
3. Clique no ícone 🗑️ para limpar console
4. Deixe a janela aberta
```

### 2.3. Fluxo de teste COMPLETO

**IMPORTANTE:** Faça isso com um NOVO usuário ou NOVA rodada.

```
1. Login como líder
2. Criar NOVA rodada
   - Adicione 2 participantes (você + 1 membro)
   - Anote o ID da rodada

3. Login como um dos participantes
4. Ir em "Formulário"
5. Preencher TODAS as 91 perguntas
6. Finalizar avaliação

7. ENQUANTO preenche, observar console:
   - Deve aparecer logs a cada resposta
   
8. AO FINALIZAR, COPIAR TODOS os logs do console:
   - Procure por:
     ✅ "💾 [saveAssessment] INICIANDO"
     ✅ "Assessment ID:" 
     ✅ "🔵 [updateParticipantStatus] INICIANDO"
     ✅ "🎉 STATUS DO PARTICIPANTE ATUALIZADO"
     
   - OU erros:
     ❌ "❌ ERRO AO SALVAR ASSESSMENT"
     ❌ "❌ PARTICIPANTE NÃO ENCONTRADO"
     ❌ "❌ ERRO AO ATUALIZAR PARTICIPANTE"
```

### 2.4. O que enviar:

**COPIE E COLE AQUI:**

```
=== LOGS DO CONSOLE ===
[Cole aqui TODOS os logs desde "💾 [saveAssessment]" até "🎉 STATUS ATUALIZADO"]
```

---

## PASSO 3: Verificação no Supabase (3 minutos)

Após o teste acima, execute este SQL:

```sql
-- Verificar assessment criado agora mesmo
SELECT 
  a.id,
  a.user_id,
  u.email,
  u.name,
  a.status as assessment_status,
  a.completed_at,
  a.created_at
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
WHERE a.created_at > NOW() - INTERVAL '10 minutes'
ORDER BY a.created_at DESC;

-- Verificar participante atualizado
SELECT 
  rp.id as participante_id,
  rp.user_id,
  u.email,
  u.name,
  rp.status as participante_status,
  rp.progress,
  rp.completed_date,
  rp.last_activity
FROM rodada_participantes rp
LEFT JOIN users u ON u.id = rp.user_id
WHERE rp.last_activity > NOW() - INTERVAL '10 minutes'
   OR rp.completed_date > NOW() - INTERVAL '10 minutes'
ORDER BY COALESCE(rp.completed_date, rp.last_activity) DESC;
```

**COPIE E COLE O RESULTADO AQUI**

---

## 🎯 O QUE ESPERAR:

### ✅ Cenário CORRETO:

**Console:**
```
💾 [saveAssessment] INICIANDO
✅ ASSESSMENT SALVO COM SUCESSO!
Assessment ID: xxx-xxx-xxx
Assessment Status: completed
🔵 [updateParticipantStatus] INICIANDO
✅ PARTICIPANTE ENCONTRADO!
🎉 STATUS DO PARTICIPANTE ATUALIZADO COM SUCESSO!
Status NOVO: concluido
Progress NOVO: 100%
```

**SQL:**
```
Assessment status: completed, completed_at: 2025-10-28 23:30:00
Participante status: concluido, progress: 100, completed_date: 2025-10-28 23:30:00
```

### ❌ Cenários de ERRO:

#### Erro 1: Assessment não salva
```
❌ ERRO AO SALVAR ASSESSMENT!
Status HTTP: 500
Error: { ... }
```
**Causa:** Função SQL não existe ou erro no banco
**Solução:** Execute `/database/FIX_SIMPLES.sql`

#### Erro 2: Participante não encontrado
```
❌ PARTICIPANTE NÃO ENCONTRADO!
userId fornecido: xxx-xxx-xxx
User IDs dos participantes:
  1. "yyy-yyy-yyy" - Match: false
```
**Causa:** userId do frontend ≠ userId do banco
**Solução:** Verificar AuthContext vs banco

#### Erro 3: PUT falha
```
❌ ERRO AO ATUALIZAR PARTICIPANTE!
HTTP Status: 404 ou 500
```
**Causa:** Endpoint não funciona ou participanteId inválido
**Solução:** Verificar backend

---

## 📋 CHECKLIST FINAL:

Envie para mim:

- [ ] Resultados do SQL de diagnóstico (Passo 1)
- [ ] Logs completos do console (Passo 2.4)
- [ ] Resultados do SQL de verificação (Passo 3)
- [ ] Se possível, screenshot da tela de "Rodadas" mostrando status

---

## 🚨 SE ALGO FALHAR:

**NÃO CONTINUE.** Pare no passo que falhou e envie:
1. Qual passo falhou
2. A mensagem de erro EXATA
3. Screenshot se possível

---

**Última atualização:** 28 de outubro de 2025, 23:55
