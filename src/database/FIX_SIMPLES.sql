-- ============================================
-- FIX CACHE SUPABASE - Versão Simples
-- ============================================
-- Execute este SQL completo de uma vez

-- 1. Criar usuário faltante
DO $$
BEGIN
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
  
  RAISE NOTICE 'Usuario criado/atualizado';
END $$;

-- 2. Criar função que garante que usuário existe
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
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.role
  FROM users u
  WHERE u.id = p_user_id;
  
  IF NOT FOUND THEN
    v_email := COALESCE(p_email, 'user_' || SUBSTRING(p_user_id::TEXT, 1, 8) || '@qualitymap.app');
    v_name := COALESCE(p_name, 'Usuario ' || SUBSTRING(p_user_id::TEXT, 1, 8));
    
    RETURN QUERY
    INSERT INTO users (id, email, name, role)
    VALUES (p_user_id, v_email, v_name, p_role)
    ON CONFLICT (id) DO UPDATE
    SET updated_at = NOW()
    RETURNING users.id, users.email, users.name, users.role;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar função para criar assessment automaticamente
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
  PERFORM ensure_user_exists(p_user_id);
  
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
  
  RETURN v_assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Atualizar estatísticas
ANALYZE users;
ANALYZE companies;
ANALYZE rodadas;
ANALYZE rodada_participantes;
ANALYZE assessments;
ANALYZE assessment_answers;
ANALYZE results;
ANALYZE public_shares;

-- 5. Criar view útil
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

-- 6. Verificação e mensagem final
DO $$
DECLARE
  v_users_count INT;
  v_user_exists BOOLEAN;
  v_func_exists BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO v_users_count FROM users;
  
  SELECT EXISTS(
    SELECT 1 FROM users WHERE id = 'b3c83159-e2f8-43b7-97b4-22b4469ff35e'
  ) INTO v_user_exists;
  
  SELECT EXISTS(
    SELECT 1 FROM pg_proc WHERE proname = 'ensure_user_exists'
  ) INTO v_func_exists;
  
  RAISE NOTICE '';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'FIX APLICADO COM SUCESSO!';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Total de usuarios: %', v_users_count;
  RAISE NOTICE 'Usuario sistema existe: %', v_user_exists;
  RAISE NOTICE 'Funcao ensure_user_exists existe: %', v_func_exists;
  RAISE NOTICE '';
  RAISE NOTICE 'PROXIMO PASSO:';
  RAISE NOTICE '1. Recarregue a aplicacao (Ctrl+F5)';
  RAISE NOTICE '2. Teste o formulario';
  RAISE NOTICE '3. O erro deve ter desaparecido!';
  RAISE NOTICE '';
  RAISE NOTICE 'Para solucao completa, veja: /EXECUTE_ESTES_2_PASSOS.md';
  RAISE NOTICE '=================================================';
  RAISE NOTICE '';
END $$;
