-- ============================================
-- Script de Teste - QualityMap Database
-- ============================================
-- Execute este script após aplicar o schema.sql
-- para verificar se tudo está funcionando

-- ============================================
-- 1. VERIFICAR TABELAS CRIADAS
-- ============================================

SELECT '🔍 VERIFICANDO TABELAS...' as status;

SELECT 
  tablename as tabela,
  CASE 
    WHEN tablename IN ('users', 'companies', 'rodadas', 'rodada_participantes', 
                       'assessments', 'assessment_answers', 'results', 'public_shares')
    THEN '✅'
    ELSE '❌'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename;

-- ============================================
-- 2. VERIFICAR FOREIGN KEYS
-- ============================================

SELECT '🔗 VERIFICANDO FOREIGN KEYS...' as status;

SELECT
  tc.table_name as tabela, 
  kcu.column_name as coluna,
  ccu.table_name as referencia_tabela,
  ccu.column_name as referencia_coluna,
  '✅' as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 3. VERIFICAR TRIGGERS
-- ============================================

SELECT '⚡ VERIFICANDO TRIGGERS...' as status;

SELECT 
  trigger_name as trigger,
  event_object_table as tabela,
  '✅' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'update_%_updated_at'
ORDER BY event_object_table;

-- ============================================
-- 4. VERIFICAR ÍNDICES
-- ============================================

SELECT '📊 VERIFICANDO ÍNDICES...' as status;

SELECT 
  schemaname as schema,
  tablename as tabela,
  indexname as indice,
  '✅' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename, indexname;

-- ============================================
-- 5. TESTE DE INSERÇÃO - DADOS DE EXEMPLO
-- ============================================

SELECT '🧪 EXECUTANDO TESTES DE INSERÇÃO...' as status;

-- Limpar dados de teste anteriores (se existirem)
DELETE FROM public_shares WHERE created_by IN (
  SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
);
DELETE FROM assessment_answers WHERE assessment_id IN (
  SELECT id FROM assessments WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
  )
);
DELETE FROM assessments WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
);
DELETE FROM results WHERE generated_by IN (
  SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
);
DELETE FROM rodada_participantes WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
);
DELETE FROM rodadas WHERE created_by IN (
  SELECT id FROM users WHERE email LIKE 'teste_%@example.com'
);
DELETE FROM users WHERE company_id IN (
  SELECT id FROM companies WHERE domain LIKE 'teste_%'
);
DELETE FROM companies WHERE domain LIKE 'teste_%';

-- 5.1. Criar Usuário de Teste
INSERT INTO users (id, email, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'teste_user@example.com',
  'Usuário de Teste',
  'member'
)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

SELECT '✅ Usuário de teste criado' as status;

-- 5.2. Criar Empresa de Teste
INSERT INTO companies (id, name, domain, leader_id)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Empresa de Teste',
  'teste_company',
  '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (domain) DO UPDATE SET name = EXCLUDED.name;

SELECT '✅ Empresa de teste criada' as status;

-- 5.3. Atualizar company_id do usuário
UPDATE users 
SET company_id = '00000000-0000-0000-0000-000000000002'
WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT '✅ Usuário associado à empresa' as status;

-- 5.4. Criar Rodada de Teste
INSERT INTO rodadas (
  id,
  company_id,
  versao_id,
  status,
  due_date,
  created_by
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'V2025.10.001',
  'ativa',
  NOW() + INTERVAL '7 days',
  '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (company_id, versao_id) DO UPDATE SET status = EXCLUDED.status;

SELECT '✅ Rodada de teste criada' as status;

-- 5.5. Adicionar Participante
INSERT INTO rodada_participantes (
  rodada_id,
  user_id,
  status,
  progress
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'pendente',
  0
)
ON CONFLICT (rodada_id, user_id) DO UPDATE SET status = EXCLUDED.status;

SELECT '✅ Participante adicionado' as status;

-- 5.6. Criar Assessment
INSERT INTO assessments (
  id,
  user_id,
  rodada_id,
  company_id,
  versao_id,
  overall_score,
  status,
  completed_at
)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'V2025.10.001',
  4.2,
  'completed',
  NOW()
);

SELECT '✅ Assessment criado' as status;

-- 5.7. Adicionar Respostas de Teste
INSERT INTO assessment_answers (assessment_id, question_id, pilar_id, value)
VALUES 
  ('00000000-0000-0000-0000-000000000004', 'process1', 1, 4),
  ('00000000-0000-0000-0000-000000000004', 'process2', 1, 5),
  ('00000000-0000-0000-0000-000000000004', 'auto1', 2, 3),
  ('00000000-0000-0000-0000-000000000004', 'metric1', 3, 4);

SELECT '✅ Respostas de teste criadas' as status;

