import React, { useEffect, useState } from 'react';
import { StoreSettings } from '../types';
import { playThermalPrintSound } from '../utils/audio';
import { Printer, Download, QrCode, CheckCircle2, RotateCcw, Sparkles, X, Share2 } from 'lucide-react';

interface ThermalPrintModalProps {
  isOpen: boolean;
  receiptImage: string;
  sessionCode: string;
  settings: StoreSettings;
  onClose: () => void;
  onFinishAndReset: () => void;
}

export const ThermalPrintModal: React.FC<ThermalPrintModalProps> = ({
  isOpen,
  receiptImage,
  sessionCode,
  settings,
  onClose,
  onFinishAndReset
}) => {
  const [isPrinting, setIsPrinting] = useState<boolean>(true);
  const [showQrShare, setShowQrShare] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsPrinting(true);
      if (settings.soundEnabled) {
        playThermalPrintSound(2800);
      }
      const timer = setTimeout(() => {
        setIsPrinting(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, settings.soundEnabled]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = receiptImage;
    link.download = `Receipt-${sessionCode}.png`;
    link.click();
  };

  const handleBrowserPrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt ${sessionCode}</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                img { width: 100%; }
              }
            </style>
          </head>
          <body>
            <img src="${receiptImage}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(settings.qrPayload || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono font-bold text-base">CETAK STRUK THERMAL</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POS Printer Graphic Animation */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Thermal Printer Housing */}
          <div className="relative z-20 w-64 h-16 bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-2xl border-2 border-neutral-700 shadow-xl flex flex-col items-center justify-between p-2">
            <div className="w-48 h-2 bg-neutral-900 rounded-full border border-neutral-800"></div>
            <div className="flex justify-between w-full px-4 items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[9px] text-neutral-400 tracking-widest">
                THERMAL POS 80MM
              </span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">
                {isPrinting ? 'PRINTING...' : 'CUT DONE'}
              </span>
            </div>
            {/* Paper Ejection Mouth */}
            <div className="absolute bottom-0 w-52 h-1 bg-neutral-950 border-t border-amber-400/50"></div>
          </div>

          {/* Unrolling Paper Animation */}
          <div className="relative z-10 w-full flex justify-center -mt-2 overflow-hidden max-h-[380px] p-2">
            <div
              className={`transition-all duration-1000 ease-out transform ${
                isPrinting ? 'translate-y-[-60%] opacity-80' : 'translate-y-0 opacity-100'
              }`}
            >
              <img
                src={receiptImage}
                alt="Printed Receipt"
                className="w-64 h-auto shadow-2xl border border-neutral-800 rounded-b-lg"
              />
            </div>
          </div>
        </div>

        {/* Printing Status Message */}
        {isPrinting ? (
          <div className="text-center font-mono py-2 animate-pulse mb-4">
            <p className="text-amber-400 font-bold text-sm">
              ⚙️ SEDANG MENCETAK STRUK MEMORY...
            </p>
            <p className="text-[11px] text-neutral-400">Mohon tunggu beberapa detik...</p>
          </div>
        ) : (
          <div className="text-center font-mono py-2 mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>STRUK SELESAI DICETAK!</span>
            </p>
          </div>
        )}

        {/* Share & QR Code Drawer */}
        {showQrShare && (
          <div className="mb-4 bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-center space-y-3 font-mono">
            <p className="text-xs font-bold text-amber-400">SCAN QR UNTUK SIMPAN KE HP</p>
            <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
              {/* QR Code graphic simulation */}
              <div className="w-full h-full bg-neutral-950 p-1 flex flex-col justify-between">
                <div className="grid grid-cols-4 gap-1 h-full">
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400">CODE: {sessionCode}</p>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 rounded-lg transition"
            >
              {copied ? '✓ LINK TERSALIN' : 'SALIN LINK GALERI'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3 font-mono">
          <button
            onClick={handleDownload}
            disabled={isPrinting}
            className="py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs rounded-xl border border-neutral-700 transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>UNDUH PNG</span>
          </button>

          <button
            onClick={handleBrowserPrint}
            disabled={isPrinting}
            className="py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs rounded-xl border border-neutral-700 transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>CETAK PRINTER</span>
          </button>
        </div>

        <button
          onClick={() => setShowQrShare(!showQrShare)}
          className="w-full py-2.5 mb-3 bg-neutral-950 hover:bg-neutral-800 text-amber-400 font-mono text-xs font-bold rounded-xl border border-neutral-800 transition flex items-center justify-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          <span>{showQrShare ? 'TUTUP QR SHARE' : 'TAMPILKAN QR SCAN MOBIL'}</span>
        </button>

        {/* Finish & Reset Button */}
        <button
          onClick={onFinishAndReset}
          className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-mono font-black text-sm rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>SELESAI & SIAPKAN FOTO BARU</span>
        </button>
      </div>
    </div>
  );
};
