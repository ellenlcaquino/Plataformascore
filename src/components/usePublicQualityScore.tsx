import { useState, useEffect } from 'react';
import { useQualityScore } from './QualityScoreManager';

interface PublicScoreData {
  company: string;
  assessmentTitle: string;
  date: string;
  round: string;
  shareId: string;
  overallScore: number;
  maturityLevel: string;
  pillars: Array<{
    name: string;
    score: number;
    level: string;
    color: string;
  }>;
  maturityDistribution: Array<{
    level: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  keyInsights: Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
  radarData: Array<{
    pillar: string;
    score: number;
    fullMark: number;
  }>;
}

// Dados mock para desenvolvimento
const getMockData = (shareId: string): PublicScoreData => ({
  company: shareId.includes('irricontrol') ? 'IrriControl' : 'TechCorp',
  assessmentTitle: 'QualityScore Assessment Q4 2024',
  date: '15 de Dezembro de 2024',
  round: 'Rodada 1',
  shareId,
  overallScore: 3.2,
  maturityLevel: 'Consciência',
  pillars: [
    { name: 'Estratégia', score: 3.8, level: 'Experiência', color: '#2563eb' },
    { name: 'Governança', score: 2.9, level: 'Consciência', color: '#d97706' },
    { name: 'Processos', score: 3.5, level: 'Experiência', color: '#2563eb' },
    { name: 'Tecnologia', score: 3.1, level: 'Consciência', color: '#d97706' },
    { name: 'Pessoas', score: 2.8, level: 'Consciência', color: '#d97706' },
    { name: 'Cultura', score: 3.4, level: 'Experiência', color: '#2563eb' },
    { name: 'Medição', score: 2.7, level: 'Consciência', color: '#d97706' }
  ],
  maturityDistribution: [
    { level: 'Domínio', count: 0, percentage: 0, color: '#16a34a' },
    { level: 'Experiência', count: 3, percentage: 43, color: '#2563eb' },
    { level: 'Consciência', count: 4, percentage: 57, color: '#d97706' },
    { level: 'Inicialização', count: 0, percentage: 0, color: '#dc2626' },
    { level: 'Agnóstico', count: 0, percentage: 0, color: '#64748b' }
  ],
  keyInsights: [
    {
      type: 'success',
      title: 'Pontos Fortes Identificados',
      description: 'Estratégia, Processos e Cultura mostram bom nível de maturidade, indicando uma base sólida para evolução.'
    },
    {
      type: 'warning', 
      title: 'Oportunidades de Melhoria',
      description: 'Medição e Pessoas precisam de atenção especial para acelerar a jornada de maturidade em qualidade.'
    },
    {
      type: 'info',
      title: 'Próximos Passos Recomendados',
      description: 'Foco em implementar métricas de qualidade e programas de desenvolvimento de competências da equipe.'
    }
  ],
  radarData: [
    { pillar: 'Estratégia', score: 3.8, fullMark: 5 },
    { pillar: 'Governança', score: 2.9, fullMark: 5 },
    { pillar: 'Processos', score: 3.5, fullMark: 5 },
    { pillar: 'Tecnologia', score: 3.1, fullMark: 5 },
    { pillar: 'Pessoas', score: 2.8, fullMark: 5 },
    { pillar: 'Cultura', score: 3.4, fullMark: 5 },
    { pillar: 'Medição', score: 2.7, fullMark: 5 }
  ]
});

export function usePublicQualityScore(shareId: string) {
  const [data, setData] = useState<PublicScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { qualityScores } = useQualityScore();

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Carregando dados para shareId:', shareId);
        
        // Aguardar um pouco para simular loading real
        await new Promise(resolve => setTimeout(resolve, 500));

        // Em produção, aqui seria uma chamada para API pública
        // Por agora, vamos tentar encontrar nos dados locais ou usar mock
        
        // Tentar encontrar nos QualityScores locais (para desenvolvimento)
        const localQS = qualityScores.find(qs => {
          // Gerar possível shareId baseado na empresa
          const possibleId = `${qs.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}-r1`;
          return possibleId === shareId;
        });

        if (localQS && localQS.importResults?.consolidatedData?.mediaGeralPorPilar) {
          console.log('✅ Dados locais encontrados para:', localQS.companyName);
          
          // Converter dados do QualityScore para formato público
          const consolidatedData = localQS.importResults.consolidatedData;
          const pillarScores = Object.entries(consolidatedData.mediaGeralPorPilar);
          
          const pillars = pillarScores.map(([name, score]) => {
            const numScore = Number(score);
            let level = 'Agnóstico';
            let color = '#64748b';
            
            if (numScore >= 4) { level = 'Domínio'; color = '#16a34a'; }
            else if (numScore >= 3) { level = 'Experiência'; color = '#2563eb'; }
            else if (numScore >= 2) { level = 'Consciência'; color = '#d97706'; }
            else if (numScore >= 1) { level = 'Inicialização'; color = '#dc2626'; }
            
            return { name, score: numScore, level, color };
          });
          
          const overallScore = pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length;
          
          // Calcular distribuição de maturidade
          const maturityCounts = {
            'Domínio': pillars.filter(p => p.level === 'Domínio').length,
            'Experiência': pillars.filter(p => p.level === 'Experiência').length,
            'Consciência': pillars.filter(p => p.level === 'Consciência').length,
            'Inicialização': pillars.filter(p => p.level === 'Inicialização').length,
            'Agnóstico': pillars.filter(p => p.level === 'Agnóstico').length
          };
          
          const total = pillars.length;
          const maturityDistribution = Object.entries(maturityCounts).map(([level, count]) => ({
            level,
            count,
            percentage: Math.round((count / total) * 100),
            color: level === 'Domínio' ? '#16a34a' :
                   level === 'Experiência' ? '#2563eb' :
                   level === 'Consciência' ? '#d97706' :
                   level === 'Inicialização' ? '#dc2626' : '#64748b'
          }));
          
          const publicData: PublicScoreData = {
            company: localQS.companyName,
            assessmentTitle: `QualityScore Assessment - ${localQS.companyName}`,
            date: localQS.createdAt.toLocaleDateString('pt-BR'),
            round: 'Rodada 1',
            shareId,
            overallScore: Number(overallScore.toFixed(1)),
            maturityLevel: overallScore >= 4 ? 'Domínio' :
                          overallScore >= 3 ? 'Experiência' :
                          overallScore >= 2 ? 'Consciência' :
                          overallScore >= 1 ? 'Inicialização' : 'Agnóstico',
            pillars,
            maturityDistribution,
            keyInsights: [
              {
                type: 'success',
                title: 'Pontos Fortes Identificados',
                description: `${pillars.filter(p => p.score >= 3.5).map(p => p.name).join(', ')} mostram bom nível de maturidade.`
              },
              {
                type: 'warning',
                title: 'Oportunidades de Melhoria', 
                description: `${pillars.filter(p => p.score < 3).map(p => p.name).join(', ')} precisam de atenção especial.`
              },
              {
                type: 'info',
                title: 'Próximos Passos',
                description: 'Implementar plano de ação focado nos pilares de menor maturidade para acelerar a evolução.'
              }
            ],
            radarData: pillars.map(p => ({
              pillar: p.name,
              score: p.score,
              fullMark: 5
            }))
          };
          
          setData(publicData);
        } else {
          // Se não encontrou dados locais, usar mock data sempre
          console.log('📝 Usando dados mock para demonstração');
          const mockData = getMockData(shareId);
          setData(mockData);
        }
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados públicos:', err);
        // Em caso de erro, usar dados mock como fallback sempre
        console.log('🔄 Fallback para dados mock devido ao erro');
        setData(getMockData(shareId));
        setError(null); // Limpar erro já que temos fallback
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      loadPublicData();
    }
  }, [shareId, qualityScores]);

  return { data, loading, error };
}