import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMe, goLogin } from '@/lib/pgds';

export default function NewTopicDialog({ forum }) {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const create = async () => {
    await base44.entities.Topic.create({ title: title.trim(), body, forum, author_name: me.full_name || me.email, author_email: me.email, reply_count: 0, member_count: 1 });
    setTitle(''); setBody(''); setOpen(false);
    qc.invalidateQueries({ queryKey: ['topics'] });
  };

  return (
    <>
      <Button size="sm" variant="outline" className="rounded-full" onClick={() => (me ? setOpen(true) : goLogin())}><Plus className="mr-1 h-4 w-4" />Chủ đề mới</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[92vw] rounded-3xl sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Tạo chủ đề mới</DialogTitle></DialogHeader>
          <Input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Nội dung" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button disabled={!title.trim()} onClick={create}>Đăng chủ đề</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}