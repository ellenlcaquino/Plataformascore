import { useState, useEffect, useCallback } from 'react';
import { assessmentService, Assessment } from '../services/AssessmentService';
import { toast } from 'sonner@2.0.3';

export function useAssessment(userId: string, rodadaId?: string) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar ou criar assessment ao montar
  useEffect(() => {
    loadOrCreateAssessment();
  }, [userId, rodadaId]);

  const loadOrCreateAssessment = async () => {
    setLoading(true);
    try {
      // Tentar carregar assessment em andamento
      const existing = await assessmentService.getCurrentUserAssessment(userId, rodadaId);
      
      if (existing) {
        setCurrentAssessment(existing);
      }
    } catch (error) {
      console.error('Erro ao carregar assessment:', error);
      toast.error('Erro ao carregar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (companyId: string, versaoId: string) => {
    try {
      const assessment = await assessmentService.createAssessment({
        user_id: userId,
        company_id: companyId,
        rodada_id: rodadaId,
        versao_id: versaoId
      });

      if (assessment) {
        setCurrentAssessment(assessment);
        toast.success('Avaliação iniciada!');
        return assessment;
      }

      toast.error('Erro ao criar avaliação');
      return null;
    } catch (error) {
      console.error('Erro ao criar assessment:', error);
      toast.error('Erro ao criar avaliação');
      return null;
    }
  };

  const saveAnswer = useCallback(async (questionId: string, pilarId: number, value: number) => {
    if (!currentAssessment) {
      toast.error('Nenhuma avaliação ativa');
      return false;
    }

    setSaving(true);
    try {
      const success = await assessmentService.saveAnswer({
        assessment_id: currentAssessment.id,
        question_id: questionId,
        pilar_id: pilarId,
        value: value
      });

      if (success) {
        // Recarregar assessment para atualizar respostas
        const updated = await assessmentService.getAssessmentById(currentAssessment.id);
        if (updated) {
          setCurrentAssessment(updated);
        }
        return true;
      }

      toast.error('Erro ao salvar resposta');
      return false;
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      toast.error('Erro ao salvar resposta');
      return false;
    } finally {
      setSaving(false);
    }
  }, [currentAssessment]);

  const completeAssessment = async () => {
    if (!currentAssessment) {
      toast.error('Nenhuma avaliação ativa');
      return false;
    }

    try {
      const success = await assessmentService.completeAssessment(currentAssessment.id);

      if (success) {
        toast.success('Avaliação concluída com sucesso!');
        
        // Recarregar assessment
        const updated = await assessmentService.getAssessmentById(currentAssessment.id);
        if (updated) {
          setCurrentAssessment(updated);
        }

        return true;
      }

      toast.error('Erro ao concluir avaliação');
      return false;
    } catch (error) {
      console.error('Erro ao concluir assessment:', error);
      toast.error('Erro ao concluir avaliação');
      return false;
    }
  };

  const getProgress = useCallback(async () => {
    if (!currentAssessment) return 0;

    try {
      return await assessmentService.getAssessmentProgress(currentAssessment.id);
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
      return 0;
    }
  }, [currentAssessment]);

  const getAnswer = useCallback((questionId: string): number | undefined => {
    if (!currentAssessment?.answers) return undefined;

    const answer = currentAssessment.answers.find(a => a.question_id === questionId);
    return answer?.value;
  }, [currentAssessment]);

  return {
    currentAssessment,
    loading,
    saving,
    createAssessment,
    saveAnswer,
    completeAssessment,
    getProgress,
    getAnswer,
    reload: loadOrCreateAssessment
  };
}
