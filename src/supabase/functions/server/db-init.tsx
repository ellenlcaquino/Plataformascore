// Database initialization script
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

export async function initializeDatabase() {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  console.log('🔍 Checking database schema...');

  try {
    // Check if tables exist by trying to select from them
    const { error: rodadasError } = await supabase
      .from('rodadas')
      .select('id')
      .limit(1);

    if (rodadasError) {
      console.log('⚠️ Tables not found. Creating schema...');
      await createSchema(supabase);
    } else {
      console.log('✅ Database schema already exists');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
    // Try to create schema anyway
    await createSchema(supabase);
  }
}

async function createSchema(supabase: any) {
  console.log('🏗️ Creating database schema...');

  // Create users table
  const usersSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK (role IN ('manager', 'leader', 'member')) DEFAULT 'member',
      company_id UUID,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `;

  // Create companies table
  const companiesSQL = `
    CREATE TABLE IF NOT EXISTS companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      domain TEXT UNIQUE NOT NULL,
      logo_url TEXT,
      primary_color TEXT DEFAULT '#2563eb',
      status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
      leader_id UUID REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
    CREATE INDEX IF NOT EXISTS idx_companies_leader ON companies(leader_id);
    CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
  `;

  // Create rodadas table
  const rodadasSQL = `
    CREATE TABLE IF NOT EXISTS rodadas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      versao_id TEXT NOT NULL,
      status TEXT CHECK (status IN ('rascunho', 'ativa', 'encerrada')) DEFAULT 'ativa',
      criterio_encerramento TEXT CHECK (criterio_encerramento IN ('manual', 'automatico')) DEFAULT 'manual',
      due_date TIMESTAMPTZ NOT NULL,
      created_by UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      encerrado_em TIMESTAMPTZ,
      
      CONSTRAINT unique_company_versao UNIQUE(company_id, versao_id)
    );

    CREATE INDEX IF NOT EXISTS idx_rodadas_company ON rodadas(company_id);
    CREATE INDEX IF NOT EXISTS idx_rodadas_status ON rodadas(status);
    CREATE INDEX IF NOT EXISTS idx_rodadas_versao ON rodadas(versao_id);
    CREATE INDEX IF NOT EXISTS idx_rodadas_created_at ON rodadas(created_at DESC);
  `;

  // Create rodada_participantes table
  const participantesSQL = `
    CREATE TABLE IF NOT EXISTS rodada_participantes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

    CREATE INDEX IF NOT EXISTS idx_participantes_rodada ON rodada_participantes(rodada_id);
    CREATE INDEX IF NOT EXISTS idx_participantes_user ON rodada_participantes(user_id);
    CREATE INDEX IF NOT EXISTS idx_participantes_status ON rodada_participantes(status);
  `;

  // Create assessments table
  const assessmentsSQL = `
    CREATE TABLE IF NOT EXISTS assessments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

    CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_rodada ON assessments(rodada_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
  `;

  // Create assessment_answers table
  const answersSQL = `
    CREATE TABLE IF NOT EXISTS assessment_answers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      pilar_id INTEGER NOT NULL CHECK (pilar_id >= 1 AND pilar_id <= 7),
      value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      
      CONSTRAINT unique_assessment_question UNIQUE(assessment_id, question_id)
    );

    CREATE INDEX IF NOT EXISTS idx_answers_assessment ON assessment_answers(assessment_id);
    CREATE INDEX IF NOT EXISTS idx_answers_pilar ON assessment_answers(pilar_id);
  `;

  // Create function to generate versao_id
  const functionSQL = `
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
      
      SELECT COALESCE(
        MAX(CAST(SPLIT_PART(versao_id, '.', 3) AS INTEGER)),
        0
      ) INTO v_sequential
      FROM rodadas
      WHERE company_id = p_company_id
        AND versao_id LIKE 'V' || v_year || '.' || v_month || '.%';
      
      v_sequential := v_sequential + 1;
      
      v_versao_id := 'V' || v_year || '.' || v_month || '.' || LPAD(v_sequential::TEXT, 3, '0');
      
      RETURN v_versao_id;
    END;
    $$ LANGUAGE plpgsql;
  `;

  try {
    // Execute SQL using RPC calls - ordem importa devido às foreign keys
    console.log('Creating users table...');
    await supabase.rpc('exec_sql', { sql: usersSQL });
    
    console.log('Creating companies table...');
    await supabase.rpc('exec_sql', { sql: companiesSQL });
    
    console.log('Creating rodadas table...');
    await supabase.rpc('exec_sql', { sql: rodadasSQL });
    
    console.log('Creating participantes table...');
    await supabase.rpc('exec_sql', { sql: participantesSQL });
    
    console.log('Creating assessments table...');
    await supabase.rpc('exec_sql', { sql: assessmentsSQL });
    
    console.log('Creating answers table...');
    await supabase.rpc('exec_sql', { sql: answersSQL });
    
    console.log('Creating functions...');
    await supabase.rpc('exec_sql', { sql: functionSQL });
    
    console.log('✅ Database schema created successfully!');
  } catch (error) {
    console.error('❌ Error creating schema:', error);
    throw error;
  }
}
