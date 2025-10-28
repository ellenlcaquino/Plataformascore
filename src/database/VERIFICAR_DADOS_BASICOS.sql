-- ============================================
-- VERIFICAR SE HÁ DADOS NAS TABELAS
-- ============================================

-- 1️⃣ QUANTAS EMPRESAS EXISTEM?
SELECT 
  '🏢 COMPANIES' as tabela,
  COUNT(*) as total,
  STRING_AGG(name, ', ') as empresas
FROM companies;

-- 2️⃣ QUANTOS USUÁRIOS EXISTEM?
SELECT 
  '👤 USERS' as tabela,
  COUNT(*) as total,
  STRING_AGG(COALESCE(name, email), ', ') as usuarios
FROM users;

-- 3️⃣ QUANTAS RODADAS EXISTEM?
SELECT 
  '🎯 RODADAS' as tabela,
  COUNT(*) as total
FROM rodadas;

-- 4️⃣ QUANTOS PARTICIPANTES EXISTEM?
SELECT 
  '👥 PARTICIPANTES' as tabela,
  COUNT(*) as total
FROM rodada_participantes;

-- 5️⃣ QUANTOS ASSESSMENTS EXISTEM?
SELECT 
  '📝 ASSESSMENTS' as tabela,
  COUNT(*) as total
FROM assessments;
