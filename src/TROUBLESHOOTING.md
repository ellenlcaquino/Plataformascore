# 🔧 Troubleshooting - Solução Rápida de Problemas

## ❌ Erro: "Could not find table 'rodadas'"

### **Causa**
As tabelas SQL não foram criadas no Supabase.

### **Solução Rápida**
✅ **O sistema já está funcionando com KV Store!**

Você não precisa fazer nada - o sistema usa fallback automático.

### **Solução Completa (Opcional)**

**Para habilitar PostgreSQL:**

1. **Via Supabase Dashboard:**
   ```
   1. Ir para: https://supabase.com/dashboard
   2. Selecionar seu projeto
   3. Menu: SQL Editor
   4. New Query
   5. Copiar conteúdo de /database/schema.sql
   6. Run
   7. Verificar: Table Editor → deve ter 7 tabelas
   ```

2. **Via Supabase CLI:**
   ```bash
   supabase db execute -f database/schema.sql
   ```

---

## ❌ Erro: "Failed to fetch"

### **Causa**
Backend não está acessível.

### **Solução**

1. **Verificar se Edge Function está rodando:**
   ```bash
   curl https://your-project.supabase.co/functions/v1/make-server-2b631963/health
   ```

2. **Verificar variáveis de ambiente:**
   - SUPABASE_URL está configurada?
   - SUPABASE_SERVICE_ROLE_KEY está configurada?

3. **Verificar CORS:**
   - Edge Function tem CORS habilitado
   - Headers corretos no request

---

## ❌ Rodada não aparece após criar

### **Causa**
Frontend não está recarregando dados.

### **Solução**

**Método 1: Reload Manual**
```typescript
// Após criar rodada
window.location.reload();
```

**Método 2: Verificar Toast**
- Se apareceu "Rodada criada com sucesso!" → está funcionando
- Verifique se está na aba correta (Ativas/Encerradas)

**Método 3: Verificar Logs**
```javascript
// Abrir Console do Navegador (F12)
// Procurar por:
✅ Rodada created in SQL: uuid
OU
✅ Rodada created in KV store: uuid
```

---

## ❌ Usuário não é criado

### **Causa**
Validação de email ou dados incompletos.

### **Solução**

1. **Verificar Console:**
   ```javascript
   // Deve mostrar:
   ✅ Created new user: uuid, email@domain.com
   ```

2. **Verificar formato de email:**
   ```
   ✅ user@company.com
   ❌ user@
   ❌ @company.com
   ❌ user company.com
   ```

3. **Verificar role do usuário logado:**
   - Manager: pode criar em qualquer empresa
   - Leader: só pode criar em sua empresa
   - Member: não pode criar usuários

---

## ⚠️ Logs mostram "SQL not available"

### **Status**
✅ **Isso é NORMAL!**

O sistema está usando KV Store (fallback).

### **Significado**
```
⚠️ SQL not available, using KV store
✅ Rodada created in KV store: uuid
```

**Tradução:**
- Tentou usar PostgreSQL
- PostgreSQL não disponível
- Usou KV Store como backup
- Operação completada com sucesso

### **Para habilitar SQL**
Ver seção "Could not find table 'rodadas'" acima.

---

## ❌ Toast não aparece

### **Causa**
Sonner não está configurado corretamente.

### **Solução**

1. **Verificar se `<Toaster />` está no App.tsx:**
   ```tsx
   import { Toaster } from "./components/ui/sonner";
   
   export default function App() {
     return (
       <div>
         {/* seu app */}
         <Toaster />  {/* ← Deve estar aqui */}
       </div>
     );
   }
   ```

2. **Verificar import do toast:**
   ```typescript
   import { toast } from 'sonner@2.0.3';  // ✅ Com versão
   // NÃO:
   import { toast } from 'sonner';        // ❌ Sem versão
   ```

---

## ❌ Dados não persistem após reload

### **Diagnóstico**

**Se usando KV Store:**
✅ KV Store é persistente
✅ Dados devem permanecer

**Se dados somem:**
- Verificar se está em modo desenvolvimento local
- KV local pode ser resetado
- Usar Supabase KV para produção

**Solução:**
```typescript
// Verificar onde dados estão sendo salvos
console.log('Salvando em:', Deno.env.get('DENO_DEPLOYMENT_ID') ? 'Produção' : 'Local');
```

---

## ❌ "Authorization error"

### **Causa**
Token de autenticação incorreto ou ausente.

### **Solução**

1. **Verificar import:**
   ```typescript
   import { projectId, publicAnonKey } from '../utils/supabase/info';
   ```

2. **Verificar headers:**
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${publicAnonKey}`,  // ✅ Correto
   }
   ```

3. **Verificar se usuário está logado:**
   ```typescript
   const { user } = useAuth();
   if (!user) {
     // Redirecionar para login
   }
   ```

