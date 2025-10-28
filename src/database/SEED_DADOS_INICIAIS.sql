-- ============================================
-- SEED: POPULAR BANCO COM DADOS DEMO
-- ============================================

-- 🏢 1️⃣ CRIAR EMPRESA DEMO
INSERT INTO companies (id, name, created_at, updated_at)
VALUES (
  'demo-company-uuid-12345',
  'Demo Company',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 👤 2️⃣ CRIAR USUÁRIOS DEMO
-- Manager (System Admin)
INSERT INTO users (id, email, name, role, company_id, created_at, updated_at)
VALUES (
  'manager-uuid-11111',
  'admin@qualitymap.app',
  'System Manager',
  'manager',
  NULL, -- Manager não tem empresa específica
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Leader (Líder da Empresa)
INSERT INTO users (id, email, name, role, company_id, created_at, updated_at)
VALUES (
  'leader-uuid-22222',
  'leader@demo.com',
  'Líder da Empresa',
  'leader',
  'demo-company-uuid-12345',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Member (Membro da Equipe)
INSERT INTO users (id, email, name, role, company_id, created_at, updated_at)
VALUES (
  'member-uuid-33333',
  'member@demo.com',
  'Membro da Equipe',
  'member',
  'demo-company-uuid-12345',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ✅ VERIFICAR SE FOI CRIADO
SELECT 
  '✅ SEED COMPLETO!' as status,
  (SELECT COUNT(*) FROM companies) as total_empresas,
  (SELECT COUNT(*) FROM users) as total_usuarios;
