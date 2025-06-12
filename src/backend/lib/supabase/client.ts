// import { createBrowserClient } from '@supabase/ssr'

// export const supabase =  createBrowserClient(
//   process.env.NPBSBU!,
//   process.env.NPLSBAK!
// );

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NPBSBU || '';
const supabaseAnonKey = process.env.NPLSBAK || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 