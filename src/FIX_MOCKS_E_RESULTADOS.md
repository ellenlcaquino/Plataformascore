# 🔧 FIX: Remover Mocks e Corrigir Geração de Resultados

## 🎯 PROBLEMAS IDENTIFICADOS:

### 1. ❌ Dados Mock Aparecem nos Resultados
- **Nomes:** Ana Silva, Carlos Santos, Maria Oliveira, Média
- **Onde:** Componentes de visualização de resultados
- **Causa:** Dados mock hardcoded que aparecem quando não há dados reais

### 2. ❌ Resultados Gerados Antes de Todos Responderem
- **Problema:** Sistema gera resultado mesmo com participantes faltando
- **Esperado:** Se critério é "automático", só gerar quando TODOS responderem
- **Atual:** Pode gerar parcialmente sem controle adequado

### 3. ❌ Status Não Marca como Concluído
- **Problema:** Ao finalizar formulário, status não atualiza para "completed"
- **Esperado:** Status deve ser "completed" e completed_at deve ter data

---

## ✅ CORREÇÕES A FAZER:

### CORREÇÃO 1: Remover Mocks dos Componentes
Arquivos com dados mock:
- `/components/Resultados.tsx` (linhas 345, 378, 411)
- `/components/ResultadosComplete.tsx` (linhas 312, 327, 342)
- `/components/AnaliseAlinhamento.tsx` (linhas 99, 110, 121)
- `/components/MapaDivergenciaSimples.tsx` (linhas 33, 43, 53)
- `/components/Progresso.tsx` (linhas 68, 78)
- `/components/RadarChartPersonas.tsx` (linhas 83, 98, 113)
- `/components/MapaLinhaPilar.tsx` (linhas 183, 200, 217)

### CORREÇÃO 2: Validar Geração Automática no Servidor
Arquivo: `/supabase/functions/server/index.tsx`
- Verificar critério de encerramento
- Só gerar automaticamente se TODOS responderem
- Líder pode gerar manualmente a qualquer momento

### CORREÇÃO 3: Verificar Status Completed
Arquivo: `/services/AssessmentService.ts`
- Função `completeAssessment()` parece correta
- Verificar se está sendo chamada corretamente
- Confirmar que status é atualizado no banco

---

## 🚀 AÇÕES:

### 1. Verificar Status no Banco
```sql
-- Ver assessments e seus status
SELECT 
  id, 
  user_id, 
  status, 
  completed_at, 
  overall_score,
  created_at
FROM assessments 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver quantos completos por rodada
SELECT 
  r.id as rodada_id,
  r.nome as rodada_nome,
  r.criterio_encerramento,
  COUNT(rp.id) as total_participantes,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completos,
  COUNT(CASE WHEN a.status = 'draft' THEN 1 END) as em_progresso
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.status = 'ativa'
GROUP BY r.id, r.nome, r.criterio_encerramento
ORDER BY r.created_at DESC;
```

### 2. Limpar Dados Mock (se houver no banco)
```sql
-- Deletar usuários mock
DELETE FROM users 
WHERE email IN (
  'ana.silva@empresa.com',
  'carlos.santos@empresa.com',
  'maria@empresa.com'
);

-- Verificar se ainda existem
SELECT * FROM users WHERE name ILIKE '%ana silva%' OR name ILIKE '%carlos santos%';
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO:

### Backend (Servidor)
- [ ] Endpoint POST `/assessments` marca status como 'completed'
- [ ] Endpoint POST `/results/generate` verifica critério de encerramento
- [ ] Geração automática só acontece quando TODOS responderam
- [ ] Líder pode gerar manualmente a qualquer momento
- [ ] Participante completa → status muda para 'completed' no banco

### Frontend (Componentes)
- [ ] Remover dados mock de `Resultados.tsx`
- [ ] Remover dados mock de `ResultadosComplete.tsx`
- [ ] Remover dados mock de `AnaliseAlinhamento.tsx`
- [ ] Remover dados mock de `MapaDivergenciaSimples.tsx`
- [ ] Remover dados mock de `Progresso.tsx`
- [ ] Remover dados mock de `RadarChartPersonas.tsx`
- [ ] Remover dados mock de `MapaLinhaPilar.tsx`
- [ ] Componentes devem mostrar "Sem dados" quando não há resultados reais

### Fluxo Completo
- [ ] Usuário preenche formulário
- [ ] Clica em "Concluir Avaliação"
- [ ] Status muda para 'completed' ✅
- [ ] completed_at recebe timestamp ✅
- [ ] Sistema conta quantos completaram
- [ ] Se critério automático + TODOS completaram → gera resultado
- [ ] Se critério manual → líder decide quando gerar
- [ ] Resultado mostra APENAS dados reais (sem mocks)

---

## 🎯 LÓGICA CORRETA:

### Critério Automático
```
1. Participante completa avaliação
2. Sistema verifica: todos completaram?
3. SIM → Gera resultado automaticamente
4. NÃO → Aguarda demais participantes
5. Líder pode gerar parcial manualmente a qualquer momento
```

### Critério Manual
```
1. Participante completa avaliação
2. Sistema NÃO gera automaticamente
3. Líder decide quando gerar (parcial ou final)
4. Líder clica "Gerar Resultados"
5. Sistema gera com participantes que completaram
```

---

## 🔍 LOGS PARA INVESTIGAR:

### Console do Frontend (F12)
```
Procurar por:
- "Assessment criado via SQL Function"
- "completeAssessment"
- "Status atualizado"
```

### Supabase Logs
```
Procurar por:
- POST /assessments com status='completed'
- UPDATE assessments SET status='completed'
- completed_at IS NOT NULL
```

---

**Próximo:** Vou implementar as correções!
