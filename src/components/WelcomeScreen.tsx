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

  const currentTheme = settings.welcomeCoverTheme || 'warm_minimal';

  const themeStyles = {
    warm_minimal: {
      outerBg: 'bg-[#FAF9F6] text-[#2D2A26]',
      pattern: 'bg-[radial-gradient(#DED9CF_1px,transparent_1px)] opacity-40',
      glowTop: 'bg-[#F2EDE4]',
      glowBottom: 'bg-[#E5DFD5]',
      borderHeader: 'border-[#E5E0D5]',
      logoIconBg: 'bg-[#2D2A26] text-[#FAF9F6]',
      titleText: 'text-[#2D2A26]',
      subText: 'text-[#70695F]',
      badgeBg: 'bg-[#F2EDE4] border-[#DED9CF] text-[#2D2A26]',
      cardBg: 'bg-white border-[#E5E0D5]',
      accentBtn: 'bg-[#2D2A26] hover:bg-black text-[#FAF9F6]',
      receiptBg: 'bg-white border-[#E5E0D5]',
      pricingBg: 'bg-white/80 border-[#E5E0D5]',
      hangulTag: null
    },
    korean_seoul: {
      outerBg: 'bg-[#FFF0F4] text-[#4A1525]',
      pattern: 'bg-[radial-gradient(#FFC2D1_1px,transparent_1px)] opacity-60',
      glowTop: 'bg-[#FFD6E0]',
      glowBottom: 'bg-[#FFB3C6]',
      borderHeader: 'border-[#FFC2D1]',
      logoIconBg: 'bg-[#FF2A6D] text-white',
      titleText: 'text-[#880E4F]',
      subText: 'text-[#80103B]',
      badgeBg: 'bg-[#FFE4E8] border-[#FFB8C6] text-[#D6336C]',
      cardBg: 'bg-white/95 border-[#FFB8C6]',
      accentBtn: 'bg-[#FF2A6D] hover:bg-[#E01E5A] text-white shadow-lg shadow-[#FF2A6D]/30',
      receiptBg: 'bg-white border-[#FFB8C6]',
      pricingBg: 'bg-white/90 border-[#FFC2D1]',
      hangulTag: '인생네컷 ★ KOREAN PHOTOBOOTH'
    },
    cyber_y2k: {
      outerBg: 'bg-[#0B0C10] text-[#E0F7FA]',
      pattern: 'bg-[radial-gradient(#00F0FF_1px,transparent_1px)] opacity-20',
      glowTop: 'bg-[#00F0FF]/20',
      glowBottom: 'bg-[#FF007F]/20',
      borderHeader: 'border-[#00F0FF]/30',
      logoIconBg: 'bg-[#00F0FF] text-black',
      titleText: 'text-[#00F0FF]',
      subText: 'text-[#80DEEA]',
      badgeBg: 'bg-[#00F0FF]/10 border-[#00F0FF]/50 text-[#00F0FF]',
      cardBg: 'bg-neutral-900/90 border-[#00F0FF]/30',
      accentBtn: 'bg-[#00F0FF] hover:bg-[#00D0E0] text-black font-black shadow-[0_0_25px_rgba(0,240,255,0.4)]',
      receiptBg: 'bg-neutral-900 border-[#00F0FF]/40 text-[#E0F7FA]',
      pricingBg: 'bg-neutral-900/80 border-[#00F0FF]/30',
      hangulTag: 'Y2K CYBER K-AURA 9999'
    },
    magazine_glam: {
      outerBg: 'bg-[#121212] text-[#F8F8F8]',
      pattern: 'bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-15',
      glowTop: 'bg-[#D4AF37]/15',
      glowBottom: 'bg-[#8A7120]/15',
      borderHeader: 'border-[#D4AF37]/30',
      logoIconBg: 'bg-[#D4AF37] text-black',
      titleText: 'text-[#D4AF37]',
      subText: 'text-[#D1C7A5]',
      badgeBg: 'bg-[#D4AF37]/10 border-[#D4AF37]/50 text-[#D4AF37]',
      cardBg: 'bg-neutral-900/90 border-[#D4AF37]/30',
      accentBtn: 'bg-[#D4AF37] hover:bg-[#B89628] text-black font-serif shadow-[0_0_20px_rgba(212,175,55,0.3)]',
      receiptBg: 'bg-neutral-900 border-[#D4AF37]/40 text-[#F8F8F8]',
      pricingBg: 'bg-neutral-900/90 border-[#D4AF37]/30',
      hangulTag: 'EDITORIAL VOGUE LOOKBOOK'
    },
    retro_arcade: {
      outerBg: 'bg-[#1A0B2E] text-[#FFE600]',
      pattern: 'bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] opacity-30',
      glowTop: 'bg-[#8B5CF6]/30',
      glowBottom: 'bg-[#FF5E36]/20',
      borderHeader: 'border-[#8B5CF6]',
      logoIconBg: 'bg-[#FFE600] text-[#1A0B2E]',
      titleText: 'text-[#FFE600]',
      subText: 'text-[#C4B5FD]',
      badgeBg: 'bg-[#8B5CF6]/20 border-[#FFE600] text-[#FFE600]',
      cardBg: 'bg-[#2A124D] border-[#8B5CF6]',
      accentBtn: 'bg-[#FFE600] hover:bg-[#E6C800] text-[#1A0B2E] font-extrabold shadow-[0_0_20px_rgba(255,230,0,0.4)]',
      receiptBg: 'bg-[#2A124D] border-[#FFE600]/40 text-white',
      pricingBg: 'bg-[#2A124D]/90 border-[#8B5CF6]',
      hangulTag: 'PRESS START 🕹️ 80s KIOSK'
    }
  };

  const ts = themeStyles[currentTheme] || themeStyles.warm_minimal;

  return (
    <div className={`fixed inset-0 z-50 w-screen h-screen min-h-screen ${ts.outerBg} font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto select-none`}>
      
      {/* Subtle Background Pattern & Soft Glows */}
      <div className={`absolute inset-0 pointer-events-none ${ts.pattern} [background-size:16px_16px]`}></div>
      <div className={`absolute -top-24 -left-24 w-96 h-96 ${ts.glowTop} rounded-full blur-3xl opacity-70 pointer-events-none`}></div>
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 ${ts.glowBottom} rounded-full blur-3xl opacity-70 pointer-events-none`}></div>

      {/* Top Header & Branding Bar */}
      <div className={`relative z-10 flex flex-wrap items-center justify-between gap-4 border-b ${ts.borderHeader} pb-5`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl ${ts.logoIconBg} flex items-center justify-center font-bold shadow-md`}>
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-serif font-black tracking-tight text-2xl ${ts.titleText}`}>
                {settings.storeName || "SNAP & RECEIPT"}
              </span>
              {ts.hangulTag && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/40 text-[9px] font-mono font-bold text-pink-500 uppercase tracking-wider">
                  {ts.hangulTag}
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${ts.badgeBg}`}>
                THERMAL KIOSK
              </span>
            </div>
            <p className={`text-xs font-mono ${ts.subText}`}>
              {settings.slogan || "Gen-Z Thermal Memory Kiosk"} • {settings.address}
            </p>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className={`flex items-center gap-3 border px-4 py-2 rounded-2xl shadow-sm ${ts.pricingBg}`}>
          <div className="text-right font-mono">
            <span className={`block text-[10px] uppercase tracking-wider font-bold ${ts.subText}`}>Harga Sesi Foto</span>
            <span className={`text-lg font-black ${ts.titleText}`}>
              {settings.currencySymbol}{(settings.pricePerPrint || 25000).toLocaleString('id-ID')}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${ts.badgeBg}`}>
            <Tag className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Center Area: Promo Showcase + Sample Thermal Strips */}
      <div className="relative z-10 my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Promo Banner Carousel & Headlines */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Title Banner */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold ${ts.badgeBg}`}>
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{settings.welcomePromoBadge || "PROMO MAHASISWA & COMMUNITY DISKON 20%"}</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-normal italic tracking-tight leading-none ${ts.titleText}`}>
            {settings.welcomePromoTitle || "CETAK STRUK FOTO ESTETIK 📸"}
          </h1>

          <p className={`text-base sm:text-lg max-w-xl font-sans leading-relaxed ${ts.subText}`}>
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
                    activePromoIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-neutral-400/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Value Propositions / Key Features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${ts.cardBg}`}>
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className={`text-[11px] font-bold ${ts.titleText}`}>10 DETIK</p>
                <p className={`text-[9px] ${ts.subText}`}>Cetak Instan</p>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${ts.cardBg}`}>
              <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className={`text-[11px] font-bold ${ts.titleText}`}>Y2K STIKER</p>
                <p className={`text-[9px] ${ts.subText}`}>Gratis Custom</p>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${ts.cardBg}`}>
              <QrCode className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="text-left font-mono">
                <p className={`text-[11px] font-bold ${ts.titleText}`}>QR GALERI</p>
                <p className={`text-[9px] ${ts.subText}`}>Digital File</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview of Thermal Receipt Strips */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className={`relative w-full max-w-sm p-5 rounded-[32px] border-2 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300 ${ts.receiptBg}`}>
            
            {/* Paper Header Cut Detail */}
            <div className={`border-b-2 border-dashed ${ts.borderHeader} pb-3 text-center font-mono`}>
              <p className={`text-xs font-black tracking-widest uppercase ${ts.titleText}`}>
                {settings.logoText || "[★ SNAP & RECEIPT ★]"}
              </p>
              <p className={`text-[10px] mt-0.5 ${ts.subText}`}>
                {settings.headerNote || "--- OFFICIAL PHOTO RECEIPT ---"}
              </p>
            </div>

            {/* Simulated Receipt Photo Strip */}
            <div className={`my-4 space-y-2.5 p-3 rounded-2xl border ${ts.cardBg}`}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/20 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80"
                  alt="Sample Thermal Photo"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  POS #1
                </span>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/20 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80"
                  alt="Sample Thermal Photo 2"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  POS #2
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border font-mono text-center ${ts.badgeBg}`}>
                <p className="text-xs font-bold">AI VIBE SCORE: 9999 AURA</p>
                <p className="text-[10px] italic mt-0.5">"Main Character Energy Approved ★"</p>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className={`border-t border-dashed ${ts.borderHeader} pt-3 font-mono text-center text-[10px] space-y-1 ${ts.subText}`}>
              <p className={`font-bold ${ts.titleText}`}>{settings.footerNote || "NO REFUNDS ON GOOD VIBES! ★★★★★"}</p>
              <div className="flex justify-center gap-1.5 pt-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ts.badgeBg}`}>QRIS</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ts.badgeBg}`}>GOPAY</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ts.badgeBg}`}>CASH</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Call to Action Section */}
      <div className={`relative z-10 pt-4 border-t ${ts.borderHeader} flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className="text-center sm:text-left font-mono">
          <p className={`text-xs font-bold uppercase tracking-wider ${ts.subText}`}>
            Sistem Kiosk Siap Digunakan
          </p>
          <p className={`text-sm ${ts.titleText}`}>
            Sentuh tombol untuk memulai sesi foto baru
          </p>
        </div>

        {/* Pulsing Main CTA Button */}
        <button
          onClick={onStartSession}
          className={`group relative w-full sm:w-auto px-8 py-4 active:scale-95 rounded-2xl font-mono font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 overflow-hidden cursor-pointer ${ts.accentBtn}`}
        >
          {/* Subtle animated light gleam effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          
          <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wider">SENTUH LAYAR UNTUK MULAI</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onRequestAdmin}
          className={`text-xs font-mono underline ${ts.subText}`}
        >
          Akses Admin Operator
        </button>
      </div>

    </div>
  );
};
