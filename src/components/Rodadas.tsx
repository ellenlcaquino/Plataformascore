import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AccessControl } from './AccessControl';
import { QualityScoreLayout } from './QualityScoreLayout';
import { useQualityScore } from './QualityScoreManager';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { useRodadasDB } from '../hooks/useRodadasDB';
import { NovaRodadaForm } from './NovaRodadaFormNew';
import { ReportView } from './ReportView';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Copy,
  BarChart3,
  Calendar,
  Search,
  MoreHorizontal,
  Plus,
  Mail,
  Play,
  Square,
  Eye,
  EyeOff,
  Settings,
  Target,
  Archive,
  Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Participante {
  id: string;
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

interface Rodada {
  id: string;
  versaoId: string;
  companyName: string;
  companyId: string;
  createdBy: string;
  createdByRole: 'manager' | 'leader';
  createdDate: string;
  dueDate: string;
  status: 'ativa' | 'encerrada' | 'rascunho';
  criterioEncerramento: 'automatico' | 'manual';
  totalParticipantes: number;
  respostasCompletas: number;
  respostasEmProgresso: number;
  respostasPendentes: number;
  progressoGeral: number;
  participantes: Participante[];
  resultadoGerado: boolean;
  resultadoId?: string;
  allowPartialResults: boolean;
}

// Mock data REMOVIDO - Sistema usa apenas dados reais do banco de dados
// Array vazio mantido para compatibilidade
const mockRodadas_DEPRECATED: Rodada[] = [];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'bg-green-100 text-green-800';
    case 'respondendo':
      return 'bg-blue-100 text-blue-800';
    case 'pendente':
      return 'bg-gray-100 text-gray-800';
    case 'atrasado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'respondendo':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'pendente':
      return <Clock className="h-4 w-4 text-gray-600" />;
    case 'atrasado':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'Concluído';
    case 'respondendo':
      return 'Respondendo';
    case 'pendente':
      return 'Pendente';
    case 'atrasado':
      return 'Atrasado';
    default:
      return 'Pendente';
  }
};

