import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { REPORT_REASONS, useMe, goLogin } from '@/lib/pgds';

export default function ReportDialog({ open, onOpenChange, targetType, targetId }) {
  const { data: me } = useMe();
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    await base44.entities.Report.create({ target_type: targetType, target_id: targetId, reason, note, reporter_email: me.email, status: 'pending' });
    setBusy(false);
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setReason(''); setNote(''); } }}>
      <DialogContent className="max-w-[92vw] rounded-3xl sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading">Báo cáo nội dung</DialogTitle></DialogHeader>
        {!me ? (
          <div className="space-y-3 text-sm"><p>Bạn cần đăng nhập để gửi báo cáo.</p><Button onClick={goLogin} className="w-full">Đăng nhập</Button></div>
        ) : done ? (
          <p className="py-4 text-sm">Cảm ơn bạn. Báo cáo đã được gửi tới quản trị viên và đang chờ xem xét.</p>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r} className="flex items-center gap-3"><RadioGroupItem value={r} id={r} /><Label htmlFor={r}>{r}</Label></div>
              ))}
            </RadioGroup>
            <Textarea placeholder="Ghi chú thêm (không bắt buộc)" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button disabled={!reason || busy} onClick={submit} className="w-full">{busy ? 'Đang gửi...' : 'Gửi báo cáo'}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}