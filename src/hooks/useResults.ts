import { useState, useEffect, useCallback } from 'react';
import { resultsService, Result, PublicShare } from '../services/ResultsService';
import { toast } from 'sonner@2.0.3';

export function useResults(rodadaId?: string) {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rodadaId) {
      loadResult();
    }
  }, [rodadaId]);

  const loadResult = async () => {
    if (!rodadaId) return;

    setLoading(true);
    try {
      const data = await resultsService.getResultByRodada(rodadaId);
      setResult(data);
    } catch (error) {
      console.error('Erro ao carregar resultado:', error);
      toast.error('Erro ao carregar resultado');
    } finally {
      setLoading(false);
    }
  };

  const generateResult = async (createdBy: string) => {
    if (!rodadaId) {
      toast.error('Rodada não especificada');
      return null;
    }

    try {
      toast.info('Gerando resultado...');
      
      const data = await resultsService.generateResult(rodadaId, createdBy);

      if (data) {
        toast.success('Resultado gerado com sucesso!');
        setResult(data);
        return data;
      }

      toast.error('Erro ao gerar resultado');
      return null;
    } catch (error) {
      console.error('Erro ao gerar resultado:', error);
      toast.error('Erro ao gerar resultado');
      return null;
    }
  };

  return {
    result,
    loading,
    generateResult,
    reload: loadResult
  };
}

export function usePublicShare(rodadaId: string, resultId: string) {
  const [publicShares, setPublicShares] = useState<PublicShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShares();
  }, [rodadaId]);

  const loadShares = async () => {
    setLoading(true);
    try {
      const data = await resultsService.getActiveSharesByRodada(rodadaId);
      setPublicShares(data);
    } catch (error) {
      console.error('Erro ao carregar shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShare = async (createdBy: string, expiresAt?: string) => {
    try {
      const share = await resultsService.createPublicShare(
        rodadaId,
        resultId,
        createdBy,
        expiresAt
      );

      if (share) {
        const shareUrl = `${window.location.origin}/score/${share.share_id}`;
        toast.success('Link público gerado!');
        await loadShares();
        return shareUrl;
      }

      toast.error('Erro ao gerar link público');
      return null;
    } catch (error) {
      console.error('Erro ao criar share:', error);
      toast.error('Erro ao gerar link público');
      return null;
    }
  };

  const revokeShare = async (shareId: string) => {
    try {
      const success = await resultsService.revokePublicShare(shareId);

      if (success) {
        toast.success('Link revogado com sucesso');
        await loadShares();
        return true;
      }

      toast.error('Erro ao revogar link');
      return false;
    } catch (error) {
      console.error('Erro ao revogar share:', error);
      toast.error('Erro ao revogar link');
      return false;
    }
  };

  return {
    publicShares,
    loading,
    createShare,
    revokeShare,
    reload: loadShares
  };
}

export function usePublicData(shareId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicData();
  }, [shareId]);

  const loadPublicData = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicData = await resultsService.getPublicShareData(shareId);

      if (publicData) {
        setData(publicData);
      } else {
        setError('Link inválido ou expirado');
      }
    } catch (err) {
      console.error('Erro ao carregar dados públicos:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    reload: loadPublicData
  };
}

export function useDivergence(rodadaId: string) {
  const [divergence, setDivergence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDivergence();
  }, [rodadaId]);

  const loadDivergence = async () => {
    setLoading(true);
    try {
      const data = await resultsService.calculateDivergence(rodadaId);
      setDivergence(data);
    } catch (error) {
      console.error('Erro ao calcular divergência:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    divergence,
    loading,
    reload: loadDivergence
  };
}
