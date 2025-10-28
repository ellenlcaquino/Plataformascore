import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { HeatmapDivergencia } from './HeatmapDivergencia';
import { RadarChartPersonas } from './RadarChartPersonas';
import { MapaDivergencia } from './MapaDivergenciaSimples';
import { MapaLinhaPilar } from './MapaLinhaPilar';
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
  const { filteredQualityScores: qualityScores } = useQualityScore();

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
  
  // Função para gerar objetivos baseados nos resultados do QualityScore
  const gerarObjetivosDoQualityScore = async () => {
    setGerandoObjetivos(true);
    
    try {
      const objetivosCriados = gerarObjetivosDosResultadosQS(dadosProcessados);
      
      if (objetivosCriados.length > 0) {
        alert(`${objetivosCriados.length} objetivo(s) criado(s) com sucesso baseado(s) nos resultados do QualityScore:\n\n${objetivosCriados.join('\n')}\n\nVisite a área Goals para gerenciá-los.`);
        
        // Redirecionar para Goals após 2 segundos
        setTimeout(() => {
          window.location.hash = '#goals-objetivos';
        }, 2000);
      } else {
        alert('Não foi possível criar objetivos. Todos os pilares já estão com bom nível de maturidade ou já existem objetivos similares.');
      }
    } catch (error) {
      console.error('Erro ao gerar objetivos:', error);
      alert('Erro ao gerar objetivos. Tente novamente.');
    } finally {
      setGerandoObjetivos(false);
    }
  };

  // Dados para o gráfico de radar
  const dadosRadar = dadosProcessados.scoresPorPilar.map(item => ({
    pilar: item.pilar.split(' ')[0], // Primeira palavra para economizar espaço
    score: item.score,
    fullName: item.pilar
  }));

  // Preparar dados para RadarChartPersonas e MapaLinhaPilar
  const dadosPersonas = useMemo(() => {
    // Dados de exemplo da TechCorp
    return [
      {
        id: 'persona1',
        nome: 'Ana Silva',
        empresa: 'TechCorp Brasil',
        cargo: 'QA Lead',
        respostas: {
          'Processos e Estratégias': 4.17,
          'Testes Automatizados': 3.82,
          'Métricas': 3.56,
          'Documentações': 4.03,
          'Modalidades de Testes': 3.91,
          'QAOPS': 3.28,
          'Liderança': 4.51,
        }
      },
      {
        id: 'persona2',
        nome: 'Carlos Santos',
        empresa: 'TechCorp Brasil',
        cargo: 'Senior QA',
        respostas: {
          'Processos e Estratégias': 3.84,
          'Testes Automatizados': 4.53,
          'Métricas': 3.21,
          'Documentações': 3.47,
          'Modalidades de Testes': 4.19,
          'QAOPS': 4.02,
          'Liderança': 2.98,
        }
      },
      {
        id: 'persona3',
        nome: 'Maria Oliveira',
        empresa: 'TechCorp Brasil',
        cargo: 'QA Analyst',
        respostas: {
          'Processos e Estratégias': 2.96,
          'Testes Automatizados': 2.74,
          'Métricas': 2.51,
          'Documentações': 3.18,
          'Modalidades de Testes': 3.47,
          'QAOPS': 1.95,
          'Liderança': 2.83,
        }
      }
    ];
  }, [selectedQualityScore]);

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
          <TabsTrigger value="top-divergencia" className="text-xs px-2 py-2">
            Top Divergência
          </TabsTrigger>
          <TabsTrigger value="linha-pilar" className="text-xs px-2 py-2">
            Linha Pilar
          </TabsTrigger>
          <TabsTrigger value="analise" className="text-xs px-2 py-2">
            Análise
          </TabsTrigger>
          <TabsTrigger value="acoes" className="text-xs px-2 py-2">
            Ações
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

          {/* Ações Inteligentes para Goals */}
          {dadosProcessados.scoresPorPilar.some(p => p.score < 3.0) && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Ações Inteligentes
                </CardTitle>
                <CardDescription>
                  Identifiquei {dadosProcessados.scoresPorPilar.filter(p => p.score < 3.0).length} pilar(es) com oportunidades de melhoria. 
                  Crie objetivos automáticos para elevar o nível de maturidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Pilares que precisam de atenção:</div>
                    <div className="flex flex-wrap gap-2">
                      {dadosProcessados.scoresPorPilar
                        .filter(p => p.score < 3.0)
                        .map(pilar => (
                          <Badge key={pilar.categoria} variant="outline" className="border-orange-300 text-orange-700">
                            {pilar.pilar} ({pilar.score.toFixed(1)})
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <Button 
                    onClick={gerarObjetivosDoQualityScore}
                    disabled={gerandoObjetivos}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    {gerandoObjetivos ? 'Criando Objetivos...' : 'Criar Objetivos Goals'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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

        {/* Top Divergência */}
        <TabsContent value="top-divergencia">
          <MapaDivergencia personas={dadosPersonas} />
        </TabsContent>

        {/* Linha Pilar */}
        <TabsContent value="linha-pilar">
          <MapaLinhaPilar personas={dadosPersonas} />
        </TabsContent>

        {/* Análise */}
        <TabsContent value="analise">
          <HeatmapDivergencia personas={dadosPersonas} />
        </TabsContent>

        {/* Ações - Recomendações Inteligentes */}
        <TabsContent value="acoes" className="space-y-6">
          {/* Ação Rápida para Goals */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Geração Inteligente de Objetivos
              </CardTitle>
              <CardDescription>
                Transforme automaticamente os resultados do QualityScore em objetivos estratégicos no sistema Goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Oportunidades Identificadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {dadosProcessados.scoresPorPilar
                      .filter(p => p.score < 3.0)
                      .map(pilar => (
                        <Badge key={pilar.categoria} variant="outline" className="border-orange-300 text-orange-700">
                          {pilar.pilar} ({pilar.score.toFixed(1)})
                        </Badge>
                      ))}
                  </div>
                </div>
                <Button 
                  onClick={gerarObjetivosDoQualityScore}
                  disabled={gerandoObjetivos || dadosProcessados.scoresPorPilar.filter(p => p.score < 3.0).length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {gerandoObjetivos ? 'Criando...' : 'Criar Objetivos Goals'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              {dadosProcessados.scoresPorPilar.filter(p => p.score < 3.0).length === 0 && (
                <div className="text-center py-4 text-green-700">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Parabéns! Todos os pilares estão com bom nível de maturidade (≥ 3.0)</p>
                </div>
              )}
            </CardContent>
          </Card>

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
      </Tabs>
    </div>
  );
}