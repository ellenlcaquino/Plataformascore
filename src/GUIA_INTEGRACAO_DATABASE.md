# 🚀 Guia de Integração com Banco de Dados - Início Rápido

## ✅ Checklist de Implementação

### Passo 1: Configurar Supabase

- [x] Conexão com Supabase estabelecida
- [ ] Criar tabelas no banco de dados
- [ ] Verificar tabelas criadas
- [ ] Testar conexão

#### Como fazer:

1. **Abra o Supabase Dashboard**
   - Acesse: https://supabase.com/dashboard
   - Vá para seu projeto

2. **Execute o Schema SQL**
   - Clique em "SQL Editor" no menu lateral
   - Clique em "New Query"
   - Copie todo o conteúdo de `/database/schema.sql`
   - Cole no editor
   - Clique em "Run" ou pressione Ctrl+Enter

3. **Verificar Criação**
   - Vá em "Table Editor"
   - Você deve ver 7 tabelas:
     - ✓ companies
     - ✓ rodadas
     - ✓ rodada_participantes
     - ✓ assessments
     - ✓ assessment_answers
     - ✓ results
     - ✓ public_shares

---

### Passo 2: Testar Integração Básica

Crie um componente de teste simples:

```typescript
// components/TestDatabase.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function TestDatabase() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      // Tentar buscar tabelas
      const { data, error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);

      if (error) {
        setError(error.message);
        setConnected(false);
      } else {
        setConnected(true);
        setError(null);
      }
    } catch (err) {
      setError(String(err));
      setConnected(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Teste de Conexão com Banco</h3>
      
      {connected ? (
        <div className="text-green-600">
          ✅ Conexão estabelecida com sucesso!
        </div>
      ) : (
        <div className="text-red-600">
          ❌ Erro de conexão: {error}
        </div>
      )}

      <Button onClick={testConnection} className="mt-4">
        Testar Novamente
      </Button>
    </Card>
  );
}
```

---

### Passo 3: Criar Primeira Empresa

Execute no SQL Editor do Supabase:

```sql
INSERT INTO companies (
  name, 
  domain, 
  status, 
  leader_id,
  primary_color
) VALUES (
  'Tech Corp Brasil',
  'techcorp.com.br',
  'active',
  '00000000-0000-0000-0000-000000000099', -- ID do usuário manager
  '#2563eb'
);
```

Verificar:

```sql
SELECT * FROM companies;
```

---

### Passo 4: Integrar Formulário com Banco

**Opção A: Usar componente pronto**

```typescript
// App.tsx ou onde renderiza o formulário
import { QualityScoreAssessmentDB } from './components/QualityScoreAssessmentDB';

// Substituir QualityScoreAssessment por:
<QualityScoreAssessmentDB 
  rodadaId={currentRodadaId}
  onComplete={() => {
    console.log('Avaliação concluída!');
    setActiveSection('qualityscore-resultados');
  }}
/>
```

**Opção B: Adaptar componente existente**

```typescript
import { useAssessment } from '../hooks/useAssessment';

function MeuFormulario() {
  const { user } = useAuth();
  const { 
    saveAnswer, 
    getAnswer, 
    completeAssessment 
  } = useAssessment(user.id);

  const handleChange = async (questionId: string, pilarId: number, value: number) => {
    await saveAnswer(questionId, pilarId, value);
  };

  // Resto do código...
}
```

---

### Passo 5: Criar Primeira Rodada

**Via código:**

```typescript
import { rodadaService } from '../services/RodadaService';

async function criarRodadaTeste() {
  const rodada = await rodadaService.createRodada({
    company_id: 'uuid-da-empresa',
    versao_id: '', // Será gerado automaticamente
    criterio_encerramento: 'manual',
    due_date: new Date('2024-12-31').toISOString(),
    created_by: 'uuid-do-usuario',
    participantes: [
      'uuid-participante-1',
      'uuid-participante-2'
    ]
  });

  console.log('Rodada criada:', rodada);
}
```

**Via SQL (para testes):**

