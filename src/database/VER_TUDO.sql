-- ============================================
-- VER TUDO - DIAGNÓSTICO COMPLETO
-- ============================================

-- 1️⃣ TODAS AS RODADAS (qualquer status)
SELECT 
  '🎯 RODADAS' as tipo,
  id as "ID",
  versao_id as "Versão",
  status as "Status",
  resultado_gerado as "Resultado Gerado",
  created_at as "Criada Em"
FROM rodadas
ORDER BY created_at DESC
LIMIT 10;

-- 2️⃣ TODOS OS PARTICIPANTES
SELECT 
  '👥 PARTICIPANTES' as tipo,
  rp.id as "Participante ID",
  rp.rodada_id as "Rodada ID",
  u.name as "Nome",
  u.email as "Email",
  rp.status as "Status",
  rp.progress as "Progress %",
  rp.completed_date as "Concluído Em"
FROM rodada_participantes rp
LEFT JOIN users u ON u.id = rp.user_id
ORDER BY rp.rodada_id DESC, rp.created_at DESC
LIMIT 20;

-- 3️⃣ TODOS OS ASSESSMENTS
SELECT 
  '📝 ASSESSMENTS' as tipo,
  a.id as "Assessment ID",
  a.rodada_id as "Rodada ID",
  u.name as "Nome",
  u.email as "Email",
  a.status as "Status",
  a.completed_at as "Completo Em"
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
ORDER BY a.rodada_id DESC, a.created_at DESC
LIMIT 20;
