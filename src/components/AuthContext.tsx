import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

export interface RegisterData {
  name: string;
  email: string;
  companyName: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  companies: Company[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
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
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    // Verificar auth ao carregar
    const initAuth = async () => {
      // Primeiro, garantir que usuários demo existem no servidor
      try {
        const seedResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/seed-demo-users`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (seedResponse.ok) {
          const seedData = await seedResponse.json();
          console.log('✅ Seed check completo:', seedData.message);
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível fazer seed dos usuários demo:', error);
      }

      const storedUser = localStorage.getItem('qualitymap_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Se for um usuário com UUID real, usar ele diretamente
          if (parsedUser.id && parsedUser.id.includes('-') && parsedUser.id.length > 20) {
            setUser(parsedUser);
          } else {
            // Usuário mock - tentar encontrar equivalente real no servidor
            console.log('🔄 Usuário mock detectado, tentando buscar equivalente real...');
            await syncUserWithServer(parsedUser);
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Sincronizar usuário mock com servidor
  const syncUserWithServer = async (mockUser: User) => {
    try {
      // Buscar usuário real por email
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/users`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários do servidor');
      }

      const { users: serverUsers } = await response.json();
      const realUser = serverUsers.find((u: any) => u.email === mockUser.email);

      if (realUser) {
        console.log('✅ Usuário real encontrado no servidor:', realUser.id);
        const updatedUser: User = {
          id: realUser.id, // UUID real
          email: realUser.email,
          name: realUser.name,
          role: realUser.role,
          companyId: realUser.companyId,
          companyName: realUser.companyName,
          permissions: mockUser.permissions // Manter permissões do mock por enquanto
        };
        setUser(updatedUser);
        localStorage.setItem('qualitymap_user', JSON.stringify(updatedUser));
      } else {
        console.log('⚠️ Usuário não encontrado no servidor, mantendo mock');
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error);
      setUser(mockUser);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Primeiro, verificar se existe usuário real no servidor
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/users`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const { users: serverUsers } = await response.json();
        const realUser = serverUsers.find((u: any) => u.email === email);

        if (realUser && password === 'demo123') {
          console.log('✅ Login com usuário real do servidor:', realUser.id);
          const loggedUser: User = {
            id: realUser.id, // UUID real
            email: realUser.email,
            name: realUser.name,
            role: realUser.role,
            companyId: realUser.companyId,
            companyName: realUser.companyName,
            permissions: {
              canViewAllCompanies: realUser.role === 'manager',
              canImportData: realUser.role === 'manager',
              canViewResults: true,
              canInviteMembers: realUser.role !== 'member',
              canEditMemberPermissions: realUser.role === 'leader',
              canViewProgress: realUser.role !== 'member',
            }
          };
          setUser(loggedUser);
          localStorage.setItem('qualitymap_user', JSON.stringify(loggedUser));
          return true;
        }
      }

      // Fallback para usuários mock
      const mockUser = users.find(u => u.email === email);
      if (mockUser && password === 'demo123') {
        console.log('⚠️ Login com usuário mock:', mockUser.id);
        setUser(mockUser);
        localStorage.setItem('qualitymap_user', JSON.stringify(mockUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Fallback para mock em caso de erro
      const mockUser = users.find(u => u.email === email);
      if (mockUser && password === 'demo123') {
        setUser(mockUser);
        localStorage.setItem('qualitymap_user', JSON.stringify(mockUser));
        return true;
      }
      
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Validar dados
      if (!data.name.trim() || data.name.trim().length < 2) {
        throw new Error('Nome inválido');
      }
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Email inválido');
      }
      if (!data.companyName.trim() || data.companyName.trim().length < 2) {
        throw new Error('Nome da empresa inválido');
      }
      if (!data.password || data.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      // Verificar se email já existe no servidor
      try {
        const usersResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/users`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (usersResponse.ok) {
          const { users: serverUsers } = await usersResponse.json();
          const emailExists = serverUsers.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
          if (emailExists) {
            throw new Error('Email já está em uso');
          }
        }
      } catch (error) {
        console.warn('Não foi possível verificar email no servidor, continuando...');
      }

      // Tentar criar no servidor primeiro
      let serverUser: any = null;
      let serverCompanyId: string | null = null;

      try {
        // 1. Buscar ou criar empresa no servidor
        const companiesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/companies`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        let companies: any[] = [];
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          companies = companiesData.companies || [];
        }

        let existingCompany = companies.find(c => 
          c.name.toLowerCase() === data.companyName.trim().toLowerCase()
        );

        if (!existingCompany) {
          // Criar nova empresa no servidor
          console.log('🏢 Criando nova empresa no servidor:', data.companyName);
          const createCompanyResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/companies`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                name: data.companyName.trim(),
                domain: data.companyName.toLowerCase().replace(/\s+/g, '-'),
                leader_id: 'temp', // Será atualizado depois
                status: 'active'
              }),
            }
          );

          if (createCompanyResponse.ok) {
            const { company: createdCompany } = await createCompanyResponse.json();
            serverCompanyId = createdCompany.id;
            console.log('✅ Empresa criada no servidor:', serverCompanyId);
          }
        } else {
          serverCompanyId = existingCompany.id;
          console.log('✅ Empresa já existe no servidor:', serverCompanyId);
        }

        // 2. Criar usuário no servidor
        if (serverCompanyId) {
          console.log('👤 Criando usuário no servidor...');
          const createUserResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/users`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                name: data.name.trim(),
                email: data.email.toLowerCase().trim(),
                role: existingCompany ? 'member' : 'leader',
                companyId: serverCompanyId,
                companyName: data.companyName.trim(),
              }),
            }
          );

          if (createUserResponse.ok) {
            const { user: createdUser } = await createUserResponse.json();
            serverUser = createdUser;
            console.log('✅ Usuário criado no servidor:', serverUser.id);
          }
        }
      } catch (serverError) {
        console.warn('⚠️ Erro ao criar no servidor, usando fallback local:', serverError);
      }

      // 3. Criar usuário final (usando dados do servidor se disponível)
      const newUser: User = serverUser ? {
        id: serverUser.id,
        email: serverUser.email,
        name: serverUser.name,
        role: serverUser.role,
        companyId: serverUser.companyId,
        companyName: serverUser.companyName,
        permissions: serverUser.role === 'leader' ? {
          canViewAllCompanies: false,
          canImportData: false,
          canViewResults: true,
          canInviteMembers: true,
          canEditMemberPermissions: true,
          canViewProgress: true,
        } : {
          canViewAllCompanies: false,
          canImportData: false,
          canViewResults: true,
          canInviteMembers: false,
          canEditMemberPermissions: false,
          canViewProgress: false,
        }
      } : {
        // Fallback para criação local
        id: 'user-' + Date.now(),
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        role: 'member',
        companyId: serverCompanyId || ('company-' + Date.now()),
        companyName: data.companyName.trim(),
        permissions: {
          canViewAllCompanies: false,
          canImportData: false,
          canViewResults: true,
          canInviteMembers: false,
          canEditMemberPermissions: false,
          canViewProgress: false,
        }
      };

      // Fazer login automático
      setUser(newUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(newUser));

      console.log('✅ Registro bem-sucedido:', {
        user: newUser,
        isServerUser: !!serverUser
      });

      return true;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qualitymap_user');
  };

  const switchRole = (role: UserRole) => {
    // Encontrar um usuário com o role desejado
    const mockUser = users.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('qualitymap_user', JSON.stringify(mockUser));
    }
  };

  // Carregar usuários e empresas salvos do localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('qualitymap_users');
    const storedCompanies = localStorage.getItem('qualitymap_companies');
    
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error('Erro ao carregar usuários:', e);
      }
    }
    
    if (storedCompanies) {
      try {
        setCompanies(JSON.parse(storedCompanies));
      } catch (e) {
        console.error('Erro ao carregar empresas:', e);
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    companies,
    login,
    register,
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