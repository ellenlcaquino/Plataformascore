import { supabase, handleSupabaseError } from '../utils/supabase/client';

export interface Rodada {
  id: string;
  company_id: string;
  versao_id: string;
  status: 'rascunho' | 'ativa' | 'encerrada';
  criterio_encerramento: 'manual' | 'automatico';
  due_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  encerrado_em: string | null;
  participantes?: RodadaParticipante[];
  company?: {
    id: string;
    name: string;
  };
}

export interface RodadaParticipante {
  id: string;
  rodada_id: string;
  user_id: string;
  status: 'pendente' | 'respondendo' | 'concluido' | 'atrasado';
  progress: number;
  can_view_results: boolean;
  last_activity: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateRodadaData {
  company_id: string;
  versao_id: string;
  criterio_encerramento: 'manual' | 'automatico';
  due_date: string;
  created_by: string;
  participantes: string[]; // Array de user_ids
}

class RodadaService {
  /**
   * Gerar ID de versão no formato V{ANO}.{MES}.{SEQUENCIAL}
   */
  async generateVersionId(companyId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Buscar última versão do mês para esta empresa
    const { data, error } = await supabase
      .from('rodadas')
      .select('versao_id')
      .eq('company_id', companyId)
      .like('versao_id', `V${year}.${month}.%`)
      .order('versao_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar última versão:', handleSupabaseError(error));
    }

    // Extrair sequencial da última versão
    let nextSequential = 1;
    if (data && data.length > 0) {
      const lastVersion = data[0].versao_id;
      const parts = lastVersion.split('.');
      if (parts.length === 3) {
        const lastSequential = parseInt(parts[2], 10);
        nextSequential = lastSequential + 1;
      }
    }

    return `V${year}.${month}.${String(nextSequential).padStart(3, '0')}`;
  }

