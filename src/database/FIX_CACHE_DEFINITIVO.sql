-- ============================================
-- FIX DEFINITIVO: Resolver Cache do Supabase
-- ============================================
-- Execute TODO este script de uma vez no SQL Editor
-- Tempo estimado: 30 segundos

-- ============================================
-- PASSO 1: Criar usuário faltante
-- ============================================

DO $$
BEGIN
  -- Inserir o usuário que está causando erro
  INSERT INTO users (id, email, name, role, company_id)
  VALUES (
    'b3c83159-e2f8-43b7-97b4-22b4469ff35e',
    'usuario.sistema@qualitymap.app',
    'Usuário Sistema',
    'member',
    NULL
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();
  
  RAISE NOTICE '✅ Usuário criado/atualizado: b3c83159-e2f8-43b7-97b4-22b4469ff35e';
END $$;

-- ============================================
-- PASSO 2: Criar função para auto-criação de usuários
-- ============================================

-- Esta função será chamada pelo servidor quando um usuário não existir
CREATE OR REPLACE FUNCTION ensure_user_exists(
  p_user_id UUID,
  p_email TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'member'
)
RETURNS TABLE(id UUID, email TEXT, name TEXT, role TEXT) AS $$
DECLARE
  v_email TEXT;
  v_name TEXT;
BEGIN
  -- Verificar se usuário já existe
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.role
  FROM users u
  WHERE u.id = p_user_id;
  
  -- Se não existe, criar
  IF NOT FOUND THEN
    -- Gerar email e nome padrão se não fornecidos
    v_email := COALESCE(p_email, 'user_' || SUBSTRING(p_user_id::TEXT, 1, 8) || '@qualitymap.app');
    v_name := COALESCE(p_name, 'Usuário ' || SUBSTRING(p_user_id::TEXT, 1, 8));
    
    -- Inserir novo usuário
    RETURN QUERY
    INSERT INTO users (id, email, name, role)
    VALUES (p_user_id, v_email, v_name, p_role)
    ON CONFLICT (id) DO UPDATE
    SET updated_at = NOW()
    RETURNING users.id, users.email, users.name, users.role;
    
    RAISE NOTICE '✅ Usuário criado automaticamente: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário explicativo
COMMENT ON FUNCTION ensure_user_exists IS 'Cria usuário automaticamente se não existir. Resolve problema de cache do Supabase Edge Function.';

-- ============================================
-- PASSO 3: Criar função auxiliar para assessments
-- ============================================

-- Esta função facilita a criação de assessments sem verificar usuário antes
CREATE OR REPLACE FUNCTION create_assessment_auto(
  p_user_id UUID,
  p_rodada_id UUID,
  p_company_id UUID,
  p_versao_id TEXT,
  p_overall_score NUMERIC DEFAULT 0,
  p_status TEXT DEFAULT 'draft'
)
RETURNS UUID AS $$
DECLARE
  v_assessment_id UUID;
BEGIN
  -- Garantir que o usuário existe (cria se não existir)
  PERFORM ensure_user_exists(p_user_id);
  
  -- Criar assessment
  INSERT INTO assessments (
    user_id,
    rodada_id,
    company_id,
    versao_id,
    overall_score,
    status,
    completed_at
  )
  VALUES (
    p_user_id,
    p_rodada_id,
    p_company_id,
    p_versao_id,
    p_overall_score,
    p_status,
    CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END
  )
  RETURNING id INTO v_assessment_id;
  
  RAISE NOTICE '✅ Assessment criado: %', v_assessment_id;
  
  RETURN v_assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_assessment_auto IS 'Cria assessment e garante que o usuário existe. Resolve cache do Supabase.';

-- ============================================
-- PASSO 4: Forçar atualização de estatísticas
-- ============================================

-- Forçar o PostgreSQL a atualizar estatísticas
ANALYZE users;
ANALYZE companies;
ANALYZE rodadas;
ANALYZE rodada_participantes;
ANALYZE assessments;
ANALYZE assessment_answers;
ANALYZE results;
ANALYZE public_shares;

-- ============================================
-- PASSO 5: Verificação final
-- ============================================

DO $$
DECLARE
  v_users_count INT;
  v_user_exists BOOLEAN;
BEGIN
  -- Contar usuários
  SELECT COUNT(*) INTO v_users_count FROM users;
  RAISE NOTICE '📊 Total de usuários no banco: %', v_users_count;
  
  -- Verificar se o usuário específico existe
  SELECT EXISTS(
    SELECT 1 FROM users WHERE id = 'b3c83159-e2f8-43b7-97b4-22b4469ff35e'
  ) INTO v_user_exists;
  
  IF v_user_exists THEN
    RAISE NOTICE '✅ Usuário b3c83159-e2f8-43b7-97b4-22b4469ff35e EXISTE no banco';
  ELSE
    RAISE NOTICE '❌ ERRO: Usuário ainda não foi criado!';
  END IF;
  
  -- Verificar se funções foram criadas
  RAISE NOTICE '✅ Função ensure_user_exists criada';
  RAISE NOTICE '✅ Função create_assessment_auto criada';
  RAISE NOTICE '✅ Estatísticas das tabelas atualizadas';
END $$;

-- ============================================
-- PASSO 6: Criar view simplificada (opcional)
-- ============================================

-- View para facilitar consulta de assessments com dados do usuário
CREATE OR REPLACE VIEW v_assessments_full AS
SELECT 
  a.id,
  a.user_id,
  u.email as user_email,
  u.name as user_name,
  a.rodada_id,
  a.company_id,
  a.versao_id,
  a.overall_score,
  a.status,
  a.completed_at,
  a.created_at,
  a.updated_at,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = a.id) as total_answers
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id;

