import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { FormularioIntro } from "./components/FormularioIntro";
import { QualityMap } from "./components/QualityMap";
import { QualityAssessmentForm } from "./components/QualityAssessmentForm";
import { QualityScoreAssessment } from "./components/QualityScoreAssessment";
import { Rodadas } from "./components/Rodadas";
import { Resultados } from "./components/Resultados";
import { Importar } from "./components/Importar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { CompanyManagement } from "./components/CompanyManagement";
import { UserProfile } from "./components/UserProfile";
import { CadastrosManagement } from "./components/CadastrosManagement";
import { PersonaSwitcher } from "./components/PersonaSwitcher";

import { PublicQualityScoreFixed } from "./components/PublicQualityScoreFixed";
import { PublicDemo } from "./components/PublicDemo";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { QualityScoreProvider } from "./components/QualityScoreManager";
import { CompanyProvider } from "./components/CompanyContext";
import { ChevronLeft } from 'lucide-react';
import { Progress } from "./components/ui/progress";
import { Toaster } from "./components/ui/sonner";
import { useCompanyColors } from "./components/useCompanyColors";

type ViewState = 'intro' | 'map' | 'assessment' | 'advanced-assessment';

// Hook para detectar se estamos em uma rota pública
function usePublicRoute() {
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Detectar rota pública de score no pathname
      const publicScoreMatch = path.match(/^\/score\/([^\/]+)$/);
      
      // Também detectar no hash para ambientes que usam hash routing
      const hashScoreMatch = hash.match(/^#\/score\/([^\/]+)$/);
      
      // Detectar parâmetro URL para demo
      const params = new URLSearchParams(window.location.search);
      const demoParam = params.get('demo');
      const demoScoreMatch = demoParam?.match(/^score\/([^\/]+)$/);
      
      if (publicScoreMatch) {
        console.log('✅ Rota pública de score detectada:', publicScoreMatch[1]);
        setIsPublicRoute(true);
        setShareId(publicScoreMatch[1]);
      } else if (hashScoreMatch) {
        console.log('✅ Rota pública de score detectada (hash):', hashScoreMatch[1]);
        setIsPublicRoute(true);
        setShareId(hashScoreMatch[1]);
      } else if (demoScoreMatch) {
        console.log('✅ Demo de rota pública de score detectado:', demoScoreMatch[1]);
        setIsPublicRoute(true);
        setShareId(demoScoreMatch[1]);
      } else {
        // Rota normal - não é erro, apenas não é pública
        setIsPublicRoute(false);
        setShareId(null);
      }
    };
    
    // Verificar imediatamente
    checkRoute();
    
    // Escutar mudanças de URL
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  return { isPublicRoute, shareId };
}

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [formularioView, setFormularioView] = useState<ViewState>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [assessmentProgress, setAssessmentProgress] = useState({ progress: 0, currentStep: 'Visão Geral' });
  const [showRegister, setShowRegister] = useState(false);
  const [currentRodadaId, setCurrentRodadaId] = useState<string | undefined>(undefined);
  const { isAuthenticated, loading, user } = useAuth();
  const { isPublicRoute, shareId } = usePublicRoute();
  
  // Aplicar cores da empresa dinamicamente
  useCompanyColors();

  // Se é uma rota pública, renderizar a página pública diretamente
  if (isPublicRoute && shareId) {
    return (
      <>
        <PublicQualityScoreFixed shareId={shareId} />
        <Toaster />
      </>
    );
  }

  const handleStartAssessment = (rodadaId?: string) => {
    console.log('📝 App.handleStartAssessment - rodadaId recebido:', rodadaId);
    setCurrentRodadaId(rodadaId);
    setFormularioView('advanced-assessment');
  };

  const handleBackToIntro = () => {
    setFormularioView('intro');
  };

  const handleStartPillar = () => {
    setFormularioView('assessment');
  };

  const handleAssessmentComplete = (data: any) => {
    setAssessmentResults(data);
    // NÃO mudar para resultados automaticamente - o líder deve gerar manualmente
    // setActiveSection('qualityscore-resultados');
    setActiveSection('qualityscore-progresso'); // Volta para rodadas
    setFormularioView('intro');
  };

  const handleBackFromAssessment = () => {
    setFormularioView('intro');
    setAssessmentProgress({ progress: 0, currentStep: 'Visão Geral' });
  };

  const handleProgressUpdate = (progress: number, currentStep: string) => {
    setAssessmentProgress({ progress, currentStep });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard assessmentResults={assessmentResults} onSectionChange={handleSectionChange} />;
      
      // QualityScore Sections
      case 'qualityscore-formulario':
        if (formularioView === 'intro') {
          return <FormularioIntro onStartAssessment={handleStartAssessment} />;
        } else if (formularioView === 'advanced-assessment') {
          console.log('🔷 Renderizando QualityScoreAssessment');
          console.log('   rodadaId:', currentRodadaId);
          console.log('   userId:', user?.id);
          console.log('   userId tipo:', typeof user?.id, '- É UUID?', user?.id?.includes('-') && user?.id?.length > 20);
          return (
            <QualityScoreAssessment 
              onComplete={handleAssessmentComplete}
              onBack={handleBackFromAssessment}
              onProgressUpdate={handleProgressUpdate}
              rodadaId={currentRodadaId}
              userId={user?.id}
            />
          );
        } else if (formularioView === 'map') {
          return (
            <QualityMap 
              onBackToIntro={handleBackToIntro}
              onStartPillar={handleStartPillar}
              answers={answers}
            />
          );
        } else {
          return (
            <QualityAssessmentForm 
              answers={answers}
              onAnswersChange={setAnswers}
              onBackToMap={() => setFormularioView('map')}
            />
          );
        }
      case 'qualityscore-progresso':
        return <Rodadas />;
      case 'qualityscore-resultados':
        return <Resultados assessmentResults={assessmentResults} />;
      case 'qualityscore-importar':
        return <Importar />;
      
      // Other sections
      case 'empresa':
        return <CompanyManagement />;
      case 'personas':
        return <PersonaSwitcher />;
      case 'public-demo':
        return <PublicDemo />;
      
      default:
        return <Dashboard assessmentResults={assessmentResults} />;
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Reset form view when changing sections, except for QualityScore formulário
    if (section !== 'qualityscore-formulario') {
      setFormularioView('intro');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onBackToLogin={() => setShowRegister(false)} />;
    }
    return <Login onShowRegister={() => setShowRegister(true)} />;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-6 bg-white/80 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
          
          {/* Header dinâmico baseado na seção ativa */}
          {activeSection === 'qualityscore-formulario' && formularioView === 'advanced-assessment' ? (
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={handleBackFromAssessment}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              
              <div className="flex-1 max-w-md">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                  <div className="flex-1">
                    <Progress value={assessmentProgress.progress} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600">{assessmentProgress.progress}% completo</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {assessmentProgress.currentStep}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1" />
              <UserProfile />
            </>
          )}
        </header>
        <main className="flex-1 overflow-hidden bg-slate-50/30">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

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