---

## ❌ "Cannot read property 'companyId' of undefined"

### **Causa**
Tentando acessar propriedade de usuário não carregado.

### **Solução**

```typescript
// ❌ Errado
const companyId = user.companyId;

// ✅ Correto
const companyId = user?.companyId;

// ✅ Melhor
if (!user) return null;
const companyId = user.companyId;
```

---

## 🔄 Resetar Dados de Teste

### **KV Store**

Não há interface web. Dados são sobrescritos ao criar novos registros.

### **PostgreSQL**

```sql
-- Via Supabase SQL Editor

-- Deletar todas as rodadas
DELETE FROM rodada_participantes;
DELETE FROM rodadas;

-- Deletar todos os assessments
DELETE FROM assessment_answers;
DELETE FROM assessments;

-- Resetar sequências (opcional)
-- As versões serão recriadas automaticamente
```

---

## 🧪 Testar Funcionalidades

### **Teste 1: Sistema está rodando**
```bash
curl https://your-project.supabase.co/functions/v1/make-server-2b631963/health
```
Esperado: `{"status":"ok"}`

### **Teste 2: Criar usuário**
```
1. Login como Leader
2. Cadastros → Usuários
3. [+ Adicionar Membro]
4. Preencher e Salvar
5. Verificar toast de sucesso
6. Ver usuário na lista
```

### **Teste 3: Criar rodada**
```
1. Login como Leader
2. Rodadas
3. [+ Nova Rodada]
4. Preencher:
   - Data: futuro
   - Participantes: email1@test.com
5. Criar Rodada
6. Verificar toast de sucesso
7. Ver rodada na lista
```

---

## 📊 Verificar Status do Sistema

### **Console do Navegador (F12)**

**Procurar por:**
```
✅ Sinais de sucesso:
- "Created in SQL" ou "Created in KV"
- "Rodada criada com sucesso!"
- "Usuário criado com sucesso!"

⚠️ Avisos (normais):
- "SQL not available, using KV"
- "Trying KV store"

❌ Erros (investigar):
- "Failed to fetch"
- "Unauthorized"
- "Error creating..."
```

### **Logs do Servidor**

**Via Supabase Dashboard:**
```
1. Functions → make-server-2b631963
2. Logs
3. Procurar por timestamps recentes
```

**Procurar por:**
```
✅ "Created in SQL"
✅ "Created in KV store"
⚠️ "SQL not available"
❌ "Error:"
```

---

## 🆘 Último Recurso

### **Se nada funcionar:**

1. **Verificar navegador:**
   - Testar em Chrome/Firefox
   - Limpar cache (Ctrl+Shift+Del)
   - Modo anônimo

2. **Verificar conexão:**
   - Internet funcionando?
   - Firewall bloqueando Supabase?

3. **Verificar Supabase:**
   - Projeto ativo?
   - Edge Function deployed?
   - Billing ok? (se aplicável)

4. **Logs completos:**
   ```javascript
   // No código, adicionar:
   console.log('User:', user);
   console.log('CompanyId:', user?.companyId);
   console.log('Request body:', body);
   ```

5. **Testar endpoints diretamente:**
   ```bash
   # Health
   curl https://PROJECT.supabase.co/functions/v1/make-server-2b631963/health
   
   # Users
   curl https://PROJECT.supabase.co/functions/v1/make-server-2b631963/users \
     -H "Authorization: Bearer ANON_KEY"
   ```

---

## ✅ Checklist Rápido

**Antes de reportar um erro, verificar:**

- [ ] Console do navegador está limpo?
- [ ] Toast de erro apareceu?
- [ ] Health check funciona?
- [ ] Usuário está logado?
- [ ] CompanyId está correto?
- [ ] Logs do servidor mostram o erro?
- [ ] Tentou reload (F5)?
- [ ] Tentou outro navegador?

---

## 💡 Dicas

### **Desenvolvimento**
```typescript
// Ativar logs detalhados
const DEBUG = true;

if (DEBUG) {
  console.log('Creating rodada:', data);
}
```

### **Produção**
```typescript
// Desativar logs sensíveis
const DEBUG = false;

// Usar apenas logs de erro
console.error('Critical error:', error);
```

---

## 📞 Informações Úteis

**Endpoints:**
- Health: `/health`
- Companies: `/companies`
- Users: `/users`
- Rodadas: `/rodadas`
- Assessments: `/assessments`

**Base URL:**
```
https://{projectId}.supabase.co/functions/v1/make-server-2b631963
```

**Headers Necessários:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
}
```

---

**Última atualização:** Outubro 2025  
**Sistema:** Dual Storage (SQL + KV Fallback)  
**Status:** ✅ Funcionando com ou sem SQL
