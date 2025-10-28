import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, ArrowRight, Target, CheckCircle2, BarChart3, Users, Calendar, AlertTriangle, Info } from 'lucide-react';
import { QualityScoreLayout } from './QualityScoreLayout';
import { useAuth } from './AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useSidebar } from './ui/sidebar';
import { useRodadasDB } from '../hooks/useRodadasDB';

interface FormularioIntroProps {
  onStartAssessment: (rodadaId?: string) => void;
}

// Interface para rodada ativa
interface Rodada {
  id: string;
  nome: string;
  prazo: string;
  totalParticipantes: number;
  jaResponderam: number;
  status: 'ativa' | 'encerrada';
  userStatus: 'nao_respondeu' | 'ja_respondeu' | 'em_progresso';
  permitirEdicao: boolean;
}

export function FormularioIntro({ onStartAssessment }: FormularioIntroProps) {
  const { user } = useAuth();
  const { rodadas: rodadasDB, loading: loadingRodadas } = useRodadasDB();
  const [rodadaAtiva, setRodadaAtiva] = useState<Rodada | null>(null);

  // Buscar rodada ativa onde o usuário é participante
  useEffect(() => {
    if (!user?.id || loadingRodadas) {
      setRodadaAtiva(null);
      return;
    }

    // Encontrar rodada ativa onde o usuário está como participante
    const minhaRodadaAtiva = rodadasDB.find(rodada => {
      if (rodada.status !== 'ativa') return false;
      
      // Verificar se o usuário está na lista de participantes
      return rodada.participantes?.some(p => p.id === user.id || p.email === user.email);
    });

    if (minhaRodadaAtiva) {
      // Encontrar meu status como participante
      const meuParticipante = minhaRodadaAtiva.participantes?.find(
        p => p.id === user.id || p.email === user.email
      );

      const rodadaFormatada: Rodada = {
        id: minhaRodadaAtiva.id,
        nome: minhaRodadaAtiva.versao_id,
        prazo: minhaRodadaAtiva.due_date,
        totalParticipantes: minhaRodadaAtiva.totalParticipantes || 0,
        jaResponderam: minhaRodadaAtiva.respostasCompletas || 0,
        status: 'ativa',
        userStatus: meuParticipante?.status === 'concluido' 
          ? 'ja_respondeu' 
          : meuParticipante?.status === 'respondendo'
          ? 'em_progresso'
          : 'nao_respondeu',
        permitirEdicao: minhaRodadaAtiva.criterio_encerramento === 'manual'
      };
      
      setRodadaAtiva(rodadaFormatada);
    } else {
      setRodadaAtiva(null);
    }
  }, [user, rodadasDB, loadingRodadas]);

  // Determinar contexto e estado do botão
  const contextoFormulario = useMemo(() => {
    if (rodadaAtiva) {
      // Está participando de uma rodada
      const prazoFormatado = new Date(rodadaAtiva.prazo).toLocaleDateString('pt-BR');
      const estaAtrasado = new Date() > new Date(rodadaAtiva.prazo);
      
      if (rodadaAtiva.userStatus === 'nao_respondeu') {
        return {
          tipo: 'rodada_pendente' as const,
          titulo: `📋 Você está participando da Rodada ${rodadaAtiva.nome} da sua empresa.`,
          subtitulo: estaAtrasado 
            ? `⚠️ Prazo expirado em: ${prazoFormatado}`
            : `⏳ Prazo para responder até: ${prazoFormatado}.`,
          participacao: `👥 Participantes esperados: ${rodadaAtiva.totalParticipantes} | Já responderam: ${rodadaAtiva.jaResponderam}.`,
          botaoTexto: `Iniciar Avaliação da Rodada ${rodadaAtiva.nome}`,
          botaoDesabilitado: false,
          botaoVariant: 'default' as const
        };
      } else if (rodadaAtiva.userStatus === 'ja_respondeu') {
        return {
          tipo: 'rodada_respondida' as const,
          titulo: `✅ Você já respondeu a Rodada ${rodadaAtiva.nome}.`,
          subtitulo: `⏳ Prazo para editar até: ${prazoFormatado}.`,
          participacao: `👥 Participantes esperados: ${rodadaAtiva.totalParticipantes} | Já responderam: ${rodadaAtiva.jaResponderam}.`,
          botaoTexto: rodadaAtiva.permitirEdicao ? "Editar minha resposta" : "Visualizar minha resposta",
          botaoDesabilitado: false,
          botaoVariant: rodadaAtiva.permitirEdicao ? 'secondary' as const : 'outline' as const
        };
      } else if (rodadaAtiva.userStatus === 'em_progresso') {
        return {
          tipo: 'rodada_progresso' as const,
          titulo: `🔄 Você está respondendo a Rodada ${rodadaAtiva.nome}.`,
          subtitulo: `⏳ Prazo para finalizar até: ${prazoFormatado}.`,
          participacao: `👥 Participantes esperados: ${rodadaAtiva.totalParticipantes} | Já responderam: ${rodadaAtiva.jaResponderam}.`,
          botaoTexto: "Continuar Avaliação",
          botaoDesabilitado: false,
          botaoVariant: 'default' as const
        };
      }
    }
    
    // Não há rodada ativa - formulário avulso
    return {
      tipo: 'avaliacao_individual' as const,
      titulo: null,
      subtitulo: null,
      participacao: null,
      botaoTexto: "Iniciar Avaliação Individual",
      botaoDesabilitado: false,
      botaoVariant: 'default' as const
    };
  }, [rodadaAtiva]);

  const { setOpen } = useSidebar();

  const handleButtonClick = () => {
    // Colapsar sidebar ao iniciar avaliação
    setOpen(false);
    
    // Passar o rodadaId se houver uma rodada ativa
    console.log('🎯 Iniciando assessment - rodadaId:', rodadaAtiva?.id);
    onStartAssessment(rodadaAtiva?.id);
  };

  return (
    <TooltipProvider>
      <QualityScoreLayout 
        currentSection="qualityscore-formulario" 
        title="Avaliação QualityScore"
        description="Platform completa para avaliar a maturidade em qualidade de software da sua organização"
      >
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full flex items-center">
        <div className="max-w-4xl mx-auto p-8 space-y-8 w-full">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            Bem-vindo ao QualityMap App
          </div>
          
          <h1 className="text-5xl lg:text-6xl tracking-tight leading-tight">
            <span className="text-primary font-semibold">QualityScore</span> é uma feature desenvolvida para
            <br />
            <span className="text-primary font-semibold">avaliar e melhorar</span> a qualidade da sua empresa
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
            Uma metodologia completa para medir e aprimorar a maturidade em qualidade de software
            da sua organização através de 7 pilares fundamentais.
          </p>
        </div>

        {/* Labels de contexto da rodada */}
        {contextoFormulario.tipo !== 'avaliacao_individual' && (
          <Card className="border-blue-200 bg-blue-50/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="space-y-2">
                <p className="text-blue-900 font-medium">
                  {contextoFormulario.titulo}
                </p>
                <p className="text-blue-800">
                  {contextoFormulario.subtitulo}
                </p>
                <p className="text-blue-700 text-sm">
                  {contextoFormulario.participacao}
                </p>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Sobre esta rodada:</p>
                  <p>As respostas desta rodada serão consolidadas com as dos demais participantes para gerar o resultado final da empresa.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-white/80">
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">91 Perguntas</h3>
                <p className="text-sm text-muted-foreground">
                  Avaliação abrangente organizadas em 7 pilares de qualidade
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Escala 0-5</h3>
                <p className="text-sm text-muted-foreground">
                  Sistema de pontuação claro e objetivo para cada aspecto
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Insights Profundos</h3>
                <p className="text-sm text-muted-foreground">
                  Análise detalhada do estado atual da qualidade organizacional
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6 pt-6 border-t border-border/50">
              <Button 
                onClick={handleButtonClick}
                disabled={contextoFormulario.botaoDesabilitado}
                variant={contextoFormulario.botaoVariant}
                className={
                  contextoFormulario.botaoVariant === 'default' 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    : "px-8 py-6 text-lg rounded-xl transition-all duration-300"
                }
                size="lg"
              >
                {contextoFormulario.botaoTexto}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Tempo estimado: 30-45 minutos</span>
              </div>

              {/* Badge para distinguir tipo de avaliação */}
              <div className="flex items-center justify-center">
                {contextoFormulario.tipo === 'avaliacao_individual' ? (
                  <Badge variant="outline" className="text-sm">
                    <Target className="h-4 w-4 mr-2" />
                    Avaliação Individual
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <Users className="h-4 w-4 mr-2" />
                    Rodada {rodadaAtiva?.nome}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </QualityScoreLayout>
    </TooltipProvider>
  );
}