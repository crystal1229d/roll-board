import { createServerSideClient } from '@/shared/lib/supabase/supabase';
import { mapPaperRowToPaper } from '../lib';

export const getPaperById = async ({
  paperId,
  serverComponent = false,
}: {
  paperId: string;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const { data, error } = await supabase.from('papers').select('*').eq('id', paperId).maybeSingle();

  if (error || !data) return null;

  return mapPaperRowToPaper(data);
};

export const getPapersByOwner = async ({
  ownerId,
  serverComponent = false,
}: {
  ownerId: string;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const { data, error } = await supabase.from('papers').select('*').eq('owner_id', ownerId);

  if (error || !data) return [];

  return data.map(mapPaperRowToPaper);
};

export const getPaperByYear = async ({
  ownerId,
  year,
  serverComponent = false,
}: {
  ownerId: string;
  year: number;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const { data } = await supabase
    .from('papers')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('year', year)
    .maybeSingle();

  return data ? mapPaperRowToPaper(data) : null;
};
