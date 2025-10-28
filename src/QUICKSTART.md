# 🚀 Quick Start - Começar em 5 Minutos

## ✨ Sistema Pronto para Usar!

O sistema **já funciona** sem configuração adicional. Use KV Store ou configure PostgreSQL depois.

---

## 📋 Passo a Passo

### **1. Fazer Login** (2 min)

```
1. Abrir aplicação
2. Usar credenciais padrão:

   Manager:
   📧 admin@qualitymap.app
   🔑 admin123

   Leader:
   📧 leader@demo.com
   🔑 leader123

   Member:
   📧 member@demo.com
   🔑 member123
```

---

### **2. Criar Primeira Rodada** (2 min)

```
1. Login como Leader
2. Menu lateral: Rodadas
3. Clicar: [+ Nova Rodada]
4. Preencher:
   ├─ Data Limite: 31/12/2024
   ├─ Critério: Automático
   └─ Participantes:
      teste1@empresa.com
      teste2@empresa.com
5. Clicar: [Criar Rodada]
6. ✅ Toast: "Rodada criada com sucesso!"
```

**Resultado:**
- Rodada aparece na lista
- Usuários criados automaticamente
- Versão: V2024.10.001 (ou similar)

---

### **3. Adicionar Membro** (1 min)

```
1. Menu lateral: Cadastros
2. Tab: Usuários
3. Clicar: [+ Adicionar Membro]
4. Preencher:
   ├─ Nome: João Silva
   ├─ Email: joao@empresa.com
   └─ Role: Member
5. Clicar: [Salvar]
6. ✅ Toast: "Usuário criado com sucesso!"
```

**Resultado:**
- Usuário aparece na lista
- Pode ser adicionado em futuras rodadas

---

## 🎯 Próximos Passos

### **Explorar Funcionalidades**

**1. QualityScore (Avaliação de 91 perguntas)**
```
Menu: QualityScore → Formulário
→ Iniciar Avaliação
→ Responder perguntas por pilar
→ Ver resultados
```

**2. Ver Resultados**
```
Menu: QualityScore → Resultados
→ Selecionar rodada
→ Ver:
  - Radar comparativo
  - Linha por pilar
  - Análise de alinhamento
```

**3. Importar Excel**
```
Menu: QualityScore → Importar
→ Download template
→ Preencher Excel
→ Upload arquivo
→ Sistema processa
```

---

## 🏢 Multi-Tenant

### **Criar Nova Empresa (Manager only)**

```
1. Login como Manager
2. Menu: Cadastros → Tab Empresas
3. [+ Nova Empresa]
4. Preencher:
   ├─ Nome: TechCorp Brasil
   ├─ Domínio: techcorp.com.br
   └─ Cor: #2563eb
5. Salvar
```

### **Criar Leader para Empresa**

```
1. Menu: Cadastros → Tab Usuários
2. [+ Novo Usuário]
3. Preencher:
   ├─ Nome: Ana Silva
   ├─ Email: ana@techcorp.com.br
   ├─ Role: Leader
   └─ Empresa: TechCorp Brasil
4. Salvar
```

---

## 📊 Dados de Demonstração

O sistema vem com dados mockados:

**Empresas:**
- TechCorp Brasil
- InnovateTech Solutions
- Digital Labs Inc

**QualityScores:**
- TechCorp - 15/01/2024 (8 usuários)
- InnovateTech - 29/02/2024 (5 usuários)
- Digital Labs - 10/03/2024 (3 usuários)

---

## 🔐 Permissões por Role

### **Manager**
```
✅ Ver todas as empresas
✅ Criar empresas
✅ Criar Leaders e Members
✅ Ver todas as rodadas
✅ Ver todos os resultados
```

### **Leader**
```
✅ Ver sua empresa
✅ Criar Members de sua empresa
✅ Criar rodadas
✅ Ver rodadas de sua empresa
✅ Ver resultados de sua empresa
✅ Gerenciar participantes
```

### **Member**
```
✅ Ver sua empresa (read-only)
✅ Responder avaliações
✅ Ver resultados (se permitido pelo Leader)
❌ Não pode criar rodadas
❌ Não pode adicionar usuários
```