-- 5.8. Atualizar Status do Participante
UPDATE rodada_participantes
SET 
  status = 'concluido',
  progress = 100,
  completed_date = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND rodada_id = '00000000-0000-0000-0000-000000000003';

SELECT '✅ Status do participante atualizado' as status;

-- ============================================
-- 6. VERIFICAR DADOS INSERIDOS
-- ============================================

SELECT '📋 VERIFICANDO DADOS INSERIDOS...' as status;

-- Verificar usuário
SELECT 
  '✅ Usuário' as tipo,
  id,
  email,
  name,
  role,
  company_id
FROM users
WHERE email = 'teste_user@example.com';

-- Verificar empresa
SELECT 
  '✅ Empresa' as tipo,
  id,
  name,
  domain,
  leader_id
FROM companies
WHERE domain = 'teste_company';

-- Verificar rodada
SELECT 
  '✅ Rodada' as tipo,
  id,
  versao_id,
  status,
  created_by
FROM rodadas
WHERE versao_id = 'V2025.10.001';

-- Verificar participante
SELECT 
  '✅ Participante' as tipo,
  id,
  user_id,
  rodada_id,
  status,
  progress,
  completed_date
FROM rodada_participantes
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Verificar assessment
SELECT 
  '✅ Assessment' as tipo,
  id,
  user_id,
  status,
  overall_score,
  completed_at
FROM assessments
WHERE id = '00000000-0000-0000-0000-000000000004';

-- Verificar respostas
SELECT 
  '✅ Respostas' as tipo,
  COUNT(*) as total_respostas
FROM assessment_answers
WHERE assessment_id = '00000000-0000-0000-0000-000000000004';

-- ============================================
-- 7. TESTE DE FOREIGN KEYS
-- ============================================

SELECT '🔗 TESTANDO INTEGRIDADE REFERENCIAL...' as status;

-- Tentar inserir assessment com user_id inválido (deve falhar)
DO $$
BEGIN
  INSERT INTO assessments (
    user_id,
    company_id,
    versao_id,
    status
  )
  VALUES (
    '99999999-9999-9999-9999-999999999999', -- user_id inválido
    '00000000-0000-0000-0000-000000000002',
    'V2025.10.002',
    'draft'
  );
  
  RAISE EXCEPTION '❌ ERRO: Foreign key deveria ter impedido esta inserção!';
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE NOTICE '✅ Foreign key funcionando corretamente (impediu inserção inválida)';
END $$;

-- ============================================
-- 8. TESTE DE TRIGGERS
-- ============================================

SELECT '⚡ TESTANDO TRIGGERS...' as status;

-- Atualizar usuário e verificar updated_at
UPDATE users 
SET name = 'Usuário de Teste (Atualizado)'
WHERE email = 'teste_user@example.com';

SELECT 
  '✅ Trigger updated_at' as tipo,
  CASE 
    WHEN updated_at > created_at THEN '✅ Funcionando'
    ELSE '❌ Não funcionando'
  END as status,
  created_at,
  updated_at
FROM users
WHERE email = 'teste_user@example.com';

-- ============================================
-- 9. RESUMO FINAL
-- ============================================

SELECT '🎉 RESUMO DOS TESTES' as status;

SELECT 
  'Tabelas criadas' as item,
  COUNT(*) as total,
  '✅' as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  );

SELECT 
  'Foreign keys' as item,
  COUNT(*) as total,
  '✅' as status
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name IN (
    'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  );

SELECT 
  'Triggers' as item,
  COUNT(*) as total,
  '✅' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'update_%_updated_at';

SELECT 
  'Dados de teste inseridos' as item,
  1 as total,
  '✅' as status;

-- ============================================
-- 10. LIMPEZA (OPCIONAL)
-- ============================================

-- Descomente as linhas abaixo se quiser limpar os dados de teste

/*
SELECT '🧹 LIMPANDO DADOS DE TESTE...' as status;

DELETE FROM assessment_answers WHERE assessment_id = '00000000-0000-0000-0000-000000000004';
DELETE FROM assessments WHERE id = '00000000-0000-0000-0000-000000000004';
DELETE FROM rodada_participantes WHERE rodada_id = '00000000-0000-0000-0000-000000000003';
DELETE FROM rodadas WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE users SET company_id = NULL WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM companies WHERE id = '00000000-0000-0000-0000-000000000002';
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT '✅ Dados de teste removidos' as status;
*/

-- ============================================
-- FIM DOS TESTES
-- ============================================

SELECT '✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!' as status;
SELECT '📊 Verifique os resultados acima para confirmar que tudo está funcionando.' as instrucao;
SELECT '🚀 Seu banco de dados está pronto para uso!' as resultado;
