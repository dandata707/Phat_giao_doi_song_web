import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';

const PAGES = {
  terms: ['Điều khoản sử dụng', [
    'Phật Giáo Đời Sống là mạng xã hội Phật giáo của Công ty CP Truyền thông Văn hoá Phật giáo Đời sống, giấy phép số 394/GP-BTTTT.',
    'Thành viên chịu trách nhiệm về nội dung do mình đăng tải; không đăng nội dung giả mạo, phản cảm, quấy rối hoặc thông tin sai lệch.',
    'Quản trị viên có quyền ẩn, xoá nội dung vi phạm và khoá tài khoản theo quy định của pháp luật, bao gồm Luật An ninh mạng và Nghị định 72/2013/NĐ-CP.',
  ]],
  privacy: ['Chính sách bảo mật', [
    'Chúng tôi chỉ thu thập thông tin cần thiết để vận hành tài khoản và cộng đồng, theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
    'Thông tin cá nhân không được chia sẻ cho bên thứ ba khi chưa có sự đồng ý của bạn.',
    'Bạn có thể yêu cầu xoá tài khoản bất kỳ lúc nào trong mục Tài khoản.',
  ]],
  contact: ['Liên hệ', []],
};

export default function Legal() {
  const [params] = useSearchParams();
  const key = PAGES[params.get('page')] ? params.get('page') : 'terms';
  const [title, paras] = PAGES[key];
  return (
    <div>
      <PageHeader back title={title} />
      <div className="space-y-4 px-5 py-6 text-[15px] leading-relaxed">
        {paras.map((p, i) => <p key={i}>{p}</p>)}
        {key === 'contact' && (
          <div className="space-y-4">
            <a href="tel:+84778112222" className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#8A6D0B]" />+84 778 112 222</a>
            <a href="mailto:contact.pgds@gmail.com" className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#8A6D0B]" />contact.pgds@gmail.com</a>
            <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-[#8A6D0B]" />Văn phòng: 46 Trương Hán Siêu, Hoàn Kiếm, Hà Nội</p>
            <p className="text-sm text-muted-foreground">Giấy phép mạng xã hội số 394/GP-BTTTT · Công ty CP Truyền thông Văn hoá Phật giáo Đời sống</p>
          </div>
        )}
      </div>
    </div>
  );
}