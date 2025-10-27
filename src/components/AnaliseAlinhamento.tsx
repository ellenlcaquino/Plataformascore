import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Info, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Users,
  Settings,
  Bot,
  FileText,
  TestTube,
  Infinity
} from 'lucide-react';

interface PersonaData {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  respostas: Record<string, number>;
}

interface AnaliseAlinhamentoProps {
  personas?: PersonaData[];
}

// Mapeamento dos pilares com suas perguntas (IDs do QualityScore)
const PILLAR_QUESTION_MAPPING = {
  'Processos e Estratégias': {
    questions: Array.from({length: 16}, (_, i) => `process${i + 1}`),
    icon: Settings,
    color: '#3b82f6'
  },
  'Testes Automatizados': {
    questions: Array.from({length: 16}, (_, i) => `auto${i + 1}`),
    icon: Bot,
    color: '#10b981'
  },
  'Métricas': {
    questions: Array.from({length: 14}, (_, i) => `metric${i + 1}`),
    icon: BarChart3,
    color: '#f59e0b'
  },
  'Documentações': {
    questions: Array.from({length: 11}, (_, i) => `doc${i + 1}`),
    icon: FileText,
    color: '#ef4444'
  },
  'Modalidades de Testes': {
    questions: Array.from({length: 12}, (_, i) => `test${i + 1}`),
    icon: TestTube,
    color: '#8b5cf6'
  },
  'QAOPS': {
    questions: Array.from({length: 10}, (_, i) => `qaops${i + 1}`),
    icon: Infinity,
    color: '#06b6d4'
  },
  'Liderança': {
    questions: Array.from({length: 12}, (_, i) => `leader${i + 1}`),
    icon: Users,
    color: '#84cc16'
  }
};

// Lista de perguntas que são textuais e devem ser excluídas dos cálculos numéricos
const TEXTUAL_QUESTION_IDS = new Set(['test12']);

// Dados de exemplo para demonstração
const DADOS_EXEMPLO = [
  {
    id: 'persona1',
    nome: 'Ana Silva',
    empresa: 'TechCorp',
    cargo: 'QA Lead',
    respostas: {
      'leader1': 5, 'leader2': 5, 'leader3': 4, 'leader4': 5, 'leader5': 4,
      'auto1': 3, 'auto2': 4, 'auto3': 3, 'process1': 4, 'process2': 5,
      'metric1': 4, 'metric2': 3, 'doc1': 5, 'test1': 4, 'qaops1': 3
    }
  },
  {
    id: 'persona2',
    nome: 'Carlos Santos',
    empresa: 'TechCorp',
    cargo: 'Senior QA',
    respostas: {
      'leader1': 3, 'leader2': 3, 'leader3': 3, 'leader4': 3, 'leader5': 2,
      'auto1': 5, 'auto2': 5, 'auto3': 4, 'process1': 3, 'process2': 4,
      'metric1': 2, 'metric2': 3, 'doc1': 3, 'test1': 5, 'qaops1': 4
    }
  },
  {
    id: 'persona3',
    nome: 'Maria Oliveira',
    empresa: 'TechCorp',
    cargo: 'QA Analyst',
    respostas: {
      'leader1': 3, 'leader2': 3, 'leader3': 2, 'leader4': 3, 'leader5': 2,
      'auto1': 2, 'auto2': 3, 'auto3': 3, 'process1': 3, 'process2': 3,
      'metric1': 3, 'metric2': 4, 'doc1': 4, 'test1': 3, 'qaops1': 2
    }
  }
];

type FiltroTipo = 'divergencias' | 'convergencias' | 'todas';

