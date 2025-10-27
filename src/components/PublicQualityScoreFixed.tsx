import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { QualityMapAppLogo } from './QualityMapAppLogo';
import { 
  TrendingUp, 
  Calendar, 
  Building2, 
  Award, 
  Target, 
  BarChart3,
  PieChart,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Share2,
  Loader2,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Gauge
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, Pie, LineChart, Line, AreaChart, Area } from 'recharts';

interface PublicQualityScoreProps {
  shareId: string;
}

const maturityColors = {
  "Domínio": "#16a34a",
  "Experiência": "#2563eb", 
  "Consciência": "#d97706",
  "Inicialização": "#dc2626",
  "Agnóstico": "#64748b"
};

const getLevelDescription = (level: string) => {
  switch (level) {
    case "Domínio": return "Excelência e liderança em qualidade";
    case "Experiência": return "Práticas consolidadas e efetivas";
    case "Consciência": return "Conhecimento básico com implementação inicial";
    case "Inicialização": return "Início da jornada de qualidade";
    case "Agnóstico": return "Ausência de práticas estruturadas";
    default: return "";
  }
};

export function PublicQualityScoreFixed({ shareId }: PublicQualityScoreProps) {
  // Para demonstração, sempre usar dados consistentes
  const displayData = {
    company: shareId.includes('irricontrol') ? 'IrriControl' : shareId.includes('techcorp') ? 'TechCorp' : 'InnovaTech',
    assessmentTitle: 'QualityScore Assessment Q4 2024',
    date: '15 de Dezembro de 2024',
    round: 'Rodada 1',
    shareId,
    overallScore: 3.2,
    maturityLevel: 'Consciência',
    pillars: [
      { name: 'Processos e Estratégias', score: 3.8, level: 'Experiência', color: '#2563eb', trend: 'up', improvement: '+0.4' },
      { name: 'Automações', score: 2.9, level: 'Consciência', color: '#d97706', trend: 'stable', improvement: '+0.1' },
      { name: 'Métricas', score: 3.5, level: 'Experiência', color: '#2563eb', trend: 'up', improvement: '+0.3' },
      { name: 'Modalidades de Testes', score: 3.1, level: 'Consciência', color: '#d97706', trend: 'up', improvement: '+0.2' },
      { name: 'Documentações', score: 2.8, level: 'Consciência', color: '#d97706', trend: 'stable', improvement: '0.0' },
      { name: 'QAOps', score: 3.4, level: 'Experiência', color: '#2563eb', trend: 'up', improvement: '+0.5' },
      { name: 'Liderança', score: 2.7, level: 'Consciência', color: '#d97706', trend: 'down', improvement: '-0.1' }
    ],
    maturityDistribution: [
      { level: 'Experiência', count: 3, percentage: 43, color: '#2563eb' },
      { level: 'Consciência', count: 4, percentage: 57, color: '#d97706' }
    ],
    keyInsights: [
      {
        type: 'success' as const,
        title: 'Pontos Fortes Identificados',
        description: 'Processos e Estratégias, Métricas e QAOps mostram bom nível de maturidade, indicando uma base sólida para evolução.'
      },
      {
        type: 'warning' as const, 
        title: 'Oportunidades de Melhoria',
        description: 'Liderança, Documentações e Automações precisam de atenção especial para acelerar a jornada de maturidade.'
      },
      {
        type: 'info' as const,
        title: 'Próximos Passos Recomendados',
        description: 'Implementar programa de liderança em qualidade e melhorar documentação de processos e automações.'
      }
    ],
    radarData: [
      { pillar: 'Processos', score: 3.8, fullMark: 5 },
      { pillar: 'Automações', score: 2.9, fullMark: 5 },
      { pillar: 'Métricas', score: 3.5, fullMark: 5 },
      { pillar: 'Testes', score: 3.1, fullMark: 5 },
      { pillar: 'Documentações', score: 2.8, fullMark: 5 },
      { pillar: 'QAOps', score: 3.4, fullMark: 5 },
      { pillar: 'Liderança', score: 2.7, fullMark: 5 }
    ],
    trendData: [
      { month: 'Jun', score: 2.8 },
      { month: 'Jul', score: 2.9 },
      { month: 'Ago', score: 3.0 },
      { month: 'Set', score: 3.1 },
      { month: 'Out', score: 3.2 },
      { month: 'Nov', score: 3.2 },
      { month: 'Dez', score: 3.2 }
    ],
    benchmarkData: [
      { categoria: 'Sua Empresa', score: 3.2, color: '#2563eb' },
      { categoria: 'Mercado', score: 2.8, color: '#94a3b8' },
      { categoria: 'Top 10%', score: 4.2, color: '#16a34a' }
    ]
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayData.company} - ${displayData.assessmentTitle}`,
          text: `Confira os resultados do QualityScore Assessment da ${displayData.company}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2s"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4s"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <QualityMapAppLogo size="xl" showPoweredBy={true} />
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-gray-800">{displayData.company}</span>
                <Separator orientation="vertical" className="h-4" />
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{displayData.date}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {displayData.round}
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {displayData.assessmentTitle}
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Relatório público dos resultados da avaliação de maturidade em qualidade de software
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar Resultados
                </button>
                <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                  Link público: /{shareId}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl inline-block">
                <div className="text-sm text-amber-800 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Esta é uma demonstração com dados de exemplo
                </div>
              </div>
            </div>
          </header>

          {/* Score Principal com Gauge Visual */}
          <section className="mb-16">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 overflow-hidden">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                        <Gauge className="h-12 w-12 text-white" />
                      </div>
                      <div>
                        <div className="text-7xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                          {displayData.overallScore}
                        </div>
                        <div className="text-lg text-gray-600 font-medium">de 5.0</div>
                      </div>
                    </div>
                    
                    <Badge 
                      className="px-8 py-3 text-xl font-semibold mb-6 shadow-lg"
                      style={{ 
                        backgroundColor: maturityColors[displayData.maturityLevel as keyof typeof maturityColors], 
                        color: 'white' 
                      }}
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Nível {displayData.maturityLevel}
                    </Badge>
                    
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {getLevelDescription(displayData.maturityLevel)}
                    </p>
                  </div>
                  
                  {/* Gauge Chart Visual */}
                  <div className="flex justify-center">
                    <div className="relative w-80 h-80">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="20"
                          strokeLinecap="round"
                          strokeDasharray={`${(displayData.overallScore / 5) * 502.65} 502.65`}
                          className="transition-all duration-1000 ease-in-out"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{Math.round((displayData.overallScore / 5) * 100)}%</div>
                          <div className="text-sm text-gray-600">Maturidade</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Visão Geral com Gráficos Aprimorados */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Radar Chart Enhanced */}
              <Card className="lg:col-span-2 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    Análise Multidimensional
                  </CardTitle>
                  <CardDescription className="text-base">
                    Distribuição da maturidade nos 7 pilares de qualidade com benchmark de mercado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={displayData.radarData}>
                        <PolarGrid className="opacity-30" />
                        <PolarAngleAxis 
                          dataKey="pillar" 
                          tick={{ fontSize: 13, fontWeight: 500 }}
                          className="fill-gray-700"
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 5]} 
                          tick={{ fontSize: 11 }}
                          className="fill-gray-500"
                        />
                        <Radar
                          name="Sua Empresa"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.2}
                          strokeWidth={3}
                        />
                        <Radar
                          name="Benchmark Mercado"
                          dataKey={() => 2.8}
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.1}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Evolution */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Evolução Temporal
                  </CardTitle>
                  <CardDescription>
                    Progresso nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayData.trendData}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#10b981"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#trendGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <ArrowUp className="h-4 w-4" />
                      <span className="text-sm font-semibold">+14% nos últimos 6 meses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Benchmark Comparison */}
          <section className="mb-16">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Benchmark de Mercado
                </CardTitle>
                <CardDescription className="text-base">
                  Compare sua posição com a média do mercado e top performers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData.benchmarkData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="categoria" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                        {displayData.benchmarkData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Detalhes dos Pilares Aprimorados */}
          <section className="mb-16">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  Análise Detalhada por Pilar
                </CardTitle>
                <CardDescription className="text-base">
                  Pontuação individual, tendências e oportunidades de melhoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {displayData.pillars.map((pillar, index) => (
                    <div key={pillar.name} className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{pillar.name}</h4>
                            <Badge 
                              className="px-3 py-1 font-medium"
                              style={{ 
                                backgroundColor: pillar.color, 
                                color: 'white' 
                              }}
                            >
                              {pillar.level}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {pillar.trend === 'up' ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                              ) : pillar.trend === 'down' ? (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                              ) : (
                                <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                              )}
                              <span className={`text-sm font-medium ${
                                pillar.trend === 'up' ? 'text-green-600' :
                                pillar.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {pillar.improvement}
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={(pillar.score / 5) * 100} 
                            className="h-3 mb-2"
                          />
                          <div className="text-sm text-gray-600">
                            Progresso: {Math.round((pillar.score / 5) * 100)}% da meta
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-gray-900 mb-1">{pillar.score}</div>
                          <div className="text-sm text-gray-500">de 5.0</div>
                          <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            #{index + 1} Prioridade
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Insights Estratégicos Expandidos */}
          <section className="mb-16">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Insights Estratégicos
                </CardTitle>
                <CardDescription className="text-base">
                  Análise profunda dos resultados e roadmap estratégico para acelerar a maturidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Análise Executiva */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Análise Executiva
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Posicionamento Atual</h4>
                      <p className="text-gray-700 text-sm mb-4">
                        A organização encontra-se no nível <strong>Consciência</strong> (3.2/5.0), posicionando-se 
                        <strong> 14% acima da média do mercado</strong> (2.8/5.0), mas ainda com oportunidade 
                        de crescimento de <strong>31% para atingir o top 10%</strong> (4.2/5.0).
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">Desempenho acima do mercado</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Pontos de Alavancagem</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                          <span className="text-sm font-medium">Processos e Estratégias</span>
                          <Badge className="bg-blue-100 text-blue-800">Líder</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                          <span className="text-sm font-medium">QAOps</span>
                          <Badge className="bg-green-100 text-green-800">Crescimento</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                          <span className="text-sm font-medium">Liderança</span>
                          <Badge className="bg-orange-100 text-orange-800">Crítico</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights Principais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {displayData.keyInsights.map((insight, index) => {
                    const icon = insight.type === 'success' ? <CheckCircle className="h-6 w-6" /> :
                                insight.type === 'warning' ? <AlertTriangle className="h-6 w-6" /> :
                                <Info className="h-6 w-6" />;
                    
                    return (
                      <div 
                        key={index}
                        className={`p-8 rounded-2xl border-2 relative overflow-hidden ${
                          insight.type === 'success' ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' :
                          insight.type === 'warning' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' :
                          'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 p-3 rounded-xl shadow-lg ${
                            insight.type === 'success' ? 'text-white bg-gradient-to-br from-green-500 to-emerald-500' :
                            insight.type === 'warning' ? 'text-white bg-gradient-to-br from-yellow-500 to-orange-500' :
                            'text-white bg-gradient-to-br from-blue-500 to-indigo-500'
                          }`}>
                            {icon}
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <h4 className={`font-bold text-lg leading-tight ${
                                insight.type === 'success' ? 'text-green-800' :
                                insight.type === 'warning' ? 'text-yellow-800' :
                                'text-blue-800'
                              }`}>
                                {insight.title}
                              </h4>
                            </div>
                            <p className={`text-sm leading-relaxed ${
                              insight.type === 'success' ? 'text-green-700' :
                              insight.type === 'warning' ? 'text-yellow-700' :
                              'text-blue-700'
                            }`}>
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Decorative element */}
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 ${
                          insight.type === 'success' ? 'bg-green-400' :
                          insight.type === 'warning' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        } transform translate-x-8 -translate-y-8`}></div>
                      </div>
                    );
                  })}
                </div>

                {/* Roadmap Estratégico */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Roadmap Estratégico Recomendado
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Curto Prazo */}
                    <div className="bg-white rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="font-bold text-gray-900">Curto Prazo (3-6 meses)</h4>
                      </div>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Liderança:</strong> Implementar programa de capacitação em qualidade para líderes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Documentação:</strong> Padronizar templates e processos de documentação</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Automação:</strong> Identificar primeiros casos de uso para automação</span>
                        </li>
                      </ul>
                    </div>

                    {/* Médio Prazo */}
                    <div className="bg-white rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-bold text-gray-900">Médio Prazo (6-12 meses)</h4>
                      </div>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Centro de Excelência:</strong> Estabelecer CoE em qualidade de software</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Automação Avançada:</strong> Implementar pipeline de CI/CD completo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Métricas:</strong> Dashboard executivo de qualidade em tempo real</span>
                        </li>
                      </ul>
                    </div>

                    {/* Longo Prazo */}
                    <div className="bg-white rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <h4 className="font-bold text-gray-900">Longo Prazo (12+ meses)</h4>
                      </div>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Cultura de Qualidade:</strong> Qualidade como diferencial competitivo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Inteligência Artificial:</strong> IA para predição e prevenção de defeitos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Benchmarking:</strong> Referência de mercado em qualidade</span>
                        </li>
                      </ul>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <QualityMapAppLogo size="sm" />
                <span>© 2025 QualityMap App. Todos os direitos reservados.</span>
              </div>
              <div className="flex items-center gap-6">
                <span>Relatório gerado em {displayData.date}</span>
                <span>•</span>
                <span>ID: {displayData.shareId}</span>
                <span>•</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  QualityMap Certified
                </Badge>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}