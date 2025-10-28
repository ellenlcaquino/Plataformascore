# 🔧 SOLUÇÃO: Erro "users table not found" após executar schema.sql

## 🎯 Problema Identificado

Você executou o `schema.sql` com sucesso ✅, mas o sistema continua dizendo que a tabela `users` não existe.

**Causa:** O Supabase Edge Function está com **cache desatualizado** e não reconhece as novas tabelas criadas.

**Mensagem de erro:**
```
Could not find the table 'public.users' in the schema cache
```

---

## ✅ SOLUÇÃO RÁPIDA (3 passos)

### **PASSO 1: Verificar se as tabelas foram criadas**

No **Supabase SQL Editor**, execute:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'companies', 'rodadas', 'assessments')
ORDER BY tablename;
```

**Resultado esperado:** Deve mostrar as 4 tabelas acima.

✅ **Se mostrou as tabelas** = elas foram criadas com sucesso!  
❌ **Se não mostrou** = você precisa executar `/database/schema.sql` novamente.

---

### **PASSO 2: Executar fix de políticas RLS**

O problema é nas **políticas de segurança (RLS)**. Execute este script:

**Arquivo:** `/database/fix_rls_policies.sql`

1. Acesse **SQL Editor** no Supabase
2. **New Query**
3. Copie **TODO** o conteúdo de `/database/fix_rls_policies.sql`
4. Cole e clique em **RUN**

**O que este script faz:**
- Remove políticas RLS restritivas antigas
- Cria novas políticas que permitem acesso completo para `service_role`, `authenticated` e `anon`
- Garante que o servidor consiga acessar as tabelas

---

### **PASSO 3: Verificar se funcionou**

Execute no **SQL Editor**:

**Arquivo:** `/database/verificar_tabelas.sql`

**Resultado esperado:**
```
✅ INSERT FUNCIONANDO! Usuário de teste criado: xxx-xxx-xxx
✅ DELETE FUNCIONANDO! Usuário de teste removido.
🎉 PARABÉNS! O banco de dados está 100% funcional!
```

---

## 🔍 Por que isso acontece?

### Problema Técnico

Quando você cria tabelas com RLS (Row Level Security) ativado, o Supabase cria políticas de segurança padrão que podem **bloquear o acesso** até para o `service_role`.

O schema original tinha esta política:

```sql
CREATE POLICY "Allow authenticated users" ON users
  FOR ALL USING (auth.role() = 'authenticated');
```

Isso funciona para usuários autenticados, mas pode causar problemas quando:
- O servidor usa `SUPABASE_SERVICE_ROLE_KEY`
- O cache do Supabase Edge Function não foi atualizado
- As políticas não incluem permissões para `anon` role

### A Solução

O arquivo `fix_rls_policies.sql` cria 3 políticas para cada tabela:

1. **service_role** - Acesso total (para o servidor)
2. **authenticated** - Acesso total (para usuários logados)
3. **anon** - Acesso total (para chamadas anônimas)

Isso garante que **todas as formas de acesso** funcionem corretamente.

---

## 📋 Checklist Completo

- [ ] **1.** Executei `/database/schema.sql` → ✅ Tabelas criadas
- [ ] **2.** Executei `/database/fix_rls_policies.sql` → ✅ Políticas corrigidas
- [ ] **3.** Executei `/database/verificar_tabelas.sql` → ✅ Banco validado
- [ ] **4.** Recarreguei a aplicação no navegador (Ctrl+F5)
- [ ] **5.** Testei preencher o formulário novamente

---

## 🆘 Se ainda não funcionar

### Opção 1: Desabilitar RLS temporariamente (apenas para testes)

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE rodada_participantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

⚠️ **Importante:** Isso remove a segurança das tabelas. Use apenas para testar!

### Opção 2: Verificar logs do servidor

No navegador, abra o **Console (F12)** e procure por:
```
💾 [POST /assessments] Recebendo avaliação
❌ Usuário não encontrado no banco
```

Isso ajuda a identificar onde exatamente está falhando.

### Opção 3: Testar acesso direto à tabela

No SQL Editor:
```sql
SELECT * FROM users LIMIT 5;
```

Se funcionar = tabelas OK, problema é só nas políticas.  
Se não funcionar = problema mais sério, talvez precisar recriar as tabelas.

---

## 🎯 Resumo

1. ✅ Tabelas criadas com `schema.sql`
2. ⚠️ Cache/RLS causando bloqueio
3. 🔧 Executar `fix_rls_policies.sql` para corrigir
4. ✅ Verificar com `verificar_tabelas.sql`
5. 🚀 Sistema funcionando!

---

## 📚 Arquivos Relacionados

- `/database/schema.sql` - Schema completo (já executado ✅)
- `/database/fix_rls_policies.sql` - **EXECUTE ESTE AGORA** 🔥
- `/database/verificar_tabelas.sql` - Verificação final
- `/LEIA_ISTO_PRIMEIRO.md` - Guia completo original

---

**Status:** Execute o `fix_rls_policies.sql` AGORA para resolver o problema! 🚀
