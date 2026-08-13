import { User, StoreSettings, Sticker, PhotoSession } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    fullName: 'Alex Admin (Owner)',
    email: 'admin@snapreceipt.com',
    role: 'admin',
    passcode: '1234',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedBooth: 'Booth #1 (Tablet Pro)',
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-08-10T12:00:00.000Z',
    subscription: {
      plan: 'yearly',
      status: 'active',
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-12-31T23:59:59.000Z',
      autoRenew: true,
      pricePaid: 4500000,
      maxPrintsPerDay: 1000,
      notes: 'Paket Tahunan Enterprise Owner'
    }
  },
  {
    id: 'usr_op1',
    username: 'kasir_genz',
    fullName: 'Maya Kasir (Gen-Z Operator)',
    email: 'maya@snapreceipt.com',
    role: 'operator',
    passcode: '0000',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    assignedBooth: 'Booth #1 (Tablet Main)',
    status: 'active',
    createdAt: '2026-02-01T10:30:00.000Z',
    lastLogin: '2026-08-10T10:15:00.000Z',
    subscription: {
      plan: 'monthly',
      status: 'active',
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-08-31T23:59:59.000Z',
      autoRenew: true,
      pricePaid: 450000,
      maxPrintsPerDay: 300,
      notes: 'Langganan Bulanan Booth Central Park'
    }
  },
  {
    id: 'usr_op2',
    username: 'crew_booth',
    fullName: 'Rian Booth Crew',
    email: 'rian@snapreceipt.com',
    role: 'operator',
    passcode: '8888',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedBooth: 'Booth #2 (Pop-up Event)',
    status: 'active',
    createdAt: '2026-03-10T14:20:00.000Z',
    lastLogin: '2026-08-09T18:45:00.000Z',
    subscription: {
      plan: 'weekly',
      status: 'active',
      startDate: '2026-08-08T00:00:00.000Z',
      endDate: '2026-08-15T23:59:59.000Z',
      autoRenew: false,
      pricePaid: 150000,
      maxPrintsPerDay: 100,
      notes: 'Pop-up Event BKN Exhibition 7 Hari'
    }
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "SNAP & RECEIPT",
  slogan: "Gen-Z Thermal Memory Kiosk",
  address: "Central Park Mall, L3 #102, Jakarta",
  phone: "+62 812-9900-2026",
  instagram: "@snapreceipt.id",
  tiktok: "@snapreceipt_official",
  logoText: "[★ SNAP & RECEIPT ★]",
  headerNote: "--- RECEIPT PHOTOBOOTH OFFICIAL ---",
  footerNote: "NO REFUNDS ON GOOD VIBES! ★★★★★",
  barcodePayload: "SNAP-RCPT-2026-GENZ",
  qrPayload: "https://snapreceipt.app/gallery",
  pricePerPrint: 25000,
  currencySymbol: "Rp ",
  paperWidth: "80mm",
  ditherStrength: 7,
  autoResetSeconds: 60,
  kioskPin: "9999",
  soundEnabled: true,
  paperTearStyle: "zigzag",
  enableAiVibeCheck: true,
  defaultFilter: "monochrome",
  defaultReceiptStyle: "korean_life4cuts",
  welcomePromoTitle: "CETAK STRUK FOTO ESTETIK 📸",
  welcomePromoSubtitle: "Abadikan Momen Manismu dalam Struk Thermal Vintage. Hasil Instan & Siap Dipajang!",
  welcomePromoBadge: "PROMO MAHASISWA & COMMUNITY DISKON 20%",
  welcomeCoverTheme: "warm_minimal",
  enableAutoIdleWelcome: true,
  idleSeconds: 45,
  customPresetItems: [
    { name: "1x Main Character Pose", price: "Rp 0" },
    { name: "2x Unlimited Aura Points", price: "Rp 15.000" },
    { name: "1x Thermal Print Paper 80mm", price: "Rp 10.000" },
    { name: "1x Vibe Tax (100% Worth It)", price: "Rp 0" }
  ],
  customReceiptTemplates: [
    {
      id: "tmpl_seoul_cafe",
      name: "Seongsu Cafe Aesthetic",
      badge: "CAFE ☕",
      description: "Desain ala struk cafe estetik daerah Seongsu / Hongdae Seoul",
      baseStyle: "korean_cafe",
      headerNote: "--- SEONGSU COFFEE & PHOTO STUDIO ---",
      footerNote: "THANK YOU FOR VISITING! SEE YOU AGAIN ★",
      defaultMotto: "Warm Coffee & Precious Memories ☕",
      defaultVibeRating: "CAFE AESTHETIC 100%",
      icon: "☕"
    },
    {
      id: "tmpl_y2k_concert",
      name: "VIP Concert Backstage Pass",
      badge: "CONCERT 🎟️",
      description: "Desain struk tiket konser & VIP pass festival musik",
      baseStyle: "y2k_korean",
      headerNote: "★ LIVE AT JAKARTA STADIUM 2026 ★",
      footerNote: "KEEP THIS STRIP FOR AFTERPARTY ENTRY",
      defaultMotto: "VIP Front Row Energy ★★★★★",
      defaultVibeRating: "9999 CONCERT AURA",
      icon: "🎟️"
    },
    {
      id: "tmpl_wedding_memory",
      name: "Wedding & Anniversary Edition",
      badge: "WEDDING 💍",
      description: "Desain romantis untuk pesta pernikahan & anniversary",
      baseStyle: "korean_life4cuts",
      headerNote: "💕 HAPPY EVER AFTER - SPECIAL MOMENTS 💕",
      footerNote: "THANK YOU FOR CELEBRATING WITH US!",
      defaultMotto: "Eternal Love & Sweet Memories Ring 💍",
      defaultVibeRating: "SOULMATE MATCH 100%",
      icon: "💍"
    }
  ],
  subscriptionPlansConfig: [
    {
      id: "weekly",
      name: "Paket Mingguan (Weekly Kiosk)",
      price: 150000,
      billingCycle: "mingguan",
      durationDays: 7,
      maxPrintsPerDay: 100,
      badge: "POP-UP EVENT ⚡",
      features: [
        "Akses Kiosk Photobooth 7 Hari",
        "Batas Cetak 100 Foto/Hari",
        "5 Tema Cover & Struk Custom",
        "Ekspor Galeri Foto QRIS"
      ],
      isActive: true
    },
    {
      id: "monthly",
      name: "Paket Bulanan (Monthly Kiosk)",
      price: 450000,
      billingCycle: "bulanan",
      durationDays: 30,
      maxPrintsPerDay: 300,
      isPopular: true,
      badge: "BEST VALUE ⭐",
      features: [
        "Akses Kiosk Photobooth 30 Hari",
        "Batas Cetak 300 Foto/Hari",
        "Semua Template Struk & Cover Custom",
        "Fitur AI Vibe Score Unlimited",
        "Laporan Analytics & Penjualan"
      ],
      isActive: true
    },
    {
      id: "yearly",
      name: "Paket Tahunan (Enterprise Annual)",
      price: 4500000,
      billingCycle: "tahunan",
      durationDays: 365,
      maxPrintsPerDay: 1000,
      badge: "UNLIMITED VIP 👑",
      features: [
        "Akses Kiosk Photobooth 365 Hari",
        "Batas Cetak 1,000 Foto/Hari",
        "Prioritas Support & Custom Branding Logo",
        "Multi-Booth Location Control",
        "Hemat 2 Bulan Biaya Langganan"
      ],
      isActive: true
    }
  ]
};