```sql
-- Criar rodada
INSERT INTO rodadas (
  company_id,
  versao_id,
  status,
  criterio_encerramento,
  due_date,
  created_by
) VALUES (
  (SELECT id FROM companies LIMIT 1),
  'V2024.10.001',
  'ativa',
  'manual',
  '2024-12-31',
  '00000000-0000-0000-0000-000000000099'
);

-- Adicionar participantes
INSERT INTO rodada_participantes (
  rodada_id,
  user_id,
  status,
  progress,
  can_view_results
) VALUES 
  ((SELECT id FROM rodadas LIMIT 1), 'user-uuid-1', 'pendente', 0, false),
  ((SELECT id FROM rodadas LIMIT 1), 'user-uuid-2', 'pendente', 0, false);
```

---

### Passo 6: Testar Fluxo Completo

1. **Responder Formulário**
   ```typescript
   const { user } = useAuth();
   const { saveAnswer } = useAssessment(user.id, rodadaId);
   
   // Responder pergunta 1 do pilar 1
   await saveAnswer('p1_q1', 1, 4);
   
   // Responder pergunta 2 do pilar 1
   await saveAnswer('p1_q2', 1, 3);
   ```

2. **Verificar no Banco**
   ```sql
   -- Ver assessments criados
   SELECT * FROM assessments ORDER BY created_at DESC LIMIT 5;
   
   -- Ver respostas
   SELECT * FROM assessment_answers ORDER BY created_at DESC LIMIT 10;
   ```

3. **Completar Avaliação**
   ```typescript
   const { completeAssessment } = useAssessment(user.id);
   await completeAssessment();
   ```

4. **Gerar Resultado**
   ```typescript
   import { resultsService } from '../services/ResultsService';
   
   const result = await resultsService.generateResult(rodadaId, user.id);
   console.log('Score geral:', result.overall_score);
   console.log('Scores por pilar:', result.pilar_scores);
   ```

---

## 🔍 Debugging

### Ver dados no Supabase

**Método 1: Table Editor (Visual)**
- Dashboard → Table Editor
- Selecione tabela
- Veja dados em formato tabela

**Método 2: SQL Query**
```sql
-- Últimos assessments
SELECT 
  a.*,
  COUNT(aa.id) as total_respostas
FROM assessments a
LEFT JOIN assessment_answers aa ON aa.assessment_id = a.id
GROUP BY a.id
ORDER BY a.created_at DESC
LIMIT 10;

-- Progresso de uma rodada
SELECT * FROM v_rodadas_stats 
WHERE id = 'uuid-da-rodada';

-- Ver todas as tabelas e quantidade de registros
SELECT 
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM pg_class WHERE relname = tablename) as row_count
FROM pg_tables 
WHERE schemaname = 'public';
```

### Erros Comuns

#### 1. "relation does not exist"

**Causa:** Tabelas não foram criadas

**Solução:**
```sql
-- Verificar se tabelas existem
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Se não existir, executar schema.sql completo
```

#### 2. "permission denied for table X"

**Causa:** RLS (Row Level Security) está bloqueando

**Solução temporária (desenvolvimento):**
```sql
-- Desabilitar RLS temporariamente
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
-- ... demais tabelas
```

#### 3. "null value in column violates not-null constraint"

**Causa:** Campo obrigatório não foi fornecido

**Solução:** Verificar CreateData e garantir que todos os campos obrigatórios estão preenchidos

```typescript
// Exemplo correto:
await assessmentService.createAssessment({
  user_id: user.id,        // ✅ Obrigatório
  company_id: company.id,  // ✅ Obrigatório
  versao_id: 'V2024.10.001', // ✅ Obrigatório
  rodada_id: rodada.id     // ⚠️ Opcional
});
```

---

## 📊 Monitoramento

### Ver estatísticas em tempo real

```sql
-- Dashboard de estatísticas
SELECT 
  'Companies' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active
FROM companies

UNION ALL

SELECT 
  'Rodadas',
  COUNT(*),
  COUNT(CASE WHEN status = 'ativa' THEN 1 END)
FROM rodadas

UNION ALL

SELECT 
  'Assessments',
  COUNT(*),
  COUNT(CASE WHEN status = 'completed' THEN 1 END)
FROM assessments;
```

### Ver progresso de usuários

