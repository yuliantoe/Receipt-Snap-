import React from 'react';
import { User, StoreSettings, PhotoSession } from '../types';
import { Camera, Receipt, Clock, Sparkles, UserCheck, Shield, ChevronRight } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  settings: StoreSettings;
  sessions: PhotoSession[];
  onStartBooth: () => void;
  onRequestAdmin: () => void;
  onSwitchUser: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  settings,
  sessions,
  onStartBooth,
  onRequestAdmin,
  onSwitchUser
}) => {
  const userSessions = sessions.filter(
    (s) => s.userId === currentUser.id || s.userName.includes(currentUser.fullName.split(' ')[0])
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 text-white font-sans space-y-6">
      {/* Operator Welcome Banner */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-400 text-neutral-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                OPERATOR ACTIVE
              </span>
              <span className="text-neutral-400 text-xs font-mono">{currentUser.assignedBooth || 'Booth #1'}</span>
            </div>
            <h1 className="text-2xl font-black font-mono">{currentUser.fullName}</h1>
            <p className="text-xs text-neutral-400 font-mono">
              Selamat bertugas! Siapkan tablet dan sambut pelanggan untuk cetak struk memory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartBooth}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-neutral-950 font-mono font-black text-sm rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition flex items-center gap-2"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span>MULAI PHOTOBOOTH</span>
          </button>
        </div>
      </div>

      {/* Operator Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs text-neutral-400">SESI PROSES HARI INI</span>
          <p className="text-3xl font-black text-amber-400 mt-1">{userSessions.length} Sesi</p>
          <span className="text-[10px] text-neutral-500">Kios: {settings.storeName}</span>
        </div>

        <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs text-neutral-400">STATUS PRINTER THERMAL</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">ONLINE</p>
          <span className="text-[10px] text-neutral-500">Ukuran: {settings.paperWidth}</span>
        </div>

        <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
          <span className="text-xs text-neutral-400">KONTROL ADMIN PORTAL</span>
          <button
            onClick={onRequestAdmin}
            className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <Shield className="w-4 h-4" />
            <span>MASUK DASBOR ADMIN</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Operator Session History */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">RIWAYAT CETAK SAYA</h3>
          </div>
          <span className="text-xs text-neutral-400">{userSessions.length} TRANSAKSI</span>
        </div>

        {userSessions.length === 0 ? (
          <div className="py-12 text-center font-mono space-y-3">
            <p className="text-sm text-neutral-400">Belum ada transaksi cetak untuk operator ini.</p>
            <button
              onClick={onStartBooth}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
            >
              <Camera className="w-4 h-4" />
              <span>AMBIL FOTO PERTAMA SEKARANG</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {userSessions.map((s) => (
              <div
                key={s.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex gap-3 text-xs"
              >
                <div className="w-20 h-24 bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-800">
                  <img
                    src={s.photos[0] || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150'}
                    alt="Sample"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-amber-400 font-bold block">{s.sessionCode}</span>
                  <p className="text-white font-bold">{s.customerName || 'Guest'}</p>
                  <p className="text-neutral-400 text-[11px]">{s.totalAmount}</p>
                  <span className="inline-block text-[10px] text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                    {s.vibeRating || 'CERTIFIED VIBE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
