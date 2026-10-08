import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_URL } from '@/lib/pgds';

export default function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('pgds_splash'));
  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem('pgds_splash', '1');
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
          <motion.img src={LOGO_URL} alt="Phật Giáo Đời Sống" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="w-56" />
          <div className="mt-8 h-1 w-24 rounded-full bg-[#C9A227]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}