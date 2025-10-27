import React, { useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, Info, Target } from 'lucide-react';

interface PersonaData {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  respostas: Record<string, number>;
}

interface MapaDivergenciaProps {
  personas?: PersonaData[];
}

// Dados de exemplo
const DADOS_EXEMPLO = [
  {
    id: 'persona1',
    nome: 'Ana Silva',
    empresa: 'TechCorp',
    cargo: 'QA Lead',
    respostas: {
      'leader1': 5, 'leader2': 5, 'leader3': 4, 'leader4': 5, 'leader5': 4,
      'auto1': 3, 'auto2': 4, 'auto3': 3, 'process1': 4, 'process2': 5
    }
  },
  {
    id: 'persona2',
    nome: 'Carlos Santos',
    empresa: 'TechCorp',
    cargo: 'Senior QA',
    respostas: {
      'leader1': 3, 'leader2': 3, 'leader3': 3, 'leader4': 3, 'leader5': 2,
      'auto1': 5, 'auto2': 5, 'auto3': 4, 'process1': 3, 'process2': 4
    }
  },
  {
    id: 'persona3',
    nome: 'Maria Oliveira',
    empresa: 'TechCorp',
    cargo: 'QA Analyst',
    respostas: {
      'leader1': 3, 'leader2': 3, 'leader3': 2, 'leader4': 3, 'leader5': 2,
      'auto1': 2, 'auto2': 3, 'auto3': 3, 'process1': 3, 'process2': 3
    }
  },
  {
    id: 'persona4',
    nome: 'João Pereira',
    empresa: 'TechCorp',
    cargo: 'Tech Lead',
    respostas: {
      'leader1': 4, 'leader2': 4, 'leader3': 4, 'leader4': 4, 'leader5': 4,
      'auto1': 4, 'auto2': 4, 'auto3': 4, 'process1': 5, 'process2': 5
    }
  },
  {
    id: 'persona5',
    nome: 'Julia Costa',
    empresa: 'TechCorp',
    cargo: 'QA Junior',
    respostas: {
      'leader1': 2, 'leader2': 2, 'leader3': 3, 'leader4': 2, 'leader5': 2,
      'auto1': 1, 'auto2': 2, 'auto3': 2, 'process1': 2, 'process2': 2
    }
  }
];

// Perguntas
const PERGUNTAS = {
  'leader1': 'Apoio da liderança à qualidade',
  'leader2': 'Comunicação sobre importância da qualidade',
  'leader3': 'Transparência da liderança técnica',
  'leader4': 'Desenvolvimento de competências',
  'leader5': 'Orçamento para qualidade',
  'auto1': 'Cobertura de testes automatizados',
  'auto2': 'Coverage funcional no core business',
  'auto3': 'Robustez dos testes automatizados',
  'process1': 'Esteira de desenvolvimento estruturada',
  'process2': 'Visão integrada de Negócio/Produto/Design'
};

