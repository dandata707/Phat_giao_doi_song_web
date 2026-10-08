import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ChevronRight, FileText, ShieldCheck, Phone, Users } from 'lucide-react';
import PrivacySettings from '@/components/social/PrivacySettings';
import DataExport from '@/components/social/DataExport';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/app/PageHeader';
import ProfileCard from '@/components/app/ProfileCard';
import SettingsPanel from '@/components/app/SettingsPanel';
import DeleteAccount from '@/components/app/DeleteAccount';
import { useMe, canWrite, isEditor } from '@/lib/pgds';

const LINKS = [['terms', 'Điều khoản sử dụng', FileText], ['privacy', 'Chính sách bảo mật', ShieldCheck], ['contact', 'Liên hệ', Phone]];

export default function Account() {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <div><PageHeader title="Tài khoản" /></div>;
  return (
    <div>
      <PageHeader title="Tài khoản" />
      <div className="space-y-5 px-5 pt-4">
        <ProfileCard key={me?.id || 'guest'} me={me} />
        {me && (
          <div className="overflow-hidden rounded-3xl border bg-card">
            <Link to="/cong-tac-vien" className="flex items-center gap-3 border-b px-5 py-4 text-sm last:border-0"><span className="flex-1">{canWrite(me) ? 'Trang cộng tác viên' : 'Bài đăng của tôi'}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>
            {isEditor(me) && <Link to="/bien-tap" className="flex items-center gap-3 border-b px-5 py-4 text-sm last:border-0"><span className="flex-1">Trang biên tập viên</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>}
            {me.role === 'admin' && <Link to="/admin" className="flex items-center gap-3 px-5 py-4 text-sm"><span className="flex-1">Trang quản trị</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>}
          </div>
        )}
        {me && <PrivacySettings me={me} />}
        <SettingsPanel />
        <div className="overflow-hidden rounded-3xl border bg-card">
          {LINKS.map(([p, l, Icon]) => (
            <Link key={p} to={`/dieu-khoan?page=${p}`} className="flex items-center gap-3 border-b px-5 py-4 text-sm last:border-0">
              <Icon className="h-4 w-4 text-[#8A6D0B] dark:text-[#C9A227]" /><span className="flex-1">{l}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
        {me && (
          <div className="pb-4">
            <div className="mb-3"><DataExport me={me} /></div>
            <button onClick={() => base44.auth.logout('/')} className="flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium"><LogOut className="h-4 w-4" />Đăng xuất</button>
            <DeleteAccount me={me} />
          </div>
        )}
        <p className="pb-2 text-center text-[11px] text-muted-foreground">Phật Giáo Đời Sống · Giấy phép 394/GP-BTTTT</p>
      </div>
    </div>
  );
}