export const STICKERS_LIST: Sticker[] = [
  { id: 'st1', label: 'PAID IN FULL', category: 'stamp', color: '#10b981' },
  { id: 'st2', label: '100% CUTE', category: 'stamp', color: '#ec4899' },
  { id: 'st3', label: 'APPROVED VIBE', category: 'stamp', color: '#3b82f6' },
  { id: 'st4', label: 'NO REFUNDS', category: 'badge', color: '#ef4444' },
  { id: 'st5', label: 'Y2K ICON', category: 'badge', color: '#8b5cf6' },
  { id: 'st6', label: 'CERTIFIED SLAY', category: 'badge', color: '#f59e0b' },
  { id: 'st7', label: 'MAIN CHARACTER', category: 'stamp', color: '#06b6d4' },
  { id: 'st8', label: 'AURA +9999', category: 'rating', color: '#10b981' },
  { id: 'st9', label: '★ ★ ★ ★ ★', category: 'rating', color: '#eab308' }
];

export const SAMPLE_SESSIONS: PhotoSession[] = [
  {
    id: 'sess_101',
    sessionCode: 'RCPT-89101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userId: 'usr_op1',
    userName: 'Maya Kasir',
    photos: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
    ],
    finalReceiptImage: '',
    layout: 'strip_3',
    filter: 'monochrome',
    items: [
      { name: '1x Chill Weekend Vibe', price: 'Rp 15.000' },
      { name: '1x Photo Print 80mm', price: 'Rp 10.000' }
    ],
    totalAmount: 'Rp 25.000',
    customerName: 'Siti & Dika',
    printsCount: 2,
    vibeRating: '9999 AURA POINTS',
    motto: 'Besties forever! Certified Y2K Vibe ★',
    selectedStickers: ['PAID IN FULL', '100% CUTE']
  },
  {
    id: 'sess_102',
    sessionCode: 'RCPT-89102',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    userId: 'usr_admin',
    userName: 'Alex Admin',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    ],
    finalReceiptImage: '',
    layout: 'strip_3',
    filter: 'halftone',
    items: [
      { name: '1x Solo Main Character', price: 'Rp 25.000' },
      { name: '1x Coffee Aura Boost', price: 'Rp 0' }
    ],
    totalAmount: 'Rp 25.000',
    customerName: 'Budi S.',
    printsCount: 1,
    vibeRating: 'MAXIMUM COOL',
    motto: 'Keep glowing always! ★',
    selectedStickers: ['APPROVED VIBE']
  }
];
