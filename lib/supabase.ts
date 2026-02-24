import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfqubnzhasdzkbwqllkq.supabase.co'; 
// J'ai ajouté le guillemet manquant au début de la clé ci-dessous :
const supabaseAnonKey = 'sb_publishable_3VWeUTRBOm1okbL692z8YA_rlGRqJEM'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);