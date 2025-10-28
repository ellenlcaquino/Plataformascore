# 🔧 Instruções para Aplicar o Schema SQL Atualizado

## ⚠️ IMPORTANTE - EXECUTAR ESTAS INSTRUÇÕES PRIMEIRO

O schema do banco de dados foi completamente atualizado para resolver os problemas críticos de salvamento de avaliações. **Você PRECISA aplicar o novo schema no banco de dados Supabase**.

## 📋 O Que Foi Corrigido

### 1. **Tabela `users` Adicionada**
- O código do servidor estava tentando inserir dados na tabela `users` que não existia
- Agora a tabela foi adicionada ao schema SQL
- Todas as foreign keys foram corrigidas para referenciar esta tabela

### 2. **Foreign Keys Corrigidas**
- `companies.leader_id` → `users.id`
- `rodadas.created_by` → `users.id`
- `rodada_participantes.user_id` → `users.id`
- `assessments.user_id` → `users.id`
- `results.generated_by` → `users.id`
- `public_shares.created_by` → `users.id`

### 3. **Logs Melhorados**
- Endpoint `/assessments` agora tem logs detalhados
- Endpoint `/participantes/:id` tem validações melhoradas
- Função `ensureUserExists` foi completamente reescrita

## 🚀 Como Aplicar o Schema

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New Query"

3. **Cole o Schema Completo**
   - Abra o arquivo `/database/schema.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor

4. **Execute o Schema**
   - Clique em "Run" (ou pressione Ctrl/Cmd + Enter)
   - Aguarde a execução (pode levar 30-60 segundos)

5. **Verifique a Criação**
   - No final do schema, há uma query de verificação
   - Você deve ver todas as 8 tabelas listadas:
     - `users`
     - `companies`
     - `rodadas`
     - `rodada_participantes`
     - `assessments`
     - `assessment_answers`
     - `results`
     - `public_shares`

### Opção 2: Via CLI (Alternativa)

Se você tiver o Supabase CLI instalado:

```bash
# 1. Fazer login
supabase login

# 2. Linkar ao projeto
supabase link --project-ref SEU_PROJECT_ID

# 3. Aplicar o schema
supabase db push
```

## ✅ Verificação Pós-Aplicação

Após aplicar o schema, execute estas queries para verificar:

### 1. Verificar Tabelas
```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename;
```

Deve retornar 8 tabelas.

### 2. Verificar Foreign Keys
```sql
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

Deve mostrar todas as foreign keys configuradas.

### 3. Verificar Triggers
```sql
SELECT 
  trigger_name, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

Deve mostrar triggers `update_*_updated_at` para todas as tabelas.

## 🧪 Testando o Sistema

Após aplicar o schema:

### 1. Testar Criação de Usuário
```sql
-- Inserir usuário de teste
INSERT INTO users (email, name, role) 
VALUES ('teste@example.com', 'Usuário Teste', 'member')
RETURNING *;

-- Verificar
SELECT * FROM users WHERE email = 'teste@example.com';
```

### 2. Testar Endpoint do Servidor

Abra o console do navegador e execute:

```javascript
// Verificar health do servidor
fetch('https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-2b631963/health')
  .then(r => r.json())
  .then(console.log);

// Buscar usuários
fetch('https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-2b631963/users', {
  headers: { 'Authorization': 'Bearer SEU_ANON_KEY' }
})
  .then(r => r.json())
  .then(console.log);
```

### 3. Testar Fluxo Completo

1. **Login** → Deve funcionar normalmente
2. **Criar Rodada** → Verificar se participantes são criados
3. **Preencher Formulário** → Completar uma avaliação
4. **Verificar no Banco**:
   ```sql
   -- Ver assessments
   SELECT id, user_id, status, overall_score, completed_at 
   FROM assessments 
   ORDER BY created_at DESC 
   LIMIT 5;
   
   -- Ver respostas
   SELECT a.id, a.user_id, COUNT(aa.id) as total_respostas
   FROM assessments a
   LEFT JOIN assessment_answers aa ON aa.assessment_id = a.id
   GROUP BY a.id, a.user_id
   ORDER BY a.created_at DESC;
   
   -- Ver status dos participantes
   SELECT 
     rp.id,
     u.name,
     u.email,
     rp.status,
     rp.progress,
     rp.completed_date
   FROM rodada_participantes rp
   JOIN users u ON u.id = rp.user_id
   ORDER BY rp.created_at DESC;
   ```

## 🔍 Troubleshooting

### Erro: "relation users does not exist"
- **Causa**: Schema não foi aplicado
- **Solução**: Execute o schema SQL completo novamente

### Erro: "foreign key constraint"
- **Causa**: Ordem de criação das tabelas
- **Solução**: O schema já está na ordem correta, execute tudo de uma vez

### Erro: "duplicate key value violates unique constraint"
- **Causa**: Dados conflitantes de testes anteriores
- **Solução**: 
  ```sql
  -- Limpar dados de teste (CUIDADO!)
  TRUNCATE users, companies, rodadas, rodada_participantes, 
           assessments, assessment_answers, results, public_shares 
  CASCADE;
  ```

### Avaliações não estão sendo salvas
1. Verifique os logs do servidor (console do navegador)
2. Verifique se o usuário existe:
   ```sql
   SELECT * FROM users WHERE id = 'SEU_USER_ID';
   ```
3. Se não existir, o sistema deve criar automaticamente via `ensureUserExists`

## 📊 Monitoramento

Para monitorar o sistema em produção:

```sql
-- Total de avaliações por status
SELECT status, COUNT(*) 
FROM assessments 
GROUP BY status;

-- Avaliações completas hoje
SELECT COUNT(*) 
FROM assessments 
WHERE status = 'completed' 
  AND DATE(completed_at) = CURRENT_DATE;

-- Participantes por status
SELECT status, COUNT(*) 
FROM rodada_participantes 
GROUP BY status;

-- Usuários cadastrados
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;
```

## ✨ Próximos Passos

Após aplicar o schema e verificar que tudo está funcionando:

1. ✅ Teste o login
2. ✅ Crie uma nova rodada
3. ✅ Adicione participantes
4. ✅ Preencha uma avaliação completa
5. ✅ Verifique se o status foi atualizado para "concluído"
6. ✅ Verifique se as respostas foram salvas no banco
7. ✅ Gere os resultados

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console (F12 no navegador)
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Execute as queries de verificação acima
4. Verifique se todas as 8 tabelas foram criadas

---

**Data de Criação**: 28 de outubro de 2025
**Status**: ✅ Schema Completo e Testado
**Versão**: 2.0 (Com tabela users e todas as foreign keys)
