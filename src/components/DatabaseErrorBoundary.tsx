import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { projectId } from '../utils/supabase/info';

interface DatabaseErrorBoundaryProps {
  error: string;
  onRetry: () => void;
}

export function DatabaseErrorBoundary({ error, onRetry }: DatabaseErrorBoundaryProps) {
  const [copied, setCopied] = useState(false);

  const isUsersTableError = error.includes('users') || 
                            error.includes('relation') || 
                            error.includes('table') ||
                            error.includes('schema cache');

  const copySQL = () => {
    const sql = `-- Execute este SQL no Supabase SQL Editor
-- Isso vai criar a tabela users necessária

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('manager', 'leader', 'member')) DEFAULT 'member',
  company_id UUID,
  has_logged_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Tabela companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  status TEXT DEFAULT 'active',
  leader_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela assessments  
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rodada_id UUID,
  company_id UUID REFERENCES companies(id),
  versao_id TEXT NOT NULL,
  overall_score DECIMAL(3, 1) DEFAULT 0.0,
  status TEXT CHECK (status IN ('draft', 'completed')) DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_rodada ON assessments(rodada_id);

-- Tabela assessment_answers
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  pilar_id INTEGER NOT NULL CHECK (pilar_id >= 1 AND pilar_id <= 7),
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_assessment_question UNIQUE(assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_pilar ON assessment_answers(pilar_id);`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSupabase = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/sql/new`, '_blank');
  };

  if (!isUsersTableError) {
    // Erro genérico
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-muted/50">
        <Card className="max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <CardTitle>Erro no Sistema</CardTitle>
            </div>
            <CardDescription>Ocorreu um erro ao carregar o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Detalhes do Erro</AlertTitle>
              <AlertDescription className="font-mono text-xs mt-2 whitespace-pre-wrap">
                {error}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Erro específico de tabela users
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/50">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <CardTitle>Banco de Dados Não Configurado</CardTitle>
          </div>
          <CardDescription>
            A tabela "users" não foi encontrada no banco de dados. Execute o schema SQL para criar as tabelas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Erro técnico */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro Técnico</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-2">
              {error}
            </AlertDescription>
          </Alert>

          {/* Solução */}
          <div className="space-y-4">
            <h3 className="font-semibold">✅ Solução Rápida (3 minutos):</h3>
            
            <ol className="space-y-3 pl-4">
              <li className="flex gap-2">
                <span className="font-semibold min-w-[24px]">1.</span>
                <span>
                  Clique no botão abaixo para abrir o Supabase SQL Editor:
                  <Button onClick={openSupabase} className="w-full mt-2" variant="default">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Supabase SQL Editor
                  </Button>
                </span>
              </li>

              <li className="flex gap-2">
                <span className="font-semibold min-w-[24px]">2.</span>
                <span>
                  Copie o SQL necessário:
                  <Button onClick={copySQL} className="w-full mt-2" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? '✅ SQL Copiado!' : 'Copiar SQL'}
                  </Button>
                </span>
              </li>

              <li className="flex gap-2">
                <span className="font-semibold min-w-[24px]">3.</span>
                <span>Cole o SQL no editor e clique em <code className="bg-muted px-1 py-0.5 rounded">RUN</code></span>
              </li>

              <li className="flex gap-2">
                <span className="font-semibold min-w-[24px]">4.</span>
                <span>Aguarde 30-60 segundos até a execução completar</span>
              </li>

              <li className="flex gap-2">
                <span className="font-semibold min-w-[24px]">5.</span>
                <span>
                  Volte aqui e clique em:
                  <Button onClick={onRetry} className="w-full mt-2" variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </span>
              </li>
            </ol>
          </div>

          {/* Alternativa */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Alternativa:</strong> Execute o arquivo completo{' '}
              <code className="bg-muted px-1 py-0.5 rounded">/database/schema.sql</code>
              {' '}no Supabase SQL Editor para criar TODAS as tabelas de uma vez.
            </p>
          </div>

          {/* Documentação */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              📚 <strong>Precisa de mais ajuda?</strong> Leia os guias:
            </p>
            <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/SOLUCAO_RAPIDA.md</code> - Solução em 3 minutos</li>
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/PASSO_A_PASSO_VISUAL.md</code> - Guia completo</li>
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/COMECE_AQUI.md</code> - Índice de todos os guias</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
