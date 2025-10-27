# Sistema de Demonstração Pública - Qora Platform

## 📖 Visão Geral

O sistema de demonstração pública permite visualizar e compartilhar resultados de QualityScore e Calculadoras através de páginas públicas otimizadas para apresentações executivas.

## 🎯 Localização

Acesse através do menu lateral:
- **Menu Principal** → **Demo Público**

## ✨ Funcionalidades

### 1. **Visualização Interna (Preview)**

Visualize as demos diretamente dentro do sistema sem abrir nova aba:

- **Botão "Ver Demo"**: Abre a demo em modo preview interno
- **Controles de Dispositivo**: Teste a responsividade (Desktop, Tablet, Mobile)
- **Botão "Voltar ao Admin"**: Retorna à tela de gestão
- **Badge de Identificação**: Mostra qual tipo de demo está sendo visualizado

### 2. **Duas Categorias de Demos**

#### 📊 **QualityScore**
Demonstrações de avaliações de maturidade em qualidade:

**Demos Disponíveis:**
- **IrriControl** - Score 3.2 (Consciência)
- **TechCorp** - Score 2.8 (Consciência)  
- **InnovaTech** - Score 4.1 (Experiência)

**URL Pattern:**
```
/score/[shareId]
?demo=score/[shareId]
```

#### 🧮 **Calculadoras**
Demonstrações de análises financeiras e ROI:

**Demos Disponíveis:**
- **TechCorp Solutions** - Análise Completa (Bugs, ROI, Valor)
- **InnovaSoft** - Demonstração Executiva
- **DigitalPro** - Relatório Enterprise

**URL Pattern:**
```
/calculadoras/[shareId]
?demo=calculadoras/[shareId]
```

### 3. **Métodos de Acesso**

#### **A. Preview Interno** ⭐ (Recomendado)
1. Acesse **Menu Principal → Demo Público**
2. Escolha a aba (QualityScore ou Calculadoras)
3. Clique em **"Ver Demo"** no card desejado
4. Navegue usando os controles de preview

**Vantagens:**
- ✅ Não sai da aplicação
- ✅ Controles de responsividade integrados
- ✅ Recarregamento rápido
- ✅ Ideal para testes

#### **B. Nova Aba**
1. Clique no ícone **🔗** (ExternalLink) no card
2. A demo abre em nova aba do navegador

**Vantagens:**
- ✅ Navegação independente
- ✅ Múltiplas demos abertas
- ✅ Compartilhamento direto

#### **C. Copiar Link**
1. Clique no ícone **📤** (Share2) no card
2. Link copiado automaticamente para área de transferência

**Vantagens:**
- ✅ Compartilhamento rápido
- ✅ Uso em apresentações
- ✅ Envio por email/chat

#### **D. URL Direta**
Digite diretamente no navegador:
```
https://seu-dominio.com/score/irricontrol-r1
https://seu-dominio.com/calculadoras/demo-results
```

**Vantagens:**
- ✅ Acesso direto sem login
- ✅ Bookmarks
- ✅ SEO friendly

#### **E. Parâmetro Demo**
Adicione parâmetro à URL atual:
```
?demo=score/irricontrol-r1
?demo=calculadoras/demo-results
```

**Vantagens:**
- ✅ Funciona em qualquer página
- ✅ Útil para desenvolvimento
- ✅ Debugging facilitado

## 🎨 Controles de Preview

Quando em modo preview interno, você tem acesso a:

### **Barra de Controle Superior**
```
┌─────────────────────────────────────────────────────────┐
│ ← Voltar ao Admin  👁 Preview: [Empresa] [Badge]       │
│                                                          │
│        [💻] [📱] [🖥️]  [🔗 Nova Aba]  [🔄 Recarregar] │
└─────────────────────────────────────────────────────────┘
```

### **Botões de Dispositivo**
- **💻 Desktop**: Visualização completa (padrão)
- **📱 Tablet**: Largura intermediária (max-width: 768px)
- **🖥️ Mobile**: Largura mobile (max-width: 375px)

### **Ações Adicionais**
- **🔗 Abrir em Nova Aba**: Abre a demo em janela separada
- **🔄 Recarregar**: Força refresh do componente de demo

## 📋 Cards de Demonstração

Cada card de demo contém:

### **QualityScore Cards**
```
┌──────────────────────────────────────┐
│ [Empresa]              [Nível Badge] │
│ Título da Avaliação                  │
├──────────────────────────────────────┤
│     [3.2]    URL Pública:            │
│    Score     /score/share-id         │
├──────────────────────────────────────┤
│ [▶ Ver Demo] [🔗] [📤]              │
└──────────────────────────────────────┘
```

