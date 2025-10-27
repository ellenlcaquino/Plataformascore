import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'manager' | 'leader' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  permissions: {
    canViewAllCompanies: boolean;
    canImportData: boolean;
    canViewResults: boolean;
    canInviteMembers: boolean;
    canEditMemberPermissions: boolean;
    canViewProgress: boolean;
  };
}

export interface Company {
  id: string;
  name: string;
  leaderId: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  companies: Company[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data simplificado - apenas 3 usuários, um de cada tipo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@qualitymap.app',
    name: 'System Manager',
    role: 'manager',
    permissions: {
      canViewAllCompanies: true,
      canImportData: true,
      canViewResults: true,
      canInviteMembers: true,
      canEditMemberPermissions: true,
      canViewProgress: true,
    }
  },
  {
    id: '2',
    email: 'leader@demo.com',
    name: 'Líder da Empresa',
    role: 'leader',
    companyId: 'demo',
    companyName: 'Demo Company',
    permissions: {
      canViewAllCompanies: false,
      canImportData: false,
      canViewResults: true,
      canInviteMembers: true,
      canEditMemberPermissions: true,
      canViewProgress: true,
    }
  },
  {
    id: '3',
    email: 'member@demo.com',
    name: 'Membro da Equipe',
    role: 'member',
    companyId: 'demo',
    companyName: 'Demo Company',
    permissions: {
      canViewAllCompanies: false,
      canImportData: false,
      canViewResults: true,
      canInviteMembers: false,
      canEditMemberPermissions: false,
      canViewProgress: false,
    }
  }
];

const MOCK_COMPANIES: Company[] = [
  {
    id: 'demo',
    name: 'Demo Company',
    leaderId: '2',
    createdAt: '2024-01-15'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [companies] = useState<Company[]>(MOCK_COMPANIES);

  useEffect(() => {
    // Simula verificação de auth ao carregar
    const storedUser = localStorage.getItem('qualitymap_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simula autenticação - em produção seria chamada ao Supabase
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser && password === 'demo123') {
      setUser(mockUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qualitymap_user');
  };

  const switchRole = (role: UserRole) => {
    // Encontrar um usuário com o role desejado
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(mockUser));
    }
  };

  const value: AuthContextType = {
    user,
    companies,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}