---

## 🎨 Whitelabel

### **Trocar Empresa Ativa**

```
1. Header superior → Company Selector
2. Selecionar empresa
3. Interface muda cores automaticamente
4. Logo e nome atualizam
```

---

## 📱 Estrutura do Menu

```
Dashboard
├─ Visão geral
├─ Métricas
└─ Atalhos rápidos

QualityScore
├─ Formulário (91 perguntas)
├─ Rodadas (gerenciar rodadas)
├─ Resultados (análises)
└─ Importar (Excel)

Cadastros
├─ Usuários (Members/Leaders)
└─ Empresas (Manager only)

Demos Públicas
└─ Exemplos compartilháveis
```

---

## 💾 Armazenamento

### **Modo Atual: Dual Storage**

**KV Store (Default):**
```
✅ Funciona imediatamente
✅ Sem configuração necessária
✅ Dados persistem
⚠️ Sem queries complexas
```

**PostgreSQL (Opcional):**
```
✅ Queries relacionais
✅ Performance otimizada
✅ Backups automáticos
📝 Requer setup (ver README_DATABASE_SETUP.md)
```

**Sistema usa SQL se disponível, senão usa KV.**

---

## 🧪 Testar Tudo Funciona

### **Checklist Rápido**

```bash
# 1. Health Check
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-2b631963/health

# Esperado: {"status":"ok"}
```

```
2. Login ✅
3. Criar Rodada ✅
4. Adicionar Usuário ✅
5. Ver Resultados ✅
6. Importar Excel ✅
```

---

## ❓ FAQ Rápido

### **Preciso configurar o banco de dados?**
Não! Sistema funciona com KV Store imediatamente.

### **Como habilitar PostgreSQL?**
Ver: `/README_DATABASE_SETUP.md`

### **Dados são persistentes?**
Sim! KV Store e PostgreSQL são persistentes.

### **Posso usar em produção?**
Sim! Recomendado configurar PostgreSQL para melhor performance.

### **Como adicionar mais usuários?**
Cadastros → Usuários → [+ Adicionar Membro]

### **Como criar outra rodada?**
Rodadas → [+ Nova Rodada]

### **Erro ao criar rodada?**
Ver: `/TROUBLESHOOTING.md`

---

## 📚 Documentação Completa

```
/README.md                          - Visão geral
/README_DATABASE_SETUP.md           - Setup do banco
/README_INTEGRACAO_BANCO.md         - Como funciona a API
/TROUBLESHOOTING.md                 - Resolver problemas
/README_RODADAS.md                  - Sistema de rodadas
/README_RESULTADOS_FILTRO_LEADER.md - Filtros por empresa
/README_CADASTROS_CORRECAO.md       - Gestão de usuários
```

---

## 🎯 Objetivos do Sistema

**QualityMap App** é uma plataforma para:

1. **Avaliar Maturidade em QA**
   - 91 perguntas organizadas em 7 pilares
   - Escala 0-5 de maturidade

2. **Gerenciar Rodadas**
   - Criar ciclos de avaliação
   - Acompanhar progresso da equipe
   - Encerramento automático ou manual

3. **Analisar Resultados**
   - Radar comparativo
   - Mapas de alinhamento
   - Análise por pilar

4. **Multi-Tenant**
   - Várias empresas
   - Isolamento de dados
   - Whitelabel

---

## ✅ Você está pronto!

**Sistema funcionando:** ✅  
**Dados de demo:** ✅  
**Pode criar rodadas:** ✅  
**Pode adicionar usuários:** ✅  
**Pode ver resultados:** ✅

**Próximo passo:**
Explore o sistema e crie sua primeira avaliação real! 🚀

---

## 🆘 Precisa de Ajuda?

**Problema ao usar?**
→ Ver: `/TROUBLESHOOTING.md`

**Dúvida sobre funcionalidade?**
→ Ver: documentação específica em `/README_*.md`

**Erro técnico?**
→ Verificar console do navegador (F12)

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0 - Sistema Completo  
**Status:** ✅ Pronto para Uso
