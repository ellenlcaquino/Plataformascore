import React from 'react';
import { Button } from './ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';

// Estrutura completa do template com todas as colunas
const TEMPLATE_STRUCTURE = {
  headers: [
    // Colunas de identificação
    'UserID',
    'Email',
    'Nome',
    
    // Colunas de contexto empresarial
    'Qual companhia você está representando?',
    'Qual é o ecossistema que ela está inserida (Saúde, Serviços, Financeiro, Hardwares...)',
    'Você possui time dedicado a qualidade de software?',
    'Se sim, quantas pessoas hoje fazem parte do time e qual a senioridade delas (Ex: 2 JR, 3 PL)? Se não, digitar N/A',
    'Você é um profissional que pertence a área da Tecnologia? Se sim, qual setor. Se não, preencher "outro" indicando sua área correspondente.',
    
    // Perguntas do pilar Processos e Estratégia (16 perguntas)
    'Existe uma esteira de desenvolvimento bem estruturada?',
    'A visão do ciclo de desenvolvimento também contempla Negócio, Produto e Design?',
    'Existem boas práticas de gerenciamento das mudanças nos requisitos ao longo do ciclo de vida do projeto?',
    'Existe um processo claro e documentado sobre code-review?',
    'Os papéis e responsabilidades estão bem claros e a equipe se sente confortável em executá-los?',
    'Existe uma metodologia de trabalho, sendo ela conhecida e seguida por todos na equipe?',
    'As reuniões de equipe são conduzidas de maneira clara e objetiva visando garantir troca de informações entre os membros?',
    'Os prazos estabelecidos em diferentes etapas do projeto estão sendo cumpridos?',
    'Existe um sistema de rastreamento de bugs devidamente implementado, demonstrando eficácia em identificar, documentar e monitorar o status de cada problema encontrado durante o desenvolvimento do projeto?',
    'O bug tracking é regularmente atualizado para garantir que as informações estejam sempre precisas e refletindo o estado atual do projeto?',
    'Existe um plano de ação e priorização para os bugs, de modo que sejam separados corretamente conforme sua categorização e necessidade de resolução?',
    'Além de identificação de bugs, vocês possuem processo para diferenciar melhoria e/ou ausência de escopo?',
    'A empresa possui uma área de qualidade madura?',
    'A área de qualidade possui uma visão de governança e estratégia, tendo seus próprios processos e responsabilidades claros e objetivos?',
    'Existe e é aplicado o contrato de Definition Of Ready?',
    'Existe e é aplicado o contrato de Definition Of Done?',
    
    // Perguntas do pilar Testes Automatizados (16 perguntas)
    'Qual seria a sua avaliação para a cobertura de testes automatizados em relação ao código do projeto?',
    'Os testes automatizados tem uma bom coverage funcional no core business?',
    'Quão robustos e confiáveis são os testes automatizados em fornecer resultados consistentes em diferentes ambientes e condições?',
    'Como você avalia a capacidade dos testes automatizados em lidar com flutuações nos resultados?',
    'Os testes automatizados são integrados ao processo de continuous testing?',
    'Quão bem os testes automatizados estão integrados aos processos de CI/CD, garantindo testes contínuos e feedback rápido?',
    'Quão automaticamente os testes automatizados são executados em cada build ou deploy do projeto?',
    'A arquitetura da automação permite fácil manutenção dos testes conforme o código do projeto evolui?',
    'Quão bem os testes automatizados escalam para lidar com o crescimento do projeto e a adição de novos recursos?',
    'Os testes automatizados são eficientes em termos de tempo de execução e recursos necessários?',
    'Os testes automatizados são registrados e apresentados de forma clara e compreensível?',
    'O monitoramento contínuo dos testes automatizados é eficaz para identificar falhas ou regressões rapidamente?',
    'Os testes automatizados seguem padrões e boas práticas estabelecidas para garantir sua eficácia e manutenibilidade?',
    'A equipe busca melhorar ativamente a qualidade e eficiência dos testes automatizados através da adoção de novas técnicas ou ferramentas?',
    'A Documentação técnica da arquitetura, bem como a baseline, é de fácil entendimento?',
    'As práticas de code review são aplicadas aos scripts de automação?',
    
    // Perguntas do pilar Métricas (14 perguntas)
    'Qual seria sua nota para o quão bem estamos monitorando as métricas de qualidade no processo de desenvolvimento (métrica da esteira)?',
    'Quão bem estamos definindo e acompanhando as métricas de qualidade do código, desempenho do sistema e experiência do usuário?',
    'A empresa possui metas (OKR) destinadas a desenvolvimento e/ou qualidade?',
    'Quão alinhadas estão nossas métricas de qualidade com os objetivos e metas de negócio da organização?',
    'Existem métricas para avaliar o desempenho do projeto e impulsionar a melhoria contínua?',
    'As métricas que temos hoje são úteis para identificar áreas de melhoria e tomar decisões informadas?',
    'Com que frequência atualizamos e revisamos nossas métricas de qualidade?',
    'As métricas de qualidade são acessíveis e transparentes a todos os membros da equipe e pares?',
    'O time de QA é responsável também pelo monitoramento das métricas e eventuais análises, afim de auxiliar em tomadas de decisões e melhorias de atuação coletiva ou individual?',
    'Existem SLA\'s para acompanhamento regular do tempo médio de correção de defeitos, e/ou ausência de escopo, após a identificação?',
    'São realizadas análises periódicas das métricas monitoradas, afim de perceber tendências e/ou atuar em prevenções?',
    'As métricas de satisfação do cliente são usadas para avaliar a qualidade percebida do software?',
    'A taxa de rejeição de casos de teste é monitorada para avaliar sua eficácia e relevância?',
    'São realizadas análises pós-implantação para avaliar a estabilidade do software em ambiente de produção?',
    
    // Perguntas do pilar Documentações (11 perguntas)
    'Todos os requisitos do projeto estão documentados e foram considerados durante o desenvolvimento?',
    'Quão abrangente é nossa documentação em relação aos requisitos, arquitetura e design do sistema?',
    'A documentação é regularmente atualizada para refletir as mudanças no projeto?',
    'A documentação do projeto é acessível para todos os membros de equipe e partes interessadas?',
    'Qual é sua avaliação geral da qualidade das documentações dos projetos em relação à precisão, completude e utilidade?',
    'A documentação é disponível em diferentes formatos (por exemplo, texto, vídeo)?',
    'A documentação inclui informações sobre os limites do projeto, como configuração e requisitos do sistema?',
    'Existe documentação e/ou padrões e boas práticas para gerenciamento dos testes?',
    'Os cenários de testes são claros e bem categorizados?',
    'Os cenários de testes são atualizados com frequência?',
    'Os cenários de testes são geridos de forma eficiente por uma ferramenta de gestão, garantindo também a rastreabilidade deles?',
    
    // Perguntas do pilar Modalidades de Testes (12 perguntas)
    'A equipe de qualidade se sente preparada e a vontade para aplicar outras modalidades de testes (como segurança, performance, carga e estresse…)?',
    'Quão bem os QA\'s adotam uma visão ampla em práticas de controle de qualidade como estratégia para validar o produto, indo além do caminho feliz?',
    'Os testes funcionais cobrem todos os requisitos do usuário?',
    'São realizados testes de protótipo ou em etapas de conceitualização de produto e modelagem?',
    'Há testes de desempenho para avaliar a escalabilidade do sistema?',
    'Quão amplo são os testes de compatibilidade, eles garantem diferentes dispositivos e plataformas?',
    'Os testes de regressão são automatizados e executados regularmente?',
    'Há testes de recuperação de falhas após situações de erro no software?',
    'Dev e PO (ou outros papéis) do time realizam testes guiados pelo QA (Pair Testing)?',
    'Existe uma preocupação com testes de Acessibilidade voltados a garantir melhor experiência do usuário nos produtos?',
    'Existem trocas entre as áreas para que os QA\'s tenham mais percepções das necessidades do produto, transformando em testes mais direcionados?',
    'Quais modalidades de teste hoje os QA\'s aplicam?',
    
    // Perguntas do pilar QAOps (10 perguntas)
    'Existe a colaboração entre equipes de desenvolvimento, qualidade, infraestrutura e operações para melhorias contínuas de práticas QAOps?',
    'O ambiente de teste é semelhante ao ambiente de produção?',
    'Quão automatizado é nosso processo de reteste e regressão para garantir que as correções não introduzam novos problemas?',
    'Todos os membros da equipe praticam ações de responsabilidade na garantia de qualidade do produto?',
    'Quão bem estamos monitorando as métricas de qualidade em tempo real durante todo o ciclo de vida do projeto?',
    'A equipe de QA está envolvida desde o início do ciclo de desenvolvimento, adotando prática de ShifLetf?',
    'Há uma cultura de aprendizado contínuo e melhoria na equipe de QA?',
    'Há sistemas de observabilidade e/ou gates de qualidade, como alertas para identificar problemas de qualidade em tempo real?',
    'Existe um processo de revisão e melhorias contínuas para as práticas de QA?',
    'Quão bem aprendemos com incidentes e problemas para evitar recorrências no futuro?',
    
    // Perguntas do pilar Liderança (12 perguntas)
    'Quão claro é o apoio da liderança organizacional à implementação de práticas de qualidade e melhoria contínua?',
    'Quão eficaz é a comunicação da liderança técnica sobre a importância da qualidade e dos objetivos de qualidade?',
    'Quão transparente é a liderança de tecnologia em relação aos desafios, expectativas e iniciativas relacionadas à qualidade?',
    'Quão bem a liderança de tecnologia apoia o desenvolvimento das habilidades e competências de toda equipe (produto, design, desenvolvimento) em relação à qualidade?',
    'Existe um orçamento pensado para recursos e oportunidades para o desenvolvimento e gerência da área de qualidade?',
    'Quão ativamente a liderança de qualidade promove uma cultura organizacional centrada na qualidade e na busca da excelência?',
    'Quão claras e mensuráveis são as metas de qualidade estabelecidas pela liderança de QA?',
    'São eficazes os indicadores de desempenho utilizados pela liderança para acompanhar e avaliar a qualidade do trabalho da equipe?',
    'Regularmente a liderança fornece feedback construtivo e oportunidades de melhoria para a equipe em relação à qualidade do trabalho?',
    'A liderança define claramente expectativas e responsabilidades em relação à qualidade e cumpre com os compromissos assumidos?',
    'Os QA\'s possuem uma visão clara sobre o desenvolvimento pessoal e trilha de carreira dentro da área, com seus desafios e goals?',
    'A liderança de Qualidade tem uma visão ampla de qualidade indo além da visão de validação e verificação como etapa única no ciclo de desenvolvimento?'
  ],
  
  // Dados de exemplo para preenchimento
  sampleRows: [
    [
      'USER001',
      'joao.silva@empresa.com',
      'João Silva',
      'TechCorp Brasil',
      'Tecnologia',
      'Sim',
      '2 PL, 1 SR',
      'Engenharia de Software',
      // Respostas de exemplo (escala 0-5) para as 91 perguntas
      ...Array(83).fill('').map((_, i) => {
        // Simular respostas variadas para demonstração
        const responses = [0, 1, 2, 3, 4, 5];
        return responses[i % responses.length];
      })
    ],
    [
      'USER002',
      'maria.santos@healthtech.com',
      'Maria Santos',
      'HealthTech Solutions',
      'Saúde',
      'Sim',
      '3 JR, 2 PL',
      'Quality Assurance',
      // Modalidades para a pergunta checkbox
      ...Array(82).fill('').map((_, i) => {
        const responses = [1, 2, 3, 4, 5];
        return responses[i % responses.length];
      }),
      'Funcional;API;Unitário;Integração;Aceitação' // Exemplo para pergunta checkbox
    ]
  ]
};

