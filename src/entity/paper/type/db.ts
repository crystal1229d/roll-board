import type { Database } from '@/shared/type/supabase';

export type PaperRow = Database['public']['Tables']['papers']['Row'];
export type PaperInsert = Database['public']['Tables']['papers']['Insert'];
export type PaperUpdate = Database['public']['Tables']['papers']['Update'];

export type PaperStyleRow = Database['public']['Tables']['paper_styles']['Row'];
export type PaperStyleUpdate = Database['public']['Tables']['paper_styles']['Update'];

export type PaperStickerRow = Database['public']['Tables']['paper_stickers']['Row'];
