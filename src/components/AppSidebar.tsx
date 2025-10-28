import React from 'react';
import { FileText, BarChart3, Upload, Home, LogOut, TrendingUp, Users, Database, ExternalLink } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar';
import { useAuth } from './AuthContext';
import { AccessControl, usePermissions } from './AccessControl';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { QualityMapAppLogo } from './QualityMapAppLogo';
import { CompanySelector } from './CompanySelector';

// Menu de Áreas Principais
const getMainMenuItems = (permissions: any) => [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: Home,
    show: true,
  },
  {
    title: 'Cadastros',
    url: 'personas',
    icon: Database,
    show: true, // Todos podem ver cadastros
  },
];

// Submenus do QualityScore
const getQualityScoreMenuItems = (permissions: any) => [
  {
    title: 'Formulário',
    url: 'qualityscore-formulario',
    icon: FileText,
    show: true,
  },
  {
    title: 'Rodadas',
    url: 'qualityscore-progresso',
    icon: TrendingUp,
    show: permissions.canViewProgress, // Permissão baseada em roles
  },
  {
    title: 'Resultados',
    url: 'qualityscore-resultados',
    icon: BarChart3,
    show: permissions.canViewResults,
  },
  {
    title: 'Importar',
    url: 'qualityscore-importar',
    icon: Upload,
    show: permissions.canImportData,
  },
  {
    title: 'Report View',
    url: 'public-demo',
    icon: ExternalLink,
    show: permissions.canInviteMembers, // Apenas para managers e leaders
  },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const permissions = usePermissions();
  const mainMenuItems = getMainMenuItems(permissions);
  const qualityScoreMenuItems = getQualityScoreMenuItems(permissions);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'System Manager';
      case 'leader': return 'Líder da Empresa';
      case 'member': return 'Membro da Equipe';
      default: return role;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <QualityMapAppLogo size="lg" showText={true} />
        </div>
      </SidebarHeader>
      
      {/* Seletor de Empresa para System Managers */}
      <CompanySelector />
      
      <SidebarContent className="p-4">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.filter(item => item.show).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.url)}
                    isActive={activeSection === item.url}
                    className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-accent/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="text-sm">{item.title}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* QualityScore Menu */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            QualityScore
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {qualityScoreMenuItems.filter(item => item.show).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.url)}
                    isActive={activeSection === item.url}
                    className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-accent/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="text-sm">{item.title}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="space-y-4">
          {/* Informações do usuário */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user && getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user && getRoleLabel(user.role)}</div>
              {user?.companyName && (
                <div className="text-xs text-muted-foreground truncate">{user.companyName}</div>
              )}
            </div>
          </div>

          {/* Botão de logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}