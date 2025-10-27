import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CompanyData {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  status: 'active' | 'inactive';
  leaderId: string;
  createdAt: string;
}

interface CompanyContextType {
  selectedCompany: CompanyData | null;
  availableCompanies: CompanyData[];
  selectCompany: (company: CompanyData) => void;
  clearCompanySelection: () => void;
  isWhitelabelMode: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Mock data de empresas - em produção seria carregado do Supabase
const MOCK_COMPANIES_DATA: CompanyData[] = [
  {
    id: 'comp1',
    name: 'TechCorp Brasil',
    domain: 'techcorp.com.br',
    logo: undefined,
    primaryColor: '#2563eb',
    status: 'active',
    leaderId: '2',
    createdAt: '2024-01-15'
  },
  {
    id: 'comp2',
    name: 'InnovateTech Solutions',
    domain: 'innovatetech.com',
    logo: undefined,
    primaryColor: '#16a34a',
    status: 'active',
    leaderId: '10',
    createdAt: '2024-02-20'
  },
  {
    id: 'comp3',
    name: 'Digital Labs Inc',
    domain: 'digitallabs.io',
    logo: undefined,
    primaryColor: '#dc2626',
    status: 'active',
    leaderId: '11',
    createdAt: '2024-03-10'
  },
  {
    id: 'comp4',
    name: 'CloudFirst Systems',
    domain: 'cloudfirst.net',
    logo: undefined,
    primaryColor: '#7c3aed',
    status: 'inactive',
    leaderId: '12',
    createdAt: '2024-01-30'
  },
  {
    id: 'teste',
    name: 'Teste',
    domain: 'teste.com',
    logo: undefined,
    primaryColor: '#7c3aed',
    status: 'active',
    leaderId: '20',
    createdAt: '2024-03-20'
  }
];

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [availableCompanies] = useState<CompanyData[]>(MOCK_COMPANIES_DATA);

  useEffect(() => {
    // Recupera empresa selecionada do localStorage
    const storedCompanyId = localStorage.getItem('qualitymap_selected_company');
    if (storedCompanyId) {
      const company = availableCompanies.find(c => c.id === storedCompanyId);
      if (company) {
        setSelectedCompany(company);
      }
    }
  }, [availableCompanies]);

  const selectCompany = (company: CompanyData) => {
    setSelectedCompany(company);
    localStorage.setItem('qualitymap_selected_company', company.id);
  };

  const clearCompanySelection = () => {
    setSelectedCompany(null);
    localStorage.removeItem('qualitymap_selected_company');
  };

  const value: CompanyContextType = {
    selectedCompany,
    availableCompanies: availableCompanies.filter(c => c.status === 'active'),
    selectCompany,
    clearCompanySelection,
    isWhitelabelMode: !!selectedCompany
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}