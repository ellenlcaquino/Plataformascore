-- ============================================
-- DIAGNÓSTICO SIMPLIFICADO - UMA QUERY ÚNICA
-- ============================================

WITH rodadas_ativas AS (
  SELECT id, versao_id, status, resultado_gerado
  FROM rodadas
  WHERE status = 'ativa'
  LIMIT 5
),
info_participantes AS (
  SELECT 
    rp.rodada_id,
    rp.id as participante_id,
    rp.user_id,
    u.email,
    u.name,
    rp.status as status_participante,
    rp.progress,
    rp.completed_date,
    a.id as assessment_id,
    a.status as status_assessment,
    a.completed_at as assessment_completed_at
  FROM rodada_participantes rp
  LEFT JOIN users u ON u.id = rp.user_id
  LEFT JOIN assessments a ON a.rodada_id = rp.rodada_id AND a.user_id = rp.user_id
  WHERE rp.rodada_id IN (SELECT id FROM rodadas_ativas)
)
SELECT 
  -- Informações da Rodada
  ra.id as "🆔 Rodada ID",
  ra.versao_id as "📋 Versão",
  ra.status as "🔄 Status Rodada",
  
  -- Informações do Participante
  ip.participante_id as "👤 Participante ID",
  ip.name as "📛 Nome",
  ip.email as "📧 Email",
  ip.status_participante as "✅ Status Participante",
  ip.progress || '%' as "📊 Progress",
  ip.completed_date as "📅 Data Conclusão",
  
  -- Informações do Assessment
  ip.assessment_id as "📝 Assessment ID",
  ip.status_assessment as "📄 Status Assessment",
  ip.assessment_completed_at as "🎯 Assessment Completo Em",
  
  -- Diagnóstico
  CASE 
    WHEN ip.assessment_id IS NULL THEN '❌ SEM ASSESSMENT'
    WHEN ip.status_assessment = 'completed' AND ip.status_participante != 'concluido' THEN '🚨 DESSINCRONIA!'
    WHEN ip.status_assessment = 'completed' AND ip.status_participante = 'concluido' THEN '✅ OK'
    WHEN ip.status_assessment = 'draft' THEN '📝 RASCUNHO'
    ELSE '⚠️ DESCONHECIDO'
  END as "🔍 Diagnóstico"
  
FROM rodadas_ativas ra
LEFT JOIN info_participantes ip ON ip.rodada_id = ra.id
ORDER BY 
  ra.id, 
  CASE 
    WHEN ip.status_assessment = 'completed' AND ip.status_participante != 'concluido' THEN 1
    ELSE 2
  END,
  ip.name;
