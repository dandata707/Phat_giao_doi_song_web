import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, X, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/app/PageHeader';
import ArticleCard from '@/components/app/ArticleCard';
import CoverImage from '@/components/app/CoverImage';
import { getPref, setPref } from '@/lib/pgds';

const rx = (t) => ({ $regex: t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' });

export default function Search() {
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get('q') || '');
  const [term, setTerm] = useState(params.get('q') || '');
  const [history, setHistory] = useState(getPref('history', []));

  const run = (t) => {
    const v = t.trim();
    setTerm(v);
    if (v) { const h = [v, ...history.filter((x) => x !== v)].slice(0, 8); setHistory(h); setPref('history', h); }
  };
  useEffect(() => { if (params.get('q')) run(params.get('q')); }, []); // eslint-disable-line

  const on = { enabled: !!term };
  const articles = useQuery({ queryKey: ['s-a', term], ...on, queryFn: async () => (await base44.entities.Article.filter({ status: { $nin: ['pending', 'rejected', 'removed'] }, $or: [{ title: rx(term) }, { excerpt: rx(term) }, { tags: rx(term) }] }, { sort: '-created_date', limit: 20 })).items });
  const groups = useQuery({ queryKey: ['s-g', term], ...on, queryFn: async () => (await base44.entities.Group.filter({ name: rx(term) }, { limit: 20 })).items });
  const topics = useQuery({ queryKey: ['s-t', term], ...on, queryFn: async () => (await base44.entities.Topic.filter({ forum: 'public', title: rx(term) }, { limit: 20 })).items });
  const empty = (q) => q.data && q.data.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Không có kết quả.</p>;

  return (
    <div>
      <PageHeader back title="Tìm kiếm" />
      <form onSubmit={(e) => { e.preventDefault(); run(input); }} className="relative px-5 pt-4">
        <SearchIcon className="absolute left-8 top-[29px] h-4 w-4 text-muted-foreground" />
        <Input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Bài viết, nhóm, chủ đề..." className="h-12 rounded-full pl-10" />
        {input && <button type="button" aria-label="Xoá" onClick={() => { setInput(''); setTerm(''); }} className="absolute right-8 top-[27px]"><X className="h-5 w-5 text-muted-foreground" /></button>}
      </form>
      {!term ? (
        <div className="px-5 pt-5">
          {history.length > 0 && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tìm gần đây</p>}
          {history.map((h) => <button key={h} onClick={() => { setInput(h); run(h); }} className="flex w-full items-center gap-3 py-2.5 text-left text-sm"><Clock className="h-4 w-4 text-muted-foreground" />{h}</button>)}
        </div>
      ) : (
        <Tabs defaultValue="a" className="px-5 pt-4">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted p-1">
            <TabsTrigger value="a" className="rounded-full text-xs">Bài viết</TabsTrigger>
            <TabsTrigger value="g" className="rounded-full text-xs">Nhóm</TabsTrigger>
            <TabsTrigger value="t" className="rounded-full text-xs">Chủ đề</TabsTrigger>
          </TabsList>
          <TabsContent value="a">{articles.isLoading && <p className="py-8 text-center text-sm">Đang tìm...</p>}{articles.data?.map((a) => <ArticleCard key={a.id} a={a} />)}{empty(articles)}</TabsContent>
          <TabsContent value="g" className="space-y-3 pt-3">
            {groups.data?.map((g) => (
              <Link key={g.id} to={`/nhom/${g.id}`} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
                <CoverImage src={g.logo} className="h-12 w-12 rounded-xl" /><div><p className="font-semibold">{g.name}</p><p className="text-xs text-muted-foreground">{g.member_count} thành viên</p></div>
              </Link>
            ))}{empty(groups)}
          </TabsContent>
          <TabsContent value="t" className="space-y-3 pt-3">
            {topics.data?.map((t) => (
              <Link key={t.id} to={`/chu-de/${t.id}`} className="block rounded-2xl border bg-card p-3"><p className="font-semibold">{t.title}</p><p className="text-xs text-muted-foreground">{t.reply_count} trả lời</p></Link>
            ))}{empty(topics)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}