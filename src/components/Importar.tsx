import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ExcelTemplateGenerator } from './ExcelTemplateGenerator';
import { XLSXProcessor, type ImportResults, type ImportedUser } from './XLSXProcessor';
import { AccessControl } from './AccessControl';
import { QualityScoreLayout } from './QualityScoreLayout';
import { useQualityScore } from './QualityScoreManager';
import { useCompany } from './CompanyContext';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download,
  Users,
  FileCheck,
  Eye,
  Trash2,
  RefreshCw,
  Building2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

// Mapeamento das colunas esperadas no XLSX
const EXPECTED_COLUMNS = [
  'UserID',
  'Email', 
  'Nome',
  'Qual companhia você está representando?',
  'Qual é o ecossistema que ela está inserida (Saúde, Serviços, Financeiro, Hardwares...)',
  'Você possui time dedicado a qualidade de software?',
  'Se sim, quantas pessoas hoje fazem parte do time e qual a senioridade delas (Ex: 2 JR, 3 PL)? Se não, digitar N/A',
  'Você é um profissional que pertence a área da Tecnologia? Se sim, qual setor. Se não, preencher "outro" indicando sua área correspondente.',
  // Perguntas do pilar Processos e Estratégia
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
  // Perguntas do pilar Testes Automatizados
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
  // Perguntas do pilar Métricas
  'Qual seria sua nota para o quão bem estamos monitorando as métricas de qualidade no processo de desenvolvimento (métrica da esteira)?',
  'Quão bem estamos definindo e acompanhando as métricas de qualidade do código, desempenho do sistema e experiência do usuário?',
  'A empresa possui metas (OKR) destinadas a desenvolvimento e/ou qualidade?',
  'Quão alinhadas estão nossas métricas de qualidade com os objetivos e metas de negócio da organização?',
  'Existem métricas para avaliar o desempenho do projeto e impulsionar a melhoria contínua?',
  'As métricas que temos hoje são úteis para identificar áreas de melhoria e tomar decisões informadas?',
  'Com que frequência atualizamos e revisamos nossas métricas de qualidade?',
  'As métricas de qualidade são acessíveis e transparentes a todos os membros da equipe e pares?',
  'O time de QA é responsável também pelo monitoramento das métricas e eventuais análises, afim de auxiliar em tomadas de decisões e melhorias de atuação coletiva ou individual?',
  'Existem SLAs para acompanhamento regular do tempo médio de correção de defeitos, e/ou ausência de escopo, após a identificação?',
  'São realizadas análises periódicas das métricas monitoradas, afim de perceber tendências e/ou atuar em prevenções?',
  'As métricas de satisfação do cliente são usadas para avaliar a qualidade percebida do software?',
  'A taxa de rejeição de casos de teste é monitorada para avaliar sua eficácia e relevância?',
  'São realizadas análises pós-implantação para avaliar a estabilidade do software em ambiente de produção?',
  // Perguntas do pilar Documentações
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
  // Perguntas do pilar Modalidades de Testes
  'A equipe de qualidade se sente preparada e a vontade para aplicar outras modalidades de testes (como segurança, performance, carga e estresse…)?',
  'Quão bem os QAs adotam uma visão ampla em práticas de controle de qualidade como estratégia para validar o produto, indo além do caminho feliz?',
  'Os testes funcionais cobrem todos os requisitos do usuário?',
  'São realizados testes de protótipo ou em etapas de conceitualização de produto e modelagem?',
  'Há testes de desempenho para avaliar a escalabilidade do sistema?',
  'Quão amplo são os testes de compatibilidade, eles garantem diferentes dispositivos e plataformas?',
  'Os testes de regressão são automatizados e executados regularmente?',
  'Há testes de recuperação de falhas após situações de erro no software?',
  'Dev e PO (ou outros papéis) do time realizam testes guiados pelo QA (Pair Testing)?',
  'Existe uma preocupação com testes de Acessibilidade voltados a garantir melhor experiência do usuário nos produtos?',
  'Existem trocas entre as áreas para que os QAs tenham mais percepções das necessidades do produto, transformando em testes mais direcionados?',
  'Quais modalidades de teste hoje os QAs aplicam?',
  // Perguntas do pilar QAOps
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
  // Perguntas do pilar Liderança
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
  'Os QAs possuem uma visão clara sobre o desenvolvimento pessoal e trilha de carreira dentro da área, com seus desafios e goals?',
  'A liderança de Qualidade tem uma visão ampla de qualidade indo além da visão de validação e verificação como etapa única no ciclo de desenvolvimento?'
];

export function Importar() {
  return (
    <AccessControl requiredPermissions={['canImportData']}>
      <QualityScoreLayout 
        currentSection="qualityscore-importar" 
        title="Importar Dados QualityScore"
        description="Importe respostas de múltiplos usuários através de arquivos Excel (.xlsx)"
      >
        <ImportarContent />
      </QualityScoreLayout>
    </AccessControl>
  );
}

