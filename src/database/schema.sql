-- ============================================
-- QualityMap App - Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS (Usuários do Sistema)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('manager', 'leader', 'member')) DEFAULT 'member',
  company_id UUID,
  has_logged_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Comentários
COMMENT ON TABLE users IS 'Usuários do sistema (managers, leaders, members)';
COMMENT ON COLUMN users.email IS 'Email único do usuário (usado para login)';
COMMENT ON COLUMN users.role IS 'manager = admin global | leader = líder de empresa | member = membro';

-- ============================================
-- 2. COMPANIES (Empresas Multi-Tenant)
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  leader_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_leader ON companies(leader_id);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);

-- Comentários
COMMENT ON TABLE companies IS 'Empresas cadastradas no sistema (multi-tenant)';
COMMENT ON COLUMN companies.primary_color IS 'Cor primária para whitelabel (hex)';
COMMENT ON COLUMN companies.status IS 'Status: active ou inactive';

-- Foreign key from users to companies
ALTER TABLE users ADD CONSTRAINT fk_users_company 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- ============================================
-- 3. RODADAS (Ciclos de Avaliação)
-- ============================================

CREATE TABLE IF NOT EXISTS rodadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('rascunho', 'ativa', 'encerrada')) DEFAULT 'ativa',
  criterio_encerramento TEXT CHECK (criterio_encerramento IN ('manual', 'automatico')) DEFAULT 'manual',
  due_date TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  encerrado_em TIMESTAMPTZ,
  resultado_gerado BOOLEAN DEFAULT FALSE,
  resultado_id UUID,
  resultado_gerado_em TIMESTAMPTZ,
  
  CONSTRAINT unique_company_versao UNIQUE(company_id, versao_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_rodadas_company ON rodadas(company_id);
CREATE INDEX IF NOT EXISTS idx_rodadas_status ON rodadas(status);
CREATE INDEX IF NOT EXISTS idx_rodadas_versao ON rodadas(versao_id);
CREATE INDEX IF NOT EXISTS idx_rodadas_created_at ON rodadas(created_at DESC);

-- Comentários
COMMENT ON TABLE rodadas IS 'Rodadas de avaliação QualityScore';
COMMENT ON COLUMN rodadas.versao_id IS 'Formato: V{ANO}.{MES}.{SEQUENCIAL} (ex: V2024.01.001)';
COMMENT ON COLUMN rodadas.criterio_encerramento IS 'manual = manager decide | automatico = 100% conclusão';

-- ============================================
-- 4. RODADA_PARTICIPANTES
-- ============================================

CREATE TABLE IF NOT EXISTS rodada_participantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pendente', 'respondendo', 'concluido', 'atrasado')) DEFAULT 'pendente',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  can_view_results BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_rodada_user UNIQUE(rodada_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_participantes_rodada ON rodada_participantes(rodada_id);
CREATE INDEX IF NOT EXISTS idx_participantes_user ON rodada_participantes(user_id);
CREATE INDEX IF NOT EXISTS idx_participantes_status ON rodada_participantes(status);
CREATE INDEX IF NOT EXISTS idx_participantes_progress ON rodada_participantes(progress);

-- Comentários
COMMENT ON TABLE rodada_participantes IS 'Participantes de cada rodada';
COMMENT ON COLUMN rodada_participantes.progress IS 'Progresso de 0 a 100%';
COMMENT ON COLUMN rodada_participantes.can_view_results IS 'Permissão para visualizar resultados da rodada';

-- ============================================
-- 5. ASSESSMENTS (Avaliações/Formulários)
-- ============================================

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rodada_id UUID REFERENCES rodadas(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  overall_score DECIMAL(3, 1) DEFAULT 0.0 CHECK (overall_score >= 0 AND overall_score <= 5),
  status TEXT CHECK (status IN ('draft', 'completed')) DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_rodada ON assessments(rodada_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_company ON assessments(company_id);
CREATE INDEX IF NOT EXISTS idx_assessments_versao ON assessments(versao_id);

-- Comentários
COMMENT ON TABLE assessments IS 'Avaliações QualityScore (formulário de 91 perguntas)';
COMMENT ON COLUMN assessments.overall_score IS 'Score geral: 0.0 a 5.0';
COMMENT ON COLUMN assessments.status IS 'draft = em andamento | completed = finalizado';
COMMENT ON COLUMN assessments.rodada_id IS 'Pode ser NULL para avaliações individuais';

-- ============================================
-- 6. ASSESSMENT_ANSWERS (Respostas)
-- ============================================

CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  pilar_id INTEGER NOT NULL CHECK (pilar_id >= 1 AND pilar_id <= 7),
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_assessment_question UNIQUE(assessment_id, question_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_pilar ON assessment_answers(pilar_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON assessment_answers(question_id);

-- Comentários
COMMENT ON TABLE assessment_answers IS 'Respostas individuais das 91 perguntas';
COMMENT ON COLUMN assessment_answers.pilar_id IS '1-7: Processos, Testes Auto, Métricas, Docs, Modal. Testes, QAOps, Liderança';
COMMENT ON COLUMN assessment_answers.value IS 'Valor de 0 a 5 (níveis de maturidade)';
COMMENT ON COLUMN assessment_answers.question_id IS 'Ex: p1_q1, p2_q5, etc.';

-- ============================================
-- 7. RESULTS (Resultados Calculados)
-- ============================================

CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  versao_id TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('parcial', 'final')) DEFAULT 'final',
  total_participantes INTEGER NOT NULL DEFAULT 0,
  participantes_incluidos INTEGER NOT NULL DEFAULT 0,
  overall_score DECIMAL(3, 1) CHECK (overall_score >= 0 AND overall_score <= 5),
  pilar_scores JSONB,
  metadata JSONB,
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_results_rodada ON results(rodada_id);
CREATE INDEX IF NOT EXISTS idx_results_versao ON results(versao_id);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at DESC);

-- Índice GIN para busca em JSONB
CREATE INDEX IF NOT EXISTS idx_results_pilar_scores ON results USING GIN (pilar_scores);
CREATE INDEX IF NOT EXISTS idx_results_metadata ON results USING GIN (metadata);

-- Comentários
COMMENT ON TABLE results IS 'Resultados calculados agregados de cada rodada (permite múltiplos resultados parciais)';
COMMENT ON COLUMN results.tipo IS 'parcial = resultado parcial | final = resultado final';
COMMENT ON COLUMN results.total_participantes IS 'Total de participantes da rodada';
COMMENT ON COLUMN results.participantes_incluidos IS 'Quantos participantes foram incluídos neste resultado';
COMMENT ON COLUMN results.pilar_scores IS 'JSON array com score de cada pilar';
COMMENT ON COLUMN results.metadata IS 'JSON com metadados (detalhes por participante, etc.)';

-- ============================================
-- 8. PUBLIC_SHARES (Compartilhamentos Públicos)
-- ============================================

CREATE TABLE IF NOT EXISTS public_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT UNIQUE NOT NULL,
  rodada_id UUID NOT NULL REFERENCES rodadas(id) ON DELETE CASCADE,
  result_id UUID NOT NULL REFERENCES results(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_shares_share_id ON public_shares(share_id);
CREATE INDEX IF NOT EXISTS idx_shares_rodada ON public_shares(rodada_id);
CREATE INDEX IF NOT EXISTS idx_shares_result ON public_shares(result_id);
CREATE INDEX IF NOT EXISTS idx_shares_active ON public_shares(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_shares_created_by ON public_shares(created_by);

-- Comentários
COMMENT ON TABLE public_shares IS 'Links públicos de compartilhamento de resultados';
COMMENT ON COLUMN public_shares.share_id IS 'ID curto para URL (ex: abc123xy)';
COMMENT ON COLUMN public_shares.expires_at IS 'NULL = sem expiração';
COMMENT ON COLUMN public_shares.views IS 'Contador de visualizações';

-- ============================================
-- TRIGGERS (Atualização automática de updated_at)
-- ============================================

-- Função genérica para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para rodadas
DROP TRIGGER IF EXISTS update_rodadas_updated_at ON rodadas;
CREATE TRIGGER update_rodadas_updated_at 
  BEFORE UPDATE ON rodadas 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para rodada_participantes
DROP TRIGGER IF EXISTS update_participantes_updated_at ON rodada_participantes;
CREATE TRIGGER update_participantes_updated_at 
  BEFORE UPDATE ON rodada_participantes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para assessments
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at 
  BEFORE UPDATE ON assessments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para assessment_answers
DROP TRIGGER IF EXISTS update_answers_updated_at ON assessment_answers;
CREATE TRIGGER update_answers_updated_at 
  BEFORE UPDATE ON assessment_answers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para results
DROP TRIGGER IF EXISTS update_results_updated_at ON results;
CREATE TRIGGER update_results_updated_at 
  BEFORE UPDATE ON results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para public_shares
DROP TRIGGER IF EXISTS update_shares_updated_at ON public_shares;
CREATE TRIGGER update_shares_updated_at 
  BEFORE UPDATE ON public_shares 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Exemplo Básico
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE rodada_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_shares ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir tudo para authenticated users
-- (Ajustar conforme necessário para seu modelo de autenticação)

CREATE POLICY "Allow authenticated users" ON users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON rodadas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON rodada_participantes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON assessments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON assessment_answers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON results
  FOR ALL USING (auth.role() = 'authenticated');

-- Public shares: permitir leitura pública se ativo e não expirado
CREATE POLICY "Allow public read for active shares" ON public_shares
  FOR SELECT USING (
    is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Allow authenticated insert/update/delete" ON public_shares
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- VIEWS (Visões úteis)
-- ============================================

-- View: Rodadas com estatísticas agregadas
CREATE OR REPLACE VIEW v_rodadas_stats AS
SELECT 
  r.id,
  r.company_id,
  r.versao_id,
  r.status,
  r.due_date,
  r.created_at,
  COUNT(rp.id) AS total_participantes,
  COUNT(CASE WHEN rp.status = 'concluido' THEN 1 END) AS respostas_completas,
  COUNT(CASE WHEN rp.status = 'respondendo' THEN 1 END) AS respostas_em_progresso,
  COUNT(CASE WHEN rp.status = 'pendente' THEN 1 END) AS respostas_pendentes,
  COUNT(CASE WHEN rp.status = 'atrasado' THEN 1 END) AS atrasados,
  ROUND(AVG(rp.progress), 0) AS progresso_geral,
  COUNT(CASE WHEN rp.can_view_results = TRUE THEN 1 END) AS participantes_com_acesso
FROM rodadas r
LEFT JOIN rodada_participantes rp ON rp.rodada_id = r.id
GROUP BY r.id;

COMMENT ON VIEW v_rodadas_stats IS 'View com estatísticas agregadas de cada rodada';

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função: Gerar próximo versao_id para uma empresa
CREATE OR REPLACE FUNCTION generate_next_versao_id(p_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_month TEXT;
  v_sequential INTEGER;
  v_versao_id TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_month := TO_CHAR(NOW(), 'MM');
  
  -- Buscar último sequencial do mês
  SELECT COALESCE(
    MAX(CAST(SPLIT_PART(versao_id, '.', 3) AS INTEGER)),
    0
  ) INTO v_sequential
  FROM rodadas
  WHERE company_id = p_company_id
    AND versao_id LIKE 'V' || v_year || '.' || v_month || '.%';
  
  -- Incrementar
  v_sequential := v_sequential + 1;
  
  -- Formatar
  v_versao_id := 'V' || v_year || '.' || v_month || '.' || LPAD(v_sequential::TEXT, 3, '0');
  
  RETURN v_versao_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_next_versao_id IS 'Gera próximo versao_id no formato V{ANO}.{MES}.{SEQ}';

-- ============================================
-- DADOS DE EXEMPLO - REMOVIDOS
-- ============================================

-- Sistema usa apenas dados reais do banco de dados
-- Nenhum dado mockado é inserido automaticamente

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Verificar tabelas criadas
SELECT 
  tablename, 
  schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users',
    'companies', 
    'rodadas', 
    'rodada_participantes', 
    'assessments', 
    'assessment_answers', 
    'results', 
    'public_shares'
  )
ORDER BY tablename;

-- Sucesso!
SELECT 'QualityMap Database Schema criado com sucesso! ✅' AS status;
