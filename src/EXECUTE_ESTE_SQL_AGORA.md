# 🔍 EXECUTE ESTE SQL AGORA

## ⚠️ SQL CORRIGIDO!

O arquivo anterior tinha erro na coluna `r.nome` (que não existe).

**Use este arquivo corrigido:**  
👉 `/database/VERIFICAR_STATUS_ASSESSMENTS_CORRIGIDO.sql`

---

## 📋 PASSO A PASSO:

### 1. Abrir Supabase SQL Editor
```
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral
4. Clique em "+ New Query"
```

### 2. Copiar e Executar o SQL
```
1. Abra: /database/VERIFICAR_STATUS_ASSESSMENTS_CORRIGIDO.sql
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em "Run" (ou Ctrl+Enter)
```

### 3. Analisar Resultados

O SQL vai executar **11 queries** e retornar:

#### ✅ Query 1: Últimos 20 assessments
**O que verificar:**
- Status está 'completed'?
- completed_at tem data?
- overall_score está preenchido?
- total_respostas = 91?

#### ✅ Query 2: Contagem por status
**O que verificar:**
- Quantos 'draft' vs 'completed'?
- Todos 'completed' têm data de conclusão?

#### ✅ Query 4: Últimos 5 assessments (MAIS IMPORTANTE!)
**Me mostre este resultado!**
```
Copie e cole AQUI os dados:
- user_name
- status
- completed_at
- total_respostas
```

#### ✅ Query 5: Assessments completed SEM data (PROBLEMA!)
**Se retornar resultados:** PROBLEMA CRÍTICO!
- Significa que status foi marcado como 'completed'
- Mas completed_at não foi preenchido
- **Me avise se houver algum resultado!**

#### ✅ Query 7: Resultados gerados prematuramente (PROBLEMA!)
**Se retornar resultados:** PROBLEMA CRÍTICO!
- Significa que resultado foi gerado
- Mas nem todos participantes completaram
- **Me avise se houver algum resultado!**

#### ✅ Query 8 e 9: Usuários mock
**Se retornar > 0:** Tem dados mock no banco!
- Query 9 mostra quem são
- **Me avise quantos foram encontrados!**

#### ✅ Query 10: Visão geral das rodadas
**O que verificar:**
- total_participantes = quantos foram adicionados
- assessments_completos = quantos finalizaram
- resultado_gerado = true/false

---

## 📊 RESULTADOS QUE PRECISO VER:

### ME ENVIE ESTES RESULTADOS:

1. **Query 2** (Contagem por status)
```
Exemplo:
status    | total | com_data_conclusao | sem_data_conclusao
-----------+-------+--------------------+-------------------
draft     |   5   |         0          |        5
completed |   3   |         3          |        0
```

2. **Query 4** (Últimos 5 assessments)
```
Copie e cole a tabela completa
```

3. **Query 5** (Completed sem data)
```
Se retornar algo, copie TUDO!
Se estiver vazio, escreva: "VAZIO ✅"
```

4. **Query 7** (Resultados prematuros)
```
Se retornar algo, copie TUDO!
Se estiver vazio, escreva: "VAZIO ✅"
```

5. **Query 8** (Contagem de mocks)
```
Exemplo: total_usuarios_mock: 3
```

6. **Query 10** (Visão geral das rodadas)
```
Copie a tabela das rodadas ativas
```

---

## 🎯 DEPOIS DE EXECUTAR:

### SE TUDO ESTIVER OK:
✅ Query 5 vazia (nenhum completed sem data)  
✅ Query 7 vazia (nenhum resultado prematuro)  
✅ Query 8 = 0 (nenhum mock no banco)

**Então:**
- ✅ Backend está funcionando corretamente
- ✅ Problema é apenas nos componentes frontend
- ✅ Vou corrigir os 6 componentes restantes

### SE HOUVER PROBLEMAS:
❌ Query 5 retorna resultados → Status não está atualizando  
❌ Query 7 retorna resultados → Geração prematura  
❌ Query 8 > 0 → Tem mocks no banco

**Então:**
- ❌ Preciso corrigir o backend também
- ❌ Vou criar fix específico baseado nos resultados

---

## 🚀 EXECUTE AGORA E ME ENVIE OS RESULTADOS!

**Arquivo:** `/database/VERIFICAR_STATUS_ASSESSMENTS_CORRIGIDO.sql`

**Aguardando seus resultados para continuar!** 👍

---

## ⚡ ATALHO RÁPIDO:

Se quiser testar apenas o essencial, execute APENAS estas queries:

```sql
-- QUERY ESSENCIAL 1: Últimos assessments
SELECT 
  a.id,
  u.name as user_name,
  a.status,
  a.completed_at,
  a.overall_score,
  (SELECT COUNT(*) FROM assessment_answers WHERE assessment_id = a.id) as total_respostas
FROM assessments a
LEFT JOIN users u ON u.id = a.user_id
ORDER BY a.created_at DESC 
LIMIT 5;

-- QUERY ESSENCIAL 2: Problema de status
SELECT COUNT(*) as assessments_com_problema
FROM assessments
WHERE status = 'completed' AND completed_at IS NULL;

-- QUERY ESSENCIAL 3: Mocks no banco
SELECT COUNT(*) as usuarios_mock
FROM users 
WHERE name ILIKE '%Ana Silva%' 
   OR name ILIKE '%Carlos Santos%' 
   OR name ILIKE '%Maria Oliveira%';

-- QUERY ESSENCIAL 4: Rodadas ativas
SELECT 
  r.versao_id,
  r.criterio_encerramento,
  r.resultado_gerado,
  COUNT(DISTINCT rp.id) as participantes,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completos
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
LEFT JOIN assessments a ON a.rodada_id = r.id AND a.user_id = rp.user_id
WHERE r.status = 'ativa'
GROUP BY r.id, r.versao_id, r.criterio_encerramento, r.resultado_gerado;
```

**Copie e cole os resultados dessas 4 queries!** 🎯
