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

// Dados de exemplo
const DADOS_EXEMPLO = [
  {
    id: 'persona1',
    nome: 'Ana Silva',
    empresa: 'TechCorp',
    cargo: 'QA Lead',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 4, 'leader2': 3, 'leader3': 4, 'leader4': 4, 'leader5': 3, 'leader6': 3, 'leader7': 3, 'leader8': 3, 'leader9': 3, 'leader10': 3, 'leader11': 3, 'leader12': 3,
      // Outros pilares (exemplo)
      'process1': 4, 'process2': 5, 'process3': 3, 'process4': 4, 'process5': 5, 'process6': 4, 'process7': 4, 'process8': 3, 'process9': 4, 'process10': 4, 'process11': 5, 'process12': 3, 'process13': 5, 'process14': 4, 'process15': 3, 'process16': 4,
      'auto1': 3, 'auto2': 4, 'auto3': 3, 'auto4': 3, 'auto5': 4, 'auto6': 4, 'auto7': 5, 'auto8': 3, 'auto9': 4, 'auto10': 3, 'auto11': 4, 'auto12': 3, 'auto13': 4, 'auto14': 4, 'auto15': 3, 'auto16': 4,
      'metric1': 3, 'metric2': 4, 'metric3': 3, 'metric4': 4, 'metric5': 3, 'metric6': 4, 'metric7': 3, 'metric8': 4, 'metric9': 3, 'metric10': 3, 'metric11': 4, 'metric12': 3, 'metric13': 3, 'metric14': 4,
      'doc1': 4, 'doc2': 4, 'doc3': 3, 'doc4': 4, 'doc5': 4, 'doc6': 3, 'doc7': 4, 'doc8': 5, 'doc9': 4, 'doc10': 4, 'doc11': 4,
      'test1': 4, 'test2': 4, 'test3': 4, 'test4': 3, 'test5': 3, 'test6': 4, 'test7': 4, 'test8': 3, 'test9': 4, 'test10': 4, 'test11': 4, 'test12': 4,
      'qaops1': 3, 'qaops2': 3, 'qaops3': 4, 'qaops4': 3, 'qaops5': 3, 'qaops6': 4, 'qaops7': 3, 'qaops8': 3, 'qaops9': 3, 'qaops10': 3
    }
  },
  {
    id: 'persona2',
    nome: 'Carlos Santos',
    empresa: 'TechCorp',
    cargo: 'Senior QA',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 5, 'leader2': 5, 'leader3': 5, 'leader4': 5, 'leader5': 5, 'leader6': 5, 'leader7': 5, 'leader8': 5, 'leader9': 5, 'leader10': 5, 'leader11': 5, 'leader12': 5,
      // Outros pilares
      'process1': 3, 'process2': 4, 'process3': 4, 'process4': 3, 'process5': 4, 'process6': 4, 'process7': 3, 'process8': 4, 'process9': 4, 'process10': 3, 'process11': 4, 'process12': 4, 'process13': 3, 'process14': 4, 'process15': 4, 'process16': 3,
      'auto1': 5, 'auto2': 5, 'auto3': 4, 'auto4': 4, 'auto5': 5, 'auto6': 5, 'auto7': 4, 'auto8': 4, 'auto9': 5, 'auto10': 4, 'auto11': 4, 'auto12': 5, 'auto13': 5, 'auto14': 4, 'auto15': 4, 'auto16': 4,
      'metric1': 3, 'metric2': 3, 'metric3': 4, 'metric4': 3, 'metric5': 3, 'metric6': 3, 'metric7': 4, 'metric8': 3, 'metric9': 3, 'metric10': 3, 'metric11': 3, 'metric12': 3, 'metric13': 4, 'metric14': 3,
      'doc1': 3, 'doc2': 3, 'doc3': 4, 'doc4': 3, 'doc5': 4, 'doc6': 3, 'doc7': 3, 'doc8': 3, 'doc9': 4, 'doc10': 3, 'doc11': 4,
      'test1': 5, 'test2': 4, 'test3': 4, 'test4': 4, 'test5': 4, 'test6': 4, 'test7': 5, 'test8': 4, 'test9': 4, 'test10': 3, 'test11': 4, 'test12': 5,
      'qaops1': 4, 'qaops2': 4, 'qaops3': 5, 'qaops4': 4, 'qaops5': 4, 'qaops6': 4, 'qaops7': 4, 'qaops8': 4, 'qaops9': 4, 'qaops10': 3
    }
  },
  {
    id: 'persona3',
    nome: 'Maria Oliveira',
    empresa: 'TechCorp',
    cargo: 'QA Analyst',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 4, 'leader2': 4, 'leader3': 3, 'leader4': 3, 'leader5': 3, 'leader6': 3, 'leader7': 3, 'leader8': 3, 'leader9': 2, 'leader10': 3, 'leader11': 2, 'leader12': 2,
      // Outros pilares
      'process1': 3, 'process2': 3, 'process3': 2, 'process4': 3, 'process5': 3, 'process6': 3, 'process7': 3, 'process8': 3, 'process9': 3, 'process10': 3, 'process11': 3, 'process12': 2, 'process13': 3, 'process14': 3, 'process15': 3, 'process16': 3,
      'auto1': 2, 'auto2': 3, 'auto3': 3, 'auto4': 2, 'auto5': 3, 'auto6': 3, 'auto7': 3, 'auto8': 3, 'auto9': 2, 'auto10': 3, 'auto11': 3, 'auto12': 2, 'auto13': 3, 'auto14': 3, 'auto15': 3, 'auto16': 2,
      'metric1': 2, 'metric2': 3, 'metric3': 2, 'metric4': 2, 'metric5': 3, 'metric6': 2, 'metric7': 3, 'metric8': 2, 'metric9': 3, 'metric10': 2, 'metric11': 3, 'metric12': 2, 'metric13': 3, 'metric14': 2,
      'doc1': 3, 'doc2': 3, 'doc3': 3, 'doc4': 3, 'doc5': 3, 'doc6': 3, 'doc7': 3, 'doc8': 4, 'doc9': 3, 'doc10': 3, 'doc11': 3,
      'test1': 3, 'test2': 4, 'test3': 4, 'test4': 3, 'test5': 3, 'test6': 3, 'test7': 3, 'test8': 4, 'test9': 3, 'test10': 4, 'test11': 4, 'test12': 3,
      'qaops1': 2, 'qaops2': 2, 'qaops3': 2, 'qaops4': 2, 'qaops5': 2, 'qaops6': 2, 'qaops7': 2, 'qaops8': 2, 'qaops9': 2, 'qaops10': 2
    }
  },
  {
    id: 'persona4',
    nome: 'João Pereira',
    empresa: 'TechCorp',
    cargo: 'Tech Lead',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 5, 'leader2': 5, 'leader3': 5, 'leader4': 5, 'leader5': 5, 'leader6': 5, 'leader7': 5, 'leader8': 5, 'leader9': 5, 'leader10': 5, 'leader11': 5, 'leader12': 5,
      // Outros pilares
      'process1': 5, 'process2': 5, 'process3': 5, 'process4': 5, 'process5': 5, 'process6': 5, 'process7': 4, 'process8': 5, 'process9': 5, 'process10': 5, 'process11': 5, 'process12': 4, 'process13': 4, 'process14': 5, 'process15': 5, 'process16': 5,
      'auto1': 4, 'auto2': 4, 'auto3': 4, 'auto4': 5, 'auto5': 4, 'auto6': 5, 'auto7': 4, 'auto8': 4, 'auto9': 4, 'auto10': 4, 'auto11': 4, 'auto12': 4, 'auto13': 4, 'auto14': 4, 'auto15': 4, 'auto16': 5,
      'metric1': 4, 'metric2': 5, 'metric3': 5, 'metric4': 5, 'metric5': 4, 'metric6': 5, 'metric7': 4, 'metric8': 5, 'metric9': 4, 'metric10': 4, 'metric11': 5, 'metric12': 4, 'metric13': 4, 'metric14': 5,
      'doc1': 4, 'doc2': 4, 'doc3': 4, 'doc4': 4, 'doc5': 4, 'doc6': 4, 'doc7': 4, 'doc8': 4, 'doc9': 4, 'doc10': 4, 'doc11': 4,
      'test1': 4, 'test2': 4, 'test3': 4, 'test4': 3, 'test5': 4, 'test6': 4, 'test7': 4, 'test8': 3, 'test9': 4, 'test10': 3, 'test11': 4, 'test12': 4,
      'qaops1': 5, 'qaops2': 5, 'qaops3': 5, 'qaops4': 5, 'qaops5': 5, 'qaops6': 5, 'qaops7': 4, 'qaops8': 5, 'qaops9': 5, 'qaops10': 4
    }
  },
  {
    id: 'persona5',
    nome: 'Julia Costa',
    empresa: 'TechCorp',
    cargo: 'QA Junior',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 1, 'leader2': 1, 'leader3': 2, 'leader4': 2, 'leader5': 2, 'leader6': 2, 'leader7': 1, 'leader8': 1, 'leader9': 1, 'leader10': 1, 'leader11': 0, 'leader12': 2,
      // Outros pilares
      'process1': 2, 'process2': 2, 'process3': 2, 'process4': 1, 'process5': 2, 'process6': 2, 'process7': 3, 'process8': 2, 'process9': 2, 'process10': 2, 'process11': 2, 'process12': 2, 'process13': 2, 'process14': 2, 'process15': 2, 'process16': 2,
      'auto1': 1, 'auto2': 2, 'auto3': 2, 'auto4': 1, 'auto5': 2, 'auto6': 2, 'auto7': 2, 'auto8': 1, 'auto9': 2, 'auto10': 2, 'auto11': 2, 'auto12': 1, 'auto13': 2, 'auto14': 2, 'auto15': 1, 'auto16': 2,
      'metric1': 1, 'metric2': 1, 'metric3': 2, 'metric4': 1, 'metric5': 2, 'metric6': 1, 'metric7': 2, 'metric8': 1, 'metric9': 2, 'metric10': 1, 'metric11': 2, 'metric12': 1, 'metric13': 2, 'metric14': 1,
      'doc1': 2, 'doc2': 3, 'doc3': 2, 'doc4': 3, 'doc5': 2, 'doc6': 2, 'doc7': 3, 'doc8': 3, 'doc9': 2, 'doc10': 2, 'doc11': 3,
      'test1': 1, 'test2': 2, 'test3': 2, 'test4': 2, 'test5': 1, 'test6': 2, 'test7': 2, 'test8': 2, 'test9': 2, 'test10': 2, 'test11': 2, 'test12': 2,
      'qaops1': 1, 'qaops2': 1, 'qaops3': 1, 'qaops4': 1, 'qaops5': 1, 'qaops6': 1, 'qaops7': 2, 'qaops8': 1, 'qaops9': 1, 'qaops10': 1
    }
  },
  {
    id: 'persona6',
    nome: 'Fernando Alves',
    empresa: 'TechCorp',
    cargo: 'QA Mid',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 4, 'leader2': 4, 'leader3': 4, 'leader4': 3, 'leader5': 3, 'leader6': 3, 'leader7': 3, 'leader8': 3, 'leader9': 4, 'leader10': 4, 'leader11': 4, 'leader12': 4,
      // Outros pilares
      'process1': 4, 'process2': 3, 'process3': 3, 'process4': 4, 'process5': 3, 'process6': 4, 'process7': 3, 'process8': 3, 'process9': 4, 'process10': 3, 'process11': 4, 'process12': 3, 'process13': 3, 'process14': 3, 'process15': 4, 'process16': 3,
      'auto1': 3, 'auto2': 3, 'auto3': 4, 'auto4': 3, 'auto5': 3, 'auto6': 4, 'auto7': 3, 'auto8': 3, 'auto9': 3, 'auto10': 4, 'auto11': 3, 'auto12': 3, 'auto13': 4, 'auto14': 3, 'auto15': 3, 'auto16': 3,
      'metric1': 3, 'metric2': 2, 'metric3': 3, 'metric4': 3, 'metric5': 2, 'metric6': 3, 'metric7': 3, 'metric8': 2, 'metric9': 3, 'metric10': 3, 'metric11': 2, 'metric12': 3, 'metric13': 2, 'metric14': 3,
      'doc1': 3, 'doc2': 4, 'doc3': 3, 'doc4': 4, 'doc5': 3, 'doc6': 3, 'doc7': 4, 'doc8': 3, 'doc9': 3, 'doc10': 4, 'doc11': 3,
      'test1': 3, 'test2': 3, 'test3': 3, 'test4': 4, 'test5': 3, 'test6': 3, 'test7': 3, 'test8': 3, 'test9': 3, 'test10': 3, 'test11': 3, 'test12': 3,
      'qaops1': 3, 'qaops2': 2, 'qaops3': 3, 'qaops4': 3, 'qaops5': 2, 'qaops6': 3, 'qaops7': 3, 'qaops8': 2, 'qaops9': 3, 'qaops10': 3
    }
  },
  {
    id: 'persona7',
    nome: 'Lucia Santos',
    empresa: 'TechCorp',
    cargo: 'QA Senior',
    respostas: {
      // Liderança - exemplo fornecido
      'leader1': 3, 'leader2': 4, 'leader3': 4, 'leader4': 4, 'leader5': 2, 'leader6': 2, 'leader7': 3, 'leader8': 3, 'leader9': 4, 'leader10': 3, 'leader11': 3, 'leader12': 3,
      // Outros pilares
      'process1': 3, 'process2': 4, 'process3': 3, 'process4': 3, 'process5': 4, 'process6': 3, 'process7': 4, 'process8': 3, 'process9': 3, 'process10': 4, 'process11': 3, 'process12': 3, 'process13': 4, 'process14': 3, 'process15': 3, 'process16': 4,
      'auto1': 4, 'auto2': 3, 'auto3': 3, 'auto4': 4, 'auto5': 3, 'auto6': 3, 'auto7': 4, 'auto8': 3, 'auto9': 3, 'auto10': 3, 'auto11': 4, 'auto12': 3, 'auto13': 3, 'auto14': 4, 'auto15': 3, 'auto16': 3,
      'metric1': 2, 'metric2': 3, 'metric3': 3, 'metric4': 2, 'metric5': 3, 'metric6': 2, 'metric7': 3, 'metric8': 3, 'metric9': 2, 'metric10': 3, 'metric11': 3, 'metric12': 2, 'metric13': 3, 'metric14': 2,
      'doc1': 4, 'doc2': 3, 'doc3': 3, 'doc4': 3, 'doc5': 4, 'doc6': 3, 'doc7': 3, 'doc8': 4, 'doc9': 3, 'doc10': 3, 'doc11': 4,
      'test1': 4, 'test2': 3, 'test3': 3, 'test4': 3, 'test5': 4, 'test6': 3, 'test7': 4, 'test8': 3, 'test9': 3, 'test10': 4, 'test11': 3, 'test12': 4,
      'qaops1': 2, 'qaops2': 3, 'qaops3': 3, 'qaops4': 2, 'qaops5': 3, 'qaops6': 2, 'qaops7': 3, 'qaops8': 3, 'qaops9': 2, 'qaops10': 3
    }
  }
];

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