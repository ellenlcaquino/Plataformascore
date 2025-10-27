import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

interface QualityMapProps {
  onBackToIntro: () => void;
  onStartPillar: (pillarKey: string) => void;
  answers: Record<string, string>;
}

const pillarData = [
  {
    key: "processos-estrategias",
    title: "Processos e Estratégias",
    icon: "📋",
    questions: 15,
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
  },
  {
    key: "automacoes", 
    title: "Automações",
    icon: "⚙️",
    questions: 15,
    color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
  },
  {
    key: "metricas",
    title: "Métricas", 
    icon: "📊",
    questions: 15,
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
  },
  {
    key: "modalidades-testes",
    title: "Modalidades de Testes",
    icon: "🧪",
    questions: 15,
    color: "bg-green-50 hover:bg-green-100 border-green-200"
  },
  {
    key: "documentacoes",
    title: "Documentações",
    icon: "📝",
    questions: 15,
    color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
  },
  {
    key: "qaops",
    title: "QAOps",
    icon: "🔄",
    questions: 15,
    color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
  },
  {
    key: "lideranca",
    title: "Liderança",
    icon: "👥",
    questions: 15,
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200"
  }
];

const scaleItems = [
  { value: 0, label: "Não implementado", description: "Conceito conhecido mas não aplicado.", color: "bg-gray-100" },
  { value: 1, label: "Início da implementação", description: "Começando a ser implementado.", color: "bg-red-100" },
  { value: 2, label: "Implementado de forma básica", description: "Implementado de forma básica.", color: "bg-orange-100" },
  { value: 3, label: "Implementado de forma moderada", description: "Implementado de forma moderada.", color: "bg-yellow-100" },
  { value: 4, label: "Bem implementado", description: "Bem implementado e efetivo.", color: "bg-blue-100" },
  { value: 5, label: "Totalmente implementado e otimizado", description: "Totalmente implementado e otimizado.", color: "bg-green-100" }
];

export function QualityMap({ onBackToIntro, onStartPillar, answers }: QualityMapProps) {
  const getPillarProgress = (pillarKey: string, totalQuestions: number) => {
    let answered = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const questionId = `${pillarKey}-${i}`;
      if (answers[questionId] && answers[questionId] !== "") {
        answered++;
      }
    }
    return answered;
  };

  const isPillarCompleted = (pillarKey: string, totalQuestions: number) => {
    return getPillarProgress(pillarKey, totalQuestions) === totalQuestions;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBackToIntro}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h2>Escala de Avaliação:</h2>
          <p className="text-muted-foreground">
            O formulário é composto por <span className="font-medium">100 perguntas</span> sobre qualidade de software, distribuídas em
            <br />
            <span className="font-medium">7 pilares principais</span>. Cada pergunta deve ser respondida em uma escala de <span className="font-medium">0 a 5</span>, onde:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna da esquerda - QualityMap */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            QualityMap
          </h3>
          
          <div className="space-y-3">
            <h4>Etapas da Avaliação</h4>
            
            {pillarData.map((pillar) => {
              const progress = getPillarProgress(pillar.key, pillar.questions);
              const completed = isPillarCompleted(pillar.key, pillar.questions);
              
              return (
                <Card 
                  key={pillar.key} 
                  className={`cursor-pointer transition-colors ${pillar.color}`}
                  onClick={() => onStartPillar(pillar.key)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{pillar.icon}</span>
                            <span className="text-sm">{pillar.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {progress}/{pillar.questions} perguntas
                          </p>
                        </div>
                      </div>
                      {completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coluna da direita - Escala */}
        <div className="space-y-4">
          {scaleItems.map((item) => (
            <Card key={item.value} className={`${item.color} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-medium">
                    {item.value}
                  </div>
                  <div>
                    <h5 className="text-sm">{item.label}</h5>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}