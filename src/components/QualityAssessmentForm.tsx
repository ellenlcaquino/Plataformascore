import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft } from 'lucide-react';

// Definição das perguntas por pilar
const assessmentData = {
  "processos-estrategias": {
    title: "Processos e Estratégias",
    questions: [
      "A organização possui processos de QA claramente definidos e documentados?",
      "Existe um plano estratégico de qualidade alinhado aos objetivos de negócio?",
      "Os processos de QA são revisados e atualizados regularmente?",
      "Há definição clara de critérios de entrada e saída para cada fase de teste?",
      "A organização utiliza metodologias ágeis ou DevOps nos processos de QA?",
      "Existe um processo formal de gestão de riscos de qualidade?",
      "Os processos de QA são padronizados entre diferentes projetos/equipes?",
      "Há processos definidos para tratamento de bugs e não-conformidades?",
      "A organização possui um processo de melhoria contínua de QA?",
      "Existe integração entre os processos de QA e desenvolvimento?",
      "Os processos de QA consideram aspectos de segurança e privacidade?",
      "Há definição de responsabilidades e papéis claros na equipe de QA?",
      "Os processos incluem validação de requisitos e especificações?",
      "Existe um processo de aprovação e release de software bem definido?",
      "A organização possui templates e checklists padronizados para QA?"
    ]
  },
  "automacoes": {
    title: "Automações",
    questions: [
      "A organização utiliza ferramentas de automação de testes funcionais?",
      "Existe automação de testes de regressão implementada?",
      "A organização utiliza ferramentas de integração contínua (CI)?",
      "Há automação de testes de API/serviços web?",
      "A organização implementa testes automatizados de performance?",
      "Existe automação de testes de segurança?",
      "A organização utiliza ferramentas de automação para testes mobile?",
      "Há automação de testes de interface de usuário (UI)?",
      "A organização implementa testes automatizados de carga?",
      "Existe automação de deploy e entrega contínua (CD)?",
      "A organização utiliza ferramentas de automação para testes de dados?",
      "Há automação de testes end-to-end implementada?",
      "A organização implementa automação de testes de acessibilidade?",
      "Existe automação de análise de código estático?",
      "A organização utiliza ferramentas de automação para gestão de ambientes de teste?"
    ]
  },
  "metricas": {
    title: "Métricas",
    questions: [
      "A organização coleta métricas de cobertura de testes?",
      "Existe monitoramento de métricas de defeitos encontrados/corrigidos?",
      "A organização acompanha métricas de tempo de execução de testes?",
      "Há coleta de métricas de eficácia dos testes automatizados?",
      "A organização monitora métricas de performance das aplicações?",
      "Existe acompanhamento de métricas de qualidade do código?",
      "A organização coleta métricas de satisfação do cliente/usuário?",
      "Há monitoramento de métricas de disponibilidade dos sistemas?",
      "A organização acompanha métricas de tempo de resolução de bugs?",
      "Existe coleta de métricas de produtividade da equipe de QA?",
      "A organização monitora métricas de custo da qualidade?",
      "Há acompanhamento de métricas de compliance e governança?",
      "A organização coleta métricas de experiência do usuário (UX)?",
      "Existe monitoramento de métricas de segurança das aplicações?",
      "A organização possui dashboards e relatórios de métricas de qualidade?"
    ]
  },
  "modalidades-testes": {
    title: "Modalidades de Testes",
    questions: [
      "A organização executa testes funcionais de forma sistemática?",
      "Existe implementação de testes de integração?",
      "A organização realiza testes de sistema completos?",
      "Há execução regular de testes de aceitação do usuário?",
      "A organização implementa testes de performance e carga?",
      "Existe execução de testes de segurança e vulnerabilidade?",
      "A organização realiza testes de usabilidade e UX?",
      "Há implementação de testes de acessibilidade?",
      "A organização executa testes de compatibilidade?",
      "Existe realização de testes exploratórios?",
      "A organização implementa testes de API e serviços?",
      "Há execução de testes mobile (diferentes dispositivos/OS)?",
      "A organização realiza testes de recuperação e resiliência?",
      "Existe implementação de testes de dados e migração?",
      "A organização executa testes em diferentes ambientes (dev, stage, prod)?"
    ]
  },
  "documentacoes": {
    title: "Documentações",
    questions: [
      "A organização mantém documentação atualizada dos casos de teste?",
      "Existe documentação clara dos processos de QA?",
      "A organização documenta estratégias e planos de teste?",
      "Há documentação de procedimentos de automação?",
      "A organização mantém documentação de ambientes de teste?",
      "Existe documentação de critérios de aceitação?",
      "A organização documenta resultados e relatórios de teste?",
      "Há documentação de configurações e dados de teste?",
      "A organização mantém documentação de ferramentas utilizadas?",
      "Existe documentação de padrões e guidelines de QA?",
      "A organização documenta lições aprendidas e best practices?",
      "Há documentação de métricas e KPIs de qualidade?",
      "A organização mantém documentação de não-conformidades?",
      "Existe documentação de treinamentos e capacitação em QA?",
      "A organização possui templates e modelos documentais padronizados?"
    ]
  },
  "qaops": {
    title: "QAOPS (QA + DevOps)",
    questions: [
      "A organização integra QA nos pipelines de CI/CD?",
      "Existe colaboração efetiva entre equipes de QA e DevOps?",
      "A organização implementa testes em containers e microserviços?",
      "Há monitoramento contínuo da qualidade em produção?",
      "A organização utiliza Infrastructure as Code para ambientes de teste?",
      "Existe implementação de testes shift-left no processo de desenvolvimento?",
      "A organização pratica deployment contínuo com gates de qualidade?",
      "Há implementação de testes de chaos engineering?",
      "A organização utiliza ferramentas de observabilidade e monitoring?",
      "Existe automação de rollback baseada em critérios de qualidade?",
      "A organização implementa feature flags para controle de qualidade?",
      "Há cultura de 'you build it, you run it' com responsabilidade de QA?",
      "A organização utiliza métricas de DORA para medir performance?",
      "Existe implementação de testes de blue-green deployment?",
      "A organização pratica postmortem e retrospectivas de qualidade?"
    ]
  },
  "lideranca": {
    title: "Liderança",
    questions: [
      "A liderança demonstra comprometimento visível com a qualidade?",
      "Existe investimento adequado em ferramentas e recursos de QA?",
      "A liderança promove cultura de qualidade na organização?",
      "Há definição clara de estratégia de qualidade pela liderança?",
      "A liderança apoia iniciativas de melhoria contínua em QA?",
      "Existe reconhecimento e incentivo às boas práticas de qualidade?",
      "A liderança promove treinamento e desenvolvimento da equipe de QA?",
      "Há comunicação efetiva sobre objetivos e metas de qualidade?",
      "A liderança facilita colaboração entre equipes para qualidade?",
      "Existe tomada de decisão baseada em dados de qualidade?",
      "A liderança promove inovação e adoção de novas tecnologias em QA?",
      "Há estabelecimento de padrões de qualidade organizacionais?",
      "A liderança garante recursos adequados para atividades de QA?",
      "Existe avaliação regular do retorno sobre investimento em qualidade?",
      "A liderança promove accountability e responsabilidade pela qualidade?"
    ]
  }
};

