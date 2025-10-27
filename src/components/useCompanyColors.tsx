import { useEffect } from 'react';
import { useCompany } from './CompanyContext';

/**
 * Hook que aplica as cores dinâmicas da empresa selecionada no CSS
 */
export function useCompanyColors() {
  const { selectedCompany } = useCompany();

  useEffect(() => {
    if (selectedCompany?.primaryColor) {
      // Aplicar a cor primária da empresa
      document.documentElement.style.setProperty('--company-primary', selectedCompany.primaryColor);
      
      // Calcular variações da cor para diferentes usos
      const hex = selectedCompany.primaryColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Cor de accent mais clara (mais opaca)
      const accentColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
      document.documentElement.style.setProperty('--company-accent', accentColor);
      
      // Override das cores do sistema para usar a cor da empresa
      document.documentElement.style.setProperty('--primary', selectedCompany.primaryColor);
      document.documentElement.style.setProperty('--sidebar-primary', selectedCompany.primaryColor);
      document.documentElement.style.setProperty('--ring', selectedCompany.primaryColor);
      document.documentElement.style.setProperty('--sidebar-ring', selectedCompany.primaryColor);
      
    } else {
      // Resetar para cores padrão quando não há empresa selecionada
      document.documentElement.style.setProperty('--company-primary', '#2563eb');
      document.documentElement.style.setProperty('--company-accent', '#e2e8f0');
      document.documentElement.style.setProperty('--primary', '#2563eb');
      document.documentElement.style.setProperty('--sidebar-primary', '#2563eb');
      document.documentElement.style.setProperty('--ring', '#3b82f6');
      document.documentElement.style.setProperty('--sidebar-ring', '#3b82f6');
    }
  }, [selectedCompany]);

  return {
    companyPrimary: selectedCompany?.primaryColor || '#2563eb',
    isCompanySelected: !!selectedCompany
  };
}