import React, { useState } from 'react';
import { Lock, X, Check, KeyRound } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  title?: string;
  expectedPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  title = 'Masukkan PIN Akses Admin',
  expectedPin,
  onSuccess,
  onClose
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === expectedPin || newPin === '9999' || newPin === '1234') {
          onSuccess();
          setPin('');
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
            <Lock className="w-4 h-4" />
            <span>SECURITY VERIFICATION</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold mb-1 text-center font-mono">{title}</h3>
        <p className="text-xs text-neutral-400 text-center mb-6">
          Masukkan 4 digit PIN untuk membuka kontrol admin
        </p>

        {/* PIN Display Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-2xl font-mono transition-all ${
                error
                  ? 'border-red-500 bg-red-950/50 text-red-400 animate-shake'
                  : pin.length > i
                  ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'border-neutral-700 bg-neutral-800 text-neutral-500'
              }`}
            >
              {pin.length > i ? '★' : ''}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center font-mono mb-4 animate-bounce">
            ⚠️ PIN Salah! Gunakan PIN Admin / Default (9999 / 1234)
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="h-14 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 font-mono text-xl font-bold border border-neutral-700 text-neutral-100 transition shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xs font-mono font-semibold text-neutral-400 border border-neutral-700 transition"
          >
            DEL
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="h-14 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 font-mono text-xl font-bold border border-neutral-700 text-neutral-100 transition"
          >
            0
          </button>
          <button
            onClick={() => {
              // Quick bypass hint button
              setPin('1234');
              handleNumClick('');
            }}
            className="h-14 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-mono text-xs font-bold border border-amber-500/40 transition flex flex-col items-center justify-center"
          >
            <KeyRound className="w-4 h-4 mb-0.5" />
            <span>DEMO</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-neutral-500 font-mono">
          Default Admin PIN: <span className="text-amber-400 font-bold">1234</span> or <span className="text-amber-400 font-bold">9999</span>
        </p>
      </div>
    </div>
  );
};
