import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContext';
import { Shield, Users, User, CheckCircle } from 'lucide-react';

export function PersonaSwitcher() {
  const { user, switchRole } = useAuth();

  const personas = [
    {
      role: 'manager',
      title: 'System Manager',
      description: 'Visão administrativa completa do sistema',
      icon: Shield,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      iconColor: 'text-purple-600',
      features: [
        'Gerenciar todas as empresas',
        'Criar e editar usuários',
        'Acessar cadastros do sistema',
        'Ver todas as avaliações',
        'Configurar sistema'
      ]
    },
    {
      role: 'leader',
      title: 'Líder da Empresa',
      description: 'Gestão da empresa e equipe',
      icon: Users,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      iconColor: 'text-blue-600',
      features: [
        'Gerenciar membros da empresa',
        'Visualizar progresso da equipe',
        'Acessar todas as rodadas',
        'Ver resultados completos',
        'Convidar novos membros'
      ]
    },
    {
      role: 'member',
      title: 'Membro da Equipe',
      description: 'Contribuir com avaliações',
      icon: User,
      color: 'bg-green-100 text-green-700 border-green-300',
      iconColor: 'text-green-600',
      features: [
        'Preencher formulários',
        'Ver próprio progresso',
        'Acessar dashboard básico',
        'Participar de avaliações',
        'Ver resultados da empresa'
      ]
    }
  ];

  const currentPersona = personas.find(p => p.role === user?.role);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl">Personas do Sistema</h2>
        <p className="text-muted-foreground">
          Visualize e alterne entre diferentes níveis de acesso
        </p>
      </div>

      {/* Current Persona */}
      <Card className={`border-2 ${currentPersona?.color}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPersona?.icon && (
                <div className={`p-3 rounded-lg ${currentPersona.color}`}>
                  <currentPersona.icon className={`h-6 w-6 ${currentPersona.iconColor}`} />
                </div>
              )}
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPersona?.title}
                  <Badge variant="outline" className={currentPersona?.color}>
                    Ativo
                  </Badge>
                </CardTitle>
                <CardDescription>{currentPersona?.description}</CardDescription>
              </div>
            </div>
            <CheckCircle className={`h-6 w-6 ${currentPersona?.iconColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="font-medium">Permissões Ativas:</div>
            <ul className="space-y-1.5">
              {currentPersona?.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentPersona.iconColor}`}></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* All Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isActive = user?.role === persona.role;
          
          return (
            <Card 
              key={persona.role} 
              className={`transition-all ${isActive ? `border-2 ${persona.color}` : 'hover:shadow-lg'}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 rounded-lg ${persona.color}`}>
                    <Icon className={`h-5 w-5 ${persona.iconColor}`} />
                  </div>
                  {isActive && (
                    <Badge variant="outline" className={persona.color}>
                      Ativo
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{persona.title}</CardTitle>
                <CardDescription className="text-sm">
                  {persona.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Permissões:</div>
                  <ul className="space-y-1">
                    {persona.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                        {feature}
                      </li>
                    ))}
                    {persona.features.length > 3 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{persona.features.length - 3} mais...
                      </li>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={() => switchRole(persona.role as 'manager' | 'leader' | 'member')}
                  disabled={isActive}
                  variant={isActive ? "secondary" : "outline"}
                  className="w-full"
                >
                  {isActive ? 'Persona Ativa' : 'Alternar para esta Persona'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Permissões</CardTitle>
          <CardDescription>
            Veja as diferenças entre os níveis de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Funcionalidade</th>
                  <th className="text-center py-3 px-4 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Manager
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Líder
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Membro
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Dashboard', manager: true, leader: true, member: true },
                  { name: 'Formulário QualityScore', manager: true, leader: true, member: true },
                  { name: 'Rodadas', manager: true, leader: true, member: false },
                  { name: 'Resultados', manager: true, leader: true, member: false },
                  { name: 'Importar Dados', manager: true, leader: true, member: false },
                  { name: 'Gerenciar Personas', manager: true, leader: true, member: false },
                  { name: 'Cadastros do Sistema', manager: true, leader: false, member: false },
                  { name: 'Demo Público', manager: true, leader: true, member: false },
                  { name: 'Ver Todas Empresas', manager: true, leader: false, member: false },
                  { name: 'Convidar Membros', manager: true, leader: true, member: false }
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{row.name}</td>
                    <td className="py-3 px-4 text-center">
                      {row.manager ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto rounded-full bg-muted"></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.leader ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto rounded-full bg-muted"></div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.member ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto rounded-full bg-muted"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">
                Como funciona o sistema de personas?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                O sistema possui três níveis de acesso que controlam o que cada usuário pode ver e fazer:
              </p>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span><strong>System Manager:</strong> Acesso total ao sistema, gerencia múltiplas empresas e configurações globais</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span><strong>Líder da Empresa:</strong> Gerencia sua empresa, convida membros e visualiza resultados da equipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span><strong>Membro da Equipe:</strong> Preenche avaliações e visualiza informações básicas</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
