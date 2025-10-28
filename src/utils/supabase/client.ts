import { createClient } from '@supabase/supabase-js';

// Obter credenciais do Supabase via info
import { projectId, publicAnonKey } from './info';

// URL do projeto Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;

// Criar cliente Supabase singleton
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public'
  }
});

// Tipos TypeScript para o banco de dados
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          domain: string;
          logo_url: string | null;
          primary_color: string | null;
          status: 'active' | 'inactive';
          leader_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      rodadas: {
        Row: {
          id: string;
          company_id: string;
          versao_id: string;
          status: 'rascunho' | 'ativa' | 'encerrada';
          criterio_encerramento: 'manual' | 'automatico';
          due_date: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          encerrado_em: string | null;
        };
        Insert: Omit<Database['public']['Tables']['rodadas']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rodadas']['Insert']>;
      };
      rodada_participantes: {
        Row: {
          id: string;
          rodada_id: string;
          user_id: string;
          status: 'pendente' | 'respondendo' | 'concluido' | 'atrasado';
          progress: number;
          can_view_results: boolean;
          last_activity: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rodada_participantes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rodada_participantes']['Insert']>;
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          rodada_id: string | null;
          company_id: string;
          versao_id: string;
          overall_score: number;
          status: 'draft' | 'completed';
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
      };
      assessment_answers: {
        Row: {
          id: string;
          assessment_id: string;
          question_id: string;
          pilar_id: number;
          value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessment_answers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessment_answers']['Insert']>;
      };
      results: {
        Row: {
          id: string;
          rodada_id: string;
          versao_id: string;
          overall_score: number;
          pilar_scores: Record<string, any>;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['results']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['results']['Insert']>;
      };
      public_shares: {
        Row: {
          id: string;
          share_id: string;
          rodada_id: string;
          result_id: string;
          created_by: string;
          expires_at: string | null;
          is_active: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['public_shares']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['public_shares']['Insert']>;
      };
    };
  };
}

// Helper para erros
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Erro desconhecido ao acessar o banco de dados';
};
