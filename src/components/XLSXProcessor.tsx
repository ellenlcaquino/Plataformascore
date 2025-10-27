// ✅ LEITURA REAL DE EXCEL ATIVADA
import * as XLSX from 'xlsx';

/**
 * ⚠️ IMPORTANTE: TRATAMENTO DE PERGUNTA ESPECIAL
 * 
 * A pergunta "Quais modalidades de teste hoje os QA's aplicam?" (ID: test12) 
 * deve ser tratada de forma especial:
 * 
 * - Tipo: Checkbox (múltipla escolha)
 * - Formato: Texto com valores separados por ponto e vírgula
 * - Exemplo: "Funcional;API;Unitário" ou "Performance;Segurança;Acessibilidade"
 * - NÃO deve passar pela validação de escala 0-5
 * - NÃO deve bloquear a importação se contiver texto
 * - Pertence ao pilar "Modalidades de Testes"
 * - É usada para análises qualitativas, não interfere no cálculo de score
 * 
 * Esta exceção está explicitamente codificada no processamento.
 */

// Interface para dados importados
export interface ImportedUser {
  userID: string;
  email: string;
  nome: string;
  companhia: string;
  ecossistema: string;
  timeDedicado: string;
  quantidadePessoas: string;
  areaPertenente: string;
  respostas: Record<string, number | string[]>; // Permite números e arrays de strings para a pergunta especial
  respostasPorPilar: Record<string, number[]>;
  mediasPorPilar: Record<string, number>;
  forcas: string[];
  fraquezas: string[];
  modalidadesTestes?: string[]; // Campo específico para análise qualitativa das modalidades
}

export interface ImportResults {
  totalUsers: number;
  validUsers: number;
  invalidUsers: number;
  errors: string[];
  warnings: string[];
  data: ImportedUser[];
  consolidatedData: {
    totalRespondents: number;
    mediaGeralPorPilar: Record<string, number>;
    distribuicaoRespostas: Record<string, Record<number, number>>;
    principaisDesafios: string[];
    principaisForcas: string[];
    modalidadesMaisUtilizadas?: Array<{ modalidade: string; count: number; percentage: number }>;
  };
}

