import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import { TrendingUp, BarChart3, Info, Eye } from 'lucide-react';

interface PersonaData {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  respostas: Record<string, number>;
}

interface MapaLinhaPilarProps {
  personas?: PersonaData[];
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

// Mapeamento de IDs para perguntas (baseado no XLSXProcessor)
const QUESTION_ID_TO_TEXT: Record<string, string> = {
  // Processos e Estratégias
  'process1': 'Esteira de desenvolvimento bem estruturada',
  'process2': 'Visão do ciclo contempla Negócio, Produto e Design',
  'process3': 'Gerenciamento de mudanças nos requisitos',
  'process4': 'Processo claro de code-review',
  'process5': 'Papéis e responsabilidades claros',
  'process6': 'Metodologia conhecida e seguida',
  'process7': 'Reuniões claras e objetivas',
  'process8': 'Cumprimento de prazos',
  'process9': 'Sistema de rastreamento de bugs',
  'process10': 'Atualização regular do bug tracking',
  'process11': 'Plano de ação e priorização para bugs',
  'process12': 'Diferenciação bug/melhoria/escopo',
  'process13': 'Área de qualidade madura',
  'process14': 'Governança e estratégia de qualidade',
  'process15': 'Definition Of Ready aplicado',
  'process16': 'Definition Of Done aplicado',
  
  // Testes Automatizados
  'auto1': 'Cobertura de testes automatizados',
  'auto2': 'Coverage funcional no core business',
  'auto3': 'Robustez e confiabilidade dos testes',
  'auto4': 'Capacidade de lidar com flutuações',
  'auto5': 'Integração ao continuous testing',
  'auto6': 'Integração aos processos de CI/CD',
  'auto7': 'Execução automática em builds/deploy',
  'auto8': 'Facilidade de manutenção da arquitetura',
  'auto9': 'Escalabilidade dos testes',
  'auto10': 'Eficiência em tempo e recursos',
  'auto11': 'Clareza nos registros e apresentação',
  'auto12': 'Monitoramento contínuo eficaz',
  'auto13': 'Padrões e boas práticas',
  'auto14': 'Melhoria contínua e novas técnicas',
  'auto15': 'Documentação técnica da arquitetura',
  'auto16': 'Code review nos scripts de automação',
  
  // Métricas
  'metric1': 'Monitoramento de métricas da esteira',
  'metric2': 'Métricas de qualidade definidas',
  'metric3': 'Metas (OKR) para desenvolvimento/qualidade',
  'metric4': 'Alinhamento com objetivos de negócio',
  'metric5': 'Métricas para melhoria contínua',
  'metric6': 'Utilidade para tomada de decisões',
  'metric7': 'Frequência de atualização',
  'metric8': 'Acessibilidade das métricas',
  'metric9': 'Responsabilidade do QA nas métricas',
  'metric10': 'SLAs para correção de defeitos',
  'metric11': 'Análises periódicas das métricas',
  'metric12': 'Métricas de satisfação do cliente',
  'metric13': 'Taxa de rejeição de casos de teste',
  'metric14': 'Análises pós-implantação',
  
  // Documentações
  'doc1': 'Documentação completa de requisitos',
  'doc2': 'Abrangência da documentação',
  'doc3': 'Atualização regular da documentação',
  'doc4': 'Acessibilidade da documentação',
  'doc5': 'Qualidade geral das documentações',
  'doc6': 'Disponibilidade em múltiplos formatos',
  'doc7': 'Documentação de limites do projeto',
  'doc8': 'Padrões para gestão de testes',
  'doc9': 'Clareza dos cenários de testes',
  'doc10': 'Atualização dos cenários de testes',
  'doc11': 'Gestão eficiente e rastreabilidade',
  
  // Modalidades de Testes
  'test1': 'Preparação para outras modalidades de teste',
  'test2': 'Visão ampla de controle de qualidade',
  'test3': 'Cobertura de testes funcionais',
  'test4': 'Testes de protótipo/conceitualização',
  'test5': 'Testes de desempenho/escalabilidade',
  'test6': 'Testes de compatibilidade',
  'test7': 'Automação de testes de regressão',
  'test8': 'Testes de recuperação de falhas',
  'test9': 'Pair Testing com Dev e PO',
  'test10': 'Testes de Acessibilidade',
  'test11': 'Troca entre áreas para direcionamento',
  'test12': 'Modalidades aplicadas pelos QAs',
  
  // QAOPS
  'qaops1': 'Colaboração entre equipes DevOps',
  'qaops2': 'Similaridade ambiente teste/produção',
  'qaops3': 'Automação de reteste e regressão',
  'qaops4': 'Responsabilidade coletiva na qualidade',
  'qaops5': 'Monitoramento em tempo real',
  'qaops6': 'QA envolvido desde o início (ShiftLeft)',
  'qaops7': 'Cultura de aprendizado contínuo',
  'qaops8': 'Sistemas de observabilidade/gates',
  'qaops9': 'Processo de melhoria contínua',
  'qaops10': 'Aprendizado com incidentes',
  
  // Liderança
  'leader1': 'Apoio da liderança à qualidade',
  'leader2': 'Comunicação sobre importância da qualidade',
  'leader3': 'Transparência da liderança técnica',
  'leader4': 'Desenvolvimento de competências',
  'leader5': 'Orçamento para qualidade',
  'leader6': 'Promoção da cultura de excelência',
  'leader7': 'Clareza nas metas de qualidade',
  'leader8': 'Indicadores de desempenho eficazes',
  'leader9': 'Feedback e oportunidades de melhoria',
  'leader10': 'Definição clara de responsabilidades',
  'leader11': 'Clareza na trilha de carreira de QA',
  'leader12': 'Visão ampla da liderança de qualidade'
};

// Agrupamento por pilares - mapeamento baseado nos dados reais
const PILLAR_GROUPS: Record<string, string[]> = {
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

export function MapaLinhaPilarAdaptivo({ personas = [] }: MapaLinhaPilarProps) {
  const [pilarSelecionado, setPilarSelecionado] = useState<string>('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'linha' | 'dispersao'>('linha');

  // Detectar estrutura dos dados e extrair pilares disponíveis
  const pilaresDisponiveis = useMemo(() => {
    if (!personas || personas.length === 0) return [];
    
    // Primeiro, verificar a primeira persona para entender a estrutura
    const primeiraPersona = personas[0];
    if (!primeiraPersona?.respostas) return [];
    
    const chaves = Object.keys(primeiraPersona.respostas);
    
    // Detectar pilares com dados detalhados (perguntas individuais)
    const pilaresEncontrados: string[] = [];
    Object.entries(PILLAR_GROUPS).forEach(([pilar, ids]) => {
      const perguntasEncontradas = ids.filter(id => chaves.includes(id));
      
      if (perguntasEncontradas.length > 0) {
        pilaresEncontrados.push(pilar);
      }
    });
    return pilaresEncontrados;
  }, [personas]);

  // Definir pilar padrão
  useMemo(() => {
    if (pilaresDisponiveis.length > 0 && !pilarSelecionado) {
      setPilarSelecionado(pilaresDisponiveis[0]);
    }
  }, [pilaresDisponiveis, pilarSelecionado]);

  // Preparar dados para o gráfico
  const dadosGrafico = useMemo(() => {
    if (!pilarSelecionado || !personas || personas.length === 0) return [];

    // Para o Mapa de Linha por Pilar, SEMPRE usar perguntas individuais (não médias consolidadas)
    const perguntasIds = PILLAR_GROUPS[pilarSelecionado] || [];
    
    if (perguntasIds.length === 0) {
      return [];
    }
    
    return perguntasIds.map((perguntaId, index) => {
      const dadoPergunta: any = {
        pergunta: `P${index + 1}`,
        perguntaCompleta: QUESTION_ID_TO_TEXT[perguntaId] || perguntaId,
        perguntaIndex: index + 1
      };

      // Adicionar resposta de cada persona
      personas.forEach((persona, personaIndex) => {
        const resposta = persona.respostas[perguntaId] || 0;
        dadoPergunta[persona.nome] = resposta;
      });

      // Calcular estatísticas
      const respostas = personas.map(p => p.respostas[perguntaId] || 0).filter(r => r >= 0);
      dadoPergunta.media = respostas.length > 0 ? 
        Number((respostas.reduce((a, b) => a + b, 0) / respostas.length).toFixed(1)) : 0;
      dadoPergunta.min = respostas.length > 0 ? Math.min(...respostas) : 0;
      dadoPergunta.max = respostas.length > 0 ? Math.max(...respostas) : 0;
      
      return dadoPergunta;
    }).filter(item => item !== null);
  }, [pilarSelecionado, personas, modoVisualizacao]);

  // Calcular estatísticas do pilar
  const estatisticasPilar = useMemo(() => {
    if (!pilarSelecionado || !personas || personas.length === 0) return null;

    // Para o Mapa de Linha por Pilar, SEMPRE usar perguntas individuais para calcular estatísticas
    const perguntasIds = PILLAR_GROUPS[pilarSelecionado] || [];
    const todasRespostas = perguntasIds
      .flatMap(id => personas.map(p => p.respostas[id] || 0))
      .filter(r => r >= 0);

    if (todasRespostas.length === 0) return null;

    const media = todasRespostas.reduce((a, b) => a + b, 0) / todasRespostas.length;
    const variancia = todasRespostas.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / todasRespostas.length;
    const desvio = Math.sqrt(variancia);

    return {
      media: Number(media.toFixed(2)),
      desvio: Number(desvio.toFixed(2)),
      min: Math.min(...todasRespostas),
      max: Math.max(...todasRespostas),
      totalRespostas: todasRespostas.length
    };
  }, [pilarSelecionado, personas]);

  if (!personas || personas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Linha por Pilar</h2>
          <p className="text-gray-600">Nenhum dado disponível para visualização</p>
        </div>
      </div>
    );
  }

  if (pilaresDisponiveis.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Linha por Pilar</h2>
          <p className="text-gray-600">Esta visualização requer dados detalhados por pergunta</p>
          <p className="text-sm text-gray-500 mt-2">
            Os dados importados contêm apenas médias consolidadas por pilar. 
            Para ver o mapa de linha com respostas individuais, é necessário importar dados detalhados por pergunta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Linha por Pilar</h2>
        <p className="text-gray-600">Visualize as respostas de cada pergunta individual para identificar padrões e divergências por indicador</p>
        <p className="text-sm text-gray-500 mt-1">
          Cada ponto representa a nota de uma pergunta específica do pilar selecionado
        </p>
      </div>

      {/* Controles */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Pilar
            </label>
            <Select value={pilarSelecionado} onValueChange={setPilarSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pilar..." />
              </SelectTrigger>
              <SelectContent>
                {pilaresDisponiveis.map((pilar) => (
                  <SelectItem key={pilar} value={pilar}>
                    {pilar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de Visualização
            </label>
            <Select value={modoVisualizacao} onValueChange={(value: 'linha' | 'dispersao') => setModoVisualizacao(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linha">Gráfico de Linha</SelectItem>
                <SelectItem value="dispersao">Gráfico de Dispersão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {dadosGrafico.length} perguntas
              </div>
              <div className="text-sm text-gray-600">
                {personas.length} personas
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Estatísticas do Pilar */}
      {estatisticasPilar && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Média Geral</div>
            <div className="text-xl font-bold text-blue-600">{estatisticasPilar.media}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Desvio Padrão</div>
            <div className="text-xl font-bold text-orange-600">{estatisticasPilar.desvio}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Mínimo</div>
            <div className="text-xl font-bold text-red-600">{estatisticasPilar.min}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Máximo</div>
            <div className="text-xl font-bold text-green-600">{estatisticasPilar.max}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Amplitude</div>
            <div className="text-xl font-bold text-purple-600">{estatisticasPilar.max - estatisticasPilar.min}</div>
          </Card>
        </div>
      )}

      {/* Gráfico Principal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {pilarSelecionado} - {modoVisualizacao === 'linha' ? 'Visualização em Linha' : 'Visualização por Dispersão'}
          </h3>
          <Badge variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            {modoVisualizacao === 'linha' ? 'Tendências por pergunta' : 'Pontos individuais por pergunta'}
          </Badge>
        </div>

        {dadosGrafico.length === 0 ? (
          <div className="h-96 w-full flex items-center justify-center">
            <div className="text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Sem dados detalhados</h4>
              <p className="text-gray-600 mb-2">
                Não há dados detalhados por pergunta para o pilar "{pilarSelecionado}"
              </p>
              <p className="text-sm text-gray-500">
                Esta visualização mostra as respostas individuais de cada pergunta do pilar.
                Para ver dados consolidados, acesse a aba "Radar" nos Resultados.
              </p>
            </div>
          </div>
        ) : (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {modoVisualizacao === 'linha' ? (
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="pergunta"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Pontuação', angle: -90, position: 'insideLeft' }}
                />
                
                {/* Linha da média */}
                <Line
                  dataKey="media"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Média"
                />
                
                {/* Linhas das personas */}
                {personas.map((persona, index) => (
                  <Line
                    key={persona.id}
                    dataKey={persona.nome}
                    stroke={PERSONA_COLORS[index % PERSONA_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={persona.nome}
                  />
                ))}
                
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 border rounded-lg shadow-lg">
                          <p className="font-medium mb-2">{data.perguntaCompleta}</p>
                          <div className="space-y-1">
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{entry.name}: {entry.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                            <div>Amplitude: {data.max - data.min} pontos</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </LineChart>
            ) : (
              <ScatterChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  dataKey="perguntaIndex"
                  domain={[0.5, dadosGrafico.length + 0.5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Perguntas', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Pontuação', angle: -90, position: 'insideLeft' }}
                />
                
                {/* Linha de referência da média */}
                <ReferenceLine y={estatisticasPilar?.media} stroke="#94a3b8" strokeDasharray="5 5" />
                
                {personas.map((persona, index) => (
                  <Scatter
                    key={persona.id}
                    name={persona.nome}
                    data={dadosGrafico.map(d => ({
                      x: d.perguntaIndex,
                      y: d[persona.nome]
                    }))}
                    fill={PERSONA_COLORS[index % PERSONA_COLORS.length]}
                  />
                ))}
                
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const pergunta = dadosGrafico.find(d => d.perguntaIndex === data.x);
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium text-sm mb-1">
                            {pergunta?.perguntaCompleta}
                          </p>
                          <p className="text-xs text-gray-600">
                            Pontuação: {data.y}/5.0
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Legend />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>
        )}
      </Card>
    </div>
  );
}