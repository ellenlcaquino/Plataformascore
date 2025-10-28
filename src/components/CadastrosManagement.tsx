import React, { useState } from 'react';
import { Plus, Building, Users, Search, Filter, MoreHorizontal, Edit2, Trash2, Eye, EyeOff, UserCheck, UserX } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useCompany, CompanyData } from './CompanyContext';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useUsersDB } from '../hooks/useUsersDB';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'leader' | 'member';
  companyId: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  hasLoggedIn: boolean; // Indica se já fez login alguma vez
  createdAt: string;
  addedViaRodada?: boolean; // Indica se foi adicionado via rodada
  invitedBy?: string; // Quem convidou (para membros adicionados via rodada)
}

// Mock data - Expandido para incluir usuários da TechCorp e exemplos de diferentes status
const MOCK_ADMIN_USERS: AdminUser[] = [
  // TechCorp Brasil - Leaders
  {
    id: '2',
    email: 'joao.silva@techcorp.com.br',
    name: 'João Silva',
    role: 'leader',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    lastLogin: '2024-03-15',
    hasLoggedIn: true,
    createdAt: '2024-01-15'
  },
  {
    id: '5',
    email: 'ana.rodrigues@techcorp.com.br',
    name: 'Ana Rodrigues',
    role: 'leader',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    lastLogin: '2024-03-14',
    hasLoggedIn: true,
    createdAt: '2024-01-20'
  },
  
  // TechCorp Brasil - Members ativos que já logaram
  {
    id: '3',
    email: 'maria.santos@techcorp.com.br',
    name: 'Maria Santos',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    lastLogin: '2024-03-15',
    hasLoggedIn: true,
    createdAt: '2024-01-18',
    addedViaRodada: false
  },
  {
    id: '4',
    email: 'pedro.oliveira@techcorp.com.br',
    name: 'Pedro Oliveira',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    lastLogin: '2024-03-14',
    hasLoggedIn: true,
    createdAt: '2024-01-22',
    addedViaRodada: true,
    invitedBy: 'João Silva'
  },
  
  // TechCorp Brasil - Members convidados via rodada que NUNCA logaram
  {
    id: '6',
    email: 'carlos.mendes@techcorp.com.br',
    name: 'Carlos Mendes',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    hasLoggedIn: false,
    createdAt: '2024-02-01',
    addedViaRodada: true,
    invitedBy: 'João Silva'
  },
  {
    id: '7',
    email: 'fernanda.costa@techcorp.com.br',
    name: 'Fernanda Costa',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    hasLoggedIn: false,
    createdAt: '2024-02-05',
    addedViaRodada: true,
    invitedBy: 'Ana Rodrigues'
  },
  {
    id: '8',
    email: 'ricardo.alves@techcorp.com.br',
    name: 'Ricardo Alves',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    hasLoggedIn: false,
    createdAt: '2024-02-10',
    addedViaRodada: true,
    invitedBy: 'João Silva'
  },
  
  // TechCorp Brasil - Member inativo
  {
    id: '9',
    email: 'julia.ferreira@techcorp.com.br',
    name: 'Julia Ferreira',
    role: 'member',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'inactive',
    lastLogin: '2024-01-30',
    hasLoggedIn: true,
    createdAt: '2024-01-16'
  },
  
  // InnovateTech Solutions - Para comparação (outro líder)
  {
    id: '10',
    email: 'marcos.dev@innovatetech.com',
    name: 'Marcos Developer',
    role: 'leader',
    companyId: 'comp2',
    companyName: 'InnovateTech Solutions',
    status: 'active',
    lastLogin: '2024-03-13',
    hasLoggedIn: true,
    createdAt: '2024-02-20'
  },
  {
    id: '11',
    email: 'lucia.santos@innovatetech.com',
    name: 'Lúcia Santos',
    role: 'member',
    companyId: 'comp2',
    companyName: 'InnovateTech Solutions',
    status: 'active',
    hasLoggedIn: false,
    createdAt: '2024-02-25',
    addedViaRodada: true,
    invitedBy: 'Marcos Developer'
  }
];

