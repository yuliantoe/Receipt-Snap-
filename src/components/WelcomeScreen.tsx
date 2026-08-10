import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { Camera, Sparkles, Tag, QrCode, ArrowRight, Star, Heart, Flame, ShieldCheck, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  settings: StoreSettings;
  onStartSession: () => void;
  onRequestAdmin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  settings,
  onStartSession,
  onRequestAdmin
}) => {
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  const promoCards = [
    {
      badge: "DESAIN TEMPLATE BARU 📸",
      title: "Magazine Cover & Korean Photobooth",
      desc: "Pilih 5 gaya struk estetik: Magazine Editorial, 인생네컷 Life4Cuts Korea, Hongdae Cafe Receipt & Y2K Cyber!",
      tag: "5 STYLE BARU",
      bg: "from-[#2D2A26] to-[#4A443F]",
      highlightColor: "text-amber-300"
    },
    {
      badge: settings.welcomePromoBadge || "PROMO SPECIAL MAHASISWA & COMM",
      title: "Cetak 2 Struk Foto Instan",
      desc: "Dapatkan Gratis Stiker Custom Y2K & AI Vibe Check Score untuk setiap sesi cetak hari ini!",
      tag: "DISKON 20%",
      bg: "from-[#8C8679] to-[#70695F]",
      highlightColor: "text-amber-200"
    },
    {
      badge: "DIGITAL GALLERY SYNC 📱",
      title: "Dapatkan Softcopy HD + QR",
      desc: "Scan QR Code pada cetakan struk milikmu untuk langsung mendownload file foto digital & video GIF live!",
      tag: "FREE QR DOWNLOAD",
      bg: "from-[#3E3A35] to-[#2B2825]",
      highlightColor: "text-[#E8DCC4]"
    }
  ];

  // Auto rotate promo slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promoCards.length]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#FAF9F6] text-[#2D2A26] font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#E5E0D5] shadow-sm overflow-hidden select-none">
      
      {/* Subtle Background Pattern & Soft Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#DED9CF_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F2EDE4] rounded-full blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E5DFD5] rounded-full blur-3xl opacity-70 pointer-events-none"></div>

      {/* Top Header & Branding Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#2D2A26] text-[#FAF9F6] flex items-center justify-center font-bold shadow-md">
            <Camera className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black tracking-tight text-2xl text-[#2D2A26]">
                {settings.storeName || "SNAP & RECEIPT"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2EDE4] border border-[#DED9CF] text-[10px] font-mono font-bold text-[#8C8679] uppercase tracking-wider">
                THERMAL KIOSK
              </span>
            </div>
            <p className="text-xs text-[#70695F] font-mono">
              {settings.slogan || "Gen-Z Thermal Memory Kiosk"} • {settings.address}
            </p>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#E5E0D5] px-4 py-2 rounded-2xl shadow-sm">
          <div className="text-right font-mono">
            <span className="block text-[10px] text-[#8C8679] uppercase tracking-wider font-bold">Harga Sesi Foto</span>
            <span className="text-lg font-black text-[#2D2A26]">
              {settings.currencySymbol}{(settings.pricePerPrint || 25000).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#F2EDE4] border border-[#DED9CF] flex items-center justify-center text-[#2D2A26]">
            <Tag className="w-4 h-4 text-amber-700" />
          </div>
        </div>
      </div>

      {/* Main Center Area: Promo Showcase + Sample Thermal Strips */}
      <div className="relative z-10 my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Promo Banner Carousel & Headlines */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Title Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EDE4] border border-[#DED9CF] text-xs font-mono font-bold text-[#2D2A26]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{settings.welcomePromoBadge || "PROMO MAHASISWA & COMMUNITY DISKON 20%"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal italic tracking-tight text-[#2D2A26] leading-none">
            {settings.welcomePromoTitle || "CETAK STRUK FOTO ESTETIK 📸"}
          </h1>

          <p className="text-base sm:text-lg text-[#70695F] max-w-xl font-sans leading-relaxed">
            {settings.welcomePromoSubtitle || "Abadikan Momen Manismu dalam Struk Thermal Vintage. Hasil Instan, AI Vibe Score & Siap Dipajang!"}
          </p>

          {/* Active Promo Card Container */}
          <div className="relative mt-4">
            <div className={`p-6 rounded-3xl bg-gradient-to-r ${promoCards[activePromoIndex].bg} text-white shadow-lg border border-white/10 transition-all duration-500`}>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wider uppercase text-amber-200">
                  {promoCards[activePromoIndex].badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-[#2D2A26] text-xs font-black font-mono">
                  {promoCards[activePromoIndex].tag}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">
                {promoCards[activePromoIndex].title}
              </h3>
              <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                {promoCards[activePromoIndex].desc}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 mt-3 justify-start">
              {promoCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromoIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activePromoIndex === idx ? 'w-8 bg-[#2D2A26]' : 'w-2 bg-[#DED9CF]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Value Propositions / Key Features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className="text-[11px] font-bold text-[#2D2A26]">10 DETIK</p>
                <p className="text-[9px] text-[#8C8679]">Cetak Instan</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className="text-[11px] font-bold text-[#2D2A26]">Y2K STIKER</p>
                <p className="text-[9px] text-[#8C8679]">Gratis Custom</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5">
              <QrCode className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className="text-[11px] font-bold text-[#2D2A26]">QR GALERI</p>
                <p className="text-[9px] text-[#8C8679]">Digital File</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview of Thermal Receipt Strips */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm bg-white p-5 rounded-[32px] border-2 border-[#E5E0D5] shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300">
            
            {/* Paper Header Cut Detail */}
            <div className="border-b-2 border-dashed border-[#2D2A26] pb-3 text-center font-mono">
              <p className="text-xs font-black tracking-widest text-[#2D2A26] uppercase">
                {settings.logoText || "[★ SNAP & RECEIPT ★]"}
              </p>
              <p className="text-[10px] text-[#8C8679] mt-0.5">
                {settings.headerNote || "--- OFFICIAL PHOTO RECEIPT ---"}
              </p>
            </div>

            {/* Simulated Receipt Photo Strip */}
            <div className="my-4 space-y-2.5 bg-[#FAF9F6] p-3 rounded-2xl border border-[#E5E0D5]">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#2D2A26]/20 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80"
                  alt="Sample Thermal Photo"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  POS #1
                </span>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#2D2A26]/20 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80"
                  alt="Sample Thermal Photo 2"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  POS #2
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#DED9CF] font-mono text-center">
                <p className="text-xs font-bold text-[#2D2A26]">AI VIBE SCORE: 9999 AURA</p>
                <p className="text-[10px] text-[#70695F] italic mt-0.5">"Main Character Energy Approved ★"</p>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="border-t border-dashed border-[#2D2A26] pt-3 font-mono text-center text-[10px] text-[#8C8679] space-y-1">
              <p className="font-bold text-[#2D2A26]">{settings.footerNote || "NO REFUNDS ON GOOD VIBES! ★★★★★"}</p>
              <div className="flex justify-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-[#F2EDE4] rounded text-[9px] font-bold text-[#2D2A26]">QRIS</span>
                <span className="px-2 py-0.5 bg-[#F2EDE4] rounded text-[9px] font-bold text-[#2D2A26]">GOPAY</span>
                <span className="px-2 py-0.5 bg-[#F2EDE4] rounded text-[9px] font-bold text-[#2D2A26]">CASH</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Call to Action Section */}
      <div className="relative z-10 pt-4 border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left font-mono">
          <p className="text-xs text-[#8C8679] font-bold uppercase tracking-wider">
            Sistem Kiosk Siap Digunakan
          </p>
          <p className="text-sm text-[#2D2A26]">
            Sentuh tombol untuk memulai sesi foto baru
          </p>
        </div>

        {/* Pulsing Main CTA Button */}
        <button
          onClick={onStartSession}
          className="group relative w-full sm:w-auto px-8 py-4 bg-[#2D2A26] hover:bg-black active:scale-95 text-[#FAF9F6] rounded-2xl font-mono font-bold text-base flex items-center justify-center gap-3 shadow-xl transition-all duration-200 overflow-hidden cursor-pointer"
        >
          {/* Subtle animated light gleam effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          
          <Camera className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wider">SENTUH LAYAR UNTUK MULAI</span>
          <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onRequestAdmin}
          className="text-xs font-mono text-[#8C8679] hover:text-[#2D2A26] underline"
        >
          Akses Admin Operator
        </button>
      </div>

    </div>
  );
};
