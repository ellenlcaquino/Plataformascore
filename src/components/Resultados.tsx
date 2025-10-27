import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { HeatmapDivergencia } from './HeatmapDivergencia';
import { AnaliseAlinhamento } from './AnaliseAlinhamento';
import { RadarChartPersonas } from './RadarChartPersonas';
import { MapaLinhaPilarAdaptivo } from './MapaLinhaPilarAdaptivo';
import { PublicShareManager } from './PublicShareManager';
import { AccessControl } from './AccessControl';
import { QualityScoreLayout } from './QualityScoreLayout';
import { useQualityScore } from './QualityScoreManager';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Users,
  Calendar,
  Award,
  Zap,
  ArrowRight,
  Download,
  Share,
  Share2,
  Settings,
  Bot,
  FileText,
  Infinity,
  TestTube
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface ResultadosProps {
  assessmentResults: any;
}

interface ResultadosContentProps extends ResultadosProps {
  qualityScores: any[];
  selectedQualityScoreId: string;
  onSelectQualityScore: (id: string) => void;
}

// Definir os pilares e suas configurações (alinhado com XLSXProcessor)
const PILARES = [
  { id: 'processes', nome: 'Processos e Estratégias', icon: Settings, color: '#3b82f6' },
  { id: 'automation', nome: 'Testes Automatizados', icon: Bot, color: '#10b981' },
  { id: 'metrics', nome: 'Métricas', icon: BarChart3, color: '#f59e0b' },
  { id: 'documentation', nome: 'Documentações', icon: FileText, color: '#ef4444' },
  { id: 'testModalities', nome: 'Modalidades de Testes', icon: TestTube, color: '#8b5cf6' },
  { id: 'qaops', nome: 'QAOPS', icon: Infinity, color: '#06b6d4' },
  { id: 'leadership', nome: 'Liderança', icon: Users, color: '#84cc16' }
];

// Mapeamento das perguntas por pilar (baseado na estrutura existente)
const PERGUNTAS_POR_PILAR = {
  processes: Array.from({length: 16}, (_, i) => `process${i + 1}`),
  automation: Array.from({length: 16}, (_, i) => `auto${i + 1}`),
  metrics: Array.from({length: 14}, (_, i) => `metric${i + 1}`),
  documentation: Array.from({length: 11}, (_, i) => `doc${i + 1}`),
  testModalities: Array.from({length: 12}, (_, i) => `test${i + 1}`),
  qaops: Array.from({length: 10}, (_, i) => `qaops${i + 1}`),
  leadership: Array.from({length: 12}, (_, i) => `leader${i + 1}`)
};

import { getNivelMaturidade } from './MaturityLevels';

// Função para gerar recomendações por pilar
const getRecomendacoesPilar = (pilarId: string, score: number) => {
  const recomendacoes = {
    processes: {
      estrategica: "Estabelecer governança de qualidade com processos padronizados",
      tatica: "Implementar Definition of Ready e Definition of Done",
      operacional: "Criar templates de documentação e checklists de processo"
    },
    automation: {
      estrategica: "Estruturar pipeline de CI/CD com gates de qualidade",
      tatica: "Definir estratégia de cobertura de testes automatizados",
      operacional: "Implementar suíte básica de testes unitários e integração"
    },
    metrics: {
      estrategica: "Definir KPIs de qualidade alinhados aos objetivos de negócio",
      tatica: "Implementar coleta automatizada de métricas",
      operacional: "Criar dashboards de acompanhamento em tempo real"
    },
    documentation: {
      estrategica: "Estabelecer política de documentação técnica",
      tatica: "Padronizar templates e ferramentas de documentação",
      operacional: "Criar rotina de atualização e versionamento de docs"
    },
    testModalities: {
      estrategica: "Ampliar cobertura de modalidades de teste",
      tatica: "Capacitar equipe em testes de performance e segurança",
      operacional: "Implementar testes de acessibilidade e usabilidade"
    },
    qaops: {
      estrategica: "Integrar QA ao ciclo DevOps completo",
      tatica: "Implementar observabilidade e monitoramento contínuo",
      operacional: "Automatizar deploy e rollback baseado em métricas"
    },
    leadership: {
      estrategica: "Estabelecer visão estratégica de qualidade organizacional",
      tatica: "Definir plano de carreira e desenvolvimento para QAs",
      operacional: "Implementar rituais de feedback e melhoria contínua"
    }
  };

  return recomendacoes[pilarId as keyof typeof recomendacoes] || {
    estrategica: "Definir estratégia específica para o pilar",
    tatica: "Implementar práticas táticas",
    operacional: "Executar ações operacionais"
  };
};

