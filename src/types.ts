export type UserRole = 'admin' | 'operator';

export type UserStatus = 'active' | 'inactive';

export type SubscriptionPlan = 'weekly' | 'monthly' | 'yearly' | 'none';

export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'cancelled';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
  pricePaid?: number;
  maxPrintsPerDay?: number;
  notes?: string;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  billingCycle: 'mingguan' | 'bulanan' | 'tahunan';
  durationDays: number;
  maxPrintsPerDay: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  badge: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  passcode: string; // 4-digit numeric code for fast tablet login
  avatarUrl?: string;
  assignedBooth?: string;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  subscription?: UserSubscription;
}

export type PaperWidth = '58mm' | '80mm';

export type ReceiptStyle =
  | 'classic_thermal'
  | 'magazine_cover'
  | 'magazine_lookbook'
  | 'korean_life4cuts'
  | 'korean_cafe'
  | 'y2k_korean';

export type WelcomeCoverTheme =
  | 'warm_minimal'
  | 'korean_seoul'
  | 'cyber_y2k'
  | 'magazine_glam'
  | 'retro_arcade';

export interface CustomReceiptTemplate {
  id: string;
  name: string;
  badge: string;
  description?: string;
  baseStyle: ReceiptStyle;
  headerNote?: string;
  footerNote?: string;
  defaultMotto?: string;
  defaultVibeRating?: string;
  customItems?: ReceiptItem[];
  icon?: string;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  address: string;
  phone: string;
  instagram: string;
  tiktok: string;
  logoText: string;
  headerNote: string;
  footerNote: string;
  barcodePayload: string;
  qrPayload: string;
  pricePerPrint: number;
  currencySymbol: string;
  paperWidth: PaperWidth;
  ditherStrength: number; // 1 to 10
  autoResetSeconds: number; // 30, 60, 90, 120 or 0 (disabled)
  kioskPin: string; // PIN to exit kiosk mode to admin
  soundEnabled: boolean;
  paperTearStyle: 'zigzag' | 'torn' | 'straight';
  enableAiVibeCheck: boolean;
  defaultFilter: ThermalFilter;
  defaultReceiptStyle?: ReceiptStyle;
  customPresetItems: { name: string; price: string }[];
  customReceiptTemplates?: CustomReceiptTemplate[];
  subscriptionPlansConfig?: SubscriptionPlanConfig[];
  welcomePromoTitle?: string;
  welcomePromoSubtitle?: string;
  welcomePromoBadge?: string;
  welcomeCoverTheme?: WelcomeCoverTheme;
  enableAutoIdleWelcome?: boolean;
  idleSeconds?: number;
}

export type ThermalFilter =
  | 'monochrome'
  | 'halftone'
  | 'cyberpunk'
  | 'high_contrast'
  | 'vintage'
  | 'inverted'
  | 'soft_grain';

export type LayoutMode =
  | 'strip_1'
  | 'strip_2'
  | 'strip_3'
  | 'strip_4'
  | 'grid_2x2'
  | 'single_polaroid'
  | 'receipt_mini';

export interface Sticker {
  id: string;
  label: string;
  category: 'stamp' | 'badge' | 'doodle' | 'rating';
  iconName?: string;
  color?: string;
}

export interface ReceiptItem {
  name: string;
  price: string;
}

export interface PhotoSession {
  id: string;
  sessionCode: string; // e.g. RCPT-2026-8910
  timestamp: string;
  userId: string;
  userName: string;
  photos: string[]; // data URLs
  finalReceiptImage: string; // rendered canvas data URL
  layout: LayoutMode;
  receiptStyle?: ReceiptStyle;
  filter: ThermalFilter;
  items: ReceiptItem[];
  totalAmount: string;
  customerName?: string;
  printsCount: number;
  vibeRating?: string;
  motto?: string;
  selectedStickers: string[]; // sticker labels
}

export type ActiveTab =
  | 'welcome'
  | 'kiosk'
  | 'editor'
  | 'user_dashboard'
  | 'admin_dashboard'
  | 'gallery'
  | 'settings';
