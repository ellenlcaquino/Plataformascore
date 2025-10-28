# Teste de Integração de Usuários

## Data: 28 de Outubro de 2025

## O que foi implementado

Integração completa entre AuthContext (frontend) e KV Store (backend) para resolver o problema de incompatibilidade de IDs.

### Problema Original
- **Frontend**: Usuários mock com IDs '1', '2', '3'
- **Backend**: Participantes com UUIDs reais (ex: 'b3c83159-e2f8-43b7-97b4-22b4469ff35e')
- **Resultado**: "Participante não encontrado" ao finalizar formulário

### Solução Implementada
- AuthContext agora busca e cria usuários reais no servidor
- Seed automático de usuários demo com UUIDs reais
- Sincronização inteligente entre mock e servidor
- Fallback graceful se servidor não estiver disponível

## Como Testar

### Teste 1: Seed Automático de Usuários Demo

1. Abra o console do navegador
2. Recarregue a aplicação
3. Verifique os logs:
   ```
   ✅ Seed check completo: Demo users seeded successfully
   ```
   ou
   ```
   ✅ Seed check completo: Demo users already exist
   ```

### Teste 2: Login com Usuário Real

1. Faça logout se estiver logado
2. Faça login com:
   - Email: `leader@demo.com`
   - Senha: `demo123`

3. Verifique no console:
   ```
   ✅ Login com usuário real do servidor: [UUID real, não '2']
   ```

4. Verifique no localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('qualitymap_user'))
   // Deve mostrar um UUID real no campo 'id'
   // Ex: { id: "a1b2c3d4-...", email: "leader@demo.com", ... }
   ```

### Teste 3: Finalizar Formulário (Problema Original)

1. Faça login como `leader@demo.com`
2. Vá para "Rodadas"
3. Crie uma nova rodada e adicione participantes
4. Preencha o formulário completo
5. Clique em "Finalizar Avaliação"

**Resultado Esperado**:
- ✅ Tela "Bom, agora é com a gente!" aparece imediatamente
- ✅ Status do participante é atualizado no banco (sem erros)
- ✅ Nenhum warning de "Participante não encontrado"

**Console deve mostrar**:
```
✅ Login com usuário real do servidor: [UUID]
🎯 FINALIZANDO AVALIAÇÃO - rodadaId: [...] userId: [UUID real]
✅ Status do participante atualizado para concluído
```

### Teste 4: Registro de Novo Usuário

1. Faça logout
2. Clique em "Criar conta"
3. Preencha:
   - Nome: "Teste Usuário"
   - Email: "teste@example.com"
   - Empresa: "Empresa Teste"
   - Senha: "teste123"

4. Verifique no console:
   ```
   🏢 Criando nova empresa no servidor: Empresa Teste
   ✅ Empresa criada no servidor: [UUID]
   👤 Criando usuário no servidor...
   ✅ Usuário criado no servidor: [UUID]
   ✅ Registro bem-sucedido
   ```

5. Faça login novamente e verifique que o UUID é mantido

### Teste 5: Sincronização de Usuário Mock

1. No console do navegador, crie um usuário mock manualmente:
   ```javascript
   localStorage.setItem('qualitymap_user', JSON.stringify({
     id: '2',
     email: 'leader@demo.com',
     name: 'Líder Mock',
     role: 'leader'
   }));
   ```

2. Recarregue a página

3. Verifique no console:
   ```
   🔄 Usuário mock detectado, tentando buscar equivalente real...
   ✅ Usuário real encontrado no servidor: [UUID real]
   ```

4. Verifique que o localStorage foi atualizado com o UUID real

## Endpoints do Servidor

### GET /make-server-2b631963/users
Retorna todos os usuários do KV Store

### POST /make-server-2b631963/users
Cria um novo usuário com UUID real

### POST /make-server-2b631963/seed-demo-users
Cria usuários demo se não existirem (chamado automaticamente ao iniciar)

## Estrutura de Dados

### Usuário Real (KV Store)
```json
{
  "id": "a1b2c3d4-e5f6-...",
  "email": "leader@demo.com",
  "name": "Líder da Empresa",
  "role": "leader",
  "companyId": "company-uuid-...",
  "companyName": "Demo Company",
  "hasLoggedIn": false,
  "createdAt": "2025-10-28T...",
  "addedViaRodada": false
}
```

### Participante (Postgres)
```json
{
  "id": "participante-uuid",
  "rodada_id": "rodada-uuid",
  "user_id": "a1b2c3d4-e5f6-...",  // ← Agora corresponde ao ID real do usuário!
  "status": "concluido",
  "progress": 100
}
```

## Verificação de Sucesso

✅ **Tudo está funcionando se**:
1. Console mostra "Login com usuário real do servidor"
2. localStorage tem UUID real (não '1', '2', '3')
3. Formulário finaliza sem warnings
4. Status do participante é atualizado corretamente
5. Nenhum erro "Participante não encontrado"

❌ **Ainda há problema se**:
1. Console mostra "Login com usuário mock"
2. localStorage tem id: '2' ou similar
3. Warnings sobre participante não encontrado
4. Status não é atualizado no banco

## Troubleshooting

### "Demo users already exist" mas login não funciona
- Verifique se o servidor está rodando
- Tente fazer seed manual: `POST /make-server-2b631963/seed-demo-users`

### "Erro ao sincronizar usuário"
- O servidor pode estar offline
- Verifique a URL do Supabase em `/utils/supabase/info.tsx`
- Sistema continuará funcionando com dados mock

### UUID não é salvo no localStorage
- Verifique se o email está correto: `leader@demo.com` (não `leader@qualitymap.app`)
- Limpe o localStorage e tente novamente

## Logs Importantes

### Seed Inicial
```
🌱 Iniciando seed de usuários demo...
✅ Empresa demo criada: [UUID]
✅ Usuário líder criado: [UUID]
✅ Usuário membro criado: [UUID]
```

### Login Bem-Sucedido
```
✅ Login com usuário real do servidor: [UUID]
```

### Finalização de Formulário
```
🎯 FINALIZANDO AVALIAÇÃO - rodadaId: [...] userId: [UUID real]
🔵 Participante encontrado! ID: [...] Status atual: pendente
✅ Status do participante atualizado para concluído
```

## Próximos Passos

1. ✅ Migrar totalmente de mock para servidor (COMPLETO)
2. ✅ Garantir que todos os fluxos usem UUIDs reais (COMPLETO)
3. ⏳ Implementar autenticação real com Supabase Auth (opcional)
4. ⏳ Adicionar validação de senha no servidor (opcional)
5. ⏳ Implementar refresh de sessão (opcional)