interface ExcelTemplateGeneratorProps {
  onGenerate?: () => void;
}

export function ExcelTemplateGenerator({ onGenerate }: ExcelTemplateGeneratorProps) {
  
  const generateCSVTemplate = () => {
    try {
      // Criar CSV com cabeçalhos
      const csvContent = [
        // Linha de cabeçalhos
        TEMPLATE_STRUCTURE.headers.map(header => `"${header}"`).join(','),
        
        // Linha de instruções
        [
          '"Exemplo: USER001"',
          '"exemplo@empresa.com"',
          '"Nome Completo"',
          '"Nome da Empresa"',
          '"Tecnologia/Saúde/Financeiro/etc"',
          '"Sim/Não"',
          '"Ex: 2 JR, 3 PL ou N/A"',
          '"Área de atuação"',
          // Instruções para as perguntas (escala 0-5)
          ...Array(83).fill('"0-5"'),
          // Para pergunta de modalidades
          '"Separar modalidades por ponto e vírgula: Funcional;API;Unitário"'
        ].join(','),
        
        // Linha em branco para preenchimento
        Array(TEMPLATE_STRUCTURE.headers.length).fill('""').join(',')
      ].join('\n');

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'QualityScore_Template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      onGenerate?.();
    } catch (error) {
      console.error('Erro ao gerar template:', error);
    }
  };

  const generateExcelTemplate = () => {
    // Para implementação futura com biblioteca XLSX
    console.log('Template Excel será implementado com biblioteca xlsx');
    generateCSVTemplate(); // Por enquanto, gerar CSV
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Template QualityScore</h3>
        <p className="text-sm text-blue-700 mb-3">
          Download do template com todas as {TEMPLATE_STRUCTURE.headers.length} colunas necessárias:
        </p>
        
        <div className="space-y-2">
          <div className="text-xs text-blue-600">
            • <strong>Colunas 1-8:</strong> Informações do usuário e empresa
          </div>
          <div className="text-xs text-blue-600">
            • <strong>Colunas 9-91:</strong> Perguntas dos 7 pilares (escala 0-5)
          </div>
          <div className="text-xs text-blue-600">
            • <strong>Coluna 91:</strong> Modalidades de teste (separar com ';')
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={generateExcelTemplate}
          className="justify-start h-12"
        >
          <FileSpreadsheet className="mr-3 h-4 w-4" />
          Template Excel (.xlsx)
        </Button>
        
        <Button 
          onClick={generateCSVTemplate}
          variant="outline"
          className="justify-start h-12"
        >
          <Download className="mr-3 h-4 w-4" />
          Template CSV (.csv)
        </Button>
      </div>

      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
        <strong>Instruções de Preenchimento:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Perguntas 1-90: Responder com números de 0 a 5</li>
          <li>• Pergunta 91 (Modalidades): Separar opções com ponto e vírgula</li>
          <li>• Não deixar células vazias nas colunas obrigatórias</li>
          <li>• UserID deve ser único para cada respondente</li>
        </ul>
      </div>
    </div>
  );
}