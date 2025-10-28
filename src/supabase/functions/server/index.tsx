import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2b631963/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// DATABASE INITIALIZATION ENDPOINT
// ============================================
app.post("/make-server-2b631963/init-database", async (c) => {
  try {
    console.log('🔧 Iniciando criação das tabelas do banco de dados...');
    
    // Criar tabela users primeiro (sem foreign keys)
    const createUsersTable = `
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
    `;
    
    console.log('📝 Criando tabela users...');
    const { error: usersError } = await supabase.rpc('exec_sql', { sql_query: createUsersTable });
    
    if (usersError) {
      console.log('⚠️ Não foi possível usar exec_sql. Tentando criar usuário manualmente...');
      // Se exec_sql não existir, tentar criar via INSERT
      const { error: testInsertError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (testInsertError && testInsertError.code === '42P01') {
        return c.json({
          success: false,
          error: 'Tabela users não existe e não foi possível criar automaticamente.',
          instructions: 'Por favor, execute o arquivo /database/schema.sql manualmente no Supabase SQL Editor.',
          steps: [
            '1. Acesse: https://supabase.com/dashboard',
            '2. Vá em SQL Editor',
            '3. Copie TODO o conteúdo de /database/schema.sql',
            '4. Cole no SQL Editor e clique em RUN',
            '5. Aguarde 30-60 segundos',
            '6. Recarregue esta página'
          ]
        }, 500);
      }
    }
    
    console.log('✅ Tabelas criadas ou já existem!');
    
    return c.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      note: 'Se ainda houver erros, execute /database/schema.sql manualmente no Supabase SQL Editor'
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco:', error);
    return c.json({
      success: false,
      error: error.message,
      instructions: 'Execute o arquivo /database/schema.sql manualmente no Supabase SQL Editor',
      steps: [
        '1. Acesse: https://supabase.com/dashboard',
        '2. Vá em SQL Editor',
        '3. Copie TODO o conteúdo de /database/schema.sql',
        '4. Cole no SQL Editor e clique em RUN',
        '5. Aguarde 30-60 segundos'
      ]
    }, 500);
  }
});

// ============================================
// COMPANIES ENDPOINTS
// ============================================

// Get all companies
app.get("/make-server-2b631963/companies", async (c) => {
  try {
    // Try SQL first
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        return c.json({ companies: data || [] });
      }
    } catch (sqlError) {
      console.log('SQL not available for companies, using KV');
    }

    // Fallback to KV store
    const entries = await kv.getByPrefix("companies:");

    return c.json({ companies: entries });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create company
app.post("/make-server-2b631963/companies", async (c) => {
  try {
    const body = await c.req.json();
    
    // Try SQL first
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: body.name,
          domain: body.domain,
          logo_url: body.logo_url,
          primary_color: body.primary_color || '#2563eb',
          status: body.status || 'active',
          leader_id: body.leader_id
        })
        .select()
        .single();

      if (!error) {
        return c.json({ company: data });
      }
    } catch (sqlError) {
      console.log('SQL not available, using KV for company creation');
    }

    // Fallback to KV store
    const companyId = crypto.randomUUID();
    
    const company = {
      id: companyId,
      name: body.name,
      domain: body.domain,
      logo_url: body.logo_url,
      primary_color: body.primary_color || '#2563eb',
      status: body.status || 'active',
      leader_id: body.leader_id,
      created_at: new Date().toISOString(),
    };
    
    await kv.set(`companies:${companyId}`, company);
    await kv.set(`companies_by_domain:${body.domain.toLowerCase()}`, companyId);
    
    return c.json({ company });
  } catch (error) {
    console.error('Error creating company:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update company
app.put("/make-server-2b631963/companies/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('companies')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return c.json({ company: data });
  } catch (error) {
    console.error('Error updating company:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// USERS/CADASTROS ENDPOINTS (using kv_store)
// ============================================

// Helper function to ensure user exists in both SQL and KV
async function ensureUserExists(email: string, name?: string, role?: string, companyId?: string): Promise<string> {
  console.log('🔍 [ensureUserExists] Verificando usuário:', email);
  
  // First check SQL database
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, name, role, company_id')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (existingUser) {
      console.log('✅ Usuário já existe no SQL:', email, existingUser.id);
      
      // Sync to KV store
      const emailKey = `users_by_email:${email.toLowerCase()}`;
      await kv.set(`users:${existingUser.id}`, {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        companyId: existingUser.company_id,
        hasLoggedIn: false,
        createdAt: new Date().toISOString(),
      });
      await kv.set(emailKey, existingUser.id);
      
      return existingUser.id;
    }
  } catch (sqlError) {
    console.log('⚠️ Erro ao buscar usuário no SQL:', sqlError);
  }
  
  // Check KV store as fallback
  const emailKey = `users_by_email:${email.toLowerCase()}`;
  let userId = await kv.get(emailKey);
  
  if (userId) {
    console.log('✅ Usuário já existe no KV:', email);
    return userId;
  }
  
  // User doesn't exist, create it
  userId = crypto.randomUUID();
  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    role: role || 'member',
    companyId: companyId,
    hasLoggedIn: false,
    createdAt: new Date().toISOString(),
  };
  
  console.log('📝 Criando novo usuário:', email, userId);
  
  // Try SQL first
  try {
    const { data: createdUser, error: sqlError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email.toLowerCase(),
        name: newUser.name,
        role: newUser.role,
        company_id: companyId
      })
      .select()
      .single();
    
    if (!sqlError && createdUser) {
      console.log('✅ Usuário criado no SQL:', email, createdUser.id);
    } else if (sqlError) {
      console.error('❌ Erro ao criar usuário no SQL:', sqlError.message);
      throw sqlError;
    }
  } catch (sqlError) {
    console.error('❌ Erro crítico ao criar usuário no SQL:', sqlError);
    throw sqlError;
  }
  
  // Always save to KV
  await kv.set(`users:${userId}`, newUser);
  await kv.set(emailKey, userId);
  
  console.log('✅ Novo usuário criado e salvo em ambos os stores:', email, userId);
  return userId;
}

// Get all users
app.get("/make-server-2b631963/users", async (c) => {
  try {
    const users = await kv.getByPrefix("users:");
    return c.json({ users: users || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create user
app.post("/make-server-2b631963/users", async (c) => {
  try {
    const body = await c.req.json();
    const userId = crypto.randomUUID();
    
    const user = {
      id: userId,
      email: body.email,
      name: body.name,
      role: body.role || 'member',
      companyId: body.companyId,
      companyName: body.companyName,
      hasLoggedIn: false,
      addedViaRodada: body.addedViaRodada || false,
      invitedBy: body.invitedBy || null,
      createdAt: new Date().toISOString(),
    };

    // Tentar salvar no SQL primeiro
    try {
      const { error: sqlError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: body.email.toLowerCase(),
          name: body.name,
          role: body.role || 'member',
          company_id: body.companyId
        });
      
      if (sqlError) {
        console.log('⚠️ Erro ao salvar usuário no SQL (continuando com KV):', sqlError.message);
      } else {
        console.log('✅ Usuário salvo no SQL:', body.email);
      }
    } catch (sqlError) {
      console.log('⚠️ SQL não disponível para usuário (continuando com KV)');
    }

    // Sempre salvar no KV store para compatibilidade
    await kv.set(`users:${userId}`, user);
    await kv.set(`users_by_email:${body.email.toLowerCase()}`, userId);
    
    // Adicionar à lista de usuários da empresa
    if (body.companyId) {
      const companyUsersKey = `company_users:${body.companyId}`;
      const companyUsers = await kv.get(companyUsersKey) || [];
      if (!companyUsers.includes(userId)) {
        companyUsers.push(userId);
        await kv.set(companyUsersKey, companyUsers);
      }
    }

    console.log('✅ Usuário criado:', user.email, '- Empresa:', body.companyId);
    return c.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update user
app.put("/make-server-2b631963/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existing = await kv.get(`users:${id}`);
    
    if (!existing) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`users:${id}`, updated);

    return c.json({ user: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// RODADAS ENDPOINTS
// ============================================

// Get all rodadas for a company
app.get("/make-server-2b631963/rodadas", async (c) => {
  try {
    console.log('📥 GET /rodadas - Starting request');
    const companyId = c.req.query('companyId');
    console.log('📥 GET /rodadas - companyId:', companyId);
    
    // Try SQL first
    try {
      console.log('📥 GET /rodadas - Trying SQL query...');
      let query = supabase
        .from('rodadas')
        .select(`
          *,
          rodada_participantes (
            id,
            user_id,
            status,
            progress,
            completed_date,
            can_view_results,
            last_activity,
            users (
              id,
              name,
              email,
              role
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (!error) {
        console.log('✅ GET /rodadas - SQL query successful, returning', data?.length || 0, 'rodadas');
        return c.json({ rodadas: data || [] });
      }
      
      console.log('⚠️ GET /rodadas - SQL query failed, trying KV store:', error.message);
    } catch (sqlError: any) {
      console.log('⚠️ GET /rodadas - SQL not available, using KV store. Error:', sqlError?.message);
    }

    // Fallback to KV store
    console.log('📥 GET /rodadas - Trying KV store...');
    const prefix = companyId ? `rodadas:${companyId}:` : "rodadas:";
    console.log('📥 GET /rodadas - Using prefix:', prefix);
    const entries = await kv.getByPrefix(prefix);
    console.log('✅ GET /rodadas - KV store successful, found', entries?.length || 0, 'rodadas');

    // Enriquecer participantes com dados dos usuários
    const enrichedRodadas = await Promise.all(
      (entries || []).map(async (rodada: any) => {
        if (rodada.rodada_participantes && rodada.rodada_participantes.length > 0) {
          const enrichedParticipantes = await Promise.all(
            rodada.rodada_participantes.map(async (p: any) => {
              // Buscar dados do usuário
              const user = await kv.get(`users:${p.user_id}`);
              return {
                ...p,
                users: user ? {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                } : null,
              };
            })
          );
          return {
            ...rodada,
            rodada_participantes: enrichedParticipantes,
          };
        }
        return rodada;
      })
    );

    console.log('✅ GET /rodadas - Returning enriched rodadas:', enrichedRodadas?.length || 0);
    return c.json({ rodadas: enrichedRodadas });
  } catch (error: any) {
    console.error('❌ GET /rodadas - Error fetching rodadas:', error);
    console.error('❌ GET /rodadas - Error stack:', error?.stack);
    return c.json({ error: error?.message || 'Unknown error', stack: error?.stack }, 500);
  }
});

// Create rodada
app.post("/make-server-2b631963/rodadas", async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Creating rodada:', body);
    
    // Try SQL first
    try {
      // Generate versao_id
      const { data: versaoData, error: versionError } = await supabase
        .rpc('generate_next_versao_id', { p_company_id: body.company_id });
      
      const versaoId = versaoData || `V${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.001`;
      console.log('Generated versao_id:', versaoId);

      // Create rodada
      const { data: rodada, error: rodadaError } = await supabase
        .from('rodadas')
        .insert({
          company_id: body.company_id,
          versao_id: versaoId,
          status: body.status || 'ativa',
          criterio_encerramento: body.criterio_encerramento || 'manual',
          due_date: body.due_date,
          created_by: body.created_by
        })
        .select()
        .single();

      if (rodadaError) throw rodadaError;
      console.log('✅ Rodada created in SQL:', rodada.id);

      // Add participants - criar usuários automaticamente se necessário
      if (body.participantes && body.participantes.length > 0) {
        // First, ensure users exist
        const userIds = [];
        const participantesData = [];
        
        for (const p of body.participantes) {
          console.log('📝 Processing participant (SQL):', p);
          if (p.email) {
            // Check if user exists by email
            const emailKey = `users_by_email:${p.email.toLowerCase()}`;
            const existingUserId = await kv.get(emailKey);
            
            // Ensure user exists in both SQL and KV
            const userId = await ensureUserExists(
              p.email,
              p.name,
              p.role,
              body.company_id
            );
            
            userIds.push(userId);
            participantesData.push({ userId, ...p });
            
            // Add to company users list
            const companyUsersKey = `company_users:${body.company_id}`;
            const companyUsers = await kv.get(companyUsersKey) || [];
            if (!companyUsers.includes(userId)) {
              companyUsers.push(userId);
              await kv.set(companyUsersKey, companyUsers);
            }
          } else if (p.user_id || p.id) {
            userIds.push(p.user_id || p.id);
            participantesData.push({ userId: p.user_id || p.id, ...p });
          }
        }

        const participantes = participantesData.map((data) => ({
          rodada_id: rodada.id,
          user_id: data.userId,
          status: 'pendente',
          progress: 0,
          can_view_results: false
        }));

        const { error: participantesError } = await supabase
          .from('rodada_participantes')
          .insert(participantes);

        if (participantesError) throw participantesError;
        console.log('✅ Added participants:', userIds.length);
      }

      return c.json({ rodada });
    } catch (sqlError) {
      console.log('⚠️ SQL not available, using KV store:', sqlError.message);
      
      // Fallback to KV store
      const rodadaId = crypto.randomUUID();
      
      // Generate simple versao_id
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const versaoId = `V${year}.${month}.${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
      
      // Process participants - criar usuários automaticamente se necessário
      const participantes = [];
      
      // PRIMEIRO: Adicionar o líder criador como participante
      if (body.created_by) {
        console.log('📝 Adicionando líder criador como participante:', body.created_by);
        const creatorUser = await kv.get(`users:${body.created_by}`);
        if (creatorUser) {
          participantes.push({
            id: crypto.randomUUID(),
            user_id: body.created_by,
            name: creatorUser.name || 'Líder',
            email: creatorUser.email,
            role: creatorUser.role || 'leader',
            status: 'pendente',
            progress: 0,
            can_view_results: true, // Líder sempre pode ver resultados
          });
          console.log('✅ Líder adicionado como participante:', creatorUser.name);
        }
      }
      
      // SEGUNDO: Processar demais participantes
      for (const p of body.participantes || []) {
        console.log('📝 Processing participant:', p);
        let userId;
        
        if (p.email) {
          // Ensure user exists in both SQL and KV
          userId = await ensureUserExists(
            p.email,
            p.name,
            p.role,
            body.company_id
          );
          
          // Add to company users list
          const companyUsersKey = `company_users:${body.company_id}`;
          const companyUsers = await kv.get(companyUsersKey) || [];
          if (!companyUsers.includes(userId)) {
            companyUsers.push(userId);
            await kv.set(companyUsersKey, companyUsers);
          }
        } else {
          userId = p.user_id || p.id;
        }
        
        participantes.push({
          id: crypto.randomUUID(),
          user_id: userId,
          name: p.name || 'Carregando...',
          email: p.email,
          role: p.role || 'member',
          status: 'pendente',
          progress: 0,
          can_view_results: false,
        });
      }
      
      const rodada = {
        id: rodadaId,
        company_id: body.company_id,
        versao_id: versaoId,
        status: body.status || 'ativa',
        criterio_encerramento: body.criterio_encerramento || 'manual',
        due_date: body.due_date,
        created_by: body.created_by,
        created_at: new Date().toISOString(),
        rodada_participantes: participantes,
      };
      
      await kv.set(`rodadas:${body.company_id}:${rodadaId}`, rodada);
      console.log('✅ Rodada created in KV store:', rodadaId);
      
      return c.json({ rodada });
    }
  } catch (error) {
    console.error('❌ Error creating rodada:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update rodada
app.put("/make-server-2b631963/rodadas/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('rodadas')
      .update({
        status: body.status,
        due_date: body.due_date,
        encerrado_em: body.status === 'encerrada' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return c.json({ rodada: data });
  } catch (error) {
    console.error('Error updating rodada:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete rodada
app.delete("/make-server-2b631963/rodadas/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    console.log(`🗑️ Deletando rodada: ${id}`);
    
    // Tentar deletar do SQL primeiro
    try {
      const { error } = await supabase
        .from('rodadas')
        .delete()
        .eq('id', id);
      
      if (!error) {
        console.log(`✅ Rodada deletada do SQL: ${id}`);
        return c.json({ success: true, message: 'Rodada deletada com sucesso' });
      }
    } catch (sqlError) {
      console.log('⚠️ SQL delete failed, trying KV store:', sqlError);
    }
    
    // Se SQL falhar, tentar KV store
    const allRodadas = await kv.getByPrefix('rodadas:');
    for (const rodada of allRodadas) {
      if (rodada && rodada.id === id) {
        // Construir a chave para deletar
        const key = `rodadas:${rodada.company_id}:${rodada.id}`;
        await kv.del(key);
        console.log(`✅ Rodada deletada do KV store: ${key}`);
        return c.json({ success: true, message: 'Rodada deletada com sucesso' });
      }
    }
    
    return c.json({ error: 'Rodada não encontrada' }, 404);
  } catch (error) {
    console.error('❌ Error deleting rodada:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete todas as rodadas de uma empresa
app.delete("/make-server-2b631963/rodadas/company/:companyId/all", async (c) => {
  try {
    const companyId = c.req.param('companyId');
    
    console.log(`🗑️ Deletando TODAS as rodadas da empresa: ${companyId}`);
    
    let deletedCount = 0;
    
    // Tentar deletar do SQL primeiro
    try {
      const { data, error } = await supabase
        .from('rodadas')
        .delete()
        .eq('company_id', companyId)
        .select();
      
      if (!error && data) {
        deletedCount += data.length;
        console.log(`✅ ${data.length} rodadas deletadas do SQL`);
      }
    } catch (sqlError) {
      console.log('⚠️ SQL delete failed, trying KV store:', sqlError);
    }
    
    // Também tentar KV store - buscar todas as rodadas e filtrar por company_id
    const allRodadas = await kv.getByPrefix('rodadas:');
    console.log(`📦 KV Store: encontradas ${allRodadas?.length || 0} rodadas no total`);
    
    for (const rodada of allRodadas) {
      if (rodada && rodada.company_id === companyId) {
        // Construir a chave para deletar
        const key = `rodadas:${rodada.company_id}:${rodada.id}`;
        await kv.del(key);
        deletedCount++;
        console.log(`✅ Rodada deletada do KV store: ${key} (versao: ${rodada.versao_id})`);
      }
    }
    
    console.log(`🎯 Total de rodadas deletadas: ${deletedCount}`);
    
    return c.json({ 
      success: true, 
      message: `${deletedCount} rodada(s) deletada(s) com sucesso`,
      deletedCount 
    });
  } catch (error) {
    console.error('❌ Error deleting all rodadas:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update participant status
app.put("/make-server-2b631963/rodadas/:rodadaId/participantes/:participanteId", async (c) => {
  try {
    const rodadaId = c.req.param('rodadaId');
    const participanteId = c.req.param('participanteId');
    const body = await c.req.json();
    
    console.log(`🔄 [PUT /participantes/${participanteId}] Atualizando status:`, {
      rodadaId,
      participanteId,
      status: body.status,
      progress: body.progress
    });
    
    // First, check if participant exists
    const { data: existingParticipant, error: checkError } = await supabase
      .from('rodada_participantes')
      .select('id, user_id, status, progress')
      .eq('id', participanteId)
      .single();
    
    if (checkError || !existingParticipant) {
      console.error('❌ Participante não encontrado:', participanteId);
      return c.json({ error: `Participante não encontrado: ${participanteId}` }, 404);
    }
    
    console.log('✅ Participante encontrado:', {
      id: existingParticipant.id,
      user_id: existingParticipant.user_id,
      statusAnterior: existingParticipant.status,
      statusNovo: body.status
    });
    
    const { data, error } = await supabase
      .from('rodada_participantes')
      .update({
        status: body.status,
        progress: body.progress,
        can_view_results: body.can_view_results !== undefined ? body.can_view_results : existingParticipant.can_view_results,
        last_activity: new Date().toISOString(),
        completed_date: body.status === 'concluido' ? new Date().toISOString() : null
      })
      .eq('id', participanteId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar participante:', error.message, error.details);
      throw error;
    }
    
    console.log('✅ Participante atualizado com sucesso:', {
      id: data.id,
      status: data.status,
      progress: data.progress,
      completed_date: data.completed_date
    });
    
    return c.json({ participante: data });
  } catch (error) {
    console.error('❌ Error updating participante:', error);
    return c.json({ 
      error: error.message || 'Erro ao atualizar participante',
      details: error.toString()
    }, 500);
  }
});

// Generate results for a rodada
app.post("/make-server-2b631963/rodadas/:rodadaId/gerar-resultados", async (c) => {
  try {
    const rodadaId = c.req.param('rodadaId');
    const body = await c.req.json();
    
    console.log(`🎯 Gerando resultados para rodada: ${rodadaId}`);
    
    // Buscar rodada
    const { data: rodada, error: rodadaError } = await supabase
      .from('rodadas')
      .select(`
        *,
        rodada_participantes (
          id,
          user_id,
          status
        )
      `)
      .eq('id', rodadaId)
      .single();
    
    if (rodadaError) {
      console.error('❌ Erro ao buscar rodada:', rodadaError);
      throw rodadaError;
    }
    
    console.log(`✅ Rodada encontrada: ${rodada.company_id}`);
    console.log(`📊 Participantes: ${rodada.rodada_participantes.length}`);
    
    // Buscar todas as avaliações dos participantes desta rodada
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select(`
        id,
        user_id,
        overall_score,
        completed_at,
        assessment_answers (
          question_id,
          pilar_id,
          value
        )
      `)
      .eq('rodada_id', rodadaId)
      .eq('status', 'completed');
    
    if (assessmentsError) {
      console.error('❌ Erro ao buscar avaliações:', assessmentsError);
      throw assessmentsError;
    }
    
    console.log(`✅ Encontradas ${assessments?.length || 0} avaliações completas`);
    
    // Verificar se há avaliações
    if (!assessments || assessments.length === 0) {
      return c.json({ 
        error: 'Nenhuma avaliação completa encontrada para esta rodada' 
      }, 400);
    }
    
    // VALIDAÇÃO CRÍTICA: Verificar se TODOS os participantes completaram
    const totalParticipantes = rodada.rodada_participantes.length;
    const totalCompletos = assessments.length;
    
    console.log(`🔍 Validação de completude:`, {
      totalParticipantes,
      totalCompletos,
      permiteParcial: body.tipo === 'parcial'
    });
    
    // Se NÃO for geração parcial explícita e nem todos completaram, bloquear
    if (body.tipo !== 'parcial' && totalCompletos < totalParticipantes) {
      return c.json({ 
        error: `Apenas ${totalCompletos} de ${totalParticipantes} participantes completaram a avaliação. Use tipo='parcial' para gerar resultados parciais.`,
        totalParticipantes,
        totalCompletos,
        faltam: totalParticipantes - totalCompletos
      }, 400);
    }
    
    // Criar registro de resultado
    const resultadoId = crypto.randomUUID();
    const resultado = {
      id: resultadoId,
      rodada_id: rodadaId,
      company_id: rodada.company_id,
      versao_id: rodada.versao_id,
      tipo: body.tipo || 'parcial', // 'parcial' ou 'final'
      total_participantes: rodada.rodada_participantes.length,
      participantes_incluidos: assessments.length,
      generated_at: new Date().toISOString(),
      generated_by: body.generated_by
    };
    
    // Salvar resultado
    const { data: savedResultado, error: resultadoError } = await supabase
      .from('resultados')
      .insert(resultado)
      .select()
      .single();
    
    if (resultadoError) {
      console.error('❌ Erro ao salvar resultado:', resultadoError);
      throw resultadoError;
    }
    
    console.log(`✅ Resultado criado: ${savedResultado.id}`);
    
    // Atualizar rodada para marcar que resultado foi gerado
    const { error: updateError } = await supabase
      .from('rodadas')
      .update({
        resultado_gerado: true,
        resultado_id: savedResultado.id,
        resultado_gerado_em: new Date().toISOString()
      })
      .eq('id', rodadaId);
    
    if (updateError) {
      console.error('⚠️ Erro ao atualizar rodada:', updateError);
      // Não falhamos aqui, apenas logamos
    }
    
    // Se for critério automático e todos responderam, encerrar rodada
    const todosResponderam = assessments.length === rodada.rodada_participantes.length;
    if (rodada.criterio_encerramento === 'automatico' && todosResponderam) {
      await supabase
        .from('rodadas')
        .update({
          status: 'encerrada',
          encerrado_em: new Date().toISOString()
        })
        .eq('id', rodadaId);
      
      console.log(`✅ Rodada encerrada automaticamente (todos responderam)`);
    }
    
    return c.json({ 
      resultado: savedResultado,
      message: `Resultados gerados com sucesso! Incluídos ${assessments.length} de ${rodada.rodada_participantes.length} participantes.`
    });
  } catch (error) {
    console.error('❌ Error generating results:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get result for a rodada
app.get("/make-server-2b631963/rodadas/:rodadaId/resultado", async (c) => {
  try {
    const rodadaId = c.req.param('rodadaId');
    
    console.log(`📊 Buscando resultado para rodada: ${rodadaId}`);
    
    // Buscar resultado mais recente da rodada
    const { data: resultado, error: resultError } = await supabase
      .from('results')
      .select('*')
      .eq('rodada_id', rodadaId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (resultError || !resultado) {
      console.log('⚠️ Resultado não encontrado no SQL, tentando KV store...');
      
      // Fallback para KV store
      const kvResultado = await kv.get(`resultado:${rodadaId}`);
      
      if (!kvResultado) {
        return c.json({ error: 'Nenhum resultado encontrado para esta rodada' }, 404);
      }
      
      return c.json({ resultado: kvResultado });
    }
    
    console.log(`✅ Resultado encontrado: ${resultado.id}`);
    return c.json({ resultado });
  } catch (error) {
    console.error('❌ Error fetching result:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// ASSESSMENTS ENDPOINTS
// ============================================

// Save assessment (usando função SQL para resolver cache)
app.post("/make-server-2b631963/assessments", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log('💾 [SQL Function] Salvando avaliação:', {
      user_id: body.user_id,
      rodada_id: body.rodada_id,
      company_id: body.company_id,
      versao_id: body.versao_id,
      overall_score: body.overall_score,
      status: body.status,
      totalAnswers: body.answers ? Object.keys(body.answers).length : 0
    });

    // Usar função SQL que garante que usuário existe (resolve cache do Supabase)
    const { data: assessmentId, error: assessmentError } = await supabase
      .rpc('create_assessment_auto', {
        p_user_id: body.user_id,
        p_rodada_id: body.rodada_id,
        p_company_id: body.company_id,
        p_versao_id: body.versao_id,
        p_overall_score: body.overall_score || 0,
        p_status: body.status || 'draft'
      });

    if (assessmentError) {
      console.error('❌ Erro ao criar assessment:', assessmentError);
      
      // Se a função não existir, dar instruções claras
      if (assessmentError.message?.includes('function') || assessmentError.code === '42883') {
        return c.json({ 
          error: 'Função SQL não encontrada no banco de dados.',
          message: 'Execute o script FIX_SIMPLES.sql no Supabase.',
          details: assessmentError.message,
          instructions: {
            title: 'Como Resolver (1 minuto):',
            steps: [
              '1. Acesse: https://supabase.com/dashboard',
              '2. Vá em SQL Editor',
              '3. Copie TODO o conteúdo de /database/FIX_SIMPLES.sql',
              '4. Cole no SQL Editor e clique em RUN',
              '5. Recarregue esta página'
            ],
            quickSolution: 'Leia: /EXECUTE_ESTES_2_PASSOS.md'
          },
          sqlFile: '/database/FIX_SIMPLES.sql',
          needsSetup: true
        }, 500);
      }
      
      return c.json({ 
        error: 'Erro ao salvar assessment',
        details: assessmentError.message
      }, 500);
    }

    console.log('✅ Assessment criado via SQL Function:', assessmentId);

    // Save answers
    if (body.answers && Object.keys(body.answers).length > 0) {
      const answers = Object.entries(body.answers).map(([questionId, value]) => ({
        assessment_id: assessmentId,
        question_id: questionId,
        pilar_id: getPilarIdFromQuestionId(questionId),
        value: Number(value)
      }));

      console.log(`💾 Salvando ${answers.length} respostas...`);

      const { error: answersError } = await supabase
        .from('assessment_answers')
        .insert(answers);

      if (answersError) {
        console.error('❌ Erro ao salvar respostas:', answersError);
        // Não falhar por causa das respostas - assessment já foi criado
      } else {
        console.log(`✅ ${answers.length} respostas salvas com sucesso!`);
      }
    }

    // Buscar assessment completo para retornar
    const { data: assessment } = await supabase
      .from('assessments')
      .select()
      .eq('id', assessmentId)
      .single();

    console.log('🎉 Assessment completo salvo com sucesso:', assessmentId);
    return c.json({ assessment: assessment || { id: assessmentId } });
  } catch (error) {
    console.error('❌ Error saving assessment:', error);
    return c.json({ 
      error: error.message || 'Erro ao salvar avaliação',
      details: error.toString()
    }, 500);
  }
});

// Helper function to get pilar_id from question_id
function getPilarIdFromQuestionId(questionId: string): number {
  if (questionId.startsWith('process')) return 1;
  if (questionId.startsWith('auto')) return 2;
  if (questionId.startsWith('metric')) return 3;
  if (questionId.startsWith('doc')) return 4;
  if (questionId.startsWith('test')) return 5;
  if (questionId.startsWith('qaops')) return 6;
  if (questionId.startsWith('leader')) return 7;
  return 1;
}

// Get assessments (with optional filters)
app.get("/make-server-2b631963/assessments", async (c) => {
  try {
    const rodadaId = c.req.query('rodada_id');
    const userId = c.req.query('user_id');
    const status = c.req.query('status');
    
    console.log('📊 [GET /assessments] Buscando assessments:', { rodadaId, userId, status });
    
    let query = supabase
      .from('assessments')
      .select(`
        *,
        assessment_answers (
          id,
          question_id,
          pilar_id,
          value
        )
      `)
      .order('created_at', { ascending: false });
    
    if (rodadaId) {
      query = query.eq('rodada_id', rodadaId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: assessments, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar assessments:', error);
      throw error;
    }
    
    console.log(`✅ Encontrados ${assessments?.length || 0} assessments`);
    return c.json({ assessments: assessments || [] });
  } catch (error) {
    console.error('❌ Error fetching assessments:', error);
    return c.json({ 
      error: error.message || 'Erro ao buscar avaliações',
      details: error.toString()
    }, 500);
  }
});

// ============================================
// SEED/INIT ENDPOINT - Criar usuários demo
// ============================================
app.post("/make-server-2b631963/seed-demo-users", async (c) => {
  try {
    console.log('🌱 Iniciando seed de usuários demo...');

    // Verificar se já existem
    const existingUsers = await kv.getByPrefix("users:");
    const demoEmails = ['leader@demo.com', 'member@demo.com'];
    
    const alreadySeeded = demoEmails.some(email => 
      existingUsers.some((u: any) => u.email === email)
    );

    if (alreadySeeded) {
      console.log('⚠️ Usuários demo já existem, pulando seed');
      return c.json({ message: 'Demo users already exist', users: existingUsers.filter((u: any) => demoEmails.includes(u.email)) });
    }

    // Criar empresa demo
    const demoCompanyId = crypto.randomUUID();
    const demoCompany = {
      id: demoCompanyId,
      name: 'Demo Company',
      domain: 'demo',
      status: 'active',
      leader_id: '', // Será preenchido depois
      created_at: new Date().toISOString(),
    };

    await kv.set(`companies:${demoCompanyId}`, demoCompany);
    console.log('✅ Empresa demo criada:', demoCompanyId);

    // Criar usuário líder
    const leaderUserId = crypto.randomUUID();
    const leaderUser = {
      id: leaderUserId,
      email: 'leader@demo.com',
      name: 'Líder da Empresa',
      role: 'leader',
      companyId: demoCompanyId,
      companyName: 'Demo Company',
      hasLoggedIn: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`users:${leaderUserId}`, leaderUser);
    await kv.set(`users_by_email:leader@demo.com`, leaderUserId);
    console.log('✅ Usuário líder criado:', leaderUserId);

    // Criar usuário membro
    const memberUserId = crypto.randomUUID();
    const memberUser = {
      id: memberUserId,
      email: 'member@demo.com',
      name: 'Membro da Equipe',
      role: 'member',
      companyId: demoCompanyId,
      companyName: 'Demo Company',
      hasLoggedIn: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`users:${memberUserId}`, memberUser);
    await kv.set(`users_by_email:member@demo.com`, memberUserId);
    console.log('✅ Usuário membro criado:', memberUserId);

    // Atualizar empresa com leader_id
    demoCompany.leader_id = leaderUserId;
    await kv.set(`companies:${demoCompanyId}`, demoCompany);
    console.log('✅ Empresa atualizada com leader_id');

    return c.json({ 
      message: 'Demo users seeded successfully',
      users: [leaderUser, memberUser],
      company: demoCompany
    });
  } catch (error) {
    console.error('Error seeding demo users:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);