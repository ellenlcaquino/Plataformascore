# 📸 PASSO A PASSO VISUAL - APLICAR SCHEMA SQL

## 🎯 OBJETIVO

Criar a tabela `users` e todas as outras tabelas necessárias no banco de dados Supabase.

---

## 🚀 PASSO 1: Acessar o Supabase

### 1.1 Abra o navegador
- Vá para: **https://supabase.com/dashboard**

### 1.2 Faça login
- Use suas credenciais do Supabase

### 1.3 Selecione o projeto
- Clique no projeto do QualityMap App
- (Deve estar na lista de projetos)

---

## 📝 PASSO 2: Abrir o SQL Editor

### 2.1 Menu lateral
Você verá um menu lateral esquerdo com várias opções:
- Table Editor
- Authentication
- Storage
- **SQL Editor** ← CLIQUE AQUI
- Database
- Edge Functions

### 2.2 Criar nova query
No SQL Editor, você verá:
- Alguns exemplos de queries (pode ignorar)
- Um botão **"+ New query"** no topo → CLIQUE AQUI

---

## 📋 PASSO 3: Copiar o Schema SQL

### 3.1 Abrir o arquivo
Neste projeto, abra:
```
/database/schema.sql
```

### 3.2 Selecionar tudo
- Clique dentro do arquivo
- Pressione **Ctrl+A** (Windows/Linux) ou **Cmd+A** (Mac)
- O arquivo inteiro deve ficar selecionado (azul)

### 3.3 Copiar
- Pressione **Ctrl+C** (Windows/Linux) ou **Cmd+C** (Mac)

---

## ▶️ PASSO 4: Executar no Supabase

### 4.1 Colar o schema
No SQL Editor do Supabase:
- Clique na área de texto (editor de código)
- Delete qualquer código que estiver lá
- Pressione **Ctrl+V** (Windows/Linux) ou **Cmd+V** (Mac)
- O schema completo deve aparecer

### 4.2 Verificar o conteúdo
Você deve ver:
```sql
-- ============================================
-- QualityMap App - Database Schema
-- PostgreSQL / Supabase
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  ...
```

### 4.3 Executar
- Clique no botão **"RUN"** (canto superior direito)
- OU pressione **Ctrl+Enter** (Windows/Linux) ou **Cmd+Enter** (Mac)

### 4.4 Aguardar
- Você verá um indicador de carregamento
- **AGUARDE** de 30 a 60 segundos
- NÃO feche a aba!

---

## ✅ PASSO 5: Verificar Sucesso

### 5.1 Mensagem de sucesso
No rodapé do SQL Editor, você deve ver:
```
Success. No rows returned
```

E no final da execução:
```
QualityMap Database Schema criado com sucesso! ✅
```

### 5.2 Executar verificação
No SQL Editor, delete tudo e cole este comando:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'users';
```

Clique em RUN.

**RESULTADO ESPERADO**:
```
users
```

Se aparecer "users", está tudo certo! ✅

---

## 🧪 PASSO 6: Testar o Sistema

### 6.1 Recarregar aplicação
- Volte para a aba do QualityMap App
- Pressione **F5** para recarregar

### 6.2 Fazer logout/login
- Clique em logout
- Faça login novamente
- O sistema deve criar seu usuário automaticamente na tabela `users`

### 6.3 Verificar no banco
Volte ao SQL Editor e execute:

```sql
SELECT id, email, name, role 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

Você deve ver seu usuário na lista!

### 6.4 Testar avaliação
- Vá para "Formulário"
- Preencha uma avaliação completa
- Clique em "Concluir Avaliação"

**Não deve dar mais erro!** ✅

---

## ❌ SOLUÇÃO DE PROBLEMAS

### Erro: "relation users does not exist"
**Causa**: O schema não foi executado completamente

**Solução**:
1. Volte ao SQL Editor
2. Cole o schema.sql novamente
3. Clique em RUN
4. Aguarde até o final (não interrompa!)

### Erro: "permission denied"
**Causa**: Você não é admin do projeto

**Solução**:
- Certifique-se de estar logado com a conta correta
- Verifique se você é o dono do projeto no Supabase

### Não vejo o botão "RUN"
**Causa**: Interface diferente

**Solução**:
- Procure por um botão com ícone ▶️ (play)
- Ou use o atalho Ctrl+Enter / Cmd+Enter

### Schema não executa (trava)
**Causa**: Query muito grande ou conexão lenta

**Solução**:
1. Aguarde mais tempo (até 2 minutos)
2. Se travar, recarregue a página
3. Tente executar novamente

---

## 📞 VERIFICAÇÃO FINAL

Após aplicar o schema, execute este script de verificação:

```sql
-- Verificar todas as tabelas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Você DEVE ver pelo menos estas tabelas:
- ✅ assessment_answers
- ✅ assessments
- ✅ companies
- ✅ public_shares
- ✅ results
- ✅ rodada_participantes
- ✅ rodadas
- ✅ users

Se viu todas as 8 tabelas: **SUCESSO TOTAL!** 🎉

---

## ⏱️ TEMPO TOTAL

- Acessar Supabase: 30 segundos
- Copiar schema: 10 segundos
- Executar: 60 segundos
- Verificar: 30 segundos
- Testar: 2 minutos

**TOTAL**: ~4 minutos

---

## 🎓 DICA PRO

Salve a query de verificação como favorita no SQL Editor:

```sql
-- Verificação rápida do schema
SELECT 
  tablename,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'assessments', 'rodadas')
ORDER BY tablename;
```

Assim você pode verificar rapidamente se tudo está OK sempre que precisar!

---

**Criado em**: 28 de Outubro de 2025  
**Última atualização**: 28 de Outubro de 2025  
**Status**: ✅ Testado e Funcionando
