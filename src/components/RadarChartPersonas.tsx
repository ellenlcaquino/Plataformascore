import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Users, UserCheck, Eye, EyeOff, BarChart3, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface PersonaData {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  respostas: Record<string, number>;
}

interface RadarChartPersonasProps {
  personas?: PersonaData[];
  pilarSelecionado?: string;
}

// Cores para diferentes personas
const PERSONA_COLORS = [
  '#ff6384', // Rosa
  '#36a2eb', // Azul
  '#ffce56', // Amarelo
  '#4bc0c0', // Verde água
  '#9966ff', // Roxo
  '#ff9f40', // Laranja
  '#8b0000', // Vermelho escuro
  '#32cd32', // Verde limão
  '#ff1493', // Rosa escuro
  '#00ced1', // Turquesa
  '#ffd700', // Dourado
  '#dc143c'  // Carmesim
];

// Mapeamento dos pilares com suas perguntas (IDs do QualityScore)
const PILLAR_QUESTION_MAPPING = {
  'Processos e Estratégias': [
    'process1', 'process2', 'process3', 'process4', 'process5', 'process6', 
    'process7', 'process8', 'process9', 'process10', 'process11', 'process12', 
    'process13', 'process14', 'process15', 'process16'
  ],
  'Testes Automatizados': [
    'auto1', 'auto2', 'auto3', 'auto4', 'auto5', 'auto6', 'auto7', 'auto8', 
    'auto9', 'auto10', 'auto11', 'auto12', 'auto13', 'auto14', 'auto15', 'auto16'
  ],
  'Métricas': [
    'metric1', 'metric2', 'metric3', 'metric4', 'metric5', 'metric6', 'metric7', 
    'metric8', 'metric9', 'metric10', 'metric11', 'metric12', 'metric13', 'metric14'
  ],
  'Documentações': [
    'doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'doc6', 'doc7', 'doc8', 'doc9', 'doc10', 'doc11'
  ],
  'Modalidades de Testes': [
    'test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 
    'test9', 'test10', 'test11', 'test12'
  ],
  'QAOPS': [
    'qaops1', 'qaops2', 'qaops3', 'qaops4', 'qaops5', 'qaops6', 'qaops7', 'qaops8', 'qaops9', 'qaops10'
  ],
  'Liderança': [
    'leader1', 'leader2', 'leader3', 'leader4', 'leader5', 'leader6', 'leader7', 
    'leader8', 'leader9', 'leader10', 'leader11', 'leader12'
  ]
};

// Dados de exemplo com múltiplas personas
const DADOS_EXEMPLO: PersonaData[] = [
  {
    id: 'persona1',
    nome: 'Ana Silva',
    empresa: 'TechCorp',
    cargo: 'QA Lead',
    respostas: {
      'Processos e Estratégias': 4.17,
      'Testes Automatizados': 3.82,
      'Métricas': 3.56,
      'Documentações': 4.03,
      'Modalidades de Testes': 3.91,
      'QAOPS': 3.28,
      'Liderança': 4.51
    }
  },
  {
    id: 'persona2',
    nome: 'Carlos Santos',
    empresa: 'TechCorp',
    cargo: 'Senior QA',
    respostas: {
      'Processos e Estratégias': 3.84,
      'Testes Automatizados': 4.53,
      'Métricas': 3.21,
      'Documentações': 3.47,
      'Modalidades de Testes': 4.19,
      'QAOPS': 4.02,
      'Liderança': 2.98
    }
  },
  {
    id: 'persona3',
    nome: 'Maria Oliveira',
    empresa: 'TechCorp',
    cargo: 'QA Analyst',
    respostas: {
      'Processos e Estratégias': 2.96,
      'Testes Automatizados': 2.74,
      'Métricas': 2.51,
      'Documentações': 3.18,
      'Modalidades de Testes': 3.47,
      'QAOPS': 1.95,
      'Liderança': 2.83
    }
  }
];

