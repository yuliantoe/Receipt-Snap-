import React, { useState } from 'react';
import {
  User,
  StoreSettings,
  PhotoSession,
  UserRole,
  CustomReceiptTemplate,
  ReceiptStyle,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionPlanConfig,
  UserSubscription
} from '../types';
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
  Plus,
  LayoutTemplate,
  Palette,
  Layers,
  X,
  Crown,
  Calendar,
  Clock,
  Zap,
  Check,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  DollarSign,
  CreditCard
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
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'subscriptions' | 'settings' | 'history'>('analytics');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('operator');
  const [newPasscode, setNewPasscode] = useState('0000');
  const [newBooth, setNewBooth] = useState('Booth Tablet #1');
  const [newSubPlan, setNewSubPlan] = useState<SubscriptionPlan>('monthly');

  // Edit App Settings Form State
  const [storeForm, setStoreForm] = useState<StoreSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // User Subscription Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSubUser, setSelectedSubUser] = useState<User | null>(null);
  const [subModalPlan, setSubModalPlan] = useState<SubscriptionPlan>('monthly');
  const [subModalStatus, setSubModalStatus] = useState<SubscriptionStatus>('active');
  const [subModalDays, setSubModalDays] = useState<number>(30);
  const [subModalPrice, setSubModalPrice] = useState<number>(450000);
  const [subModalNotes, setSubModalNotes] = useState<string>('');
  const [subModalAutoRenew, setSubModalAutoRenew] = useState<boolean>(true);

  // Plan Pricing Config Edit Modal State
  const [showPlanConfigModal, setShowPlanConfigModal] = useState(false);
  const [editingPlanItem, setEditingPlanItem] = useState<SubscriptionPlanConfig | null>(null);
  const [planNameInput, setPlanNameInput] = useState('');
  const [planPriceInput, setPlanPriceInput] = useState(0);
  const [planDaysInput, setPlanDaysInput] = useState(30);
  const [planMaxPrintsInput, setPlanMaxPrintsInput] = useState(300);
  const [planBadgeInput, setPlanBadgeInput] = useState('');
  const [planFeaturesStr, setPlanFeaturesStr] = useState('');
  const [planActiveInput, setPlanActiveInput] = useState(true);

  // Subscription Tab Search & Filter
  const [subTabFilter, setSubTabFilter] = useState<'all' | 'weekly' | 'monthly' | 'yearly' | 'expired'>('all');
  const [subTabSearch, setSubTabSearch] = useState('');

  // Custom Receipt Template Form State
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [editingTmplId, setEditingTmplId] = useState<string | null>(null);
  const [tmplName, setTmplName] = useState('');
  const [tmplBadge, setTmplBadge] = useState('EVENT 🎉');
  const [tmplDesc, setTmplDesc] = useState('');
  const [tmplBaseStyle, setTmplBaseStyle] = useState<ReceiptStyle>('korean_life4cuts');
  const [tmplHeaderNote, setTmplHeaderNote] = useState('--- SPECIAL EVENT PHOTO RECEIPT ---');
  const [tmplFooterNote, setTmplFooterNote] = useState('NO REFUNDS ON GOOD VIBES! ★★★★★');
  const [tmplDefaultMotto, setTmplDefaultMotto] = useState('Special Moment Memory ★★★★★');
  const [tmplDefaultVibe, setTmplDefaultVibe] = useState('100% PERFECT MATCH');
  const [tmplIcon, setTmplIcon] = useState('🎉');

  // New Preset Item State
  const [presetName, setPresetName] = useState('');
  const [presetPrice, setPresetPrice] = useState('Rp 10.000');

  // Helper: Get days remaining
  const getDaysRemaining = (endDateStr?: string): number => {
    if (!endDateStr) return 0;
    const diff = new Date(endDateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Helper: Open Manage User Subscription Modal
  const handleOpenUserSubModal = (user: User) => {
    setSelectedSubUser(user);
    const existingSub = user.subscription;
    if (existingSub) {
      setSubModalPlan(existingSub.plan);
      setSubModalStatus(existingSub.status);
      setSubModalDays(getDaysRemaining(existingSub.endDate) || 30);
      setSubModalPrice(existingSub.pricePaid || 450000);
      setSubModalNotes(existingSub.notes || '');
      setSubModalAutoRenew(existingSub.autoRenew ?? true);
    } else {
      setSubModalPlan('monthly');
      setSubModalStatus('active');
      setSubModalDays(30);
      setSubModalPrice(450000);
      setSubModalNotes('Langganan Kiosk Photobooth');
      setSubModalAutoRenew(true);
    }
    setShowSubModal(true);
  };

  // Handler: Save User Subscription Changes
  const handleSaveUserSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubUser) return;

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + subModalDays * 24 * 60 * 60 * 1000).toISOString();

    let maxPrints = 300;
    if (subModalPlan === 'weekly') maxPrints = 100;
    if (subModalPlan === 'yearly') maxPrints = 1000;
    if (subModalPlan === 'none') maxPrints = 20;

    const updatedUser: User = {
      ...selectedSubUser,
      subscription: {
        plan: subModalPlan,
        status: subModalPlan === 'none' ? 'expired' : subModalStatus,
        startDate,
        endDate,
        autoRenew: subModalAutoRenew,
        pricePaid: subModalPrice,
        maxPrintsPerDay: maxPrints,
        notes: subModalNotes.trim()
      }
    };

    updateUser(updatedUser);
    onUsersChange(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowSubModal(false);
  };

  // Handler: Quick Extend Subscription (7, 30, or 365 Days)
  const handleQuickExtendSub = (user: User, daysToAdd: number, plan: SubscriptionPlan, price: number) => {
    const currentEnd = user.subscription?.endDate ? new Date(user.subscription.endDate).getTime() : Date.now();
    const startBase = currentEnd > Date.now() ? currentEnd : Date.now();
    const newEnd = new Date(startBase + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    const updatedUser: User = {
      ...user,
      subscription: {
        plan,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: newEnd,
        autoRenew: true,
        pricePaid: (user.subscription?.pricePaid || 0) + price,
        maxPrintsPerDay: plan === 'weekly' ? 100 : plan === 'monthly' ? 300 : 1000,
        notes: `Perpanjangan ${daysToAdd} Hari (${plan.toUpperCase()})`
      }
    };

    updateUser(updatedUser);
    onUsersChange(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Handler: Open Edit Plan Config Modal
  const handleOpenEditPlanModal = (planConfig: SubscriptionPlanConfig) => {
    setEditingPlanItem(planConfig);
    setPlanNameInput(planConfig.name);
    setPlanPriceInput(planConfig.price);
    setPlanDaysInput(planConfig.durationDays);
    setPlanMaxPrintsInput(planConfig.maxPrintsPerDay);
    setPlanBadgeInput(planConfig.badge);
    setPlanFeaturesStr((planConfig.features || []).join('\n'));
    setPlanActiveInput(planConfig.isActive);
    setShowPlanConfigModal(true);
  };

  // Handler: Save Plan Config Changes
  const handleSavePlanConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanItem) return;

    const featuresArr = planFeaturesStr
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedPlans = (storeForm.subscriptionPlansConfig || []).map((p) => {
      if (p.id === editingPlanItem.id) {
        return {
          ...p,
          name: planNameInput.trim(),
          price: Number(planPriceInput),
          durationDays: Number(planDaysInput),
          maxPrintsPerDay: Number(planMaxPrintsInput),
          badge: planBadgeInput.trim(),
          features: featuresArr,
          isActive: planActiveInput
        };
      }
      return p;
    });

    const newStoreForm = { ...storeForm, subscriptionPlansConfig: updatedPlans };
    setStoreForm(newStoreForm);
    saveSettings(newStoreForm);
    onSettingsChange(newStoreForm);
    setShowPlanConfigModal(false);
  };

  // Handler: Create New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim()) return;

    let initialDays = 30;
    let initialPrice = 450000;
    let maxPrints = 300;
    if (newSubPlan === 'weekly') { initialDays = 7; initialPrice = 150000; maxPrints = 100; }
    if (newSubPlan === 'yearly') { initialDays = 365; initialPrice = 4500000; maxPrints = 1000; }
    if (newSubPlan === 'none') { initialDays = 0; initialPrice = 0; maxPrints = 20; }

    const created = addUser({
      fullName: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim() || `${newUsername.trim()}@snapreceipt.com`,
      role: newRole,
      passcode: newPasscode.trim() || '0000',
      assignedBooth: newBooth,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`,
      status: 'active',
      subscription: {
        plan: newSubPlan,
        status: newSubPlan === 'none' ? 'expired' : 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + initialDays * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        pricePaid: initialPrice,
        maxPrintsPerDay: maxPrints,
        notes: `Pendaftaran awal paket ${newSubPlan.toUpperCase()}`
      }
    });

    onUsersChange([created, ...users]);

    // Reset Form
    setNewFullName('');
    setNewUsername('');
    setNewEmail('');
    setNewPasscode('0000');
    setNewSubPlan('monthly');
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

  // Handlers for Custom Receipt Templates
  const handleOpenNewTemplateModal = () => {
    setEditingTmplId(null);
    setTmplName('');
    setTmplBadge('EVENT 🎉');
    setTmplDesc('Desain khusus event & promosi photobooth');
    setTmplBaseStyle('korean_life4cuts');
    setTmplHeaderNote('--- SPECIAL EVENT PHOTO RECEIPT ---');
    setTmplFooterNote('NO REFUNDS ON GOOD VIBES! ★★★★★');
    setTmplDefaultMotto('Special Moment Memory ★★★★★');
    setTmplDefaultVibe('100% PERFECT MATCH');
    setTmplIcon('🎉');
    setShowAddTemplateModal(true);
  };

  const handleEditTemplateModal = (tmpl: CustomReceiptTemplate) => {
    setEditingTmplId(tmpl.id);
    setTmplName(tmpl.name);
    setTmplBadge(tmpl.badge || 'CUSTOM 🎨');
    setTmplDesc(tmpl.description || '');
    setTmplBaseStyle(tmpl.baseStyle);
    setTmplHeaderNote(tmpl.headerNote || '');
    setTmplFooterNote(tmpl.footerNote || '');
    setTmplDefaultMotto(tmpl.defaultMotto || '');
    setTmplDefaultVibe(tmpl.defaultVibeRating || '');
    setTmplIcon(tmpl.icon || '🎨');
    setShowAddTemplateModal(true);
  };

  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmplName.trim()) return;

    const newTemplate: CustomReceiptTemplate = {
      id: editingTmplId || `tmpl_${Date.now()}`,
      name: tmplName.trim(),
      badge: tmplBadge.trim() || 'CUSTOM 🎨',
      description: tmplDesc.trim(),
      baseStyle: tmplBaseStyle,
      headerNote: tmplHeaderNote.trim(),
      footerNote: tmplFooterNote.trim(),
      defaultMotto: tmplDefaultMotto.trim(),
      defaultVibeRating: tmplDefaultVibe.trim(),
      icon: tmplIcon || '🎨'
    };

    const existing = storeForm.customReceiptTemplates || [];
    let updated: CustomReceiptTemplate[];
    if (editingTmplId) {
      updated = existing.map((t) => (t.id === editingTmplId ? newTemplate : t));
    } else {
      updated = [...existing, newTemplate];
    }

    const newStoreForm = { ...storeForm, customReceiptTemplates: updated };
    setStoreForm(newStoreForm);
    saveSettings(newStoreForm);
    onSettingsChange(newStoreForm);
    setShowAddTemplateModal(false);
  };

  const handleDeleteCustomTemplate = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus template desain ini?')) {
      const existing = storeForm.customReceiptTemplates || [];
      const updated = existing.filter((t) => t.id !== id);
      const newStoreForm = { ...storeForm, customReceiptTemplates: updated };
      setStoreForm(newStoreForm);
      saveSettings(newStoreForm);
      onSettingsChange(newStoreForm);
    }
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
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition relative ${
            activeTab === 'subscriptions'
              ? 'bg-neutral-900 text-amber-400 border-t-2 border-x border-amber-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>SISTEM LANGGANAN</span>
          <span className="bg-amber-400 text-neutral-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
            {users.filter((u) => u.subscription?.status === 'active' && u.subscription?.plan !== 'none').length}
          </span>
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
                    <th className="p-4">LANGGANAN AKTIF</th>
                    <th className="p-4">BOOTH DITUGASKAN</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((u) => {
                    const daysLeft = getDaysRemaining(u.subscription?.endDate);
                    const subPlan = u.subscription?.plan || 'none';
                    const isSubActive = u.subscription?.status === 'active' && daysLeft > 0;

                    return (
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
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                                subPlan === 'yearly'
                                  ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                                  : subPlan === 'monthly'
                                  ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                  : subPlan === 'weekly'
                                  ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                              }`}
                            >
                              {subPlan === 'weekly'
                                ? '⚡ MINGGUAN'
                                : subPlan === 'monthly'
                                ? '⭐ BULANAN'
                                : subPlan === 'yearly'
                                ? '👑 TAHUNAN'
                                : 'GRATIS'}
                            </span>

                            {subPlan !== 'none' && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  isSubActive
                                    ? 'bg-emerald-400/10 text-emerald-400 font-bold'
                                    : 'bg-red-400/10 text-red-400 font-bold'
                                }`}
                              >
                                {isSubActive ? `${daysLeft} Hari` : 'EXPIRED'}
                              </span>
                            )}
                          </div>
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
                            onClick={() => handleOpenUserSubModal(u)}
                            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                            title="Kelola Langganan User"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>KELOLA</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 rounded-lg transition inline-flex items-center"
                            title="Hapus User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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

              <div>
                <label className="block text-neutral-400 mb-1">PAKET LANGGANAN AWAL:</label>
                <select
                  value={newSubPlan}
                  onChange={(e) => setNewSubPlan(e.target.value as SubscriptionPlan)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-amber-400 font-bold outline-none"
                >
                  <option value="weekly">⚡ MINGGUAN (7 Hari - Rp 150.000)</option>
                  <option value="monthly">⭐ BULANAN (30 Hari - Rp 450.000)</option>
                  <option value="yearly">👑 TAHUNAN (365 Hari - Rp 4.500.000)</option>
                  <option value="none">⚪ TANPA PAKET / TRIAL GRATIS</option>
                </select>
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

          {/* Section 2C: Custom Receipt Design Templates Management */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>KELOLA & TAMBAH DESAIN STRUK / RECEIPT TEMPLATE</span>
              </h3>
              <button
                type="button"
                onClick={handleOpenNewTemplateModal}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH DESAIN RECEIPT BARU</span>
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Buat dan sesuaikan template desain struk khusus untuk event, promo cafe, konser, atau tema seasonal yang dapat dipilih saat cetak foto.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(storeForm.customReceiptTemplates || []).map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-neutral-950 border border-neutral-800 hover:border-amber-400/50 p-4 rounded-xl flex flex-col justify-between space-y-3 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tmpl.icon || '🎨'}</span>
                      <div>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-0.5">
                          {tmpl.badge}
                        </span>
                        <h4 className="font-bold text-xs text-white leading-tight">{tmpl.name}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditTemplateModal(tmpl)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition"
                        title="Edit Template"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomTemplate(tmpl.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
                        title="Hapus Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 text-[10px] font-mono space-y-1">
                    <p className="text-neutral-400 truncate">
                      <span className="text-neutral-500">Header:</span> {tmpl.headerNote || '-'}
                    </p>
                    <p className="text-neutral-400 truncate">
                      <span className="text-neutral-500">Motto:</span> {tmpl.defaultMotto || '-'}
                    </p>
                    <p className="text-amber-300/80 font-bold">
                      Base Style: {tmpl.baseStyle.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}

              {(!storeForm.customReceiptTemplates || storeForm.customReceiptTemplates.length === 0) && (
                <div className="col-span-full p-6 text-center bg-neutral-950 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs font-mono">
                  Belum ada template desain custom. Klik tombol "TAMBAH DESAIN RECEIPT BARU" di atas untuk membuat desain struk pertama Anda!
                </div>
              )}
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

      {/* TAB: SISTEM LANGGANAN & KONTROL LISENSI USER */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6 font-mono">
          {/* Section 1: Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg space-y-1">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>ESTIMASI TRANSAKSI / MRR</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                Rp {users.reduce((sum, u) => sum + (u.subscription?.pricePaid || 0), 0).toLocaleString('id-ID')}
              </p>

              <span className="text-[10px] text-neutral-400 block pt-1">Total pembayaran langganan aktif</span>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg space-y-1">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>PELANGGAN & LISENSI AKTIF</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
                {users.filter((u) => u.subscription?.status === 'active' && u.subscription?.plan !== 'none').length} / {users.length}
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block pt-1">● Semua Tablet Terkoneksi</span>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg space-y-1">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>DISTRIBUSI PAKET</span>
                <Zap className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800">
                  ⚡ {users.filter((u) => u.subscription?.plan === 'weekly').length} Mingguan
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  ⭐ {users.filter((u) => u.subscription?.plan === 'monthly').length} Bulanan
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                  👑 {users.filter((u) => u.subscription?.plan === 'yearly').length} Tahunan
                </span>
              </div>
            </div>

            <div className="bg-neutral-900 border-2 border-neutral-800 p-5 rounded-2xl shadow-lg space-y-1">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>SEGERA KEDALUWARSA</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-red-400 mt-1">
                {users.filter((u) => {
                  const days = getDaysRemaining(u.subscription?.endDate);
                  return u.subscription?.plan !== 'none' && days <= 7;
                }).length} User
              </p>
              <span className="text-[10px] text-red-400/80 block pt-1">Kedaluwarsa dalam ≤ 7 hari</span>
            </div>
          </div>

          {/* Section 2: Pricing Tiers & Config */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>DOKUMEN & PENGATURAN PAKET LANGGANAN (PRICING TIERS)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Atur harga lisensi Mingguan, Bulanan, dan Tahunan serta jumlah kuota cetak per hari untuk pengguna tablet kiosk.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(storeForm.subscriptionPlansConfig || []).map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-neutral-950 border-2 ${
                    plan.isPopular ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'border-neutral-800'
                  } rounded-2xl p-5 flex flex-col justify-between space-y-4 relative`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-4 px-3 py-0.5 bg-amber-400 text-neutral-950 font-black text-[10px] rounded-full border border-amber-300 shadow">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {plan.id === 'weekly' ? '⚡' : plan.id === 'monthly' ? '⭐' : '👑'}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{plan.name}</h4>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Siklus: {plan.billingCycle} ({plan.durationDays} Hari)
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-amber-400">
                          Rp {plan.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-neutral-400">/ {plan.billingCycle}</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-bold mt-1">
                        ● Limit Cetak: {plan.maxPrintsPerDay} Lembar / Hari
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {(plan.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditPlanModal(plan)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>EDIT HARGA & BENEFIT PAKET</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Daftar Kontrol Langganan Per User */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>KONTROL LANGGANAN USER & AKTIVASI LISENSI</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Atur masa aktif, perpanjang paket mingguan/bulanan/tahunan, dan ubah status lisensi setiap user tablet.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Cari user / booth..."
                  value={subTabSearch}
                  onChange={(e) => setSubTabSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-white outline-none focus:border-amber-400"
                />

                <select
                  value={subTabFilter}
                  onChange={(e) => setSubTabFilter(e.target.value as any)}
                  className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-amber-300 font-bold outline-none"
                >
                  <option value="all">SEMUA PAKET ({users.length})</option>
                  <option value="weekly">⚡ MINGGUAN ({users.filter((u) => u.subscription?.plan === 'weekly').length})</option>
                  <option value="monthly">⭐ BULANAN ({users.filter((u) => u.subscription?.plan === 'monthly').length})</option>
                  <option value="yearly">👑 TAHUNAN ({users.filter((u) => u.subscription?.plan === 'yearly').length})</option>
                  <option value="expired">⚠️ KEDALUWARSA / NONE</option>
                </select>
              </div>
            </div>

            {/* Table Users Subscriptions */}
            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                    <th className="p-3.5">USER & BOOTH</th>
                    <th className="p-3.5">PAKET AKTIF</th>
                    <th className="p-3.5">STATUS LISENSI</th>
                    <th className="p-3.5">MASA BERLAKU (SISA HARI)</th>
                    <th className="p-3.5">TOTAL BIAYA</th>
                    <th className="p-3.5 text-right">AKSI CEPAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users
                    .filter((u) => {
                      if (subTabFilter === 'weekly') return u.subscription?.plan === 'weekly';
                      if (subTabFilter === 'monthly') return u.subscription?.plan === 'monthly';
                      if (subTabFilter === 'yearly') return u.subscription?.plan === 'yearly';
                      if (subTabFilter === 'expired') {
                        const days = getDaysRemaining(u.subscription?.endDate);
                        return u.subscription?.plan === 'none' || days <= 0;
                      }
                      return true;
                    })
                    .filter((u) => {
                      if (!subTabSearch.trim()) return true;
                      const q = subTabSearch.toLowerCase();
                      return (
                        u.fullName.toLowerCase().includes(q) ||
                        u.username.toLowerCase().includes(q) ||
                        u.assignedBooth?.toLowerCase().includes(q)
                      );
                    })
                    .map((u) => {
                      const daysLeft = getDaysRemaining(u.subscription?.endDate);
                      const plan = u.subscription?.plan || 'none';
                      const isSubActive = u.subscription?.status === 'active' && daysLeft > 0;

                      return (
                        <tr key={u.id} className="hover:bg-neutral-800/50 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl}
                                alt={u.fullName}
                                className="w-8 h-8 rounded-lg object-cover border border-neutral-700"
                              />
                              <div>
                                <span className="font-bold text-white block">{u.fullName}</span>
                                <span className="text-[10px] text-amber-400">
                                  {u.assignedBooth || 'Booth Main'} • @{u.username}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded font-bold text-[10px] inline-block border ${
                                plan === 'yearly'
                                  ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                                  : plan === 'monthly'
                                  ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                  : plan === 'weekly'
                                  ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                              }`}
                            >
                              {plan === 'weekly'
                                ? '⚡ PAKET MINGGUAN'
                                : plan === 'monthly'
                                ? '⭐ PAKET BULANAN'
                                : plan === 'yearly'
                                ? '👑 PAKET TAHUNAN'
                                : '⚪ GRATIS / NONE'}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isSubActive
                                  ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                                  : 'bg-red-400/10 text-red-400 border border-red-400/30'
                              }`}
                            >
                              {isSubActive ? '● AKTIF' : '○ EXPIRED'}
                            </span>
                          </td>

                          <td className="p-3.5 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">
                                {isSubActive ? `${daysLeft} Hari Lagi` : '0 Hari'}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                (s/d {u.subscription?.endDate ? new Date(u.subscription.endDate).toLocaleDateString('id-ID') : '-'})
                              </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-32 bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                              <div
                                className={`h-full ${
                                  daysLeft > 15
                                    ? 'bg-emerald-400'
                                    : daysLeft > 5
                                    ? 'bg-amber-400'
                                    : 'bg-red-400'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (daysLeft / (plan === 'yearly' ? 365 : plan === 'monthly' ? 30 : 7)) * 100
                                  )}%`
                                }}
                              />
                            </div>
                          </td>

                          <td className="p-3.5 font-mono text-amber-400 font-bold">
                            Rp {(u.subscription?.pricePaid || 0).toLocaleString('id-ID')}
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleQuickExtendSub(u, 30, 'monthly', 450000)}
                              className="px-2 py-1 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-[10px] font-bold transition"
                              title="Perpanjang 30 Hari Bulanan"
                            >
                              +30H BULANAN
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenUserSubModal(u)}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[10px] rounded-lg transition"
                            >
                              SETTING LENGKAP
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT TEMPLATE DESAIN RECEIPT */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-neutral-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 text-xs font-mono max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <span>{editingTmplId ? 'EDIT DESAIN RECEIPT TEMPLATE' : 'TAMBAH DESAIN RECEIPT BARU'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTemplateModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-bold">NAMA DESAIN TEMPLATE:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Seongsu Cafe Minimalist / Concert VIP Pass"
                    value={tmplName}
                    onChange={(e) => setTmplName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">LABEL BADGE (MAX 10 CHAR):</label>
                  <input
                    type="text"
                    required
                    placeholder="CONCERT 🎟️"
                    value={tmplBadge}
                    onChange={(e) => setTmplBadge(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">ICON EMOJI:</label>
                  <input
                    type="text"
                    placeholder="🎟️"
                    value={tmplIcon}
                    onChange={(e) => setTmplIcon(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 text-center text-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-bold">BASE LAYOUT STYLE (GAYA RECEIPT):</label>
                  <select
                    value={tmplBaseStyle}
                    onChange={(e) => setTmplBaseStyle(e.target.value as ReceiptStyle)}
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

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-bold">HEADER NOTE (TEKS ATAS STRUK):</label>
                  <input
                    type="text"
                    placeholder="--- SPECIAL EVENT PHOTO RECEIPT ---"
                    value={tmplHeaderNote}
                    onChange={(e) => setTmplHeaderNote(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-bold">FOOTER NOTE (TEKS BAWAH STRUK):</label>
                  <input
                    type="text"
                    placeholder="NO REFUNDS ON GOOD VIBES! ★★★★★"
                    value={tmplFooterNote}
                    onChange={(e) => setTmplFooterNote(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">DEFAULT MOTTO / SLOGAN:</label>
                  <input
                    type="text"
                    placeholder="Special Moment Memory ★★★★★"
                    value={tmplDefaultMotto}
                    onChange={(e) => setTmplDefaultMotto(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">DEFAULT VIBE SCORE:</label>
                  <input
                    type="text"
                    placeholder="100% PERFECT MATCH"
                    value={tmplDefaultVibe}
                    onChange={(e) => setTmplDefaultVibe(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-bold">DESKRIPSI RINGKAS:</label>
                  <input
                    type="text"
                    placeholder="Desain khusus acara festival & promosi kustom"
                    value={tmplDesc}
                    onChange={(e) => setTmplDesc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-bold transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>SIMPAN TEMPLATE RECEIPT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT LANGGANAN USER */}
      {showSubModal && selectedSubUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border-2 border-neutral-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>KONTROL LISENSI & LANGGANAN USER</span>
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  User: <span className="text-white font-bold">{selectedSubUser.fullName}</span> (@{selectedSubUser.username})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubModal(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSub} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">PILIH PAKET LANGGANAN:</label>
                  <select
                    value={subModalPlan}
                    onChange={(e) => {
                      const p = e.target.value as SubscriptionPlan;
                      setSubModalPlan(p);
                      if (p === 'weekly') { setSubModalDays(7); setSubModalPrice(150000); }
                      else if (p === 'monthly') { setSubModalDays(30); setSubModalPrice(450000); }
                      else if (p === 'yearly') { setSubModalDays(365); setSubModalPrice(4500000); }
                      else { setSubModalDays(0); setSubModalPrice(0); }
                    }}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-amber-300 font-bold outline-none focus:border-amber-400"
                  >
                    <option value="weekly">⚡ MINGGUAN (7 Hari)</option>
                    <option value="monthly">⭐ BULANAN (30 Hari)</option>
                    <option value="yearly">👑 TAHUNAN (365 Hari)</option>
                    <option value="none">⚪ TANPA PAKET / TRIAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">STATUS LISENSI:</label>
                  <select
                    value={subModalStatus}
                    onChange={(e) => setSubModalStatus(e.target.value as SubscriptionStatus)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option value="active">● AKTIF (LISENSI HIDUP)</option>
                    <option value="expired">○ EXPIRED (KEDALUWARSA)</option>
                    <option value="trial">❖ TRIAL GRATIS</option>
                    <option value="cancelled">✕ DIBATALKAN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold font-mono">DURASI (HARI):</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={subModalDays}
                    onChange={(e) => setSubModalDays(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold font-mono">BIAYA PAID (RP):</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={subModalPrice}
                    onChange={(e) => setSubModalPrice(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-amber-400 font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">CATATAN OPERATOR / TRANSAKSI:</label>
                <input
                  type="text"
                  placeholder="Contoh: Perpanjangan via Transfer QRIS Kasir #1"
                  value={subModalNotes}
                  onChange={(e) => setSubModalNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-bold transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN PERUBAHAN LANGGANAN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KONFIGURASI PRICING PLAN */}
      {showPlanConfigModal && editingPlanItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border-2 border-neutral-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>EDIT HARGA & BENEFIT PAKET LANGGANAN</span>
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Paket: <span className="text-white font-bold">{editingPlanItem.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanConfigModal(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">NAMA PAKET:</label>
                  <input
                    type="text"
                    required
                    value={planNameInput}
                    onChange={(e) => setPlanNameInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">HARGA (RP):</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={planPriceInput}
                    onChange={(e) => setPlanPriceInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-amber-400 font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">DURASI (HARI):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={planDaysInput}
                    onChange={(e) => setPlanDaysInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">MAX PRINT/HARI:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={planMaxPrintsInput}
                    onChange={(e) => setPlanMaxPrintsInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">LABEL BADGE:</label>
                  <input
                    type="text"
                    placeholder="POPULER 🔥"
                    value={planBadgeInput}
                    onChange={(e) => setPlanBadgeInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">DAFTAR BENEFIT (1 FITUR PER BARIS):</label>
                <textarea
                  rows={4}
                  value={planFeaturesStr}
                  onChange={(e) => setPlanFeaturesStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white outline-none focus:border-amber-400 leading-relaxed"
                  placeholder="Masa aktif 30 hari&#10;Unlimted photobooth print&#10;Akses semua template receipt"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPlanConfigModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-bold transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>SIMPAN PAKET LANGGANAN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