// Mapeamento das perguntas do QualityScore com seus IDs e pilares
const QUESTION_MAPPING: Record<string, { id: string; pillar: string; index: number }> = {
  // Processos e Estratégia (16 perguntas)
  'Existe uma esteira de desenvolvimento bem estruturada?': { id: 'process1', pillar: 'Processos e Estratégias', index: 0 },
  'A visão do ciclo de desenvolvimento também contempla Negócio, Produto e Design?': { id: 'process2', pillar: 'Processos e Estratégias', index: 1 },
  'Existem boas práticas de gerenciamento das mudanças nos requisitos ao longo do ciclo de vida do projeto?': { id: 'process3', pillar: 'Processos e Estratégias', index: 2 },
  'Existe um processo claro e documentado sobre code-review?': { id: 'process4', pillar: 'Processos e Estratégias', index: 3 },
  'Os papéis e responsabilidades estão bem claros e a equipe se sente confortável em executá-los?': { id: 'process5', pillar: 'Processos e Estratégias', index: 4 },
  'Existe uma metodologia de trabalho, sendo ela conhecida e seguida por todos na equipe?': { id: 'process6', pillar: 'Processos e Estratégias', index: 5 },
  'As reuniões de equipe são conduzidas de maneira clara e objetiva visando garantir troca de informações entre os membros?': { id: 'process7', pillar: 'Processos e Estratégias', index: 6 },
  'Os prazos estabelecidos em diferentes etapas do projeto estão sendo cumpridos?': { id: 'process8', pillar: 'Processos e Estratégias', index: 7 },
  'Existe um sistema de rastreamento de bugs devidamente implementado, demonstrando eficácia em identificar, documentar e monitorar o status de cada problema encontrado durante o desenvolvimento do projeto?': { id: 'process9', pillar: 'Processos e Estratégias', index: 8 },
  'O bug tracking é regularmente atualizado para garantir que as informações estejam sempre precisas e refletindo o estado atual do projeto?': { id: 'process10', pillar: 'Processos e Estratégias', index: 9 },
  'Existe um plano de ação e priorização para os bugs, de modo que sejam separados corretamente conforme sua categorização e necessidade de resolução?': { id: 'process11', pillar: 'Processos e Estratégias', index: 10 },
  'Além de identificação de bugs, vocês possuem processo para diferenciar melhoria e/ou ausência de escopo?': { id: 'process12', pillar: 'Processos e Estratégias', index: 11 },
  'A empresa possui uma área de qualidade madura?': { id: 'process13', pillar: 'Processos e Estratégias', index: 12 },
  'A área de qualidade possui uma visão de governança e estratégia, tendo seus próprios processos e responsabilidades claros e objetivos?': { id: 'process14', pillar: 'Processos e Estratégias', index: 13 },
  'Existe e é aplicado o contrato de Definition Of Ready?': { id: 'process15', pillar: 'Processos e Estratégias', index: 14 },
  'Existe e é aplicado o contrato de Definition Of Done?': { id: 'process16', pillar: 'Processos e Estratégias', index: 15 },

  // Testes Automatizados (16 perguntas)
  'Qual seria a sua avaliação para a cobertura de testes automatizados em relação ao código do projeto?': { id: 'auto1', pillar: 'Testes Automatizados', index: 16 },
  'Os testes automatizados tem uma bom coverage funcional no core business?': { id: 'auto2', pillar: 'Testes Automatizados', index: 17 },
  'Quão robustos e confiáveis são os testes automatizados em fornecer resultados consistentes em diferentes ambientes e condições?': { id: 'auto3', pillar: 'Testes Automatizados', index: 18 },
  'Como você avalia a capacidade dos testes automatizados em lidar com flutuações nos resultados?': { id: 'auto4', pillar: 'Testes Automatizados', index: 19 },
  'Os testes automatizados são integrados ao processo de continuous testing?': { id: 'auto5', pillar: 'Testes Automatizados', index: 20 },
  'Quão bem os testes automatizados estão integrados aos processos de CI/CD, garantindo testes contínuos e feedback rápido?': { id: 'auto6', pillar: 'Testes Automatizados', index: 21 },
  'Quão automaticamente os testes automatizados são executados em cada build ou deploy do projeto?': { id: 'auto7', pillar: 'Testes Automatizados', index: 22 },
  'A arquitetura da automação permite fácil manutenção dos testes conforme o código do projeto evolui?': { id: 'auto8', pillar: 'Testes Automatizados', index: 23 },
  'Quão bem os testes automatizados escalam para lidar com o crescimento do projeto e a adição de novos recursos?': { id: 'auto9', pillar: 'Testes Automatizados', index: 24 },
  'Os testes automatizados são eficientes em termos de tempo de execução e recursos necessários?': { id: 'auto10', pillar: 'Testes Automatizados', index: 25 },
  'Os testes automatizados são registrados e apresentados de forma clara e compreensível?': { id: 'auto11', pillar: 'Testes Automatizados', index: 26 },
  'O monitoramento contínuo dos testes automatizados é eficaz para identificar falhas ou regressões rapidamente?': { id: 'auto12', pillar: 'Testes Automatizados', index: 27 },
  'Os testes automatizados seguem padrões e boas práticas estabelecidas para garantir sua eficácia e manutenibilidade?': { id: 'auto13', pillar: 'Testes Automatizados', index: 28 },
  'A equipe busca melhorar ativamente a qualidade e eficiência dos testes automatizados através da adoção de novas técnicas ou ferramentas?': { id: 'auto14', pillar: 'Testes Automatizados', index: 29 },
  'A Documentação técnica da arquitetura, bem como a baseline, é de fácil entendimento?': { id: 'auto15', pillar: 'Testes Automatizados', index: 30 },
  'As práticas de code review são aplicadas aos scripts de automação?': { id: 'auto16', pillar: 'Testes Automatizados', index: 31 },

  // Métricas (14 perguntas)
  'Qual seria sua nota para o quão bem estamos monitorando as métricas de qualidade no processo de desenvolvimento (métrica da esteira)?': { id: 'metric1', pillar: 'Métricas', index: 32 },
  'Quão bem estamos definindo e acompanhando as métricas de qualidade do código, desempenho do sistema e experiência do usuário?': { id: 'metric2', pillar: 'Métricas', index: 33 },
  'A empresa possui metas (OKR) destinadas a desenvolvimento e/ou qualidade?': { id: 'metric3', pillar: 'Métricas', index: 34 },
  'Quão alinhadas estão nossas métricas de qualidade com os objetivos e metas de negócio da organização?': { id: 'metric4', pillar: 'Métricas', index: 35 },
  'Existem métricas para avaliar o desempenho do projeto e impulsionar a melhoria contínua?': { id: 'metric5', pillar: 'Métricas', index: 36 },
  'As métricas que temos hoje são úteis para identificar áreas de melhoria e tomar decisões informadas?': { id: 'metric6', pillar: 'Métricas', index: 37 },
  'Com que frequência atualizamos e revisamos nossas métricas de qualidade?': { id: 'metric7', pillar: 'Métricas', index: 38 },
  'As métricas de qualidade são acessíveis e transparentes a todos os membros da equipe e pares?': { id: 'metric8', pillar: 'Métricas', index: 39 },
  'O time de QA é responsável também pelo monitoramento das métricas e eventuais análises, afim de auxiliar em tomadas de decisões e melhorias de atuação coletiva ou individual?': { id: 'metric9', pillar: 'Métricas', index: 40 },
  'Existem SLA\'s para acompanhamento regular do tempo médio de correção de defeitos, e/ou ausência de escopo, após a identificação?': { id: 'metric10', pillar: 'Métricas', index: 41 },
  'São realizadas análises periódicas das métricas monitoradas, afim de perceber tendências e/ou atuar em prevenções?': { id: 'metric11', pillar: 'Métricas', index: 42 },
  'As métricas de satisfação do cliente são usadas para avaliar a qualidade percebida do software?': { id: 'metric12', pillar: 'Métricas', index: 43 },
  'A taxa de rejeição de casos de teste é monitorada para avaliar sua eficácia e relevância?': { id: 'metric13', pillar: 'Métricas', index: 44 },
  'São realizadas análises pós-implantação para avaliar a estabilidade do software em ambiente de produção?': { id: 'metric14', pillar: 'Métricas', index: 45 },

  // Modalidades de Testes (13 perguntas - incluindo a pergunta especial)
  'A equipe de qualidade se sente preparada e a vontade para aplicar outras modalidades de testes (como segurança, performance, carga e estresse…)?': { id: 'test1', pillar: 'Modalidades de Testes', index: 46 },
  'Quão bem os QA\'s adotam uma visão ampla em práticas de controle de qualidade como estratégia para validar o produto, indo além do caminho feliz?': { id: 'test2', pillar: 'Modalidades de Testes', index: 47 },
  'Os testes funcionais cobrem todos os requisitos do usuário?': { id: 'test3', pillar: 'Modalidades de Testes', index: 48 },
  'São realizados testes de protótipo ou em etapas de conceitualização de produto e modelagem?': { id: 'test4', pillar: 'Modalidades de Testes', index: 49 },
  'Há testes de desempenho para avaliar a escalabilidade do sistema?': { id: 'test5', pillar: 'Modalidades de Testes', index: 50 },
  'Quão amplo são os testes de compatibilidade, eles garantem diferentes dispositivos e plataformas?': { id: 'test6', pillar: 'Modalidades de Testes', index: 51 },
  'Os testes de regressão são automatizados e executados regularmente?': { id: 'test7', pillar: 'Modalidades de Testes', index: 52 },
  'Há testes de recuperação de falhas após situações de erro no software?': { id: 'test8', pillar: 'Modalidades de Testes', index: 53 },
  'Dev e PO (ou outros papéis) do time realizam testes guiados pelo QA (Pair Testing)?': { id: 'test9', pillar: 'Modalidades de Testes', index: 54 },
  'Existe uma preocupação com testes de Acessibilidade voltados a garantir melhor experiência do usuário nos produtos?': { id: 'test10', pillar: 'Modalidades de Testes', index: 55 },
  'Existem trocas entre as áreas para que os QA\'s tenham mais percepções das necessidades do produto, transformando em testes mais direcionados?': { id: 'test11', pillar: 'Modalidades de Testes', index: 56 },
  'Quais modalidades de teste hoje os QA\'s aplicam?': { id: 'test12', pillar: 'Modalidades de Testes', index: 57 }, // ⚠️ PERGUNTA ESPECIAL test12

  // Documentações (11 perguntas)
  'Todos os requisitos do projeto estão documentados e foram considerados durante o desenvolvimento?': { id: 'doc1', pillar: 'Documentações', index: 58 },
  'Quão abrangente é nossa documentação em relação aos requisitos, arquitetura e design do sistema?': { id: 'doc2', pillar: 'Documentações', index: 59 },
  'A documentação é regularmente atualizada para refletir as mudanças no projeto?': { id: 'doc3', pillar: 'Documentações', index: 60 },
  'A documentação do projeto é acessível para todos os membros de equipe e partes interessadas?': { id: 'doc4', pillar: 'Documentações', index: 61 },
  'Qual é sua avaliação geral da qualidade das documentações dos projetos em relação à precisão, completude e utilidade?': { id: 'doc5', pillar: 'Documentações', index: 62 },
  'A documentação é disponível em diferentes formatos (por exemplo, texto, vídeo)?': { id: 'doc6', pillar: 'Documentações', index: 63 },
  'A documentação inclui informações sobre os limites do projeto, como configuração e requisitos do sistema?': { id: 'doc7', pillar: 'Documentações', index: 64 },
  'Existe documentação e/ou padrões e boas práticas para gerenciamento dos testes?': { id: 'doc8', pillar: 'Documentações', index: 65 },
  'Os cenários de testes são claros e bem categorizados?': { id: 'doc9', pillar: 'Documentações', index: 66 },
  'Os cenários de testes são atualizados com frequência?': { id: 'doc10', pillar: 'Documentações', index: 67 },
  'Os cenários de testes são geridos de forma eficiente por uma ferramenta de gestão, garantindo também a rastreabilidade deles?': { id: 'doc11', pillar: 'Documentações', index: 68 },

  // QAOPS (10 perguntas)
  'Existe a colaboração entre equipes de desenvolvimento, qualidade, infraestrutura e operações para melhorias contínuas de práticas QAOps?': { id: 'qaops1', pillar: 'QAOPS', index: 69 },
  'O ambiente de teste é semelhante ao ambiente de produção?': { id: 'qaops2', pillar: 'QAOPS', index: 70 },
  'Quão automatizado é nosso processo de reteste e regressão para garantir que as correções não introduzam novos problemas?': { id: 'qaops3', pillar: 'QAOPS', index: 71 },
  'Todos os membros da equipe praticam ações de responsabilidade na garantia de qualidade do produto?': { id: 'qaops4', pillar: 'QAOPS', index: 72 },
  'Quão bem estamos monitorando as métricas de qualidade em tempo real durante todo o ciclo de vida do projeto?': { id: 'qaops5', pillar: 'QAOPS', index: 73 },
  'A equipe de QA está envolvida desde o início do ciclo de desenvolvimento, adotando prática de ShifLetf?': { id: 'qaops6', pillar: 'QAOPS', index: 74 },
  'Há uma cultura de aprendizado contínuo e melhoria na equipe de QA?': { id: 'qaops7', pillar: 'QAOPS', index: 75 },
  'Há sistemas de observabilidade e/ou gates de qualidade, como alertas para identificar problemas de qualidade em tempo real?': { id: 'qaops8', pillar: 'QAOPS', index: 76 },
  'Existe um processo de revisão e melhorias contínuas para as práticas de QA?': { id: 'qaops9', pillar: 'QAOPS', index: 77 },
  'Quão bem aprendemos com incidentes e problemas para evitar recorrências no futuro?': { id: 'qaops10', pillar: 'QAOPS', index: 78 },

  // Liderança (12 perguntas)
  'Quão claro é o apoio da liderança organizacional à implementação de práticas de qualidade e melhoria contínua?': { id: 'leader1', pillar: 'Liderança', index: 79 },
  'Quão eficaz é a comunicação da liderança técnica sobre a importância da qualidade e dos objetivos de qualidade?': { id: 'leader2', pillar: 'Liderança', index: 80 },
  'Quão transparente é a liderança de tecnologia em relação aos desafios, expectativas e iniciativas relacionadas à qualidade?': { id: 'leader3', pillar: 'Liderança', index: 81 },
  'Quão bem a liderança de tecnologia apoia o desenvolvimento das habilidades e competências de toda equipe (produto, design, desenvolvimento) em relação à qualidade?': { id: 'leader4', pillar: 'Liderança', index: 82 },
  'Existe um orçamento pensado para recursos e oportunidades para o desenvolvimento e gerência da área de qualidade?': { id: 'leader5', pillar: 'Liderança', index: 83 },
  'Quão ativamente a liderança de qualidade promove uma cultura organizacional centrada na qualidade e na busca da excelência?': { id: 'leader6', pillar: 'Liderança', index: 84 },
  'Quão claras e mensuráveis são as metas de qualidade estabelecidas pela liderança de QA?': { id: 'leader7', pillar: 'Liderança', index: 85 },
  'São eficazes os indicadores de desempenho utilizados pela liderança para acompanhar e avaliar a qualidade do trabalho da equipe?': { id: 'leader8', pillar: 'Liderança', index: 86 },
  'Regularmente a liderança fornece feedback construtivo e oportunidades de melhoria para a equipe em relação à qualidade do trabalho?': { id: 'leader9', pillar: 'Liderança', index: 87 },
  'A liderança define claramente expectativas e responsabilidades em relação à qualidade e cumpre com os compromissos assumidos?': { id: 'leader10', pillar: 'Liderança', index: 88 },
  'Os QA\'s possuem uma visão clara sobre o desenvolvimento pessoal e trilha de carreira dentro da área, com seus desafios e goals?': { id: 'leader11', pillar: 'Liderança', index: 89 },
  'A liderança de Qualidade tem uma visão ampla de qualidade indo além da visão de validação e verificação como etapa única no ciclo de desenvolvimento?': { id: 'leader12', pillar: 'Liderança', index: 90 }
};

