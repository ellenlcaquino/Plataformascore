-- ============================================
-- DIAGNÓSTICO COMPLETO - STATUS NÃO ATUALIZA
-- ============================================
-- Execute este SQL completo no Supabase SQL Editor
-- Copie TODOS os resultados e cole para análise

-- 1. VERIFICAR RODADAS ATIVAS
SELECT 
  '=== RODADAS ATIVAS ===' as secao,
  id,
  versao_id,
  status,
  created_at,
  resultado_gerado
FROM rodadas
WHERE status = 'ativa'
ORDER BY created_at DESC;

-- 2. PARTICIPANTES DE CADA RODADA
SELECT 
  '=== PARTICIPANTES POR RODADA ===' as secao,
  rp.rodada_id,
  rp.id as participante_id,
  rp.user_id,
  u.email,
  u.name,
  rp.status as status_participante,
  rp.progress,
  rp.completed_date,
  rp.last_activity
FROM rodada_participantes rp
LEFT JOIN users u ON u.id = rp.user_id
WHERE rp.rodada_id IN (SELECT id FROM rodadas WHERE status = 'ativa')
ORDER BY rp.rodada_id, u.name;

-- 3. ASSESSMENTS CRIADOS
SELECT 
  '=== ASSESSMENTS CRIADOS ===' as secao,
  a.id as assessment_id,
  a.user_id,
  u.email,
  u.name,
  a.rodada_id,
  a.status as status_assessment,
  a.overall_score,
  a.completed_at,
  a.created_at,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = a.id) as total_respostas
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
WHERE a.rodada_id IN (SELECT id FROM rodadas WHERE status = 'ativa')
ORDER BY a.rodada_id, a.created_at DESC;

-- 4. CORRELAÇÃO: PARTICIPANTE vs ASSESSMENT
SELECT 
  '=== CORRELAÇÃO PARTICIPANTE <-> ASSESSMENT ===' as secao,
  rp.rodada_id,
  rp.id as participante_id,
  rp.user_id as participante_user_id,
  rp.status as status_participante,
  rp.progress as progress_participante,
  u.email,
  u.name,
  a.id as assessment_id,
  a.status as status_assessment,
  a.completed_at,
  CASE 
    WHEN a.id IS NULL THEN '❌ SEM ASSESSMENT'
    WHEN a.status = 'completed' AND rp.status != 'concluido' THEN '🚨 DESSINCRONIA'
    WHEN a.status = 'completed' AND rp.status = 'concluido' THEN '✅ OK'
    WHEN a.status = 'draft' THEN '📝 RASCUNHO'
    ELSE '⚠️ ESTADO DESCONHECIDO'
  END as diagnostico
FROM rodada_participantes rp
LEFT JOIN users u ON u.id = rp.user_id
LEFT JOIN assessments a ON a.rodada_id = rp.rodada_id AND a.user_id = rp.user_id
WHERE rp.rodada_id IN (SELECT id FROM rodadas WHERE status = 'ativa')
ORDER BY rp.rodada_id, diagnostico, u.name;

-- 5. CONTAGEM POR RODADA
SELECT 
  '=== RESUMO POR RODADA ===' as secao,
  r.id as rodada_id,
  r.versao_id,
  COUNT(DISTINCT rp.id) as total_participantes,
  COUNT(DISTINCT CASE WHEN rp.status = 'concluido' THEN rp.id END) as participantes_concluidos,
  COUNT(DISTINCT CASE WHEN rp.status = 'pendente' THEN rp.id END) as participantes_pendentes,
  COUNT(DISTINCT a.id) as total_assessments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as assessments_completos,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) = COUNT(DISTINCT rp.id) 
      AND COUNT(DISTINCT rp.id) > 0
    THEN '✅ TODOS COMPLETARAM'
    ELSE '⏳ EM ANDAMENTO'
  END as status_geral
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.status = 'ativa'
GROUP BY r.id, r.versao_id
ORDER BY r.created_at DESC;

-- 6. PROBLEMAS IDENTIFICADOS
SELECT 
  '=== 🚨 PROBLEMAS IDENTIFICADOS ===' as secao,
  problema,
  COUNT(*) as ocorrencias
FROM (
  SELECT 
    CASE 
      WHEN a.status = 'completed' AND rp.status != 'concluido' 
        THEN 'Assessment completo mas participante não marcado'
      WHEN a.status = 'completed' AND a.completed_at IS NULL 
        THEN 'Assessment completo mas sem data de conclusão'
      WHEN rp.status = 'concluido' AND a.id IS NULL 
        THEN 'Participante marcado como concluído mas sem assessment'
      WHEN rp.status = 'concluido' AND rp.completed_date IS NULL 
        THEN 'Participante concluído mas sem data'
      ELSE NULL
    END as problema
  FROM rodada_participantes rp
  LEFT JOIN assessments a ON a.rodada_id = rp.rodada_id AND a.user_id = rp.user_id
  WHERE rp.rodada_id IN (SELECT id FROM rodadas WHERE status = 'ativa')
) problemas
WHERE problema IS NOT NULL
GROUP BY problema;

-- 7. ÚLTIMA ATIVIDADE DOS PARTICIPANTES
SELECT 
  '=== ÚLTIMA ATIVIDADE ===' as secao,
  u.name,
  u.email,
  rp.status,
  rp.progress,
  rp.last_activity,
  rp.completed_date,
  a.status as assessment_status,
  a.completed_at as assessment_completed_at,
  CASE 
    WHEN rp.last_activity IS NULL THEN '⚠️ Nunca iniciou'
    WHEN rp.last_activity < NOW() - INTERVAL '1 day' THEN '⏰ Mais de 1 dia'
    WHEN rp.last_activity < NOW() - INTERVAL '1 hour' THEN '🕐 Mais de 1 hora'
    ELSE '🟢 Recente'
  END as atividade
FROM rodada_participantes rp
LEFT JOIN users u ON u.id = rp.user_id
LEFT JOIN assessments a ON a.rodada_id = rp.rodada_id AND a.user_id = rp.user_id
WHERE rp.rodada_id IN (SELECT id FROM rodadas WHERE status = 'ativa')
ORDER BY rp.last_activity DESC NULLS LAST;

-- 8. FUNÇÃO SQL EXISTE?
SELECT 
  '=== VERIFICAÇÃO FUNÇÃO SQL ===' as secao,
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments,
  'EXISTE ✅' as status
FROM pg_proc 
WHERE proname IN ('create_assessment_auto', 'ensure_user_exists', 'generate_next_versao_id')
UNION ALL
SELECT 
  '=== VERIFICAÇÃO FUNÇÃO SQL ===' as secao,
  missing_function as function_name,
  '' as arguments,
  '❌ NÃO EXISTE' as status
FROM (
  SELECT unnest(ARRAY['create_assessment_auto', 'ensure_user_exists', 'generate_next_versao_id']) as missing_function
) funcs
WHERE missing_function NOT IN (SELECT proname FROM pg_proc);

-- FIM DO DIAGNÓSTICO
SELECT '=== DIAGNÓSTICO CONCLUÍDO ===' as resultado,
       'Copie TODOS os resultados acima e cole na conversa' as instrucao;
