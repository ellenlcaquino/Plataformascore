# Correção do Erro 500 no Endpoint /rodadas

## 🐛 Problema Identificado

Erro 500 ao acessar o endpoint `/make-server-2b631963/rodadas`:

```
cxstvivhfogzgidyuyfr.supabase.co/functions/v1/make-server-2b631963/rodadas:1  
Failed to load resource: the server responded with a status of 500 ()
```

## 🔍 Causa Raiz

Havia uma **incompatibilidade nas importações do Supabase** entre os arquivos do servidor:

- ❌ **Antes:** `/supabase/functions/server/index.tsx` usava `npm:@supabase/supabase-js@2`
- ❌ **Antes:** `/supabase/functions/server/db-init.tsx` usava `npm:@supabase/supabase-js@2`
- ✅ **Correto:** `/supabase/functions/server/kv_store.tsx` (arquivo protegido) usa `jsr:@supabase/supabase-js@2.49.8`

Esta incompatibilidade causava conflitos durante a execução, resultando em erro 500 ao tentar acessar as funções do KV store.

## ✅ Solução Implementada

Padronizamos todas as importações do Supabase no servidor para usar a mesma fonte:

### 1. Atualização do `/supabase/functions/server/index.tsx`

```typescript
// ANTES
import { createClient } from "npm:@supabase/supabase-js@2";

// DEPOIS
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

### 2. Atualização do `/supabase/functions/server/db-init.tsx`

```typescript
// ANTES
import { createClient } from "npm:@supabase/supabase-js@2";

// DEPOIS
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

### 3. Logs Aprimorados para Debug

Adicionamos logs detalhados no endpoint GET `/rodadas` para facilitar futuras investigações:

```typescript
app.get("/make-server-2b631963/rodadas", async (c) => {
  try {
    console.log('📥 GET /rodadas - Starting request');
    const companyId = c.req.query('companyId');
    console.log('📥 GET /rodadas - companyId:', companyId);
    
    // Try SQL first
    try {
      console.log('📥 GET /rodadas - Trying SQL query...');
      // ... query logic ...
      console.log('✅ GET /rodadas - SQL query successful, returning', data?.length || 0, 'rodadas');
    } catch (sqlError: any) {
      console.log('⚠️ GET /rodadas - SQL not available, using KV store. Error:', sqlError?.message);
    }

    // Fallback to KV store
    console.log('📥 GET /rodadas - Trying KV store...');
    console.log('📥 GET /rodadas - Using prefix:', prefix);
    // ... KV logic ...
    console.log('✅ GET /rodadas - KV store successful, returning', entries?.length || 0, 'rodadas');
  } catch (error: any) {
    console.error('❌ GET /rodadas - Error fetching rodadas:', error);
    console.error('❌ GET /rodadas - Error stack:', error?.stack);
    return c.json({ error: error?.message || 'Unknown error', stack: error?.stack }, 500);
  }
});
```

## 📋 Checklist de Arquivos Atualizados

- ✅ `/supabase/functions/server/index.tsx` - Importação atualizada
- ✅ `/supabase/functions/server/db-init.tsx` - Importação atualizada
- ✅ `/supabase/functions/server/kv_store.tsx` - **Arquivo protegido** (mantém `jsr:@supabase/supabase-js@2.49.8`)

## 🎯 Resultado Esperado

Após a correção, o endpoint `/rodadas` deve:

1. ✅ Responder corretamente sem erro 500
2. ✅ Tentar primeiro o PostgreSQL (se disponível)
3. ✅ Usar fallback para KV Store quando necessário
4. ✅ Retornar logs detalhados para debug
5. ✅ Funcionar corretamente em todas as operações:
   - GET `/rodadas` - Listar rodadas
   - POST `/rodadas` - Criar nova rodada
   - PUT `/rodadas/:id` - Atualizar rodada
   - PUT `/rodadas/:rodadaId/participantes/:participanteId` - Atualizar participante

## 🔧 Regras Importantes

### Arquivo Protegido
⚠️ **NUNCA edite** `/supabase/functions/server/kv_store.tsx` - Este arquivo é protegido e gerado automaticamente.

### Padrão de Importação no Servidor
Sempre use a mesma versão em todos os arquivos do servidor:

```typescript
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

### Padrão de Importação no Frontend
No frontend (React), use sem especificar versão:

```typescript
import { createClient } from '@supabase/supabase-js';
```

## 📝 Monitoramento

Para verificar se o endpoint está funcionando corretamente:

1. **Health Check:**
   ```
   GET https://cxstvivhfogzgidyuyfr.supabase.co/functions/v1/make-server-2b631963/health
   ```

2. **Listar Rodadas:**
   ```
   GET https://cxstvivhfogzgidyuyfr.supabase.co/functions/v1/make-server-2b631963/rodadas
   ```

3. **Verificar Logs:**
   - Acesse o painel do Supabase
   - Navegue até Functions > Logs
   - Procure por mensagens começando com 📥, ✅, ⚠️ ou ❌

## 🎉 Status

- ✅ Problema identificado
- ✅ Causa raiz encontrada
- ✅ Solução implementada
- ✅ Logs aprimorados
- ✅ Documentação criada

---

**Data da Correção:** 27/10/2025  
**Responsável:** Sistema de IA - Figma Make  
**Versão do Sistema:** QualityMap App v2.0
