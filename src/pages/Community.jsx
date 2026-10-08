import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/app/PageHeader';
import Feed from '@/components/app/Feed';
import CommunityCover from '@/components/app/CommunityCover';
import GroupsTab from '@/components/app/GroupsTab';
import ForumTab from '@/components/app/ForumTab';
import AlbumsTab from '@/components/app/AlbumsTab';

const TABS = [['feed', 'Bảng tin'], ['groups', 'Nhóm'], ['forum', 'Diễn đàn'], ['photos', 'Ảnh']];

export default function Community() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'feed';
  return (
    <div>
      <PageHeader title="Cộng đồng" />
      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v }, { replace: true })} className="px-5 pt-4">
        <TabsList className="grid h-11 w-full grid-cols-4 rounded-full bg-muted p-1">
          {TABS.map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full text-xs data-[state=active]:bg-[#C9A227] data-[state=active]:text-[#2b2108]">{l}</TabsTrigger>
          ))}
        </TabsList>
        <div className="pt-4">
          <TabsContent value="feed" className="space-y-4"><CommunityCover /><Feed /></TabsContent>
          <TabsContent value="groups"><GroupsTab /></TabsContent>
          <TabsContent value="forum"><ForumTab /></TabsContent>
          <TabsContent value="photos"><AlbumsTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}