const getRodadaStatusColor = (status: string) => {
  switch (status) {
    case 'ativa':
      return 'bg-blue-100 text-blue-800';
    case 'encerrada':
      return 'bg-green-100 text-green-800';
    case 'rascunho':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function Rodadas() {
  const { user } = useAuth();
  const canManageRodadas = user?.role === 'manager' || user?.role === 'leader';
  
  return (
    <AccessControl requiredPermissions={['canViewProgress']}>
      {canManageRodadas ? <RodadasContent /> : <ParticipanteView />}
    </AccessControl>
  );
}

function RodadasContent() {
  const { rodadas: rodadasDB, loading: loadingRodadas, fetchRodadas } = useRodadasDB();
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [activeTab, setActiveTab] = useState('ativas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRodada, setSelectedRodada] = useState<Rodada | null>(null);
  const [showNovaRodadaModal, setShowNovaRodadaModal] = useState(false);
  const [showReportView, setShowReportView] = useState(false);
  const [selectedResultado, setSelectedResultado] = useState<any>(null);
  const { user } = useAuth();
  const { selectedCompany } = useCompany();

  // Sincronizar rodadas do banco com o estado local
  useEffect(() => {
    // SEMPRE usar dados do banco quando disponíveis, mesmo que vazio
    if (!loadingRodadas) {
      if (rodadasDB.length > 0) {
        // Transformar formato do banco para formato do componente
        const transformedRodadas: Rodada[] = rodadasDB.map(r => ({
          id: r.id,
          versaoId: r.versao_id,
          companyName: r.companyName,
          companyId: r.company_id,
          createdBy: r.created_by,
          createdByRole: r.createdByRole,
          createdDate: r.created_at,
          dueDate: r.due_date,
          status: r.status,
          criterioEncerramento: r.criterio_encerramento,
          totalParticipantes: r.totalParticipantes,
          respostasCompletas: r.respostasCompletas,
          respostasEmProgresso: r.respostasEmProgresso,
          respostasPendentes: r.respostasPendentes,
          progressoGeral: r.progressoGeral,
          participantes: r.participantes.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            role: p.role,
            status: p.status,
            progress: p.progress,
            lastActivity: p.lastActivity,
            completedDate: p.completedDate,
            initials: p.initials,
            canViewResults: p.canViewResults
          })),
          resultadoGerado: r.resultadoGerado,
          resultadoId: r.resultadoId,
          allowPartialResults: r.allowPartialResults
        }));
        setRodadas(transformedRodadas);
      } else {
        // Lista vazia - sem rodadas criadas ainda
        setRodadas([]);
      }
    }
  }, [rodadasDB, loadingRodadas]);

  const filteredRodadas = useMemo(() => {
    let filtered = rodadas;
    
    // Filtrar por aba ativa
    if (activeTab === 'ativas') {
      filtered = filtered.filter(r => r.status === 'ativa' || r.status === 'rascunho');
    } else if (activeTab === 'encerradas') {
      filtered = filtered.filter(r => r.status === 'encerrada');
    }
    
    // Filtrar por empresa selecionada no whitelabel (prioridade máxima)
    if (selectedCompany) {
      filtered = filtered.filter(r => r.companyId === selectedCompany.id);
    }
    // Ou filtrar por empresa do usuário (se não for manager)
    else if (user?.role !== 'manager' && user?.companyId) {
      filtered = filtered.filter(r => r.companyId === user.companyId);
    }
    
    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.versaoId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [rodadas, activeTab, searchTerm, user, selectedCompany]);

  const handleGerarResultado = async (rodadaId: string) => {
    const rodada = rodadas.find(r => r.id === rodadaId);
    if (!rodada) {
      toast.error('Rodada não encontrada');
      return;
    }

    const participantesPendentes = rodada.totalParticipantes - rodada.respostasCompletas;
    const isParcial = participantesPendentes > 0;
    
    // Confirmar geração
    const confirmMessage = isParcial
      ? `Você está prestes a gerar resultados PARCIAIS com ${rodada.respostasCompletas} de ${rodada.totalParticipantes} respostas. ${participantesPendentes} pessoa${participantesPendentes > 1 ? 's ainda não responderam' : ' ainda não respondeu'}. Deseja continuar?`
      : `Todos os ${rodada.totalParticipantes} participantes responderam! Deseja gerar os resultados finais?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      toast.loading('Gerando resultados...', { id: 'gerar-resultado' });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas/${rodadaId}/gerar-resultados`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            tipo: isParcial ? 'parcial' : 'final',
            generated_by: user?.userId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar resultados');
      }

      toast.success(data.message || 'Resultados gerados com sucesso!', { id: 'gerar-resultado' });
      
      // Recarregar rodadas
      await fetchRodadas();
      
    } catch (error) {
      console.error('Erro ao gerar resultados:', error);
      toast.error(error.message || 'Erro ao gerar resultados', { id: 'gerar-resultado' });
    }
  };

  const handleVerResultados = async (rodadaId: string) => {
    try {
      toast.loading('Carregando resultados...', { id: 'carregar-resultado' });
      
      // Buscar resultado da rodada
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas/${rodadaId}/resultado`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar resultados');
      }

      toast.success('Resultados carregados!', { id: 'carregar-resultado' });
      
      // Encontrar a rodada para passar informações adicionais
      const rodada = rodadas.find(r => r.id === rodadaId);
      
      setSelectedResultado({
        ...data.resultado,
        rodadaInfo: rodada ? {
          versaoId: rodada.versaoId,
          companyName: rodada.companyName,
          dueDate: rodada.dueDate,
          status: rodada.status
        } : undefined
      });
      setShowReportView(true);
      
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
      toast.error(error.message || 'Erro ao carregar resultados', { id: 'carregar-resultado' });
    }
  };

  const handleEncerrarRodada = (rodadaId: string) => {
    console.log('Encerrando rodada:', rodadaId);
    // Implementar lógica de encerramento
  };

  const handleDeletarRodada = async (rodadaId: string) => {
    const rodada = rodadas.find(r => r.id === rodadaId);
    if (!rodada) {
      toast.error('Rodada não encontrada');
      return;
    }

    // Confirmar exclusão
    const confirmMessage = `Tem certeza que deseja EXCLUIR a rodada ${rodada.versaoId} da empresa ${rodada.companyName}?\n\nEsta ação não pode ser desfeita e irá remover:\n- ${rodada.totalParticipantes} participantes\n- ${rodada.respostasCompletas} respostas completas\n- Todos os dados relacionados`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      toast.loading('Excluindo rodada...', { id: 'deletar-rodada' });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas/${rodadaId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir rodada');
      }

      toast.success('Rodada excluída com sucesso!', { id: 'deletar-rodada' });
      
      // Recarregar rodadas
      await fetchRodadas();
      
    } catch (error) {
      console.error('Erro ao excluir rodada:', error);
      toast.error(error.message || 'Erro ao excluir rodada', { id: 'deletar-rodada' });
    }
  };

  const handleDeletarTodasRodadas = async () => {
    // Para líderes e membros, usar a empresa do usuário
    // Para managers, exigir seleção de empresa
    let companyId: string;
    let companyName: string;
    
    if (user?.role === 'manager') {
      if (!selectedCompany) {
        toast.error('Selecione uma empresa primeiro');
        return;
      }
      companyId = selectedCompany.id;
      companyName = selectedCompany.name;
    } else {
      // Líder ou Membro
      if (!user?.companyId) {
        toast.error('Empresa não encontrada');
        return;
      }
      companyId = user.companyId;
      companyName = user.companyName || 'sua empresa';
    }

    const rodadasParaDeletar = filteredRodadas.length;

    if (rodadasParaDeletar === 0) {
      toast.error('Não há rodadas para excluir');
      return;
    }

    // Confirmar exclusão
    const confirmMessage = `⚠️ ATENÇÃO: Você está prestes a EXCLUIR TODAS AS ${rodadasParaDeletar} RODADAS da empresa "${companyName}".\n\n` +
      `Esta ação é IRREVERSÍVEL e irá remover:\n` +
      `- Todas as rodadas (ativas e encerradas)\n` +
      `- Todos os participantes\n` +
      `- Todas as respostas\n` +
      `- Todos os resultados gerados\n\n` +
      `Digite "EXCLUIR TUDO" para confirmar:`;
    
    const confirmText = window.prompt(confirmMessage);
    
    if (confirmText !== 'EXCLUIR TUDO') {
      toast.info('Exclusão cancelada');
      return;
    }

    try {
      toast.loading(`Excluindo ${rodadasParaDeletar} rodada(s)...`, { id: 'deletar-todas' });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas/company/${companyId}/all`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir rodadas');
      }

      toast.success(`${data.deletedCount} rodada(s) excluída(s) com sucesso!`, { id: 'deletar-todas' });
      
      // Recarregar rodadas
      await fetchRodadas();
      
    } catch (error) {
      console.error('Erro ao excluir todas as rodadas:', error);
      toast.error(error.message || 'Erro ao excluir rodadas', { id: 'deletar-todas' });
    }
  };

  const handleToggleResultAccess = (rodadaId: string, participanteId: string) => {
    console.log('Alternando acesso aos resultados:', { rodadaId, participanteId });
    // Implementar lógica de alternância de acesso
  };

  return (
    <QualityScoreLayout 
      currentSection="qualityscore-progresso" 
      title="Gestão de Rodadas"
      description="Crie e gerencie rodadas de avaliação para suas equipes"
    >
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header com ações */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Rodadas de Avaliação</h1>
              <p className="text-gray-600 mt-1">
                Gerencie rodadas de QualityScore e acompanhe o progresso das equipes
              </p>
            </div>
            <div className="flex items-center gap-3">
              {filteredRodadas.length > 0 && (
                <Button 
                  variant="destructive"
                  onClick={handleDeletarTodasRodadas}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Todas ({filteredRodadas.length})
                </Button>
              )}
              <Dialog open={showNovaRodadaModal} onOpenChange={setShowNovaRodadaModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Rodada
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Rodada</DialogTitle>
                    <DialogDescription>
                      Configure uma nova rodada de avaliação QualityScore para sua equipe.
                    </DialogDescription>
                  </DialogHeader>
                  <NovaRodadaForm 
                    onClose={() => setShowNovaRodadaModal(false)}
                    onSuccess={async () => {
                      // Recarregar lista de rodadas do banco
                      await fetchRodadas();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filtros e busca */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por empresa ou versão..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Loading state */}
          {loadingRodadas ? (
            <Card className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando rodadas...</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Tabs para rodadas ativas e encerradas */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="ativas">Rodadas Ativas ({filteredRodadas.filter(r => r.status === 'ativa' || r.status === 'rascunho').length})</TabsTrigger>
              <TabsTrigger value="encerradas">Encerradas ({filteredRodadas.filter(r => r.status === 'encerrada').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="ativas" className="space-y-4">
              {filteredRodadas.filter(r => r.status === 'ativa' || r.status === 'rascunho').map((rodada) => (
                <RodadaCard 
                  key={rodada.id} 
                  rodada={rodada} 
                  onSelect={setSelectedRodada}
                  onGerarResultado={handleGerarResultado}
                  onEncerrarRodada={handleEncerrarRodada}
                  onDeletarRodada={handleDeletarRodada}
                  onVerResultados={handleVerResultados}
                />
              ))}
              {filteredRodadas.filter(r => r.status === 'ativa' || r.status === 'rascunho').length === 0 && (
                <Card className="p-8 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma rodada ativa</h3>
                  <p className="text-gray-600 mb-4">Crie uma nova rodada para começar a coletar avaliações da equipe.</p>
                  <Button onClick={() => setShowNovaRodadaModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Rodada
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="encerradas" className="space-y-4">
              {filteredRodadas.filter(r => r.status === 'encerrada').map((rodada) => (
                <RodadaCard 
                  key={rodada.id} 
                  rodada={rodada} 
                  onSelect={setSelectedRodada}
                  onGerarResultado={handleGerarResultado}
                  onEncerrarRodada={handleEncerrarRodada}
                  onDeletarRodada={handleDeletarRodada}
                />
              ))}
              {filteredRodadas.filter(r => r.status === 'encerrada').length === 0 && (
                <Card className="p-8 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma rodada encerrada</h3>
                  <p className="text-gray-600">Rodadas encerradas aparecerão aqui para consulta histórica.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Modal de detalhes da rodada */}
          {selectedRodada && (
            <RodadaDetailsModal 
              rodada={selectedRodada} 
              onClose={() => setSelectedRodada(null)}
              onToggleResultAccess={handleToggleResultAccess}
            />
          )}

          {/* Modal de Report View */}
          {showReportView && selectedResultado && (
            <Dialog open={showReportView} onOpenChange={setShowReportView}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <ReportView 
                  resultado={selectedResultado}
                  rodadaInfo={selectedResultado.rodadaInfo}
                />
              </DialogContent>
            </Dialog>
          )}
            </>
          )}
        </div>
      </div>
    </QualityScoreLayout>
  );
}

function RodadaCard({ 
  rodada, 
  onSelect, 
  onGerarResultado, 
  onEncerrarRodada,
  onDeletarRodada,
  onVerResultados 
}: { 
  rodada: Rodada; 
  onSelect: (rodada: Rodada) => void;
  onGerarResultado: (id: string) => void;
  onEncerrarRodada: (id: string) => void;
  onDeletarRodada: (id: string) => void;
  onVerResultados?: (id: string) => void;
}) {
  const podeGerar = rodada.status === 'ativa' && 
    (rodada.criterioEncerramento === 'manual' || 
     rodada.respostasCompletas === rodada.totalParticipantes);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{rodada.companyName}</h3>
            <Badge className={getRodadaStatusColor(rodada.status)}>
              {rodada.status === 'ativa' ? 'Ativa' : rodada.status === 'encerrada' ? 'Encerrada' : 'Rascunho'}
            </Badge>
            <Badge variant="outline">{rodada.versaoId}</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Criada em {new Date(rodada.createdDate).toLocaleDateString('pt-BR')} • 
            Prazo: {new Date(rodada.dueDate).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Critério: {rodada.criterioEncerramento === 'automatico' ? 'Encerramento automático' : 'Encerramento manual'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rodada.status === 'ativa' && podeGerar && (
            <Button 
              size="sm" 
              onClick={() => onGerarResultado(rodada.id)}
              className={
                rodada.respostasCompletas < rodada.totalParticipantes
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {rodada.respostasCompletas < rodada.totalParticipantes
                ? 'Gerar Resultados Parciais'
                : 'Gerar Resultados Finais'
              }
            </Button>
          )}
          {rodada.status === 'ativa' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEncerrarRodada(rodada.id)}
            >
              <Square className="h-4 w-4 mr-2" />
              Encerrar
            </Button>
          )}
          {rodada.resultadoGerado && onVerResultados && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onVerResultados(rodada.id)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Resultados
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDeletarRodada(rodada.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSelect(rodada)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Estatísticas da rodada */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">{rodada.totalParticipantes}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-green-600">{rodada.respostasCompletas}</div>
          <div className="text-xs text-gray-600">Concluídas</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-blue-600">{rodada.respostasEmProgresso}</div>
          <div className="text-xs text-gray-600">Em Progresso</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600">{rodada.respostasPendentes}</div>
          <div className="text-xs text-gray-600">Pendentes</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-purple-600">
            {rodada.participantes.filter(p => p.canViewResults).length}
          </div>
          <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
            <Eye className="h-3 w-3" />
            Com Acesso
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
          <span className="text-sm text-gray-600">{rodada.progressoGeral}%</span>
        </div>
        <Progress value={rodada.progressoGeral} className="h-2" />
      </div>
    </Card>
  );
}

function RodadaDetailsModal({ 
  rodada, 
  onClose, 
  onToggleResultAccess 
}: { 
  rodada: Rodada; 
  onClose: () => void;
  onToggleResultAccess: (rodadaId: string, participanteId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredParticipantes = rodada.participantes.filter(participante => {
    const matchesSearch = participante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participante.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || participante.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (participanteId: string) => {
    console.log('Enviando lembrete para:', participanteId);
    // Implementar lógica de envio de lembrete
  };

  const handleInviteNewMember = () => {
    setShowInviteModal(true);
  };

  const handleAllowAllResults = () => {
    console.log('Permitindo todos verem resultados da rodada:', rodada.id);
    // Aqui seria implementada a lógica para permitir todos verem os resultados
    // Por enquanto apenas log para demonstrar a funcionalidade
  };

  const handleRestrictAllResults = () => {
    console.log('Restringindo todos os resultados da rodada:', rodada.id);
    // Aqui seria implementada a lógica para restringir todos os resultados
    // Por enquanto apenas log para demonstrar a funcionalidade
  };

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{rodada.companyName}</h2>
              <p className="text-gray-600">{rodada.versaoId} • {rodada.totalParticipantes} participantes</p>
              <p className="text-sm text-gray-500 mt-1">
                Criada em {new Date(rodada.createdDate).toLocaleDateString('pt-BR')} • 
                Prazo: {new Date(rodada.dueDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {rodada.status === 'ativa' && (
                <Button variant="outline" onClick={handleInviteNewMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Convidar Membro
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Estatísticas gerais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Membros</p>
                    <p className="text-xl font-semibold">{rodada.totalParticipantes}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Respostas Completas</p>
                    <p className="text-xl font-semibold">{rodada.respostasCompletas}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Em Progresso</p>
                    <p className="text-xl font-semibold">{rodada.respostasEmProgresso}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendentes/Atrasados</p>
                    <p className="text-xl font-semibold">{rodada.respostasPendentes + rodada.participantes.filter(p => p.status === 'atrasado').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Barra de progresso geral */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso Geral da Rodada</span>
                <span className="text-sm text-gray-600">{rodada.progressoGeral}%</span>
              </div>
              <Progress value={rodada.progressoGeral} className="h-3" />
            </Card>

            {/* Filtros e busca */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="respondendo">Respondendo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Lista detalhada de participantes */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Membros da Rodada ({filteredParticipantes.length})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Gerencie quem pode visualizar os resultados após a conclusão da rodada
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium text-green-600">
                          {rodada.participantes.filter(p => p.canViewResults).length}
                        </span> com acesso aos resultados
                      </p>
                      <p className="text-gray-500 text-xs">
                        de {rodada.participantes.length} participantes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAllowAllResults}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Permitir Todos
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Permitir que todos os participantes vejam os resultados</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRestrictAllResults}
                            className="text-xs"
                          >
                            <EyeOff className="h-3 w-3 mr-1" />
                            Restringir Todos
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Restringir o acesso aos resultados para todos os participantes</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredParticipantes.map((participante) => (
                  <motion.div
                    key={participante.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                            {participante.initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">{participante.name}</h4>
                          <p className="text-sm text-gray-600">{participante.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{participante.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(participante.status)}
                          <Badge className={getStatusColor(participante.status)}>
                            {getStatusLabel(participante.status)}
                          </Badge>
                        </div>

                        {/* Progresso */}
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Progresso</span>
                            <span className="text-xs text-gray-600">{participante.progress}%</span>
                          </div>
                          <Progress value={participante.progress} className="h-2" />
                        </div>

                        {/* Última atividade ou data de conclusão */}
                        <div className="text-right min-w-[120px]">
                          {participante.status === 'concluido' && participante.completedDate ? (
                            <div>
                              <p className="text-xs text-gray-500">Concluído em</p>
                              <p className="text-sm text-gray-900">
                                {new Date(participante.completedDate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          ) : participante.lastActivity ? (
                            <div>
                              <p className="text-xs text-gray-500">Última atividade</p>
                              <p className="text-sm text-gray-900">
                                {new Date(participante.lastActivity).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-gray-500">Não iniciado</p>
                            </div>
                          )}
                        </div>

                        {/* Controle de Acesso aos Resultados */}
                        <div className="flex flex-col items-end gap-2 min-w-[160px]">
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-2 mb-1">
                                <p className="text-xs text-gray-600 font-medium">
                                  Acesso aos Resultados
                                </p>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Settings className="h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-48">
                                      Controle se este participante poderá visualizar os resultados da rodada após o encerramento
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              
                              <div className="flex items-center justify-end gap-2">
                                <div className="flex items-center gap-1">
                                  {participante.canViewResults ? (
                                    <>
                                      <Eye className="h-3 w-3 text-green-600" />
                                      <span className="text-xs text-green-600 font-medium">Permitido</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">Restrito</span>
                                    </>
                                  )}
                                </div>
                                <Switch 
                                  checked={participante.canViewResults}
                                  onCheckedChange={() => onToggleResultAccess(rodada.id, participante.id)}
                                  className="ml-2"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Ações Secundárias */}
                          <div className="flex items-center gap-1 mt-1">
                            {participante.status !== 'concluido' && rodada.status === 'ativa' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendReminder(participante.id)}
                                    className="flex items-center gap-1 text-xs px-2 py-1 h-7"
                                  >
                                    <Mail className="h-3 w-3" />
                                    Lembrete
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Enviar lembrete por email para concluir a avaliação</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Modal de convite (placeholder) */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Convidar Novo Membro</h3>
              <div className="space-y-4">
                <Input placeholder="Email do membro" />
                <Input placeholder="Nome completo" />
                <Input placeholder="Cargo/Função" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowInviteModal(false)}>
                  Enviar Convite
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// Removido - NovaRodadaForm agora está em arquivo separado

function NovaRodadaFormOLD_DEPRECATED({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    companyId: isManager ? '' : user?.companyId || '',
    companyName: isManager ? '' : user?.companyName || '',
    dueDate: '',
    criterioEncerramento: 'automatico',
    allowPartialResults: false
  });

  const [participantes, setParticipantes] = useState<ParticipanteForm[]>([
    { name: '', email: '', role: '' }
  ]);

  const addParticipante = () => {
    setParticipantes([...participantes, { name: '', email: '', role: '' }]);
  };

  const removeParticipante = (index: number) => {
    if (participantes.length > 1) {
      setParticipantes(participantes.filter((_, i) => i !== index));
    }
  };

  const updateParticipante = (index: number, field: keyof ParticipanteForm, value: string) => {
    const updated = [...participantes];
    updated[index][field] = value;
    setParticipantes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Parsear emails dos participantes
      const emails = formData.participantes
        .split('\n')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      if (emails.length === 0) {
        toast.error('Adicione pelo menos um participante');
        setIsSubmitting(false);
        return;
      }

      // Chamar API para criar rodada
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          company_id: formData.companyId,
          due_date: formData.dueDate,
          criterio_encerramento: formData.criterioEncerramento,
          created_by: user?.id,
          participantes: emails.map(email => ({ email })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar rodada');
      }

      toast.success('Rodada criada com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating rodada:', error);
      toast.error(error.message || 'Erro ao criar rodada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    const company = EMPRESAS_DISPONIVEIS.find(c => c.id === companyId);
    setFormData(prev => ({ 
      ...prev, 
      companyId: companyId,
      companyName: company?.name || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isManager ? 'Selecionar Empresa' : 'Empresa/Equipe'}
        </label>
        {isManager ? (
          <Select value={formData.companyId} onValueChange={handleCompanySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {EMPRESAS_DISPONIVEIS.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.name} • {empresa.sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={formData.companyName}
            disabled
            className="bg-gray-50"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Limite
        </label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Critério de Encerramento
        </label>
        <Select 
          value={formData.criterioEncerramento}
          onValueChange={(value) => setFormData(prev => ({ ...prev, criterioEncerramento: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatico">Automático (quando todos responderem)</SelectItem>
            <SelectItem value="manual">Manual (quando eu decidir)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Permitir resultados parciais
        </label>
        <Switch 
          checked={formData.allowPartialResults}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowPartialResults: checked }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participantes (emails separados por linha)
        </label>
        <Textarea
          placeholder="email1@empresa.com&#10;email2@empresa.com&#10;email3@empresa.com"
          value={formData.participantes}
          onChange={(e) => setFormData(prev => ({ ...prev, participantes: e.target.value }))}
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Rodada'}
        </Button>
      </div>
    </form>
  );
}

function ParticipanteView() {
  // View simplificada para participantes que não podem gerenciar rodadas
  return (
    <QualityScoreLayout 
      currentSection="qualityscore-progresso" 
      title="Minhas Avaliações"
      description="Suas avaliações pendentes e concluídas"
    >
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Área do Participante
            </h3>
            <p className="text-gray-600 mb-4">
              Você receberá convites por email para participar das avaliações.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com seu líder para mais informações sobre avaliações pendentes.
            </p>
          </Card>
        </div>
      </div>
    </QualityScoreLayout>
  );
}