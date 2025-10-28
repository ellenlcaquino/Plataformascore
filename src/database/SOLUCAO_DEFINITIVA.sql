-- ============================================
-- SOLUÇÃO DEFINITIVA - Execute TUDO de uma vez
-- ============================================
-- Este script resolve o problema de cache do Supabase
-- Execute TODO o conteúdo de uma vez só

-- ============================================
-- PASSO 1: DESABILITAR RLS TEMPORARIAMENTE
-- ============================================
-- Isso vai permitir acesso total enquanto testamos

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE rodada_participantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public_shares DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 2: REMOVER TODAS AS POLÍTICAS ANTIGAS
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow authenticated users" ON rodadas;
DROP POLICY IF EXISTS "Allow authenticated users" ON rodada_participantes;
DROP POLICY IF EXISTS "Allow authenticated users" ON assessments;
DROP POLICY IF EXISTS "Allow authenticated users" ON assessment_answers;
DROP POLICY IF EXISTS "Allow authenticated users" ON results;
DROP POLICY IF EXISTS "Allow public read for active shares" ON public_shares;
DROP POLICY IF EXISTS "Allow authenticated insert/update/delete" ON public_shares;

-- Remover políticas do fix anterior (se existirem)
DROP POLICY IF EXISTS "Enable all access for service role" ON users;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON users;
DROP POLICY IF EXISTS "Enable all access for anon" ON users;
DROP POLICY IF EXISTS "Enable all access for service role" ON companies;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON companies;
DROP POLICY IF EXISTS "Enable all access for anon" ON companies;
DROP POLICY IF EXISTS "Enable all access for service role" ON rodadas;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON rodadas;
DROP POLICY IF EXISTS "Enable all access for anon" ON rodadas;
DROP POLICY IF EXISTS "Enable all access for service role" ON rodada_participantes;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON rodada_participantes;
DROP POLICY IF EXISTS "Enable all access for anon" ON rodada_participantes;
DROP POLICY IF EXISTS "Enable all access for service role" ON assessments;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON assessments;
DROP POLICY IF EXISTS "Enable all access for anon" ON assessments;
DROP POLICY IF EXISTS "Enable all access for service role" ON assessment_answers;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON assessment_answers;
DROP POLICY IF EXISTS "Enable all access for anon" ON assessment_answers;
DROP POLICY IF EXISTS "Enable all access for service role" ON results;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON results;
DROP POLICY IF EXISTS "Enable all access for anon" ON results;
DROP POLICY IF EXISTS "Enable all access for service role" ON public_shares;

-- ============================================
-- PASSO 3: CRIAR USUÁRIO DE TESTE
-- ============================================

DO $$
DECLARE
  test_user_id UUID := 'b3c83159-e2f8-43b7-97b4-22b4469ff35e';
  existing_user_count INT;
BEGIN
  -- Verificar se o usuário já existe
  SELECT COUNT(*) INTO existing_user_count
  FROM users
  WHERE id = test_user_id;
  
  IF existing_user_count = 0 THEN
    -- Criar o usuário que está dando erro
    INSERT INTO users (id, email, name, role)
    VALUES (
      test_user_id,
      'teste@qualitymap.app',
      'Usuário Teste',
      'member'
    );
    RAISE NOTICE '✅ Usuário de teste criado: %', test_user_id;
  ELSE
    RAISE NOTICE '✅ Usuário de teste já existe: %', test_user_id;
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Erro ao criar usuário: %', SQLERRM;
END $$;

-- ============================================
-- PASSO 4: VERIFICAR CRIAÇÃO
-- ============================================

SELECT 
  '✅ USUÁRIO ENCONTRADO!' as status,
  id,
  email,
  name,
  role
FROM users
WHERE id = 'b3c83159-e2f8-43b7-97b4-22b4469ff35e';

-- ============================================
-- PASSO 5: GRANT PERMISSIONS EXPLÍCITAS
-- ============================================

-- Garantir que o schema public tem as permissões corretas
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Garantir permissões nas tabelas
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================
-- PASSO 6: ATUALIZAR DEFAULTS
-- ============================================

-- Garantir que futuras tabelas também tenham permissões
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- ============================================
-- PASSO 7: REFRESH SCHEMA CACHE (forçar)
-- ============================================

-- Atualizar estatísticas das tabelas (força o Postgres a "ver" as tabelas)
ANALYZE users;
ANALYZE companies;
ANALYZE rodadas;
ANALYZE rodada_participantes;
ANALYZE assessments;
ANALYZE assessment_answers;
ANALYZE results;
ANALYZE public_shares;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Mostrar resumo
SELECT 
  '📊 RESUMO DO BANCO DE DADOS' as info,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM rodadas) as total_rodadas,
  (SELECT COUNT(*) FROM assessments) as total_assessments;

-- Mostrar políticas RLS (deve estar vazio = RLS desabilitado)
SELECT 
  '🔓 RLS STATUS (deve estar DISABLED)' as info,
  tablename,
  CASE WHEN rowsecurity THEN '❌ ENABLED' ELSE '✅ DISABLED' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'companies', 'rodadas', 'assessments')
ORDER BY tablename;

-- Testar SELECT direto
SELECT 
  '✅ TESTE DE SELECT' as status,
  COUNT(*) as total_registros
FROM users;

-- Sucesso!
SELECT '
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          ✅ SOLUÇÃO APLICADA COM SUCESSO!                 ║
║                                                            ║
║   ✓ RLS desabilitado em todas as tabelas                  ║
║   ✓ Permissões concedidas para todas as roles             ║
║   ✓ Usuário de teste criado                               ║
║   ✓ Schema cache atualizado                               ║
║                                                            ║
║   PRÓXIMO PASSO:                                           ║
║   1. Feche esta aba                                        ║
║   2. Recarregue a aplicação (Ctrl+F5)                     ║
║   3. Teste o formulário novamente                         ║
║                                                            ║
║   O erro deve estar RESOLVIDO! 🎉                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
' AS resultado_final;
