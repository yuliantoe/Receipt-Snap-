import React, { useState, useEffect } from 'react';
import { StoreSettings, ThermalFilter, LayoutMode, ReceiptItem, User, ReceiptStyle } from '../types';
import { STICKERS_LIST } from '../data/initialData';
import { renderThermalReceiptCanvas } from '../utils/canvasRenderer';
import { Sparkles, Printer, Plus, Trash2, Wand2, Tag, ArrowLeft, RefreshCw, Stamp, User as UserIcon, LayoutTemplate } from 'lucide-react';

interface ReceiptEditorProps {
  photos: string[];
  layout: LayoutMode;
  settings: StoreSettings;
  currentUser: User;
  onBackToBooth: () => void;
  onProceedToPrint: (renderedReceiptDataUrl: string, items: ReceiptItem[], filter: ThermalFilter, stickers: string[], customerName: string, motto: string, vibeRating: string) => void;
}

export const ReceiptEditor: React.FC<ReceiptEditorProps> = ({
  photos,
  layout,
  settings,
  currentUser,
  onBackToBooth,
  onProceedToPrint
}) => {
  const [filter, setFilter] = useState<ThermalFilter>(settings.defaultFilter || 'monochrome');
  const [receiptStyle, setReceiptStyle] = useState<ReceiptStyle>(settings.defaultReceiptStyle || 'korean_life4cuts');
  const [customerName, setCustomerName] = useState<string>('Mbak/Mas Kece');
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['PAID IN FULL', '100% CUTE']);
  const [items, setItems] = useState<ReceiptItem[]>(
    settings.customPresetItems && settings.customPresetItems.length > 0
      ? settings.customPresetItems
      : [
          { name: '1x Main Character Pose', price: 'Rp 15.000' },
          { name: '1x Photo Strip Print 80mm', price: 'Rp 10.000' }
        ]
  );
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('Rp 5.000');
  const [motto, setMotto] = useState<string>('Certified Main Character Energy ★★★★★');
  const [vibeRating, setVibeRating] = useState<string>('9999 AURA POINTS');

  const [renderedReceiptUrl, setRenderedReceiptUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Re-render thermal receipt canvas whenever filters, style, stickers, or items change
  useEffect(() => {
    let isMounted = true;
    async function updateCanvas() {
      setIsRendering(true);
      try {
        const url = await renderThermalReceiptCanvas({
          photos,
          settings,
          filter,
          layout,
          receiptStyle,
          items,
          sessionCode: `RCPT-${Math.floor(10000 + Math.random() * 90000)}`,
          userName: currentUser.fullName,
          customerName,
          selectedStickers,
          motto,
          vibeRating
        });
        if (isMounted) {
          setRenderedReceiptUrl(url);
        }
      } catch (err) {
        console.error('Error rendering receipt canvas:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    }

    updateCanvas();
    return () => {
      isMounted = false;
    };
  }, [photos, layout, filter, receiptStyle, items, customerName, selectedStickers, motto, vibeRating, settings, currentUser]);

  const toggleSticker = (label: string) => {
    if (selectedStickers.includes(label)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== label));
    } else {
      if (selectedStickers.length < 3) {
        setSelectedStickers([...selectedStickers, label]);
      }
    }
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setItems([...items, { name: newItemName.trim(), price: newItemPrice.trim() || 'Rp 0' }]);
    setNewItemName('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Generate AI Vibe Check via Server API
  const handleAiVibeCheck = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: 'Gen-Z Millennial Photobooth',
          photoCount: photos.length
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
        if (data.motto) setMotto(data.motto);
        if (data.vibeRating) setVibeRating(data.vibeRating);
      }
    } catch (e) {
      console.warn('AI Vibe call error', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const styleOptions: { id: ReceiptStyle; label: string; badge: string; desc: string; icon: string }[] = [
    { id: 'korean_life4cuts', label: '인생네컷 Life4Cuts', badge: 'KOREAN ★', desc: 'Frame photobooth Korea estetik ♡', icon: '📸' },
    { id: 'magazine_cover', label: 'Magazine Cover', badge: 'EDITORIAL', desc: 'Headline sampul majalah fashion', icon: '📰' },
    { id: 'korean_cafe', label: 'Korean Cafe Receipt', badge: 'SEOUL ☕', desc: 'Struk kasir cafe Seongsu / Hongdae', icon: '☕' },
    { id: 'y2k_korean', label: 'Y2K Cyber Korean', badge: 'K-CYBER', desc: 'Piksel Y2K & score K-AURA 9999', icon: '👾' },
    { id: 'magazine_lookbook', label: 'Magazine Lookbook', badge: 'CATALOG', desc: 'Katalog lookbook fashion minimalis', icon: '🎨' },
    { id: 'classic_thermal', label: 'Classic Thermal', badge: 'VINTAGE', desc: 'Struk kasir thermal 80mm standar', icon: '🧾' }
  ];

  const filterOptions: { id: ThermalFilter; label: string; desc: string }[] = [
    { id: 'monochrome', label: 'Monochrome', desc: 'Klasik Thermal 80mm' },
    { id: 'halftone', label: 'Halftone Dots', desc: 'Dot Matrix Cetak' },
    { id: 'cyberpunk', label: 'Cyber Matrix', desc: 'Green Cyberpunk' },
    { id: 'high_contrast', label: 'High Contrast', desc: 'Tegas Punchy' },
    { id: 'vintage', label: 'Vintage Warm', desc: 'Sepia Nostalgia' },
    { id: 'inverted', label: 'Inverted Dark', desc: 'Negatif Putih-Hitam' },
    { id: 'soft_grain', label: 'Soft Grain', desc: 'Lembut Bintik Grain' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Back Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToBooth}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-xl font-mono text-xs font-bold text-neutral-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE KAMERA</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-400">OPERATOR:</span>
          <span className="font-mono text-xs font-bold text-amber-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            {currentUser.fullName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Customer Name & AI Vibe Generator */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-amber-400">
                <UserIcon className="w-4 h-4" />
                <span>NAMA PELANGGAN & AI VIBE CHECK</span>
              </div>

              {settings.enableAiVibeCheck && (
                <button
                  onClick={handleAiVibeCheck}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? 'GENERATE AI...' : 'AI AUTO VIBE'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  NAMA GUEST / PELANGGAN:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Maya & Budi"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-sm font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  MOTTO / SLOGAN STRUK:
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Contoh: Certified Vibe Approved ★"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-sm font-mono text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 1B: Receipt Template Style Picker (Magazine, Korean & Custom Templates) */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                <span>PILIH DESAIN TEMPLATE STRUK</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {styleOptions.length + (settings.customReceiptTemplates?.length || 0)} TEMPLATE
              </span>
            </div>

            {/* Custom Operator Created Templates */}
            {settings.customReceiptTemplates && settings.customReceiptTemplates.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>TEMPLATE DESAIN CUSTOM OPERATOR:</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {settings.customReceiptTemplates.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => {
                        setReceiptStyle(ct.baseStyle);
                        if (ct.defaultMotto) setMotto(ct.defaultMotto);
                        if (ct.defaultVibeRating) setVibeRating(ct.defaultVibeRating);
                      }}
                      className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 text-left font-mono transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{ct.icon || '🎨'}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950">
                          {ct.badge}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white leading-snug">{ct.name}</p>
                        <p className="text-[10px] text-amber-300/70 mt-0.5 line-clamp-1">{ct.description || ct.headerNote}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Base Templates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {styleOptions.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setReceiptStyle(st.id)}
                  className={`p-3 rounded-xl border text-left font-mono transition flex flex-col justify-between ${
                    receiptStyle === st.id
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{st.icon}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                      {st.badge}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white leading-snug">{st.label}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{st.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Thermal Filter Picker */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>EFEK FILTER THERMAL</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">DITHER MATRIX: 80MM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  className={`p-3 rounded-xl border text-left font-mono transition flex flex-col justify-between ${
                    filter === opt.id
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold text-xs">{opt.label}</span>
                  <span className="text-[10px] text-neutral-500 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Gen-Z Stickers & Stamps */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2">
                <Stamp className="w-4 h-4" />
                <span>STAMPER & STIKER GEN-Z (MAX 3)</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                TERPILIH: {selectedStickers.length}/3
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {STICKERS_LIST.map((st) => {
                const isSelected = selectedStickers.includes(st.label);
                return (
                  <button
                    key={st.id}
                    onClick={() => toggleSticker(st.label)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Itemized Receipt Table Editor */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>ITEM BREAKDOWN STRUK KASIR</span>
              </span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl font-mono text-xs"
                >
                  <span className="text-neutral-200 font-semibold">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{item.price}</span>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
              <input
                type="text"
                placeholder="Nama Item (misal: 1x Unlimited Aura)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Harga (misal: Rp 10.000)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-28 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-400"
              />
              <button
                onClick={handleAddItem}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Rendered Thermal Receipt Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 mb-4 font-mono">
              <span className="text-xs font-bold text-neutral-300">LIVE PREVIEW STRUK</span>
              {isRendering ? (
                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> RENDERING...
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">READY TO PRINT</span>
              )}
            </div>

            {/* Simulated Long Thermal Paper Preview */}
            <div className="relative w-full max-w-[340px] bg-neutral-950 p-2 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner max-h-[580px] overflow-y-auto">
              {renderedReceiptUrl ? (
                <img
                  src={renderedReceiptUrl}
                  alt="Thermal Receipt Preview"
                  className="w-full h-auto rounded shadow-lg mx-auto"
                />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center font-mono text-xs text-neutral-500">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                  <span>Mempersiapkan gambar struk...</span>
                </div>
              )}
            </div>

            {/* Print Action Button */}
            <button
              onClick={() =>
                onProceedToPrint(
                  renderedReceiptUrl,
                  items,
                  filter,
                  selectedStickers,
                  customerName,
                  motto,
                  vibeRating
                )
              }
              disabled={!renderedReceiptUrl || isRendering}
              className="w-full mt-5 py-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-mono font-black text-lg rounded-2xl shadow-[0_6px_0px_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-3"
            >
              <Printer className="w-6 h-6 stroke-[2.5]" />
              <span>CETAK STRUK SEKARANG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