export function MapaDivergencia({ personas = DADOS_EXEMPLO }: MapaDivergenciaProps) {
  const divergenciasDados = useMemo(() => {
    const todasAsPerguntas = Object.keys(PERGUNTAS);
    
    const divergencias = todasAsPerguntas.map(perguntaId => {
      const respostas = personas.map(persona => persona.respostas[perguntaId] || 0).filter(r => r > 0);
      
      if (respostas.length < 2) {
        return {
          perguntaId,
          pergunta: PERGUNTAS[perguntaId as keyof typeof PERGUNTAS],
          desvio: 0,
          media: 0,
          min: 0,
          max: 0,
          respostas: []
        };
      }
      
      const media = respostas.reduce((a, b) => a + b, 0) / respostas.length;
      const variancia = respostas.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / respostas.length;
      const desvio = Math.sqrt(variancia);
      
      return {
        perguntaId,
        pergunta: PERGUNTAS[perguntaId as keyof typeof PERGUNTAS],
        desvio: Number(desvio.toFixed(2)),
        media: Number(media.toFixed(1)),
        min: Math.min(...respostas),
        max: Math.max(...respostas),
        respostas: respostas
      };
    });
    
    return divergencias
      .filter(d => d.desvio > 0)
      .sort((a, b) => b.desvio - a.desvio)
      .slice(0, 10);
  }, [personas]);

  const dadosGrafico = divergenciasDados.map((item, index) => ({
    id: index + 1,
    pergunta: 'P' + (index + 1).toString(),
    perguntaCompleta: item.pergunta,
    desvio: item.desvio,
    media: item.media,
    amplitude: item.max - item.min
  }));

  const getCorDivergencia = (desvio: number) => {
    if (desvio >= 1.5) return '#dc2626';
    if (desvio >= 1.0) return '#f59e0b';
    if (desvio >= 0.5) return '#2563eb';
    return '#16a34a';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Divergência</h2>
        <p className="text-gray-600">Top 10 perguntas com maior divergência entre as respostas das personas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Maior Divergência</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {divergenciasDados[0]?.desvio || 0}
          </div>
          <div className="text-xs text-gray-600">
            Desvio padrão
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Divergências Altas</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {divergenciasDados.filter(d => d.desvio >= 1.5).length}
          </div>
          <div className="text-xs text-gray-600">
            Desvio maior ou igual a 1.5
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Participantes</span>
          </div>
          <div className="text-2xl font-bold text-gray-700">
            {personas.length}
          </div>
          <div className="text-xs text-gray-600">
            Personas analisadas
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Consenso</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {divergenciasDados.filter(d => d.desvio < 0.5).length}
          </div>
          <div className="text-xs text-gray-600">
            Baixa divergência
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ranking de Divergências</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pergunta" tick={{ fontSize: 12 }} />
              <YAxis 
                label={{ value: 'Desvio Padrão', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                        <p className="font-medium mb-2">{label}</p>
                        <p className="text-sm text-gray-700 mb-2">{data.perguntaCompleta}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Desvio Padrão:</span>
                            <span className="font-medium">{data.desvio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Média:</span>
                            <span>{data.media}/5.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amplitude:</span>
                            <span>{data.amplitude} pontos</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="desvio" radius={[4, 4, 0, 0]}>
                {dadosGrafico.map((entry, index) => (
                  <Cell key={'cell-' + index.toString()} fill={getCorDivergencia(entry.desvio)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Análise Detalhada das Divergências</h3>
        <div className="space-y-4">
          {divergenciasDados.map((item, index) => (
            <div key={item.perguntaId} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="text-xs">#{index + 1}</Badge>
                    <Badge 
                      style={{ 
                        backgroundColor: getCorDivergencia(item.desvio) + '20',
                        color: getCorDivergencia(item.desvio),
                        border: '1px solid ' + getCorDivergencia(item.desvio) + '40'
                      }}
                    >
                      Desvio: {item.desvio}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    {item.pergunta}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-600"><strong>Estatísticas:</strong></p>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Média das respostas:</span>
                      <span>{item.media}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Menor resposta:</span>
                      <span>{item.min}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maior resposta:</span>
                      <span>{item.max}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600"><strong>Distribuição:</strong></p>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map(nota => {
                      const count = item.respostas.filter(r => r === nota).length;
                      const percentage = count > 0 ? (count / item.respostas.length) * 100 : 0;
                      return (
                        <div key={nota} className="flex items-center gap-2 text-xs">
                          <span className="w-8">{nota}★:</span>
                          <Progress value={percentage} className="h-1 flex-1" />
                          <span className="w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600"><strong>Interpretação:</strong></p>
                  <div className="text-xs text-gray-700">
                    {item.desvio >= 1.5 ? (
                      <div className="text-red-700">
                        <strong>Alta divergência:</strong> Visões muito diferentes entre os participantes. 
                        Requer alinhamento urgente da equipe.
                      </div>
                    ) : item.desvio >= 1.0 ? (
                      <div className="text-orange-700">
                        <strong>Média divergência:</strong> Algumas diferenças de percepção. 
                        Recomenda-se discussão em equipe.
                      </div>
                    ) : item.desvio >= 0.5 ? (
                      <div className="text-blue-700">
                        <strong>Baixa divergência:</strong> Consenso razoável, 
                        pequenas diferenças de percepção.
                      </div>
                    ) : (
                      <div className="text-green-700">
                        <strong>Consenso:</strong> Equipe alinhada nesta área. 
                        Manter as práticas atuais.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-medium mb-3">Legenda de Interpretação</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600" />
            <span>Desvio maior ou igual a 1.5 - Alta divergência</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-600" />
            <span>Desvio maior ou igual a 1.0 - Média divergência</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600" />
            <span>Desvio maior ou igual a 0.5 - Baixa divergência</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-600" />
            <span>Desvio menor que 0.5 - Consenso</span>
          </div>
        </div>
      </Card>
    </div>
  );
}