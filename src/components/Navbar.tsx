import React, { useState, useEffect } from 'react';
import { User, StoreSettings, ActiveTab } from '../types';
import { Camera, ShieldCheck, LayoutDashboard, Settings, Maximize2, Minimize2, LogOut, Receipt, UserCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: ActiveTab;
  setTab: (tab: ActiveTab) => void;
  currentUser: User;
  settings: StoreSettings;
  onRequestAdmin: () => void;
  onSwitchUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  currentUser,
  settings,
  onRequestAdmin,
  onSwitchUser
}) => {
  const [time, setTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b-2 border-neutral-800 text-white px-4 lg:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Kiosk Status */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setTab('kiosk')}
            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 px-3 py-1.5 rounded-xl font-mono font-black text-sm tracking-wider shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition"
          >
            <Receipt className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">{settings.storeName || 'RECEIPT SNAP'}</span>
            <span className="bg-neutral-950 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              GEN-Z
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BOOTH ONLINE</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-300 font-semibold">{time}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setTab('welcome')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              currentTab === 'welcome'
                ? 'bg-amber-400 text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'text-amber-300 hover:bg-neutral-800 hover:text-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">WELCOME PROMO</span>
          </button>

          <button
            onClick={() => setTab('kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              currentTab === 'kiosk'
                ? 'bg-neutral-100 text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">KIOSK BOOTH</span>
          </button>

          <button
            onClick={() => setTab('user_dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              currentTab === 'user_dashboard' || currentTab === 'gallery'
                ? 'bg-neutral-100 text-neutral-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">USER PANEL</span>
          </button>

          <button
            onClick={onRequestAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition ${
              currentTab === 'admin_dashboard' || currentTab === 'settings'
                ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-neutral-900 border-neutral-700 text-amber-400 hover:bg-amber-400/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ADMIN KONTROL</span>
          </button>
        </nav>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            title="Toggle Tablet Kiosk Fullscreen"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div
            onClick={onSwitchUser}
            className="cursor-pointer flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 pl-2 pr-3 py-1 rounded-xl transition group"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded-lg object-cover border border-neutral-700"
            />
            <div className="hidden lg:block text-left font-mono">
              <p className="text-xs font-bold text-neutral-200 leading-tight group-hover:text-amber-400 transition">
                {currentUser.fullName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-neutral-400 capitalize">
                {currentUser.role === 'admin' ? '⚡ Admin' : '👤 Operator'}
              </p>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition ml-0.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
