import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User, LogOut, Settings, Shield, Building, ChevronDown } from 'lucide-react';

export function UserProfile() {
  const { user, logout } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  if (!user) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'System Manager';
      case 'leader': return 'Líder da Empresa';
      case 'member': return 'Membro da Equipe';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'leader': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'member': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <Badge variant="secondary" className={`text-xs mt-1 ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {user.companyName && (
          <>
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                {user.companyName}
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <div className="px-2 py-1.5">
          <div className="text-xs text-gray-500 mb-2">Permissões:</div>
          <div className="grid grid-cols-1 gap-1">
            {user.permissions.canViewAllCompanies && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                Visualizar todas empresas
              </div>
            )}
            {user.permissions.canImportData && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                Importar dados
              </div>
            )}
            {user.permissions.canViewResults && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                Visualizar resultados
              </div>
            )}
            {user.permissions.canInviteMembers && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                Convidar membros
              </div>
            )}
            {user.permissions.canEditMemberPermissions && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                Editar permissões
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}