```sql
SELECT 
  u.name as usuario,
  r.versao_id,
  rp.status,
  rp.progress,
  a.overall_score,
  COUNT(aa.id) as respostas_dadas
FROM rodada_participantes rp
JOIN rodadas r ON r.id = rp.rodada_id
LEFT JOIN assessments a ON a.user_id = rp.user_id AND a.rodada_id = r.id
LEFT JOIN assessment_answers aa ON aa.assessment_id = a.id
-- JOIN com tabela de users (quando implementado)
GROUP BY u.name, r.versao_id, rp.status, rp.progress, a.overall_score
ORDER BY rp.progress DESC;
```

---

## 🎯 Próximos Passos

### Curto Prazo (Semana 1)

- [ ] Criar tabelas no Supabase
- [ ] Testar conexão básica
- [ ] Criar primeira empresa e rodada
- [ ] Integrar formulário com banco
- [ ] Testar salvar/carregar respostas

### Médio Prazo (Semana 2-3)

- [ ] Implementar geração de resultados
- [ ] Criar compartilhamentos públicos
- [ ] Adicionar visualização de progresso em tempo real
- [ ] Implementar notificações (toasts)
- [ ] Testar fluxo completo end-to-end

### Longo Prazo (Mês 1-2)

- [ ] Implementar autenticação real Supabase Auth
- [ ] Configurar RLS policies de produção
- [ ] Adicionar validações no backend (Supabase Functions)
- [ ] Implementar backup automático
- [ ] Otimizar queries e adicionar cache
- [ ] Migrar dados de desenvolvimento para produção

---

## 🔒 Segurança - Checklist

### Desenvolvimento
- [x] Usar publicAnonKey do Supabase
- [ ] RLS desabilitado (apenas dev)
- [ ] Logs de debug ativos

### Produção
- [ ] Habilitar RLS em TODAS as tabelas
- [ ] Criar políticas específicas por role
- [ ] Usar service_role_key apenas no backend
- [ ] Limitar acesso via políticas SQL
- [ ] Implementar rate limiting
- [ ] Habilitar auditoria de queries
- [ ] Remover logs de debug

---

## 📚 Recursos Úteis

### Documentação
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

### Ferramentas
- **Supabase Studio**: Interface visual para dados
- **pgAdmin**: Cliente PostgreSQL completo
- **Postman**: Testar APIs manualmente

### SQL Úteis

```sql
-- Limpar todos os dados (CUIDADO!)
TRUNCATE TABLE 
  assessment_answers,
  assessments,
  results,
  public_shares,
  rodada_participantes,
  rodadas,
  companies
CASCADE;

-- Backup de uma tabela
CREATE TABLE assessments_backup AS 
SELECT * FROM assessments;

-- Restaurar backup
INSERT INTO assessments 
SELECT * FROM assessments_backup;

-- Ver tamanho das tabelas
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ✅ Validação Final

Execute este checklist antes de considerar a integração completa:

- [ ] Todas as 7 tabelas criadas
- [ ] Triggers de updated_at funcionando
- [ ] View v_rodadas_stats retorna dados
- [ ] Função generate_next_versao_id() funciona
- [ ] Consegue criar empresa
- [ ] Consegue criar rodada com participantes
- [ ] Consegue salvar respostas do formulário
- [ ] Consegue completar assessment
- [ ] Consegue gerar resultado
- [ ] Consegue criar link público
- [ ] Consegue acessar link público sem auth
- [ ] Progresso atualiza em tempo real
- [ ] Todos os hooks funcionam sem erro

---

## 🎉 Parabéns!

Se todos os checkboxes acima estão marcados, sua integração está completa! 🚀

Agora você tem:
✅ Banco de dados PostgreSQL configurado  
✅ 7 tabelas relacionadas  
✅ 3 serviços completos (Assessment, Rodada, Results)  
✅ 3 hooks customizados  
✅ Integração em tempo real  
✅ Versionamento de resultados  
✅ Compartilhamento público  

**Próximo nível:** Implementar autenticação real e políticas de segurança! 🔐

---

**Versão:** 1.0  
**Última atualização:** Outubro 2025  
**Status:** ✅ Pronto para Uso
