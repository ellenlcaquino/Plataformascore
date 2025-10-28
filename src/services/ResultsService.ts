import { supabase, handleSupabaseError } from '../utils/supabase/client';
import { assessmentService } from './AssessmentService';

export interface Result {
  id: string;
  rodada_id: string;
  versao_id: string;
  overall_score: number;
  pilar_scores: PilarScore[];
  metadata: ResultMetadata;
  created_at: string;
  updated_at: string;
}

export interface PilarScore {
  pilar_id: number;
  pilar_name: string;
  score: number;
  maturity_level: string;
}

export interface ResultMetadata {
  total_participants: number;
  total_responses: number;
  completion_rate: number;
  created_by: string;
  calculation_date: string;
}

export interface PublicShare {
  id: string;
  share_id: string;
  rodada_id: string;
  result_id: string;
  created_by: string;
  expires_at: string | null;
  is_active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

class ResultsService {
  /**
   * Nomes dos 7 pilares
   */
  private readonly PILARES = [
    { id: 1, name: 'Processos e Estratégia' },
    { id: 2, name: 'Testes Automatizados' },
    { id: 3, name: 'Métricas' },
    { id: 4, name: 'Documentações' },
    { id: 5, name: 'Modalidades de Testes' },
    { id: 6, name: 'QAOps' },
    { id: 7, name: 'Liderança' }
  ];

  /**
   * Determinar nível de maturidade baseado no score
   */
  private getMaturityLevel(score: number): string {
    if (score >= 4.0) return 'Domínio';
    if (score >= 3.0) return 'Experiência';
    if (score >= 2.0) return 'Consciência';
    if (score >= 1.0) return 'Inicialização';
    return 'Agnóstico';
  }

  /**
   * Calcular scores por pilar de um assessment
   */
  private calculatePilarScores(answers: Array<{ pilar_id: number; value: number }>): PilarScore[] {
    const pilarScores: PilarScore[] = [];

    for (const pilar of this.PILARES) {
      const pilarAnswers = answers.filter(a => a.pilar_id === pilar.id);
      
      if (pilarAnswers.length === 0) {
        pilarScores.push({
          pilar_id: pilar.id,
          pilar_name: pilar.name,
          score: 0,
          maturity_level: 'Agnóstico'
        });
        continue;
      }

      const totalScore = pilarAnswers.reduce((sum, a) => sum + a.value, 0);
      const avgScore = totalScore / pilarAnswers.length;

      pilarScores.push({
        pilar_id: pilar.id,
        pilar_name: pilar.name,
        score: Math.round(avgScore * 10) / 10, // 1 casa decimal
        maturity_level: this.getMaturityLevel(avgScore)
      });
    }

    return pilarScores;
  }

  /**
   * Gerar resultado de uma rodada
   */
  async generateResult(rodadaId: string, createdBy: string): Promise<Result | null> {
    try {
      // Buscar rodada
      const { data: rodada, error: rodadaError } = await supabase
        .from('rodadas')
        .select('versao_id')
        .eq('id', rodadaId)
        .single();

      if (rodadaError || !rodada) {
        console.error('Rodada não encontrada:', handleSupabaseError(rodadaError));
        return null;
      }

      // Buscar todos os assessments completos da rodada
      const assessments = await assessmentService.getCompletedAssessmentsByRodada(rodadaId);

      if (assessments.length === 0) {
        console.error('Nenhum assessment completo encontrado');
        return null;
      }

      // Agregar todas as respostas
      const allAnswers: Array<{ pilar_id: number; value: number }> = [];
      
      for (const assessment of assessments) {
        if (assessment.answers) {
          allAnswers.push(...assessment.answers.map(a => ({
            pilar_id: a.pilar_id,
            value: a.value
          })));
        }
      }

      // Calcular scores por pilar
      const pilarScores = this.calculatePilarScores(allAnswers);

      // Calcular score geral (média dos pilares)
      const overallScore = pilarScores.reduce((sum, p) => sum + p.score, 0) / pilarScores.length;

      // Metadata
      const metadata: ResultMetadata = {
        total_participants: assessments.length,
        total_responses: allAnswers.length,
        completion_rate: 100, // Se chegou aqui, 100% dos que completaram
        created_by: createdBy,
        calculation_date: new Date().toISOString()
      };

      // Salvar resultado
      const { data: result, error: resultError } = await supabase
        .from('results')
        .insert({
          rodada_id: rodadaId,
          versao_id: rodada.versao_id,
          overall_score: Math.round(overallScore * 10) / 10,
          pilar_scores: pilarScores,
          metadata: metadata
        })
        .select()
        .single();

      if (resultError) {
        console.error('Erro ao salvar resultado:', handleSupabaseError(resultError));
        return null;
      }

      return result;
    } catch (error) {
      console.error('Erro ao gerar resultado:', error);
      return null;
    }
  }

  /**
   * Buscar resultado por rodada
   */
  async getResultByRodada(rodadaId: string): Promise<Result | null> {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('rodada_id', rodadaId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar resultado:', handleSupabaseError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar resultado:', error);
      return null;
    }
  }

