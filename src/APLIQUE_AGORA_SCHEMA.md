# 🚨 APLIQUE O SCHEMA AGORA - PASSO A PASSO

## ❌ ERRO ATUAL
```
Could not find the table 'public.users' in the schema cache
```

**Tradução**: A tabela `users` não existe no banco de dados.

## ✅ SOLUÇÃO (3 PASSOS)

### PASSO 1: Abra o Supabase Dashboard

1. Vá para: **https://supabase.com/dashboard**
2. Faça login
3. Selecione seu projeto do QualityMap
4. No menu lateral esquerdo, clique em **"SQL Editor"**

### PASSO 2: Copie o Schema SQL

1. Abra o arquivo `/database/schema.sql` neste projeto
2. Pressione **Ctrl+A** (selecionar tudo)
3. Pressione **Ctrl+C** (copiar)

### PASSO 3: Execute no Supabase

1. No SQL Editor do Supabase, clique em **"New query"**
2. Delete qualquer código que estiver lá
3. Pressione **Ctrl+V** (colar o schema)
4. Clique no botão **"RUN"** (ou pressione Ctrl+Enter)
5. **AGUARDE** 30-60 segundos

### ✅ Sucesso!

Você deve ver no final:
```
QualityMap Database Schema criado com sucesso! ✅
```

## 🧪 TESTE IMEDIATAMENTE

Após aplicar o schema:

1. **Recarregue a aplicação** (F5 no navegador)
2. **Faça logout e login novamente**
3. **Tente preencher uma avaliação**

O erro deve desaparecer!

## ❓ AINDA COM ERRO?

Se depois de aplicar o schema ainda der erro:

### Verifique se as tabelas foram criadas:

No SQL Editor do Supabase, execute:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'companies', 'rodadas', 'assessments')
ORDER BY tablename;
```

**Deve retornar 4 linhas** (mínimo).

### Se não aparecer nenhuma tabela:

O schema não foi aplicado. Tente novamente:

1. Copie o schema.sql COMPLETO
2. Cole no SQL Editor
3. Clique em RUN
4. Aguarde até o final

---

## ⚠️ IMPORTANTE

Você **NÃO PODE** usar o sistema sem aplicar o schema SQL primeiro.

O código está pronto, mas o banco de dados está vazio.

É como ter um carro pronto mas sem gasolina - você precisa abastecer (aplicar o schema) antes de usar!

---

**Tempo estimado**: 3 minutos  
**Dificuldade**: Muito fácil  
**Prioridade**: 🔴 CRÍTICA - FAÇA AGORA
