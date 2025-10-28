# 📦 Instalação de Dependências - Integração com Banco de Dados

## ✅ Dependências Necessárias

### Cliente Supabase

A principal dependência para integração com banco de dados:

```bash
npm install @supabase/supabase-js
```

**Versão recomendada:** Latest (2.x)  
**O que fornece:**
- Cliente JavaScript para Supabase
- APIs para Database, Auth, Storage
- Tipagem TypeScript
- Realtime subscriptions

---

## 📝 Verificar Instalação

Após instalar, verifique se está no `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

---

## 🔧 Configuração no Código

### 1. Cliente Supabase já configurado

O arquivo `/utils/supabase/client.ts` já está criado e configurado:

```typescript
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
```

✅ **Não precisa modificar nada!**  
✅ As credenciais vêm automaticamente de `/utils/supabase/info.tsx`

---

## 🚀 Uso nos Componentes

### Importação Direta

```typescript
import { supabase } from '../utils/supabase/client';

// Usar em qualquer componente
const { data, error } = await supabase
  .from('companies')
  .select('*');
```

### Via Serviços (Recomendado)

```typescript
import { assessmentService } from '../services/AssessmentService';
import { rodadaService } from '../services/RodadaService';
import { resultsService } from '../services/ResultsService';

// Usar métodos dos serviços
const assessment = await assessmentService.createAssessment(data);
const rodada = await rodadaService.getRodadaById(id);
const result = await resultsService.generateResult(rodadaId, userId);
```

### Via Hooks (Mais Recomendado)

```typescript
import { useAssessment } from '../hooks/useAssessment';
import { useRodadas } from '../hooks/useRodadas';
import { useResults } from '../hooks/useResults';

function MyComponent() {
  const { saveAnswer } = useAssessment(userId);
  const { rodadas } = useRodadas(companyId);
  const { result } = useResults(rodadaId);
}
```

---

## 🔍 Verificar Funcionamento

### Teste 1: Cliente Supabase

Crie um componente de teste:

```typescript
import { useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export function TestSupabase() {
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('count');

      if (error) {
        console.error('❌ Erro:', error);
      } else {
        console.log('✅ Conexão OK:', data);
      }
    } catch (err) {
      console.error('❌ Erro de conexão:', err);
    }
  };

  return <div>Verifique o console</div>;
}
```

### Teste 2: Hook de Assessment

```typescript
import { useAssessment } from '../hooks/useAssessment';
import { useAuth } from '../components/AuthContext';

export function TestAssessment() {
  const { user } = useAuth();
  const { currentAssessment, loading } = useAssessment(user?.id || '');

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {currentAssessment ? (
        <p>✅ Assessment encontrado: {currentAssessment.id}</p>
      ) : (
        <p>ℹ️ Nenhum assessment em andamento</p>
      )}
    </div>
  );
}
```

---

## 📚 Dependências Opcionais

### React Query (Recomendado para Cache)

```bash
npm install @tanstack/react-query
```

**Uso:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { rodadaService } from '../services/RodadaService';

function useRodadasWithCache(companyId: string) {
  return useQuery({
    queryKey: ['rodadas', companyId],
    queryFn: () => rodadaService.getRodadasByCompany(companyId)
  });
}
```

### Zod (Validação de Schemas)

```bash
npm install zod
```

**Uso:**
```typescript
import { z } from 'zod';

const AssessmentSchema = z.object({
  user_id: z.string().uuid(),
  company_id: z.string().uuid(),
  versao_id: z.string(),
  overall_score: z.number().min(0).max(5)
});

// Validar dados antes de inserir
AssessmentSchema.parse(data);
```

---

## 🔧 Scripts NPM Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "db:types": "supabase gen types typescript --local > types/supabase.ts",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase db push"
  }
}
```

**Nota:** Requer Supabase CLI instalado:
```bash
npm install -g supabase
```

---

## ⚠️ Troubleshooting

### Erro: "Module not found: @supabase/supabase-js"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm install @supabase/supabase-js
```

### Erro: "Invalid API key"

**Verificar:**
```typescript
// Em /utils/supabase/info.tsx
export const projectId = 'seu-project-id';
export const publicAnonKey = 'sua-anon-key';
```

Certifique-se de que esses valores estão corretos no dashboard do Supabase.

### Erro: "Cannot find module './info'"

**Verificar:**
- Arquivo `/utils/supabase/info.tsx` existe?
- Está exportando `projectId` e `publicAnonKey`?

---

## 📋 Checklist de Instalação

- [ ] ✅ `@supabase/supabase-js` instalado
- [ ] ✅ `/utils/supabase/client.ts` existe
- [ ] ✅ `/utils/supabase/info.tsx` com credenciais
- [ ] ✅ Serviços criados (`/services/`)
- [ ] ✅ Hooks criados (`/hooks/`)
- [ ] ✅ Schema SQL executado no Supabase
- [ ] ✅ Teste de conexão passou
- [ ] ✅ Consegue buscar dados de uma tabela

---

## 🎯 Próximos Passos

Após instalar as dependências:

1. **Execute o schema SQL**
   - Copie conteúdo de `/database/schema.sql`
   - Cole no SQL Editor do Supabase
   - Execute

2. **Teste a conexão**
   - Use componente `TestSupabase` acima
   - Verifique console do navegador

3. **Integre nos componentes**
   - Use hooks `useAssessment`, `useRodadas`, `useResults`
   - Substitua mock data por dados reais

4. **Configure autenticação**
   - Implemente Supabase Auth
   - Atualize AuthContext

---

## 📖 Recursos

- **Docs Supabase JS**: https://supabase.com/docs/reference/javascript
- **Instalação Supabase**: https://supabase.com/docs/guides/getting-started
- **TypeScript + Supabase**: https://supabase.com/docs/guides/api#generating-types

---

## ✨ Resumo

**Dependência principal:** `@supabase/supabase-js`  
**Instalação:** `npm install @supabase/supabase-js`  
**Configuração:** Automática via `/utils/supabase/client.ts`  
**Uso:** Via serviços e hooks criados

**Status:** ✅ Pronto para usar!

---

**Versão:** 1.0  
**Última atualização:** Outubro 2025
