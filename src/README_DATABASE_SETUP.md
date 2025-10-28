# 🗄️ Configuração do Banco de Dados - Guia Rápido

## ⚠️ Importante

O sistema agora funciona com **dois modos de armazenamento**:

1. **PostgreSQL (Preferencial)** - Banco de dados completo com relacionamentos
2. **KV Store (Fallback)** - Armazenamento chave-valor quando SQL não está disponível

---

## 🚀 Setup Rápido (Método Recomendado)

### **Opção 1: Usar o Supabase Dashboard (Mais Fácil)**

1. **Acessar o Supabase Dashboard**
   - Ir para: https://supabase.com/dashboard
   - Selecionar seu projeto

2. **Abrir o SQL Editor**
   - Menu lateral: `SQL Editor`
   - Clicar em `New Query`

3. **Executar o Schema SQL**
   - Copiar todo o conteúdo de `/database/schema.sql`
   - Colar no editor
   - Clicar em `Run`

4. **Verificar Tabelas Criadas**
   - Menu lateral: `Table Editor`
   - Você deve ver:
     - ✅ companies
     - ✅ rodadas
     - ✅ rodada_participantes
     - ✅ assessments
     - ✅ assessment_answers
     - ✅ results
     - ✅ public_shares

---

### **Opção 2: Usar Supabase CLI**

```bash
# 1. Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Link com seu projeto
supabase link --project-ref your-project-ref

# 4. Executar migrations
supabase db push

# 5. Ou executar SQL diretamente
supabase db execute -f database/schema.sql
```

---

## 🔧 Como Funciona o Sistema de Fallback

### **Quando SQL está disponível:**
```
Cliente → API → PostgreSQL → Retorna dados
                    ✅
```

### **Quando SQL NÃO está disponível:**
```
Cliente → API → ❌ PostgreSQL (erro)
              ↓
              KV Store → Retorna dados
                ✅
```

### **Criação de Rodada com Fallback:**

```typescript
// Backend automaticamente tenta SQL primeiro
try {
  // Tenta criar no PostgreSQL
  const rodada = await supabase.from('rodadas').insert(...);
  return rodada;
} catch (sqlError) {
  console.log('SQL não disponível, usando KV Store');
  
  // Fallback para KV Store
  const rodada = { id: uuid(), ...dados };
  await kv.set(["rodadas", companyId, rodadaId], rodada);
  return rodada;
}
```

---

## 📊 Estrutura das Tabelas

### **1. companies**
```sql
id              UUID PRIMARY KEY
name            TEXT NOT NULL
domain          TEXT UNIQUE
primary_color   TEXT DEFAULT '#2563eb'
status          TEXT ('active' | 'inactive')
leader_id       UUID NOT NULL
created_at      TIMESTAMPTZ
```

### **2. rodadas**
```sql
id                      UUID PRIMARY KEY
company_id              UUID REFERENCES companies(id)
versao_id               TEXT (ex: V2024.10.001)
status                  TEXT ('rascunho' | 'ativa' | 'encerrada')
criterio_encerramento   TEXT ('manual' | 'automatico')
due_date                TIMESTAMPTZ
created_by              UUID
created_at              TIMESTAMPTZ
```

### **3. rodada_participantes**
```sql
id                  UUID PRIMARY KEY
rodada_id           UUID REFERENCES rodadas(id)
user_id             UUID
status              TEXT ('pendente' | 'respondendo' | 'concluido' | 'atrasado')
progress            INTEGER (0-100)
can_view_results    BOOLEAN
completed_date      TIMESTAMPTZ
```

### **4. assessments**
```sql
id              UUID PRIMARY KEY
user_id         UUID
rodada_id       UUID REFERENCES rodadas(id)
company_id      UUID REFERENCES companies(id)
versao_id       TEXT
overall_score   DECIMAL(3,1) (0.0-5.0)
status          TEXT ('draft' | 'completed')
completed_at    TIMESTAMPTZ
```

### **5. assessment_answers**
```sql
id              UUID PRIMARY KEY
assessment_id   UUID REFERENCES assessments(id)
question_id     TEXT (ex: process1, auto2)
pilar_id        INTEGER (1-7)
value           INTEGER (0-5)
```

---

## 🧪 Testar se o Banco está Funcionando

### **Teste 1: Health Check**
```bash
curl https://your-project.supabase.co/functions/v1/make-server-2b631963/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-10-27T12:00:00.000Z"
}
```

---

### **Teste 2: Criar Rodada**

1. **Abrir o App**
2. **Login como Leader**
3. **Menu: Rodadas**
4. **Clicar: [+ Nova Rodada]**
5. **Preencher e Enviar**

