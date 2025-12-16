import { Database } from '@/shared/type';

export type LetterStyleRow = Database['public']['Tables']['letter_styles']['Row'];

export type LetterStyleDraft = {
  noteColor: string;
  textColor: string;
  pattern: 'plain' | 'lined' | 'grid' | 'dots' | 'diagonal' | 'check' | 'notebook';
  fontFamily: string;
};
