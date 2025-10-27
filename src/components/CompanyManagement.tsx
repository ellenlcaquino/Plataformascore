import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { AccessControl, usePermissions } from './AccessControl';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Building, Plus, Users, Mail, Settings, UserCheck, UserX, Calendar } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  status: 'active' | 'invited' | 'inactive';
  canViewResults: boolean;
  joinedAt?: string;
  lastActive?: string;
}

// Mock data - em produção viria do Supabase
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '2',
    name: 'João Silva',
    email: 'leader@empresa1.com',
    role: 'leader',
    status: 'active',
    canViewResults: true,
    joinedAt: '2024-01-15',
    lastActive: '2024-08-29'
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'membro1@empresa1.com',
    role: 'member',
    status: 'active',
    canViewResults: true,
    joinedAt: '2024-01-20',
    lastActive: '2024-08-28'
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'membro2@empresa1.com',
    role: 'member',
    status: 'active',
    canViewResults: false,
    joinedAt: '2024-02-01',
    lastActive: '2024-08-27'
  },
  {
    id: '6',
    name: 'Ana Oliveira',
    email: 'ana@empresa1.com',
    role: 'member',
    status: 'invited',
    canViewResults: true,
    joinedAt: undefined,
    lastActive: undefined
  }
];

export function CompanyManagement() {
  const { user, companies } = useAuth();
  const permissions = usePermissions();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [editMemberDialog, setEditMemberDialog] = useState<TeamMember | null>(null);
  
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    canViewResults: true
  });

  // Se for manager, mostrar todas as empresas. Se for leader, apenas sua empresa
  const availableCompanies = permissions.isManager 
    ? companies 
    : companies.filter(c => c.id === user?.companyId);

  const currentCompany = selectedCompany || user?.companyId || '';
  const currentCompanyData = companies.find(c => c.id === currentCompany);

  const handleInviteMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteForm.name,
      email: inviteForm.email,
      role: 'member',
      status: 'invited',
      canViewResults: inviteForm.canViewResults,
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setInviteDialog(false);
    setInviteForm({ email: '', name: '', canViewResults: true });
  };

  const handleEditMember = (member: TeamMember) => {
    setEditMemberDialog(member);
  };

  const handleUpdateMemberPermissions = () => {
    if (!editMemberDialog) return;
    
    setTeamMembers(teamMembers.map(m => 
      m.id === editMemberDialog.id ? editMemberDialog : m
    ));
    setEditMemberDialog(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>;
      case 'invited':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Convidado</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!permissions.canInviteMembers && !permissions.canViewAllCompanies) {
    return (
      <div className="p-6">
        <AccessControl requiredPermissions={['canInviteMembers']}>
          <div>Conteúdo não disponível</div>
        </AccessControl>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Empresas</h1>
          <p className="text-gray-600 mt-1">
            {permissions.isManager ? 
              'Gerencie todas as empresas e suas equipes' : 
              'Gerencie sua equipe e convites'}
          </p>
        </div>

        <AccessControl requiredPermissions={['canInviteMembers']}>
          <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Convidar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Membro</DialogTitle>
                <DialogDescription>
                  Convide um novo membro para sua equipe. Você pode definir se ele terá acesso aos resultados.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-name">Nome</Label>
                  <Input
                    id="invite-name"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Pode visualizar resultados</Label>
                    <p className="text-sm text-gray-500">
                      Permite que o membro veja os resultados das avaliações
                    </p>
                  </div>
                  <Switch
                    checked={inviteForm.canViewResults}
                    onCheckedChange={(checked) => setInviteForm(prev => ({ ...prev, canViewResults: checked }))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleInviteMember}>
                  Enviar Convite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </AccessControl>
      </div>

      {/* Seleção de empresa (apenas para managers) */}
      <AccessControl requiredPermissions={['canViewAllCompanies']} hideIfNoAccess>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selecionar Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {availableCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </AccessControl>

      {/* Informações da empresa atual */}
      {currentCompanyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {currentCompanyData.name}
            </CardTitle>
            <CardDescription>
              Empresa criada em {formatDate(currentCompanyData.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">{teamMembers.filter(m => m.status === 'active').length}</div>
                  <div className="text-sm text-gray-600">Membros Ativos</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Mail className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium">{teamMembers.filter(m => m.status === 'invited').length}</div>
                  <div className="text-sm text-gray-600">Convites Pendentes</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{teamMembers.filter(m => m.canViewResults).length}</div>
                  <div className="text-sm text-gray-600">Com Acesso aos Resultados</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de membros da equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipe
          </CardTitle>
          <CardDescription>
            Gerencie os membros da sua equipe e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resultados</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'leader' ? 'default' : 'secondary'}>
                      {member.role === 'leader' ? 'Líder' : 'Membro'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>
                    {member.canViewResults ? (
                      <UserCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <UserX className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(member.lastActive)}</TableCell>
                  <TableCell>
                    <AccessControl requiredPermissions={['canEditMemberPermissions']} hideIfNoAccess>
                      {member.role === 'member' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMember(member)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </AccessControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para editar permissões do membro */}
      <Dialog 
        open={!!editMemberDialog} 
        onOpenChange={(open) => !open && setEditMemberDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissões</DialogTitle>
            <DialogDescription>
              Gerencie as permissões de {editMemberDialog?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editMemberDialog && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Pode visualizar resultados</Label>
                  <p className="text-sm text-gray-500">
                    Permite que o membro veja os resultados das avaliações
                  </p>
                </div>
                <Switch
                  checked={editMemberDialog.canViewResults}
                  onCheckedChange={(checked) => 
                    setEditMemberDialog(prev => prev ? { ...prev, canViewResults: checked } : null)
                  }
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateMemberPermissions}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}