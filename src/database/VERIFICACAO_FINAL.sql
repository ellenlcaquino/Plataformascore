-- ============================================
-- VERIFICAÇÃO FINAL - Execute para confirmar
-- ============================================
-- Execute este script após aplicar SOLUCAO_DEFINITIVA.sql

-- ============================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- ============================================

SELECT 
  '✅ PASSO 1: VERIFICAR TABELAS' as etapa,
  tablename as tabela,
  CASE 
    WHEN tablename = 'users' THEN '👥 Usuários'
    WHEN tablename = 'companies' THEN '🏢 Empresas'
    WHEN tablename = 'rodadas' THEN '🔄 Rodadas'
    WHEN tablename = 'rodada_participantes' THEN '👤 Participantes'
    WHEN tablename = 'assessments' THEN '📝 Avaliações'
    WHEN tablename = 'assessment_answers' THEN '✍️ Respostas'
    WHEN tablename = 'results' THEN '📊 Resultados'
    WHEN tablename = 'public_shares' THEN '🔗 Compartilhamentos'
  END as descricao,
  '✅ Criada' as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename;

-- RESULTADO ESPERADO: 8 linhas

-- ============================================
-- 2. VERIFICAR ROW LEVEL SECURITY (RLS)
-- ============================================

SELECT 
  '✅ PASSO 2: VERIFICAR RLS (deve estar DISABLED)' as etapa,
  tablename as tabela,
  CASE 
    WHEN rowsecurity THEN '❌ ENABLED (problema!)'
    ELSE '✅ DISABLED (correto!)'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename;

-- RESULTADO ESPERADO: Todas com ✅ DISABLED

-- ============================================
-- 3. VERIFICAR PERMISSÕES (GRANTS)
-- ============================================

SELECT 
  '✅ PASSO 3: VERIFICAR PERMISSÕES' as etapa,
  grantee as role,
  table_name as tabela,
  privilege_type as permissao
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('users', 'companies', 'rodadas', 'assessments')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee;

-- RESULTADO ESPERADO: Múltiplas linhas mostrando INSERT, SELECT, UPDATE, DELETE para anon, authenticated, service_role

-- ============================================
-- 4. CONTAR REGISTROS EM CADA TABELA
-- ============================================

SELECT 
  '✅ PASSO 4: CONTAR REGISTROS' as etapa,
  'users' as tabela,
  COUNT(*) as total
FROM users
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'companies', COUNT(*) FROM companies
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'rodadas', COUNT(*) FROM rodadas
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'rodada_participantes', COUNT(*) FROM rodada_participantes
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'assessments', COUNT(*) FROM assessments
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'assessment_answers', COUNT(*) FROM assessment_answers
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'results', COUNT(*) FROM results
UNION ALL
SELECT '✅ PASSO 4: CONTAR REGISTROS', 'public_shares', COUNT(*) FROM public_shares
ORDER BY tabela;

-- ============================================
-- 5. VERIFICAR SE O USUÁRIO ESPECÍFICO EXISTE
-- ============================================

SELECT 
  '✅ PASSO 5: VERIFICAR USUÁRIO ESPECÍFICO' as etapa,
  id,
  email,
  name,
  role,
  '✅ Encontrado!' as status
FROM users
WHERE id = 'b3c83159-e2f8-43b7-97b4-22b4469ff35e';

-- SE RETORNAR 0 LINHAS, o usuário ainda não existe
-- SOLUÇÃO: Será criado automaticamente quando fizer login/registro

-- ============================================
-- 6. TESTE DE INSERT (criar usuário temporário)
-- ============================================

DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'teste_final_' || floor(random() * 100000)::text || '@example.com';
BEGIN
  -- Tentar inserir usuário de teste
  INSERT INTO users (email, name, role)
  VALUES (test_email, 'Teste Verificação Final', 'member')
  RETURNING id INTO test_user_id;
  
  RAISE NOTICE '✅ PASSO 6: INSERT funcionando! ID: %', test_user_id;
  
  -- Deletar usuário de teste
  DELETE FROM users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ PASSO 6: DELETE funcionando!';
  RAISE NOTICE '';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERRO NO TESTE: %', SQLERRM;
END $$;

-- ============================================
-- 7. VERIFICAR ÍNDICES
-- ============================================

SELECT 
  '✅ PASSO 7: VERIFICAR ÍNDICES' as etapa,
  tablename as tabela,
  indexname as indice,
  '✅ Criado' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'companies', 'rodadas', 'assessments')
  AND indexname NOT LIKE '%pkey'
ORDER BY tablename, indexname;

-- ============================================
-- 8. VERIFICAR TRIGGERS
-- ============================================

SELECT 
  '✅ PASSO 8: VERIFICAR TRIGGERS' as etapa,
  event_object_table as tabela,
  trigger_name as trigger,
  '✅ Ativo' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'update_%_updated_at'
ORDER BY event_object_table;

-- RESULTADO ESPERADO: 8 triggers (um para cada tabela)

-- ============================================
-- 9. VERIFICAR FOREIGN KEYS
-- ============================================

SELECT 
  '✅ PASSO 9: VERIFICAR FOREIGN KEYS' as etapa,
  tc.table_name as tabela,
  kcu.column_name as coluna,
  ccu.table_name as referencia,
  '✅ Configurada' as status
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
-- 10. RESUMO FINAL
-- ============================================

SELECT 
  '📊 RESUMO FINAL' as tipo,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' 
   AND tablename IN ('users', 'companies', 'rodadas', 'rodada_participantes',
                     'assessments', 'assessment_answers', 'results', 'public_shares')) as tabelas_criadas,
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM companies) as total_empresas,
  (SELECT COUNT(*) FROM rodadas) as total_rodadas,
  (SELECT COUNT(*) FROM assessments) as total_avaliacoes;

-- ============================================
-- MENSAGEM FINAL
-- ============================================

SELECT '
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║            🎉 VERIFICAÇÃO COMPLETA FINALIZADA! 🎉            ║
║                                                               ║
║   Se você viu todas as mensagens ✅ acima, significa:        ║
║                                                               ║
║   ✓ 8 tabelas criadas e funcionando                          ║
║   ✓ RLS desabilitado (acesso liberado)                       ║
║   ✓ Permissões concedidas para todas as roles                ║
║   ✓ Índices e triggers ativos                                ║
║   ✓ Foreign keys configuradas                                ║
║   ✓ INSERT/DELETE funcionando perfeitamente                  ║
║                                                               ║
║   🚀 SEU BANCO DE DADOS ESTÁ 100% PRONTO! 🚀                 ║
║                                                               ║
║   PRÓXIMO PASSO:                                              ║
║   1. Volte para a aplicação                                   ║
║   2. Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)            ║
║   3. Teste o formulário de avaliação                          ║
║   4. O erro NÃO deve mais aparecer! ✅                       ║
║                                                               ║
║   Se ainda houver erro, compartilhe a mensagem completa.      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
' AS "🎯 RESULTADO";

-- ============================================
-- COMANDOS ÚTEIS PARA DEBUGGING
-- ============================================

-- Se precisar verificar algo específico:

-- Ver todos os usuários:
-- SELECT * FROM users ORDER BY created_at DESC;

-- Ver todas as rodadas:
-- SELECT * FROM rodadas ORDER BY created_at DESC;

-- Ver status do RLS de uma tabela:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- Ver todas as políticas:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Limpar todos os dados (CUIDADO!):
-- TRUNCATE users, companies, rodadas, rodada_participantes, 
--          assessments, assessment_answers, results, public_shares CASCADE;