// Colunas de metadados (8 primeiras colunas)
const METADATA_COLUMNS = [
  'UserID',
  'Email',
  'Nome',
  'Qual companhia você está representando?',
  'Qual é o ecossistema que ela está inserida (Saúde, Serviços, Financeiro, Hardwares...)',
  'Você possui time dedicado a qualidade de software?',
  'Se sim, quantas pessoas hoje fazem parte do time e qual a senioridade delas (Ex: 2 JR, 3 PL)? Se não, digitar N/A',
  'Você é um profissional que pertence a área da Tecnologia? Se sim, qual setor. Se não, preencher "outro" indicando sua área correspondente.'
];

// Nome dos pilares
const PILLARS = [
  'Processos e Estratégias',
  'Testes Automatizados', 
  'Métricas',
  'Modalidades de Testes',
  'Documentações',
  'QAOPS',
  'Liderança'
];

// IDs de perguntas que são textuais e não devem ser incluídas nos cálculos numéricos
const TEXTUAL_QUESTION_IDS = new Set(['test12']);

// Classe para processar arquivos XLSX
export class XLSXProcessor {
  
  // ✅ LEITURA REAL DO EXCEL - Substituindo simulação
  static async readExcelFile(file: File): Promise<any[][]> {
    console.log('📊 Iniciando leitura real do arquivo Excel:', file.name);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Converter para array de arrays (formato bruto)
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log('✅ Arquivo Excel lido com sucesso!');
      console.log(`   - Planilha: "${sheetName}"`);
      console.log(`   - Total de linhas: ${rawData.length}`);
      console.log(`   - Total de colunas: ${rawData[0]?.length || 0}`);
      
      return rawData;
    } catch (error) {
      console.error('❌ Erro ao ler arquivo Excel:', error);
      throw new Error(`Erro ao ler arquivo Excel: ${error.message}`);
    }
  }

  // Validar estrutura do arquivo
  static validateFileStructure(headers: string[]): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // ✅ DEBUG: Verificar se há cabeçalhos duplicados
    const normalizedHeaders = headers.map(h => this.normalizeString(h || ''));
    const uniqueHeaders = new Set(normalizedHeaders);
    if (uniqueHeaders.size !== normalizedHeaders.length) {
      console.warn('⚠️ ATENÇÃO: Cabeçalhos duplicados detectados!');
      const duplicates = normalizedHeaders.filter((item, index) => normalizedHeaders.indexOf(item) !== index);
      console.warn('Duplicados:', duplicates);
    }
    
    // ✅ DEBUG: Verificar mapeamento das perguntas críticas
    const criticalQuestions = ['doc1', 'test12'];
    for (const questionId of criticalQuestions) {
      const questionEntry = Object.entries(QUESTION_MAPPING).find(([, info]) => info.id === questionId);
      if (questionEntry) {
        const [questionText, questionInfo] = questionEntry;
        const normalizedQuestion = this.normalizeString(questionText);
        const foundIndex = normalizedHeaders.indexOf(normalizedQuestion);
        console.log(`🎯 Pergunta crítica ${questionId}:`);
        console.log(`   - Texto: "${questionText}"`);
        console.log(`   - Normalizada: "${normalizedQuestion}"`);
        console.log(`   - Encontrada na posição: ${foundIndex}`);
        if (foundIndex >= 0) {
          console.log(`   - Header original na posição: "${headers[foundIndex]}"`);
        }
      }
    }
    
    // Verificar se temos as 8 colunas de metadados
    for (let i = 0; i < METADATA_COLUMNS.length; i++) {
      if (!headers[i] || headers[i] !== METADATA_COLUMNS[i]) {
        errors.push(`Coluna ${i + 1} deve ser "${METADATA_COLUMNS[i]}", encontrada: "${headers[i] || 'vazio'}"`);
      }
    }

    // Verificar se temos UserID ou Email para identificação
    const hasUserID = headers.includes('UserID') && headers[0] === 'UserID';
    const hasEmail = headers.includes('Email') && headers[1] === 'Email';
    
    if (!hasUserID && !hasEmail) {
      errors.push('Deve haver UserID e/ou Email nas primeiras colunas para identificar respondentes');
    }

    // Verificar se temos perguntas suficientes (colunas 9 em diante)
    const questionColumns = headers.slice(8); // Pular as 8 colunas de metadados
    const questionMappingKeys = Object.keys(QUESTION_MAPPING);
    
    if (questionColumns.length < 90) {
      warnings.push(`Arquivo tem apenas ${questionColumns.length} perguntas, esperado no mínimo 90`);
    }

    // Verificar se todas as perguntas esperadas estão presentes
    for (const questionText of questionMappingKeys) {
      if (!headers.includes(questionText)) {
        errors.push(`Pergunta não encontrada: "${questionText.substring(0, 50)}..."`);
      }
    }

    // Verificar se o número total de colunas está correto
    const expectedTotal = METADATA_COLUMNS.length + questionMappingKeys.length;
    if (headers.length < expectedTotal) {
      errors.push(`Arquivo deve ter ${expectedTotal} colunas (8 metadados + ${questionMappingKeys.length} perguntas), encontradas ${headers.length}`);
    }

    return { errors, warnings };
  }

  // Calcular médias por pilar (ignorando perguntas textuais)
  static calculatePillarAverages(respostas: Record<string, number | string[]>): Record<string, number> {
    const pillarSums: Record<string, number> = {};
    const pillarCounts: Record<string, number> = {};

    // Inicializar contadores
    for (const pillar of PILLARS) {
      pillarSums[pillar] = 0;
      pillarCounts[pillar] = 0;
    }

    // Somar respostas por pilar (apenas perguntas numéricas)
    for (const [questionText, questionInfo] of Object.entries(QUESTION_MAPPING)) {
      const questionId = questionInfo.id;
      const pillar = questionInfo.pillar;
      
      // ✅ IGNORAR perguntas textuais nos cálculos numéricos
      if (
        !TEXTUAL_QUESTION_IDS.has(questionId) &&
        respostas[questionId] !== undefined && 
        typeof respostas[questionId] === 'number'
      ) {
        pillarSums[pillar] += respostas[questionId] as number;
        pillarCounts[pillar]++;
      }
    }

    // Calcular médias
    const averages: Record<string, number> = {};
    for (const pillar of PILLARS) {
      averages[pillar] = pillarCounts[pillar] > 0 ? 
        Math.round((pillarSums[pillar] / pillarCounts[pillar]) * 10) / 10 : 0;
    }

    return averages;
  }

  // Identificar forças e fraquezas
  static identifyStrengthsAndWeaknesses(mediasPorPilar: Record<string, number>): { forcas: string[], fraquezas: string[] } {
    const forcas: string[] = [];
    const fraquezas: string[] = [];

    for (const [pilar, media] of Object.entries(mediasPorPilar)) {
      if (media >= 4) {
        forcas.push(pilar);
      } else if (media <= 2) {
        fraquezas.push(pilar);
      }
    }

    return { forcas, fraquezas };
  }

  // Agrupar respostas por pilar (apenas respostas numéricas)
  static groupResponsesByPillar(respostas: Record<string, number | string[]>): Record<string, number[]> {
    const respostasPorPilar: Record<string, number[]> = {};

    // Inicializar arrays
    for (const pillar of PILLARS) {
      respostasPorPilar[pillar] = [];
    }

    // Agrupar respostas (apenas numéricas)
    for (const [questionText, questionInfo] of Object.entries(QUESTION_MAPPING)) {
      const questionId = questionInfo.id;
      const pillar = questionInfo.pillar;
      
      // ✅ IGNORAR perguntas textuais nos agrupamentos numéricos
      if (
        !TEXTUAL_QUESTION_IDS.has(questionId) &&
        respostas[questionId] !== undefined && 
        typeof respostas[questionId] === 'number'
      ) {
        respostasPorPilar[pillar].push(respostas[questionId] as number);
      }
    }

    return respostasPorPilar;
  }

  // Função auxiliar para normalização agressiva de strings
  static normalizeString(str: string): string {
    return str
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Múltiplos espaços viram um
      .replace(/[""'']/g, '"') // Normalizar aspas
      .replace(/[…]/g, '...') // Normalizar reticências
      .replace(/[–—]/g, '-'); // Normalizar traços
  }

  // Função para detectar e corrigir inversões de colunas
  static detectColumnMismatch(headers: string[], row: any[], rowIndex: number): { corrections: Array<{ from: number, to: number, reason: string }> } {
    const corrections: Array<{ from: number, to: number, reason: string }> = [];
    
    // Detectar se valores textuais estão em colunas numéricas
    const normalizedHeaders = headers.map(h => this.normalizeString(h || ''));
    
    for (let i = 8; i < row.length && i < headers.length; i++) {
      const value = row[i];
      const header = headers[i];
      
      // Se encontrar valor textual com ponto e vírgula em coluna que não é test12
      if (typeof value === 'string' && value.includes(';') && !this.normalizeString(header).includes('modalidades')) {
        // Procurar a coluna test12
        const test12Index = normalizedHeaders.findIndex(h => h.includes('modalidades') && h.includes('aplicam'));
        if (test12Index >= 0 && test12Index !== i) {
          corrections.push({
            from: i,
            to: test12Index,
            reason: `Valor "${value}" parece ser da pergunta modalidades de teste`
          });
        }
      }
    }
    
    return { corrections };
  }

  // Processar linha de dados do usuário
  static processUserRow(headers: string[], row: any[], rowIndex: number): { user: ImportedUser | null, errors: string[] } {
    const errors: string[] = [];
    
    try {
      // ✅ 1. NORMALIZAR CABEÇALHOS para comparação ultra-robusta
      const normalizedHeaders = headers.map(h => this.normalizeString(h || ''));
      
      // ✅ 2. CRIAR MAPEAMENTO NORMALIZADO DAS PERGUNTAS
      const normalizedQuestionMapping: Record<string, { originalText: string; info: any }> = {};
      for (const [questionText, questionInfo] of Object.entries(QUESTION_MAPPING)) {
        const normalizedQuestion = this.normalizeString(questionText);
        normalizedQuestionMapping[normalizedQuestion] = {
          originalText: questionText,
          info: questionInfo
        };
      }

      // ✅ 3. LOG DETALHADO PARA DEBUG (apenas primeira linha)
      if (rowIndex === 0) {
        console.log('🔍 ANÁLISE DE CABEÇALHOS:');
        console.log('Headers originais:', headers.slice(0, 15));
        console.log('Headers normalizados:', normalizedHeaders.slice(0, 15));
        console.log('Perguntas esperadas (primeiras 5):');
        Object.entries(QUESTION_MAPPING).slice(0, 5).forEach(([questionText, info]) => {
          const normalized = this.normalizeString(questionText);
          const found = normalizedHeaders.indexOf(normalized);
          console.log(`  - "${questionText.substring(0, 50)}..." -> normalizada: "${normalized.substring(0, 50)}..." -> encontrada na posição: ${found}`);
        });
      }

      // ✅ 4. DETECTAR POSSÍVEIS INVERSÕES DE COLUNAS
      const { corrections } = this.detectColumnMismatch(headers, row, rowIndex);
      if (corrections.length > 0 && rowIndex <= 1) {
        console.warn(`🔄 CORREÇÕES DETECTADAS na linha ${rowIndex + 1}:`);
        corrections.forEach(correction => {
          console.warn(`   - ${correction.reason}: mover da coluna ${correction.from} para ${correction.to}`);
        });
      }
      
      // Extrair metadados (8 primeiras colunas)
      const userID = row[0]?.toString().trim();
      const email = row[1]?.toString().trim();
      const nome = row[2]?.toString().trim();
      const companhia = row[3]?.toString().trim();
      const ecossistema = row[4]?.toString().trim();
      const timeDedicado = row[5]?.toString().trim();
      const quantidadePessoas = row[6]?.toString().trim();
      const areaPertenente = row[7]?.toString().trim();

      // Validar campos obrigatórios de identificação
      if (!userID && !email) {
        errors.push(`Linha ${rowIndex + 1}: UserID ou Email é obrigatório para identificar o respondente`);
      }
      if (!nome) {
        errors.push(`Linha ${rowIndex + 1}: Nome é obrigatório`);
      }

      // Processar respostas das perguntas (colunas 9 em diante)
      const respostas: Record<string, number> = {}; // Apenas respostas numéricas
      const respostaTexto: Record<string, string[]> = {}; // Para perguntas especiais de texto
      
      // ✅ 5. ITERAR PELAS PERGUNTAS USANDO MAPEAMENTO NORMALIZADO
      for (const [normalizedQuestion, { originalText: questionText, info: questionInfo }] of Object.entries(normalizedQuestionMapping)) {
        // ✅ 6. BUSCAR ÍNDICE DA COLUNA com normalização agressiva
        let columnIndex = normalizedHeaders.indexOf(normalizedQuestion);
        
        // ✅ 7. VERIFICAR SE PERGUNTA FOI ENCONTRADA
        if (columnIndex === -1) {
          // Tentar busca parcial se a exata falhar
          columnIndex = normalizedHeaders.findIndex(h => 
            h.includes(normalizedQuestion.substring(0, 20)) || 
            normalizedQuestion.includes(h.substring(0, 20))
          );
          
          if (columnIndex === -1) {
            errors.push(`Linha ${rowIndex + 1}: Coluna para pergunta "${questionText.substring(0, 50)}..." não encontrada no cabeçalho`);
            continue;
          } else {
            console.warn(`⚠️ Busca parcial: "${questionText.substring(0, 30)}..." encontrada na posição ${columnIndex} (header: "${headers[columnIndex]?.substring(0, 30)}...")`);
          }
        }
        
        // Garantir que é coluna de pergunta (após metadados)
        if (columnIndex < 8) {
          errors.push(`Linha ${rowIndex + 1}: Pergunta "${questionText.substring(0, 50)}..." encontrada em coluna de metadados (${columnIndex})`);
          continue;
        }
        
        const rawValue = row[columnIndex];
        
        // ✅ 8. LOG DEFENSIVO ULTRA-DETALHADO para diagnosticar problemas
        if (rowIndex <= 1) { // Log apenas das primeiras 2 linhas
          console.log(`🔍 Linha ${rowIndex + 1} | Pergunta: "${questionText.substring(0, 30)}..." | ID: ${questionInfo.id} | Coluna: ${columnIndex} | Header: "${headers[columnIndex]?.substring(0, 30)}..." | Valor: "${rawValue}"`);
          
          // Log especial para perguntas problemáticas
          if (questionInfo.id === 'doc1' || questionInfo.id === 'test12') {
            console.log(`🎯 PERGUNTA CRÍTICA ${questionInfo.id}:`);
            console.log(`   - Texto original: "${questionText}"`);
            console.log(`   - Normalizada: "${normalizedQuestion}"`);
            console.log(`   - Header encontrado: "${headers[columnIndex]}"`);
            console.log(`   - Header normalizado: "${normalizedHeaders[columnIndex]}"`);
            console.log(`   - Valor na coluna: "${rawValue}"`);
          }
        }

        // ✅ Processar o valor baseado no tipo de pergunta
        if (questionInfo.id === 'test12') {
          // ✅ PERGUNTA ESPECIAL test12 - modalidades de teste (textual)
          if (rawValue && rawValue !== '') {
            // Quebrar por vírgulas E ponto-e-vírgula para capturar ambos os formatos
            const modalidades = rawValue.toString()
              .split(/[,;]/) // Quebra por vírgula OU ponto-e-vírgula
              .map((m: string) => m.trim())
              .filter((m: string) => m);
            respostaTexto[questionInfo.id] = modalidades;
            // Log específico para test12
            if (rowIndex <= 1) {
              console.log(`📝 test12 processada: ${modalidades.join(', ')}`);
            }
          }
        } else {
          // ✅ PERGUNTAS NUMÉRICAS - validar escala 0-5
          if (rawValue === null || rawValue === undefined || rawValue === '') {
            errors.push(`Linha ${rowIndex + 1}: Resposta vazia para pergunta "${questionText.substring(0, 50)}..." (coluna ${columnIndex})`);
          } else {
            const numValue = Number(rawValue);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 5 && Number.isInteger(numValue)) {
              respostas[questionInfo.id] = numValue;
            } else {
              // ⚠️ ERRO CRÍTICO: Valor não numérico em pergunta que deveria ser numérica
              console.error(`❌ ERRO MAPEAMENTO CRÍTICO:`);
              console.error(`   - Pergunta: "${questionText}"`);
              console.error(`   - ID esperado: ${questionInfo.id}`);
              console.error(`   - Coluna: ${columnIndex}`);
              console.error(`   - Header da coluna: "${headers[columnIndex]}"`);
              console.error(`   - Valor recebido: "${rawValue}" (tipo: ${typeof rawValue})`);
              console.error(`   - Header normalizado: "${normalizedHeaders[columnIndex]}"`);
              console.error(`   - Pergunta normalizada: "${normalizedQuestion}"`);
              
              // Verificar se é confusão com test12
              if (typeof rawValue === 'string' && rawValue.includes(';')) {
                console.error(`   ⚠️ SUSPEITA: Valor parece ser da pergunta test12!`);
                // Encontrar onde test12 deveria estar
                const test12Entry = Object.entries(normalizedQuestionMapping).find(([, info]) => info.info.id === 'test12');
                if (test12Entry) {
                  const [test12Normalized, test12Data] = test12Entry;
                  const test12Index = normalizedHeaders.indexOf(test12Normalized);
                  console.error(`   - test12 deveria estar na coluna: ${test12Index}`);
                  console.error(`   - test12 header: "${headers[test12Index]}"`);
                  if (test12Index >= 0 && test12Index < row.length) {
                    console.error(`   - Valor na coluna test12: "${row[test12Index]}"`);
                  }
                }
              }
              
              errors.push(`Linha ${rowIndex + 1}: Pergunta "${questionText.substring(0, 50)}..." deve ter valor inteiro entre 0 e 5, encontrado: "${rawValue}" (coluna ${columnIndex}, header: "${headers[columnIndex]?.substring(0, 30)}...")`);
            }
          }
        }
      }

      // Se houve erros críticos, retornar null
      if (errors.length > 0) {
        return { user: null, errors };
      }

      // ✅ Combinar respostas numéricas e textuais
      const todasRespostas: Record<string, number | string[]> = {
        ...respostas,
        ...respostaTexto
      };

      // Calcular médias por pilar
      const mediasPorPilar = this.calculatePillarAverages(todasRespostas);

      // Identificar forças e fraquezas
      const { forcas, fraquezas } = this.identifyStrengthsAndWeaknesses(mediasPorPilar);

      // Agrupar respostas por pilar
      const respostasPorPilar = this.groupResponsesByPillar(todasRespostas);

      // Extrair modalidades de teste para análise qualitativa
      const modalidadesTestes = respostaTexto['test12'] || [];

      // Criar usuário importado
      const user: ImportedUser = {
        userID: userID || '',
        email: email || '',
        nome: nome || '',
        companhia: companhia || '',
        ecossistema: ecossistema || '',
        timeDedicado: timeDedicado || '',
        quantidadePessoas: quantidadePessoas || '',
        areaPertenente: areaPertenente || '',
        respostas: todasRespostas,
        respostasPorPilar,
        mediasPorPilar,
        forcas,
        fraquezas,
        modalidadesTestes
      };

      return { user, errors: [] };

    } catch (error) {
      console.error(`Erro ao processar linha ${rowIndex + 1}:`, error);
      errors.push(`Linha ${rowIndex + 1}: Erro interno no processamento - ${error.message}`);
      return { user: null, errors };
    }
  }

  // ✅ FUNÇÃO PRINCIPAL - Usar leitura real em vez de simulação
  static async processFile(file: File): Promise<ImportResults> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const validUsers: ImportedUser[] = [];
    
    try {
      console.log('🚀 Iniciando processamento do arquivo:', file.name);
      
      // ✅ USAR LEITURA REAL DO EXCEL
      const data = await this.readExcelFile(file);
      
      if (data.length === 0) {
        throw new Error('Arquivo está vazio');
      }

      const headers = data[0] as string[];
      console.log('📋 Cabeçalhos encontrados:', headers.length);

      // Validar estrutura
      const { errors: structErrors, warnings: structWarnings } = this.validateFileStructure(headers);
      errors.push(...structErrors);
      warnings.push(...structWarnings);

      // Se houver erros críticos de estrutura, parar o processamento
      if (structErrors.length > 0) {
        console.error('❌ Erros críticos de estrutura encontrados:', structErrors);
        return {
          totalUsers: 0,
          validUsers: 0,
          invalidUsers: 0,
          errors,
          warnings,
          data: [],
          consolidatedData: {
            totalRespondents: 0,
            mediaGeralPorPilar: {},
            distribuicaoRespostas: {},
            principaisDesafios: [],
            principaisForcas: [],
            modalidadesMaisUtilizadas: []
          }
        };
      }

      // Processar linhas de dados (pular cabeçalho)
      const dataRows = data.slice(1);
      console.log(`📊 Processando ${dataRows.length} linhas de dados...`);

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        if (!row || row.length === 0) continue; // Pular linhas vazias

        const { user, errors: rowErrors } = this.processUserRow(headers, row, i);
        
        if (user) {
          validUsers.push(user);
        }
        
        errors.push(...rowErrors);
      }

      console.log(`✅ Processamento concluído:`);
      console.log(`   - Usuários válidos: ${validUsers.length}`);
      console.log(`   - Erros encontrados: ${errors.length}`);
      console.log(`   - Avisos: ${warnings.length}`);

      // Gerar dados consolidados
      const consolidatedData = this.generateConsolidatedData(validUsers);

      return {
        totalUsers: dataRows.length,
        validUsers: validUsers.length,
        invalidUsers: dataRows.length - validUsers.length,
        errors,
        warnings,
        data: validUsers,
        consolidatedData
      };

    } catch (error) {
      console.error('❌ Erro no processamento do arquivo:', error);
      return {
        totalUsers: 0,
        validUsers: 0,
        invalidUsers: 0,
        errors: [`Erro fatal: ${error.message}`],
        warnings,
        data: [],
        consolidatedData: {
          totalRespondents: 0,
          mediaGeralPorPilar: {},
          distribuicaoRespostas: {},
          principaisDesafios: [],
          principaisForcas: [],
          modalidadesMaisUtilizadas: []
        }
      };
    }
  }

  // Gerar dados consolidados
  static generateConsolidatedData(users: ImportedUser[]): ImportResults['consolidatedData'] {
    if (users.length === 0) {
      return {
        totalRespondents: 0,
        mediaGeralPorPilar: {},
        distribuicaoRespostas: {},
        principaisDesafios: [],
        principaisForcas: [],
        modalidadesMaisUtilizadas: []
      };
    }

    // Calcular médias gerais por pilar
    const mediaGeralPorPilar: Record<string, number> = {};
    for (const pilar of PILLARS) {
      const medias = users.map(user => user.mediasPorPilar[pilar]).filter(media => media > 0);
      mediaGeralPorPilar[pilar] = medias.length > 0 ? 
        Math.round((medias.reduce((sum, media) => sum + media, 0) / medias.length) * 10) / 10 : 0;
    }

    // Distribuição de respostas
    const distribuicaoRespostas: Record<string, Record<number, number>> = {};
    for (const pilar of PILLARS) {
      distribuicaoRespostas[pilar] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      for (const user of users) {
        for (const resposta of user.respostasPorPilar[pilar] || []) {
          distribuicaoRespostas[pilar][resposta]++;
        }
      }
    }

    // Principais desafios (pilares com médias mais baixas)
    const principaisDesafios = Object.entries(mediaGeralPorPilar)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([pilar]) => pilar);

    // Principais forças (pilares com médias mais altas)
    const principaisForcas = Object.entries(mediaGeralPorPilar)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pilar]) => pilar);

    // Modalidades mais utilizadas
    const modalidadesCount: Record<string, number> = {};
    for (const user of users) {
      for (const modalidade of user.modalidadesTestes || []) {
        // Garantir que modalidades com vírgulas também sejam quebradas aqui
        const modalidadesSeparadas = modalidade.split(/[,;]/).map(m => m.trim()).filter(m => m);
        for (const modalidadeSeparada of modalidadesSeparadas) {
          modalidadesCount[modalidadeSeparada] = (modalidadesCount[modalidadeSeparada] || 0) + 1;
        }
      }
    }

    const modalidadesMaisUtilizadas = Object.entries(modalidadesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([modalidade, count]) => ({
        modalidade,
        count,
        percentage: Math.round((count / users.length) * 100)
      }));

    return {
      totalRespondents: users.length,
      mediaGeralPorPilar,
      distribuicaoRespostas,
      principaisDesafios,
      principaisForcas,
      modalidadesMaisUtilizadas
    };
  }
}