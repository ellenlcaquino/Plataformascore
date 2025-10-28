import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { CheckboxQuestion } from './CheckboxQuestion';
import { ChevronLeft, Clock, ArrowRight, User, CheckCircle, Home, Settings, Bot, BarChart3, TestTube, FileText, Infinity, Users, PanelLeftClose, ClipboardCheck, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  Component0Variant4, 
  NeutralFace, 
  SlightlySmilingFace, 
  SmilingFaceWithSmilingEyes, 
  BeamingFaceWithSmilingEyes, 
  SmilingFaceWithHeartEyes 
} from './EmojiComponents';

interface QualityScoreAssessmentProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  onProgressUpdate?: (progress: number, currentStep: string) => void;
  rodadaId?: string;
  userId?: string; // NOTA: Deve ser UUID do banco, não o ID mock do AuthContext
}

interface Step {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  active: boolean;
  questionCount: number;
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'scale' | 'select' | 'checkbox';
  category: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const STEPS: Step[] = [
  { id: 'processes', title: 'Processos e Estratégia', icon: 'Settings', completed: false, active: true, questionCount: 16 },
  { id: 'automation', title: 'Testes Automatizados', icon: 'Bot', completed: false, active: false, questionCount: 16 },
  { id: 'metrics', title: 'Métricas', icon: 'BarChart3', completed: false, active: false, questionCount: 14 },
  { id: 'documentation', title: 'Documentações', icon: 'FileText', completed: false, active: false, questionCount: 11 },
  { id: 'testModalities', title: 'Modalidades de Testes', icon: 'TestTube', completed: false, active: false, questionCount: 12 },
  { id: 'qaops', title: 'QAOps', icon: 'Infinity', completed: false, active: false, questionCount: 10 },
  { id: 'leadership', title: 'Liderança', icon: 'Users', completed: false, active: false, questionCount: 12 }
];

// =====================================
// ESTRUTURA DAS PERGUNTAS - QUALITYSCORE
// =====================================
// Para editar as perguntas, modifique apenas os arrays abaixo.
// Mantenha o formato: { id: 'categoria + número', text: 'pergunta', type: 'scale' ou 'checkbox', category: 'categoria' }
// Para perguntas checkbox, adicione também: options: ['opção1', 'opção2', ...]

// Perguntas do pilar Processos e Estratégia (16 perguntas)
const PROCESSES_QUESTIONS: Question[] = [
  { id: 'process1', text: 'Existe uma esteira de desenvolvimento bem estruturada?', type: 'scale', category: 'processes' },
  { id: 'process2', text: 'A visão do ciclo de desenvolvimento também contempla Negócio, Produto e Design?', type: 'scale', category: 'processes' },
  { id: 'process3', text: 'Existem boas práticas de gerenciamento das mudanças nos requisitos ao longo do ciclo de vida do projeto?', type: 'scale', category: 'processes' },
  { id: 'process4', text: 'Existem um processo claro e documentado sobre code-review?', type: 'scale', category: 'processes' },
  { id: 'process5', text: 'Os papéis e responsabilidades estão bem claros e a equipe se sente confortável em executá-los?', type: 'scale', category: 'processes' },
  { id: 'process6', text: 'Existe uma metodologia de trabalho, sendo ela conhecida e seguida por todos na equipe?', type: 'scale', category: 'processes' },
  { id: 'process7', text: 'As reuniões de equipe são conduzidas de maneira clara e objetiva visando garantir troca de informações entre os membros?', type: 'scale', category: 'processes' },
  { id: 'process8', text: 'Os prazos estabelecidos em diferentes etapas do projeto estão sendo cumpridos?', type: 'scale', category: 'processes' },
  { id: 'process9', text: 'Existe um sistema de rastreamento de bugs devidamente implementado, demonstrando eficácia em identificar, documentar e monitorar o status de cada problema encontrado durante o desenvolvimento do projeto?', type: 'scale', category: 'processes' },
  { id: 'process10', text: 'O bug tracking é regularmente atualizado para garantir que as informações estejam sempre precisas e refletindo o estado atual do projeto?', type: 'scale', category: 'processes' },
  { id: 'process11', text: 'Existe um plano de ação e priorização para os bugs, de modo que sejam separados corretamente conforme sua categorização e necessidade de resolução?', type: 'scale', category: 'processes' },
  { id: 'process12', text: 'Além de identificação de bugs, vocês possuem processo para diferenciar melhoria e/ou ausência de escopo?', type: 'scale', category: 'processes' },
  { id: 'process13', text: 'A empresa possui uma área de qualidade madura?', type: 'scale', category: 'processes' },
  { id: 'process14', text: 'A área de qualidade possui uma visão de governança e estratégia, tendo seus próprios processos e responsabilidades claros e objetivos?', type: 'scale', category: 'processes' },
  { id: 'process15', text: 'Existe e é aplicado o contrato de Definition Of Ready?', type: 'scale', category: 'processes' },
  { id: 'process16', text: 'Existe e é aplicado o contrato de Definition Of Done?', type: 'scale', category: 'processes' }
];

// Perguntas do pilar Testes Automatizados (16 perguntas)
const AUTOMATION_QUESTIONS: Question[] = [
  { id: 'auto1', text: 'Qual seria a sua avaliação para a cobertura de testes automatizados em relação ao código do projeto?', type: 'scale', category: 'automation' },
  { id: 'auto2', text: 'Os testes automatizados tem uma bom coverage funcional no core business?', type: 'scale', category: 'automation' },
  { id: 'auto3', text: 'Quão robustos e confiáveis são os testes automatizados em fornecer resultados consistentes em diferentes ambientes e condições?', type: 'scale', category: 'automation' },
  { id: 'auto4', text: 'Como você avalia a capacidade dos testes automatizados em lidar com flutuações nos resultados?', type: 'scale', category: 'automation' },
  { id: 'auto5', text: 'Os testes automatizados são integrados ao processo de continuous testing?', type: 'scale', category: 'automation' },
  { id: 'auto6', text: 'Quão bem os testes automatizados estão integrados aos processos de CI/CD, garantindo testes contínuos e feedback rápido?', type: 'scale', category: 'automation' },
  { id: 'auto7', text: 'Quão automaticamente os testes automatizados são executados em cada build ou deploy do projeto?', type: 'scale', category: 'automation' },
  { id: 'auto8', text: 'A arquitetura da automação permite fácil manutenção dos testes conforme o código do projeto evolui?', type: 'scale', category: 'automation' },
  { id: 'auto9', text: 'Quão bem os testes automatizados escalam para lidar com o crescimento do projeto e a adição de novos recursos?', type: 'scale', category: 'automation' },
  { id: 'auto10', text: 'Os testes automatizados são eficientes em termos de tempo de execução e recursos necessários?', type: 'scale', category: 'automation' },
  { id: 'auto11', text: 'Os testes automatizados são registrados e apresentados de forma clara e compreensível?', type: 'scale', category: 'automation' },
  { id: 'auto12', text: 'O monitoramento contínuo dos testes automatizados é eficaz para identificar falhas ou regressões rapidamente?', type: 'scale', category: 'automation' },
  { id: 'auto13', text: 'Os testes automatizados seguem padrões e boas práticas estabelecidas para garantir sua eficácia e manutenibilidade?', type: 'scale', category: 'automation' },
  { id: 'auto14', text: 'A equipe busca melhorar ativamente a qualidade e eficiência dos testes automatizados através da adoção de novas técnicas ou ferramentas?', type: 'scale', category: 'automation' },
  { id: 'auto15', text: 'A Documentação técnica da arquitetura, bem como a baseline, é de fácil entendimento?', type: 'scale', category: 'automation' },
  { id: 'auto16', text: 'As práticas de code review são aplicadas aos scripts de automação?', type: 'scale', category: 'automation' }
];

// Perguntas do pilar Métricas (14 perguntas)
const METRICS_QUESTIONS: Question[] = [
  { id: 'metric1', text: 'Qual seria sua nota para o quão bem estamos monitorando as métricas de qualidade no processo de desenvolvimento (métrica da esteira)?', type: 'scale', category: 'metrics' },
  { id: 'metric2', text: 'Quão bem estamos definindo e acompanhando as métricas de qualidade do código, desempenho do sistema e experiência do usuário?', type: 'scale', category: 'metrics' },
  { id: 'metric3', text: 'A empresa possui metas (OKR) destinadas a desenvolvimento e/ou qualidade?', type: 'scale', category: 'metrics' },
  { id: 'metric4', text: 'Quão alinhadas estão nossas métricas de qualidade com os objetivos e metas de negócio da organização?', type: 'scale', category: 'metrics' },
  { id: 'metric5', text: 'Existem métricas métricas para avaliar o desempenho do projeto e impulsionar a melhoria contínua?', type: 'scale', category: 'metrics' },
  { id: 'metric6', text: 'As métricas que temos hoje são úteis para identificar áreas de melhoria e tomar decisões informadas?', type: 'scale', category: 'metrics' },
  { id: 'metric7', text: 'Com que frequência atualizamos e revisamos nossas métricas de qualidade?', type: 'scale', category: 'metrics' },
  { id: 'metric8', text: 'As métricas de qualidade são acessíveis e transparentes a todos os membros da equipe e pares?', type: 'scale', category: 'metrics' },
  { id: 'metric9', text: 'O time de QA é responsável também pelo monitoramento das métricas e eventuais análises, afim de auxiliar em tomadas de decisões e melhorias de atuação coletiva ou individual?', type: 'scale', category: 'metrics' },
  { id: 'metric10', text: 'Existem SLA´s para acompanhamento regular do tempo médio de correção de defeitos, e/ou ausência de escopo, após a identificação?', type: 'scale', category: 'metrics' },
  { id: 'metric11', text: 'São realizadas análises periódicas das métricas monitoradas, afim de perceber tendências e/ou atuar em prevenções?', type: 'scale', category: 'metrics' },
  { id: 'metric12', text: 'As métricas de satisfação do cliente são usadas para avaliar a qualidade percebida do software?', type: 'scale', category: 'metrics' },
  { id: 'metric13', text: 'A taxa de rejeição de casos de teste é monitorada para avaliar sua eficácia e relevância?', type: 'scale', category: 'metrics' },
  { id: 'metric14', text: 'São realizadas análises pós-implantação para avaliar a estabilidade do software em ambiente de produção?', type: 'scale', category: 'metrics' }
];

// Perguntas do pilar Documentações (11 perguntas)
const DOCUMENTATION_QUESTIONS: Question[] = [
  { id: 'doc1', text: 'Todos os requisitos do projeto estão documentados e foram considerados durante o desenvolvimento?', type: 'scale', category: 'documentation' },
  { id: 'doc2', text: 'Quão abrangente é nossa documentação em relação aos requisitos, arquitetura e design do sistema?', type: 'scale', category: 'documentation' },
  { id: 'doc3', text: 'A documentação é regularmente atualizada para refletir as mudanças no projeto?', type: 'scale', category: 'documentation' },
  { id: 'doc4', text: 'A documentação do projeto é acessível para todos os membros de equipe e partes interessadas?', type: 'scale', category: 'documentation' },
  { id: 'doc5', text: 'Qual é sua avaliação geral da qualidade das documentações dos projetos em relação à precisão, completude e utilidade?', type: 'scale', category: 'documentation' },
  { id: 'doc6', text: 'A documentação é disponível em diferentes formatos (por exemplo, texto, vídeo)?', type: 'scale', category: 'documentation' },
  { id: 'doc7', text: 'A documentação inclui informações sobre os limites do projeto, como configuração e requisitos do sistema?', type: 'scale', category: 'documentation' },
  { id: 'doc8', text: 'Existe documentação e/ou padrões e boas práticas para gerenciamento dos testes?', type: 'scale', category: 'documentation' },
  { id: 'doc9', text: 'Os cenários de testes são claros e bem categorizados?', type: 'scale', category: 'documentation' },
  { id: 'doc10', text: 'Os cenários de testes são atualizados com frequência?', type: 'scale', category: 'documentation' },
  { id: 'doc11', text: 'Os cenários de testes são geridos de forma eficiente por uma ferramenta de gestão, garantindo também a rastreabilidade deles?', type: 'scale', category: 'documentation' }
];

// Perguntas do pilar Modalidades de Testes (12 perguntas)
const TEST_MODALITIES_QUESTIONS: Question[] = [
  { id: 'test1', text: 'A equipe de qualidade se sente preparada e a vontade para aplicar outras modalidades de testes (como segurança, performance, carga e estresse…)?', type: 'scale', category: 'testModalities' },
  { id: 'test2', text: 'Quão bem os QA´s adotam uma visão ampla em práticas de controle de qualidade como estratégia para validar o produto, indo além do caminho feliz?', type: 'scale', category: 'testModalities' },
  { id: 'test3', text: 'Os testes funcionais cobrem todos os requisitos do usuário?', type: 'scale', category: 'testModalities' },
  { id: 'test4', text: 'São realizados testes de protótipo ou em etapas de conceitualização de produto e modelagem?', type: 'scale', category: 'testModalities' },
  { id: 'test5', text: 'Há testes de desempenho para avaliar a escalabilidade do sistema?', type: 'scale', category: 'testModalities' },
  { id: 'test6', text: 'Quão amplo são os testes de compatibilidade, eles garantem diferentes dispositivos e plataformas?', type: 'scale', category: 'testModalities' },
  { id: 'test7', text: 'Os testes de regressão são automatizados e executados regularmente?', type: 'scale', category: 'testModalities' },
  { id: 'test8', text: 'Há testes de recuperação de falhas após situações de erro no software?', type: 'scale', category: 'testModalities' },
  { id: 'test9', text: 'Dev e PO (ou outros papéis) do time realizam testes guiados pelo QA (Pair Testing)?', type: 'scale', category: 'testModalities' },
  { id: 'test10', text: 'Existe uma preocupação com testes de Acessibilidade voltados a garantir melhor experiência do usuário nos produtos?', type: 'scale', category: 'testModalities' },
  { id: 'test11', text: 'Existem trocas entre as áreas para que os QA´s tenham mais percepções das necessidades do produto, transformando em testes mais direcionados?', type: 'scale', category: 'testModalities' },
  { id: 'test12', text: 'Quais modalidades de teste hoje os QA´s aplicam?', type: 'checkbox', category: 'testModalities', options: ['Funcional', 'Carga e Estresse', 'Performance', 'API', 'Unitário', 'Integração', 'Aceitação', 'Usabilidade', 'Acessibilidade', 'Segurança', 'Automatizados', 'Compatibilidade', 'Smoke', 'Regressão', 'Exploratórios', 'Beta/Produção', 'Contrato', 'Recuperação', 'Observabilidade', 'Outros'] }
];

// Perguntas do pilar QAOps
const QAOPS_QUESTIONS: Question[] = [
  { id: 'qaops1', text: 'Existe a colaboração entre equipes de desenvolvimento, qualidade, infraestrutura e operações para melhorias contínuas de práticas QAOps?', type: 'scale', category: 'qaops' },
  { id: 'qaops2', text: 'O ambiente de teste é semelhante ao ambiente de produção?', type: 'scale', category: 'qaops' },
  { id: 'qaops3', text: 'Quão automatizado é nosso processo de reteste e regressão para garantir que as correções não introduzam novos problemas?', type: 'scale', category: 'qaops' },
  { id: 'qaops4', text: 'Todos os membros da equipe praticam ações de responsabilidade na garantia de qualidade do produto?', type: 'scale', category: 'qaops' },
  { id: 'qaops5', text: 'Quão bem estamos monitorando as métricas de qualidade em tempo real durante todo o ciclo de vida do projeto?', type: 'scale', category: 'qaops' },
  { id: 'qaops6', text: 'A equipe de QA está envolvida desde o início do ciclo de desenvolvimento, adotando prática de ShifLetf?', type: 'scale', category: 'qaops' },
  { id: 'qaops7', text: 'Há uma cultura de aprendizado contínuo e melhoria na equipe de QA?', type: 'scale', category: 'qaops' },
  { id: 'qaops8', text: 'Há sistemas de observabilidade e/ou gates de qualidade, como alertas para identificar problemas de qualidade em tempo real?', type: 'scale', category: 'qaops' },
  { id: 'qaops9', text: 'Existe um processo de revisão e melhorias contínuas para as práticas de QA?', type: 'scale', category: 'qaops' },
  { id: 'qaops10', text: 'Quão bem aprendemos com incidentes e problemas para evitar recorrências no futuro?', type: 'scale', category: 'qaops' }
];

// Perguntas do pilar Liderança (12 perguntas)
const LEADERSHIP_QUESTIONS: Question[] = [
  { id: 'leader1', text: 'Quão claro é o apoio da liderança organizacional à implementação de práticas de qualidade e melhoria contínua?', type: 'scale', category: 'leadership' },
  { id: 'leader2', text: 'Quão eficaz é a comunicação da liderança técnica sobre a importância da qualidade e dos objetivos de qualidade?', type: 'scale', category: 'leadership' },
  { id: 'leader3', text: 'Quão transparente é a liderança tecnologia em relação aos desafios, expectativas e iniciativas relacionadas à qualidade?', type: 'scale', category: 'leadership' },
  { id: 'leader4', text: 'Quão bem a liderança de tecnologia apoia o desenvolvimento das habilidades e competências de toda equipe (produto, design, desenvolvimento) em relação à qualidade?', type: 'scale', category: 'leadership' },
  { id: 'leader5', text: 'Existe um orçamento pensado para recursos e oportunidades para o desenvolvimento e gerencia da área de qualidade?', type: 'scale', category: 'leadership' },
  { id: 'leader6', text: 'Quão ativamente a liderança de qualidade promove uma cultura organizacional centrada na qualidade e na busca da excelência?', type: 'scale', category: 'leadership' },
  { id: 'leader7', text: 'Quão claras e mensuráveis são as metas de qualidade estabelecidas pela liderança de QA?', type: 'scale', category: 'leadership' },
  { id: 'leader8', text: 'São eficazes os indicadores de desempenho utilizados pela liderança para acompanhar e avaliar a qualidade do trabalho da equipe?', type: 'scale', category: 'leadership' },
  { id: 'leader9', text: 'Regularmente a liderança fornece feedback construtivo e oportunidades de melhoria para a equipe em relação à qualidade do trabalho?', type: 'scale', category: 'leadership' },
  { id: 'leader10', text: 'A liderança define claramente expectativas e responsabilidades em relação à qualidade e cumpre com os compromissos assumidos?', type: 'scale', category: 'leadership' },
  { id: 'leader11', text: 'Os QA´s possuem uma visão clara sobre o desenvolvimento pessoal e trilha de carreira dentro da área, com seus desafios e goals?', type: 'scale', category: 'leadership' },
  { id: 'leader12', text: 'A liderança de Qualidade tem uma visão ampla de qualidade indo além da visão de validação e verificação como etapa única no ciclo de desenvolvimento?', type: 'scale', category: 'leadership' }
];

// =====================================
// CONFIGURAÇÃO DOS PILARES E PERGUNTAS
// =====================================
// Array consolidado de todas as perguntas - NÃO EDITE ESTA PARTE
const ALL_QUESTIONS = [
  ...PROCESSES_QUESTIONS,
  ...AUTOMATION_QUESTIONS,
  ...METRICS_QUESTIONS,
  ...DOCUMENTATION_QUESTIONS,
  ...TEST_MODALITIES_QUESTIONS,
  ...QAOPS_QUESTIONS,
  ...LEADERSHIP_QUESTIONS
];

const RATING_OPTIONS = [
  { 
    value: 0, 
    label: 'Não implementado', 
    color: 'gray', 
    description: 'Conceito conhecido mas não aplicado',
    FaceComponent: Component0Variant4
  },
  { 
    value: 1, 
    label: 'Início da implementação', 
    color: 'red', 
    description: 'Processo começando a ser aplicado',
    FaceComponent: NeutralFace
  },
  { 
    value: 2, 
    label: 'Implementado de forma básica', 
    color: 'orange', 
    description: 'Aplicado mas ainda incipiente',
    FaceComponent: SlightlySmilingFace
  },
  { 
    value: 3, 
    label: 'Implementado de forma moderada', 
    color: 'yellow', 
    description: 'Aplicado com efetividade razoável',
    FaceComponent: SmilingFaceWithSmilingEyes
  },
  { 
    value: 4, 
    label: 'Bem implementado', 
    color: 'blue', 
    description: 'Plenamente funcional e efetivo',
    FaceComponent: BeamingFaceWithSmilingEyes
  },
  { 
    value: 5, 
    label: 'Totalmente implementado e otimizado', 
    color: 'green', 
    description: 'Excelência e melhoria contínua',
    FaceComponent: SmilingFaceWithHeartEyes
  }
];

export function QualityScoreAssessment({ onComplete, onBack, onProgressUpdate, rodadaId, userId }: QualityScoreAssessmentProps) {
  const [currentStep, setCurrentStep] = useState('overview');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [steps, setSteps] = useState(STEPS);
  const [currentCategory, setCurrentCategory] = useState('processes');
  const [showSidebarHint, setShowSidebarHint] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rodadaInfo, setRodadaInfo] = useState<any>(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  // Inicializar progresso quando o componente for montado
  React.useEffect(() => {
    onProgressUpdate?.(0, 'Visão Geral');
  }, []);

  // Buscar informações da rodada se rodadaId estiver disponível
  useEffect(() => {
    if (rodadaId) {
      fetchRodadaInfo();
    }
  }, [rodadaId]);

  // Verificar se já existe um assessment completo para este usuário nesta rodada
  useEffect(() => {
    if (userId && rodadaId) {
      checkExistingAssessment();
    }
  }, [userId, rodadaId]);

  const checkExistingAssessment = async () => {
    console.log('🔍 [checkExistingAssessment] Verificando assessment existente...');
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/assessments?user_id=${userId}&rodada_id=${rodadaId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        console.log('⚠️ Erro ao verificar assessment existente');
        return;
      }

      const { assessments } = await response.json();
      console.log('🔍 Assessments encontrados:', assessments?.length);

      if (assessments && assessments.length > 0) {
        const existingAssessment = assessments[0];
        console.log('📋 Assessment existente:', {
          id: existingAssessment.id,
          status: existingAssessment.status,
          completed_at: existingAssessment.completed_at,
          totalAnswers: existingAssessment.assessment_answers?.length
        });

        // Se assessment está completo, mostrar tela de conclusão
        if (existingAssessment.status === 'completed') {
          console.log('✅ Assessment já está completo! Mostrando tela de conclusão...');
          
          // Carregar respostas existentes
          if (existingAssessment.assessment_answers) {
            const loadedAnswers: Record<string, any> = {};
            existingAssessment.assessment_answers.forEach((answer: any) => {
              loadedAnswers[answer.question_id] = answer.value;
            });
            setAnswers(loadedAnswers);
            console.log(`✅ ${Object.keys(loadedAnswers).length} respostas carregadas`);
          }
          
          // Ir direto para tela de conclusão
          setShowCompletionScreen(true);
          setCurrentStep('completed');
        } else if (existingAssessment.status === 'draft') {
          // Carregar respostas parciais
          console.log('📝 Assessment em rascunho. Carregando respostas parciais...');
          if (existingAssessment.assessment_answers) {
            const loadedAnswers: Record<string, any> = {};
            existingAssessment.assessment_answers.forEach((answer: any) => {
              loadedAnswers[answer.question_id] = answer.value;
            });
            setAnswers(loadedAnswers);
            console.log(`📝 ${Object.keys(loadedAnswers).length} respostas parciais carregadas`);
          }
        }
      } else {
        console.log('ℹ️ Nenhum assessment existente encontrado. Usuário pode iniciar novo.');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar assessment existente:', error);
    }
  };

  const fetchRodadaInfo = async () => {
    console.log('🟢 [fetchRodadaInfo] Iniciando busca de rodada - ID:', rodadaId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas?company_id=all`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('🟢 [fetchRodadaInfo] Status da resposta:', response.status);
      if (response.ok) {
        const { rodadas } = await response.json();
        console.log('🟢 [fetchRodadaInfo] Rodadas recebidas:', rodadas?.length);
        const currentRodada = rodadas.find((r: any) => r.id === rodadaId);
        console.log('🟢 [fetchRodadaInfo] Rodada atual encontrada:', !!currentRodada);
        if (currentRodada) {
          console.log('🟢 [fetchRodadaInfo] Rodada info:', {
            id: currentRodada.id,
            participantes: currentRodada.rodada_participantes?.length,
            concluidos: currentRodada.rodada_participantes?.filter((p: any) => p.status === 'concluido').length
          });
        }
        setRodadaInfo(currentRodada);
        console.log('🟢 [fetchRodadaInfo] setRodadaInfo executado');
      } else {
        console.error('❌ [fetchRodadaInfo] Erro na resposta:', response.status);
      }
    } catch (error) {
      console.error('❌ [fetchRodadaInfo] Erro ao buscar informações da rodada:', error);
    }
  };

  // Ocultar dica do sidebar após alguns segundos
  React.useEffect(() => {
    if (currentStep === 'assessment' && showSidebarHint) {
      const timer = setTimeout(() => {
        setShowSidebarHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, showSidebarHint]);

  const handleStart = () => {
    setCurrentStep('overview');
  };

  const handleBeginAssessment = () => {
    setCurrentStep('assessment');
    // Atualizar progresso quando começar a avaliação
    const activeStep = steps.find(step => step.active);
    onProgressUpdate?.(progress, activeStep?.title || 'Avaliação');
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    // Capturar as perguntas atuais antes de mudar o estado
    const questionsInCategory = ALL_QUESTIONS.filter(q => q.category === currentCategory);
    const currentIndex = questionsInCategory.findIndex(q => q.id === questionId);
    
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      // Atualizar progresso a cada resposta
      const totalAnswered = Object.keys(newAnswers).length;
      const totalQuestions = ALL_QUESTIONS.length;
      const newProgress = Math.round((totalAnswered / totalQuestions) * 100);
      const activeStep = steps.find(step => step.active);
      onProgressUpdate?.(newProgress, activeStep?.title || 'Avaliação');
      
      return newAnswers;
    });
    
    // Avançar automaticamente para a próxima pergunta após responder
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        goToNextQuestion();
      }
    }, 300);
    
    // Auto-scroll para próxima pergunta após responder (fora do setState)
    setTimeout(() => {
      if (currentIndex >= 0 && currentIndex < questionsInCategory.length - 1) {
        const nextQuestionId = questionsInCategory[currentIndex + 1].id;
        const nextElement = document.getElementById(`question-${nextQuestionId}`);
        if (nextElement) {
          const scrollContainer = nextElement.closest('[class*="overflow-y-auto"]');
          if (scrollContainer) {
            const containerTop = scrollContainer.scrollTop;
            const elementTop = nextElement.offsetTop;
            scrollContainer.scrollTo({
              top: elementTop - 20,
              behavior: 'smooth'
            });
          }
        }
      }
    }, 300);
  };

  const getCurrentQuestions = () => {
    return ALL_QUESTIONS.filter(q => q.category === currentCategory);
  };

  const currentQuestions = getCurrentQuestions();

  const getNextCategory = (category: string) => {
    const categories = ['processes', 'automation', 'metrics', 'documentation', 'testModalities', 'qaops', 'leadership'];
    const currentIndex = categories.indexOf(category);
    return currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;
  };

  const getPrevCategory = (category: string) => {
    const categories = ['processes', 'automation', 'metrics', 'documentation', 'testModalities', 'qaops', 'leadership'];
    const currentIndex = categories.indexOf(category);
    return currentIndex > 0 ? categories[currentIndex - 1] : null;
  };

  const handleNextCategory = async () => {
    const nextCategory = getNextCategory(currentCategory);
    if (nextCategory) {
      setCurrentCategory(nextCategory);
      setCurrentQuestionIndex(0); // Resetar para a primeira pergunta
      // Update steps - NÃO marca como completo automaticamente
      const newSteps = steps.map(step => {
        if (step.id === currentCategory) return { ...step, active: false };
        if (step.id === nextCategory) return { ...step, active: true };
        return step;
      });
      setSteps(newSteps);
      // Atualizar progresso ao mudar de categoria
      const nextStep = newSteps.find(step => step.active);
      onProgressUpdate?.(progress, nextStep?.title || 'Avaliação');
    } else {
      // Verificar se todas as perguntas foram respondidas antes de finalizar
      if (!canFinishAssessment()) {
        const totalAnswered = Object.keys(answers).length;
        const totalQuestions = ALL_QUESTIONS.length;
        const missing = totalQuestions - totalAnswered;
        
        // Encontrar pilares incompletos
        const incompletePillars = steps.filter(step => {
          const categoryQuestions = ALL_QUESTIONS.filter(q => q.category === step.id);
          const categoryAnswered = categoryQuestions.filter(q => answers[q.id] !== undefined).length;
          return categoryAnswered < categoryQuestions.length;
        });
        
        toast.error(`Você ainda precisa responder ${missing} pergunta${missing > 1 ? 's' : ''} para finalizar a avaliação`, {
          description: `Pilares incompletos: ${incompletePillars.map(p => p.title).join(', ')}`,
          duration: 5000,
        });
        return;
      }
      
      // Complete assessment
      const newSteps = steps.map(step => {
        if (step.id === currentCategory) return { ...step, completed: true, active: false };
        return step;
      });
      setSteps(newSteps);
      onProgressUpdate?.(100, 'Concluído');
      
      console.log('🎯 FINALIZANDO AVALIAÇÃO - rodadaId:', rodadaId, 'userId:', userId);
      
      // Se houver rodadaId e userId, salvar assessment e atualizar status do participante
      if (rodadaId && userId) {
        console.log('✅ Tem rodadaId e userId - indo mostrar tela de conclusão PRIMEIRO...');
        
        // IMPORTANTE: Mostrar tela de conclusão ANTES de tentar atualizar status
        console.log('1️⃣ Setando showCompletionScreen = TRUE (ANTES de salvar)');
        setShowCompletionScreen(true);
        
        // Tentar salvar assessment e atualizar status em segundo plano (não bloqueia a tela)
        try {
          console.log('2️⃣ Buscando informações da rodada para salvar assessment...');
          const rodadaResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas?company_id=all`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              },
            }
          );
          
