# 🔌 Exemplo de Integração Completa no App.tsx

## 📋 Como Integrar o Banco de Dados no App Principal

Este guia mostra exatamente onde e como modificar o `App.tsx` para usar o banco de dados ao invés de mock data.

---

## 🔧 Modificações Necessárias

### 1. Importar Hooks no App.tsx

Adicione estas importações no topo do arquivo:

```typescript
// App.tsx - Adicionar no início
import { useAssessment } from './hooks/useAssessment';
import { useRodadas } from './hooks/useRodadas';
import { useResults } from './hooks/useResults';
```

---

### 2. Substituir Seção do Formulário

**Antes (Mock):**
```typescript
case 'qualityscore-formulario':
  if (formularioView === 'intro') {
    return <FormularioIntro onStart={handleStartFormulario} />;
  }
  if (formularioView === 'assessment') {
    return (
      <QualityScoreAssessment 
        onComplete={handleAssessmentComplete}
        onBack={() => setFormularioView('intro')}
      />
    );
  }
```

**Depois (Com Banco):**
```typescript
case 'qualityscore-formulario':
  if (formularioView === 'intro') {
    return <FormularioIntro onStart={handleStartFormulario} />;
  }
  if (formularioView === 'assessment') {
    return (
      <QualityScoreAssessmentDB 
        rodadaId={currentRodadaId} // Se houver rodada ativa
        onComplete={handleAssessmentComplete}
        onBack={() => setFormularioView('intro')}
      />
    );
  }
```

**Importação necessária:**
```typescript
import { QualityScoreAssessmentDB } from './components/QualityScoreAssessmentDB';
```

---

### 3. Substituir Seção de Rodadas

**Antes (Mock):**
```typescript
case 'qualityscore-progresso':
  return <Rodadas />;
```

**Depois (Com Banco):**
```typescript
case 'qualityscore-progresso':
  return <RodadasDB />; // Versão com banco
```

**Criar componente RodadasDB.tsx:**
```typescript
// /components/RodadasDB.tsx
import { useRodadas } from '../hooks/useRodadas';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { RodadasContent } from './Rodadas'; // Reaproveitar UI existente

export function RodadasDB() {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  
  const { 
    rodadas, 
    loading,
    createRodada,
    encerrarRodada,
    toggleResultAccess 
  } = useRodadas(selectedCompany?.id);

  if (loading) {
    return <div>Carregando rodadas...</div>;
  }

  return (
    <RodadasContent 
      rodadas={rodadas}
      onCreate={createRodada}
      onEncerrar={encerrarRodada}
      onToggleAccess={toggleResultAccess}
    />
  );
}
```

---

### 4. Substituir Seção de Resultados

**Antes (Mock):**
```typescript
case 'qualityscore-resultados':
  return <Resultados />;
```

**Depois (Com Banco):**
```typescript
case 'qualityscore-resultados':
  return <ResultadosDB />;
```