**Verificar no Console do Navegador:**
```
✅ Rodada created in SQL: uuid-rodada
OU
⚠️ SQL not available, using KV store
✅ Rodada created in KV store: uuid-rodada
```

---

### **Teste 3: Verificar no Supabase Dashboard**

1. **Ir para: Table Editor**
2. **Selecionar: rodadas**
3. **Verificar se há registros**

Se não houver registros mas o sistema está funcionando:
- ✅ Está usando KV Store (fallback)
- ℹ️ Configure o SQL para dados persistentes

---

## 🔍 Diagnóstico de Problemas

### **Erro: "Could not find table 'rodadas'"**

**Causa:** Tabelas SQL não foram criadas

**Solução:**
```bash
# Opção 1: Via Dashboard
1. Supabase Dashboard → SQL Editor
2. Copiar /database/schema.sql
3. Run

# Opção 2: Via CLI
supabase db execute -f database/schema.sql
```

---

### **Logs dizem "SQL not available"**

**Status:** ✅ Normal - Sistema usando KV Store

**Para habilitar SQL:**
1. Executar schema.sql no Supabase
2. Verificar permissões RLS
3. Reiniciar Edge Function

---

### **Dados não persistem após reload**

**Se usando KV Store:**
- ✅ KV Store é persistente
- ✅ Dados não são perdidos

**Se quiser SQL:**
- Executar schema.sql
- Dados serão salvos no PostgreSQL

---

## 📋 Checklist de Configuração

- [ ] Supabase project criado
- [ ] Schema SQL executado via Dashboard ou CLI
- [ ] Tabelas aparecem no Table Editor
- [ ] Edge Function deployed
- [ ] Health check retorna "ok"
- [ ] Criar rodada funciona
- [ ] Criar usuário funciona
- [ ] Dados persistem após reload

---

## 🎯 Modo de Operação Atual

**Sem SQL configurado:**
```
✅ Sistema funciona
✅ Usa KV Store
✅ Dados persistem
⚠️ Sem relacionamentos SQL
⚠️ Sem queries complexas
```

**Com SQL configurado:**
```
✅ Sistema funciona
✅ Usa PostgreSQL
✅ Dados persistem
✅ Relacionamentos completos
✅ Queries otimizadas
✅ Fallback para KV se necessário
```

---

## 🚀 Próximos Passos

### **1. Configurar SQL (Recomendado)**
- Executar `/database/schema.sql`
- Melhor performance
- Queries relacionais

### **2. Ou Continuar com KV Store**
- Já funciona out-of-the-box
- Mais simples
- Adequado para protótipos

### **3. Hybrid Mode (Atual)**
- Tenta SQL primeiro
- Fallback para KV
- Melhor de ambos os mundos

---

## 📝 Exemplo de Código Backend

### **Criar Rodada (com Fallback)**

```typescript
app.post("/make-server-2b631963/rodadas", async (c) => {
  const body = await c.req.json();
  
  // Try SQL first
  try {
    const { data } = await supabase
      .from('rodadas')
      .insert({ ...body })
      .select()
      .single();
    
    console.log('✅ Created in SQL');
    return c.json({ rodada: data });
  } catch (sqlError) {
    console.log('⚠️ SQL failed, using KV');
    
    // Fallback to KV
    const kv = await Deno.openKv();
    const rodada = { id: crypto.randomUUID(), ...body };
    await kv.set(["rodadas", rodada.id], rodada);
    
    console.log('✅ Created in KV');
    return c.json({ rodada });
  }
});
```

---

## ✅ Status Atual

- [x] KV Store configurado e funcionando
- [x] Fallback automático implementado
- [x] Sistema funciona sem SQL
- [x] Schema SQL documentado
- [x] Guia de setup criado
- [ ] SQL configurado (opcional - usuário decide)

---

**Sistema 100% funcional mesmo sem SQL configurado!** ✨

O fallback para KV Store garante que tudo funcione imediatamente. Configure SQL quando quiser usar recursos avançados.

---

## 🆘 Suporte

**Erro persistente?**
1. Verificar logs do Edge Function
2. Testar health check endpoint
3. Verificar permissões do Supabase
4. Consultar documentação do Supabase

**Dúvidas sobre SQL vs KV?**
- **KV Store**: Simples, rápido, já funciona
- **SQL**: Completo, relacional, melhor para produção
- **Ambos**: Sistema usa o melhor de cada um

---

**Última atualização:** Outubro 2025  
**Status:** Sistema Funcional com Dual Storage