export function RadarChartPersonas({ personas = DADOS_EXEMPLO, pilarSelecionado }: RadarChartPersonasProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [filtroPersona, setFiltroPersona] = useState<string>('all');
  const [personasVisiveis, setPersonasVisiveis] = useState<Set<string>>(new Set(personas.map(p => p.id)));

  // Função para calcular médias por pilar baseado nas respostas individuais
  const calcularMediasPorPilar = useMemo(() => {
    return (persona: PersonaData) => {
      const medias: Record<string, number> = {};
      
      Object.entries(PILLAR_QUESTION_MAPPING).forEach(([pilar, questionIds]) => {
        const respostasValidas = questionIds
          .map(questionId => persona.respostas[questionId])
          .filter(resposta => resposta !== undefined && resposta !== null && typeof resposta === 'number') as number[];
        
        if (respostasValidas.length > 0) {
          medias[pilar] = Number((respostasValidas.reduce((sum, resp) => sum + resp, 0) / respostasValidas.length).toFixed(2));
        } else {
          // Fallback para dados já consolidados (se não tiver dados detalhados)
          medias[pilar] = persona.respostas[pilar] || 0;
        }
      });
      
      return medias;
    };
  }, []);

  // Calcular média geral (de todos os usuários)
  const mediaGeral = useMemo(() => {
    if (personas.length === 0) return {};
    
    const somasPorPilar: Record<string, number> = {};
    const contadorPorPilar: Record<string, number> = {};
    
    // Inicializar contadores
    Object.keys(PILLAR_QUESTION_MAPPING).forEach(pilar => {
      somasPorPilar[pilar] = 0;
      contadorPorPilar[pilar] = 0;
    });
    
    // Somar todas as personas
    personas.forEach(persona => {
      const mediasPersona = calcularMediasPorPilar(persona);
      Object.entries(mediasPersona).forEach(([pilar, media]) => {
        if (media > 0) {
          somasPorPilar[pilar] += media;
          contadorPorPilar[pilar] ++;
        }
      });
    });
    
    // Calcular médias finais
    const mediaFinal: Record<string, number> = {};
    Object.keys(PILLAR_QUESTION_MAPPING).forEach(pilar => {
      mediaFinal[pilar] = contadorPorPilar[pilar] > 0 
        ? Number((somasPorPilar[pilar] / contadorPorPilar[pilar]).toFixed(2))
        : 0;
    });
    
    return mediaFinal;
  }, [personas, calcularMediasPorPilar]);

  // Preparar dados para o radar chart geral
  const dadosRadarGeral = useMemo(() => {
    return Object.entries(mediaGeral).map(([pilar, media]) => ({
      pilar,
      'Média Geral': media
    }));
  }, [mediaGeral]);

  // Preparar dados para o radar chart por personas
  const dadosRadarPersonas = useMemo(() => {
    const pilares = Object.keys(PILLAR_QUESTION_MAPPING);
    
    return pilares.map(pilar => {
      const dadoPilar: any = { pilar };
      
      // Se mostrar todas as personas
      if (filtroPersona === 'all') {
        personas.forEach((persona, index) => {
          if (personasVisiveis.has(persona.id)) {
            const mediasPersona = calcularMediasPorPilar(persona);
            dadoPilar[persona.nome] = mediasPersona[pilar] || 0;
          }
        });
      } else {
        // Mostrar apenas a persona selecionada
        const personaSelecionada = personas.find(p => p.id === filtroPersona);
        if (personaSelecionada) {
          const mediasPersona = calcularMediasPorPilar(personaSelecionada);
          dadoPilar[personaSelecionada.nome] = mediasPersona[pilar] || 0;
        }
      }
      
      return dadoPilar;
    });
  }, [personas, filtroPersona, personasVisiveis, calcularMediasPorPilar]);

  // Preparar datasets para legenda das personas
  const datasetsPersonas = useMemo(() => {
    if (filtroPersona === 'all') {
      return personas
        .filter(persona => personasVisiveis.has(persona.id))
        .map((persona, index) => ({
          dataKey: persona.nome,
          color: PERSONA_COLORS[index % PERSONA_COLORS.length],
          persona
        }));
    } else {
      const personaSelecionada = personas.find(p => p.id === filtroPersona);
      if (personaSelecionada) {
        return [{
          dataKey: personaSelecionada.nome,
          color: PERSONA_COLORS[0],
          persona: personaSelecionada
        }];
      }
    }
    return [];
  }, [personas, filtroPersona, personasVisiveis]);

  // Estatísticas adicionais
  const estatisticas = useMemo(() => {
    const mediasIndividuais = personas.map(persona => {
      const mediasPersona = calcularMediasPorPilar(persona);
      const scores = Object.values(mediasPersona).filter(score => score > 0);
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });

    const mediaGeralCompleta = mediasIndividuais.length > 0 
      ? mediasIndividuais.reduce((a, b) => a + b, 0) / mediasIndividuais.length 
      : 0;

    const desvio = mediasIndividuais.length > 1 ? Math.sqrt(
      mediasIndividuais.reduce((acc, media) => acc + Math.pow(media - mediaGeralCompleta, 2), 0) / (mediasIndividuais.length - 1)
    ) : 0;

    return {
      mediaGeralCompleta: Number(mediaGeralCompleta.toFixed(2)),
      desvio: Number(desvio.toFixed(2)),
      min: mediasIndividuais.length > 0 ? Number(Math.min(...mediasIndividuais).toFixed(2)) : 0,
      max: mediasIndividuais.length > 0 ? Number(Math.max(...mediasIndividuais).toFixed(2)) : 0,
      amplitude: mediasIndividuais.length > 0 ? Number((Math.max(...mediasIndividuais) - Math.min(...mediasIndividuais)).toFixed(2)) : 0
    };
  }, [personas, calcularMediasPorPilar]);

  const togglePersonaVisibilidade = (personaId: string) => {
    const novasVisiveis = new Set(personasVisiveis);
    if (novasVisiveis.has(personaId)) {
      novasVisiveis.delete(personaId);
    } else {
      novasVisiveis.add(personaId);
    }
    setPersonasVisiveis(novasVisiveis);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Radar Chart - Análise de Maturidade</h2>
        <p className="text-gray-600">
          Visualize a maturidade geral da equipe e compare performances individuais baseadas nos indicadores das 91 perguntas
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Média Geral</div>
          <div className="text-xl font-bold text-blue-600">{estatisticas.mediaGeralCompleta}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Desvio Padrão</div>
          <div className="text-xl font-bold text-orange-600">{estatisticas.desvio}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Menor Score</div>
          <div className="text-xl font-bold text-red-600">{estatisticas.min}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Maior Score</div>
          <div className="text-xl font-bold text-green-600">{estatisticas.max}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Amplitude</div>
          <div className="text-xl font-bold text-purple-600">{estatisticas.amplitude}</div>
        </Card>
      </div>

      {/* Sistema de Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            Radar Geral
          </TabsTrigger>
          <TabsTrigger value="personas" className="flex items-center gap-2 py-3">
            <Users className="h-4 w-4" />
            Por Personas
          </TabsTrigger>
        </TabsList>

        {/* Aba do Radar Geral */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Radar Geral da Equipe
              </CardTitle>
              <CardDescription>
                Média consolidada de todos os {personas.length} participantes por pilar, calculada a partir das respostas individuais de cada indicador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dadosRadarGeral}>
                    <PolarGrid />
                    <PolarAngleAxis 
                      dataKey="pilar" 
                      className="text-xs"
                      tick={{ fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fontSize: 10 }}
                      tickCount={6}
                    />
                    
                    <Radar
                      name="Média Geral"
                      dataKey="Média Geral"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                    
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 border rounded-lg shadow-lg">
                              <p className="font-medium mb-2">{label}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-blue-600" />
                                <span>Média: {payload[0].value}/5.0</span>
                              </div>
                              <div className="mt-2 text-xs text-gray-600">
                                Baseado em {personas.length} participante(s)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ranking dos Pilares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Ranking dos Pilares
              </CardTitle>
              <CardDescription>
                Pilares ordenados por performance da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(mediaGeral)
                  .sort(([,a], [,b]) => b - a)
                  .map(([pilar, media], index) => (
                    <div key={pilar} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-green-600 text-white' :
                          index === 1 ? 'bg-blue-600 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-400 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{pilar}</span>
                      </div>
                      <Badge variant={media >= 4 ? 'default' : media >= 3 ? 'secondary' : 'destructive'}>
                        {media.toFixed(2)}/5.0
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba das Personas */}
        <TabsContent value="personas" className="space-y-6">
          {/* Controles de Filtro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Filtros e Visualização
              </CardTitle>
              <CardDescription>
                Controle a visualização das personas no radar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seletor de Persona */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Persona
                  </label>
                  <Select value={filtroPersona} onValueChange={setFiltroPersona}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Personas</SelectItem>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.nome} - {persona.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Controles de Visibilidade */}
                {filtroPersona === 'all' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibilidade das Personas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {personas.map((persona, index) => {
                        const isVisible = personasVisiveis.has(persona.id);
                        const color = PERSONA_COLORS[index % PERSONA_COLORS.length];
                        
                        return (
                          <Button
                            key={persona.id}
                            variant={isVisible ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePersonaVisibilidade(persona.id)}
                            className="text-xs"
                            style={isVisible ? { backgroundColor: color, borderColor: color } : {}}
                          >
                            {isVisible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                            {persona.nome}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart das Personas */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação por Personas</CardTitle>
              <CardDescription>
                Cada persona tem suas médias calculadas a partir das respostas individuais dos indicadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dadosRadarPersonas}>
                    <PolarGrid />
                    <PolarAngleAxis 
                      dataKey="pilar" 
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fontSize: 10 }}
                      tickCount={6}
                    />
                    
                    {/* Renderizar uma linha para cada persona visível */}
                    {datasetsPersonas.map((dataset, index) => (
                      <Radar
                        key={dataset.dataKey}
                        name={dataset.dataKey}
                        dataKey={dataset.dataKey}
                        stroke={dataset.color}
                        fill={dataset.color}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 border rounded-lg shadow-lg">
                              <p className="font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.name}: {entry.value}/5.0</span>
                                </div>
                              ))}
                              <div className="mt-2 text-xs text-gray-600">
                                Média calculada dos indicadores individuais
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    
                    {filtroPersona === 'all' && (
                      <Legend 
                        content={({ payload }) => (
                          <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {payload?.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Informações das Personas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(filtroPersona === 'all' ? personas.filter(p => personasVisiveis.has(p.id)) : personas.filter(p => p.id === filtroPersona))
              .map((persona, index) => {
                const color = PERSONA_COLORS[index % PERSONA_COLORS.length];
                const mediasPersona = calcularMediasPorPilar(persona);
                const scoresValidos = Object.values(mediasPersona).filter(score => score > 0);
                const mediaGeralPersona = scoresValidos.length > 0 ? 
                  scoresValidos.reduce((a, b) => a + b, 0) / scoresValidos.length : 0;
                
                // Calcular pilar com maior e menor nota
                const respostasArray = Object.entries(mediasPersona)
                  .filter(([, score]) => score > 0)
                  .sort(([, a], [, b]) => b - a);
                
                const pilarMaiorNota = respostasArray.length > 0 ? respostasArray[0] : ['N/A', 0];
                const pilarMenorNota = respostasArray.length > 0 ? respostasArray[respostasArray.length - 1] : ['N/A', 0];
                
                return (
                  <Card key={persona.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <h4 className="font-medium">{persona.nome}</h4>
                        <p className="text-sm text-gray-600">{persona.cargo} • {persona.empresa}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Média Geral:</span>
                        <Badge variant="outline">{mediaGeralPersona.toFixed(2)}/5.0</Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Maior nota:</span>
                          <span className="font-medium text-green-600 text-right">
                            {pilarMaiorNota[0]}<br/>({pilarMaiorNota[1].toFixed(2)})
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Menor nota:</span>
                          <span className="font-medium text-red-600 text-right">
                            {pilarMenorNota[0]}<br/>({pilarMenorNota[1].toFixed(2)})
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                        Baseado em {Object.keys(PILLAR_QUESTION_MAPPING).reduce((sum, pilar) => 
                          sum + PILLAR_QUESTION_MAPPING[pilar as keyof typeof PILLAR_QUESTION_MAPPING].length, 0
                        )} indicadores individuais
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}