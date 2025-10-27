import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ImportResults } from './XLSXProcessor';
import { useCompany } from './CompanyContext';
import { MOCK_QUALITY_SCORES } from './QualityScoreMockData';

export interface QualityScore {
  id: string;
  companyId: string;
  companyName: string;
  companySector: string;
  version: number;
  createdAt: Date;
  totalUsers: number;
  validUsers: number;
  importResults: ImportResults;
  status: 'active' | 'archived';
}

interface QualityScoreContextType {
  qualityScores: QualityScore[];
  filteredQualityScores: QualityScore[];
  createQualityScore: (companyName: string, companySector: string, importResults: ImportResults) => QualityScore;
  getQualityScoresByCompany: (companyName: string) => QualityScore[];
  getQualityScore: (id: string) => QualityScore | undefined;
  archiveQualityScore: (id: string) => void;
  getAllCompanies: () => Array<{ name: string; sector: string; latestVersion: number; totalScores: number }>;
}

const QualityScoreContext = createContext<QualityScoreContextType | undefined>(undefined);

const STORAGE_KEY = 'qualityScores';

export function QualityScoreProvider({ children }: { children: ReactNode }) {
  const [qualityScores, setQualityScores] = useState<QualityScore[]>([]);
  const { selectedCompany } = useCompany();

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let scores = [];
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter strings de data de volta para objetos Date
        scores = parsed.map((score: any) => ({
          ...score,
          createdAt: new Date(score.createdAt)
        }));
      }
      
      // Verificar se existem dados mockados para as empresas
      const hasExistingData = scores.length > 0;
      
      if (!hasExistingData) {
        // Usar dados mockados mais completos com informações individuais de usuários
        scores = MOCK_QUALITY_SCORES;
      }
      
      setQualityScores(scores);
    } catch (error) {
      console.error('Erro ao carregar QualityScores do localStorage:', error);
    }
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(qualityScores));
    } catch (error) {
      console.error('Erro ao salvar QualityScores no localStorage:', error);
    }
  }, [qualityScores]);

  const createQualityScore = (companyName: string, companySector: string, importResults: ImportResults): QualityScore => {
    // Verificar versão existente para a empresa
    const existingScores = qualityScores.filter(score => 
      score.companyName.toLowerCase() === companyName.toLowerCase() && score.status === 'active'
    );
    const version = existingScores.length + 1;

    const newQualityScore: QualityScore = {
      id: 'qs-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      companyId: selectedCompany?.id || 'default-company',
      companyName,
      companySector,
      version,
      createdAt: new Date(),
      totalUsers: importResults.totalUsers,
      validUsers: importResults.validUsers,
      importResults,
      status: 'active'
    };

    setQualityScores(prev => [...prev, newQualityScore]);
    return newQualityScore;
  };

  const getQualityScoresByCompany = (companyName: string): QualityScore[] => {
    return qualityScores
      .filter(score => score.companyName.toLowerCase() === companyName.toLowerCase())
      .sort((a, b) => b.version - a.version); // Mais recente primeiro
  };

  const getQualityScore = (id: string): QualityScore | undefined => {
    return qualityScores.find(score => score.id === id);
  };

  const archiveQualityScore = (id: string): void => {
    setQualityScores(prev => 
      prev.map(score => 
        score.id === id ? { ...score, status: 'archived' as const } : score
      )
    );
  };

  const getAllCompanies = (): Array<{ name: string; sector: string; latestVersion: number; totalScores: number }> => {
    const companyMap = new Map<string, { name: string; sector: string; versions: number[] }>();
    
    qualityScores
      .filter(score => score.status === 'active')
      .forEach(score => {
        const key = score.companyName.toLowerCase();
        if (!companyMap.has(key)) {
          companyMap.set(key, {
            name: score.companyName,
            sector: score.companySector,
            versions: []
          });
        }
        companyMap.get(key)!.versions.push(score.version);
      });

    return Array.from(companyMap.values()).map(company => ({
      name: company.name,
      sector: company.sector,
      latestVersion: Math.max(...company.versions),
      totalScores: company.versions.length
    }));
  };

  // Filtrar dados baseado na empresa selecionada
  const filteredQualityScores = selectedCompany 
    ? qualityScores.filter(score => score.companyId === selectedCompany.id && score.status === 'active')
    : qualityScores.filter(score => score.status === 'active');

  const contextValue: QualityScoreContextType = {
    qualityScores: qualityScores.filter(score => score.status === 'active'),
    filteredQualityScores,
    createQualityScore,
    getQualityScoresByCompany,
    getQualityScore,
    archiveQualityScore,
    getAllCompanies
  };

  return (
    <QualityScoreContext.Provider value={contextValue}>
      {children}
    </QualityScoreContext.Provider>
  );
}

export function useQualityScore() {
  const context = useContext(QualityScoreContext);
  if (context === undefined) {
    throw new Error('useQualityScore must be used within a QualityScoreProvider');
  }
  return context;
}