export function AnaliseAlinhamento({ personas = DADOS_EXEMPLO }: AnaliseAlinhamentoProps) {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('divergencias');
  const [activeTab, setActiveTab] = useState('scatter');

  // Debug: Log dos dados recebidos
  console.log('🔍 AnaliseAlinhamento - Dados recebidos:', {
    totalPersonas: personas.length,
    primeiraPersona: personas[0],
    exemplosRespostas: personas[0]?.respostas ? Object.entries(personas[0].respostas).slice(0, 10) : 'Sem respostas'
  });

  // Análise das perguntas individuais
  const analisePerguntas = useMemo(() => {
    const todasAsPerguntas: string[] = [];
    Object.values(PILLAR_QUESTION_MAPPING).forEach(pilar => {
      todasAsPerguntas.push(...pilar.questions);
    });

    // Filtrar perguntas textuais que não devem ser incluídas nos cálculos
    const perguntasNumericas = todasAsPerguntas.filter(perguntaId => !TEXTUAL_QUESTION_IDS.has(perguntaId));

    const analises = perguntasNumericas.map(perguntaId => {
      // Coletar respostas dos personas
      const respostas: number[] = [];
      
      personas.forEach(persona => {
        if (persona.respostas && persona.respostas[perguntaId] !== undefined) {
          const valor = persona.respostas[perguntaId];
          if (typeof valor === 'number' && valor >= 0 && valor <= 5) {
            respostas.push(valor);
          }
        }
      });
      
      // Verificar se temos dados suficientes para análise
      if (respostas.length < 2) {
        return null;
      }

      const media = respostas.reduce((a, b) => a + b, 0) / respostas.length;
      const variancia = respostas.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / respostas.length;
      const desvio = Math.sqrt(variancia);
      const amplitude = Math.max(...respostas) - Math.min(...respostas);
      
      // Encontrar pilar da pergunta
      const pilar = Object.entries(PILLAR_QUESTION_MAPPING).find(([_, config]) => 
        config.questions.includes(perguntaId)
      )?.[0] || 'Desconhecido';

      return {
        perguntaId,
        pilar,
        media: Number(media.toFixed(2)),
        desvio: Number(desvio.toFixed(2)),
        amplitude: Number(amplitude.toFixed(2)),
        min: Math.min(...respostas),
        max: Math.max(...respostas),
        respostas,
        nivelRisco: amplitude >= 3.0 ? 'crítico' : amplitude >= 2.0 ? 'alto' : amplitude >= 1.0 ? 'moderado' : 'baixo'
      };
    }).filter(Boolean) as Array<{
      perguntaId: string;
      pilar: string;
      media: number;
      desvio: number;
      amplitude: number;
      min: number;
      max: number;
      respostas: number[];
      nivelRisco: string;
    }>;

    console.log('📊 Análise de Alinhamento - Perguntas processadas:', analises.length);
    console.log('📊 Total de personas:', personas.length);
    if (analises.length > 0) {
      console.log('📊 Primeira análise:', analises[0]);
    }

    return analises;
  }, [personas]);

  // Filtrar dados baseado no filtro ativo
  const dadosFiltrados = useMemo(() => {
    switch (filtroAtivo) {
      case 'divergencias':
        return analisePerguntas
          .filter(item => item.amplitude >= 1.5)
          .sort((a, b) => b.amplitude - a.amplitude);
      case 'convergencias':
        return analisePerguntas
          .filter(item => item.amplitude < 1.5)
          .sort((a, b) => a.amplitude - b.amplitude);
      case 'todas':
      default:
        return analisePerguntas.sort((a, b) => b.amplitude - a.amplitude);
    }
  }, [analisePerguntas, filtroAtivo]);

  // Dados para scatter plot
  const scatterData = dadosFiltrados.map((item, index) => ({
    ...item,
    id: index,
    quadrante: getQuadrante(item.media, item.amplitude)
  }));

  // Top 10 divergências para o ranking
  const topDivergencias = useMemo(() => {
    return analisePerguntas
      .sort((a, b) => b.desvio - a.desvio)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        ranking: index + 1
      }));
  }, [analisePerguntas]);

  // Análise por pilar para heatmap
  const heatmapData = useMemo(() => {
    const pilarAnalysis = Object.entries(PILLAR_QUESTION_MAPPING).map(([pilarNome, config]) => {
      const perguntasPilar = analisePerguntas.filter(item => item.pilar === pilarNome);
      if (perguntasPilar.length === 0) return null;

      const amplitudeMedia = perguntasPilar.reduce((sum, item) => sum + item.amplitude, 0) / perguntasPilar.length;
      const mediaGeral = perguntasPilar.reduce((sum, item) => sum + item.media, 0) / perguntasPilar.length;

      return {
        pilar: pilarNome,
        amplitudeMedia: Number(amplitudeMedia.toFixed(2)),
        mediaGeral: Number(mediaGeral.toFixed(2)),
        totalPerguntas: perguntasPilar.length,
        criticas: perguntasPilar.filter(p => p.amplitude >= 3.0).length,
        altas: perguntasPilar.filter(p => p.amplitude >= 2.0 && p.amplitude < 3.0).length,
        color: config.color,
        icon: config.icon
      };
    }).filter(Boolean) as Array<{
      pilar: string;
      amplitudeMedia: number;
      mediaGeral: number;
      totalPerguntas: number;
      criticas: number;
      altas: number;
      color: string;
      icon: any;
    }>;

    return pilarAnalysis.sort((a, b) => b.amplitudeMedia - a.amplitudeMedia);
  }, [analisePerguntas]);

  function getQuadrante(media: number, amplitude: number) {
    if (media >= 3.5 && amplitude < 1.5) return 'excelente';
    if (media >= 3.5 && amplitude >= 1.5) return 'alinhamento';
    if (media < 3.5 && amplitude >= 1.5) return 'critico';
    return 'oportunidade';
  }

  function getCorQuadrante(quadrante: string) {
    switch (quadrante) {
      case 'excelente': return '#16a34a';
      case 'alinhamento': return '#f59e0b';
      case 'critico': return '#dc2626';
      case 'oportunidade': return '#3b82f6';
      default: return '#64748b';
    }
  }

  function getCorAmplitude(amplitude: number) {
    if (amplitude >= 3.0) return '#dc2626';
    if (amplitude >= 2.0) return '#ea580c';
    if (amplitude >= 1.0) return '#d97706';
    return '#16a34a';
  }

  function getCorDesvio(desvio: number) {
    if (desvio >= 1.5) return '#dc2626';
    if (desvio >= 1.0) return '#ea580c';
    if (desvio >= 0.5) return '#d97706';
    return '#3b82f6';
  }

  // Verificar se há dados suficientes para análise
  const temDadosSuficientes = analisePerguntas.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Análise de Alinhamento</h2>
        <p className="text-gray-600">
          Análise detalhada de convergências e divergências baseada nas 91 perguntas individuais
        </p>
        {!temDadosSuficientes && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ Dados insuficientes para análise. Certifique-se de que há dados importados ou pelo menos 2 participantes.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Encontradas {analisePerguntas.length} perguntas válidas de {personas.length} persona(s).
            </p>
          </div>
        )}
      </div>

      {!temDadosSuficientes && (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Insuficientes</h3>
            <p className="text-gray-600 mb-4">
              Para realizar a análise de alinhamento, são necessários dados de pelo menos 2 participantes com respostas válidas.
            </p>
            <div className="text-sm text-gray-500">
              <p>Status atual:</p>
              <p>• Participantes: {personas.length}</p>
              <p>• Perguntas analisáveis: {analisePerguntas.length}</p>
            </div>
          </div>
        </Card>
      )}

      {temDadosSuficientes && (
        <>
          {/* Filtro Inteligente */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Filtro Inteligente</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{dadosFiltrados.length} perguntas</span>
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{personas.length} participantes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={filtroAtivo === 'divergencias' ? 'default' : 'outline'}
                onClick={() => setFiltroAtivo('divergencias')}
                className="flex items-center gap-2 h-auto py-3"
              >
                <TrendingUp className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Divergências</div>
                  <div className="text-xs opacity-70">
                    {analisePerguntas.filter(item => item.amplitude >= 1.5).length} perguntas
                  </div>
                </div>
              </Button>

              <Button
                variant={filtroAtivo === 'convergencias' ? 'default' : 'outline'}
                onClick={() => setFiltroAtivo('convergencias')}
                className="flex items-center gap-2 h-auto py-3"
              >
                <Target className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Convergências</div>
                  <div className="text-xs opacity-70">
                    {analisePerguntas.filter(item => item.amplitude < 1.5).length} perguntas
                  </div>
                </div>
              </Button>

              <Button
                variant={filtroAtivo === 'todas' ? 'default' : 'outline'}
                onClick={() => setFiltroAtivo('todas')}
                className="flex items-center gap-2 h-auto py-3"
              >
                <Activity className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Todas</div>
                  <div className="text-xs opacity-70">
                    {analisePerguntas.length} perguntas totais
                  </div>
                </div>
              </Button>
            </div>
          </Card>

          {/* Representações Gráficas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="scatter" className="flex items-center gap-2 py-3">
                <BarChart3 className="h-4 w-4" />
                Mapa de Risco
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2 py-3">
                <Activity className="h-4 w-4" />
                Radar de Alinhamento
              </TabsTrigger>
              <TabsTrigger value="ranking" className="flex items-center gap-2 py-3">
                <TrendingDown className="h-4 w-4" />
                Ranking de Divergências
              </TabsTrigger>
            </TabsList>

            {/* Scatter Plot - Mapa de Risco */}
            <TabsContent value="scatter" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de Risco - Análise por Quadrantes</CardTitle>
                  <CardDescription>
                    Cada ponto representa uma pergunta. Posição indica performance vs alinhamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={scatterData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="media"
                          domain={[0, 5]}
                          label={{ value: 'Média das Respostas', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="amplitude"
                          domain={[0, 5]}
                          label={{ value: 'Amplitude de Divergência', angle: -90, position: 'insideLeft' }}
                        />
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                                  <p className="font-medium text-gray-900 mb-2">
                                    {data.perguntaId} - {data.pilar}
                                  </p>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Média:</span>
                                      <span className="font-medium">{data.media}/5.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Amplitude:</span>
                                      <span className="font-medium">{data.amplitude}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Quadrante:</span>
                                      <Badge style={{ backgroundColor: getCorQuadrante(data.quadrante), color: 'white' }}>
                                        {data.quadrante}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter dataKey="amplitude">
                          {scatterData.map((entry, index) => (
                            <Cell key={`scatter-${index}`} fill={getCorQuadrante(entry.quadrante)} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legenda dos Quadrantes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Performance Excelente</div>
                        <div className="text-xs text-gray-600">Alta média + Baixa amplitude</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Precisa Alinhamento</div>
                        <div className="text-xs text-gray-600">Alta média + Alta amplitude</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Área Crítica</div>
                        <div className="text-xs text-gray-600">Baixa média + Alta amplitude</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Oportunidade Consensual</div>
                        <div className="text-xs text-gray-600">Baixa média + Baixa amplitude</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Heatmap - Radar de Alinhamento */}
            <TabsContent value="heatmap" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Radar de Alinhamento por Pilar</CardTitle>
                  <CardDescription>
                    Amplitude média de divergência por pilar. Cores indicam intensidade do desalinhamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={heatmapData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          domain={[0, 5]}
                          label={{ value: 'Amplitude Média de Divergência', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="pilar" 
                          width={140}
                          tick={{ fontSize: 11 }}
                        />
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg">
                                  <p className="font-medium text-gray-900 mb-2">{data.pilar}</p>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Amplitude Média:</span>
                                      <span className="font-medium">{data.amplitudeMedia}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Performance Média:</span>
                                      <span className="font-medium">{data.mediaGeral}/5.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Perguntas Críticas:</span>
                                      <span className="text-red-600 font-medium">{data.criticas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total de Perguntas:</span>
                                      <span>{data.totalPerguntas}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="amplitudeMedia" radius={[0, 4, 4, 0]}>
                          {heatmapData.map((entry, index) => (
                            <Cell key={`heatmap-${index}`} fill={getCorAmplitude(entry.amplitudeMedia)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Cards de Análise por Pilar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {heatmapData.slice(0, 6).map((pilar) => {
                      const IconComponent = pilar.icon;
                      return (
                        <Card key={pilar.pilar} className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent className="h-5 w-5" style={{ color: pilar.color }} />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{pilar.pilar}</h4>
                              <p className="text-xs text-gray-600">{pilar.totalPerguntas} perguntas</p>
                            </div>
                            <div className="text-right">
                              <div 
                                className="text-lg font-bold"
                                style={{ color: getCorAmplitude(pilar.amplitudeMedia) }}
                              >
                                {pilar.amplitudeMedia}
                              </div>
                              <div className="text-xs text-gray-600">amplitude</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Performance:</span>
                              <span className="font-medium">{pilar.mediaGeral}/5.0</span>
                            </div>
                            {pilar.criticas > 0 && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{pilar.criticas} pergunta(s) crítica(s)</span>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ranking de Divergências */}
            <TabsContent value="ranking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Divergências por Desvio Padrão</CardTitle>
                  <CardDescription>
                    As perguntas com maior dispersão de respostas entre participantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topDivergencias} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          domain={[0, 'dataMax']}
                          label={{ value: 'Desvio Padrão', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="perguntaId" 
                          width={80}
                          tick={{ fontSize: 10 }}
                        />
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                                  <p className="font-medium text-gray-900 mb-2">
                                    #{data.ranking} - {data.perguntaId}
                                  </p>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Pilar:</span>
                                      <span className="font-medium">{data.pilar}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Desvio Padrão:</span>
                                      <span className="font-medium">{data.desvio}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Média:</span>
                                      <span className="font-medium">{data.media}/5.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Amplitude:</span>
                                      <span className="font-medium">{data.amplitude}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Nível de Risco:</span>
                                      <Badge style={{ backgroundColor: getCorAmplitude(data.amplitude), color: 'white' }}>
                                        {data.nivelRisco}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="desvio" radius={[0, 4, 4, 0]}>
                          {topDivergencias.map((entry, index) => (
                            <Cell key={`ranking-${index}`} fill={getCorDesvio(entry.desvio)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Lista detalhada do ranking */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Detalhes do Ranking</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topDivergencias.slice(0, 6).map((item) => {
                        const PilarIcon = PILLAR_QUESTION_MAPPING[item.pilar as keyof typeof PILLAR_QUESTION_MAPPING]?.icon || Info;
                        const pilarColor = PILLAR_QUESTION_MAPPING[item.pilar as keyof typeof PILLAR_QUESTION_MAPPING]?.color || '#64748b';
                        
                        return (
                          <Card key={item.perguntaId} className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                style={{ backgroundColor: getCorDesvio(item.desvio) }}
                              >
                                #{item.ranking}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <PilarIcon className="h-4 w-4" style={{ color: pilarColor }} />
                                  <span className="font-medium text-sm">{item.perguntaId}</span>
                                </div>
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: pilarColor, 
                                    color: pilarColor,
                                    backgroundColor: pilarColor + '10'
                                  }}
                                >
                                  {item.pilar}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Desvio Padrão:</span>
                                <span className="font-medium">{item.desvio}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Média:</span>
                                <span className="font-medium">{item.media}/5.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Amplitude:</span>
                                <span className="font-medium">{item.amplitude}</span>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Tabela Detalhada Expandível */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada de Perguntas</CardTitle>
              <CardDescription>
                Explore cada pergunta individualmente com métricas detalhadas e interpretações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosFiltrados.slice(0, 20).map((item, index) => {
                  const PilarIcon = PILLAR_QUESTION_MAPPING[item.pilar as keyof typeof PILLAR_QUESTION_MAPPING]?.icon || Info;
                  const pilarColor = PILLAR_QUESTION_MAPPING[item.pilar as keyof typeof PILLAR_QUESTION_MAPPING]?.color || '#64748b';
                  
                  return (
                    <Collapsible key={item.perguntaId} className="border rounded-lg">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full p-4 h-auto justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: getCorAmplitude(item.amplitude) }}
                              >
                                #{index + 1}
                              </div>
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: pilarColor, 
                                  color: pilarColor,
                                  backgroundColor: pilarColor + '10'
                                }}
                              >
                                <PilarIcon className="h-3 w-3 mr-1" />
                                {item.pilar}
                              </Badge>
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.perguntaId}</div>
                              <div className="text-sm text-gray-600">
                                Média: {item.media}/5.0 • Amplitude: {item.amplitude}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge 
                                      style={{ 
                                        backgroundColor: getCorAmplitude(item.amplitude), 
                                        color: 'white' 
                                      }}
                                    >
                                      {item.nivelRisco}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Nível de risco baseado na amplitude de divergência</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                          {/* Estatísticas */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-700">Estatísticas</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Média:</span>
                                <span className="font-medium">{item.media}/5.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Desvio Padrão:</span>
                                <span className="font-medium">{item.desvio}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Amplitude:</span>
                                <span className="font-medium">{item.amplitude}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Variação:</span>
                                <span className="font-medium">{item.min} - {item.max}</span>
                              </div>
                            </div>
                          </div>

                          {/* Distribuição */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-700">Distribuição de Respostas</h5>
                            <div className="space-y-2">
                              {[5, 4, 3, 2, 1].map(nota => {
                                const count = item.respostas.filter(r => r === nota).length;
                                const percentage = count > 0 ? (count / item.respostas.length) * 100 : 0;
                                
                                return (
                                  <div key={nota} className="flex items-center gap-2 text-sm">
                                    <span className="w-8">{nota}★</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="w-12 text-right">{count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Interpretação */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-700">Interpretação</h5>
                            <div className="space-y-2 text-sm">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium mb-1">Nível de Risco</div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    style={{ 
                                      backgroundColor: getCorAmplitude(item.amplitude), 
                                      color: 'white' 
                                    }}
                                  >
                                    {item.nivelRisco}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600">
                                {item.amplitude >= 3.0 && "Alta divergência indica opiniões muito diferentes entre participantes."}
                                {item.amplitude >= 2.0 && item.amplitude < 3.0 && "Divergência moderada sugere diferenças significativas de opinião."}
                                {item.amplitude >= 1.0 && item.amplitude < 2.0 && "Divergência baixa mostra opiniões relativamente alinhadas."}
                                {item.amplitude < 1.0 && "Convergência alta indica consenso entre participantes."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}