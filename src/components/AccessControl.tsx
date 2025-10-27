import React from 'react';
import { useAuth, UserRole } from './AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Lock } from 'lucide-react';

interface AccessControlProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  hideIfNoAccess?: boolean;
}

export function AccessControl({ 
  children, 
  requiredRole, 
  requiredPermissions = [], 
  fallback,
  hideIfNoAccess = false 
}: AccessControlProps) {
  const { user } = useAuth();

  if (!user) {
    if (hideIfNoAccess) return null;
    return fallback || (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar logado para acessar este conteúdo.
        </AlertDescription>
      </Alert>
    );
  }

  // Verificar role se especificado
  if (requiredRole) {
    const roleHierarchy = { 'member': 1, 'leader': 2, 'manager': 3 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];
    
    if (userLevel < requiredLevel) {
      if (hideIfNoAccess) return null;
      return fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar este conteúdo. Nível de acesso necessário: {requiredRole}.
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Verificar permissões específicas
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => {
      return (user.permissions as any)[permission] === true;
    });

    if (!hasAllPermissions) {
      if (hideIfNoAccess) return null;
      return fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem as permissões necessárias para acessar este conteúdo.
          </AlertDescription>
        </Alert>
      );
    }
  }

  return <>{children}</>;
}

// Hook para verificar permissões em componentes
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    const roleHierarchy = { 'member': 1, 'leader': 2, 'manager': 3 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[role];
    return userLevel >= requiredLevel;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return (user.permissions as any)[permission] === true;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => (user.permissions as any)[permission] === true);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => (user.permissions as any)[permission] === true);
  };

  return {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isManager: hasRole('manager'),
    isLeader: hasRole('leader'),
    isMember: user?.role === 'member',
    canViewAllCompanies: hasPermission('canViewAllCompanies'),
    canImportData: hasPermission('canImportData'),
    canViewResults: hasPermission('canViewResults'),
    canInviteMembers: hasPermission('canInviteMembers'),
    canEditMemberPermissions: hasPermission('canEditMemberPermissions'),
    canViewProgress: hasPermission('canViewProgress'),
  };
}