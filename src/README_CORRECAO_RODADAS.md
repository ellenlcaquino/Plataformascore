# Correção da Criação de Rodadas

## 🐛 Problema Relatado

O usuário não consegue criar rodadas. O warning sobre refs no Dialog é apenas um aviso do React/Radix UI e não afeta a funcionalidade.

## 🔍 Problemas Identificados

### 1. Componente Não Usa o Hook de Banco de Dados

O componente `Rodadas.tsx` estava usando apenas dados mockados (`mockRodadas`) e não se conectava ao banco de dados real através do hook `useRodadasDB`.

**Antes:**
```typescript
function RodadasContent() {
  const [rodadas] = useState<Rodada[]>(mockRodadas); // ❌ Apenas mock data
  // ...
}
```

**Depois:**
```typescript
function RodadasContent() {
  const { rodadas: rodadasDB, loading: loadingRodadas, fetchRodadas } = useRodadasDB(); // ✅ Hook do banco
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  
  // Sincronizar rodadas do banco com o estado local
  useEffect(() => {
    if (rodadasDB.length > 0) {
      // Transformar formato do banco para formato do componente
      const transformedRodadas = rodadasDB.map(r => ({...}));
      setRodadas(transformedRodadas);
    } else if (!loadingRodadas) {
      // Fallback para mock data apenas para visualização
      setRodadas(mockRodadas);
    }
  }, [rodadasDB, loadingRodadas]);
}
```

### 2. Reload da Página ao Criar Rodada

Quando uma rodada era criada com sucesso, o sistema fazia `window.location.reload()`, o que é uma prática ruim e pode causar perda de estado.

**Antes:**
```typescript
onSuccess={() => {
  // Recarregar lista de rodadas
  window.location.reload(); // ❌ Reload completo da página
}}
```

**Depois:**
```typescript
onSuccess={async () => {
  // Recarregar lista de rodadas do banco
  await fetchRodadas(); // ✅ Recarrega apenas os dados
}}
```

### 3. Falta de Indicador de Loading

Não havia feedback visual enquanto as rodadas estavam sendo carregadas do banco.

**Adicionado:**
```typescript
{loadingRodadas ? (
  <Card className="p-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Carregando rodadas...</p>
    </div>
  </Card>
) : (
  // ... conteúdo normal
)}
```

## ✅ Correções Implementadas

### 1. Imports Atualizados

```typescript
import React, { useState, useMemo, useEffect } from 'react'; // ✅ Adicionado useEffect
import { useRodadasDB } from '../hooks/useRodadasDB'; // ✅ Adicionado hook do banco
```

### 2. Integração com Banco de Dados

O componente agora:
1. ✅ Busca rodadas do banco via `useRodadasDB()`
2. ✅ Transforma o formato do banco para o formato do componente
3. ✅ Usa mock data apenas como fallback para visualização
4. ✅ Recarrega os dados após criar nova rodada

### 3. Estado de Loading

- ✅ Mostra spinner enquanto carrega
- ✅ Mostra mensagem "Carregando rodadas..."
- ✅ Esconde o conteúdo até terminar o carregamento

## 🧪 Como Testar

### 1. Verificar Conexão com o Banco

1. Abra o console do navegador (F12)
2. Navegue até a seção "Rodadas"
3. Verifique se aparecem logs do tipo:
   ```
   📥 GET /rodadas - Starting request
   ✅ GET /rodadas - SQL query successful, returning X rodadas
   ```

### 2. Criar Nova Rodada

1. Clique em "Nova Rodada"
2. Preencha os campos:
   - **Empresa:** Selecione uma empresa (Manager) ou veja sua empresa (Leader)
   - **Data Limite:** Escolha uma data futura
   - **Critério:** Automático ou Manual
   - **Participantes:** Digite emails separados por linha, ex:
     ```
     joao@exemplo.com
     maria@exemplo.com
     pedro@exemplo.com
     ```
3. Clique em "Criar Rodada"
4. Verifique o console para logs como:
   ```
   📝 Iniciando criação de rodada - formData: {...}
   📝 User ID: xxx
   📝 Emails dos participantes: [...]
   📝 Request body: {...}
   📝 Response status: 200
   ✅ Rodada criada com sucesso: {...}
   ```

### 3. Verificar se a Rodada Aparece

Após criar:
1. A lista deve atualizar automaticamente (sem reload da página)
2. A nova rodada deve aparecer na aba "Rodadas Ativas"
3. Os participantes devem ser listados com status "Pendente"

## 🐛 Troubleshooting

### Problema: "Erro ao criar rodada"

**Verifique:**
1. Se o servidor está rodando (verificar endpoint `/health`)
2. Os logs do console para ver o erro exato
3. Se os campos obrigatórios estão preenchidos:
   - companyId
   - dueDate
   - created_by (user.id)
   - participantes (pelo menos 1 email)

### Problema: Rodada não aparece na lista

**Possíveis causas:**
1. Filtro de empresa ativa (whitelabel)
2. Erro no fetch das rodadas
3. Erro na transformação de dados

**Solução:**
1. Verifique o console para erros
2. Verifique se `fetchRodadas()` foi chamado após criar
3. Verifique se a empresa da rodada corresponde ao filtro ativo

### Problema: Loading infinito

**Possíveis causas:**
1. Erro no endpoint `/rodadas`
2. Erro no hook `useRodadasDB`

**Solução:**
1. Verifique o console do navegador
2. Verifique os logs do servidor Supabase
3. Teste o endpoint diretamente:
   ```
   GET https://cxstvivhfogzgidyuyfr.supabase.co/functions/v1/make-server-2b631963/rodadas
   ```

## 📋 Checklist de Arquivos Modificados

- ✅ `/components/Rodadas.tsx`
  - Adicionado import `useEffect`
  - Adicionado import `useRodadasDB`
  - Integração com banco de dados
  - Estado de loading
  - Transformação de dados
  - Atualização sem reload

## 🎯 Próximos Passos

Após esta correção, o sistema deve:

1. ✅ Listar rodadas do banco de dados
2. ✅ Criar novas rodadas com sucesso
3. ✅ Criar usuários automaticamente para emails novos
4. ✅ Atualizar a lista sem reload
5. ✅ Mostrar loading durante operações

## 📝 Logs Importantes

### Durante Criação de Rodada

```
📝 Iniciando criação de rodada - formData: {
  companyId: "company-001",
  companyName: "TechCorp Brasil",
  dueDate: "2024-02-14",
  criterioEncerramento: "automatico",
  participantes: "user1@email.com\nuser2@email.com"
}
📝 User ID: "user-xxx"
📝 Emails dos participantes: ["user1@email.com", "user2@email.com"]
📝 Request body: {
  company_id: "company-001",
  due_date: "2024-02-14",
  criterio_encerramento: "automatico",
  created_by: "user-xxx",
  participantes: [{email: "user1@email.com"}, {email: "user2@email.com"}]
}
📝 Response status: 200
✅ Rodada criada com sucesso: { rodada: {...} }
```

### Durante Carregamento

```
📥 GET /rodadas - Starting request
📥 GET /rodadas - companyId: company-001
📥 GET /rodadas - Trying SQL query...
✅ GET /rodadas - SQL query successful, returning 3 rodadas
```

---

**Data da Correção:** 27/10/2025  
**Responsável:** Sistema de IA - Figma Make  
**Versão do Sistema:** QualityMap App v2.0  
**Status:** ✅ Correções implementadas - Aguardando teste do usuário
