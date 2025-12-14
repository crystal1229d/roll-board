import type { Tables } from '@/shared/type/supabase';

export type PaperRow = Tables<'papers'>;
export type ProfileRow = Tables<'profiles'>;
export type LetterRow = Tables<'letters'>;

export type PaperOwner = Pick<ProfileRow, 'id' | 'display_name' | 'avatar_url' | 'intro'>;

export type PaperWithOwner = PaperRow & {
  owner: PaperOwner | null;
};

export type LetterWithWriter = LetterRow & {
  writer: Pick<ProfileRow, 'id' | 'display_name' | 'avatar_url'> | null;
};

export type PaperDetail = {
  paper: PaperWithOwner;
  letters: LetterWithWriter[];
};

export type MyLetterState = { status: 'none' } | { status: 'sent'; letter: LetterWithWriter };
