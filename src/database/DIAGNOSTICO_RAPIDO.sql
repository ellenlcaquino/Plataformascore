-- ======================================
-- DIAGNÓSTICO RÁPIDO - 4 QUERIES ESSENCIAIS
-- ======================================
-- Execute para descobrir o problema

-- ============================================
-- QUERY 1: Últimos assessments criados
-- ============================================
SELECT 
  a.id,
  u.name as user_name,
  u.email,
  a.status,
  a.completed_at,
  a.overall_score,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = a.id) as total_respostas,
  a.created_at,
  a.updated_at
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
ORDER BY a.created_at DESC 
LIMIT 5;

-- ============================================
-- QUERY 2: Problema de Status
-- ============================================
-- Conta quantos assessments estão 'completed' mas SEM data de conclusão
SELECT 
  COUNT(*) as assessments_com_problema,
  'Se > 0 então há problema no completeAssessment()' as diagnostico
FROM assessments
WHERE status = 'completed' AND completed_at IS NULL;

-- ============================================
-- QUERY 3: Usuários Mock no Banco
-- ============================================
-- Verifica se existem usuários mock (Ana Silva, Carlos Santos, etc.)
SELECT 
  COUNT(*) as usuarios_mock,
  'Se > 0 então há dados mock no banco que devem ser deletados' as diagnostico
FROM users 
WHERE 
  name ILIKE '%Ana Silva%' 
  OR name ILIKE '%Carlos Santos%' 
  OR name ILIKE '%Maria Oliveira%'
  OR email ILIKE '%ana.silva%'
  OR email ILIKE '%carlos.santos%';

-- ============================================
-- QUERY 4: Status das Rodadas Ativas
-- ============================================
SELECT 
  r.id,
  r.versao_id,
  r.criterio_encerramento,
  r.status,
  r.resultado_gerado,
  r.due_date,
  COUNT(DISTINCT rp.id) as total_participantes,
  COUNT(DISTINCT a.id) as total_assessments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as assessments_completos,
  COUNT(DISTINCT CASE WHEN a.status = 'draft' THEN a.id END) as em_progresso,
  CASE 
    WHEN r.resultado_gerado = true AND COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) < COUNT(DISTINCT rp.id) 
    THEN '⚠️ PROBLEMA: Resultado gerado antes de todos completarem!'
    ELSE '✅ OK'
  END as diagnostico
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.status = 'ativa'
GROUP BY r.id, r.versao_id, r.criterio_encerramento, r.status, r.resultado_gerado, r.due_date
ORDER BY r.created_at DESC;

-- ============================================
-- QUERY 5: Últimos Resultados Gerados
-- ============================================
SELECT 
  res.id,
  res.rodada_id,
  r.versao_id,
  res.tipo,
  res.total_participantes,
  res.participantes_incluidos,
  res.generated_at,
  CASE 
    WHEN res.participantes_incluidos < res.total_participantes 
    THEN 'Resultado PARCIAL'
    ELSE 'Resultado FINAL (todos participantes)'
  END as tipo_resultado
FROM results res
LEFT JOIN rodadas r ON r.id = res.rodada_id
ORDER BY res.generated_at DESC
LIMIT 5;

-- ============================================
-- QUERY 6: Detalhes dos Usuários Mock (se houver)
-- ============================================
SELECT 
  id,
  email,
  name,
  role,
  company_id,
  created_at
FROM users 
WHERE 
  name ILIKE '%Ana Silva%' 
  OR name ILIKE '%Carlos Santos%' 
  OR name ILIKE '%Maria Oliveira%'
  OR email ILIKE '%ana.silva%'
  OR email ILIKE '%carlos.santos%';

-- ============================================
-- QUERY 7: Contagem Geral por Status
-- ============================================
SELECT 
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as com_data_conclusao,
  COUNT(CASE WHEN completed_at IS NULL THEN 1 END) as sem_data_conclusao,
  ROUND(AVG(overall_score), 2) as score_medio
FROM assessments
GROUP BY status
ORDER BY 
  CASE status 
    WHEN 'completed' THEN 1 
    WHEN 'draft' THEN 2 
  END;

-- ============================================
-- RESUMO FINAL
-- ============================================
SELECT '
============================================================
🔍 DIAGNÓSTICO COMPLETO - ANÁLISE DOS RESULTADOS
============================================================

QUERY 1 - Últimos Assessments:
✅ Verificar se status = "completed" tem completed_at preenchido
✅ Verificar se total_respostas = 91 (ou próximo)
✅ Verificar se overall_score está entre 0 e 5

QUERY 2 - Problema de Status:
❌ Se > 0: Há assessments marcados como "completed" sem data
   → Problema no AssessmentService.completeAssessment()
✅ Se = 0: Status está sendo atualizado corretamente

QUERY 3 - Usuários Mock:
❌ Se > 0: Há dados mock no banco que aparecem nos resultados
   → Executar: DELETE FROM users WHERE name ILIKE ''%Ana Silva%'';
✅ Se = 0: Não há usuários mock no banco

QUERY 4 - Rodadas Ativas:
✅ Verificar se total_participantes = assessments_completos antes de gerar resultado
❌ Se diagnostico = "PROBLEMA": Resultado foi gerado prematuramente

QUERY 5 - Resultados Gerados:
✅ Verificar se participantes_incluidos faz sentido
✅ Verificar tipo: parcial vs final

QUERY 6 - Detalhes dos Mocks:
📋 Lista os usuários mock encontrados (se houver)

QUERY 7 - Resumo por Status:
📊 Visão geral da distribuição de assessments

============================================================
🎯 PRÓXIMOS PASSOS:

1. Execute as queries acima
2. Copie e cole TODOS os resultados aqui
3. Vou analisar e aplicar as correções necessárias

============================================================
' AS "📋 INSTRUÇÕES";
