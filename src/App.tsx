import React, { useState, useEffect } from 'react';
import { User, StoreSettings, PhotoSession, ActiveTab, LayoutMode, ThermalFilter, ReceiptItem } from './types';
import {
  getUsers,
  getSettings,
  getSessions,
  getCurrentUser,
  setCurrentUser,
  saveSession
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraBooth } from './components/CameraBooth';
import { ReceiptEditor } from './components/ReceiptEditor';
import { ThermalPrintModal } from './components/ThermalPrintModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { PinModal } from './components/PinModal';
import { UserSwitchModal } from './components/UserSwitchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');

  // App Data State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserState, setCurrentUserState] = useState<User>(getCurrentUser());
  const [settings, setSettings] = useState<StoreSettings>(getSettings());
  const [sessions, setSessions] = useState<PhotoSession[]>([]);

  // Active Photobooth Session State
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('strip_3');
  const [renderedReceiptUrl, setRenderedReceiptUrl] = useState<string>('');
  const [currentSessionCode, setCurrentSessionCode] = useState<string>('');

  // Modals
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showUserSwitchModal, setShowUserSwitchModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Initialize storage
  useEffect(() => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
    const curr = getCurrentUser();
    setCurrentUserState(curr);
    setSettings(getSettings());
    setSessions(getSessions());
  }, []);

  // Global Auto-Idle Timer to Return to Welcome Screen
  useEffect(() => {
    // Only active when auto idle is enabled and not already on welcome screen or admin dashboard
    const isAutoIdleEnabled = settings.enableAutoIdleWelcome ?? true;
    if (!isAutoIdleEnabled || activeTab === 'welcome' || activeTab === 'admin_dashboard') {
      return;
    }

    const idleTimeoutMs = (settings.idleSeconds || 45) * 1000;
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // Reset modals & photo session, then transition back to welcome screen
        setShowPrintModal(false);
        setShowPinModal(false);
        setShowUserSwitchModal(false);
        setCapturedPhotos([]);
        setRenderedReceiptUrl('');
        setActiveTab('welcome');
      }, idleTimeoutMs);
    };

    // Events to listen for user activity
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer));

    // Start timer on mount/tab change
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [activeTab, settings.enableAutoIdleWelcome, settings.idleSeconds]);

  // Handle Admin Authorization Request
  const handleRequestAdmin = () => {
    if (currentUserState.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setActiveTab('admin_dashboard');
  };

  // Handle User Switch
  const handleSelectUser = (u: User) => {
    setCurrentUserState(u);
    setCurrentUser(u);
  };

  // Handle Photo Capture Complete -> Transition to Editor
  const handlePhotosCaptured = (photos: string[], layout: LayoutMode) => {
    setCapturedPhotos(photos);
    setLayoutMode(layout);
    setActiveTab('editor');
  };

  // Handle Proceed to Print -> Open Thermal Printer Modal & Save Session
  const handleProceedToPrint = (
    receiptUrl: string,
    items: ReceiptItem[],
    filter: ThermalFilter,
    stickers: string[],
    customerName: string,
    motto: string,
    vibeRating: string
  ) => {
    setRenderedReceiptUrl(receiptUrl);

    // Calculate total
    const subtotal = items.reduce((acc, item) => {
      const numeric = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      return acc + numeric;
    }, 0);

    const saved = saveSession({
      userId: currentUserState.id,
      userName: currentUserState.fullName,
      photos: capturedPhotos,
      finalReceiptImage: receiptUrl,
      layout: layoutMode,
      filter,
      items,
      totalAmount: `${settings.currencySymbol}${subtotal.toLocaleString('id-ID')}`,
      customerName,
      printsCount: 1,
      vibeRating,
      motto,
      selectedStickers: stickers
    });

    setCurrentSessionCode(saved.sessionCode);
    setSessions(getSessions());
    setShowPrintModal(true);
  };

  // Reset Photobooth for new customer session
  const handleFinishAndReset = () => {
    setShowPrintModal(false);
    setCapturedPhotos([]);
    setRenderedReceiptUrl('');
    setActiveTab('welcome');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased selection:bg-amber-400 selection:text-neutral-950 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        setTab={(tab) => {
          if (tab === 'admin_dashboard') {
            handleRequestAdmin();
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUserState}
        settings={settings}
        onRequestAdmin={handleRequestAdmin}
        onSwitchUser={() => setShowUserSwitchModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 py-4 px-2 sm:px-4">
        {activeTab === 'welcome' && (
          <WelcomeScreen
            settings={settings}
            onStartSession={() => setActiveTab('kiosk')}
            onRequestAdmin={handleRequestAdmin}
          />
        )}

        {activeTab === 'kiosk' && (
          <CameraBooth
            settings={settings}
            onPhotosCaptured={handlePhotosCaptured}
          />
        )}

        {activeTab === 'editor' && (
          <ReceiptEditor
            photos={capturedPhotos}
            layout={layoutMode}
            settings={settings}
            currentUser={currentUserState}
            onBackToBooth={() => setActiveTab('kiosk')}
            onProceedToPrint={handleProceedToPrint}
          />
        )}

        {activeTab === 'user_dashboard' && (
          <UserDashboard
            currentUser={currentUserState}
            settings={settings}
            sessions={sessions}
            onStartBooth={() => setActiveTab('kiosk')}
            onRequestAdmin={handleRequestAdmin}
            onSwitchUser={() => setShowUserSwitchModal(true)}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminDashboard
            users={users}
            onUsersChange={(updatedUsers) => setUsers(updatedUsers)}
            settings={settings}
            onSettingsChange={(updatedSettings) => setSettings(updatedSettings)}
            sessions={sessions}
            onLaunchKiosk={() => setActiveTab('kiosk')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-3 text-center text-neutral-500 text-xs font-mono">
        <p>
          RECEIPT SNAP PHOTOBOOTH © 2026 | Tablet Optimized Thermal Receipt Kiosk | Gen-Z & Millennial Aesthetic
        </p>
      </footer>

      {/* Modals */}
      <PinModal
        isOpen={showPinModal}
        title="AKSES ADMIN DISERTAI PIN"
        expectedPin={settings.kioskPin || '9999'}
        onSuccess={handlePinSuccess}
        onClose={() => setShowPinModal(false)}
      />

      <UserSwitchModal
        isOpen={showUserSwitchModal}
        users={users}
        currentUser={currentUserState}
        onSelectUser={handleSelectUser}
        onClose={() => setShowUserSwitchModal(false)}
      />

      <ThermalPrintModal
        isOpen={showPrintModal}
        receiptImage={renderedReceiptUrl}
        sessionCode={currentSessionCode}
        settings={settings}
        onClose={() => setShowPrintModal(false)}
        onFinishAndReset={handleFinishAndReset}
      />
    </div>
  );
}
