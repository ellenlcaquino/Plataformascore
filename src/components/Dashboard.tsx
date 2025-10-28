import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { 
  BarChart3, Target, ExternalLink, Eye, 
  CheckCircle2, ArrowRight, Play, Sparkles, BookOpen,
  ClipboardList, Award, ChevronDown, TrendingUp, 
  Calendar, Users, Activity, AlertCircle, Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardProps {
  assessmentResults?: any;
  onSectionChange?: (section: string) => void;
}

interface MinhaRodada {
  id: string;
  versao_id: string;
  company_id: string;
  companyName: string;
  due_date: string;
  status: string;
  totalParticipantes: number;
  respostasCompletas: number;
  meuStatus: string;
  meuProgress: number;
}

export function Dashboard({ assessmentResults, onSectionChange }: DashboardProps) {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [hasRodadas, setHasRodadas] = useState(false);
  const [rodadasSummary, setRodadasSummary] = useState<any>(null);
  const [minhaRodadaAtiva, setMinhaRodadaAtiva] = useState<MinhaRodada | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Collapsible states
  const [openWhatIs, setOpenWhatIs] = useState(false);
  const [openHowWorks, setOpenHowWorks] = useState(false);
  const [openResources, setOpenResources] = useState(false);

  const totalQuestions = 91;
  const totalPillars = 7;

  useEffect(() => {
    const checkRodadas = async () => {
      if (!user || !currentCompany) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas?companyId=${currentCompany.id}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rodadas = data.rodadas || [];
          
          setHasRodadas(rodadas.length > 0);
          
          if (rodadas.length > 0) {
            // Calcular resumo
            const ativas = rodadas.filter((r: any) => r.status === 'ativa').length;
            const concluidas = rodadas.filter((r: any) => r.status === 'encerrada').length;
            const ultimaRodada = rodadas[0]; // Assumindo que vem ordenado
            
            setRodadasSummary({
              total: rodadas.length,
              ativas,
              concluidas,
              ultimaRodada
            });

            // Verificar se o usuário está participando de alguma rodada ativa
            const rodadaOndeEstouParticipando = rodadas.find((r: any) => {
              if (r.status !== 'ativa') return false;
              const participantes = r.rodada_participantes || [];
              return participantes.some((p: any) => p.user_id === user.id);
            });

            if (rodadaOndeEstouParticipando) {
              const participantes = rodadaOndeEstouParticipando.rodada_participantes || [];
              const meuParticipante = participantes.find((p: any) => p.user_id === user.id);
              
              setMinhaRodadaAtiva({
                id: rodadaOndeEstouParticipando.id,
                versao_id: rodadaOndeEstouParticipando.versao_id,
                company_id: rodadaOndeEstouParticipando.company_id,
                companyName: currentCompany.name,
                due_date: rodadaOndeEstouParticipando.due_date,
                status: rodadaOndeEstouParticipando.status,
                totalParticipantes: participantes.length,
                respostasCompletas: participantes.filter((p: any) => p.status === 'concluido').length,
                meuStatus: meuParticipante?.status || 'pendente',
                meuProgress: meuParticipante?.progress || 0,
              });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar rodadas:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRodadas();
  }, [user, currentCompany]);

  // Primeira vez - Sem resultados
  if (!loading && !hasRodadas) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl tracking-tight">Bem-vindo ao QualityMap App</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Avalie e melhore a maturidade em qualidade da sua organização
              </p>
            </div>
          </div>
        </div>

        {/* Alerta - Minha Rodada Ativa */}
        {minhaRodadaAtiva && (
          <Alert className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-1">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <AlertTitle className="text-lg">
                  Você está participando da Rodada {minhaRodadaAtiva.versao_id} da {minhaRodadaAtiva.companyName}.
                </AlertTitle>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span>
                      Prazo expirado em: <strong>{new Date(minhaRodadaAtiva.due_date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}</strong>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>
                      Participantes esperados: <strong>{minhaRodadaAtiva.totalParticipantes}</strong> | 
                      Já responderam: <strong className="text-green-600">{minhaRodadaAtiva.respostasCompletas}</strong>.
                    </span>
                  </div>
                </div>

                {/* Card Informativo Sobre a Rodada */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Sobre esta rodada:</h4>
                      <p className="text-sm text-blue-800">
                        As respostas desta rodada serão consolidadas com as dos demais participantes para gerar o resultado final 
                        da empresa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-2">
                  {minhaRodadaAtiva.meuStatus !== 'concluido' && (
                    <Button 
                      onClick={() => onSectionChange?.('formulario')}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {minhaRodadaAtiva.meuProgress > 0 ? 'Continuar Avaliação' : 'Iniciar Avaliação'}
                    </Button>
                  )}
                  {minhaRodadaAtiva.meuStatus === 'concluido' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Você já completou esta avaliação!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        )}

        {/* CTA Principal - Primeira Ação */}
        {!minhaRodadaAtiva && (
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl tracking-tight">Comece sua primeira avaliação</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  Crie uma rodada de avaliação e descubra o nível de maturidade em qualidade da sua equipe. 
                  O processo é simples e leva apenas alguns minutos para configurar.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{totalQuestions} perguntas estratégicas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{totalPillars} pilares de qualidade</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Resultados visuais instantâneos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => onSectionChange?.('rodadas')}
                  size="lg"
                  className="w-full md:w-auto text-lg px-8"
                >
                  Criar Nova Rodada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => {
                    if (onSectionChange) {
                      onSectionChange('public-demo');
                    } else {
                      const demoUrl = `${window.location.origin}${window.location.pathname}?demo=score/irricontrol-r1`;
                      window.open(demoUrl, '_blank');
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Demonstração
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Seções Informativas - Collapsible */}
        <div className="space-y-4">
          {/* O que é QualityScore */}
          <Collapsible open={openWhatIs} onOpenChange={setOpenWhatIs}>
            <Card className="border-border/50">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-xl font-semibold">O que é o QualityScore?</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openWhatIs ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    O <strong className="text-foreground">QualityScore</strong> é uma metodologia completa de avaliação de maturidade em qualidade de software. 
                    Por meio de <strong className="text-foreground">{totalQuestions} perguntas estratégicas</strong> organizadas em <strong className="text-foreground">{totalPillars} pilares fundamentais</strong>, 
                    o sistema gera um diagnóstico preciso do nível de qualidade da sua equipe ou organização.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{totalQuestions}</div>
                        <div className="text-sm text-muted-foreground">Perguntas</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{totalPillars}</div>
                        <div className="text-sm text-muted-foreground">Pilares</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">0-5</div>
                        <div className="text-sm text-muted-foreground">Escala de Avaliação</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Como Funciona */}
          <Collapsible open={openHowWorks} onOpenChange={setOpenHowWorks}>
            <Card className="border-border/50">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-xl font-semibold">Como Funciona</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openHowWorks ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          1
                        </div>
                        <h3 className="font-semibold">Criar Rodada</h3>
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">
                        Acesse <strong>Rodadas</strong> e crie uma nova avaliação. 
                        Defina participantes (managers, líderes ou membros) e data limite.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          2
                        </div>
                        <h3 className="font-semibold">Responder Formulário</h3>
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">
                        Cada participante responde as {totalQuestions} perguntas na escala de 0 a 5, 
                        avaliando os {totalPillars} pilares de qualidade.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                          3
                        </div>
                        <h3 className="font-semibold">Analisar Resultados</h3>
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">
                        Visualize gráficos comparativos, mapas de divergência e 
                        insights sobre pontos fortes e oportunidades de melhoria.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Recursos Disponíveis */}
          <Collapsible open={openResources} onOpenChange={setOpenResources}>
            <Card className="border-border/50">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-xl font-semibold">Recursos Disponíveis</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openResources ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Sistema de Rodadas</h4>
                        <p className="text-sm text-muted-foreground">
                          Versionamento imutável de avaliações com controle de participantes e prazos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Controle de Acesso</h4>
                        <p className="text-sm text-muted-foreground">
                          3 níveis de usuários: Managers, Líderes e Membros com permissões específicas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Análise Comparativa</h4>
                        <p className="text-sm text-muted-foreground">
                          Mapas de divergência e gráficos radar comparando perspectivas entre personas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Multi-Tenant</h4>
                        <p className="text-sm text-muted-foreground">
                          Suporte para múltiplas empresas com isolamento completo de dados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Compartilhamento Público</h4>
                        <p className="text-sm text-muted-foreground">
                          Gere URLs públicas para compartilhar resultados com stakeholders externos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Importação de Dados</h4>
                        <p className="text-sm text-muted-foreground">
                          Importe avaliações via Excel/XLSX para facilitar migração de dados
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            <strong>QualityMap App</strong> - Sistema completo de gestão de maturidade em qualidade de software
          </p>
        </div>
      </div>
    );
  }

  // Com rodadas/resultados existentes
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-1">
              Visão geral das suas avaliações de qualidade
            </p>
          </div>
        </div>
      </div>

      {/* Alerta - Minha Rodada Ativa */}
      {minhaRodadaAtiva && (
        <Alert className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-1">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <AlertTitle className="text-lg">
                Você está participando da Rodada {minhaRodadaAtiva.versao_id} da {minhaRodadaAtiva.companyName}.
              </AlertTitle>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span>
                    Prazo expirado em: <strong>{new Date(minhaRodadaAtiva.due_date).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>
                    Participantes esperados: <strong>{minhaRodadaAtiva.totalParticipantes}</strong> | 
                    Já responderam: <strong className="text-green-600">{minhaRodadaAtiva.respostasCompletas}</strong>.
                  </span>
                </div>
              </div>

              {/* Card Informativo Sobre a Rodada */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Sobre esta rodada:</h4>
                    <p className="text-sm text-blue-800">
                      As respostas desta rodada serão consolidadas com as dos demais participantes para gerar o resultado final 
                      da empresa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                {minhaRodadaAtiva.meuStatus !== 'concluido' && (
                  <Button 
                    onClick={() => onSectionChange?.('formulario')}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {minhaRodadaAtiva.meuProgress > 0 ? 'Continuar Avaliação' : 'Iniciar Avaliação'}
                  </Button>
                )}
                {minhaRodadaAtiva.meuStatus === 'concluido' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Você já completou esta avaliação!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Resumo de Dados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Rodadas</p>
                <p className="text-3xl font-bold">{rodadasSummary?.total || 0}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rodadas Ativas</p>
                <p className="text-3xl font-bold text-green-600">{rodadasSummary?.ativas || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Concluídas</p>
                <p className="text-3xl font-bold text-blue-600">{rodadasSummary?.concluidas || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Última Rodada */}
      {rodadasSummary?.ultimaRodada && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Última Rodada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{rodadasSummary.ultimaRodada.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Criada em {new Date(rodadasSummary.ultimaRodada.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  rodadasSummary.ultimaRodada.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {rodadasSummary.ultimaRodada.status === 'active' ? 'Ativa' : 'Concluída'}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => onSectionChange?.('rodadas')}
                  variant="default"
                >
                  Ver Rodadas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => onSectionChange?.('resultados')}
                  variant="outline"
                >
                  Ver Resultados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => onSectionChange?.('rodadas')}
              variant="outline"
              className="h-auto p-4 justify-start"
            >
              <div className="flex items-start gap-3 text-left">
                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Nova Rodada</div>
                  <div className="text-sm text-muted-foreground">Criar nova avaliação</div>
                </div>
              </div>
            </Button>

            <Button 
              onClick={() => onSectionChange?.('formulario')}
              variant="outline"
              className="h-auto p-4 justify-start"
            >
              <div className="flex items-start gap-3 text-left">
                <ClipboardList className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Preencher Formulário</div>
                  <div className="text-sm text-muted-foreground">Responder avaliação</div>
                </div>
              </div>
            </Button>

            <Button 
              onClick={() => onSectionChange?.('resultados')}
              variant="outline"
              className="h-auto p-4 justify-start"
            >
              <div className="flex items-start gap-3 text-left">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Ver Resultados</div>
                  <div className="text-sm text-muted-foreground">Análises e insights</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seções Informativas - Collapsible */}
      <div className="space-y-4">
        {/* O que é QualityScore */}
        <Collapsible open={openWhatIs} onOpenChange={setOpenWhatIs}>
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-xl font-semibold">O que é o QualityScore?</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openWhatIs ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  O <strong className="text-foreground">QualityScore</strong> é uma metodologia completa de avaliação de maturidade em qualidade de software. 
                  Por meio de <strong className="text-foreground">{totalQuestions} perguntas estratégicas</strong> organizadas em <strong className="text-foreground">{totalPillars} pilares fundamentais</strong>, 
                  o sistema gera um diagnóstico preciso do nível de qualidade da sua equipe ou organização.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">Perguntas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalPillars}</div>
                      <div className="text-sm text-muted-foreground">Pilares</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">0-5</div>
                      <div className="text-sm text-muted-foreground">Escala de Avaliação</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Como Funciona */}
        <Collapsible open={openHowWorks} onOpenChange={setOpenHowWorks}>
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-xl font-semibold">Como Funciona</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openHowWorks ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        1
                      </div>
                      <h3 className="font-semibold">Criar Rodada</h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-13">
                      Acesse <strong>Rodadas</strong> e crie uma nova avaliação. 
                      Defina participantes (managers, líderes ou membros) e data limite.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        2
                      </div>
                      <h3 className="font-semibold">Responder Formulário</h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-13">
                      Cada participante responde as {totalQuestions} perguntas na escala de 0 a 5, 
                      avaliando os {totalPillars} pilares de qualidade.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        3
                      </div>
                      <h3 className="font-semibold">Analisar Resultados</h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-13">
                      Visualize gráficos comparativos, mapas de divergência e 
                      insights sobre pontos fortes e oportunidades de melhoria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Recursos Disponíveis */}
        <Collapsible open={openResources} onOpenChange={setOpenResources}>
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-xl font-semibold">Recursos Disponíveis</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openResources ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Sistema de Rodadas</h4>
                      <p className="text-sm text-muted-foreground">
                        Versionamento imutável de avaliações com controle de participantes e prazos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Controle de Acesso</h4>
                      <p className="text-sm text-muted-foreground">
                        3 níveis de usuários: Managers, Líderes e Membros com permissões específicas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Análise Comparativa</h4>
                      <p className="text-sm text-muted-foreground">
                        Mapas de divergência e gráficos radar comparando perspectivas entre personas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Multi-Tenant</h4>
                      <p className="text-sm text-muted-foreground">
                        Suporte para múltiplas empresas com isolamento completo de dados
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Compartilhamento Público</h4>
                      <p className="text-sm text-muted-foreground">
                        Gere URLs públicas para compartilhar resultados com stakeholders externos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Importação de Dados</h4>
                      <p className="text-sm text-muted-foreground">
                        Importe avaliações via Excel/XLSX para facilitar migração de dados
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
