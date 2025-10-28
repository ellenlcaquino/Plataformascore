import { supabase, handleSupabaseError } from '../utils/supabase/client';

export interface Assessment {
  id: string;
  user_id: string;
  rodada_id: string | null;
  company_id: string;
  versao_id: string;
  overall_score: number;
  status: 'draft' | 'completed';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  answers?: AssessmentAnswer[];
}

export interface AssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  pilar_id: number;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentData {
  user_id: string;
  company_id: string;
  rodada_id?: string;
  versao_id: string;
}

export interface SaveAnswerData {
  assessment_id: string;
  question_id: string;
  pilar_id: number;
  value: number;
}

class AssessmentService {
  /**
   * Criar uma nova avaliação (formulário)
   */
  async createAssessment(data: CreateAssessmentData): Promise<Assessment | null> {
    try {
      const { data: assessment, error } = await supabase
        .from('assessments')
        .insert({
          user_id: data.user_id,
          company_id: data.company_id,
          rodada_id: data.rodada_id || null,
          versao_id: data.versao_id,
          overall_score: 0,
          status: 'draft',
          completed_at: null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar assessment:', handleSupabaseError(error));
        return null;
      }

      return assessment;
    } catch (error) {
      console.error('Erro ao criar assessment:', error);
      return null;
    }
  }

  /**
   * Buscar assessment por ID
   */
  async getAssessmentById(assessmentId: string): Promise<Assessment | null> {
    try {
      const { data: assessment, error } = await supabase
        .from('assessments')
        .select('*, assessment_answers(*)')
        .eq('id', assessmentId)
        .single();

      if (error) {
        console.error('Erro ao buscar assessment:', handleSupabaseError(error));
        return null;
      }

      return assessment;
    } catch (error) {
      console.error('Erro ao buscar assessment:', error);
      return null;
    }
  }

  /**
   * Buscar assessment em andamento do usuário para uma rodada
   */
  async getCurrentUserAssessment(userId: string, rodadaId?: string): Promise<Assessment | null> {
    try {
      let query = supabase
        .from('assessments')
        .select('*, assessment_answers(*)')
        .eq('user_id', userId)
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(1);

      if (rodadaId) {
        query = query.eq('rodada_id', rodadaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar assessment do usuário:', handleSupabaseError(error));
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Erro ao buscar assessment do usuário:', error);
      return null;
    }
  }

  /**
   * Salvar uma resposta individual
   */
  async saveAnswer(data: SaveAnswerData): Promise<boolean> {
    try {
      // Verificar se já existe resposta para esta pergunta
      const { data: existing } = await supabase
        .from('assessment_answers')
        .select('id')
        .eq('assessment_id', data.assessment_id)
        .eq('question_id', data.question_id)
        .single();

      if (existing) {
        // Atualizar resposta existente
        const { error } = await supabase
          .from('assessment_answers')
          .update({
            value: data.value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Erro ao atualizar resposta:', handleSupabaseError(error));
          return false;
        }
      } else {
        // Inserir nova resposta
        const { error } = await supabase
          .from('assessment_answers')
          .insert({
            assessment_id: data.assessment_id,
            question_id: data.question_id,
            pilar_id: data.pilar_id,
            value: data.value
          });

        if (error) {
          console.error('Erro ao salvar resposta:', handleSupabaseError(error));
          return false;
        }
      }

      // Atualizar timestamp do assessment
      await supabase
        .from('assessments')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', data.assessment_id);

      return true;
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      return false;
    }
  }

  /**
   * Salvar múltiplas respostas de uma vez
   */
  async saveBatchAnswers(assessmentId: string, answers: Array<Omit<SaveAnswerData, 'assessment_id'>>): Promise<boolean> {
    try {
      const answersWithAssessmentId = answers.map(answer => ({
        assessment_id: assessmentId,
        question_id: answer.question_id,
        pilar_id: answer.pilar_id,
        value: answer.value
      }));

      const { error } = await supabase
        .from('assessment_answers')
        .upsert(answersWithAssessmentId, {
          onConflict: 'assessment_id,question_id'
        });

      if (error) {
        console.error('Erro ao salvar respostas em lote:', handleSupabaseError(error));
        return false;
      }

      // Atualizar timestamp do assessment
      await supabase
        .from('assessments')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', assessmentId);

      return true;
    } catch (error) {
      console.error('Erro ao salvar respostas em lote:', error);
      return false;
    }
  }

  /**
   * Calcular e atualizar score geral do assessment
   */
  async updateAssessmentScore(assessmentId: string): Promise<number | null> {
    try {
      // Buscar todas as respostas
      const { data: answers, error } = await supabase
        .from('assessment_answers')
        .select('value')
        .eq('assessment_id', assessmentId);

      if (error || !answers || answers.length === 0) {
        return null;
      }

      // Calcular score geral (média das respostas)
      const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
      const overallScore = totalScore / answers.length;

      // Atualizar assessment
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          overall_score: overallScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId);

      if (updateError) {
        console.error('Erro ao atualizar score:', handleSupabaseError(updateError));
        return null;
      }

      return overallScore;
    } catch (error) {
      console.error('Erro ao calcular score:', error);
      return null;
    }
  }

  /**
   * Marcar assessment como completo
   */
  async completeAssessment(assessmentId: string): Promise<boolean> {
    try {
      // Atualizar score antes de completar
      const score = await this.updateAssessmentScore(assessmentId);

      if (score === null) {
        console.error('Erro ao calcular score final');
        return false;
      }

      // Marcar como completo
      const { error } = await supabase
        .from('assessments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          overall_score: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId);

      if (error) {
        console.error('Erro ao completar assessment:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao completar assessment:', error);
      return false;
    }
  }

  /**
   * Buscar assessments completos de uma rodada
   */
  async getCompletedAssessmentsByRodada(rodadaId: string): Promise<Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*, assessment_answers(*)')
        .eq('rodada_id', rodadaId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar assessments da rodada:', handleSupabaseError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar assessments da rodada:', error);
      return [];
    }
  }

  /**
   * Buscar histórico de assessments do usuário
   */
  async getUserAssessmentHistory(userId: string): Promise<Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico:', handleSupabaseError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Calcular progresso do assessment (% de perguntas respondidas)
   */
  async getAssessmentProgress(assessmentId: string, totalQuestions: number = 91): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('assessment_answers')
        .select('*', { count: 'exact', head: true })
        .eq('assessment_id', assessmentId);

      if (error) {
        console.error('Erro ao calcular progresso:', handleSupabaseError(error));
        return 0;
      }

      const answeredQuestions = count || 0;
      return Math.round((answeredQuestions / totalQuestions) * 100);
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
      return 0;
    }
  }

  /**
   * Deletar assessment (apenas drafts)
   */
  async deleteAssessment(assessmentId: string): Promise<boolean> {
    try {
      // Verificar se é draft
      const { data: assessment } = await supabase
        .from('assessments')
        .select('status')
        .eq('id', assessmentId)
        .single();

      if (assessment?.status !== 'draft') {
        console.error('Apenas drafts podem ser deletados');
        return false;
      }

      // Deletar respostas primeiro (cascade)
      await supabase
        .from('assessment_answers')
        .delete()
        .eq('assessment_id', assessmentId);

      // Deletar assessment
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) {
        console.error('Erro ao deletar assessment:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar assessment:', error);
      return false;
    }
  }
}

export const assessmentService = new AssessmentService();