  /**
   * Criar uma nova rodada
   */
  async createRodada(data: CreateRodadaData): Promise<Rodada | null> {
    try {
      // Gerar versão automaticamente se não fornecida
      const versaoId = data.versao_id || await this.generateVersionId(data.company_id);

      // Criar rodada
      const { data: rodada, error } = await supabase
        .from('rodadas')
        .insert({
          company_id: data.company_id,
          versao_id: versaoId,
          status: 'ativa',
          criterio_encerramento: data.criterio_encerramento,
          due_date: data.due_date,
          created_by: data.created_by,
          encerrado_em: null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar rodada:', handleSupabaseError(error));
        return null;
      }

      // Adicionar participantes
      if (data.participantes && data.participantes.length > 0) {
        const participantesData = data.participantes.map(userId => ({
          rodada_id: rodada.id,
          user_id: userId,
          status: 'pendente' as const,
          progress: 0,
          can_view_results: false,
          last_activity: null,
          completed_date: null
        }));

        const { error: participantesError } = await supabase
          .from('rodada_participantes')
          .insert(participantesData);

        if (participantesError) {
          console.error('Erro ao adicionar participantes:', handleSupabaseError(participantesError));
        }
      }

      return rodada;
    } catch (error) {
      console.error('Erro ao criar rodada:', error);
      return null;
    }
  }

  /**
   * Buscar rodada por ID com participantes
   */
  async getRodadaById(rodadaId: string): Promise<Rodada | null> {
    try {
      const { data: rodada, error } = await supabase
        .from('rodadas')
        .select(`
          *,
          company:companies(id, name),
          participantes:rodada_participantes(*)
        `)
        .eq('id', rodadaId)
        .single();

      if (error) {
        console.error('Erro ao buscar rodada:', handleSupabaseError(error));
        return null;
      }

      return rodada;
    } catch (error) {
      console.error('Erro ao buscar rodada:', error);
      return null;
    }
  }

  /**
   * Buscar rodadas de uma empresa
   */
  async getRodadasByCompany(companyId: string, status?: Rodada['status']): Promise<Rodada[]> {
    try {
      let query = supabase
        .from('rodadas')
        .select(`
          *,
          company:companies(id, name),
          participantes:rodada_participantes(*)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar rodadas:', handleSupabaseError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar rodadas:', error);
      return [];
    }
  }

  /**
   * Buscar todas as rodadas (apenas para Managers)
   */
  async getAllRodadas(status?: Rodada['status']): Promise<Rodada[]> {
    try {
      let query = supabase
        .from('rodadas')
        .select(`
          *,
          company:companies(id, name),
          participantes:rodada_participantes(*)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar todas rodadas:', handleSupabaseError(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar todas rodadas:', error);
      return [];
    }
  }

  /**
   * Atualizar status da rodada
   */
  async updateRodadaStatus(rodadaId: string, status: Rodada['status']): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      // Se encerrando, adicionar timestamp
      if (status === 'encerrada') {
        updateData.encerrado_em = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rodadas')
        .update(updateData)
        .eq('id', rodadaId);

      if (error) {
        console.error('Erro ao atualizar status da rodada:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status da rodada:', error);
      return false;
    }
  }

  /**
   * Adicionar participante a uma rodada
   */
  async addParticipante(rodadaId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rodada_participantes')
        .insert({
          rodada_id: rodadaId,
          user_id: userId,
          status: 'pendente',
          progress: 0,
          can_view_results: false,
          last_activity: null,
          completed_date: null
        });

      if (error) {
        console.error('Erro ao adicionar participante:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      return false;
    }
  }

  /**
   * Atualizar status do participante
   */
  async updateParticipanteStatus(
    participanteId: string,
    status: RodadaParticipante['status'],
    progress?: number
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (progress !== undefined) {
        updateData.progress = progress;
      }

      if (status === 'respondendo') {
        updateData.last_activity = new Date().toISOString();
      }

      if (status === 'concluido') {
        updateData.completed_date = new Date().toISOString();
        updateData.progress = 100;
      }

      const { error } = await supabase
        .from('rodada_participantes')
        .update(updateData)
        .eq('id', participanteId);

      if (error) {
        console.error('Erro ao atualizar participante:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar participante:', error);
      return false;
    }
  }

  /**
   * Atualizar progresso do participante baseado no assessment
   */
  async updateParticipanteProgress(rodadaId: string, userId: string, progress: number): Promise<boolean> {
    try {
      // Buscar participante
      const { data: participante } = await supabase
        .from('rodada_participantes')
        .select('id, status')
        .eq('rodada_id', rodadaId)
        .eq('user_id', userId)
        .single();

      if (!participante) {
        console.error('Participante não encontrado');
        return false;
      }

      // Determinar novo status
      let newStatus = participante.status;
      if (progress > 0 && progress < 100 && participante.status === 'pendente') {
        newStatus = 'respondendo';
      } else if (progress === 100) {
        newStatus = 'concluido';
      }

      return await this.updateParticipanteStatus(participante.id, newStatus, progress);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return false;
    }
  }

  /**
   * Toggle acesso aos resultados do participante
   */
  async toggleParticipanteResultAccess(participanteId: string, canViewResults: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rodada_participantes')
        .update({
          can_view_results: canViewResults,
          updated_at: new Date().toISOString()
        })
        .eq('id', participanteId);

      if (error) {
        console.error('Erro ao atualizar acesso aos resultados:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar acesso aos resultados:', error);
      return false;
    }
  }

  /**
   * Permitir todos os participantes verem resultados
   */
  async allowAllParticipantsViewResults(rodadaId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rodada_participantes')
        .update({
          can_view_results: true,
          updated_at: new Date().toISOString()
        })
        .eq('rodada_id', rodadaId);

      if (error) {
        console.error('Erro ao permitir todos verem resultados:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao permitir todos verem resultados:', error);
      return false;
    }
  }

  /**
   * Restringir todos os participantes de ver resultados
   */
  async restrictAllParticipantsViewResults(rodadaId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rodada_participantes')
        .update({
          can_view_results: false,
          updated_at: new Date().toISOString()
        })
        .eq('rodada_id', rodadaId);

      if (error) {
        console.error('Erro ao restringir todos de verem resultados:', handleSupabaseError(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao restringir todos de verem resultados:', error);
      return false;
    }
  }

  /**
   * Calcular estatísticas da rodada
   */
  async getRodadaStats(rodadaId: string) {
    try {
      const { data: participantes, error } = await supabase
        .from('rodada_participantes')
        .select('status, progress')
        .eq('rodada_id', rodadaId);

      if (error || !participantes) {
        return null;
      }

      const totalParticipantes = participantes.length;
      const respostasCompletas = participantes.filter(p => p.status === 'concluido').length;
      const respostasEmProgresso = participantes.filter(p => p.status === 'respondendo').length;
      const respostasPendentes = participantes.filter(p => p.status === 'pendente').length;
      const atrasados = participantes.filter(p => p.status === 'atrasado').length;

      // Progresso geral (média dos progressos individuais)
      const progressoGeral = participantes.length > 0
        ? Math.round(participantes.reduce((sum, p) => sum + p.progress, 0) / participantes.length)
        : 0;

      return {
        totalParticipantes,
        respostasCompletas,
        respostasEmProgresso,
        respostasPendentes,
        atrasados,
        progressoGeral
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return null;
    }
  }

  /**
   * Verificar se rodada está pronta para gerar resultado
   */
  async isReadyToGenerateResult(rodadaId: string): Promise<boolean> {
    try {
      const { data: rodada } = await supabase
        .from('rodadas')
        .select('status, criterio_encerramento')
        .eq('id', rodadaId)
        .single();

      if (!rodada || rodada.status !== 'ativa') {
        return false;
      }

      // Se critério é manual, sempre pode gerar
      if (rodada.criterio_encerramento === 'manual') {
        return true;
      }

      // Se critério é automático, verificar se todos completaram
      const stats = await this.getRodadaStats(rodadaId);
      return stats ? stats.respostasCompletas === stats.totalParticipantes : false;
    } catch (error) {
      console.error('Erro ao verificar se pode gerar resultado:', error);
      return false;
    }
  }
}

export const rodadaService = new RodadaService();
