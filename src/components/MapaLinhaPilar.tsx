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

// Configuração dos pilares e suas perguntas
const PILARES_CONFIG = {
  'Processos e Estratégia': {
    perguntas: [
      'Esteira de desenvolvimento estruturada',
      'Visão integrada de Negócio, Produto e Design',
      'Gerenciamento de mudanças nos requisitos',
      'Processo de code-review documentado',
      'Papéis e responsabilidades claros',
      'Metodologia de trabalho conhecida',
      'Reuniões claras e objetivas',
      'Cumprimento de prazos',
      'Sistema de rastreamento de bugs',
      'Atualização regular do bug tracking',
      'Plano de ação para bugs',
      'Diferenciação entre bug e melhoria',
      'Área de qualidade madura',
      'Governança e estratégia de qualidade',
      'Definition Of Ready',
      'Definition Of Done'
    ],
    keys: ['process1', 'process2', 'process3', 'process4', 'process5', 'process6', 'process7', 'process8', 'process9', 'process10', 'process11', 'process12', 'process13', 'process14', 'process15', 'process16']
  },
  'Testes Automatizados': {
    perguntas: [
      'Cobertura de testes automatizados',
      'Coverage funcional no core business',
      'Robustez e confiabilidade dos testes',
      'Capacidade de lidar com flutuações',
      'Integração ao continuous testing',
      'Integração aos processos de CI/CD',
      'Execução automática em builds',
      'Facilidade de manutenção',
      'Escalabilidade dos testes',
      'Eficiência em tempo e recursos',
      'Clareza nos registros',
      'Monitoramento contínuo',
      'Padrões e boas práticas',
      'Melhoria contínua',
      'Documentação técnica',
      'Code review nos scripts'
    ],
    keys: ['auto1', 'auto2', 'auto3', 'auto4', 'auto5', 'auto6', 'auto7', 'auto8', 'auto9', 'auto10', 'auto11', 'auto12', 'auto13', 'auto14', 'auto15', 'auto16']
  },
  'Métricas': {
    perguntas: [
      'Monitoramento de métricas da esteira',
      'Métricas de qualidade definidas',
      'Metas (OKR) para desenvolvimento',
      'Alinhamento com objetivos de negócio',
      'Métricas para melhoria contínua',
      'Utilidade para tomada de decisões',
      'Frequência de atualização',
      'Acessibilidade das métricas',
      'Responsabilidade do QA nas métricas',
      'SLAs para correção de defeitos',
      'Análises periódicas das métricas',
      'Métricas de satisfação do cliente',
      'Taxa de rejeição de casos de teste',
      'Análises pós-implantação'
    ],
    keys: ['metric1', 'metric2', 'metric3', 'metric4', 'metric5', 'metric6', 'metric7', 'metric8', 'metric9', 'metric10', 'metric11', 'metric12', 'metric13', 'metric14']
  },
  'Documentações': {
    perguntas: [
      'Documentação de requisitos',
      'Abrangência da documentação',
      'Atualização regular',
      'Acessibilidade da documentação',
      'Qualidade geral das documentações',
      'Disponibilidade em múltiplos formatos',
      'Documentação de limites do projeto',
      'Padrões para gestão de testes',
      'Clareza dos cenários de testes',
      'Atualização dos cenários',
      'Gestão eficiente e rastreabilidade'
    ],
    keys: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'doc6', 'doc7', 'doc8', 'doc9', 'doc10', 'doc11']
  },
  'Modalidades de Testes': {
    perguntas: [
      'Preparação para outras modalidades',
      'Visão ampla de controle de qualidade',
      'Cobertura de testes funcionais',
      'Testes de protótipo',
      'Testes de desempenho',
      'Testes de compatibilidade',
      'Automação de testes de regressão',
      'Testes de recuperação de falhas',
      'Pair Testing com Dev e PO',
      'Testes de Acessibilidade',
      'Troca entre áreas para QA',
      'Modalidades aplicadas pelos QAs'
    ],
    keys: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12']
  },
  'QAOPS': {
    perguntas: [
      'Colaboração entre equipes',
      'Similaridade ambiente teste/produção',
      'Automação de reteste e regressão',
      'Responsabilidade coletiva na qualidade',
      'Monitoramento em tempo real',
      'Envolvimento do QA desde o início',
      'Cultura de aprendizado contínuo',
      'Sistemas de observabilidade',
      'Processo de melhoria contínua',
      'Aprendizado com incidentes'
    ],
    keys: ['qaops1', 'qaops2', 'qaops3', 'qaops4', 'qaops5', 'qaops6', 'qaops7', 'qaops8', 'qaops9', 'qaops10']
  },
  'Liderança': {
    perguntas: [
      'Apoio à qualidade e melhoria contínua',
      'Comunicação sobre importância da qualidade',
      'Transparência da liderança técnica',
      'Desenvolvimento de competências em qualidade',
      'Orçamento para qualidade',
      'Promoção da cultura de excelência',
      'Clareza nas metas de qualidade',
      'Indicadores de desempenho eficazes',
      'Feedback e oportunidades de melhoria',
      'Definição de responsabilidades e cumprimento de compromissos',
      'Clareza na trilha de carreira de QA',
      'Visão ampla da liderança de qualidade'
    ],
    keys: ['leader1', 'leader2', 'leader3', 'leader4', 'leader5', 'leader6', 'leader7', 'leader8', 'leader9', 'leader10', 'leader11', 'leader12']
  }
};

