/**
 * QualityScoreAssessmentDB - Formulário de Avaliação com Integração ao Banco de Dados
 * 
 * Este componente substitui o QualityScoreAssessment e salva todas as respostas
 * diretamente no Supabase em tempo real.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { useAssessment } from '../hooks/useAssessment';
import { useRodada } from '../hooks/useRodadas';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Importar as 91 perguntas (assumindo que existem)
import { PILARES, PERGUNTAS } from './QualityAssessmentQuestions';

interface QualityScoreAssessmentDBProps {
  rodadaId?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

export function QualityScoreAssessmentDB({ 
  rodadaId, 
  onComplete, 
  onBack 
}: QualityScoreAssessmentDBProps) {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  
  // Hook de assessment com integração ao banco
  const {
    currentAssessment,
    loading,
    saving,
    createAssessment,
    saveAnswer,
    completeAssessment,
    getProgress,
    getAnswer
  } = useAssessment(user!.id, rodadaId);

  // Hook de rodada (se houver)
  const { updateParticipanteProgress } = useRodada(rodadaId || '');

  // Estado local para navegação
  const [currentPilarIndex, setCurrentPilarIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Calcular progresso ao montar e quando respostas mudarem
  useEffect(() => {
    loadProgress();
  }, [currentAssessment]);

  const loadProgress = async () => {
    const currentProgress = await getProgress();
    setProgress(currentProgress);

    // Atualizar progresso na rodada (se houver)
    if (rodadaId && user) {
      await updateParticipanteProgress(user.id, currentProgress);
    }
  };

  // Criar assessment se não existir
  useEffect(() => {
    if (!loading && !currentAssessment && selectedCompany) {
      initializeAssessment();
    }
  }, [loading, currentAssessment, selectedCompany]);

  const initializeAssessment = async () => {
    if (!selectedCompany || !user) return;

    const versaoId = await generateVersionId();
    
    await createAssessment(selectedCompany.id, versaoId);
  };

  const generateVersionId = async (): Promise<string> => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    
    return `V${year}.${month}.${day}-${time}`;
  };

  // Pilar e pergunta atuais
  const currentPilar = PILARES[currentPilarIndex];
  const questionsInPilar = PERGUNTAS.filter(q => q.pilarId === currentPilar.id);
  const currentQuestion = questionsInPilar[currentQuestionIndex];

  // Buscar resposta atual da pergunta
  const currentAnswer = currentQuestion ? getAnswer(currentQuestion.id) : undefined;

  // Handler de mudança de resposta
  const handleAnswerChange = async (value: number) => {
    if (!currentQuestion || !currentAssessment) return;

    // Salvar no banco
    const success = await saveAnswer(
      currentQuestion.id,
      currentPilar.id,
      value
    );

    if (success) {
      // Atualizar progresso
      await loadProgress();
      
      // Auto-avançar para próxima pergunta após 300ms
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  // Navegação
  const handleNext = () => {
    if (currentQuestionIndex < questionsInPilar.length - 1) {
      // Próxima pergunta no mesmo pilar
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentPilarIndex < PILARES.length - 1) {
      // Próximo pilar
      setCurrentPilarIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Fim do formulário
      handleCompleteFlow();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentPilarIndex > 0) {
      setCurrentPilarIndex(prev => prev - 1);
      const prevPilar = PILARES[currentPilarIndex - 1];
      const prevQuestions = PERGUNTAS.filter(q => q.pilarId === prevPilar.id);
      setCurrentQuestionIndex(prevQuestions.length - 1);
    }
  };

  const handleCompleteFlow = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    try {
      const success = await completeAssessment();

      if (success) {
        toast.success('Avaliação concluída com sucesso!', {
          description: 'Seus dados foram salvos. Obrigado pela participação!'
        });

        // Atualizar rodada para 100% e status concluído
        if (rodadaId && user) {
          await updateParticipanteProgress(user.id, 100);
        }

        // Callback de conclusão
        if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Erro ao completar:', error);
      toast.error('Erro ao finalizar avaliação');
    } finally {
      setIsCompleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-muted-foreground mt-4">Carregando avaliação...</p>
      </Card>
    );
  }

  if (!currentAssessment) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Erro ao carregar avaliação</h3>
        <p className="text-muted-foreground mb-4">
          Não foi possível inicializar a avaliação. Por favor, tente novamente.
        </p>
        <Button onClick={initializeAssessment}>Tentar Novamente</Button>
      </Card>
    );
  }

  // Calcular números para exibição
  const totalQuestions = 91;
  const currentQuestionNumber = 
    PILARES.slice(0, currentPilarIndex).reduce((sum, p) => {
      return sum + PERGUNTAS.filter(q => q.pilarId === p.id).length;
    }, 0) + currentQuestionIndex + 1;

  const isLastQuestion = 
    currentPilarIndex === PILARES.length - 1 && 
    currentQuestionIndex === questionsInPilar.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header com Progresso */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">QualityScore Assessment</h2>
            <p className="text-sm text-muted-foreground">
              {currentPilar.nome} • Pergunta {currentQuestionIndex + 1} de {questionsInPilar.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress}%</div>
            <p className="text-xs text-muted-foreground">
              {currentQuestionNumber} / {totalQuestions}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {/* Indicador de salvamento */}
        {saving && (
          <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
            <Save className="h-4 w-4 animate-spin" />
            <span>Salvando...</span>
          </div>
        )}
      </Card>

      {/* Navegação de Pilares */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PILARES.map((pilar, index) => {
          const pilarQuestions = PERGUNTAS.filter(q => q.pilarId === pilar.id);
          const answeredInPilar = pilarQuestions.filter(q => 
            getAnswer(q.id) !== undefined
          ).length;
          const pilarProgress = Math.round((answeredInPilar / pilarQuestions.length) * 100);

          return (
            <button
              key={pilar.id}
              onClick={() => {
                setCurrentPilarIndex(index);
                setCurrentQuestionIndex(0);
              }}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap
                ${index === currentPilarIndex 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-sm font-medium">{pilar.nome}</div>
              <div className="text-xs mt-1">
                {pilarProgress}%
              </div>
            </button>
          );
        })}
      </div>

      {/* Pergunta Atual */}
      {currentQuestion && (
        <Card className="p-8">
          <div className="space-y-6">
            {/* Número e Texto da Pergunta */}
            <div>
              <Badge variant="outline" className="mb-3">
                Pergunta {currentQuestionNumber}
              </Badge>
              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestion.texto}
              </h3>
            </div>

            {/* Descrição (se houver) */}
            {currentQuestion.descricao && (
              <p className="text-sm text-muted-foreground">
                {currentQuestion.descricao}
              </p>
            )}

            {/* Escala de Respostas (0-5) */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Selecione o nível que melhor representa sua realidade:
              </p>
              
              <div className="grid grid-cols-6 gap-3">
                {[0, 1, 2, 3, 4, 5].map((value) => {
                  const labels = [
                    'Não se aplica',
                    'Inicial',
                    'Básico',
                    'Intermediário',
                    'Avançado',
                    'Excelência'
                  ];

                  const isSelected = currentAnswer === value;

                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswerChange(value)}
                      className={`
                        p-4 rounded-lg border-2 transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary text-white shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-2xl font-bold mb-1">{value}</div>
                      <div className="text-xs">{labels[value]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resposta Atual */}
            {currentAnswer !== undefined && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Resposta salva: Nível {currentAnswer}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Navegação Inferior */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPilarIndex === 0 && currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          {progress}% concluído
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleCompleteFlow}
            disabled={isCompleting || progress < 100}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCompleting ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluir Avaliação
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Próxima
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Botão de Voltar (se fornecido) */}
      {onBack && (
        <div className="text-center">
          <Button variant="ghost" onClick={onBack}>
            Voltar ao Menu
          </Button>
        </div>
      )}
    </div>
  );
}
