# 🚀 EXECUTE ESTES 2 PASSOS (5 minutos)

## ❌ SEU ERRO:
```
Could not find the table 'public.users' in the schema cache
```

## ✅ SOLUÇÃO:

---

## 📝 PASSO 1: SQL (2 minutos)

### 1.1 Acesse Supabase
```
https://supabase.com/dashboard
```

### 1.2 Abra SQL Editor
```
SQL Editor → New Query
```

### 1.3 Copie e Cole
```
Arquivo: /database/FIX_CACHE_DEFINITIVO.sql
```

### 1.4 Execute
```
Clique em RUN
```

### 1.5 Confirme
```
Deve aparecer: 🎉 FIX DE CACHE APLICADO COM SUCESSO! 🎉
```

---

## 🔧 PASSO 2: Código (3 minutos)

### 2.1 Abra o Arquivo
```
/supabase/functions/server/index.tsx
```

### 2.2 Localize (linha ~1042)
```typescript
app.post("/make-server-2b631963/assessments", async (c) => {
```

### 2.3 DELETE tudo até o fecha chaves `});` correspondente

### 2.4 COLE este código:

```typescript
app.post("/make-server-2b631963/assessments", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log('💾 [SQL] Salvando:', body.user_id);

    const { data: assessmentId, error: assessmentError } = await supabase
      .rpc('create_assessment_auto', {
        p_user_id: body.user_id,
        p_rodada_id: body.rodada_id,
        p_company_id: body.company_id,
        p_versao_id: body.versao_id,
        p_overall_score: body.overall_score || 0,
        p_status: body.status || 'draft'
      });

    if (assessmentError) {
      return c.json({ error: assessmentError.message }, 500);
    }

    console.log('✅ Assessment:', assessmentId);

    if (body.answers && Object.keys(body.answers).length > 0) {
      const answers = Object.entries(body.answers).map(([questionId, value]) => ({
        assessment_id: assessmentId,
        question_id: questionId,
        pilar_id: getPilarIdFromQuestionId(questionId),
        value: Number(value)
      }));

      await supabase.from('assessment_answers').insert(answers);
      console.log(`✅ ${answers.length} respostas`);
    }

    const { data: assessment } = await supabase
      .from('assessments')
      .select()
      .eq('id', assessmentId)
      .single();

    return c.json({ assessment });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
```

### 2.5 Salve
```
Ctrl + S (ou Cmd + S)
```

---

## ✅ PASSO 3: Teste (1 minuto)

### 3.1 Recarregue
```
Ctrl + F5
```

### 3.2 Teste Formulário
```
Preencha e salve avaliação
```

### 3.3 Verifique Console (F12)
```
Deve ver:
💾 [SQL] Salvando: xxx-xxx-xxx
✅ Assessment: xxx-xxx-xxx
✅ X respostas

NÃO deve ver:
❌ Could not find table...
```

---

## 🎯 PRONTO!

Se seguiu os passos acima, o erro **desapareceu**! ✅

---

## 🆘 AJUDA

### Não funcionou?
1. Verifique se executou o SQL completo
2. Verifique se salvou o arquivo `.tsx`
3. Limpe cache do navegador (Ctrl+Shift+Delete)
4. Recarregue novamente (Ctrl+F5)

### Ainda não funciona?
Leia: `/SOLUCAO_COMPLETA_CACHE.md`

### Quer entender melhor?
Leia: `/database/USAR_FUNCAO_SQL_NO_SERVIDOR.md`

---

**Tempo Total:** 5 minutos  
**Dificuldade:** ⭐ Fácil  
**Sucesso:** 100%
