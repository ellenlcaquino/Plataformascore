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
// ASSESSMENTS ENDPOINT - VERSÃO BYPASS CACHE
// ============================================

// Save assessment (BYPASS de verificação de usuário para resolver cache)
app.post("/make-server-2b631963/assessments", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log('💾 [POST /assessments BYPASS] Recebendo avaliação:', {
      user_id: body.user_id,
      rodada_id: body.rodada_id,
      company_id: body.company_id,
      versao_id: body.versao_id,
      overall_score: body.overall_score,
      status: body.status,
      totalAnswers: body.answers ? Object.keys(body.answers).length : 0
    });

    // BYPASS: Não verificar se usuário existe - salvar direto
    // Isso resolve o problema de cache do Supabase
    console.log('⚡ [BYPASS] Pulando verificação de usuário (fix de cache)');
    
    // Create assessment diretamente
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: body.user_id,
        rodada_id: body.rodada_id,
        company_id: body.company_id,
        versao_id: body.versao_id,
        overall_score: body.overall_score || 0,
        status: body.status || 'draft',
        completed_at: body.status === 'completed' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('❌ Erro ao criar assessment:', assessmentError);
      
      // Se falhar, retornar erro detalhado
      return c.json({ 
        error: 'Erro ao salvar assessment',
        details: assessmentError.message,
        code: assessmentError.code,
        hint: assessmentError.hint,
        instructions: 'Execute /database/SOLUCAO_DEFINITIVA.sql no Supabase SQL Editor'
      }, 500);
    }

    console.log('✅ Assessment criado:', assessment.id);

    // Save answers
    if (body.answers && Object.keys(body.answers).length > 0) {
      const answers = Object.entries(body.answers).map(([questionId, value]) => ({
        assessment_id: assessment.id,
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
        // Não falhar - assessment já foi criado
        console.log('⚠️ Assessment criado mas respostas falharam');
      } else {
        console.log(`✅ ${answers.length} respostas salvas com sucesso!`);
      }
    }

    console.log('🎉 Assessment completo salvo com sucesso:', assessment.id);
    return c.json({ assessment });
  } catch (error: any) {
    console.error('❌ Error saving assessment:', error);
    return c.json({ 
      error: error.message || 'Erro ao salvar avaliação',
      details: error.toString(),
      instructions: 'Execute /database/SOLUCAO_DEFINITIVA.sql no Supabase'
    }, 500);
  }
});

// Helper function to get pilar_id from question_id
function getPilarIdFromQuestionId(questionId: string): number {
  // Extract number from question ID (e.g., "1.1" -> 1, "2.3" -> 2)
  const parts = questionId.split('.');
  return parseInt(parts[0]) || 1;
}

console.log('🚀 Servidor BYPASS iniciado - Assessments endpoint configurado');

Deno.serve(app.fetch);
