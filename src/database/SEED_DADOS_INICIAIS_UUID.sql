-- ============================================
-- SEED: POPULAR BANCO COM DADOS DEMO (UUIDs reais)
-- ============================================

-- 🏢 1️⃣ CRIAR EMPRESA DEMO
INSERT INTO companies (name, created_at, updated_at)
VALUES (
  'Demo Company',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING
RETURNING id, name;

-- 👤 2️⃣ CRIAR USUÁRIOS DEMO

-- Manager (System Admin)
INSERT INTO users (email, name, role, company_id, created_at, updated_at)
VALUES (
  'admin@qualitymap.app',
  'System Manager',
  'manager',
  NULL, -- Manager não tem empresa específica
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
RETURNING id, email, name, role;

-- Leader (Líder da Empresa)
-- Precisa pegar o ID da empresa criada acima
DO $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Buscar ID da empresa Demo
  SELECT id INTO v_company_id FROM companies WHERE name = 'Demo Company' LIMIT 1;
  
  -- Criar Leader
  INSERT INTO users (email, name, role, company_id, created_at, updated_at)
  VALUES (
    'leader@demo.com',
    'Líder da Empresa',
    'leader',
    v_company_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET company_id = v_company_id, updated_at = NOW();
  
  -- Criar Member
  INSERT INTO users (email, name, role, company_id, created_at, updated_at)
  VALUES (
    'member@demo.com',
    'Membro da Equipe',
    'member',
    v_company_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET company_id = v_company_id, updated_at = NOW();
END $$;

-- ✅ VERIFICAR SE FOI CRIADO
SELECT 
  '✅ SEED COMPLETO!' as status,
  (SELECT COUNT(*) FROM companies) as total_empresas,
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM users WHERE role = 'manager') as managers,
  (SELECT COUNT(*) FROM users WHERE role = 'leader') as leaders,
  (SELECT COUNT(*) FROM users WHERE role = 'member') as members;