  /**
   * Buscar resultado por versão
   */
  async getResultByVersion(versaoId: string): Promise<Result | null> {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('versao_id', versaoId)
        .single();

      if (error) {
        console.error('Erro ao buscar resultado por versão:', handleSupabaseError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar resultado por versão:', error);
      return null;
    }
  }

  /**
   * Buscar histórico de resultados de uma empresa
   */
  async getCompanyResultsHistory(companyId: string): Promise<Result[]> {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          rodada:rodadas!inner(company_id)
        `)
        .eq('rodadas.company_id', companyId)
        .order('created_at', { ascending: false });

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
   * Gerar ID único para compartilhamento público
   */
  private generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let shareId = '';
    for (let i = 0; i < 8; i++) {
      shareId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shareId;
  }

  /**
   * Criar link de compartilhamento público
   */
  async createPublicShare(
    rodadaId: string,
    resultId: string,
    createdBy: string,
    expiresAt?: string
  ): Promise<PublicShare | null> {
    try {
      const shareId = this.generateShareId();

      const { data, error } = await supabase
        .from('public_shares')
        .insert({
          share_id: shareId,
          rodada_id: rodadaId,
          result_id: resultId,
          created_by: createdBy,
          expires_at: expiresAt || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar share público:', handleSupabaseError(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar share público:', error);
      return null;
    }
  }

  /**
   * Buscar dados públicos por share ID
   */
  async getPublicShareData(shareId: string): Promise<any | null> {
    try {
      // Buscar share
      const { data: share, error: shareError } = await supabase
        .from('public_shares')
        .select('*')
        .eq('share_id', shareId)
        .eq('is_active', true)
        .single();

      if (shareError || !share) {
        console.error('Share não encontrado:', handleSupabaseError(shareError));
        return null;
      }

      // Verificar expiração
      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        console.error('Share expirado');
        return null;
      }

      // Incrementar contador de views
      await supabase
        .from('public_shares')
        .update({ views: share.views + 1 })
        .eq('id', share.id);

      // Buscar resultado
      const { data: result, error: resultError } = await supabase
        .from('results')
        .select(`
          *,
          rodada:rodadas(
            versao_id,
            company:companies(name)
          )
        `)
        .eq('id', share.result_id)
        .single();

      if (resultError || !result) {
        console.error('Resultado não encontrado:', handleSupabaseError(resultError));
        return null;
      }

      return {
        shareId: share.share_id,
        versaoId: result.versao_id,
        companyName: result.rodada?.company?.name || 'Empresa',
        overallScore: result.overall_score,
        pilarScores: result.pilar_scores,
        metadata: result.metadata,
        timestamp: result.created_at,
        views: share.views + 1
      };
    } catch (error) {
      console.error('Erro ao buscar dados públicos:', error);
      return null;
    }
  }

  /**
   * Listar shares ativos de uma rodada
   */
  async getActiveSharesByRodada(rodadaId: string): Promise<PublicShare[]> {
    try {
      const { data, error } = await supabase
        .from('public_shares')
        .select('*')
        .eq('rodada_id', rodadaId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar shares:', handleSupabaseError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar shares:', error);
      return [];
    }
  }

  /**
   * Revogar acesso público
   */
  async revokePublicShare(shareId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('public_shares')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('share_id', shareId);

      if (error) {
        console.error('Erro ao revogar share:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao revogar share:', error);
      return false;
    }
  }

  /**
   * Calcular divergência entre personas/participantes
   */
  async calculateDivergence(rodadaId: string): Promise<any> {
    try {
      // Buscar todos os assessments da rodada
      const assessments = await assessmentService.getCompletedAssessmentsByRodada(rodadaId);

      if (assessments.length < 2) {
        return null; // Precisa de pelo menos 2 para comparar
      }

      // Calcular scores por pilar para cada participante
      const participantScores = assessments.map(assessment => {
        const answers = assessment.answers || [];
        return {
          userId: assessment.user_id,
          pilarScores: this.calculatePilarScores(answers)
        };
      });

      // Calcular desvio padrão por pilar
      const divergenceByPilar = this.PILARES.map(pilar => {
        const scores = participantScores.map(p => 
          p.pilarScores.find(ps => ps.pilar_id === pilar.id)?.score || 0
        );

        // Calcular média
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Calcular desvio padrão
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        return {
          pilar_id: pilar.id,
          pilar_name: pilar.name,
          mean: Math.round(mean * 10) / 10,
          std_dev: Math.round(stdDev * 10) / 10,
          min: Math.min(...scores),
          max: Math.max(...scores),
          range: Math.max(...scores) - Math.min(...scores)
        };
      });

      return {
        total_participants: assessments.length,
        divergence_by_pilar: divergenceByPilar,
        overall_divergence: Math.round(
          divergenceByPilar.reduce((sum, p) => sum + p.std_dev, 0) / divergenceByPilar.length * 10
        ) / 10
      };
    } catch (error) {
      console.error('Erro ao calcular divergência:', error);
      return null;
    }
  }
}

export const resultsService = new ResultsService();