const scaleOptions = [
  { value: "0", label: "0 - Não implementado" },
  { value: "1", label: "1 - Início da implementação" },
  { value: "2", label: "2 - Implementado de forma básica" },
  { value: "3", label: "3 - Implementado de forma moderada" },
  { value: "4", label: "4 - Bem implementado" },
  { value: "5", label: "5 - Totalmente implementado e otimizado" }
];

interface QualityAssessmentFormProps {
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
  onBackToMap: () => void;
}

export function QualityAssessmentForm({ answers, onAnswersChange, onBackToMap }: QualityAssessmentFormProps) {
  const [currentTab, setCurrentTab] = useState("processos-estrategias");

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    onAnswersChange(newAnswers);
  };

  const calculatePillarScore = (pillarKey: string) => {
    const pillar = assessmentData[pillarKey as keyof typeof assessmentData];
    const pillarAnswers = pillar.questions.map((_, index) => {
      const questionId = `${pillarKey}-${index}`;
      return parseInt(answers[questionId] || "0");
    });
    
    const totalScore = pillarAnswers.reduce((sum, score) => sum + score, 0);
    const maxScore = pillar.questions.length * 5;
    return { totalScore, maxScore, percentage: (totalScore / maxScore) * 100 };
  };

  const calculateOverallScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    Object.keys(assessmentData).forEach(pillarKey => {
      const score = calculatePillarScore(pillarKey);
      totalScore += score.totalScore;
      maxScore += score.maxScore;
    });
    
    return { totalScore, maxScore, percentage: (totalScore / maxScore) * 100 };
  };

  const getAnsweredQuestions = () => {
    return Object.keys(answers).filter(key => answers[key] !== "").length;
  };

  const getTotalQuestions = () => {
    return Object.values(assessmentData).reduce((total, pillar) => total + pillar.questions.length, 0);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const overallScore = calculateOverallScore();
  const progress = (getAnsweredQuestions() / getTotalQuestions()) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBackToMap}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Mapa
        </Button>
      </div>
      
      <div className="text-center space-y-4">
        <h1>Formulário de Avaliação de Qualidade</h1>
        <p className="text-muted-foreground">
          Avalie cada aspecto usando a escala de 0 a 5 pontos
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Progresso: {getAnsweredQuestions()}/{getTotalQuestions()} questões</span>
            <span className={getScoreColor(overallScore.percentage)}>
              Pontuação Geral: {overallScore.totalScore}/{overallScore.maxScore} ({overallScore.percentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-7">
          {Object.entries(assessmentData).map(([key, pillar]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {pillar.title.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(assessmentData).map(([pillarKey, pillar]) => {
          const pillarScore = calculatePillarScore(pillarKey);
          
          return (
            <TabsContent key={pillarKey} value={pillarKey}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{pillar.title}</CardTitle>
                    <Badge variant="outline" className={getScoreColor(pillarScore.percentage)}>
                      {pillarScore.totalScore}/{pillarScore.maxScore} ({pillarScore.percentage.toFixed(1)}%)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pillar.questions.map((question, index) => {
                    const questionId = `${pillarKey}-${index}`;
                    
                    return (
                      <div key={questionId} className="space-y-3 p-4 border rounded-lg">
                        <Label className="block">
                          {index + 1}. {question}
                        </Label>
                        <RadioGroup
                          value={answers[questionId] || ""}
                          onValueChange={(value) => handleAnswerChange(questionId, value)}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {scaleOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`${questionId}-${option.value}`} />
                                <Label 
                                  htmlFor={`${questionId}-${option.value}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Resumo por Pilares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(assessmentData).map(([pillarKey, pillar]) => {
              const score = calculatePillarScore(pillarKey);
              return (
                <div key={pillarKey} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{pillar.title}</span>
                    <span className={getScoreColor(score.percentage)}>
                      {score.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={score.percentage} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}