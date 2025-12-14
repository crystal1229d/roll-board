'use client';

import PaperDetailPage from './PaperDetailPage';

type Props = { paperSlug: string };

export default function PaperDetailWindow({ paperSlug }: Props) {
  return <PaperDetailPage paperSlug={paperSlug} />;
}