// Dados vazios por padrão (dados reais vêm via props)
const DADOS_EXEMPLO: any[] = [];

export function MapaLinhaPilar({ personas = DADOS_EXEMPLO }: MapaLinhaPilarProps) {
  const [pilarSelecionado, setPilarSelecionado] = useState<string>('Liderança');
  const [modoVisualizacao, setModoVisualizacao] = useState<'linha' | 'dispersao'>('linha');

  // Preparar dados para o gráfico selecionado
  const dadosGrafico = useMemo(() => {
    const pilarConfig = PILARES_CONFIG[pilarSelecionado as keyof typeof PILARES_CONFIG];
    if (!pilarConfig) return [];

    return pilarConfig.perguntas.map((pergunta, index) => {
      const perguntaKey = pilarConfig.keys[index];
      const dadoPergunta: any = {
        pergunta: `P${index + 1}`,
        perguntaCompleta: pergunta,
        perguntaIndex: index + 1
      };

      // Adicionar resposta de cada persona
      personas.forEach((persona, personaIndex) => {
        const resposta = persona.respostas[perguntaKey] || 0;
        dadoPergunta[persona.nome] = resposta;
        
        // Para o gráfico de dispersão, criar pontos individuais
        if (modoVisualizacao === 'dispersao') {
          dadoPergunta[`${persona.nome}_scatter`] = {
            x: index + 1,
            y: resposta,
            persona: persona.nome,
            cargo: persona.cargo
          };
        }
      });

      // Calcular estatísticas
      const respostas = personas.map(p => p.respostas[perguntaKey] || 0).filter(r => r > 0);
      dadoPergunta.media = respostas.length > 0 ? Number((respostas.reduce((a, b) => a + b, 0) / respostas.length).toFixed(1)) : 0;
      dadoPergunta.min = respostas.length > 0 ? Math.min(...respostas) : 0;
      dadoPergunta.max = respostas.length > 0 ? Math.max(...respostas) : 0;
      
      return dadoPergunta;
    });
  }, [pilarSelecionado, personas, modoVisualizacao]);

  // Calcular estatísticas do pilar
  const estatisticasPilar = useMemo(() => {
    const pilarConfig = PILARES_CONFIG[pilarSelecionado as keyof typeof PILARES_CONFIG];
    if (!pilarConfig) return null;

    const todasRespostas = pilarConfig.keys
      .flatMap(key => personas.map(p => p.respostas[key] || 0))
      .filter(r => r > 0);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Linha por Pilar</h2>
        <p className="text-gray-600">Visualize todas as respostas individuais para identificar padrões e divergências</p>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PILARES_CONFIG).map((pilar) => (
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
                {PILARES_CONFIG[pilarSelecionado as keyof typeof PILARES_CONFIG]?.perguntas.length || 0} perguntas
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
            {modoVisualizacao === 'linha' ? 'Tendências' : 'Pontos individuais'}
          </Badge>
        </div>

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
      </Card>

      {/* Lista de Perguntas com Estatísticas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detalhamento por Pergunta</h3>
        <div className="space-y-3">
          {dadosGrafico.map((item, index) => {
            const amplitude = item.max - item.min;
            const corAmplitude = amplitude >= 3 ? 'text-red-600' : amplitude >= 2 ? 'text-orange-600' : 'text-green-600';
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">P{index + 1}</Badge>
                      <span className="text-sm font-medium">{item.perguntaCompleta}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-600">Média: </span>
                      <span className="font-medium">{item.media}/5.0</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Amplitude: </span>
                      <span className={`font-medium ${corAmplitude}`}>{amplitude} pontos</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-xs">
                  {personas.map((persona, personaIndex) => {
                    const resposta = item[persona.nome] || 0;
                    const corResposta = resposta >= 4 ? 'text-green-600' : resposta >= 3 ? 'text-blue-600' : resposta >= 2 ? 'text-orange-600' : 'text-red-600';
                    
                    return (
                      <div key={persona.id} className="text-center">
                        <div className="text-gray-600">{persona.nome.split(' ')[0]}</div>
                        <div className={`font-medium ${corResposta}`}>{resposta}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legenda das Personas */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Legenda das Personas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {personas.map((persona, index) => (
            <div key={persona.id} className="flex items-center gap-2 text-sm">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: PERSONA_COLORS[index % PERSONA_COLORS.length] }}
              />
              <div>
                <div className="font-medium">{persona.nome}</div>
                <div className="text-xs text-gray-600">{persona.cargo}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}