export function CadastrosManagement() {
  const { user } = useAuth();
  const { users: dbUsers, loading: loadingUsers, fetchUsers } = useUsersDB();
  // Manager inicia em 'empresas', Leaders/Members não têm essa tab (vão direto para lista de usuários)
  const [activeTab, setActiveTab] = useState(user?.role === 'manager' ? 'empresas' : 'empresas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const { availableCompanies } = useCompany();

  // Estados do formulário de empresa
  const [companyForm, setCompanyForm] = useState({
    name: '',
    domain: '',
    primaryColor: '#2563eb',
    status: 'active' as 'active' | 'inactive'
  });

  // Estados do formulário de usuário
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'leader' as 'leader' | 'member',
    companyId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleEditCompany = (company: CompanyData) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name,
      domain: company.domain,
      primaryColor: company.primaryColor || '#2563eb',
      status: company.status
    });
    setShowCompanyDialog(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      status: user.status
    });
    setShowUserDialog(true);
  };

  const handleNewCompany = () => {
    setEditingCompany(null);
    setCompanyForm({
      name: '',
      domain: '',
      primaryColor: '#2563eb',
      status: 'active'
    });
    setShowCompanyDialog(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'leader',
      companyId: '',
      status: 'active'
    });
    setShowUserDialog(true);
  };

  const handleSaveCompany = async () => {
    try {
      const endpoint = editingCompany 
        ? `/companies/${editingCompany.id}` 
        : '/companies';
      
      const method = editingCompany ? 'PUT' : 'POST';
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b631963${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...companyForm,
          leader_id: user?.id, // Definir o usuário atual como leader
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar empresa');
      }

      toast.success(editingCompany ? 'Empresa atualizada!' : 'Empresa criada!');
      setShowCompanyDialog(false);
      // Recarregar dados
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving company:', error);
      toast.error(error.message || 'Erro ao salvar empresa');
    }
  };

  const handleSaveUser = async () => {
    try {
      const endpoint = editingUser 
        ? `/users/${editingUser.id}` 
        : '/users';
      
      const method = editingUser ? 'PUT' : 'POST';

      // Se for Leader criando usuário, usar sua companyId
      const finalCompanyId = user?.role === 'leader' 
        ? user.companyId 
        : userForm.companyId;

      const finalCompanyName = user?.role === 'leader'
        ? user.companyName
        : availableCompanies.find(c => c.id === userForm.companyId)?.name || '';
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b631963${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...userForm,
          companyId: finalCompanyId,
          companyName: finalCompanyName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar usuário');
      }

      toast.success(editingUser ? 'Usuário atualizado!' : 'Usuário criado!');
      setShowUserDialog(false);
      // Recarregar dados do banco
      await fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Erro ao salvar usuário');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Filtrar empresas baseado no role do usuário
  const filteredCompanies = availableCompanies.filter(company => {
    // Manager vê todas as empresas
    if (user?.role === 'manager') {
      return company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Leader vê apenas sua empresa
    if (user?.role === 'leader') {
      return company.id === user.companyId &&
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Member vê apenas sua empresa (read-only)
    return company.id === user?.companyId &&
      (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Converter users do banco para o formato AdminUser
  const adminUsers: AdminUser[] = dbUsers.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role === 'manager' ? 'leader' : u.role, // Converter manager para leader se necessário
    companyId: u.companyId,
    companyName: u.companyName,
    status: 'active' as 'active' | 'inactive', // Por enquanto todos ativos
    lastLogin: undefined,
    hasLoggedIn: u.hasLoggedIn,
    createdAt: u.createdAt,
    addedViaRodada: u.addedViaRodada,
    invitedBy: u.invitedBy || undefined,
  }));

  // Filtrar usuários baseado no role do usuário logado
  const filteredUsers = adminUsers.filter(userItem => {
    // Manager vê todos os usuários
    if (user?.role === 'manager') {
      return userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Leader vê apenas usuários de sua empresa
    if (user?.role === 'leader') {
      return userItem.companyId === user.companyId &&
        (userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userItem.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Member vê apenas usuários de sua empresa (read-only)
    return userItem.companyId === user?.companyId &&
      (userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.role === 'manager' ? 'Cadastros' : 'Membros da Equipe'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.role === 'manager' 
                ? 'Gerencie empresas e usuários do sistema'
                : user?.role === 'leader'
                ? `Gerencie os membros da ${user.companyName}`
                : `Visualize os membros da ${user?.companyName}`
              }
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab List - apenas Manager vê tab Empresas */}
          {user?.role === 'manager' ? (
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="empresas" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Empresas
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
            </TabsList>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-fit">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Membros da Equipe</span>
            </div>
          )}

          {/* Tab Empresas - Apenas para Manager */}
          {user?.role === 'manager' && (
            <TabsContent value="empresas" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Empresas Cadastradas</CardTitle>
                      <CardDescription>
                        Gerencie as empresas que utilizam a plataforma QualityMap App
                      </CardDescription>
                    </div>
                    <Button onClick={handleNewCompany} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Empresa
                    </Button>
                  </div>
                </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar empresas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Domínio</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                              style={{ backgroundColor: company.primaryColor }}
                            >
                              {getInitials(company.name)}
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {company.domain}
                        </TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status === 'active' ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Tab Usuários - Todos veem */}
          <TabsContent value={user?.role === 'manager' ? 'usuarios' : 'empresas'} className="space-y-4">
            {/* Card de Estatísticas para Leaders */}
            {user?.role === 'leader' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{filteredUsers.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Já logaram</p>
                        <p className="text-2xl font-bold text-green-600">
                          {filteredUsers.filter(u => u.hasLoggedIn).length}
                        </p>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Nunca logaram</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {filteredUsers.filter(u => !u.hasLoggedIn).length}
                        </p>
                      </div>
                      <UserX className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Via Rodada</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {filteredUsers.filter(u => u.addedViaRodada).length}
                        </p>
                      </div>
                      <Badge className="h-8 px-3 bg-blue-600">R</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Alerta informativo para Leaders */}
            {user?.role === 'leader' && filteredUsers.filter(u => u.addedViaRodada).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    i
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Membros Adicionados via Rodadas
                  </h3>
                  <p className="text-sm text-blue-700">
                    Quando você adiciona participantes em uma rodada, eles aparecem automaticamente nesta lista. 
                    Use o badge <Badge variant="outline" className="text-xs mx-1">Rodada</Badge> para identificar quem foi convidado e o status 
                    <Badge variant="outline" className="text-xs mx-1 text-orange-600 border-orange-300">
                      <UserX className="h-3 w-3 inline mr-1" />
                      Nunca logou
                    </Badge> para ver quem ainda não acessou o sistema.
                  </p>
                </div>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {user?.role === 'manager' 
                        ? 'Usuários do Sistema' 
                        : 'Membros da Equipe'
                      }
                    </CardTitle>
                    <CardDescription>
                      {user?.role === 'manager'
                        ? 'Gerencie todos os usuários (líderes e membros) de todas as empresas'
                        : user?.role === 'leader'
                        ? 'Gerencie os membros da sua equipe. Usuários adicionados em rodadas aparecem aqui automaticamente.'
                        : 'Visualize os membros da sua equipe'
                      }
                    </CardDescription>
                  </div>
                  {(user?.role === 'manager' || user?.role === 'leader') && (
                    <Button onClick={handleNewUser} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {user?.role === 'manager' ? 'Novo Usuário' : 'Adicionar Membro'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      {user?.role === 'manager' && <TableHead>Empresa</TableHead>}
                      <TableHead>Papel</TableHead>
                      <TableHead>Status Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={user?.role === 'manager' ? 7 : 6} className="text-center py-8 text-muted-foreground">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(userItem.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {userItem.name}
                                  {userItem.addedViaRodada && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Badge variant="outline" className="text-xs">
                                            Rodada
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Adicionado via rodada por {userItem.invitedBy}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{userItem.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          {user?.role === 'manager' && (
                            <TableCell className="text-muted-foreground">
                              {userItem.companyName}
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge variant={userItem.role === 'leader' ? 'default' : 'secondary'}>
                              {userItem.role === 'leader' ? 'Líder' : 'Membro'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {userItem.hasLoggedIn ? (
                                    <Badge variant="default" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
                                      <UserCheck className="h-3 w-3" />
                                      Logou
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-300">
                                      <UserX className="h-3 w-3" />
                                      Nunca logou
                                    </Badge>
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {userItem.hasLoggedIn 
                                      ? `Fez login pela primeira vez em ${new Date(userItem.createdAt).toLocaleDateString('pt-BR')}`
                                      : `Convidado em ${new Date(userItem.createdAt).toLocaleDateString('pt-BR')} mas ainda não acessou o sistema`
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <Badge variant={userItem.status === 'active' ? 'default' : 'secondary'}>
                              {userItem.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString('pt-BR') : '-'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditUser(userItem)}>
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {userItem.status === 'active' ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Desativar
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ativar
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Empresa */}
        <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
              </DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Modifique os dados da empresa.' : 'Cadastre uma nova empresa no sistema.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: TechCorp Brasil"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-domain">Domínio</Label>
                <Input
                  id="company-domain"
                  value={companyForm.domain}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="Ex: techcorp.com.br"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-color">Cor Principal</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="company-color"
                    value={companyForm.primaryColor}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-input"
                  />
                  <Input
                    value={companyForm.primaryColor}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="company-status"
                  checked={companyForm.status === 'active'}
                  onCheckedChange={(checked) => 
                    setCompanyForm(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                  }
                />
                <Label htmlFor="company-status">Empresa ativa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveCompany}>
                {editingCompany ? 'Salvar alterações' : 'Criar empresa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Usuário */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Modifique os dados do usuário.' : 'Cadastre um novo usuário administrativo.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user-name">Nome Completo</Label>
                <Input
                  id="user-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Ex: joao@techcorp.com.br"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-company">Empresa</Label>
                <Select value={userForm.companyId} onValueChange={(value) => setUserForm(prev => ({ ...prev, companyId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-role">Papel</Label>
                <Select value={userForm.role} onValueChange={(value: 'leader' | 'member') => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leader">Líder da Empresa</SelectItem>
                    <SelectItem value="member">Membro da Equipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="user-status"
                  checked={userForm.status === 'active'}
                  onCheckedChange={(checked) => 
                    setUserForm(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                  }
                />
                <Label htmlFor="user-status">Usuário ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveUser}>
                {editingUser ? 'Salvar alterações' : 'Criar usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}