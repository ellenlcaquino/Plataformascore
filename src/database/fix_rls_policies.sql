-- ============================================
-- FIX: Políticas RLS para Service Role
-- ============================================
-- Execute este script DEPOIS do schema.sql
-- para garantir que o Service Role Key possa acessar as tabelas

-- Remover políticas restritivas existentes
DROP POLICY IF EXISTS "Allow authenticated users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow authenticated users" ON rodadas;
DROP POLICY IF EXISTS "Allow authenticated users" ON rodada_participantes;
DROP POLICY IF EXISTS "Allow authenticated users" ON assessments;
DROP POLICY IF EXISTS "Allow authenticated users" ON assessment_answers;
DROP POLICY IF EXISTS "Allow authenticated users" ON results;

-- ============================================
-- NOVA POLÍTICA: Permitir tudo para service_role
-- ============================================

-- USERS
CREATE POLICY "Enable all access for service role" ON users
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON users
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON users
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- COMPANIES
CREATE POLICY "Enable all access for service role" ON companies
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON companies
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON companies
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- RODADAS
CREATE POLICY "Enable all access for service role" ON rodadas
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON rodadas
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON rodadas
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- RODADA_PARTICIPANTES
CREATE POLICY "Enable all access for service role" ON rodada_participantes
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON rodada_participantes
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON rodada_participantes
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- ASSESSMENTS
CREATE POLICY "Enable all access for service role" ON assessments
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON assessments
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON assessments
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- ASSESSMENT_ANSWERS
CREATE POLICY "Enable all access for service role" ON assessment_answers
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON assessment_answers
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON assessment_answers
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- RESULTS
CREATE POLICY "Enable all access for service role" ON results
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated" ON results
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for anon" ON results
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- PUBLIC_SHARES (manter política original + adicionar service role)
CREATE POLICY "Enable all access for service role" ON public_shares
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'companies', 'rodadas', 'rodada_participantes',
    'assessments', 'assessment_answers', 'results', 'public_shares'
  )
ORDER BY tablename, policyname;

-- Sucesso!
SELECT '✅ Políticas RLS atualizadas com sucesso!' AS status;
