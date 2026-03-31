import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://muiqnokprmktyxeveqeo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VGyhzLd8B4vQ1K0mjeHhYg_8-m5WsUy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
