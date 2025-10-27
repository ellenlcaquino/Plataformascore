import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

interface HeatmapDivergenciaProps {
  dadosMultiplosRespondentes?: any[];
}

// Dados de exemplo para demonstração do heatmap
const DADOS_EXEMPLO_DIVERGENCIA = [
  { pergunta: 'P1', pilar: 'Processos', amplitude: 4.2, risco: 'crítico', texto: 'Existe uma esteira de desenvolvimento bem estruturada?' },
  { pergunta: 'P15', pilar: 'Processos', amplitude: 3.8, risco: 'alto', texto: 'Existe e é aplicado o contrato de Definition Of Ready?' },
  { pergunta: 'A3', pilar: 'Automação', amplitude: 4.5, risco: 'crítico', texto: 'Quão robustos e confiáveis são os testes automatizados?' },
  { pergunta: 'A8', pilar: 'Automação', amplitude: 3.2, risco: 'médio', texto: 'A arquitetura da automação permite fácil manutenção?' },
  { pergunta: 'M5', pilar: 'Métricas', amplitude: 2.9, risco: 'médio', texto: 'Existem métricas para avaliar o desempenho do projeto?' },
  { pergunta: 'D7', pilar: 'Documentação', amplitude: 3.6, risco: 'alto', texto: 'A documentação inclui informações sobre os limites do projeto?' },
  { pergunta: 'T12', pilar: 'Modalidades', amplitude: 1.8, risco: 'baixo', texto: 'Quais modalidades de teste hoje os QAs aplicam?' },
  { pergunta: 'Q4', pilar: 'QAOps', amplitude: 4.1, risco: 'crítico', texto: 'Todos os membros da equipe praticam ações de responsabilidade?' },
  { pergunta: 'L6', pilar: 'Liderança', amplitude: 3.3, risco: 'médio', texto: 'Quão ativamente a liderança promove uma cultura de qualidade?' },
  { pergunta: 'L11', pilar: 'Liderança', amplitude: 3.9, risco: 'alto', texto: 'Os QAs possuem uma visão clara sobre desenvolvimento pessoal?' }
];

const getRiscoColor = (risco: string) => {
  switch (risco) {
    case 'crítico': return '#dc2626';
    case 'alto': return '#ea580c';
    case 'médio': return '#d97706';
    case 'baixo': return '#16a34a';
    default: return '#64748b';
  }
};

const getRiscoLabel = (amplitude: number) => {
  if (amplitude >= 4.0) return 'crítico';
  if (amplitude >= 3.5) return 'alto';
  if (amplitude >= 2.5) return 'médio';
  return 'baixo';
};