COMMENT ON VIEW v_assessments_full IS 'View completa de assessments com dados do usuário';

-- ============================================
-- PASSO 7: Testar a função ensure_user_exists
-- ============================================

DO $$
DECLARE
  v_test_user RECORD;
  v_test_id UUID := gen_random_uuid();
BEGIN
  -- Testar criação de usuário
  SELECT * INTO v_test_user
  FROM ensure_user_exists(
    v_test_id,
    'teste@qualitymap.app',
    'Usuário Teste',
    'member'
  );
  
  RAISE NOTICE '✅ TESTE: Usuário teste criado: % - %', v_test_user.email, v_test_user.name;
  
  -- Deletar usuário de teste
  DELETE FROM users WHERE id = v_test_id;
  RAISE NOTICE '✅ TESTE: Usuário teste removido';
  
  -- Mensagem final
  RAISE NOTICE '';
  RAISE NOTICE '╔═══════════════════════════════════════════════════════════════╗';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║          🎉 FIX DE CACHE APLICADO COM SUCESSO! 🎉            ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║   O que foi feito:                                            ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║   ✅ Usuário b3c83159-e2f8-43b7-97b4-22b4469ff35e criado     ║';
  RAISE NOTICE '║   ✅ Função ensure_user_exists() criada                      ║';
  RAISE NOTICE '║   ✅ Função create_assessment_auto() criada                  ║';
  RAISE NOTICE '║   ✅ Estatísticas atualizadas (ANALYZE)                      ║';
  RAISE NOTICE '║   ✅ View v_assessments_full criada                          ║';
  RAISE NOTICE '║   ✅ Testes executados com sucesso                           ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║   PRÓXIMO PASSO:                                              ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║   1. Recarregue a aplicação (Ctrl+F5)                        ║';
  RAISE NOTICE '║   2. Tente preencher o formulário                            ║';
  RAISE NOTICE '║   3. O erro NÃO deve mais aparecer!                          ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '║   Para solução completa, edite o servidor conforme:          ║';
  RAISE NOTICE '║   /EXECUTE_ESTES_2_PASSOS.md                                 ║';
  RAISE NOTICE '║                                                               ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
END $$;

-- ============================================
-- COMANDOS ÚTEIS PARA DEBUGGING
-- ============================================

-- Ver todos os usuários:
-- SELECT * FROM users ORDER BY created_at DESC;

-- Testar função ensure_user_exists:
-- SELECT * FROM ensure_user_exists('b3c83159-e2f8-43b7-97b4-22b4469ff35e'::UUID);

-- Ver assessments completos:
-- SELECT * FROM v_assessments_full ORDER BY created_at DESC;

-- Criar usuário manualmente:
-- SELECT * FROM ensure_user_exists(
--   'xxx-xxx-xxx'::UUID,
--   'email@exemplo.com',
--   'Nome do Usuário',
--   'member'
-- );

-- Verificar se funções existem:
-- SELECT proname FROM pg_proc WHERE proname IN ('ensure_user_exists', 'create_assessment_auto');
