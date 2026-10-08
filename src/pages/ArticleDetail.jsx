import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Share2, Link2, Check, Tag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/app/PageHeader';
import CoverImage from '@/components/app/CoverImage';
import PhotoViewer from '@/components/app/PhotoViewer';
import CommentSection from '@/components/app/CommentSection';
import ArticleCard from '@/components/app/ArticleCard';
import ArticleBody from '@/components/app/ArticleBody';
import ContentMenu from '@/components/app/ContentMenu';
import { fullDate } from '@/lib/pgds';

export default function ArticleDetail() {
  const { id } = useParams();
  const [viewer, setViewer] = useState(-1);
  const [copied, setCopied] = useState(false);
  const { data: a, isLoading } = useQuery({ queryKey: ['article', id], queryFn: async () => {
    const x = await base44.entities.Article.get(id);
    if (['pending', 'rejected', 'removed'].includes(x.status)) {
      const me = await base44.auth.me().catch(() => null);
      if (!me || (me.email !== x.author_email && !['admin', 'editor'].includes(me.role))) return null;
    }
    return x;
  } });
  const { data: related = [] } = useQuery({
    queryKey: ['related', a?.category],
    enabled: !!a,
    queryFn: async () => (await base44.entities.Article.filter({ category: a.category, status: { $nin: ['pending', 'rejected', 'removed'] } }, { sort: '-created_date', limit: 4 })).items.filter((r) => r.id !== id).slice(0, 3),
  });

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) return navigator.share({ title: a.title, url }).catch(() => {});
    await navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  if (isLoading) return <div><PageHeader back title="Bài viết" /><p className="p-10 text-center text-sm text-muted-foreground">Đang tải...</p></div>;
  if (!a) return <div><PageHeader back title="Bài viết" /><p className="p-10 text-center text-sm">Không tìm thấy bài viết.</p></div>;

  return (
    <div>
      <PageHeader back title={a.subcategory || a.category} right={
        <>
          <button aria-label="Sao chép liên kết" onClick={share} className="rounded-full p-2">{copied ? <Check className="h-5 w-5 text-green-600" /> : <Link2 className="h-5 w-5" />}</button>
          <button aria-label="Chia sẻ" onClick={share} className="rounded-full p-2"><Share2 className="h-5 w-5" /></button>
          <ContentMenu targetType="article" targetId={a.id} authorEmail={a.author_email} />
        </>
      } />
      <CoverImage src={a.cover_image} className="aspect-[4/3] w-full" />
      <article className="px-5 pt-5">
        <Link to={`/tin-tuc?cat=${encodeURIComponent(a.category)}`} className="text-xs font-semibold uppercase tracking-wider text-[#8A6D0B] dark:text-[#C9A227]">{a.category}</Link>
        <h1 className="mt-2 font-heading text-2xl font-bold leading-snug">{a.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{a.author_name} · {fullDate(a.created_date)}</p>
        <ArticleBody content={a.content} />
        {a.images?.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            {a.images.map((p, i) => (
              <button key={p + i} onClick={() => setViewer(i)} className={i === 0 && a.images.length % 2 ? 'col-span-2' : ''}>
                <CoverImage src={p} className="aspect-[4/3] w-full rounded-2xl" />
              </button>
            ))}
          </div>
        )}
        {a.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {a.tags.map((t) => <Link key={t} to={`/tim-kiem?q=${encodeURIComponent(t)}`} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"><Tag className="h-3 w-3" />{t}</Link>)}
          </div>
        )}
      </article>
      <section className="mt-8 px-5">
        <h2 className="mb-4 font-heading text-lg font-bold">Bình luận</h2>
        <CommentSection targetType="article" targetId={id} />
      </section>
      {related.length > 0 && (
        <section className="mt-8 px-5">
          <h2 className="font-heading text-lg font-bold">Bài viết liên quan</h2>
          {related.map((r) => <ArticleCard key={r.id} a={r} />)}
        </section>
      )}
      {viewer >= 0 && <PhotoViewer photos={a.images} index={viewer} onClose={() => setViewer(-1)} />}
    </div>
  );
}