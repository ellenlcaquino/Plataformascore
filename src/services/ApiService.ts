// API Service para comunicação com o backend Supabase
import { projectId, publicAnonKey } from '../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2b631963`;

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const requestHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// COMPANIES
// ============================================

export const companiesApi = {
  getAll: async () => {
    return apiRequest('/companies');
  },

  create: async (company: any) => {
    return apiRequest('/companies', {
      method: 'POST',
      body: company,
    });
  },

  update: async (id: string, company: any) => {
    return apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: company,
    });
  },
};

// ============================================
// USERS
// ============================================

export const usersApi = {
  getAll: async () => {
    return apiRequest('/users');
  },

  create: async (user: any) => {
    return apiRequest('/users', {
      method: 'POST',
      body: user,
    });
  },

  update: async (id: string, user: any) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: user,
    });
  },
};

// ============================================
// RODADAS
// ============================================

export const rodadasApi = {
  getAll: async (companyId?: string) => {
    const query = companyId ? `?companyId=${companyId}` : '';
    return apiRequest(`/rodadas${query}`);
  },

  create: async (rodada: any) => {
    return apiRequest('/rodadas', {
      method: 'POST',
      body: rodada,
    });
  },

  update: async (id: string, rodada: any) => {
    return apiRequest(`/rodadas/${id}`, {
      method: 'PUT',
      body: rodada,
    });
  },

  updateParticipante: async (rodadaId: string, participanteId: string, data: any) => {
    return apiRequest(`/rodadas/${rodadaId}/participantes/${participanteId}`, {
      method: 'PUT',
      body: data,
    });
  },
};

// ============================================
// ASSESSMENTS
// ============================================

export const assessmentsApi = {
  save: async (assessment: any) => {
    return apiRequest('/assessments', {
      method: 'POST',
      body: assessment,
    });
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
