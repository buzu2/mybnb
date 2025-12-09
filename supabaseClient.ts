import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase fornecidas
// Prioriza variáveis de ambiente se existirem (para produção segura), senão usa as chaves diretas
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://wdstsvtkqtnolmdbojjz.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkc3RzdnRrcXRub2xtZGJvamp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTA5NzAsImV4cCI6MjA4MDg4Njk3MH0.HFlZtZu4TM2xHyt0fSED65EdQMujGRy63U6h572D4I4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);