import PaperDetailPage from '@/widget/paper/PaperDetailPage';

type Props = {
  params: { slug: string };
};

export default function PaperSlugPage({ params }: Props) {
  return <PaperDetailPage paperSlug={params.slug} />;
}
