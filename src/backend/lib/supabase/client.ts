// import { createBrowserClient } from '@supabase/ssr'

// export const supabase =  createBrowserClient(
//   config.DB_URL!,
//   config.DB_KEY!
// );

import config from '@/configs/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = config.DB_URL || '';
const supabaseAnonKey = config.DB_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 