import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { QualityMapAppLogo } from './QualityMapAppLogo';
import { usePublicQualityScore } from './usePublicQualityScore';
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
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

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

export function PublicQualityScore({ shareId }: PublicQualityScoreProps) {
  const { data, loading, error } = usePublicQualityScore(shareId);

  console.log('🎯 PublicQualityScore - Estado atual:', { shareId, loading, error, hasData: !!data });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando resultados...</h2>
          <p className="text-gray-600">Aguarde enquanto buscamos os dados do assessment</p>
          <div className="mt-4 text-sm text-gray-500">
            ShareId: {shareId}
          </div>
        </div>
      </div>
    );
  }

  // Se não há dados, sempre usar fallback mas não mostrar erro
  const displayData = data || {
    company: shareId.includes('irricontrol') ? 'IrriControl' : 'TechCorp Demo',
    assessmentTitle: 'QualityScore Assessment Demo',
    date: new Date().toLocaleDateString('pt-BR'),
    round: 'Demonstração',
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
      { level: 'Experiência', count: 3, percentage: 43, color: '#2563eb' },
      { level: 'Consciência', count: 4, percentage: 57, color: '#d97706' }
    ],
    keyInsights: [
      {
        type: 'success' as const,
        title: 'Pontos Fortes Identificados',
        description: 'Estratégia, Processos e Cultura mostram bom nível de maturidade, indicando uma base sólida para evolução.'
      },
      {
        type: 'warning' as const, 
        title: 'Oportunidades de Melhoria',
        description: 'Medição e Pessoas precisam de atenção especial para acelerar a jornada de maturidade em qualidade.'
      },
      {
        type: 'info' as const,
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
  };

  console.log('📊 Renderizando com dados:', displayData.company);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <QualityMapAppLogo size="lg" showText={true} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{displayData.company}</span>
              <Separator orientation="vertical" className="h-4" />
              <Calendar className="h-4 w-4" />
              <span>{displayData.date}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{displayData.round}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {displayData.assessmentTitle}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Relatório público dos resultados da avaliação de maturidade em qualidade de software
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </button>
              <div className="text-sm text-gray-500">
                Link público: /{shareId}
              </div>
            </div>
            
            {!data && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg inline-block">
                <div className="text-sm text-yellow-800 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Esta é uma demonstração com dados de exemplo
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Score Geral */}
        <section className="mb-12">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-4 mb-6">
                  <Award className="h-12 w-12 text-blue-600" />
                  <div>
                    <div className="text-6xl font-bold text-blue-900">{displayData.overallScore}</div>
                    <div className="text-sm text-gray-600">de 5.0</div>
                  </div>
                </div>
                
                <Badge 
                  className="px-6 py-2 text-lg mb-4"
                  style={{ 
                    backgroundColor: maturityColors[displayData.maturityLevel as keyof typeof maturityColors], 
                    color: 'white' 
                  }}
                >
                  Nível {displayData.maturityLevel}
                </Badge>
                
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  {getLevelDescription(displayData.maturityLevel)}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visão Geral dos Pilares */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Visão Geral por Pilar
                </CardTitle>
                <CardDescription>
                  Distribuição da maturidade nos 7 pilares de qualidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={displayData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 5]} 
                        tick={{ fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Maturidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribuição de Maturidade
                </CardTitle>
                <CardDescription>
                  Percentual de pilares por nível de maturidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={displayData.maturityDistribution.filter(item => item.count > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {displayData.maturityDistribution.filter(item => item.count > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${props.payload.count} pilares (${props.payload.percentage}%)`,
                          props.payload.level
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {displayData.maturityDistribution.filter(item => item.count > 0).map((item) => (
                    <div key={item.level} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {item.level} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detalhes dos Pilares */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resultados Detalhados por Pilar
              </CardTitle>
              <CardDescription>
                Pontuação individual e nível de maturidade de cada pilar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayData.pillars.map((pillar) => (
                  <div key={pillar.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                        <Badge 
                          style={{ 
                            backgroundColor: pillar.color, 
                            color: 'white' 
                          }}
                        >
                          {pillar.level}
                        </Badge>
                      </div>
                      <Progress 
                        value={(pillar.score / 5) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{pillar.score}</div>
                      <div className="text-sm text-gray-500">de 5.0</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Principais Insights */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Principais Insights
              </CardTitle>
              <CardDescription>
                Análise dos resultados e recomendações estratégicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayData.keyInsights.map((insight, index) => {
                  const icon = insight.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                              insight.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                              <Info className="h-5 w-5" />;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-6 rounded-lg border-2 ${
                        insight.type === 'success' ? 'border-green-200 bg-green-50' :
                        insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                        'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          insight.type === 'success' ? 'text-green-600' :
                          insight.type === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${
                            insight.type === 'success' ? 'text-green-800' :
                            insight.type === 'warning' ? 'text-yellow-800' :
                            'text-blue-800'
                          }`}>
                            {insight.title}
                          </h4>
                          <p className={`text-sm leading-relaxed ${
                            insight.type === 'success' ? 'text-green-700' :
                            insight.type === 'warning' ? 'text-yellow-700' :
                            'text-blue-700'
                          }`}>
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Quer saber mais sobre sua maturidade em qualidade?
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  O QualityMap App oferece assessments completos, análises detalhadas e 
                  roadmaps personalizados para acelerar sua jornada de qualidade de software.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                    Conhecer o QualityMap App
                  </button>
                  <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Agendar Demonstração
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <QualityMapAppLogo size="sm" showText={false} />
              <span>© 2025 QualityMap App. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Relatório gerado em {displayData.date}</span>
              <span>•</span>
              <span>ID: {displayData.shareId}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}