import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { CheckboxQuestion } from './CheckboxQuestion';
import { ChevronLeft, Clock, ArrowRight, User, CheckCircle, Home, Settings, Bot, BarChart3, TestTube, FileText, Infinity, Users } from 'lucide-react';
import { Card } from './ui/card';
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
    description: 'Conceito conhecido mas não aplicado.',
    FaceComponent: Component0Variant4
  },
  { 
    value: 1, 
    label: 'Início da implementação', 
    color: 'red', 
    description: 'Começando a ser implementado.',
    FaceComponent: NeutralFace
  },
  { 
    value: 2, 
    label: 'Implementado de forma básica', 
    color: 'orange', 
    description: 'Implementado de forma básica.',
    FaceComponent: SlightlySmilingFace
  },
  { 
    value: 3, 
    label: 'Implementado de forma moderada', 
    color: 'yellow', 
    description: 'Implementado de forma moderada.',
    FaceComponent: SmilingFaceWithSmilingEyes
  },
  { 
    value: 4, 
    label: 'Bem implementado', 
    color: 'blue', 
    description: 'Bem implementado e efetivo.',
    FaceComponent: BeamingFaceWithSmilingEyes
  },
  { 
    value: 5, 
    label: 'Totalmente implementado e otimizado', 
    color: 'green', 
    description: 'Totalmente implementado e otimizado.',
    FaceComponent: SmilingFaceWithHeartEyes
  }
];

