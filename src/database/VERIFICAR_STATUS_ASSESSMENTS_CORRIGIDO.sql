-- ======================================
-- VERIFICAÇÃO: Status dos Assessments (CORRIGIDO)
-- ======================================
-- Execute para diagnosticar o problema

-- 1. Ver todos os assessments recentes
SELECT 
  id,
  user_id,
  rodada_id,
  status,
  overall_score,
  completed_at,
  created_at,
  updated_at,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = assessments.id) as total_respostas
FROM assessments 
ORDER BY created_at DESC 
LIMIT 20;

-- 2. Contar por status
SELECT 
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as com_data_conclusao,
  COUNT(CASE WHEN completed_at IS NULL THEN 1 END) as sem_data_conclusao
FROM assessments
GROUP BY status;

-- 3. Ver assessments por rodada com status dos participantes
SELECT 
  r.id as rodada_id,
  r.versao_id as rodada_versao,
  r.status as rodada_status,
  r.criterio_encerramento,
  r.resultado_gerado,
  COUNT(DISTINCT rp.id) as total_participantes,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as assessments_completos,
  COUNT(DISTINCT CASE WHEN a.status = 'draft' THEN a.id END) as assessments_em_progresso,
  r.resultado_gerado_em
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.status = 'ativa'
GROUP BY r.id, r.versao_id, r.status, r.criterio_encerramento, r.resultado_gerado, r.resultado_gerado_em
ORDER BY r.created_at DESC;

-- 4. Ver ÚLTIMO assessment criado (para debug)
SELECT 
  a.id,
  a.user_id,
  u.name as user_name,
  u.email as user_email,
  a.rodada_id,
  r.versao_id as rodada_versao,
  a.status,
  a.overall_score,
  a.completed_at,
  a.created_at,
  a.updated_at,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = a.id) as total_respostas
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
LEFT JOIN rodadas r ON r.id = a.rodada_id
ORDER BY a.created_at DESC 
LIMIT 5;

-- 5. Ver assessments que estão 'completed' mas SEM completed_at (PROBLEMA!)
SELECT 
  id,
  user_id,
  rodada_id,
  status,
  completed_at,
  overall_score,
  created_at,
  updated_at
FROM assessments
WHERE status = 'completed' AND completed_at IS NULL;

-- 6. Ver assessments que estão 'draft' mas COM completed_at (PROBLEMA!)
SELECT 
  id,
  user_id,
  rodada_id,
  status,
  completed_at,
  overall_score,
  created_at,
  updated_at
FROM assessments
WHERE status = 'draft' AND completed_at IS NOT NULL;

-- 7. Ver rodadas que geraram resultado ANTES de todos responderem (PROBLEMA!)
SELECT 
  r.id,
  r.versao_id,
  r.criterio_encerramento,
  r.resultado_gerado,
  COUNT(DISTINCT rp.id) as total_participantes,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completos,
  r.resultado_gerado_em
FROM rodadas r
JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.resultado_gerado = true
GROUP BY r.id, r.versao_id, r.criterio_encerramento, r.resultado_gerado, r.resultado_gerado_em
HAVING COUNT(DISTINCT rp.id) > COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END);

-- 8. Contar usuários mock (se existirem)
SELECT COUNT(*) as total_usuarios_mock
FROM users 
WHERE 
  email ILIKE '%ana.silva%' OR 
  email ILIKE '%carlos.santos%' OR 
  email ILIKE '%maria%' OR
  name ILIKE '%Ana Silva%' OR
  name ILIKE '%Carlos Santos%' OR
  name ILIKE '%Maria Oliveira%';

-- 9. Ver detalhes dos usuários mock (se existirem)
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM users 
WHERE 
  email ILIKE '%ana.silva%' OR 
  email ILIKE '%carlos.santos%' OR 
  email ILIKE '%maria%' OR
  name ILIKE '%Ana Silva%' OR
  name ILIKE '%Carlos Santos%' OR
  name ILIKE '%Maria Oliveira%';

-- 10. Ver todas as rodadas com contagem de participantes e assessments
SELECT 
  r.id,
  r.versao_id,
  r.status,
  r.criterio_encerramento,
  r.resultado_gerado,
  r.due_date,
  r.created_at,
  COUNT(DISTINCT rp.id) as total_participantes,
  COUNT(DISTINCT a.id) as total_assessments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as assessments_completos,
  COUNT(DISTINCT CASE WHEN a.status = 'draft' THEN a.id END) as assessments_em_progresso
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
GROUP BY r.id, r.versao_id, r.status, r.criterio_encerramento, r.resultado_gerado, r.due_date, r.created_at
ORDER BY r.created_at DESC;

-- 11. Verificar se há resultados gerados
SELECT 
  id,
  rodada_id,
  company_id,
  tipo,
  total_participantes,
  participantes_incluidos,
  generated_at,
  generated_by
FROM resultados
ORDER BY generated_at DESC
LIMIT 10;

-- =======================================================
-- MENSAGEM FINAL
-- =======================================================

SELECT '
============================================================
ANÁLISE COMPLETA (VERSÃO CORRIGIDA)
============================================================

VERIFICAÇÕES REALIZADAS:

1. ✅ Todos os assessments recentes (últimos 20)
2. ✅ Contagem por status (draft vs completed)
3. ✅ Status por rodada (participantes vs assessments)
4. ✅ Últimos 5 assessments criados (para debug)
5. ✅ Assessments com status inconsistente (completed sem data)
6. ✅ Assessments com status inconsistente (draft com data)
7. ✅ Rodadas com resultado gerado prematuramente
8. ✅ Contagem de usuários mock no banco
9. ✅ Detalhes dos usuários mock (se houver)
10. ✅ Visão geral de todas as rodadas
11. ✅ Últimos 10 resultados gerados

PRÓXIMO PASSO:

Execute cada query acima e analise os resultados.

PROBLEMAS COMUNS:

❌ Status "completed" mas completed_at NULL
   → Assessment não foi finalizado corretamente
   → Verificar query 5

❌ Resultado gerado antes de todos responderem
   → Geração automática não está verificando corretamente
   → Verificar query 7

❌ Usuários mock aparecem nos resultados
   → Dados hardcoded nos componentes (não no banco)
   → Verificar queries 8 e 9

❌ Participantes sem assessments
   → Usuários ainda não começaram a preencher
   → Verificar query 10

============================================================
' AS "🔍 DIAGNÓSTICO COMPLETO";