export function Resultados({ assessmentResults }: ResultadosProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQualityScoreId, setSelectedQualityScoreId] = useState<string>('');
  const { qualityScores } = useQualityScore();

  return (
    <AccessControl requiredPermissions={['canViewResults']}>
      <QualityScoreLayout 
        currentSection="qualityscore-resultados" 
        title="Resultados QualityScore"
        description="Análise completa da maturidade em qualidade de software com integração inteligente para Goals"
      >
        <div className="bg-gray-50 min-h-full p-6">
          <div className="max-w-7xl mx-auto">
            <ResultadosContent 
              assessmentResults={assessmentResults} 
              qualityScores={qualityScores}
              selectedQualityScoreId={selectedQualityScoreId}
              onSelectQualityScore={setSelectedQualityScoreId}
            />
          </div>
        </div>
      </QualityScoreLayout>
    </AccessControl>
  );
}

function ResultadosContent({ assessmentResults, qualityScores, selectedQualityScoreId, onSelectQualityScore }: ResultadosContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Se não há QualityScores ou assessmentResults, mostrar seletor
  const hasData = assessmentResults || selectedQualityScoreId;
  const selectedQualityScore = qualityScores.find(qs => qs.id === selectedQualityScoreId);
  
  // Usar dados do QualityScore selecionado se disponível
  const dataSource = selectedQualityScore ? selectedQualityScore.importResults : assessmentResults;

  // Processar dados se existirem
  const dadosProcessados = useMemo(() => {
    if (!hasData) {
      // Dados de exemplo para demonstração
      return {
        empresa: "TechCorp Brasil",
        participantes: 8,
        dataAvaliacao: new Date().toLocaleDateString('pt-BR'),
        scoreGeral: 3.2,
        pilarMaisForte: { nome: 'Liderança', score: 4.5 },
        pilarMaisFrago: { nome: 'Automação', score: 1.8 },
        scoresPorPilar: [
          { pilar: 'Processos e Estratégia', score: 3.5, categoria: 'processes' },
          { pilar: 'Testes Automatizados', score: 1.8, categoria: 'automation' },
          { pilar: 'Métricas', score: 2.9, categoria: 'metrics' },
          { pilar: 'Documentações', score: 3.1, categoria: 'documentation' },
          { pilar: 'Modalidades de Testes', score: 3.8, categoria: 'testModalities' },
          { pilar: 'QAOps', score: 2.2, categoria: 'qaops' },
          { pilar: 'Liderança', score: 4.5, categoria: 'leadership' }
        ]
      };
    }

    // Processar dados do QualityScore ou assessment
    if (selectedQualityScore) {
      // Usar dados consolidados do QualityScore
      const consolidatedData = selectedQualityScore.importResults.consolidatedData;
      
      // Mapear nomes dos pilares para usar nomenclatura correta e IDs
      const pilarNameMap: Record<string, { nome: string; id: string }> = {
        'Processos e Estratégias': { nome: 'Processos e Estratégias', id: 'processes' },
        'Testes Automatizados': { nome: 'Testes Automatizados', id: 'automation' },
        'Métricas': { nome: 'Métricas', id: 'metrics' },
        'Documentações': { nome: 'Documentações', id: 'documentation' },
        'Modalidades de Testes': { nome: 'Modalidades de Testes', id: 'testModalities' },
        'QAOPS': { nome: 'QAOPS', id: 'qaops' },
        'Liderança': { nome: 'Liderança', id: 'leadership' }
      };
      
      const scoresPorPilar = Object.entries(consolidatedData.mediaGeralPorPilar).map(([pilar, score]) => {
        const mappedPilar = pilarNameMap[pilar] || { nome: pilar, id: pilar.toLowerCase() };
        return {
          pilar: mappedPilar.nome,
          score: Number(score),
          categoria: mappedPilar.id
        };
      });
      
      const scoreGeral = Number((scoresPorPilar.reduce((soma, item) => soma + item.score, 0) / scoresPorPilar.length).toFixed(1));
      const pilarMaisForte = scoresPorPilar.reduce((max, item) => item.score > max.score ? item : max);
      const pilarMaisFrago = scoresPorPilar.reduce((min, item) => item.score < min.score ? item : min);

      return {
        empresa: selectedQualityScore.companyName,
        participantes: selectedQualityScore.validUsers,
        dataAvaliacao: selectedQualityScore.createdAt.toLocaleDateString('pt-BR'),
        scoreGeral,
        pilarMaisForte: { nome: pilarMaisForte.pilar, score: pilarMaisForte.score },
        pilarMaisFrago: { nome: pilarMaisFrago.pilar, score: pilarMaisFrago.score },
        scoresPorPilar
      };
    }

    // Processar dados reais do assessment (original)
    const scoresPorPilar = PILARES.map(pilar => {
      const perguntasPilar = PERGUNTAS_POR_PILAR[pilar.id as keyof typeof PERGUNTAS_POR_PILAR];
      const respostas = perguntasPilar
        .map(perguntaId => dataSource[perguntaId])
        .filter(resposta => resposta !== undefined && resposta !== null);
      
      const somaScores = respostas.reduce((soma, resposta) => {
        // Para perguntas checkbox, considerar como score 3 se tem alguma seleção
        if (Array.isArray(resposta)) {
          return soma + (resposta.length > 0 ? 3 : 0);
        }
        return soma + Number(resposta);
      }, 0);
      
      const score = respostas.length > 0 ? Number((somaScores / respostas.length).toFixed(1)) : 0;
      
      return {
        pilar: pilar.nome,
        score,
        categoria: pilar.id
      };
    });

    const scoreGeral = Number((scoresPorPilar.reduce((soma, item) => soma + item.score, 0) / scoresPorPilar.length).toFixed(1));
    const pilarMaisForte = scoresPorPilar.reduce((max, item) => item.score > max.score ? item : max);
    const pilarMaisFrago = scoresPorPilar.reduce((min, item) => item.score < min.score ? item : min);

    return {
      empresa: "Sua Empresa",
      participantes: 1,
      dataAvaliacao: new Date().toLocaleDateString('pt-BR'),
      scoreGeral,
      pilarMaisForte: { nome: pilarMaisForte.pilar, score: pilarMaisForte.score },
      pilarMaisFrago: { nome: pilarMaisFrago.pilar, score: pilarMaisFrago.score },
      scoresPorPilar
    };
  }, [dataSource, selectedQualityScore]);

  const nivelMaturidade = getNivelMaturidade(dadosProcessados.scoreGeral);


  // Dados para o gráfico de radar
  const dadosRadar = dadosProcessados.scoresPorPilar.map(item => ({
    pilar: item.pilar.split(' ')[0], // Primeira palavra para economizar espaço
    score: item.score,
    fullName: item.pilar
  }));

  // Preparar dados para RadarChartPersonas, MapaLinhaPilar e AnaliseAlinhamento
  const dadosPersonas = useMemo(() => {
    // Se há QualityScore selecionado, usar dados reais dos usuários importados
    if (selectedQualityScore && selectedQualityScore.importResults?.data) {
      const userData = selectedQualityScore.importResults.data;
      
      console.log('🔍 Preparando dados personas do QualityScore:', {
        totalUsers: userData.length,
        firstUser: userData[0]
      });
      
      return userData.map((user, index) => {
        console.log(`📝 Processando usuário ${index}:`, {
          id: user.userID,
          nome: user.nome,
          temRespostas: !!user.respostas,
          totalRespostas: user.respostas ? Object.keys(user.respostas).length : 0,
          exemploRespostas: user.respostas ? Object.entries(user.respostas).slice(0, 5) : []
        });
        
        return {
          id: user.userID || `user_${index}`,
          nome: user.nome || `Usuário ${index + 1}`,
          empresa: user.companhia || selectedQualityScore.companyName,
          cargo: user.areaPertenente || 'Não informado',
          // ✅ CORREÇÃO CRÍTICA: Usar user.respostas (dados individuais das 91 perguntas)
          // Estas são as respostas brutas por pergunta (ex: process1: 4, auto2: 3, etc.)
          respostas: user.respostas || {}
        };
      });
    }
    
    // Dados de exemplo expandidos se não há QualityScore selecionado
    // ✅ IMPORTANTE: Dados de exemplo com IDs individuais das perguntas para teste
    return [
      {
        id: 'persona1',
        nome: 'Ana Silva',
        empresa: dadosProcessados.empresa,
        cargo: 'QA Lead',
        respostas: {
          // Processos e Estratégias (16 perguntas)
          'process1': 5, 'process2': 5, 'process3': 4, 'process4': 5, 'process5': 4,
          'process6': 4, 'process7': 5, 'process8': 4, 'process9': 4, 'process10': 5,
          'process11': 4, 'process12': 4, 'process13': 5, 'process14': 4, 'process15': 5, 'process16': 4,
          // Testes Automatizados (16 perguntas)
          'auto1': 3, 'auto2': 4, 'auto3': 3, 'auto4': 4, 'auto5': 4,
          'auto6': 3, 'auto7': 4, 'auto8': 4, 'auto9': 3, 'auto10': 4,
          'auto11': 4, 'auto12': 3, 'auto13': 4, 'auto14': 4, 'auto15': 3, 'auto16': 4,
          // Métricas (14 perguntas)
          'metric1': 4, 'metric2': 3, 'metric3': 4, 'metric4': 3, 'metric5': 4,
          'metric6': 3, 'metric7': 4, 'metric8': 3, 'metric9': 4, 'metric10': 3,
          'metric11': 4, 'metric12': 3, 'metric13': 4, 'metric14': 4,
          // Documentações (11 perguntas)
          'doc1': 5, 'doc2': 4, 'doc3': 4, 'doc4': 5, 'doc5': 4,
          'doc6': 4, 'doc7': 4, 'doc8': 5, 'doc9': 4, 'doc10': 4, 'doc11': 4,
          // Modalidades de Testes (12 perguntas, excluindo test12 que é textual)
          'test1': 4, 'test2': 4, 'test3': 4, 'test4': 3, 'test5': 4,
          'test6': 4, 'test7': 4, 'test8': 3, 'test9': 4, 'test10': 4, 'test11': 4,
          // QAOPS (10 perguntas)
          'qaops1': 3, 'qaops2': 3, 'qaops3': 4, 'qaops4': 3, 'qaops5': 3,
          'qaops6': 4, 'qaops7': 3, 'qaops8': 3, 'qaops9': 4, 'qaops10': 3,
          // Liderança (12 perguntas)
          'leader1': 5, 'leader2': 5, 'leader3': 4, 'leader4': 5, 'leader5': 4,
          'leader6': 5, 'leader7': 4, 'leader8': 5, 'leader9': 4, 'leader10': 5,
          'leader11': 4, 'leader12': 5
        }
      },
      {
        id: 'persona2',
        nome: 'Carlos Santos',
        empresa: dadosProcessados.empresa,
        cargo: 'Senior QA',
        respostas: {
          // Processos e Estratégias (scores mais baixos)
          'process1': 3, 'process2': 4, 'process3': 3, 'process4': 4, 'process5': 3,
          'process6': 4, 'process7': 3, 'process8': 4, 'process9': 3, 'process10': 4,
          'process11': 3, 'process12': 4, 'process13': 3, 'process14': 4, 'process15': 3, 'process16': 4,
          // Testes Automatizados (scores altos)
          'auto1': 5, 'auto2': 5, 'auto3': 4, 'auto4': 5, 'auto5': 5,
          'auto6': 4, 'auto7': 5, 'auto8': 4, 'auto9': 5, 'auto10': 4,
          'auto11': 5, 'auto12': 4, 'auto13': 5, 'auto14': 4, 'auto15': 5, 'auto16': 4,
          // Métricas (scores moderados)
          'metric1': 2, 'metric2': 3, 'metric3': 3, 'metric4': 3, 'metric5': 4,
          'metric6': 3, 'metric7': 3, 'metric8': 3, 'metric9': 4, 'metric10': 2,
          'metric11': 3, 'metric12': 3, 'metric13': 4, 'metric14': 3,
          // Documentações
          'doc1': 3, 'doc2': 3, 'doc3': 4, 'doc4': 3, 'doc5': 4,
          'doc6': 3, 'doc7': 3, 'doc8': 4, 'doc9': 3, 'doc10': 4, 'doc11': 3,
          // Modalidades de Testes
          'test1': 5, 'test2': 4, 'test3': 4, 'test4': 5, 'test5': 4,
          'test6': 4, 'test7': 5, 'test8': 4, 'test9': 4, 'test10': 4, 'test11': 5,
          // QAOPS
          'qaops1': 4, 'qaops2': 4, 'qaops3': 4, 'qaops4': 4, 'qaops5': 4,
          'qaops6': 4, 'qaops7': 4, 'qaops8': 4, 'qaops9': 4, 'qaops10': 4,
          // Liderança (scores baixos)
          'leader1': 3, 'leader2': 3, 'leader3': 3, 'leader4': 3, 'leader5': 2,
          'leader6': 3, 'leader7': 3, 'leader8': 3, 'leader9': 3, 'leader10': 3,
          'leader11': 3, 'leader12': 3
        }
      },
      {
        id: 'persona3',
        nome: 'Maria Oliveira',
        empresa: dadosProcessados.empresa,
        cargo: 'QA Analyst',
        respostas: {
          // Processos e Estratégias (scores baixos)
          'process1': 3, 'process2': 3, 'process3': 2, 'process4': 3, 'process5': 3,
          'process6': 3, 'process7': 3, 'process8': 3, 'process9': 2, 'process10': 3,
          'process11': 3, 'process12': 3, 'process13': 3, 'process14': 2, 'process15': 3, 'process16': 3,
          // Testes Automatizados (scores baixos)
          'auto1': 2, 'auto2': 3, 'auto3': 3, 'auto4': 2, 'auto5': 3,
          'auto6': 2, 'auto7': 3, 'auto8': 3, 'auto9': 2, 'auto10': 3,
          'auto11': 3, 'auto12': 2, 'auto13': 3, 'auto14': 3, 'auto15': 2, 'auto16': 3,
          // Métricas
          'metric1': 3, 'metric2': 4, 'metric3': 2, 'metric4': 3, 'metric5': 2,
          'metric6': 3, 'metric7': 2, 'metric8': 3, 'metric9': 2, 'metric10': 3,
          'metric11': 2, 'metric12': 3, 'metric13': 3, 'metric14': 2,
          // Documentações
          'doc1': 4, 'doc2': 3, 'doc3': 3, 'doc4': 3, 'doc5': 3,
          'doc6': 3, 'doc7': 3, 'doc8': 3, 'doc9': 3, 'doc10': 3, 'doc11': 4,
          // Modalidades de Testes
          'test1': 3, 'test2': 3, 'test3': 4, 'test4': 3, 'test5': 3,
          'test6': 4, 'test7': 3, 'test8': 3, 'test9': 4, 'test10': 3, 'test11': 4,
          // QAOPS (scores baixos)
          'qaops1': 2, 'qaops2': 2, 'qaops3': 2, 'qaops4': 2, 'qaops5': 2,
          'qaops6': 2, 'qaops7': 2, 'qaops8': 1, 'qaops9': 2, 'qaops10': 2,
          // Liderança
          'leader1': 3, 'leader2': 3, 'leader3': 2, 'leader4': 3, 'leader5': 2,
          'leader6': 3, 'leader7': 3, 'leader8': 3, 'leader9': 3, 'leader10': 3,
          'leader11': 3, 'leader12': 3
        }
      }
    ];
  }, [selectedQualityScore, dadosProcessados.empresa]);

  // Se não há dados, mostrar seletor
  if (!hasData && qualityScores.length > 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um QualityScore</h3>
            <p className="text-gray-600 mb-6">
              Escolha uma empresa e versão para visualizar os resultados detalhados.
            </p>
            
            <div className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QualityScore Disponível
                </label>
                <Select value={selectedQualityScoreId} onValueChange={onSelectQualityScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityScores.map((qs) => (
                      <SelectItem key={qs.id} value={qs.id}>
                        {qs.companyName} - {qs.createdAt.toLocaleDateString('pt-BR')} ({qs.validUsers} usuários)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de QualityScore */}
      {qualityScores.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">QualityScore Selecionado</h3>
              <p className="text-sm text-gray-600">
                {selectedQualityScore ? 
                  `${selectedQualityScore.companyName} - ${selectedQualityScore.validUsers} usuários válidos` :
                  'Resultado da avaliação atual'
                }
              </p>
            </div>
            <div className="w-80">
              <Select value={selectedQualityScoreId || "current"} onValueChange={(value) => onSelectQualityScore(value === "current" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um QualityScore" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Avaliação Atual</SelectItem>
                  {qualityScores.map((qs) => (
                    <SelectItem key={qs.id} value={qs.id}>
                      {qs.companyName} - {qs.createdAt.toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Sistema de Abas Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs px-2 py-2">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="radar" className="text-xs px-2 py-2">
            Radar
          </TabsTrigger>
          <TabsTrigger value="linha-pilar" className="text-xs px-2 py-2">
            Linha Pilar
          </TabsTrigger>
          <TabsTrigger value="analise" className="text-xs px-2 py-2">
            Análise de Alinhamento
          </TabsTrigger>
          <TabsTrigger value="acoes" className="text-xs px-2 py-2">
            Ações
          </TabsTrigger>
          <TabsTrigger value="sharing" className="text-xs px-2 py-2 flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            Compartilhamento
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Resumo Executivo</h2>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span><strong>{dadosProcessados.empresa}</strong> • {dadosProcessados.participantes} participante(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Avaliação realizada em {dadosProcessados.dataAvaliacao}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{ color: nivelMaturidade.cor }}>
                    {dadosProcessados.scoreGeral.toFixed(2)}
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-1">
                    {nivelMaturidade.nivel}
                  </div>
                  <div className="text-sm text-gray-600 max-w-xs">
                    {nivelMaturidade.descricao}
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Scores por Pilar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dadosProcessados.scoresPorPilar.map((pilar, index) => {
              const PilarIcon = PILARES.find(p => p.id === pilar.categoria)?.icon || BarChart3;
              const nivel = getNivelMaturidade(pilar.score);
              
              return (
                <Card key={pilar.categoria} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <PilarIcon className="h-6 w-6" style={{ color: PILARES.find(p => p.id === pilar.categoria)?.color }} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{pilar.pilar}</h3>
                        <p className="text-sm text-gray-600">{nivel.nivel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: nivel.cor }}>
                        {pilar.score.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={pilar.score * 20} // Converter escala 0-5 para 0-100
                    className="h-2"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {nivel.descricao}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Radar */}
        <TabsContent value="radar">
          <RadarChartPersonas personas={dadosPersonas} />
        </TabsContent>

        {/* Linha Pilar */}
        <TabsContent value="linha-pilar">
          <MapaLinhaPilarAdaptivo personas={dadosPersonas} />
        </TabsContent>

        {/* Análise de Alinhamento */}
        <TabsContent value="analise">
          <AnaliseAlinhamento personas={dadosPersonas} />
        </TabsContent>

        {/* Ações - Recomendações Inteligentes */}
        <TabsContent value="acoes" className="space-y-6">
          {/* Ação Rápida para Goals */}


          {/* Recomendações por Pilar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recomendações por Pilar</h3>
            
            {dadosProcessados.scoresPorPilar
              .sort((a, b) => a.score - b.score) // Ordenar por score (pior primeiro)
              .map((pilar) => {
                const PilarIcon = PILARES.find(p => p.id === pilar.categoria)?.icon || Settings;
                const recomendacoes = getRecomendacoesPilar(pilar.categoria, pilar.score);
                const nivelPilar = getNivelMaturidade(pilar.score);
                
                return (
                  <Card key={pilar.categoria} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PilarIcon className="h-6 w-6" style={{ color: PILARES.find(p => p.id === pilar.categoria)?.color }} />
                          <div>
                            <CardTitle className="text-base">{pilar.pilar}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" style={{ 
                                backgroundColor: nivelPilar.cor + '20', 
                                borderColor: nivelPilar.cor,
                                color: nivelPilar.cor 
                              }}>
                                {pilar.score.toFixed(1)} - {nivelPilar.nivel}
                              </Badge>
                              {pilar.score < 3.0 && (
                                <Badge variant="outline" className="border-orange-300 text-orange-700">
                                  Oportunidade de Melhoria
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {pilar.score < 3.0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              gerarObjetivosDosResultadosQS({ 
                                ...dadosProcessados, 
                                scoresPorPilar: [pilar] 
                              });
                            }}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Target className="h-4 w-4 mr-1" />
                            Criar Objetivo
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium text-red-700">Estratégico</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-4">{recomendacoes.estrategica}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-sm font-medium text-orange-700">Tático</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-4">{recomendacoes.tatica}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-blue-700">Operacional</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-4">{recomendacoes.operacional}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Aba Compartilhamento */}
        <TabsContent value="sharing" className="space-y-6">
          <PublicShareManager 
            assessmentResults={dadosProcessados}
            onCreateShare={(shareData) => {
              console.log('Novo compartilhamento criado:', shareData);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}