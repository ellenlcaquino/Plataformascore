import { useState, useEffect, useCallback } from 'react';
import { rodadaService, Rodada, CreateRodadaData } from '../services/RodadaService';
import { toast } from 'sonner@2.0.3';

export function useRodadas(companyId?: string) {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRodadas();
  }, [companyId]);

  const loadRodadas = async () => {
    setLoading(true);
    try {
      let data: Rodada[];
      
      if (companyId) {
        data = await rodadaService.getRodadasByCompany(companyId);
      } else {
        data = await rodadaService.getAllRodadas();
      }

      setRodadas(data);
    } catch (error) {
      console.error('Erro ao carregar rodadas:', error);
      toast.error('Erro ao carregar rodadas');
    } finally {
      setLoading(false);
    }
  };

  const createRodada = async (data: CreateRodadaData) => {
    try {
      const rodada = await rodadaService.createRodada(data);

      if (rodada) {
        toast.success('Rodada criada com sucesso!');
        await loadRodadas(); // Recarregar lista
        return rodada;
      }

      toast.error('Erro ao criar rodada');
      return null;
    } catch (error) {
      console.error('Erro ao criar rodada:', error);
      toast.error('Erro ao criar rodada');
      return null;
    }
  };

  const encerrarRodada = async (rodadaId: string) => {
    try {
      const success = await rodadaService.updateRodadaStatus(rodadaId, 'encerrada');

      if (success) {
        toast.success('Rodada encerrada com sucesso!');
        await loadRodadas();
        return true;
      }

      toast.error('Erro ao encerrar rodada');
      return false;
    } catch (error) {
      console.error('Erro ao encerrar rodada:', error);
      toast.error('Erro ao encerrar rodada');
      return false;
    }
  };

  const toggleResultAccess = async (participanteId: string, canView: boolean) => {
    try {
      const success = await rodadaService.toggleParticipanteResultAccess(participanteId, canView);

      if (success) {
        toast.success(canView ? 'Acesso permitido' : 'Acesso restrito');
        await loadRodadas();
        return true;
      }

      toast.error('Erro ao alterar permissão');
      return false;
    } catch (error) {
      console.error('Erro ao alterar permissão:', error);
      toast.error('Erro ao alterar permissão');
      return false;
    }
  };

  const allowAllResults = async (rodadaId: string) => {
    try {
      const success = await rodadaService.allowAllParticipantsViewResults(rodadaId);

      if (success) {
        toast.success('Todos podem ver os resultados');
        await loadRodadas();
        return true;
      }

      toast.error('Erro ao permitir acesso');
      return false;
    } catch (error) {
      console.error('Erro ao permitir acesso:', error);
      toast.error('Erro ao permitir acesso');
      return false;
    }
  };

  const restrictAllResults = async (rodadaId: string) => {
    try {
      const success = await rodadaService.restrictAllParticipantsViewResults(rodadaId);

      if (success) {
        toast.success('Acesso aos resultados restrito para todos');
        await loadRodadas();
        return true;
      }

      toast.error('Erro ao restringir acesso');
      return false;
    } catch (error) {
      console.error('Erro ao restringir acesso:', error);
      toast.error('Erro ao restringir acesso');
      return false;
    }
  };

  return {
    rodadas,
    loading,
    createRodada,
    encerrarRodada,
    toggleResultAccess,
    allowAllResults,
    restrictAllResults,
    reload: loadRodadas
  };
}

export function useRodada(rodadaId: string) {
  const [rodada, setRodada] = useState<Rodada | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadRodada();
  }, [rodadaId]);

  const loadRodada = async () => {
    setLoading(true);
    try {
      const data = await rodadaService.getRodadaById(rodadaId);
      setRodada(data);

      if (data) {
        const statsData = await rodadaService.getRodadaStats(rodadaId);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erro ao carregar rodada:', error);
      toast.error('Erro ao carregar rodada');
    } finally {
      setLoading(false);
    }
  };

  const updateParticipanteProgress = async (userId: string, progress: number) => {
    try {
      const success = await rodadaService.updateParticipanteProgress(rodadaId, userId, progress);

      if (success) {
        await loadRodada(); // Recarregar dados
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return false;
    }
  };

  return {
    rodada,
    stats,
    loading,
    updateParticipanteProgress,
    reload: loadRodada
  };
}
