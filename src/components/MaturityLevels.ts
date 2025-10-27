// Utilitário para níveis de maturidade QualityScore
// Centraliza a lógica de classificação e cores dos níveis de maturidade

export interface MaturityLevel {
  nivel: string;
  cor: string;
  descricao: string;
  faixa: string;
}

/**
 * Determina o nível de maturidade baseado na pontuação
 * Escalas:
 * - 4-5: Domínio
 * - 3-4: Experiência  
 * - 2-3: Consciência
 * - 1-2: Inicialização
 * - 0-1: Agnóstico
 */
export function getNivelMaturidade(score: number): MaturityLevel {
  if (score >= 4.0) {
    return { 
      nivel: 'Domínio', 
      cor: '#16a34a', 
      descricao: 'Práticas otimizadas e referência no mercado',
      faixa: '4.0 - 5.0'
    };
  }
  if (score >= 3.0) {
    return { 
      nivel: 'Experiência', 
      cor: '#2563eb', 
      descricao: 'Práticas bem estabelecidas e efetivas',
      faixa: '3.0 - 3.9'
    };
  }
  if (score >= 2.0) {
    return { 
      nivel: 'Consciência', 
      cor: '#d97706', 
      descricao: 'Práticas em evolução, requer atenção',
      faixa: '2.0 - 2.9'
    };
  }
  if (score >= 1.0) {
    return { 
      nivel: 'Inicialização', 
      cor: '#dc2626', 
      descricao: 'Práticas básicas, necessita melhorias urgentes',
      faixa: '1.0 - 1.9'
    };
  }
  return { 
    nivel: 'Agnóstico', 
    cor: '#64748b', 
    descricao: 'Práticas não implementadas',
    faixa: '0.0 - 0.9'
  };
}

/**
 * Lista todos os níveis de maturidade para referência
 */
export const NIVEIS_MATURIDADE: MaturityLevel[] = [
  {
    nivel: 'Domínio',
    cor: '#16a34a',
    descricao: 'Práticas otimizadas e referência no mercado',
    faixa: '4.0 - 5.0'
  },
  {
    nivel: 'Experiência',
    cor: '#2563eb', 
    descricao: 'Práticas bem estabelecidas e efetivas',
    faixa: '3.0 - 3.9'
  },
  {
    nivel: 'Consciência',
    cor: '#d97706',
    descricao: 'Práticas em evolução, requer atenção',
    faixa: '2.0 - 2.9'
  },
  {
    nivel: 'Inicialização',
    cor: '#dc2626',
    descricao: 'Práticas básicas, necessita melhorias urgentes',
    faixa: '1.0 - 1.9'
  },
  {
    nivel: 'Agnóstico',
    cor: '#64748b',
    descricao: 'Práticas não implementadas',
    faixa: '0.0 - 0.9'
  }
];

/**
 * Retorna a cor associada a um nível específico
 */
export function getCorNivel(nivel: string): string {
  const nivelEncontrado = NIVEIS_MATURIDADE.find(n => n.nivel === nivel);
  return nivelEncontrado?.cor || '#64748b';
}

/**
 * Retorna recomendações baseadas no nível de maturidade
 */
export function getRecomendacoesPorNivel(nivel: string): string[] {
  switch (nivel) {
    case 'Domínio':
      return [
        'Mantenha as práticas de excelência',
        'Compartilhe conhecimento com outras equipes',
        'Busque inovações para estar sempre na vanguarda'
      ];
    case 'Experiência':
      return [
        'Otimize processos existentes',
        'Implemente métricas avançadas',
        'Busque certificações e benchmarks'
      ];
    case 'Consciência':
      return [
        'Formalize processos em desenvolvimento',
        'Invista em treinamento da equipe',
        'Implemente ferramentas de automação'
      ];
    case 'Inicialização':
      return [
        'Defina processos básicos de qualidade',
        'Estabeleça métricas fundamentais',
        'Priorize capacitação da equipe'
      ];
    case 'Agnóstico':
      return [
        'Inicie com processos básicos',
        'Defina responsabilidades claras',
        'Estabeleça cultura de qualidade'
      ];
    default:
      return ['Avalie as práticas atuais', 'Defina um plano de melhoria'];
  }
}