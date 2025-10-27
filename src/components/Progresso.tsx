import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, Avatar as AvatarComponent, AvatarFallback } from './ui/avatar';
import { AccessControl } from './AccessControl';
import { QualityScoreLayout } from './QualityScoreLayout';
import { useQualityScore } from './QualityScoreManager';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Copy,
  BarChart3,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  Mail
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  lastActivity?: string;
  completedDate?: string;
  initials: string;
}

interface TeamAssessment {
  id: string;
  teamName: string;
  createdDate: string;
  dueDate: string;
  totalMembers: number;
  completedResponses: number;
  inProgressResponses: number;
  pendingResponses: number;
  overallProgress: number;
  members: TeamMember[];
}

const mockTeamData: TeamAssessment = {
  id: 'team-001',
  teamName: 'Squad Frontend',
  createdDate: '2024-01-15',
  dueDate: '2024-02-15',
  totalMembers: 8,
  completedResponses: 3,
  inProgressResponses: 2,
  pendingResponses: 3,
  overallProgress: 45,
  members: [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      role: 'QA Lead',
      status: 'completed',
      progress: 100,
      completedDate: '2024-01-20',
      initials: 'AS'
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@empresa.com',
      role: 'QA Analyst',
      status: 'completed',
      progress: 100,
      completedDate: '2024-01-22',
      initials: 'CS'
    },
    {
      id: '3',
      name: 'Beatriz Costa',
      email: 'beatriz.costa@empresa.com',
      role: 'QA Engineer',
      status: 'completed',
      progress: 100,
      completedDate: '2024-01-25',
      initials: 'BC'
    },
    {
      id: '4',
      name: 'Daniel Oliveira',
      email: 'daniel.oliveira@empresa.com',
      role: 'QA Analyst',
      status: 'in-progress',
      progress: 65,
      lastActivity: '2024-01-26',
      initials: 'DO'
    },
    {
      id: '5',
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@empresa.com',
      role: 'QA Engineer',
      status: 'in-progress',
      progress: 32,
      lastActivity: '2024-01-24',
      initials: 'ER'
    },
    {
      id: '6',
      name: 'Felipe Martins',
      email: 'felipe.martins@empresa.com',
      role: 'QA Analyst',
      status: 'pending',
      progress: 0,
      initials: 'FM'
    },
    {
      id: '7',
      name: 'Gabriela Lima',
      email: 'gabriela.lima@empresa.com',
      role: 'QA Engineer',
      status: 'pending',
      progress: 0,
      initials: 'GL'
    },
    {
      id: '8',
      name: 'Hugo Ferreira',
      email: 'hugo.ferreira@empresa.com',
      role: 'QA Analyst',
      status: 'overdue',
      progress: 15,
      lastActivity: '2024-01-18',
      initials: 'HF'
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-gray-600" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'in-progress':
      return 'Em Progresso';
    case 'pending':
      return 'Pendente';
    case 'overdue':
      return 'Atrasado';
    default:
      return 'Pendente';
  }
};

export function Progresso() {
  return (
    <AccessControl requiredRole="leader">
      <ProgressoContent />
    </AccessControl>
  );
}

function ProgressoContent() {
  const [teamData] = useState<TeamAssessment>(mockTeamData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { qualityScores } = useQualityScore();

  const filteredMembers = teamData.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (memberId: string) => {
    console.log('Enviando lembrete para:', memberId);
    // Implementar lógica de envio de lembrete
  };

  const handleInviteNewMember = () => {
    setShowInviteModal(true);
  };

  return (
    <QualityScoreLayout 
      currentSection="qualityscore-progresso" 
      title="Progresso da Avaliação"
      description="Acompanhe o progresso das avaliações dos membros da equipe"
    >
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* QualityScores Disponíveis */}
        {qualityScores.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">QualityScores Criados ({qualityScores.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualityScores.map((qs) => (
                <Card key={qs.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{qs.companyName}</h3>
                      <p className="text-sm text-gray-600">V{qs.version} • {qs.companySector}</p>
                    </div>
                    <Badge variant="outline">
                      {qs.validUsers} respondentes
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Criado em:</span>
                      <span className="text-gray-900">{qs.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Resultados
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
        
        {/* Header com informações do time */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{teamData.teamName}</h1>
              <p className="text-gray-600 mt-1">
                Avaliação criada em {new Date(teamData.createdDate).toLocaleDateString('pt-BR')} • 
                Prazo: {new Date(teamData.dueDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleInviteNewMember}>
                <Plus className="h-4 w-4 mr-2" />
                Convidar Membro
              </Button>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Resultados
              </Button>
            </div>
          </div>

          {/* Estatísticas gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Membros</p>
                  <p className="text-xl font-semibold">{teamData.totalMembers}</p>
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
                  <p className="text-xl font-semibold">{teamData.completedResponses}</p>
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
                  <p className="text-xl font-semibold">{teamData.inProgressResponses}</p>
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
                  <p className="text-xl font-semibold">{teamData.pendingResponses + 1}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Barra de progresso geral */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral do Time</span>
              <span className="text-sm text-gray-600">{teamData.overallProgress}%</span>
            </div>
            <Progress value={teamData.overallProgress} className="h-3" />
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
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
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de membros */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Membros do Time ({filteredMembers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AvatarComponent className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {member.initials}
                      </AvatarFallback>
                    </AvatarComponent>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(member.status)}
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusLabel(member.status)}
                      </Badge>
                    </div>

                    {/* Progresso */}
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progresso</span>
                        <span className="text-xs text-gray-600">{member.progress}%</span>
                      </div>
                      <Progress value={member.progress} className="h-2" />
                    </div>

                    {/* Última atividade ou data de conclusão */}
                    <div className="text-right min-w-[120px]">
                      {member.status === 'completed' && member.completedDate ? (
                        <div>
                          <p className="text-xs text-gray-500">Concluído em</p>
                          <p className="text-sm text-gray-900">
                            {new Date(member.completedDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ) : member.lastActivity ? (
                        <div>
                          <p className="text-xs text-gray-500">Última atividade</p>
                          <p className="text-sm text-gray-900">
                            {new Date(member.lastActivity).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-500">Não iniciado</p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2">
                      {member.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendReminder(member.id)}
                          className="flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          Lembrete
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
    </QualityScoreLayout>
  );
}