export function QualityScoreAssessment({ onComplete, onBack, onProgressUpdate }: QualityScoreAssessmentProps) {
  const [currentStep, setCurrentStep] = useState('overview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [steps, setSteps] = useState(STEPS);
  const [currentCategory, setCurrentCategory] = useState('processes');

  // Inicializar progresso quando o componente for montado
  React.useEffect(() => {
    onProgressUpdate?.(0, 'Visão Geral');
  }, []);

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

    // Auto-navegar para a próxima pergunta após um pequeno delay para melhor UX
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const getCurrentQuestions = () => {
    return ALL_QUESTIONS.filter(q => q.category === currentCategory);
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestionData = currentQuestions[currentQuestion];

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

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to next category or complete
      const nextCategory = getNextCategory(currentCategory);
      if (nextCategory) {
        setCurrentCategory(nextCategory);
        setCurrentQuestion(0);
        // Update steps
        const newSteps = steps.map(step => {
          if (step.id === currentCategory) return { ...step, completed: true, active: false };
          if (step.id === nextCategory) return { ...step, active: true };
          return step;
        });
        setSteps(newSteps);
        // Atualizar progresso ao mudar de categoria
        const nextStep = newSteps.find(step => step.active);
        onProgressUpdate?.(progress, nextStep?.title || 'Avaliação');
      } else {
        // Complete assessment
        const newSteps = steps.map(step => {
          if (step.id === currentCategory) return { ...step, completed: true, active: false };
          return step;
        });
        setSteps(newSteps);
        onProgressUpdate?.(100, 'Concluído');
        onComplete(answers);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      const prevCategory = getPrevCategory(currentCategory);
      if (prevCategory) {
        const prevQuestions = ALL_QUESTIONS.filter(q => q.category === prevCategory);
        setCurrentCategory(prevCategory);
        setCurrentQuestion(prevQuestions.length - 1);
        // Update steps
        const newSteps = steps.map(step => {
          if (step.id === currentCategory) return { ...step, active: false };
          if (step.id === prevCategory) return { ...step, completed: false, active: true };
          return step;
        });
        setSteps(newSteps);
        // Atualizar progresso ao voltar de categoria
        const prevStep = newSteps.find(step => step.active);
        onProgressUpdate?.(progress, prevStep?.title || 'Avaliação');
      }
    }
  };

  const canProceed = () => {
    if (!currentQuestionData) return false;
    const answer = answers[currentQuestionData.id];
    
    if (currentQuestionData.required) {
      return answer !== undefined && answer !== null && answer !== '';
    }
    return true;
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
    setCurrentQuestion(0);
    
    const newSteps = steps.map(step => ({
      ...step,
      active: step.id === categoryId,
      completed: step.id === categoryId ? false : step.completed
    }));
    setSteps(newSteps);
  };


  // Tela de Visão Geral das Etapas
  if (currentStep === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar com Logo e Etapas */}
        <div className="w-80 bg-white shadow-lg p-8">
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
        <div className="flex-1 p-12">
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
                  <li>• Ao final, você receberá um relatório detalhado com recomendações personalizadas</li>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar esquerda com navegação dos pilares */}
      <div className="w-80 bg-white shadow-lg">
        {/* Header da sidebar */}
        <div className="p-8">
          {/* Progress summary */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <div className="text-2xl font-semibold text-gray-800 mb-1">
                {Object.keys(answers).length}
                <span className="text-lg text-gray-500 font-normal"> de {ALL_QUESTIONS.length}</span>
              </div>
              <div className="text-sm text-gray-600">perguntas respondidas</div>
            </div>
          </div>

          {/* Lista de pilares */}
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Pilares da Avaliação</h3>
            
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
                
                return (
                  <button
                    key={step.id}
                    onClick={() => navigateToCategory(step.id)}
                    className="w-full flex items-start gap-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        step.active ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' : 
                        step.completed ? 'bg-green-100 text-green-600 border-2 border-green-200' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {step.completed ? (
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
                      step.completed ? 'text-green-700' :
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
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCategory}-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header da pergunta */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
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
                                Pergunta {currentQuestion + 1} de {currentQuestions.length} • Pilar {steps.findIndex(s => s.active) + 1} de {steps.length}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Pergunta */}
                <div className="mb-8">
                  <h4 className="text-2xl text-gray-900 mb-8 leading-relaxed">
                    {currentQuestionData?.text}
                  </h4>

                  {currentQuestionData?.type === 'scale' && (
                    <div className="space-y-3">
                      <RadioGroup
                        value={answers[currentQuestionData.id]?.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(currentQuestionData.id, parseInt(value))}
                        className="space-y-3"
                      >
                        {RATING_OPTIONS.map(option => {
                          const isSelected = answers[currentQuestionData.id]?.toString() === option.value.toString();
                          return (
                            <div key={option.value} className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-blue-300 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}>
                              <RadioGroupItem value={option.value.toString()} id={`${currentQuestionData.id}-${option.value}`} />
                              
                              {/* Container da carinha e círculo colorido */}
                              <div className="relative">
                                {/* Círculo colorido de fundo */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                  option.color === 'gray' ? 'bg-gray-500' :
                                  option.color === 'red' ? 'bg-red-500' :
                                  option.color === 'orange' ? 'bg-orange-500' :
                                  option.color === 'yellow' ? 'bg-yellow-500' :
                                  option.color === 'blue' ? 'bg-blue-500' :
                                  'bg-green-500'
                                } ${isSelected ? 'scale-110 shadow-lg' : ''}`}>
                                  {/* Carinha emoji */}
                                  <div className="w-8 h-8">
                                    <option.FaceComponent />
                                  </div>
                                </div>
                                
                                {/* Número pequeno no canto */}
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
                                  {option.value}
                                </div>
                              </div>
                              
                              <Label htmlFor={`${currentQuestionData.id}-${option.value}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-gray-900">{option.label}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  )}

                  {currentQuestionData?.type === 'checkbox' && (
                    <CheckboxQuestion
                      question={currentQuestionData}
                      value={answers[currentQuestionData.id] || []}
                      onChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                    />
                  )}
                </div>

                {/* Navegação */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    disabled={currentQuestion === 0 && currentCategory === 'processes'}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="text-sm text-gray-600">
                    {currentQuestion + 1} de {currentQuestions.length} no pilar atual
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {currentQuestion === currentQuestions.length - 1 && currentCategory === 'leadership' ? 'Finalizar' : 'Próxima'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}