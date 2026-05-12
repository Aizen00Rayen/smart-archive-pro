import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://skfkstufxarxmmsgcwpd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NpttT_6inDzrPAOYCmLaDA_sALdzs7W";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type DocumentRow = {
  id: string;
  title: string;
  reference: string;
  category: string;
  status: string;
  created_at: string;
};
