import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface ReportViewProps {
  resultado: {
    id: string;
    rodada_id: string;
    company_id: string;
    versao_id: string;
    tipo: 'parcial' | 'final';
    total_participantes: number;
    participantes_incluidos: number;
    overall_score?: number;
    pilar_scores?: any;
    metadata?: any;
    generated_at: string;
    generated_by: string;
  };
  rodadaInfo?: {
    versaoId: string;
    companyName: string;
    dueDate: string;
    status: string;
  };
}

// Definir os pilares
const PILARES = [
  { id: 'processes', nome: 'Processos e Estratégias', color: '#3b82f6' },
  { id: 'automation', nome: 'Testes Automatizados', color: '#10b981' },
  { id: 'metrics', nome: 'Métricas', color: '#f59e0b' },
  { id: 'documentation', nome: 'Documentações', color: '#ef4444' },
  { id: 'testModalities', nome: 'Modalidades de Testes', color: '#8b5cf6' },
  { id: 'qaops', nome: 'QAOPS', color: '#06b6d4' },
  { id: 'leadership', nome: 'Liderança', color: '#84cc16' }
];

const getNivelMaturidade = (score: number) => {
  if (score < 1) return { nivel: 'Inicial', cor: 'text-red-600', bgCor: 'bg-red-100' };
  if (score < 2) return { nivel: 'Básico', cor: 'text-orange-600', bgCor: 'bg-orange-100' };
  if (score < 3) return { nivel: 'Intermediário', cor: 'text-yellow-600', bgCor: 'bg-yellow-100' };
  if (score < 4) return { nivel: 'Avançado', cor: 'text-blue-600', bgCor: 'bg-blue-100' };
  return { nivel: 'Excelente', cor: 'text-green-600', bgCor: 'bg-green-100' };
};

export function ReportView({ resultado, rodadaInfo }: ReportViewProps) {
  // Mock de dados dos pilares (em produção, viriam do resultado.pilar_scores)
  const pilaresData = PILARES.map(pilar => ({
    nome: pilar.nome,
    score: Math.random() * 5, // Placeholder - substituir com dados reais
    color: pilar.color
  }));

  const overallScore = resultado.overall_score || pilaresData.reduce((sum, p) => sum + p.score, 0) / pilaresData.length;
  const nivelMaturidade = getNivelMaturidade(overallScore);

  const dataFormatada = new Date(resultado.generated_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl mb-2">Report de Qualidade</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{rodadaInfo?.versaoId || resultado.versao_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Gerado em {dataFormatada}</span>
            </div>
            <Badge variant={resultado.tipo === 'final' ? 'default' : 'secondary'}>
              {resultado.tipo === 'final' ? 'Resultado Final' : 'Resultado Parcial'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </motion.div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Score Geral</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{overallScore.toFixed(1)}</div>
              <Badge className={`mt-2 ${nivelMaturidade.bgCor} ${nivelMaturidade.cor}`}>
                {nivelMaturidade.nivel}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {resultado.participantes_incluidos}/{resultado.total_participantes}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((resultado.participantes_incluidos / resultado.total_participantes) * 100)}% de participação
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {resultado.tipo === 'final' ? 'Completo' : 'Parcial'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {rodadaInfo?.status === 'encerrada' ? 'Rodada Encerrada' : 'Rodada Ativa'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Empresa</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg truncate">
                {rodadaInfo?.companyName || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {resultado.versao_id}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Scores por Pilar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Scores por Pilar</CardTitle>
              <CardDescription>Avaliação detalhada de cada pilar de qualidade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pilaresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nome" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {pilaresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Visão Radar</CardTitle>
              <CardDescription>Visão panorâmica de todos os pilares</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={pilaresData.map(p => ({ ...p, nome: p.nome.split(' ')[0] }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="nome" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detalhamento por Pilar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Pilar</CardTitle>
            <CardDescription>Score e nível de maturidade de cada pilar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pilaresData.map((pilar, index) => {
                const nivel = getNivelMaturidade(pilar.score);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: pilar.color }}
                        />
                        <span>{pilar.nome}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${nivel.bgCor} ${nivel.cor}`}>
                          {nivel.nivel}
                        </Badge>
                        <span className="font-mono w-12 text-right">
                          {pilar.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <Progress value={(pilar.score / 5) * 100} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informações Adicionais */}
      {resultado.tipo === 'parcial' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-900">Resultado Parcial</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800">
                Este é um resultado parcial com dados de{' '}
                <strong>{resultado.participantes_incluidos}</strong> de{' '}
                <strong>{resultado.total_participantes}</strong> participantes.
                Os resultados podem mudar quando mais participantes completarem a avaliação.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
