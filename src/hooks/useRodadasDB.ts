import { useState, useEffect, useCallback } from 'react';
import { rodadasApi, usersApi } from '../services/ApiService';
import { useAuth } from '../components/AuthContext';
import { toast } from 'sonner@2.0.3';

export interface Participante {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: 'pendente' | 'respondendo' | 'concluido' | 'atrasado';
  progress: number;
  lastActivity?: string;
  completedDate?: string;
  initials: string;
  canViewResults: boolean;
}

export interface Rodada {
  id: string;
  versao_id: string;
  company_id: string;
  companyName: string;
  created_by: string;
  createdByName?: string;
  createdByRole: 'manager' | 'leader';
  created_at: string;
  due_date: string;
  status: 'ativa' | 'encerrada' | 'rascunho';
  criterio_encerramento: 'automatico' | 'manual';
  participantes: Participante[];
  totalParticipantes: number;
  respostasCompletas: number;
  respostasEmProgresso: number;
  respostasPendentes: number;
  progressoGeral: number;
  resultadoGerado: boolean;
  resultadoId?: string;
  allowPartialResults: boolean;
}

export function useRodadasDB() {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch rodadas
  const fetchRodadas = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Filtrar por empresa se for Leader
      const companyId = user.role === 'leader' ? user.companyId : undefined;
      const response = await rodadasApi.getAll(companyId);
      
      // Transformar dados do backend para o formato do frontend
      const transformedRodadas: Rodada[] = response.rodadas.map((r: any) => {
        const participantes: Participante[] = (r.rodada_participantes || []).map((p: any) => {
          // Extrair dados do usuário do JOIN ou usar fallback
          const userData = p.users || {};
          const name = userData.name || 'Usuário';
          const email = userData.email || '';
          const role = userData.role || 'member';
          
          // Gerar iniciais do nome
          const initials = name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || '??';
          
          return {
            id: p.id,
            user_id: p.user_id,
            name,
            email,
            role,
            status: p.status,
            progress: p.progress || 0,
            lastActivity: p.last_activity,
            completedDate: p.completed_date,
            initials,
            canViewResults: p.can_view_results || false,
          };
        });

        const respostasCompletas = participantes.filter(p => p.status === 'concluido').length;
        const respostasEmProgresso = participantes.filter(p => p.status === 'respondendo').length;
        const respostasPendentes = participantes.filter(p => p.status === 'pendente').length;
        const progressoGeral = participantes.length > 0
          ? Math.round(participantes.reduce((sum, p) => sum + p.progress, 0) / participantes.length)
          : 0;

        return {
          id: r.id,
          versao_id: r.versao_id,
          company_id: r.company_id,
          companyName: user?.companyName || 'Empresa',
          created_by: r.created_by,
          createdByRole: user?.role as 'manager' | 'leader',
          created_at: r.created_at,
          due_date: r.due_date,
          status: r.status,
          criterio_encerramento: r.criterio_encerramento,
          participantes,
          totalParticipantes: participantes.length,
          respostasCompletas,
          respostasEmProgresso,
          respostasPendentes,
          progressoGeral,
          resultadoGerado: r.status === 'encerrada',
          resultadoId: r.id,
          allowPartialResults: false,
        };
      });

      setRodadas(transformedRodadas);
    } catch (err: any) {
      console.error('Error fetching rodadas:', err);
      setError(err.message || 'Erro ao carregar rodadas');
      toast.error('Erro ao carregar rodadas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create rodada
  const createRodada = useCallback(async (data: {
    dueDate: string;
    criterioEncerramento: 'automatico' | 'manual';
    participantesEmails: string[];
  }) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      // Buscar usuários existentes
      const usersResponse = await usersApi.getAll();
      const allUsers = usersResponse.users || [];
      
      // Criar usuários que não existem
      const participantes = [];
      for (const email of data.participantesEmails) {
        let existingUser = allUsers.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase()
        );

        if (!existingUser) {
          // Criar novo usuário
          const newUserResponse = await usersApi.create({
            email,
            name: email.split('@')[0],
            role: 'member',
            companyId: user.companyId,
            companyName: user.companyName,
            addedViaRodada: true,
            invitedBy: user.name,
          });
          existingUser = newUserResponse.user;
        }

        participantes.push({
          user_id: existingUser.id,
          id: existingUser.id,
        });
      }

      // Criar rodada
      const response = await rodadasApi.create({
        company_id: user.companyId,
        status: 'ativa',
        criterio_encerramento: data.criterioEncerramento,
        due_date: data.dueDate,
        created_by: user.id,
        participantes,
      });

      toast.success('Rodada criada com sucesso!');
      
      // Recarregar rodadas
      await fetchRodadas();
      
      return response.rodada;
    } catch (err: any) {
      console.error('Error creating rodada:', err);
      toast.error('Erro ao criar rodada: ' + err.message);
      return null;
    }
  }, [user, fetchRodadas]);

  // Update rodada status
  const updateRodadaStatus = useCallback(async (
    rodadaId: string,
    status: 'ativa' | 'encerrada' | 'rascunho'
  ) => {
    try {
      await rodadasApi.update(rodadaId, { status });
      toast.success(
        status === 'encerrada' 
          ? 'Rodada encerrada com sucesso!' 
          : 'Status atualizado!'
      );
      await fetchRodadas();
    } catch (err: any) {
      console.error('Error updating rodada:', err);
      toast.error('Erro ao atualizar rodada: ' + err.message);
    }
  }, [fetchRodadas]);

  // Update participant
  const updateParticipante = useCallback(async (
    rodadaId: string,
    participanteId: string,
    data: {
      status?: string;
      progress?: number;
      can_view_results?: boolean;
    }
  ) => {
    try {
      await rodadasApi.updateParticipante(rodadaId, participanteId, data);
      await fetchRodadas();
    } catch (err: any) {
      console.error('Error updating participante:', err);
      toast.error('Erro ao atualizar participante: ' + err.message);
    }
  }, [fetchRodadas]);

  // Load on mount
  useEffect(() => {
    fetchRodadas();
  }, [fetchRodadas]);

  return {
    rodadas,
    loading,
    error,
    fetchRodadas,
    createRodada,
    updateRodadaStatus,
    updateParticipante,
  };
}