**Criar componente ResultadosDB.tsx:**
```typescript
// /components/ResultadosDB.tsx
import { useState } from 'react';
import { useResults, usePublicShare } from '../hooks/useResults';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';

export function ResultadosDB({ rodadaId }: { rodadaId: string }) {
  const { user } = useAuth();
  const { result, loading, generateResult } = useResults(rodadaId);
  const { publicShares, createShare } = usePublicShare(
    rodadaId, 
    result?.id || ''
  );

  const handleGenerate = async () => {
    if (!user) return;
    
    const newResult = await generateResult(user.id);
    
    if (newResult) {
      toast.success(`Resultado gerado! Score: ${newResult.overall_score}`);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    
    const shareUrl = await createShare(user.id);
    
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado para área de transferência!');
    }
  };

  if (loading) {
    return <div>Carregando resultados...</div>;
  }

  if (!result) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-4">
          Nenhum resultado gerado ainda
        </h3>
        <Button onClick={handleGenerate}>
          Gerar Resultado
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card className="p-8 text-center">
        <div className="text-6xl font-bold text-primary mb-2">
          {result.overall_score.toFixed(1)}
        </div>
        <p className="text-muted-foreground">Score Geral</p>
      </Card>

      {/* Scores por Pilar */}
      <div className="grid grid-cols-7 gap-4">
        {result.pilar_scores.map((pilar: any) => (
          <Card key={pilar.pilar_id} className="p-4 text-center">
            <div className="text-2xl font-semibold mb-1">
              {pilar.score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              {pilar.pilar_name}
            </div>
          </Card>
        ))}
      </div>

      {/* Ações */}
      <div className="flex gap-4">
        <Button onClick={handleShare}>
          Gerar Link Público
        </Button>
        <Button variant="outline" onClick={handleGenerate}>
          Recalcular Resultado
        </Button>
      </div>

      {/* Links Públicos Ativos */}
      {publicShares.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium mb-4">Links Públicos</h3>
          {publicShares.map(share => (
            <div key={share.id} className="flex justify-between items-center p-3 border-b">
              <div>
                <code className="text-sm">/score/{share.share_id}</code>
                <p className="text-xs text-muted-foreground">
                  {share.views} visualizações
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/score/${share.share_id}`
                  );
                  toast.success('Link copiado!');
                }}
              >
                Copiar
              </Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
```

---

## 🔄 Fluxo Completo Integrado

### Cenário: Usuário completa avaliação de uma rodada

```typescript
// 1. App.tsx - Estado da rodada atual
const [currentRodadaId, setCurrentRodadaId] = useState<string | null>(null);

// 2. Usuário inicia formulário de uma rodada
const handleStartFormularioFromRodada = (rodadaId: string) => {
  setCurrentRodadaId(rodadaId);
  setActiveSection('qualityscore-formulario');
  setFormularioView('assessment');
};

// 3. QualityScoreAssessmentDB salva respostas automaticamente
<QualityScoreAssessmentDB 
  rodadaId={currentRodadaId}
  onComplete={async () => {
    // Ao completar, atualiza progresso da rodada
    toast.success('Avaliação concluída!');
    
    // Volta para rodadas
    setActiveSection('qualityscore-progresso');
    setCurrentRodadaId(null);
  }}
/>

// 4. Sistema atualiza automaticamente:
// - assessment.status = 'completed'
// - rodada_participantes.status = 'concluido'
// - rodada_participantes.progress = 100

// 5. Manager pode gerar resultado quando todos completarem
```

---

## 🎯 Exemplo Completo: App.tsx Integrado

```typescript
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CompanyProvider } from './components/CompanyContext';
import { QualityScoreProvider } from './components/QualityScoreManager';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { SidebarInset } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';

// Importar componentes com banco
import { QualityScoreAssessmentDB } from './components/QualityScoreAssessmentDB';
import { RodadasDB } from './components/RodadasDB';
import { ResultadosDB } from './components/ResultadosDB';

// Outros componentes
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { FormularioIntro } from './components/FormularioIntro';
import { PublicQualityScoreFixed } from './components/PublicQualityScoreFixed';

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <QualityScoreProvider>
          <AppContent />
          <Toaster />
        </QualityScoreProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [formularioView, setFormularioView] = useState('intro');
  const [currentRodadaId, setCurrentRodadaId] = useState<string | null>(null);

  // Detectar rotas públicas
  const { isPublicRoute, shareId } = usePublicRoute();

  if (isPublicRoute && shareId) {
    return <PublicQualityScoreFixed shareId={shareId} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;

      case 'qualityscore-formulario':
        if (formularioView === 'intro') {
          return (
            <FormularioIntro 
              onStart={() => setFormularioView('assessment')} 
            />
          );
        }
        return (
          <QualityScoreAssessmentDB 
            rodadaId={currentRodadaId}
            onComplete={() => {
              setActiveSection('qualityscore-resultados');
              setFormularioView('intro');
            }}
            onBack={() => setFormularioView('intro')}
          />
        );

      case 'qualityscore-progresso':
        return (
          <RodadasDB 
            onStartAssessment={(rodadaId) => {
              setCurrentRodadaId(rodadaId);
              setActiveSection('qualityscore-formulario');
              setFormularioView('assessment');
            }}
          />
        );

      case 'qualityscore-resultados':
        return currentRodadaId ? (
          <ResultadosDB rodadaId={currentRodadaId} />
        ) : (
          <div>Selecione uma rodada para ver resultados</div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset>
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  );
}

