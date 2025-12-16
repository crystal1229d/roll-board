import LetterDetailContent from '@/widget/letter/LetterDetailContent';

export default function LetterDetailWindow({ letterId }: { letterId: string }) {
  return <LetterDetailContent letterId={letterId} />;
}
