-- ============================================
-- VERIFICAÇÃO COMPLETA DAS TABELAS
-- Execute para confirmar que tudo foi criado
-- ============================================

-- 1. Verificar se as tabelas existem
SELECT 
  '✅ TABELAS CRIADAS' as status,
  tablename,
  CASE 
    WHEN tablename = 'users' THEN '👥 Usuários'
    WHEN tablename = 'companies' THEN '🏢 Empresas'
    WHEN tablename = 'rodadas' THEN '🔄 Rodadas'
    WHEN tablename = 'rodada_participantes' THEN '👤 Participantes'
    WHEN tablename = 'assessments' THEN '📝 Avaliações'
    WHEN tablename = 'assessment_answers' THEN '✍️ Respostas'
    WHEN tablename = 'results' THEN '📊 Resultados'
    WHEN tablename = 'public_shares' THEN '🔗 Compartilhamentos'
    ELSE '❓'
  END as descricao
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

-- RESULTADO ESPERADO: 8 linhas

-- ============================================

-- 2. Verificar Row Level Security
SELECT 
  '🔒 ROW LEVEL SECURITY' as info,
  tablename,
  CASE WHEN rowsecurity THEN '✅ Ativado' ELSE '❌ Desativado' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename;

-- ============================================

-- 3. Verificar políticas RLS
SELECT 
  '📋 POLÍTICAS RLS' as info,
  tablename,
  policyname,
  roles::text as permissoes
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename, policyname;

-- ============================================

-- 4. Contar colunas de cada tabela
SELECT 
  '📏 ESTRUTURA DAS TABELAS' as info,
  table_name,
  COUNT(*) as total_colunas
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
GROUP BY table_name
ORDER BY table_name;

-- RESULTADO ESPERADO:
-- users: 8 colunas
-- companies: 8 colunas
-- rodadas: 11 colunas
-- rodada_participantes: 10 colunas
-- assessments: 9 colunas
-- assessment_answers: 7 colunas
-- results: 12 colunas
-- public_shares: 10 colunas

-- ============================================

-- 5. Verificar índices
SELECT 
  '🔍 ÍNDICES CRIADOS' as info,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename, indexname;

-- ============================================

-- 6. Verificar triggers
SELECT 
  '⚙️ TRIGGERS' as info,
  trigger_name,
  event_object_table as tabela,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY event_object_table, trigger_name;

-- ============================================

-- 7. Teste de INSERT (criar usuário de teste)
DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'teste_verificacao_' || floor(random() * 10000) || '@example.com';
BEGIN
  -- Tentar inserir usuário de teste
  INSERT INTO users (email, name, role)
  VALUES (test_email, 'Teste Verificação', 'member')
  RETURNING id INTO test_user_id;
  
  RAISE NOTICE '✅ INSERT FUNCIONANDO! Usuário de teste criado: %', test_user_id;
  
  -- Deletar usuário de teste
  DELETE FROM users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ DELETE FUNCIONANDO! Usuário de teste removido.';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 PARABÉNS! O banco de dados está 100%% funcional!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERRO NO TESTE: %', SQLERRM;
  RAISE NOTICE '⚠️ Verifique se o schema.sql foi executado corretamente.';
END $$;

-- ============================================
-- FIM DA VERIFICAÇÃO
-- ============================================

SELECT '
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ VERIFICAÇÃO COMPLETA DO BANCO DE DADOS               ║
║                                                            ║
║   Se você viu todas as mensagens de sucesso acima,        ║
║   seu banco de dados está configurado corretamente!       ║
║                                                            ║
║   Próximo passo: Execute /database/fix_rls_policies.sql   ║
║   para corrigir as permissões de acesso.                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
' AS resultado_final;