export function HeatmapDivergencia({ dadosMultiplosRespondentes }: HeatmapDivergenciaProps) {
  // Usar dados de exemplo se não houver dados reais de múltiplos respondentes
  const dadosDivergencia = dadosMultiplosRespondentes || DADOS_EXEMPLO_DIVERGENCIA;

  const dadosGrafico = dadosDivergencia
    .sort((a, b) => b.amplitude - a.amplitude)
    .slice(0, 10); // Top 10 divergências

  // Análise de convergências (baixa divergência)
  const dadosConvergencia = dadosDivergencia
    .filter(item => item.amplitude < 2.0) // Considerar convergência quando amplitude < 2
    .sort((a, b) => a.amplitude - b.amplitude)
    .slice(0, 5); // Top 5 convergências

  // Análise de pontos críticos (alta divergência + baixa média)
  const pontosCriticos = dadosDivergencia
    .filter(item => item.amplitude >= 3.0)
    .sort((a, b) => b.amplitude - a.amplitude);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mapa de Risco - Divergência Interna</h2>
        <p className="text-gray-600">
          Identificação de perguntas com maior desalinhamento entre respondentes
        </p>
      </div>

      {/* Alerta se usando dados de exemplo */}
      {!dadosMultiplosRespondentes && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-amber-800 text-sm">
              <strong>Dados Simulados:</strong> Esta análise requer múltiplos respondentes. 
              Os dados apresentados são exemplos para demonstração da funcionalidade.
            </p>
          </div>
        </Card>
      )}

      {/* Nova representação visual: Matrix de Risco com Cards Interativos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Top 10 Perguntas com Maior Divergência</h3>
        
        {/* Grid de cards para visualização mais intuitiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dadosGrafico.slice(0, 10).map((item, index) => (
            <Card 
              key={index} 
              className={`p-4 relative transition-all duration-200 hover:shadow-lg border-2 ${
                item.risco === 'crítico' ? 'border-red-200 bg-red-50/50' :
                item.risco === 'alto' ? 'border-orange-200 bg-orange-50/50' :
                item.risco === 'médio' ? 'border-yellow-200 bg-yellow-50/50' :
                'border-green-200 bg-green-50/50'
              }`}
            >
              {/* Header do card com ranking e nível de risco */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index < 3 ? 'bg-red-600' : index < 6 ? 'bg-orange-600' : 'bg-yellow-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <Badge 
                    className="text-xs"
                    style={{ 
                      backgroundColor: getRiscoColor(item.risco), 
                      color: 'white' 
                    }}
                  >
                    {item.risco.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Informações principais */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{item.pergunta}</span>
                    <span className="text-sm text-gray-600">• {item.pilar}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.texto}
                  </p>
                </div>

                {/* Visualização da amplitude com barra de progresso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Amplitude de Divergência</span>
                    <span className="font-bold" style={{ color: getRiscoColor(item.risco) }}>
                      {item.amplitude}/5.0
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300 relative"
                      style={{ 
                        width: `${(item.amplitude / 5) * 100}%`,
                        backgroundColor: getRiscoColor(item.risco)
                      }}
                    >
                      {/* Efeito de gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                    </div>
                  </div>
                </div>

                {/* Interpretação dinâmica */}
                <div className="mt-3 p-2 rounded-lg bg-white/70 border border-gray-200">
                  <p className="text-xs text-gray-700">
                    <strong>Interpretação:</strong> {
                      item.amplitude >= 4.0 ? 'Desalinhamento crítico entre equipes. Ação imediata necessária.' :
                      item.amplitude >= 3.5 ? 'Necessita reunião de alinhamento entre stakeholders.' :
                      item.amplitude >= 2.5 ? 'Pequenas divergências de percepção, monitoramento recomendado.' :
                      'Consenso geral entre respondentes, situação sob controle.'
                    }
                  </p>
                </div>
              </div>

              {/* Indicador visual no canto superior direito */}
              <div 
                className="absolute top-2 right-2 w-4 h-4 rounded-full"
                style={{ backgroundColor: getRiscoColor(item.risco) }}
                title={`Nível de risco: ${item.risco}`}
              ></div>
            </Card>
          ))}
        </div>

        {/* Novo gráfico scatter plot para visualização comparativa */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-700 mb-4">Visualização Comparativa - Amplitude vs Média</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="media"
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Média das Respostas', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="amplitude"
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Amplitude de Divergência', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis range={[64, 144]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                          <p className="font-medium text-gray-900 mb-2">{data.pergunta} - {data.pilar}</p>
                          <p className="text-sm text-gray-600 mb-2">{data.perguntaCompleta}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Média:</span>
                              <span className="font-medium">{data.media}/5.0</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Amplitude:</span>
                              <span className="font-medium">{data.amplitude}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Risco:</span>
                              <Badge style={{ backgroundColor: getRiscoColor(data.risco), color: 'white' }}>
                                {data.risco}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            {data.media > 3.5 && data.amplitude < 1.5 ? 'Alta performance com consenso' :
                             data.media > 3.5 && data.amplitude >= 1.5 ? 'Boa média mas há divergência' :
                             data.media <= 3.5 && data.amplitude >= 1.5 ? 'Baixa performance com divergência' :
                             'Performance baixa mas consensual'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  dataKey="amplitude" 
                  fill="#3b82f6"
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`scatter-${index}`} fill={getRiscoColor(entry.risco)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda para interpretação do scatter plot */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Interpretação dos Quadrantes:</h5>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Alta Média + Baixa Amplitude = Performance Excelente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Alta Média + Alta Amplitude = Precisa Alinhamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Baixa Média + Alta Amplitude = Área Crítica</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Baixa Média + Baixa Amplitude = Oportunidade Consensual</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Eixos de Análise:</h5>
              <div className="space-y-1 text-xs text-gray-600">
                <div>• <strong>Eixo X (Média):</strong> Performance geral da equipe</div>
                <div>• <strong>Eixo Y (Amplitude):</strong> Nível de consenso/divergência</div>
                <div>• <strong>Cor do Ponto:</strong> Nível de risco calculado</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabela detalhada */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Análise Detalhada de Divergências</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Pergunta</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Pilar</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Amplitude</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Nível de Risco</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Implicação</th>
              </tr>
            </thead>
            <tbody>
              {dadosDivergencia
                .sort((a, b) => b.amplitude - a.amplitude)
                .map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="font-medium text-gray-900">{item.pergunta}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">
                      {item.texto.length > 60 ? `${item.texto.slice(0, 60)}...` : item.texto}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-700">{item.pilar}</td>
                  <td className="py-3 px-2">
                    <span className="font-medium" style={{ color: getRiscoColor(item.risco) }}>
                      {item.amplitude}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <Badge 
                      style={{ 
                        backgroundColor: getRiscoColor(item.risco), 
                        color: 'white' 
                      }}
                    >
                      {item.risco.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-gray-600 text-xs max-w-xs">
                    {item.amplitude >= 4.0 ? 'Desalinhamento crítico entre áreas' :
                     item.amplitude >= 3.5 ? 'Necessita alinhamento entre stakeholders' :
                     item.amplitude >= 2.5 ? 'Pequenas divergências de percepção' :
                     'Consenso geral entre respondentes'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Nova seção de Análise de Divergências e Convergências */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análise de Divergências */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Pontos de Divergência</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">
                  {dadosDivergencia.filter(item => item.amplitude >= 4.0).length}
                </div>
                <div className="text-xs text-red-600">Críticos</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">
                  {dadosDivergencia.filter(item => item.amplitude >= 3.0 && item.amplitude < 4.0).length}
                </div>
                <div className="text-xs text-orange-600">Altos</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">
                  {dadosDivergencia.filter(item => item.amplitude >= 2.0 && item.amplitude < 3.0).length}
                </div>
                <div className="text-xs text-yellow-600">Moderados</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Top 3 Divergências Críticas:</h4>
              {pontosCriticos.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{item.pergunta}</div>
                    <div className="text-xs text-red-600">{item.pilar}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-700">{item.amplitude}</div>
                    <div className="text-xs text-red-600">amplitude</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">Recomendações:</span>
              </div>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Realizar workshops de alinhamento para pontos críticos</li>
                <li>• Criar sessões de discussão entre diferentes áreas</li>
                <li>• Documentar e comunicar decisões tomadas</li>
                <li>• Estabelecer critérios claros de avaliação</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Análise de Convergências */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Pontos de Convergência</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {dadosConvergencia.length}
                </div>
                <div className="text-xs text-green-600">Consensos</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {dadosConvergencia.length > 0 ? 
                    (dadosConvergencia.reduce((acc, item) => acc + item.amplitude, 0) / dadosConvergencia.length).toFixed(1) : 
                    '0.0'
                  }
                </div>
                <div className="text-xs text-blue-600">Amplitude Média</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Top 3 Áreas de Consenso:</h4>
              {dadosConvergencia.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <div className="font-medium text-green-900">{item.pergunta}</div>
                    <div className="text-xs text-green-600">{item.pilar}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-700">{item.amplitude}</div>
                    <div className="text-xs text-green-600">amplitude</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Pontos Fortes:</span>
              </div>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Equipe alinhada nessas práticas</li>
                <li>• Manter e replicar essas abordagens</li>
                <li>• Usar como referência para outras áreas</li>
                <li>• Documentar as boas práticas estabelecidas</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Cards de insights resumidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h4 className="font-medium text-red-900">Críticos</h4>
          </div>
          <div className="text-2xl font-bold text-red-700 mb-1">
            {dadosDivergencia.filter(item => item.amplitude >= 4.0).length}
          </div>
          <p className="text-xs text-red-600">
            Ação imediata necessária
          </p>
        </Card>

        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <h4 className="font-medium text-amber-900">Atenção</h4>
          </div>
          <div className="text-2xl font-bold text-amber-700 mb-1">
            {dadosDivergencia.filter(item => item.amplitude >= 3.0 && item.amplitude < 4.0).length}
          </div>
          <p className="text-xs text-amber-600">
            Necessitam alinhamento
          </p>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-green-900">Consenso</h4>
          </div>
          <div className="text-2xl font-bold text-green-700 mb-1">
            {dadosConvergencia.length}
          </div>
          <p className="text-xs text-green-600">
            Áreas bem alinhadas
          </p>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">Estáveis</h4>
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">
            {dadosDivergencia.filter(item => item.amplitude >= 2.0 && item.amplitude < 3.0).length}
          </div>
          <p className="text-xs text-blue-600">
            Monitoramento regular
          </p>
        </Card>
      </div>
    </div>
  );
}