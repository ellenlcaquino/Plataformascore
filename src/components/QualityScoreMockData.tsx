// Dados mockados para demonstração com usuários individuais
export const MOCK_QUALITY_SCORES = [
  {
    id: 'techcorp-mock-example',
    companyId: 'comp1',
    companyName: 'TechCorp Brasil',
    companySector: 'Tecnologia',
    version: 1,
    createdAt: new Date('2024-01-15'),
    totalUsers: 8,
    validUsers: 8,
    importResults: {
      totalUsers: 8,
      validUsers: 8,
      invalidUsers: 0,
      errors: [],
      warnings: [],
      data: [
        {
          userID: 'tech001',
          email: 'ana.silva@techcorp.com',
          nome: 'Ana Silva',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Lead',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 4.2,
            'Testes Automatizados': 3.8,
            'Métricas': 3.9,
            'Documentações': 4.1,
            'Modalidades de Testes': 4.3,
            'QAOPS': 3.5,
            'Liderança': 4.7
          },
          forcas: ['Liderança', 'Modalidades de Testes'],
          fraquezas: ['QAOPS'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance']
        },
        {
          userID: 'tech002',
          email: 'carlos.santos@techcorp.com',
          nome: 'Carlos Santos',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'Senior QA',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.6,
            'Testes Automatizados': 4.2,
            'Métricas': 3.4,
            'Documentações': 3.8,
            'Modalidades de Testes': 4.1,
            'QAOPS': 3.8,
            'Liderança': 3.9
          },
          forcas: ['Testes Automatizados', 'Modalidades de Testes'],
          fraquezas: ['Métricas'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance', 'Segurança']
        },
        {
          userID: 'tech003',
          email: 'maria.oliveira@techcorp.com',
          nome: 'Maria Oliveira',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Analyst',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.1,
            'Testes Automatizados': 2.9,
            'Métricas': 2.8,
            'Documentações': 3.2,
            'Modalidades de Testes': 3.4,
            'QAOPS': 2.1,
            'Liderança': 3.6
          },
          forcas: ['Liderança'],
          fraquezas: ['QAOPS', 'Métricas'],
          modalidadesTestes: ['Funcional', 'API']
        },
        {
          userID: 'tech004',
          email: 'joao.pereira@techcorp.com',
          nome: 'João Pereira',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Analyst',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 2.8,
            'Testes Automatizados': 1.2,
            'Métricas': 2.1,
            'Documentações': 2.5,
            'Modalidades de Testes': 2.9,
            'QAOPS': 1.8,
            'Liderança': 4.1
          },
          forcas: ['Liderança'],
          fraquezas: ['Testes Automatizados', 'QAOPS', 'Métricas'],
          modalidadesTestes: ['Funcional']
        },
        {
          userID: 'tech005',
          email: 'pedro.costa@techcorp.com',
          nome: 'Pedro Costa',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Engineer',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.8,
            'Testes Automatizados': 2.1,
            'Métricas': 3.2,
            'Documentações': 2.9,
            'Modalidades de Testes': 4.0,
            'QAOPS': 2.5,
            'Liderança': 4.3
          },
          forcas: ['Liderança', 'Modalidades de Testes'],
          fraquezas: ['Testes Automatizados', 'QAOPS'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário']
        },
        {
          userID: 'tech006',
          email: 'lucia.fernandes@techcorp.com',
          nome: 'Lucia Fernandes',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Tester',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.4,
            'Testes Automatizados': 1.6,
            'Métricas': 2.7,
            'Documentações': 3.5,
            'Modalidades de Testes': 3.7,
            'QAOPS': 1.9,
            'Liderança': 4.8
          },
          forcas: ['Liderança', 'Modalidades de Testes'],
          fraquezas: ['Testes Automatizados', 'QAOPS'],
          modalidadesTestes: ['Funcional', 'API']
        },
        {
          userID: 'tech007',
          email: 'roberto.alves@techcorp.com',
          nome: 'Roberto Alves',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Automation',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.9,
            'Testes Automatizados': 3.1,
            'Métricas': 3.6,
            'Documentações': 2.8,
            'Modalidades de Testes': 4.2,
            'QAOPS': 2.7,
            'Liderança': 4.2
          },
          forcas: ['Liderança', 'Modalidades de Testes'],
          fraquezas: ['QAOPS'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance']
        },
        {
          userID: 'tech008',
          email: 'fernanda.lima@techcorp.com',
          nome: 'Fernanda Lima',
          companhia: 'TechCorp Brasil',
          ecossistema: 'Tecnologia',
          timeDedicado: 'Sim',
          quantidadePessoas: '5 pessoas (2 SR, 2 PL, 1 JR)',
          areaPertenente: 'QA Specialist',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.7,
            'Testes Automatizados': 2.3,
            'Métricas': 2.5,
            'Documentações': 3.6,
            'Modalidades de Testes': 3.5,
            'QAOPS': 2.0,
            'Liderança': 4.6
          },
          forcas: ['Liderança'],
          fraquezas: ['QAOPS', 'Testes Automatizados', 'Métricas'],
          modalidadesTestes: ['Funcional', 'API']
        }
      ],
      consolidatedData: {
        totalRespondents: 8,
        mediaGeralPorPilar: {
          'Processos e Estratégias': 3.5,
          'Testes Automatizados': 1.8,
          'Métricas': 2.9,
          'Documentações': 3.1,
          'Modalidades de Testes': 3.8,
          'QAOPS': 2.2,
          'Liderança': 4.5
        },
        distribuicaoRespostas: {},
        principaisDesafios: ['Automação de Testes', 'Métricas de Qualidade', 'QAOps'],
        principaisForcas: ['Liderança', 'Modalidades de Testes', 'Processos e Estratégias'],
        modalidadesMaisUtilizadas: [
          { modalidade: 'Funcional', count: 8, percentage: 100 },
          { modalidade: 'API', count: 6, percentage: 75 },
          { modalidade: 'Unitário', count: 4, percentage: 50 },
          { modalidade: 'Performance', count: 3, percentage: 37.5 }
        ]
      }
    },
    status: 'active' as const
  },
  // InnovateTech Solutions com dados individuais
  {
    id: 'innovatetech-mock-example',
    companyId: 'comp2',
    companyName: 'InnovateTech Solutions',
    companySector: 'Consultoria',
    version: 1,
    createdAt: new Date('2024-02-20'),
    totalUsers: 5,
    validUsers: 5,
    importResults: {
      totalUsers: 5,
      validUsers: 5,
      invalidUsers: 0,
      errors: [],
      warnings: [],
      data: [
        {
          userID: 'inno001',
          email: 'marcos.silva@innovatetech.com',
          nome: 'Marcos Silva',
          companhia: 'InnovateTech Solutions',
          ecossistema: 'Consultoria',
          timeDedicado: 'Sim',
          quantidadePessoas: '8 pessoas (3 SR, 3 PL, 2 JR)',
          areaPertenente: 'QA Manager',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 4.5,
            'Testes Automatizados': 3.8,
            'Métricas': 4.2,
            'Documentações': 3.1,
            'Modalidades de Testes': 4.7,
            'QAOPS': 4.3,
            'Liderança': 4.9
          },
          forcas: ['Liderança', 'Modalidades de Testes', 'QAOPS'],
          fraquezas: ['Documentações'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance', 'Segurança', 'Acessibilidade']
        },
        {
          userID: 'inno002',
          email: 'juliana.costa@innovatetech.com',
          nome: 'Juliana Costa',
          companhia: 'InnovateTech Solutions',
          ecossistema: 'Consultoria',
          timeDedicado: 'Sim',
          quantidadePessoas: '8 pessoas (3 SR, 3 PL, 2 JR)',
          areaPertenente: 'Senior QA Engineer',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 4.2,
            'Testes Automatizados': 4.1,
            'Métricas': 3.8,
            'Documentações': 2.9,
            'Modalidades de Testes': 4.3,
            'QAOPS': 4.1,
            'Liderança': 4.6
          },
          forcas: ['Liderança', 'Modalidades de Testes', 'Testes Automatizados'],
          fraquezas: ['Documentações'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance', 'Segurança']
        },
        {
          userID: 'inno003',
          email: 'rodrigo.santos@innovatetech.com',
          nome: 'Rodrigo Santos',
          companhia: 'InnovateTech Solutions',
          ecossistema: 'Consultoria',
          timeDedicado: 'Sim',
          quantidadePessoas: '8 pessoas (3 SR, 3 PL, 2 JR)',
          areaPertenente: 'QA Automation Lead',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.9,
            'Testes Automatizados': 4.5,
            'Métricas': 3.4,
            'Documentações': 2.6,
            'Modalidades de Testes': 4.1,
            'QAOPS': 4.2,
            'Liderança': 4.8
          },
          forcas: ['Liderança', 'Testes Automatizados', 'QAOPS'],
          fraquezas: ['Documentações'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário', 'Performance']
        },
        {
          userID: 'inno004',
          email: 'carolina.ferreira@innovatetech.com',
          nome: 'Carolina Ferreira',
          companhia: 'InnovateTech Solutions',
          ecossistema: 'Consultoria',
          timeDedicado: 'Sim',
          quantidadePessoas: '8 pessoas (3 SR, 3 PL, 2 JR)',
          areaPertenente: 'QA Analyst',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 3.8,
            'Testes Automatizados': 2.1,
            'Métricas': 3.6,
            'Documentações': 2.7,
            'Modalidades de Testes': 3.9,
            'QAOPS': 3.4,
            'Liderança': 4.7
          },
          forcas: ['Liderança'],
          fraquezas: ['Testes Automatizados', 'Documentações'],
          modalidadesTestes: ['Funcional', 'API']
        },
        {
          userID: 'inno005',
          email: 'gustavo.oliveira@innovatetech.com',
          nome: 'Gustavo Oliveira',
          companhia: 'InnovateTech Solutions',
          ecossistema: 'Consultoria',
          timeDedicado: 'Sim',
          quantidadePessoas: '8 pessoas (3 SR, 3 PL, 2 JR)',
          areaPertenente: 'QA Tester',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 4.1,
            'Testes Automatizados': 1.5,
            'Métricas': 3.5,
            'Documentações': 2.9,
            'Modalidades de Testes': 4.0,
            'QAOPS': 3.6,
            'Liderança': 4.9
          },
          forcas: ['Liderança', 'Modalidades de Testes'],
          fraquezas: ['Testes Automatizados'],
          modalidadesTestes: ['Funcional', 'API', 'Unitário']
        }
      ],
      consolidatedData: {
        totalRespondents: 5,
        mediaGeralPorPilar: {
          'Processos e Estratégias': 4.1,
          'Testes Automatizados': 3.2,
          'Métricas': 3.7,
          'Documentações': 2.8,
          'Modalidades de Testes': 4.2,
          'QAOPS': 3.9,
          'Liderança': 4.8
        },
        distribuicaoRespostas: {},
        principaisDesafios: ['Documentações', 'Testes Automatizados'],
        principaisForcas: ['Liderança', 'Modalidades de Testes', 'Processos e Estratégias', 'QAOps'],
        modalidadesMaisUtilizadas: [
          { modalidade: 'Funcional', count: 5, percentage: 100 },
          { modalidade: 'API', count: 5, percentage: 100 },
          { modalidade: 'Unitário', count: 4, percentage: 80 },
          { modalidade: 'Performance', count: 3, percentage: 60 }
        ]
      }
    },
    status: 'active' as const
  },
  // Digital Labs Inc com dados individuais
  {
    id: 'digitallabs-mock-example',
    companyId: 'comp3',
    companyName: 'Digital Labs Inc',
    companySector: 'Software',
    version: 1,
    createdAt: new Date('2024-03-10'),
    totalUsers: 3,
    validUsers: 3,
    importResults: {
      totalUsers: 3,
      validUsers: 3,
      invalidUsers: 0,
      errors: [],
      warnings: [],
      data: [
        {
          userID: 'digi001',
          email: 'thiago.rocha@digitallabs.com',
          nome: 'Thiago Rocha',
          companhia: 'Digital Labs Inc',
          ecossistema: 'Software',
          timeDedicado: 'Não',
          quantidadePessoas: 'N/A',
          areaPertenente: 'Desenvolvedor Full Stack',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 2.8,
            'Testes Automatizados': 1.9,
            'Métricas': 2.3,
            'Documentações': 2.1,
            'Modalidades de Testes': 3.2,
            'QAOPS': 1.8,
            'Liderança': 3.5
          },
          forcas: ['Liderança'],
          fraquezas: ['QAOPS', 'Testes Automatizados', 'Documentações'],
          modalidadesTestes: ['Funcional']
        },
        {
          userID: 'digi002',
          email: 'isabela.cunha@digitallabs.com',
          nome: 'Isabela Cunha',
          companhia: 'Digital Labs Inc',
          ecossistema: 'Software',
          timeDedicado: 'Não',
          quantidadePessoas: 'N/A',
          areaPertenente: 'Product Owner',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 2.1,
            'Testes Automatizados': 0.8,
            'Métricas': 1.9,
            'Documentações': 1.7,
            'Modalidades de Testes': 2.8,
            'QAOPS': 1.4,
            'Liderança': 2.9
          },
          forcas: [],
          fraquezas: ['Testes Automatizados', 'QAOPS', 'Documentações', 'Métricas'],
          modalidadesTestes: ['Funcional']
        },
        {
          userID: 'digi003',
          email: 'daniel.martins@digitallabs.com',
          nome: 'Daniel Martins',
          companhia: 'Digital Labs Inc',
          ecossistema: 'Software',
          timeDedicado: 'Não',
          quantidadePessoas: 'N/A',
          areaPertenente: 'Tech Lead',
          respostas: {},
          respostasPorPilar: {},
          mediasPorPilar: {
            'Processos e Estratégias': 2.0,
            'Testes Automatizados': 0.9,
            'Métricas': 2.1,
            'Documentações': 1.6,
            'Modalidades de Testes': 2.7,
            'QAOPS': 1.3,
            'Liderança': 3.2
          },
          forcas: ['Liderança'],
          fraquezas: ['Testes Automatizados', 'QAOPS', 'Documentações'],
          modalidadesTestes: ['Funcional', 'API']
        }
      ],
      consolidatedData: {
        totalRespondents: 3,
        mediaGeralPorPilar: {
          'Processos e Estratégias': 2.3,
          'Testes Automatizados': 1.2,
          'Métricas': 2.1,
          'Documentações': 1.8,
          'Modalidades de Testes': 2.9,
          'QAOPS': 1.5,
          'Liderança': 3.2
        },
        distribuicaoRespostas: {},
        principaisDesafios: ['Testes Automatizados', 'QAOps', 'Documentações', 'Métricas'],
        principaisForcas: ['Liderança'],
        modalidadesMaisUtilizadas: [
          { modalidade: 'Funcional', count: 3, percentage: 100 },
          { modalidade: 'API', count: 1, percentage: 33 }
        ]
      }
    },
    status: 'active' as const
  }
];