import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Clock, CheckCircle2, Settings, Bot, BarChart3, TestTube, FileText, Infinity, Users } from 'lucide-react';

interface PreenchimentoProps {
  assessmentResults?: any;
}

export function Preenchimento({ assessmentResults }: PreenchimentoProps) {
  const pillarData = [
    { id: 'processes', name: 'Processos e Estratégias', icon: Settings, questions: 16, prefix: 'process' },
    { id: 'automation', name: 'Automações', icon: Bot, questions: 14, prefix: 'auto' },
    { id: 'metrics', name: 'Métricas', icon: BarChart3, questions: 12, prefix: 'metric' },
    { id: 'testModalities', name: 'Modalidades de Testes', icon: TestTube, questions: 15, prefix: 'test' },
    { id: 'documentation', name: 'Documentações', icon: FileText, questions: 11, prefix: 'doc' },
    { id: 'qaops', name: 'QAOps', icon: Infinity, questions: 13, prefix: 'qaops' },
    { id: 'leadership', name: 'Liderança', icon: Users, questions: 14, prefix: 'leader' }
  ];

  const totalQuestions = pillarData.reduce((sum, pillar) => sum + pillar.questions, 0);

  let answeredQuestions = 0;
  let completedPillars = 0;

  if (assessmentResults) {
    answeredQuestions = Object.keys(assessmentResults).length;
    
    pillarData.forEach(pillar => {
      const pillarAnswers = Array.from({length: pillar.questions}, (_, i) => 
        assessmentResults[`${pillar.prefix}${i + 1}`]
      ).filter(answer => answer !== undefined).length;
      
      if (pillarAnswers === pillar.questions) {
        completedPillars++;
      }
    });
  }

  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);
  const pillarProgress = Math.round((completedPillars / pillarData.length) * 100);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl tracking-tight">Progresso da Avaliação</h1>
        <p className="text-muted-foreground text-lg">
          Acompanhe o progresso da sua avaliação de qualidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresso Geral
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-3">{overallProgress}%</div>
            <Progress value={overallProgress} className="mb-3 h-2" />
            <p className="text-sm text-muted-foreground">
              {answeredQuestions} de {totalQuestions} perguntas respondidas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pilares Completos
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-3">{completedPillars}/7</div>
            <Progress value={pillarProgress} className="mb-3 h-2" />
            <p className="text-sm text-muted-foreground">
              {completedPillars === 0 ? 'Nenhum pilar concluído ainda' : 
               completedPillars === 7 ? 'Todos os pilares concluídos!' :
               `${completedPillars} pilar${completedPillars > 1 ? 'es' : ''} concluído${completedPillars > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Estimado
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl tracking-tight mb-3">
              {overallProgress === 100 ? '✓' : Math.round(45 * (1 - overallProgress / 100))}
            </div>
            <p className="text-sm text-muted-foreground">
              {overallProgress === 100 ? 'Avaliação concluída!' : 'minutos restantes (estimativa)'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso por Pilar */}
      {assessmentResults && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl">Progresso por Pilar</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {pillarData.map(pillar => {
                const pillarAnswers = Array.from({length: pillar.questions}, (_, i) => 
                  assessmentResults[`${pillar.prefix}${i + 1}`]
                ).filter(answer => answer !== undefined).length;
                
                const pillarPercentage = Math.round((pillarAnswers / pillar.questions) * 100);
                const IconComponent = pillar.icon;

                return (
                  <div key={pillar.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{pillar.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {pillarAnswers}/{pillar.questions} ({pillarPercentage}%)
                      </div>
                    </div>
                    <Progress 
                      value={pillarPercentage} 
                      className="h-2 bg-muted/50"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Status do Preenchimento</CardTitle>
        </CardHeader>
        <CardContent>
          {!assessmentResults ? (
            <>
              <p className="text-muted-foreground">
                Inicie o preenchimento da avaliação na seção <strong>Formulário</strong> para
                acompanhar seu progresso aqui. Esta área mostrará:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-1 text-muted-foreground">
                <li>Progresso detalhado por pilar</li>
                <li>Questões pendentes</li>
                <li>Tempo estimado para conclusão</li>
                <li>Últimas respostas salvas</li>
              </ul>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {overallProgress === 100 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
                <span className="font-medium">
                  {overallProgress === 100 ? 'Avaliação Concluída!' : 'Avaliação em Andamento'}
                </span>
              </div>
              
              {overallProgress === 100 ? (
                <p className="text-muted-foreground">
                  Parabéns! Você completou toda a avaliação. Veja seus resultados na seção <strong>Resultados</strong>.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Continue a avaliação na seção <strong>Formulário</strong> para completar os pilares restantes.
                  </p>
                  <div className="text-sm">
                    <strong>Próximos pilares a completar:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                      {pillarData
                        .filter(pillar => {
                          const pillarAnswers = Array.from({length: pillar.questions}, (_, i) => 
                            assessmentResults[`${pillar.prefix}${i + 1}`]
                          ).filter(answer => answer !== undefined).length;
                          return pillarAnswers < pillar.questions;
                        })
                        .slice(0, 3)
                        .map(pillar => (
                          <li key={pillar.id} className="text-muted-foreground">
                            {pillar.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}