import React, { useState } from 'react';
import { Plus, Building, Users, Search, Filter, MoreHorizontal, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
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
import { useCompany, CompanyData } from './CompanyContext';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'leader' | 'member';
  companyId: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

// Mock data
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '2',
    email: 'joao.silva@techcorp.com.br',
    name: 'João Silva',
    role: 'leader',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    status: 'active',
    lastLogin: '2024-03-15',
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
    createdAt: '2024-01-20'
  },
  {
    id: '10',
    email: 'marcos.dev@innovatetech.com',
    name: 'Marcos Developer',
    role: 'leader',
    companyId: 'comp2',
    companyName: 'InnovateTech Solutions',
    status: 'active',
    lastLogin: '2024-03-13',
    createdAt: '2024-02-20'
  }
];

export function CadastrosManagement() {
  const [activeTab, setActiveTab] = useState('empresas');
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

  const handleSaveCompany = () => {
    // Em produção, salvaria no Supabase
    console.log('Salvando empresa:', companyForm);
    setShowCompanyDialog(false);
  };

  const handleSaveUser = () => {
    // Em produção, salvaria no Supabase
    console.log('Salvando usuário:', userForm);
    setShowUserDialog(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredCompanies = availableCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = MOCK_ADMIN_USERS.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cadastros</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie empresas e usuários administrativos do sistema
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="empresas" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários Admins
            </TabsTrigger>
          </TabsList>

          {/* Tab Empresas */}
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

          {/* Tab Usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários Administrativos</CardTitle>
                    <CardDescription>
                      Gerencie líderes e administradores de cada empresa
                    </CardDescription>
                  </div>
                  <Button onClick={handleNewUser} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                  </Button>
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
                      <TableHead>Empresa</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.companyName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'leader' ? 'default' : 'secondary'}>
                            {user.role === 'leader' ? 'Líder' : 'Membro'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
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
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {user.status === 'active' ? (
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
                    ))}
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