function ImportarContent() {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companyAction, setCompanyAction] = useState<'new' | 'existing' | 'current' | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySector, setNewCompanySector] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use hooks
  const { qualityScores, createQualityScore, getAllCompanies } = useQualityScore();
  const { selectedCompany, availableCompanies, isWhitelabelMode } = useCompany();

  // Processar arquivo XLSX usando XLSXProcessor
  const processXLSXFile = async (file: File): Promise<ImportResults> => {
    return await XLSXProcessor.processFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.includes('sheet') || 
          droppedFile.name.endsWith('.xlsx') || 
          droppedFile.name.endsWith('.xls') ||
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          droppedFile.type === 'application/vnd.ms-excel') {
        setFile(droppedFile);
      } else {
        setErrorMessage('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.includes('sheet') || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls') ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
      } else {
        setErrorMessage('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
        // Reset input
        e.target.value = '';
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setProgress(0);
    setActiveTab('processing');
    
    try {
      const results = await processXLSXFile(file);
      setImportResults(results);
      setActiveTab('results');
    } catch (error) {
      console.error('Erro na importação:', error);
      setErrorMessage('Erro ao processar arquivo. Verifique o formato e tente novamente.');
      setActiveTab('upload');
    } finally {
      setImporting(false);
      setProgress(100);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImportResults(null);
    setProgress(0);
    setErrorMessage(null);
    setShowCompanyDialog(false);
    setCompanyAction(null);
    setNewCompanyName('');
    setNewCompanySector('');
    setSelectedCompanyId('');
    setActiveTab('upload');
  };

  const handleGenerateResults = () => {
    // Se estiver em modo whitelabel, mostrar dialog perguntando se é para empresa atual
    if (isWhitelabelMode && selectedCompany) {
      setCompanyAction('current');
    }
    setShowCompanyDialog(true);
  };

  const handleCompanyAssociation = () => {
    if (companyAction === 'new' && (!newCompanyName || !newCompanySector)) {
      alert('Por favor, preencha todos os campos para criar nova empresa.');
      return;
    }
    
    if (companyAction === 'existing' && !selectedCompanyId) {
      alert('Por favor, selecione uma empresa existente.');
      return;
    }

    if (!importResults) return;

    // Determinar empresa baseado na ação
    let companyName = '';
    let companySector = '';
    
    if (companyAction === 'current' && selectedCompany) {
      companyName = selectedCompany.name;
      companySector = selectedCompany.domain; // Usando domain como setor
    } else if (companyAction === 'new') {
      companyName = newCompanyName;
      companySector = newCompanySector;
    } else if (companyAction === 'existing') {
      const existingCompany = availableCompanies.find(c => c.id === selectedCompanyId);
      if (existingCompany) {
        companyName = existingCompany.name;
        companySector = existingCompany.domain;
      }
    }
    
    // Criar novo QualityScore usando o manager
    const newQualityScore = createQualityScore(companyName, companySector, importResults);
    
    console.log('QualityScore criado:', newQualityScore);
    
    setShowCompanyDialog(false);
    alert(`QualityScore V${newQualityScore.version} criado com sucesso para "${companyName}"! Acesse a seção de Resultados para visualizar.`);
    
    // Reset form
    setCompanyAction(null);
    setNewCompanyName('');
    setNewCompanySector('');
    setSelectedCompanyId('');
  };

  return (
    <div className="bg-gray-50 min-h-full p-6">
      <div className="max-w-6xl mx-auto">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="processing" disabled={!importing}>Processamento</TabsTrigger>
            <TabsTrigger value="results" disabled={!importResults || importing}>Resultados</TabsTrigger>
            <TabsTrigger value="preview" disabled={!importResults || importing}>Preview</TabsTrigger>
          </TabsList>

          {/* Aba de Upload */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Área de Upload */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Upload do Arquivo</h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : file 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={!file ? handleFileSelect : undefined}
                >
                  {file ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                      <div>
                        <p className="font-medium text-green-900">{file.name}</p>
                        <p className="text-sm text-green-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleImport} disabled={importing}>
                          <FileCheck className="h-4 w-4 mr-2" />
                          Processar Arquivo
                        </Button>
                        <Button variant="outline" onClick={() => setFile(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Arraste seu arquivo Excel aqui
                        </p>
                        <p className="text-gray-600">ou clique em qualquer lugar para selecionar</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button variant="outline" onClick={handleFileSelect}>
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar Arquivo
                      </Button>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="mt-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <h4 className="font-medium">Erro no arquivo</h4>
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    </Alert>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Formato aceito:</strong> Arquivos Excel (.xlsx) com estrutura específica
                  </p>
                </div>
              </Card>

              {/* Instruções e Template */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Instruções</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Estrutura do Arquivo</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Linha 1:</strong> Cabeçalhos das colunas</li>
                      <li>• <strong>Demais linhas:</strong> Dados dos respondentes</li>
                      <li>• <strong>Colunas 1-8:</strong> Metadados do usuário</li>
                      <li>• <strong>Colunas 9-99:</strong> Perguntas QualityScore (0-5)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Validações Aplicadas</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Identificação:</strong> UserID e/ou Email obrigatório</li>
                      <li>• <strong>Respostas:</strong> Valores entre 0-5 (inteiros)</li>
                      <li>• <strong>Mínimo:</strong> 90+ perguntas esperadas</li>
                      <li>• <strong>Campos vazios:</strong> Não permitidos em perguntas</li>
                      <li>• <strong>Cálculos:</strong> Médias por pilar automáticas</li>
                    </div>
                  </div>

                  <div>
                    <ExcelTemplateGenerator onGenerate={() => console.log('Template gerado!')} />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Processamento */}
          <TabsContent value="processing">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Processando Arquivo
                  </h2>
                  <p className="text-gray-600">
                    Validando estrutura e importando dados dos respondentes...
                  </p>
                </div>

                <div className="max-w-sm mx-auto">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">{progress}% completo</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aba de Resultados */}
          <TabsContent value="results">
            {importResults && (
              <div className="space-y-6">
                {/* Resumo da Importação */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Resumo da Importação</h2>
                    <Button onClick={handleReset} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Nova Importação
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Total de Usuários</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {importResults.totalUsers}
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Válidos</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {importResults.validUsers}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-900">Com Problemas</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700">
                        {importResults.invalidUsers}
                      </div>
                    </div>
                  </div>

                  {(importResults.errors.length > 0 || importResults.warnings.length > 0) && (
                    <div className="mt-6 space-y-4">
                      {importResults.errors.length > 0 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <div>
                            <h4 className="font-medium">Erros Encontrados:</h4>
                            <ul className="mt-2 text-sm space-y-1 max-h-32 overflow-y-auto">
                              {importResults.errors.slice(0, 10).map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                              {importResults.errors.length > 10 && (
                                <li className="text-gray-500">... e mais {importResults.errors.length - 10} erros</li>
                              )}
                            </ul>
                          </div>
                        </Alert>
                      )}

                      {importResults.warnings.length > 0 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <div>
                            <h4 className="font-medium">Avisos:</h4>
                            <ul className="mt-2 text-sm space-y-1 max-h-32 overflow-y-auto">
                              {importResults.warnings.slice(0, 10).map((warning, index) => (
                                <li key={index}>• {warning}</li>
                              ))}
                              {importResults.warnings.length > 10 && (
                                <li className="text-gray-500">... e mais {importResults.warnings.length - 10} avisos</li>
                              )}
                            </ul>
                          </div>
                        </Alert>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleGenerateResults} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Gerar QualityScore
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Aba de Preview */}
          <TabsContent value="preview">
            {importResults && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Preview dos Dados</h2>
                <div className="overflow-x-auto max-h-96">
                  <div className="text-sm text-gray-600 mb-4">
                    Primeiros 5 usuários importados:
                  </div>
                  {/* Aqui você pode implementar uma tabela de preview dos dados */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-center text-gray-500">Preview detalhado dos dados estará disponível em breve</p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal de Associação de Empresa */}
        <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Associar QualityScore à Empresa
              </DialogTitle>
              <DialogDescription>
                Para gerar os resultados, é necessário associar os dados a uma empresa.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Escolha uma opção:</h4>
                <RadioGroup value={companyAction || ''} onValueChange={(value) => setCompanyAction(value as any)}>
                  {/* Se estiver em whitelabel mode, mostrar opção da empresa atual primeiro */}
                  {isWhitelabelMode && selectedCompany && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-blue-50">
                      <RadioGroupItem value="current" id="current" />
                      <Label htmlFor="current" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: selectedCompany.primaryColor || '#2563eb' }}
                          />
                          <span>Importar para "<strong>{selectedCompany.name}</strong>" (empresa atual)</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Você está navegando como esta empresa. Os dados serão associados automaticamente.
                        </p>
                      </Label>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing" className="cursor-pointer">Vincular a empresa existente</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="cursor-pointer">Criar nova empresa</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Seleção de Empresa Existente */}
              {companyAction === 'existing' && (
                <div>
                  <Label htmlFor="company-select" className="text-sm font-medium">
                    Selecionar Empresa
                  </Label>
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Escolha uma empresa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: company.primaryColor || '#2563eb' }}
                            />
                            {company.name} - {company.domain}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Criação de Nova Empresa */}
              {companyAction === 'new' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Ex: Tech Solutions LTDA"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-sector">Setor/Segmento</Label>
                    <Input
                      id="company-sector"
                      value={newCompanySector}
                      onChange={(e) => setNewCompanySector(e.target.value)}
                      placeholder="Ex: Tecnologia, Software, Financeiro..."
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCompanyDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCompanyAssociation}>
                  Confirmar e Gerar Resultados
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}