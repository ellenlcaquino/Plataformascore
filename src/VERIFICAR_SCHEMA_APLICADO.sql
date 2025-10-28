-- ============================================
-- VERIFICAÇÃO RÁPIDA DO SCHEMA
-- Execute este script APÓS aplicar o schema.sql
-- ============================================

-- 1. Verificar se as tabelas foram criadas
SELECT 
  '✅ TABELAS CRIADAS' as status,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users',
    'companies', 
    'rodadas', 
    'rodada_participantes', 
    'assessments', 
    'assessment_answers', 
    'results', 
    'public_shares'
  )
ORDER BY tablename;

-- RESULTADO ESPERADO: 8 linhas (todas as tabelas acima)

-- ============================================

-- 2. Verificar se a tabela USERS existe especificamente
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public')
    THEN '✅ Tabela USERS existe!'
    ELSE '❌ Tabela USERS NÃO existe - APLIQUE O SCHEMA!'
  END as status_users;

-- RESULTADO ESPERADO: ✅ Tabela USERS existe!

-- ============================================

-- 3. Verificar colunas da tabela users
SELECT 
  '✅ COLUNAS DA TABELA USERS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- RESULTADO ESPERADO: Deve mostrar as colunas:
-- id, email, name, role, company_id, has_logged_in, created_at, updated_at

-- ============================================

-- 4. Contar registros em cada tabela
SELECT 
  'users' as tabela,
  COUNT(*) as total
FROM users
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'rodadas', COUNT(*) FROM rodadas
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'assessment_answers', COUNT(*) FROM assessment_answers
ORDER BY tabela;

-- ============================================

-- 5. Verificar foreign keys
SELECT
  '✅ FOREIGN KEYS' as info,
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND ccu.table_name = 'users'
ORDER BY tc.table_name;

-- RESULTADO ESPERADO: Deve mostrar várias tabelas referenciando 'users'

-- ============================================

-- 6. Verificar triggers
SELECT 
  '✅ TRIGGERS' as info,
  trigger_name, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'update_%_updated_at'
ORDER BY event_object_table;

-- RESULTADO ESPERADO: 8 triggers (um para cada tabela)

-- ============================================

-- 7. TESTE FINAL - Criar usuário de teste
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Tentar inserir usuário de teste
  INSERT INTO users (email, name, role)
  VALUES ('teste_schema_aplicado@example.com', 'Teste Schema', 'member')
  RETURNING id INTO test_user_id;
  
  RAISE NOTICE '✅ SUCESSO! Usuário de teste criado: %', test_user_id;
  
  -- Deletar usuário de teste
  DELETE FROM users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ Teste completo! Schema está funcionando corretamente!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERRO: %', SQLERRM;
  RAISE NOTICE '❌ O schema NÃO foi aplicado corretamente!';
END $$;

-- ============================================
-- FIM DA VERIFICAÇÃO
-- ============================================

-- Se você viu "✅ Teste completo! Schema está funcionando corretamente!"
-- então está TUDO CERTO! Pode usar o sistema normalmente.

-- Se viu algum erro, APLIQUE O SCHEMA.SQL novamente!
