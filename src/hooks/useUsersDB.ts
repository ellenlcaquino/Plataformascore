import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/ApiService';
import { useAuth } from '../components/AuthContext';
import { toast } from 'sonner@2.0.3';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'leader' | 'member';
  companyId: string;
  companyName: string;
  hasLoggedIn: boolean;
  addedViaRodada: boolean;
  invitedBy?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export function useUsersDB() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.getAll();
      let allUsers = response.users || [];

      // Filtrar por empresa se for Leader ou Member
      if (currentUser.role === 'leader' || currentUser.role === 'member') {
        allUsers = allUsers.filter((u: User) => u.companyId === currentUser.companyId);
      }

      setUsers(allUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Erro ao carregar usuários');
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Create user
  const createUser = useCallback(async (userData: {
    email: string;
    name: string;
    role: 'manager' | 'leader' | 'member';
    companyId?: string;
    companyName?: string;
  }) => {
    if (!currentUser) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      // Se for Leader, usar sua própria empresa
      const finalCompanyId = currentUser.role === 'leader' 
        ? currentUser.companyId 
        : userData.companyId;
      
      const finalCompanyName = currentUser.role === 'leader'
        ? currentUser.companyName
        : userData.companyName;

      const response = await usersApi.create({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        companyId: finalCompanyId,
        companyName: finalCompanyName,
        addedViaRodada: false,
        invitedBy: null,
      });

      toast.success('Usuário criado com sucesso!');
      await fetchUsers();
      
      return response.user;
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast.error('Erro ao criar usuário: ' + err.message);
      return null;
    }
  }, [currentUser, fetchUsers]);

  // Update user
  const updateUser = useCallback(async (
    userId: string,
    updates: Partial<User>
  ) => {
    try {
      await usersApi.update(userId, updates);
      toast.success('Usuário atualizado com sucesso!');
      await fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast.error('Erro ao atualizar usuário: ' + err.message);
    }
  }, [fetchUsers]);

  // Load on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
  };
}