### **Calculadoras Cards**
```
┌──────────────────────────────────────┐
│ [Empresa]         [Calculadoras]     │
│ Título da Demo                       │
├──────────────────────────────────────┤
│ Conteúdo:                            │
│ • Custo de Bugs                      │
│ • ROI de QA                          │
│ • Valor de Negócio                   │
│                                      │
│ URL Pública:                         │
│ /calculadoras/share-id               │
├──────────────────────────────────────┤
│ [▶ Ver Demo] [🔗] [📤]              │
└──────────────────────────────────────┘
```

## 🔍 Informações de Debug

Na parte inferior da página, há um card de debug com:

- **URL Atual**: URL completa do navegador
- **Pathname**: Caminho atual da rota
- **Dicas de Troubleshooting**: Sugestões se houver problemas

## 💡 Casos de Uso

### **1. Apresentação para Cliente**
```
1. Acesse a demo desejada
2. Use controle de dispositivo para simular telas
3. Compartilhe o link público ao final
```

### **2. Teste de Responsividade**
```
1. Abra preview interno
2. Alterne entre Desktop/Tablet/Mobile
3. Verifique layouts e comportamentos
```

### **3. Compartilhamento de Resultados**
```
1. Copie o link usando botão Share
2. Cole em email/apresentação
3. Destinatários acessam sem login
```

### **4. Desenvolvimento e QA**
```
1. Use parâmetro ?demo= para testes rápidos
2. Verifique console para logs de debug
3. Recarregue com botão refresh quando necessário
```

## 🎭 Diferenças: Preview vs Página Pública

| Aspecto | Preview Interno | Página Pública |
|---------|----------------|----------------|
| Login necessário | ✅ Sim | ❌ Não |
| Barra de controle | ✅ Sim | ❌ Não |
| Controles de device | ✅ Sim | ❌ Não |
| URL visível | Sistema | Pública |
| Compartilhável | ❌ Não | ✅ Sim |
| SEO | ❌ Não | ✅ Sim |

## 🚀 Fluxo de Trabalho Recomendado

### **Para Testes Internos:**
```
Menu → Demo Público → Escolher aba → Ver Demo → Testar responsividade
```

### **Para Compartilhamento Externo:**
```
Menu → Demo Público → Escolher demo → Copiar link (📤) → Compartilhar
```

### **Para Apresentações:**
```
Menu → Demo Público → Abrir em Nova Aba (🔗) → Apresentar em fullscreen
```

## 🔧 Troubleshooting

### **Problema: Link não funciona**
**Solução:** Use o parâmetro `?demo=` ao invés de rota direta

### **Problema: Demo não carrega**
**Solução:** Clique em "🔄 Recarregar" ou feche e abra novamente

### **Problema: Layout quebrado em mobile**
**Solução:** Teste com controle de dispositivo antes de compartilhar

### **Problema: Link copiado não abre**
**Solução:** Verifique se o domínio está correto no link copiado

## 📊 Estatísticas

O sistema rastreia automaticamente:
- ✅ Visualizações de cada demo
- ✅ Dispositivo usado (via preview controls)
- ✅ Origem do acesso (interno vs externo)
- ✅ Tempo de visualização

*Nota: Implementação futura - atualmente apenas logs no console*

## 🎨 Personalização

### **Adicionar Nova Demo de QualityScore:**
```typescript
// Em PublicDemo.tsx
const scoreLinks = [
  // ... demos existentes
  {
    id: 'nova-empresa-r1',
    company: 'Nova Empresa',
    title: 'Título da Avaliação',
    url: '/score/nova-empresa-r1',
    score: 3.5,
    level: 'Experiência',
    type: 'score' as const
  }
];
```

### **Adicionar Nova Demo de Calculadoras:**
```typescript
// Em PublicDemo.tsx
const calculadorasLinks = [
  // ... demos existentes
  {
    id: 'nova-demo',
    company: 'Nova Empresa',
    title: 'Título da Demo',
    url: '/calculadoras/nova-demo',
    description: 'Descrição do conteúdo',
    type: 'calculadoras' as const
  }
];
```

## 🔐 Segurança

- ✅ Páginas públicas não expõem dados sensíveis
- ✅ ShareIDs são únicos e não-sequenciais
- ✅ Sem informações de usuários ou configurações
- ✅ Apenas dados de visualização (não edição)
- ✅ Rate limiting recomendado em produção

## 📝 Notas Importantes

1. **Dados Mockados**: Todas as demos usam dados de exemplo
2. **Não Editável**: Páginas públicas são read-only
3. **Atualização**: Alterar dados mockados requer rebuild
4. **Performance**: Componentes otimizados para carregamento rápido
5. **Analytics**: Integrar Google Analytics para rastreamento real

---

**Versão:** 1.0  
**Última Atualização:** 10 de Outubro de 2025  
**Plataforma:** Qora Platform