// Hook para detectar rotas públicas
function usePublicRoute() {
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Detectar /score/abc123
    const pathMatch = path.match(/^\/score\/([^\/]+)$/);
    if (pathMatch) {
      setIsPublicRoute(true);
      setShareId(pathMatch[1]);
      return;
    }

    // Detectar #/score/abc123
    const hashMatch = hash.match(/^#\/score\/([^\/]+)$/);
    if (hashMatch) {
      setIsPublicRoute(true);
      setShareId(hashMatch[1]);
      return;
    }

    setIsPublicRoute(false);
    setShareId(null);
  }, []);

  return { isPublicRoute, shareId };
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
```

---

## 🎬 Sequência de Inicialização

1. **App Monta**
   - AuthProvider verifica autenticação
   - CompanyProvider carrega empresas disponíveis
   - QualityScoreProvider inicializa estado

2. **Usuário Faz Login**
   - AuthContext.login() é chamado
   - User é setado no estado
   - App re-renderiza mostrando conteúdo autenticado

3. **Componentes Carregam Dados**
   - RodadasDB chama `useRodadas(companyId)`
   - Hook faz query no Supabase
   - Dados são exibidos

4. **Usuário Responde Formulário**
   - QualityScoreAssessmentDB usa `useAssessment(userId, rodadaId)`
   - Cada resposta chama `saveAnswer()`
   - Dados são salvos no Supabase em tempo real

5. **Resultado é Gerado**
   - ResultadosDB usa `useResults(rodadaId)`
   - Ao clicar "Gerar", chama `generateResult(userId)`
   - ResultsService calcula e salva no banco

---

## ✅ Checklist de Integração

- [ ] Hooks importados no App.tsx
- [ ] QualityScoreAssessmentDB substituindo QualityScoreAssessment
- [ ] RodadasDB criado e integrado
- [ ] ResultadosDB criado e integrado
- [ ] Estado `currentRodadaId` gerenciado
- [ ] Callbacks `onComplete` conectados
- [ ] Navegação entre seções funcionando
- [ ] Toasts de feedback configurados
- [ ] Loading states implementados
- [ ] Erro handling em todas as chamadas

---

## 🎯 Benefícios da Integração

✅ **Persistência Real**: Dados salvos no PostgreSQL  
✅ **Tempo Real**: Progresso atualiza instantaneamente  
✅ **Multi-Usuário**: Múltiplos usuários podem responder simultaneamente  
✅ **Versionamento**: Histórico completo de avaliações  
✅ **Escalabilidade**: Banco relacional preparado para crescer  
✅ **Segurança**: RLS e permissões granulares  

---

## 🚀 Próximos Passos

Após integrar conforme este exemplo:

1. ✅ Testar fluxo completo (criar rodada → responder → gerar resultado)
2. ✅ Implementar loading states em todos os componentes
3. ✅ Adicionar error boundaries
4. ✅ Configurar autenticação Supabase Auth
5. ✅ Implementar notificações em tempo real (Realtime)
6. ✅ Adicionar analytics de uso

---

**Status:** ✅ Pronto para Integração  
**Tempo estimado:** 2-4 horas  
**Dificuldade:** Média

**🎉 Boa integração!**
