import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, Users, Target, TrendingUp, ExternalLink, Eye } from 'lucide-react';

interface DashboardProps {
  assessmentResults?: any;
  onSectionChange?: (section: string) => void;
}

export function Dashboard({ assessmentResults, onSectionChange }: DashboardProps) {
  const pillarData = [
    { prefix: 'process', questions: 16, name: 'Processos e Estratégias' },
    { prefix: 'auto', questions: 14, name: 'Automações' },
    { prefix: 'metric', questions: 12, name: 'Métricas' },
    { prefix: 'test', questions: 15, name: 'Modalidades de Testes' },
    { prefix: 'doc', questions: 11, name: 'Documentações' },
    { prefix: 'qaops', questions: 13, name: 'QAOps' },
    { prefix: 'leader', questions: 14, name: 'Liderança' }
  ];

  const totalQuestions = pillarData.reduce((sum, pillar) => sum + pillar.questions, 0);

  let overallScore = 0;
  let completedPillars = 0;
  let answeredQuestions = 0;
  let recommendations: string[] = [];

  if (assessmentResults) {
    answeredQuestions = Object.keys(assessmentResults).length;
    
    let totalScore = 0;
    let maxScore = 0;
    
    pillarData.forEach(pillar => {
      const pillarAnswers = Array.from({length: pillar.questions}, (_, i) => {
        const answer = assessmentResults[`${pillar.prefix}${i + 1}`];
        return answer !== undefined ? answer : 0;
      });
      
      const pillarScore = pillarAnswers.reduce((sum, score) => sum + score, 0);
      const pillarMax = pillar.questions * 5;
      const pillarPercentage = (pillarScore / pillarMax) * 100;
      
      totalScore += pillarScore;
      maxScore += pillarMax;
      
      if (pillarAnswers.filter(a => a !== 0).length === pillar.questions) {
        completedPillars++;
      }
      
      if (pillarPercentage < 60 && pillarAnswers.filter(a => a !== 0).length === pillar.questions) {
        recommendations.push(pillar.name);
      }
    });
    
    overallScore = Math.round((totalScore / maxScore) * 100);
  }

  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Visão geral dos resultados de qualidade da sua organização
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Total
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl tracking-tight mb-1 ${
              assessmentResults 
                ? overallScore >= 80 ? 'text-green-600' 
                : overallScore >= 60 ? 'text-blue-600'
                : overallScore >= 40 ? 'text-amber-600' 
                : 'text-red-600'
                : 'text-muted-foreground'
            }`}>
              {assessmentResults ? `${overallScore}%` : '--'}
            </div>
            <p className="text-sm text-muted-foreground">
              {assessmentResults ? 'Pontuação geral da avaliação' : 'Complete a avaliação para ver seu score'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pilares Avaliados
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-1">{completedPillars}/7</div>
            <p className="text-sm text-muted-foreground">
              Pilares de qualidade completados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresso
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-1">{progress}%</div>
            <p className="text-sm text-muted-foreground">
              Da avaliação completa
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximos Passos
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-1">
              {recommendations.length > 0 ? recommendations.length : '--'}
            </div>
            <p className="text-sm text-muted-foreground">
              {recommendations.length > 0 ? 'Áreas para melhorar' : 'Recomendações personalizadas'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl">
            {assessmentResults ? 'Status da Avaliação' : 'Bem-vindo ao QualityScore'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {assessmentResults ? (
            <div className="space-y-6">
              {progress === 100 ? (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-green-800 font-semibold mb-2">Avaliação Concluída!</h3>
                      <p className="text-green-700 mb-3">
                        Parabéns! Você completou toda a avaliação QualityScore. 
                        Sua pontuação geral é <strong>{overallScore}%</strong>.
                      </p>
                      <p className="text-green-700">
                        Confira seus resultados detalhados na seção <strong>Resultados</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-800 font-semibold mb-2">Avaliação em Andamento</h3>
                      <p className="text-blue-700 mb-3">
                        Você respondeu <strong>{answeredQuestions} de {totalQuestions}</strong> perguntas 
                        ({progress}% completo).
                      </p>
                      <p className="text-blue-700">
                        Continue na seção <strong>Formulário</strong> para completar a avaliação.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {recommendations.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <h4 className="text-amber-800 font-semibold mb-3">Áreas Prioritárias para Melhoria</h4>
                  <ul className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-center gap-2 text-amber-700">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                <h3 className="text-slate-800 font-semibold mb-3">Sobre o QualityScore</h3>
                <p className="text-slate-700 mb-4">
                  Para começar sua jornada de avaliação de qualidade, navegue até a seção 
                  <strong> Formulário</strong> e inicie sua primeira avaliação.
                </p>
                <p className="text-slate-700">
                  O QualityScore irá analisar 7 pilares fundamentais da qualidade em sua organização
                  e fornecer insights valiosos para melhoramento contínuo.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Demo Público */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Páginas Públicas de Compartilhamento
              </h3>
              <p className="text-blue-700 mb-4">
                Veja como ficam os resultados dos assessments quando compartilhados publicamente. 
                Ideal para apresentar resultados a stakeholders externos.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onSectionChange) {
                    onSectionChange('public-demo');
                  } else {
                    // Fallback para abrir em nova aba se não há callback
                    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=score/irricontrol-r1`;
                    window.open(demoUrl, '_blank');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}