import React, { useState } from 'react';
import { User, StoreSettings, PhotoSession, UserRole } from '../types';
import {
  addUser,
  updateUser,
  deleteUser,
  saveSettings,
  getSessions
} from '../utils/storage';
import {
  Users,
  UserPlus,
  Settings,
  BarChart3,
  Receipt,
  ShieldAlert,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  KeyRound,
  Store,
  Sliders,
  Sparkles,
  Download,
  Plus
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
  settings: StoreSettings;
  onSettingsChange: (settings: StoreSettings) => void;
  sessions: PhotoSession[];
  onLaunchKiosk: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  onUsersChange,
  settings,
  onSettingsChange,
  sessions,
  onLaunchKiosk
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'settings' | 'history'>('analytics');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('operator');
  const [newPasscode, setNewPasscode] = useState('0000');
  const [newBooth, setNewBooth] = useState('Booth Tablet #1');

  // Edit App Settings Form State
  const [storeForm, setStoreForm] = useState<StoreSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Preset Item State
  const [presetName, setPresetName] = useState('');
  const [presetPrice, setPresetPrice] = useState('Rp 10.000');

  // Handler: Create New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim()) return;

    const created = addUser({
      fullName: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim() || `${newUsername.trim()}@snapreceipt.com`,
      role: newRole,
      passcode: newPasscode.trim() || '0000',
      assignedBooth: newBooth,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`,
      status: 'active'
    });

    onUsersChange([created, ...users]);

    // Reset Form
    setNewFullName('');
    setNewUsername('');
    setNewEmail('');
    setNewPasscode('0000');
    setShowAddUserModal(false);
  };

  // Handler: Toggle User Status
  const handleToggleUserStatus = (user: User) => {
    const updated: User = {
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active'
    };
    updateUser(updated);
    onUsersChange(users.map((u) => (u.id === user.id ? updated : u)));
  };

  // Handler: Delete User
  const handleDeleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      deleteUser(id);
      onUsersChange(users.filter((u) => u.id !== id));
    }
  };

  // Handler: Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(storeForm);
    onSettingsChange(storeForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Handler: Add Preset Item
  const handleAddPreset = () => {
    if (!presetName.trim()) return;
    const updatedPresets = [
      ...storeForm.customPresetItems,
      { name: presetName.trim(), price: presetPrice.trim() || 'Rp 0' }
    ];
    setStoreForm({ ...storeForm, customPresetItems: updatedPresets });
    setPresetName('');
  };

  const handleRemovePreset = (idx: number) => {
    const updatedPresets = storeForm.customPresetItems.filter((_, i) => i !== idx);
    setStoreForm({ ...storeForm, customPresetItems: updatedPresets });
  };

  // Analytics Calculations
  const totalPrints = sessions.reduce((acc, s) => acc + (s.printsCount || 1), 0);
  const totalRevenue = sessions.length * settings.pricePerPrint;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-white font-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-neutral-950 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-neutral-400 text-xs font-mono">SYSTEM V2.6</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono">DASBOR KONTROL & USERS</h1>
          <p className="text-xs text-neutral-400 font-mono">
            Kelola pengguna, pengaturan cetak thermal, dan pantau performa kiosk tablet.
          </p>
        </div>

        <button
          onClick={onLaunchKiosk}
          className="px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-neutral-950 font-mono font-bold text-sm rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition flex items-center gap-2"
        >
          <Receipt className="w-4 h-4 stroke-[2.5]" />
          <span>BUKA KIOSK PHOTOBOOTH</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-neutral-800 space-x-2 font-mono text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'analytics'
              ? 'bg-neutral-900 text-amber-400 border-t-2 border-x border-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>RINGKASAN & STATISTIK</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'users'
              ? 'bg-neutral-900 text-amber-400 border-t-2 border-x border-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>KONTROL USER ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'settings'
              ? 'bg-neutral-900 text-amber-400 border-t-2 border-x border-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>SETINGAN APLIKASI</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'history'
              ? 'bg-neutral-900 text-amber-400 border-t-2 border-x border-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>RIWAYAT CETAK ({sessions.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg font-mono">
              <span className="text-xs text-neutral-400">TOTAL SESI FOTO</span>
              <p className="text-3xl font-black text-white mt-1">{sessions.length}</p>
              <span className="text-[10px] text-emerald-400">● Live Kiosk Active</span>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg font-mono">
              <span className="text-xs text-neutral-400">TOTAL STRUK TERCETAK</span>
              <p className="text-3xl font-black text-amber-400 mt-1">{totalPrints} Lembar</p>
              <span className="text-[10px] text-neutral-500">Ukuran Paper: {settings.paperWidth}</span>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg font-mono">
              <span className="text-xs text-neutral-400">ESTIMASI OMSET</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                {settings.currencySymbol}
                {totalRevenue.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-neutral-500">
                Rate: {settings.currencySymbol}
                {settings.pricePerPrint.toLocaleString('id-ID')} / print
              </span>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg font-mono">
              <span className="text-xs text-neutral-400">TOTAL USER & KASIR</span>
              <p className="text-3xl font-black text-purple-400 mt-1">{users.length} Akun</p>
              <span className="text-[10px] text-neutral-500">
                {users.filter((u) => u.role === 'admin').length} Admin |{' '}
                {users.filter((u) => u.role === 'operator').length} Operator
              </span>
            </div>
          </div>

          {/* Device & Status Monitor */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 font-mono space-y-4">
            <h3 className="font-bold text-sm text-neutral-200 border-b border-neutral-800 pb-3">
              STATUS HARDWARE & PRINTER THERMAL TABLET
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">KAMERA TABLET:</span>
                <span className="text-emerald-400 font-bold">ONLINE & READY (60 FPS)</span>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">PRINTER THERMAL:</span>
                <span className="text-amber-400 font-bold">
                  {settings.paperWidth} | Dither Matrix {settings.ditherStrength}/10
                </span>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">PIN KIOSK AKSEST:</span>
                <span className="text-neutral-200 font-bold">{settings.kioskPin || '9999'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER CONTROL & USER CREATION */}
      {activeTab === 'users' && (
        <div className="space-y-5 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl">
            <div>
              <h3 className="font-bold text-lg text-white">MANAJEMEN KONTROL USER</h3>
              <p className="text-xs text-neutral-400">
                Buat dan atur hak akses akun Admin dan Operator Kasir Kiosk.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ BUAT USER BARU</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                    <th className="p-4">USER</th>
                    <th className="p-4">USERNAME & EMAIL</th>
                    <th className="p-4">ROLE</th>
                    <th className="p-4">PIN PASSCODE</th>
                    <th className="p-4">BOOTH DITUGASKAN</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-800/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-neutral-700"
                          />
                          <div>
                            <span className="font-bold text-white block">{u.fullName}</span>
                            <span className="text-[10px] text-neutral-500">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-amber-400 font-semibold block">@{u.username}</span>
                        <span className="text-neutral-400 text-[11px]">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                              : 'bg-blue-400/10 text-blue-400 border border-blue-400/30'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-neutral-950 px-2 py-1 rounded text-neutral-300 font-mono">
                          {u.passcode}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300">{u.assignedBooth || 'Booth Main'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                              : 'bg-red-400/10 text-red-400 border border-red-400/30'
                          }`}
                        >
                          {u.status === 'active' ? '● AKTIF' : '○ NON-AKTIF'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 rounded-lg transition"
                          title="Hapus User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BUAT USER BARU */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-2xl font-mono">
            <h3 className="text-xl font-bold mb-1 text-white">BUAT USER BARU</h3>
            <p className="text-xs text-neutral-400 mb-5">
              Isi data lengkap untuk menambahkan operator atau admin baru.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">NAMA LENGKAP:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">USERNAME:</label>
                  <input
                    type="text"
                    required
                    placeholder="budikasi26"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">ROLE AKUN:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                  >
                    <option value="operator">Operator Kasir</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">EMAIL:</label>
                  <input
                    type="email"
                    placeholder="budi@snapreceipt.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">PIN PASSCODE (4 DIGIT):</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="0000"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none text-center font-bold tracking-widest text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">BOOTH / LOKASI TUGAS:</label>
                <input
                  type="text"
                  placeholder="Booth #1 Tablet Central Park"
                  value={newBooth}
                  onChange={(e) => setNewBooth(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-bold transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-bold transition"
                >
                  SIMPAN USER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: APP CONTROL SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 font-mono">
          {/* Section 1: Store Branding */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-amber-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>PENGATURAN IDENTITAS TOKO & HEADLINE STRUK</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">NAMA TOKO / BOOTH:</label>
                <input
                  type="text"
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SLOGAN TOKO:</label>
                <input
                  type="text"
                  value={storeForm.slogan}
                  onChange={(e) => setStoreForm({ ...storeForm, slogan: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">ALAMAT LOKASI:</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">INSTAGRAM HANDLE:</label>
                <input
                  type="text"
                  value={storeForm.instagram}
                  onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-neutral-400 mb-1">FOOTER STRUK MESSAGE:</label>
                <input
                  type="text"
                  value={storeForm.footerNote}
                  onChange={(e) => setStoreForm({ ...storeForm, footerNote: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">BARCODE CODE PAYLOAD:</label>
                <input
                  type="text"
                  value={storeForm.barcodePayload}
                  onChange={(e) => setStoreForm({ ...storeForm, barcodePayload: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Thermal Printing & Kiosk Control */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-amber-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>KONTROL PRINTER THERMAL & KIOSK PIN</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">LEBAR KERTAS THERMAL:</label>
                <select
                  value={storeForm.paperWidth}
                  onChange={(e) => setStoreForm({ ...storeForm, paperWidth: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="80mm">80mm (Standar POS)</option>
                  <option value="58mm">58mm (Mini Portable)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">PIN KIOSK AKSEST (EXIT PIN):</label>
                <input
                  type="text"
                  maxLength={4}
                  value={storeForm.kioskPin}
                  onChange={(e) => setStoreForm({ ...storeForm, kioskPin: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-center font-bold text-amber-400 tracking-widest rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">HARGA CETAK / STRUK:</label>
                <input
                  type="number"
                  value={storeForm.pricePerPrint}
                  onChange={(e) => setStoreForm({ ...storeForm, pricePerPrint: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-neutral-400 mb-1">DEFAULT RECEIPT DESIGN (STYLE):</label>
                <select
                  value={storeForm.defaultReceiptStyle || 'korean_life4cuts'}
                  onChange={(e) => setStoreForm({ ...storeForm, defaultReceiptStyle: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  <option value="korean_life4cuts">📸 인생네컷 Life4Cuts (Korean Photobooth)</option>
                  <option value="magazine_cover">📰 Magazine Cover (Headline Editorial)</option>
                  <option value="korean_cafe">☕ Korean Cafe Receipt (Seongsu/Hongdae)</option>
                  <option value="y2k_korean">👾 Y2K Cyber Korean (Score K-AURA)</option>
                  <option value="magazine_lookbook">🎨 Magazine Lookbook (Minimal Catalog)</option>
                  <option value="classic_thermal">🧾 Classic Thermal 80mm (Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">POTONGAN KERTAS (TEAR STYLE):</label>
                <select
                  value={storeForm.paperTearStyle}
                  onChange={(e) => setStoreForm({ ...storeForm, paperTearStyle: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="zigzag">Zigzag Tooth Edge (Klasik Kasir)</option>
                  <option value="straight">Straight Clean Cut</option>
                </select>
              </div>
            </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={storeForm.soundEnabled}
                    onChange={(e) => setStoreForm({ ...storeForm, soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-400"
                  />
                  <span>Suara Cetak & Shutter Audio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={storeForm.enableAiVibeCheck}
                    onChange={(e) => setStoreForm({ ...storeForm, enableAiVibeCheck: e.target.checked })}
                    className="w-4 h-4 accent-purple-400"
                  />
                  <span>Fitur AI Auto Vibe Check</span>
                </label>
              </div>
          </div>

            {/* Section 2B: Promo Welcome Screen Configuration */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-sm text-amber-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PENGATURAN TAMPILAN WELCOME SCREEN & PROMOSI</span>
              </h3>

              {/* Cover Theme Selection */}
              <div>
                <label className="block text-neutral-300 font-bold mb-2 text-xs flex items-center justify-between">
                  <span>PILIH DESAIN COVER TAMPILAN UTAMA (WELCOME SCREEN):</span>
                  <span className="text-[10px] text-amber-400 font-mono">5 TEMA COVER</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'warm_minimal',
                      label: 'Vintage Thermal Cream',
                      badge: 'CLASSIC 📜',
                      desc: 'Kertas cream warm, font serif & charcoal estetik',
                      bg: 'bg-[#FAF9F6] text-[#2D2A26] border-[#DED9CF]',
                      icon: '📜'
                    },
                    {
                      id: 'korean_seoul',
                      label: 'Korean Soft Pink (인생네컷)',
                      badge: 'SEOUL 🌸',
                      desc: 'Photobooth pastel pink Korea & Hangul vibes',
                      bg: 'bg-[#FFF5F7] text-[#D6336C] border-[#FFE4E8]',
                      icon: '🌸'
                    },
                    {
                      id: 'cyber_y2k',
                      label: 'Cyber Y2K Glitch',
                      badge: 'NEON 👾',
                      desc: 'Dark theme cyberpunk, aksen cyan & magenta',
                      bg: 'bg-[#0B0C10] text-[#00F0FF] border-[#00F0FF]/40',
                      icon: '👾'
                    },
                    {
                      id: 'magazine_glam',
                      label: 'Vogue Magazine Cover',
                      badge: 'LUXURY 📰',
                      desc: 'Hitam emas mewah ala majalah fashion tinggi',
                      bg: 'bg-[#121212] text-[#D4AF37] border-[#D4AF37]/50',
                      icon: '📰'
                    },
                    {
                      id: 'retro_arcade',
                      label: '80s Retro Arcade',
                      badge: 'PIXEL 🎮',
                      desc: 'Kiosk arcade retro 80an dengan warna ungu/kuning',
                      bg: 'bg-[#1A0B2E] text-[#FFE600] border-[#8B5CF6]',
                      icon: '🎮'
                    }
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setStoreForm({ ...storeForm, welcomeCoverTheme: th.id as any })}
                      className={`p-3 rounded-xl border text-left font-mono transition flex flex-col justify-between ${
                        (storeForm.welcomeCoverTheme || 'warm_minimal') === th.id
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)] ring-1 ring-amber-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{th.icon}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${th.bg}`}>
                          {th.badge}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white leading-snug">{th.label}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{th.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-800">
                <div>
                  <label className="block text-neutral-400 mb-1">JUDUL PROMO UTAMA:</label>
                  <input
                    type="text"
                    value={storeForm.welcomePromoTitle || ''}
                    onChange={(e) => setStoreForm({ ...storeForm, welcomePromoTitle: e.target.value })}
                    placeholder="CETAK STRUK FOTO ESTETIK 📸"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

              <div>
                <label className="block text-neutral-400 mb-1">LABEL BADGE PROMO:</label>
                <input
                  type="text"
                  value={storeForm.welcomePromoBadge || ''}
                  onChange={(e) => setStoreForm({ ...storeForm, welcomePromoBadge: e.target.value })}
                  placeholder="PROMO MAHASISWA DISKON 20%"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">DESKRIPSI SUBTITLE WELCOME:</label>
                <input
                  type="text"
                  value={storeForm.welcomePromoSubtitle || ''}
                  onChange={(e) => setStoreForm({ ...storeForm, welcomePromoSubtitle: e.target.value })}
                  placeholder="Abadikan Momen Manismu dalam Struk Thermal Vintage. Hasil Instan & Siap Dipajang!"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={storeForm.enableAutoIdleWelcome ?? true}
                  onChange={(e) => setStoreForm({ ...storeForm, enableAutoIdleWelcome: e.target.checked })}
                  className="w-4 h-4 accent-amber-400"
                />
                <span>Kembali Otomatis ke Welcome Screen Saat Idle</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Timer Idle:</span>
                <select
                  value={storeForm.idleSeconds || 45}
                  onChange={(e) => setStoreForm({ ...storeForm, idleSeconds: Number(e.target.value) })}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-white outline-none"
                >
                  <option value={30}>30 Detik</option>
                  <option value={45}>45 Detik</option>
                  <option value={60}>60 Detik</option>
                  <option value={90}>90 Detik</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Preset Receipt Items */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-amber-400 border-b border-neutral-800 pb-3">
              DAFTAR PRESET ITEM BREAKDOWN STRUK
            </h3>

            <div className="space-y-2">
              {storeForm.customPresetItems.map((preset, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs"
                >
                  <span>{preset.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold">{preset.price}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePreset(idx)}
                      className="text-neutral-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs">
              <input
                type="text"
                placeholder="Nama Preset Item Baru"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Harga (Rp 10.000)"
                value={presetPrice}
                onChange={(e) => setPresetPrice(e.target.value)}
                className="w-32 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none"
              />
              <button
                type="button"
                onClick={handleAddPreset}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH PRESET</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SIMPAN PENGATURAN KONTROL</span>
            </button>

            {settingsSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>PENGATURAN BERHASIL DISIMPAN!</span>
              </span>
            )}
          </div>
        </form>
      )}

      {/* TAB 4: SESSION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4 font-mono">
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5">
            <h3 className="font-bold text-base text-white mb-1">RIWAYAT SESI FOTO & CETAK STRUK</h3>
            <p className="text-xs text-neutral-400">
              Arsip lengkap hasil jepretan dan transaksi photobooth tablet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between text-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-amber-400 font-bold">{s.sessionCode}</span>
                  <span className="text-neutral-500 text-[10px]">
                    {new Date(s.timestamp).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="w-20 h-28 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 flex-shrink-0">
                    <img
                      src={s.photos[0] || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150'}
                      alt="Sample"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-neutral-300">
                    <p className="font-bold text-white">{s.customerName || 'Guest'}</p>
                    <p className="text-[11px] text-neutral-400">Kasir: {s.userName}</p>
                    <p className="text-[11px] text-amber-300">Total: {s.totalAmount}</p>
                    <span className="inline-block bg-neutral-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                      {s.layout.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[11px]">
                  <span className="text-neutral-400">{s.printsCount || 1} Cetakan</span>
                  <span className="text-purple-400 font-bold">{s.vibeRating || 'VIBE MATCH'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