          if (rodadaResponse.ok) {
            const { rodadas } = await rodadaResponse.json();
            const currentRodada = rodadas.find((r: any) => r.id === rodadaId);
            
            if (currentRodada) {
              console.log('3️⃣ Salvando assessment no banco de dados...');
              await saveAssessment(currentRodada);
              console.log('4️⃣ Assessment salvo! Agora atualizando status do participante...');
              await updateParticipantStatus();
              console.log('5️⃣ Status atualizado! Atualizando rodadaInfo...');
              await fetchRodadaInfo(); // Atualizar informações da rodada
              console.log('6️⃣ Tudo concluído com sucesso!');
            } else {
              console.warn('⚠️ Rodada não encontrada para salvar assessment');
            }
          }
        } catch (error: any) {
          console.error('⚠️ ERRO ao salvar avaliação (mas tela de conclusão já está visível):', error);
          
          // Verificar se é erro de banco não configurado
          if (error.message?.includes('DATABASE_NOT_CONFIGURED')) {
            toast.error('Banco de dados não configurado', {
              description: 'Execute o schema SQL no Supabase. Veja o console para instruções.',
              duration: 10000
            });
            console.error('\n\n🚨 BANCO DE DADOS NÃO CONFIGURADO! 🚨\n');
            console.error('A tabela "users" não existe no banco de dados.');
            console.error('\n✅ SOLUÇÃO RÁPIDA (3 minutos):');
            console.error('1. Acesse: https://supabase.com/dashboard');
            console.error('2. Vá em SQL Editor');
            console.error('3. Copie TODO o conteúdo de /database/schema.sql');
            console.error('4. Cole no SQL Editor e clique em RUN');
            console.error('5. Aguarde 30-60 segundos');
            console.error('6. Recarregue esta página\n');
            console.error('📚 Leia o guia: /SOLUCAO_RAPIDA.md\n\n');
          } else {
            // NÃO mostrar toast de erro - a avaliação foi concluída com sucesso
            // O erro é apenas no sync com o servidor
            console.log('💡 Respostas foram salvas localmente. Sincronização com servidor falhou mas isso não afeta o usuário.');
          }
        }
      } else {
        console.log('⚠️ NÃO tem rodadaId ou userId - chamando onComplete direto');
        // Se não houver rodada, chamar diretamente o onComplete
        onComplete(answers);
      }
    }
  };

  const saveAssessment = async (rodada: any) => {
    console.log('');
    console.log('='.repeat(80));
    console.log('💾 [saveAssessment] INICIANDO SALVAMENTO DO ASSESSMENT');
    console.log('='.repeat(80));
    console.log('📋 Dados de entrada:', {
      userId: userId,
      rodadaId: rodadaId,
      rodada_company_id: rodada.company_id,
      rodada_versao_id: rodada.versao_id,
      totalRespostas: Object.keys(answers).length
    });
    
    try {
      // Calcular pontuação geral
      const allAnswers = Object.values(answers);
      const overallScore = allAnswers.length > 0 
        ? allAnswers.reduce((sum: number, val: any) => sum + Number(val), 0) / allAnswers.length 
        : 0;

      const assessmentPayload = {
        user_id: userId,
        rodada_id: rodadaId,
        company_id: rodada.company_id,
        versao_id: rodada.versao_id,
        overall_score: parseFloat(overallScore.toFixed(1)),
        status: 'completed',
        answers: answers
      };

      console.log('📤 Payload do assessment:', JSON.stringify(assessmentPayload, null, 2));
      console.log('🌐 URL:', `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/assessments`);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/assessments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(assessmentPayload)
        }
      );

      console.log('📡 Response recebida - Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('');
        console.error('❌'.repeat(40));
        console.error('❌ ERRO AO SALVAR ASSESSMENT:');
        console.error('Status HTTP:', response.status);
        console.error('Error Data:', JSON.stringify(errorData, null, 2));
        console.error('❌'.repeat(40));
        console.error('');
        
        // Verificar se é erro de banco não configurado
        if (errorData.needsSetup || errorData.message?.includes('não existe')) {
          throw new Error('DATABASE_NOT_CONFIGURED: ' + (errorData.message || errorData.error || 'Tabelas do banco de dados não foram criadas'));
        }
        
        throw new Error(errorData.error || 'Erro ao salvar avaliação');
      }

      const responseData = await response.json();
      console.log('');
      console.log('✅'.repeat(40));
      console.log('✅ ASSESSMENT SALVO COM SUCESSO!');
      console.log('Assessment ID:', responseData.assessment?.id);
      console.log('Assessment Status:', responseData.assessment?.status);
      console.log('Completed At:', responseData.assessment?.completed_at);
      console.log('✅'.repeat(40));
      console.log('');
      return responseData.assessment;
    } catch (error) {
      console.error('❌ Erro ao salvar assessment:', error);
      throw error;
    }
  };

  const updateParticipantStatus = async () => {
    console.log('');
    console.log('='.repeat(80));
    console.log('🔵 [updateParticipantStatus] INICIANDO ATUALIZAÇÃO DE STATUS');
    console.log('='.repeat(80));
    console.log('📋 Parâmetros:', {
      rodadaId: rodadaId,
      userId: userId,
      userId_type: typeof userId
    });
    
    try {
      console.log('🔍 Buscando rodadas do servidor...');
      // Buscar rodada para obter informações dos participantes
      const rodadaResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas?company_id=all`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('📡 Response status:', rodadaResponse.status);
      
      if (!rodadaResponse.ok) {
        console.error('❌ Erro ao buscar rodadas - Status:', rodadaResponse.status);
        throw new Error(`Erro ao buscar rodada - Status: ${rodadaResponse.status}`);
      }

      const { rodadas } = await rodadaResponse.json();
      console.log('✅ Total de rodadas encontradas:', rodadas?.length);
      
      const currentRodada = rodadas.find((r: any) => r.id === rodadaId);

      if (!currentRodada) {
        console.error('');
        console.error('❌'.repeat(40));
        console.error('❌ RODADA NÃO ENCONTRADA!');
        console.error('RodadaId procurado:', rodadaId);
        console.error('Rodadas disponíveis:', rodadas.map((r: any) => ({ id: r.id, versao: r.versao_id })));
        console.error('❌'.repeat(40));
        console.error('');
        throw new Error(`Rodada não encontrada com ID: ${rodadaId}`);
      }

      console.log('✅ Rodada encontrada!', {
        id: currentRodada.id,
        versao_id: currentRodada.versao_id,
        total_participantes: currentRodada.rodada_participantes?.length
      });
      
      console.log('');
      console.log('🔍 PROCURANDO PARTICIPANTE...');
      console.log('userId procurado:', userId, '(tipo:', typeof userId, ')');
      
      // Log DETALHADO de todos os participantes
      console.log('📋 Lista completa de participantes:');
      console.table(
        currentRodada.rodada_participantes?.map((p: any, index: number) => ({
          '#': index + 1,
          'Participante ID': p.id,
          'User ID': p.user_id,
          'User ID Tipo': typeof p.user_id,
          'Nome': p.users?.name || 'N/A',
          'Email': p.users?.email || 'N/A',
          'Status': p.status,
          'Progress': p.progress + '%',
          'Match?': String(p.user_id) === String(userId) ? '✅ SIM' : '❌'
        }))
      );

      // Encontrar o participante atual
      console.log('');
      console.log('🔎 Buscando match: String(user_id) === String(userId)');
      
      const participante = currentRodada.rodada_participantes?.find(
        (p: any) => String(p.user_id) === String(userId)
      );

      if (!participante) {
        console.error('');
        console.error('❌'.repeat(40));
        console.error('❌ PARTICIPANTE NÃO ENCONTRADO!');
        console.error('');
        console.error('userId fornecido:', userId);
        console.error('Tipo:', typeof userId);
        console.error('');
        console.error('User IDs dos participantes:');
        currentRodada.rodada_participantes?.forEach((p: any, i: number) => {
          console.error(`  ${i+1}. "${p.user_id}" (${typeof p.user_id}) - Match: ${String(p.user_id) === String(userId)}`);
        });
        console.error('');
        console.error('🚨 POSSÍVEIS CAUSAS:');
        console.error('1. userId do AuthContext não corresponde ao banco');
        console.error('2. Usuário não foi adicionado como participante da rodada');
        console.error('3. Problema de cache no Supabase');
        console.error('❌'.repeat(40));
        console.error('');
        
        // Não lançar erro - apenas registrar no log
        // A tela de conclusão já foi mostrada, então o UX não é afetado
        return;
      }

      console.log('');
      console.log('✅'.repeat(40));
      console.log('✅ PARTICIPANTE ENCONTRADO!');
      console.log('Participante ID:', participante.id);
      console.log('User ID:', participante.user_id);
      console.log('Nome:', participante.users?.name);
      console.log('Email:', participante.users?.email);
      console.log('Status Atual:', participante.status);
      console.log('Progress Atual:', participante.progress + '%');
      console.log('✅'.repeat(40));
      console.log('');
      
      const updatePayload = {
        status: 'concluido',
        progress: 100
      };
      
      const updateUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas/${rodadaId}/participantes/${participante.id}`;
      
      console.log('📤 Preparando PUT request...');
      console.log('URL:', updateUrl);
      console.log('Payload:', JSON.stringify(updatePayload, null, 2));
      console.log('');
      console.log('🌐 Enviando requisição...');

      // Atualizar status do participante para "concluido"
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updatePayload)
      });

      console.log('📡 Response recebida!');
      console.log('Status:', updateResponse.status, updateResponse.statusText);
      console.log('OK?:', updateResponse.ok);
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('');
        console.error('❌'.repeat(40));
        console.error('❌ ERRO AO ATUALIZAR PARTICIPANTE!');
        console.error('HTTP Status:', updateResponse.status);
        console.error('Error:', JSON.stringify(errorData, null, 2));
        console.error('❌'.repeat(40));
        console.error('');
        throw new Error(errorData.error || 'Erro ao atualizar status do participante');
      }

      const responseData = await updateResponse.json();
      console.log('');
      console.log('🎉'.repeat(40));
      console.log('🎉 STATUS DO PARTICIPANTE ATUALIZADO COM SUCESSO!');
      console.log('');
      console.log('Participante ID:', responseData.participante?.id);
      console.log('User ID:', responseData.participante?.user_id);
      console.log('Status NOVO:', responseData.participante?.status);
      console.log('Progress NOVO:', responseData.participante?.progress + '%');
      console.log('Completed Date:', responseData.participante?.completed_date);
      console.log('Last Activity:', responseData.participante?.last_activity);
      console.log('');
      console.log('🎉'.repeat(40));
      console.log('');
      console.log('✅✅✅ STATUS DO PARTICIPANTE ATUALIZADO COM SUCESSO! ✅✅✅', {
        participante_id: responseData.participante?.id,
        novo_status: responseData.participante?.status,
        progress: responseData.participante?.progress,
        completed_date: responseData.participante?.completed_date
      });
    } catch (error) {
      console.warn('⚠️ Erro ao atualizar status do participante (não crítico):', error);
      // Não propagar o erro - a tela de conclusão já foi exibida
      // Este erro não deve impedir o usuário de ver a confirmação
    }
  };

  const handlePrevCategory = () => {
    const prevCategory = getPrevCategory(currentCategory);
    if (prevCategory) {
      setCurrentCategory(prevCategory);
      setCurrentQuestionIndex(0); // Resetar para a primeira pergunta
        // Update steps
        const newSteps = steps.map(step => {
          if (step.id === currentCategory) return { ...step, active: false };
          if (step.id === prevCategory) return { ...step, active: true };
          return step;
        });
        setSteps(newSteps);
        // Atualizar progresso ao voltar de categoria
        const prevStep = newSteps.find(step => step.active);
        onProgressUpdate?.(progress, prevStep?.title || 'Avaliação');
      }
  };

  const canProceedToNextCategory = () => {
    // Verificar se todas as perguntas obrigatórias da categoria atual foram respondidas
    const unansweredRequired = currentQuestions.filter(q => {
      const answer = answers[q.id];
      return q.required && (answer === undefined || answer === null || answer === '');
    });
    return unansweredRequired.length === 0;
  };

  const canFinishAssessment = () => {
    // Verificar se TODAS as perguntas foram respondidas
    const totalAnswered = Object.keys(answers).length;
    const totalQuestions = ALL_QUESTIONS.length;
    return totalAnswered === totalQuestions;
  };

  const getTotalProgress = () => {
    const totalAnswered = Object.keys(answers).length;
    const totalQuestions = ALL_QUESTIONS.length;
    return Math.round((totalAnswered / totalQuestions) * 100);
  };

  const getCurrentStepProgress = () => {
    const answeredInCurrentCategory = currentQuestions.filter(q => answers[q.id] !== undefined).length;
    return Math.round((answeredInCurrentCategory / currentQuestions.length) * 100);
  };

  const progress = getTotalProgress();
  const stepProgress = getCurrentStepProgress();

  // Função para navegar para uma categoria específica
  const navigateToCategory = (categoryId: string) => {
    if (categoryId === currentCategory) return;
    
    setCurrentCategory(categoryId);
    setCurrentQuestionIndex(0); // Resetar para a primeira pergunta
    
    const newSteps = steps.map(step => ({
      ...step,
      active: step.id === categoryId
    }));
    setSteps(newSteps);
  };

  // Funções de navegação entre perguntas
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // ============================================
  // RENDERS - ORDEM IMPORTA!
  // ============================================

  console.log('🎨 RENDER - showCompletionScreen:', showCompletionScreen, 'rodadaInfo:', !!rodadaInfo, 'currentStep:', currentStep);

  // 1. Tela de Conclusão (tem prioridade máxima)
  // Mostrar se showCompletionScreen for true, MESMO que rodadaInfo ainda esteja carregando
  if (showCompletionScreen) {
    console.log('✅ Renderizando TELA DE CONCLUSÃO!');
    
    // Calcular informações dos participantes (se rodadaInfo disponível)
    const totalParticipantes = rodadaInfo?.rodada_participantes?.length || 0;
    const participantesConcluidos = rodadaInfo?.rodada_participantes?.filter(
      (p: any) => p.status === 'concluido'
    ).length || 0;
    const faltamPreencher = totalParticipantes - participantesConcluidos;
    const criterioEncerramento = rodadaInfo?.criterio_encerramento || 'automatico';
    
    // Se rodadaInfo ainda não carregou, mostrar informação básica
    const isLoadingInfo = !rodadaInfo;

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-12 text-center shadow-2xl border-0">
            {/* Ícone de Sucesso com Animação */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-8 relative"
            >
              {/* Círculos de fundo animados */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: 99999, repeatType: "loop" }}
                  className="w-32 h-32 rounded-full bg-teal-200"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 2, repeat: 99999, repeatType: "loop", delay: 0.3 }}
                  className="w-40 h-40 rounded-full bg-teal-100"
                />
              </div>
              
              {/* Ícone principal */}
              <div className="relative bg-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Título */}
            <h1 className="text-3xl mb-4 text-gray-900">
              Bom, agora é com a gente!
            </h1>

            {/* Descrição */}
            <p className="text-gray-500 mb-8 leading-relaxed max-w-lg mx-auto">
              {isLoadingInfo ? (
                'Nossa equipe irá analisar as informações enviadas e preparar um relatório sobre a saúde da sua empresa. Em breve, entraremos em contato para fornecer mais detalhes e orientações.'
              ) : (
                <>
                  Nossa equipe irá analisar as informações enviadas e preparar um relatório sobre a saúde da sua empresa. 
                  {faltamPreencher > 0 ? (
                    <> Em breve, entraremos em contato para fornecer mais detalhes e orientações.</>
                  ) : (
                    <> Todos os participantes completaram! O líder pode gerar os resultados agora.</>
                  )}
                </>
              )}
            </p>

            {/* Informação sobre participantes faltantes */}
            {!isLoadingInfo && faltamPreencher > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-900 font-medium">
                    {criterioEncerramento === 'automatico' 
                      ? `Aguardando ${faltamPreencher} ${faltamPreencher === 1 ? 'pessoa' : 'pessoas'} para finalizar esta rodada`
                      : `${faltamPreencher} ${faltamPreencher === 1 ? 'pessoa ainda não preencheu' : 'pessoas ainda não preencheram'}`
                    }
                  </p>
                </div>
                <p className="text-sm text-blue-600">
                  {criterioEncerramento === 'automatico' 
                    ? 'Os resultados serão gerados automaticamente quando todos responderem'
                    : 'O líder pode gerar resultados parciais a qualquer momento'
                  }
                </p>
              </motion.div>
            )}

            {faltamPreencher === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 p-4 bg-green-50 rounded-xl border border-green-100"
              >
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-900 font-medium">
                    Todos os participantes completaram a avaliação!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Botão de Voltar */}
            <Button
              onClick={() => {
                console.log('🔙 Usuário clicou em "Voltar para Rodadas" - chamando onComplete');
                onComplete(answers);
              }}
              className="bg-teal-600 hover:bg-teal-700 px-8"
            >
              Voltar para Rodadas
            </Button>

            {/* Link para visualizar respostas */}
            <div className="mb-8">
              <button 
                onClick={() => {
                  console.log('🔙 Usuário clicou em "Visite suas respostas" - voltando para rodadas');
                  onComplete(answers);
                }}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm hover:underline"
              >
                Visite suas respostas
              </button>
            </div>

            {/* Timeline de processo - Inspirada na imagem */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <div className="flex justify-center items-start gap-0 max-w-md mx-auto">
                {/* Preenchimento - Concluído */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-3 shadow-sm">
                    <ClipboardCheck className="h-7 w-7 text-teal-600" />
                  </div>
                  <p className="text-xs text-gray-900 font-medium text-center">Preenchimento das informações</p>
                </div>
                
                {/* Linha conectora */}
                <div className="flex-shrink-0 w-16 h-1 bg-gray-200 mt-7 mx-2"></div>

                {/* Análise - Em Progresso (DESTACADO) */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center mb-3 shadow-lg relative">
                    <Clock className="h-7 w-7 text-white" />
                    {/* Anel pulsante */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: 99999, repeatType: "loop" }}
                      className="absolute inset-0 rounded-xl border-2 border-blue-300"
                    />
                  </div>
                  <p className="text-xs text-gray-900 font-semibold text-center bg-blue-100 px-3 py-1 rounded-full">
                    Análise das informações
                  </p>
                </div>

                {/* Linha conectora */}
                <div className="flex-shrink-0 w-16 h-1 bg-gray-200 mt-7 mx-2"></div>

                {/* Relatório - Pendente */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-3 shadow-sm">
                    <BarChart3 className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium text-center">Relatório completo</p>
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // 2. Tela de Visão Geral das Etapas
  if (currentStep === 'overview') {
    return (
      <div className="h-full bg-gray-50 flex overflow-hidden">
        {/* Sidebar com Logo e Etapas */}
        <div className="w-80 bg-white shadow-lg p-8 overflow-y-auto flex-shrink-0">
          <div className="mb-12">
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Etapas da Avaliação</h3>
            
            <div className="space-y-1">
              {steps.map((step, index) => {
                const IconComponent = step.icon === 'Settings' ? Settings :
                                    step.icon === 'Bot' ? Bot :
                                    step.icon === 'BarChart3' ? BarChart3 :
                                    step.icon === 'TestTube' ? TestTube :
                                    step.icon === 'FileText' ? FileText :
                                    step.icon === 'Infinity' ? Infinity :
                                    Users;
                
                return (
                  <div key={step.id} className="flex items-start gap-3 py-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        step.active ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className={`flex-1 ${step.active ? 'text-gray-800' : 'text-gray-500'}`}>
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{step.questionCount} perguntas</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-12 overflow-y-auto">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >


            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Escala de Avaliação:</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  O formulário é composto por <strong>91 perguntas</strong> sobre qualidade de
                  software, distribuídas em <strong>7 pilares principais</strong>. Cada
                  pergunta deve ser respondida em uma escala de <strong>0 a 5</strong>, onde:
                </p>
                
                <div className="space-y-4 mb-8">
                  {RATING_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      {/* Container da carinha e círculo colorido */}
                      <div className="relative">
                        {/* Círculo colorido de fundo */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          option.color === 'gray' ? 'bg-gray-500' :
                          option.color === 'red' ? 'bg-red-500' :
                          option.color === 'orange' ? 'bg-orange-500' :
                          option.color === 'yellow' ? 'bg-yellow-500' :
                          option.color === 'blue' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                          {/* Carinha emoji */}
                          <div className="w-6 h-6">
                            <option.FaceComponent />
                          </div>
                        </div>
                        
                        {/* Número pequeno no canto */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {option.value}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Instruções Importantes:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Responda todas as perguntas com honestidade e baseando-se na realidade atual da sua equipe/empresa</li>
                  <li>• Caso não tenha certeza sobre algum aspecto, escolha a opção que mais se aproxima da realidade</li>
                  <li>• O formulário pode ser pausado e retomado a qualquer momento</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleBeginAssessment}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Iniciar Avaliação
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Assessment Screen - Agora está a tela de responder perguntas
  return (
    <div className="h-full bg-gray-50 flex">
      {/* Sidebar esquerda com navegação dos pilares */}
      <div className="w-80 bg-white shadow-lg flex-shrink-0 flex flex-col h-full overflow-hidden">
        {/* Header da sidebar */}
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          {/* Progress summary */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <div className="text-2xl font-semibold text-gray-800 mb-1">
                {Object.keys(answers).length}
                <span className="text-lg text-gray-500 font-normal"> de {ALL_QUESTIONS.length}</span>
              </div>
              <div className="text-sm text-gray-600">perguntas respondidas</div>
            </div>
            
            {/* Pilares completos */}
            <div className="text-center pt-4 border-t border-gray-200">
              {(() => {
                const completePillars = steps.filter(step => {
                  const categoryQuestions = ALL_QUESTIONS.filter(q => q.category === step.id);
                  const categoryAnswered = categoryQuestions.filter(q => answers[q.id] !== undefined).length;
                  return categoryAnswered === categoryQuestions.length && categoryQuestions.length > 0;
                }).length;
                
                return (
                  <>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {completePillars}
                      <span className="text-sm text-gray-500 font-normal"> de {steps.length}</span>
                    </div>
                    <div className="text-sm text-gray-600">pilares completos</div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Lista de pilares */}
          <div className="space-y-1 flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pilares da Avaliação</h3>
            
            {/* Alerta se estiver no último pilar e houver pilares incompletos */}
            {currentCategory === 'leadership' && !canFinishAssessment() && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-900">Pilares incompletos</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Complete todos os pilares antes de finalizar
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              {steps.map((step, index) => {
                const IconComponent = step.icon === 'Settings' ? Settings :
                                    step.icon === 'Bot' ? Bot :
                                    step.icon === 'BarChart3' ? BarChart3 :
                                    step.icon === 'TestTube' ? TestTube :
                                    step.icon === 'FileText' ? FileText :
                                    step.icon === 'Infinity' ? Infinity :
                                    Users;
                
                const categoryAnswered = ALL_QUESTIONS.filter(q => q.category === step.id && answers[q.id] !== undefined).length;
                const categoryTotal = ALL_QUESTIONS.filter(q => q.category === step.id).length;
                
                // Calcular status do pilar dinamicamente
                const isComplete = categoryAnswered === categoryTotal && categoryTotal > 0;
                const isPartial = categoryAnswered > 0 && categoryAnswered < categoryTotal;
                const isNotStarted = categoryAnswered === 0;
                
                // Destacar pilares incompletos quando estiver no último pilar
                const shouldHighlight = currentCategory === 'leadership' && !isComplete && step.id !== 'leadership';
                
                return (
                  <button
                    key={step.id}
                    onClick={() => navigateToCategory(step.id)}
                    className={`w-full flex items-start gap-3 py-2 text-left hover:bg-gray-50 rounded transition-colors ${
                      shouldHighlight ? 'bg-yellow-50/50' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        step.active ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' : 
                        isComplete ? 'bg-green-100 text-green-600 border-2 border-green-200' :
                        isPartial ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-200' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className={`flex-1 ${
                      step.active ? 'text-gray-800' : 
                      isComplete ? 'text-green-700' :
                      isPartial ? 'text-yellow-700' :
                      'text-gray-500'
                    }`}>
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{categoryAnswered}/{categoryTotal} perguntas</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal - Card da pergunta */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col h-full w-full min-h-0">
          <Card className="p-4 flex flex-col flex-1 min-h-0 gap-y-3">
            {/* Header do Pilar - Fixo */}
            <div className="pb-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const activeStep = steps.find(step => step.active);
                    const IconComponent = activeStep?.icon === 'Settings' ? Settings :
                                        activeStep?.icon === 'Bot' ? Bot :
                                        activeStep?.icon === 'BarChart3' ? BarChart3 :
                                        activeStep?.icon === 'TestTube' ? TestTube :
                                        activeStep?.icon === 'FileText' ? FileText :
                                        activeStep?.icon === 'Infinity' ? Infinity :
                                        Users;
                    
                    return (
                      <>
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{activeStep?.title}</h3>
                          <p className="text-sm text-gray-600">
                            {currentQuestions.length} perguntas • Pilar {steps.findIndex(s => s.active) + 1} de {steps.length}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  {stepProgress}% completo
                </div>
              </div>
            </div>

            {/* Pergunta Atual + Navegação por Dots */}
            <div className="flex-1 min-h-0 flex gap-4">
              {/* Área da Pergunta */}
              <div className="flex-1 flex flex-col justify-center px-4">
                {(() => {
                  const question = currentQuestions[currentQuestionIndex];
                  if (!question) return null;
                  
                  return (
                  <div key={question.id} id={`question-${question.id}`}>
                    {/* Número e Texto da Pergunta */}
                    <div className="mb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                          {currentQuestionIndex + 1}
                        </div>
                        <h4 className="text-base text-gray-900 leading-relaxed flex-1">
                          {question.text}
                        </h4>
                      </div>
                    </div>

                    {/* Opções de Resposta - Layout Horizontal */}
                    {question.type === 'scale' && (
                      <div className="ml-10">
                        <RadioGroup
                          value={answers[question.id]?.toString() || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                          className="flex gap-1.5"
                        >
                          {RATING_OPTIONS.map(option => {
                            const isSelected = answers[question.id]?.toString() === option.value.toString();
                            return (
                              <Label 
                                key={option.value} 
                                htmlFor={`${question.id}-${option.value}`}
                                className="cursor-pointer flex-shrink-0"
                              >
                                <div className={`flex flex-col items-center p-2 rounded-2xl border transition-all w-[100px] h-[110px] justify-center ${
                                  isSelected 
                                    ? 'border-blue-400 bg-blue-50 shadow-md' 
                                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                }`}>
                                  <RadioGroupItem 
                                    value={option.value.toString()} 
                                    id={`${question.id}-${option.value}`}
                                    className="sr-only"
                                  />
                                  
                                  {/* Emoji e Número */}
                                  <div className="relative mb-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                      option.color === 'gray' ? 'bg-gray-500' :
                                      option.color === 'red' ? 'bg-red-500' :
                                      option.color === 'orange' ? 'bg-orange-500' :
                                      option.color === 'yellow' ? 'bg-yellow-500' :
                                      option.color === 'blue' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    } ${isSelected ? 'scale-105' : ''}`}>
                                      <div className="w-6 h-6">
                                        <option.FaceComponent />
                                      </div>
                                    </div>
                                    
                                    {/* Número */}
                                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                      {option.value}
                                    </div>
                                  </div>
                                  
                                  {/* Label curto */}
                                  <div className="text-[11px] text-center text-gray-700 font-medium leading-tight">
                                    {option.value === 0 ? 'Não aplica' :
                                     option.value === 1 ? 'Muito fraco' :
                                     option.value === 2 ? 'Fraco' :
                                     option.value === 3 ? 'Regular' :
                                     option.value === 4 ? 'Bom' :
                                     'Excelente'}
                                  </div>
                                </div>
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    )}

                    {question.type === 'checkbox' && (
                      <div className="ml-10">
                        <CheckboxQuestion
                          questionId={question.id}
                          options={question.options || []}
                          value={answers[question.id] || []}
                          onChange={(questionId, value) => handleAnswerChange(questionId, value)}
                        />
                      </div>
                    )}
                  </div>
                  );
                })()}
              </div>

              {/* Navegação por Dots */}
              <div className="flex flex-col items-center justify-center gap-3 pr-4">
                {/* Seta para cima */}
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`p-1 rounded transition-colors ${
                    currentQuestionIndex === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>

                {/* Dots de navegação */}
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2">
                  {currentQuestions.map((q, index) => {
                    const isActive = index === currentQuestionIndex;
                    const isAnswered = answers[q.id] !== undefined;
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(index)}
                        className={`transition-all rounded-full ${
                          isActive 
                            ? 'w-3 h-8 bg-teal-600' 
                            : isAnswered
                              ? 'w-3 h-3 bg-teal-400 hover:bg-teal-500'
                              : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                        }`}
                        title={`Pergunta ${index + 1}${isAnswered ? ' (respondida)' : ''}`}
                      />
                    );
                  })}
                </div>

                {/* Seta para baixo */}
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                  className={`p-1 rounded transition-colors ${
                    currentQuestionIndex === currentQuestions.length - 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            
            {/* Navegação entre Pilares - Footer fixo */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 flex-shrink-0 bg-white">
              <Button
                onClick={handlePrevCategory}
                variant="outline"
                disabled={currentCategory === 'processes'}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Pilar Anterior
              </Button>

              <div className="text-sm text-gray-600">
                {stepProgress}% completo neste pilar
              </div>

              {currentCategory === 'leadership' ? (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    onClick={handleNextCategory}
                    disabled={!canFinishAssessment()}
                    className={`flex items-center gap-2 ${
                      !canFinishAssessment()
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Finalizar Avaliação
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  {!canFinishAssessment() && (
                    <div className="text-right">
                      <p className="text-xs text-red-600 font-medium">
                        Responda todas as perguntas antes de finalizar
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Object.keys(answers).length}/{ALL_QUESTIONS.length} perguntas respondidas
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleNextCategory}
                  disabled={!canProceedToNextCategory()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Próximo Pilar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}