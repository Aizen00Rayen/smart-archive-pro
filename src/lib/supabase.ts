// Re-export the auto-generated Lovable Cloud client
export { supabase } from "@/integrations/supabase/client";

export type DocumentRow = {
  id: string;
  title: string;
  reference: string;
  category: string;
  status: string;
  file_url: string | null;
  file_path: string | null;
  qr_token: string;
  uploaded_by: string | null;
  created_at: string;
};
