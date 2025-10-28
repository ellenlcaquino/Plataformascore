import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DatabaseSetup() {
  const [checking, setChecking] = useState(true);
  const [tablesStatus, setTablesStatus] = useState<{
    users: boolean;
    companies: boolean;
    rodadas: boolean;
    assessments: boolean;
  }>({
    users: false,
    companies: false,
    rodadas: false,
    assessments: false,
  });
  const [allTablesExist, setAllTablesExist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    setChecking(true);
    setError(null);

    try {
      // Tentar buscar de cada tabela para verificar se existem
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2b631963`;

      // Check users
      const usersResponse = await fetch(`${baseUrl}/users`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const usersOk = usersResponse.ok;

      // Check companies
      const companiesResponse = await fetch(`${baseUrl}/companies`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const companiesOk = companiesResponse.ok;

      // Check rodadas
      const rodadasResponse = await fetch(`${baseUrl}/rodadas`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const rodadasOk = rodadasResponse.ok;

      // Check assessments
      const assessmentsResponse = await fetch(`${baseUrl}/assessments`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const assessmentsOk = assessmentsResponse.ok;

      const newStatus = {
        users: usersOk,
        companies: companiesOk,
        rodadas: rodadasOk,
        assessments: assessmentsOk,
      };

      setTablesStatus(newStatus);
      setAllTablesExist(Object.values(newStatus).every(v => v));

    } catch (err: any) {
      console.error('Erro ao verificar banco:', err);
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const copySchemaPath = () => {
    navigator.clipboard.writeText('/database/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSupabase = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/sql/new`, '_blank');
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando banco de dados...</p>
        </div>
      </div>
    );
  }

  if (allTablesExist) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <CardTitle>Banco de Dados Configurado</CardTitle>
          </div>
          <CardDescription>
            Todas as tabelas necessárias foram criadas com sucesso!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Tudo pronto!</AlertTitle>
            <AlertDescription>
              O sistema está funcionando corretamente. Você pode usar todas as funcionalidades.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(tablesStatus).map(([table, exists]) => (
              <div key={table} className="flex items-center gap-2 p-2 bg-muted rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{table}</span>
              </div>
            ))}
          </div>

          <Button onClick={checkDatabase} variant="outline" className="w-full">
            Verificar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <CardTitle>Configuração do Banco de Dados Necessária</CardTitle>
          </div>
          <CardDescription>
            Algumas tabelas do banco de dados ainda não foram criadas. Siga os passos abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status das tabelas */}
          <div>
            <h3 className="font-medium mb-3">Status das Tabelas:</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(tablesStatus).map(([table, exists]) => (
                <div key={table} className="flex items-center gap-2 p-2 bg-muted rounded">
                  {exists ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{table}</span>
                  <Badge variant={exists ? "default" : "destructive"} className="ml-auto">
                    {exists ? "OK" : "Faltando"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Instruções */}
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>Como Resolver</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p>Execute o schema SQL no Supabase Dashboard:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Acesse o Supabase SQL Editor (botão abaixo)</li>
                <li>Copie o arquivo <code className="bg-muted px-1 py-0.5 rounded">/database/schema.sql</code></li>
                <li>Cole no SQL Editor e clique em "RUN"</li>
                <li>Aguarde 30-60 segundos</li>
                <li>Volte aqui e clique em "Verificar Novamente"</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Ações */}
          <div className="space-y-2">
            <Button onClick={openSupabase} className="w-full" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Supabase SQL Editor
            </Button>

            <Button onClick={copySchemaPath} variant="outline" className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copiado!' : 'Copiar Caminho do Schema'}
            </Button>

            <Button onClick={checkDatabase} variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Verificar Novamente
            </Button>
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Link para documentação */}
          <div className="text-sm text-muted-foreground text-center pt-4 border-t">
            <p>
              Precisa de ajuda? Leia o guia completo em{' '}
              <code className="bg-muted px-1 py-0.5 rounded">/SOLUCAO_RAPIDA.md</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card com o SQL para copiar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atalho: SQL Rápido</CardTitle>
          <CardDescription>
            Se preferir, copie e execute este SQL diretamente (versão mínima):
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`-- Tabela users (ESSENCIAL)
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
  status TEXT DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela assessment_answers
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  pilar_id INTEGER NOT NULL CHECK (pilar_id >= 1 AND pilar_id <= 7),
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_assessment_question UNIQUE(assessment_id, question_id)
);`}
          </pre>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(document.querySelector('pre')?.textContent || '');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            variant="outline"
            className="w-full mt-4"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'SQL Copiado!' : 'Copiar SQL'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
