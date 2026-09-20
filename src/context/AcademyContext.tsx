import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Course,
  StudentProfile,
  Transaction,
  Certificate,
  EnrolledCourseProgress,
  ActiveTab,
  PaymentGatewayType,
  CurrencyType,
  LegalDocType,
  EnrollmentOrder,
  AdminEmailNotification,
  UserAccount,
  UserRole,
  CourseActivationToken,
  CartItem,
  OrderLineItem,
} from '../types';
import { COURSES_DATA, INITIAL_STUDENT, INITIAL_TRANSACTIONS } from '../data/courses';
import { INITIAL_ORDERS } from '../data/bankingDetails';
import { DEMO_ACCOUNTS } from '../data/authDemo';
import {
  calculateOrderTotalSCR,
  formatSCR,
  SCR_EXCHANGE_RATES,
  resolvePackageType,
  CoursePackageType,
  getSeatRateSCR,
  INDIVIDUAL_PRICING,
} from '../utils/pricing';
import { progressSyncService, SyncStatus } from '../services/progressSyncService';
import {
  adminEmailNotificationService,
  clientReceiptNotificationService,
  ClientReceiptConfirmation,
} from '../services/adminEmailNotificationService';
import { activationTokenService } from '../services/activationTokenService';
import { systemAuditLogService } from '../services/systemAuditLogService';

interface AcademyContextType {
  student: StudentProfile;
  courses: Course[];
  enrolledProgress: Record<string, EnrolledCourseProgress>;
  transactions: Transaction[];
  certificates: Certificate[];
  orders: EnrollmentOrder[];
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  syncMessage: string;
  forceSyncProgress: (courseId: string) => Promise<void>;
  selectedProformaForView: EnrollmentOrder | null;
  setSelectedProformaForView: (order: EnrollmentOrder | null) => void;
  createProformaOrder: (params: {
    courseId: string;
    seatCount: number;
    companyName: string;
    companyAddress?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
    isCorporate?: boolean;
    packageType?: CoursePackageType;
  }) => EnrollmentOrder;
  createEnrollmentOrder: (order: EnrollmentOrder) => void;
  adminActivateOrder: (orderId: string, adminNote?: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  activeLegalModal: LegalDocType;
  setActiveLegalModal: (modal: LegalDocType) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  selectedCourseForCheckout: Course | null;
  setSelectedCourseForCheckout: (course: Course | null) => void;
  selectedTransactionForReceipt: Transaction | null;
  setSelectedTransactionForReceipt: (tx: Transaction | null) => void;
  selectedCertificateForView: Certificate | null;
  setSelectedCertificateForView: (cert: Certificate | null) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatPrice: (amount: number) => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  openCoursePlayer: (courseId: string, lessonId?: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  savePersonalNote: (courseId: string, lessonId: string, note: string) => void;
  recordQuizScore: (courseId: string, lessonId: string, score: number) => void;
  recordUnitQuizScore: (courseId: string, unitId: string, score: number) => void;
  recordExamScore: (courseId: string, score: number) => void;
  claimCertificate: (courseId: string) => Certificate | null;
  getCertificateExpiryStatuses: () => {
    certificate: Certificate;
    daysRemaining: number;
    isExpired: boolean;
    isNearExpiry: boolean;
  }[];
  processPaymentEnrollment: (
    courseId: string,
    gateway: PaymentGatewayType,
    details: { brand?: string; last4?: string; payerEmail?: string },
    couponApplied?: string,
    discountAmount?: number
  ) => Transaction;
  getCourseProgressPercentage: (courseId: string) => number;
  isCourseCompleted: (courseId: string) => boolean;
  isCourseUnlocked: (courseId: string) => boolean;
  currentUser: UserAccount | null;
  logout: () => void;
  switchAccount: (roleKey: 'admin' | 'corporate' | 'learner') => void;
  loginWithCredentials: (email: string, password: string) => { success: boolean; message: string };
  registerUserSession: (details: {
    name: string;
    email: string;
    role?: UserRole;
    companyName?: string;
    phone?: string;
  }) => UserAccount;
  redeemJoinCode: (code: string) => { success: boolean; message: string };
  adminNotifications: AdminEmailNotification[];
  unreadAdminNotificationsCount: number;
  markAdminNotificationAsRead: (id: string) => void;
  markAllAdminNotificationsAsRead: () => void;
  triggerManualNotificationDispatch: (order: EnrollmentOrder, recipients?: string[]) => Promise<AdminEmailNotification>;
  latestNotificationToast: AdminEmailNotification | null;
  dismissNotificationToast: () => void;
  clientReceipts: ClientReceiptConfirmation[];
  sendClientReceiptConfirmationEmail: (orderId: string, customIssuer?: string) => Promise<ClientReceiptConfirmation | null>;
  getClientReceiptForOrder: (orderId: string) => ClientReceiptConfirmation | undefined;
  integrityViolations: any[];
  recordIntegrityViolation: (violation: any) => void;
  activationTokens: CourseActivationToken[];
  redeemActivationToken: (tokenString: string) => {
    success: boolean;
    message: string;
    courseTitle?: string;
    activatedCourseIds?: string[];
    issuedBy?: string;
  };
  assignActivationToken: (
    tokenString: string,
    name: string,
    email: string
  ) => { success: boolean; message: string; token?: CourseActivationToken };
  unassignActivationToken: (
    tokenString: string
  ) => { success: boolean; message: string; token?: CourseActivationToken };
  getTokensForOrder: (orderId: string) => CourseActivationToken[];
  issueActivationTokenForOrder: (orderId: string, issuedBy?: 'Malcolm Simon' | 'Eric') => CourseActivationToken | null;
  generateCustomActivationToken: (params: {
    courseIds: string[];
    courseTitle: string;
    issuedBy: 'Malcolm Simon' | 'Eric' | string;
    issuedToName: string;
    issuedToEmail: string;
    orderId?: string;
  }) => CourseActivationToken;
  isRedeemModalOpen: boolean;
  setIsRedeemModalOpen: (open: boolean) => void;
  pendingActivationToken: string | null;
  setPendingActivationToken: (token: string | null) => void;
  isRegistrationWizardOpen: boolean;
  setIsRegistrationWizardOpen: (open: boolean) => void;
  isMarketingStudioOpen: boolean;
  setIsMarketingStudioOpen: (open: boolean) => void;
  isE2ETestModalOpen: boolean;
  setIsE2ETestModalOpen: (open: boolean) => void;
  isCertificateVerifierOpen: boolean;
  setIsCertificateVerifierOpen: (open: boolean) => void;

  // Checkout Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartEnrollmentType: 'individual' | 'corporate';
  setCartEnrollmentType: (type: 'individual' | 'corporate') => void;
  addToCart: (params: {
    courseId: string;
    courseTitle?: string;
    packageType?: CoursePackageType;
    seatCount?: number;
    description?: string;
    cpdHours?: number;
    modulesCount?: number;
  }) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemSeats: (itemId: string, seats: number) => void;
  clearCart: () => void;
  cartItemsCount: number;
  cartTotalSeats: number;
  cartTotalSCR: number;
  cartTotalUSD: number;
  cartSavingsSCR: number;
  checkoutCart: (params: {
    companyName: string;
    companyAddress?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
    isCorporate?: boolean;
    industrySector?: string;
  }) => EnrollmentOrder;
  lastCartFeedback: string | null;
  dismissCartFeedback: () => void;
  selectedOrderForPayment: EnrollmentOrder | null;
  setSelectedOrderForPayment: (order: EnrollmentOrder | null) => void;
  submitWireRemittance: (orderId: string, details: {
    bankName: string;
    referenceNumber: string;
    remittanceDate: string;
    senderNotes?: string;
  }) => void;
  processOnlineOrderPayment: (orderId: string, paymentDetails: {
    cardBrand?: string;
    last4?: string;
    cardholderName?: string;
  }) => void;
  deleteOrder: (orderId: string) => void;
  clearDemoOrders: () => void;
  adminPasswords: Record<string, string>;
  getAdminPassword: (email: string) => string;
  changeAdminPassword: (
    adminEmail: string,
    currentPass: string,
    newPass: string
  ) => { success: boolean; message: string };
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: (open: boolean) => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

const DEFAULT_ADMIN_PASSWORDS: Record<string, string> = {
  'malcolm@complisanc.com': 'CompliseyMalcolm2026!',
  'msimonitc@gmail.com': 'CompliseyMalcolm2026!',
  'eric@complisanc.com': 'CompliseyEric2026!',
};

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses] = useState<Course[]>(COURSES_DATA);
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('academy_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('academy_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string | null>('c-1');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('ml-l1');

  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<Certificate | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState<boolean>(false);
  const [pendingActivationToken, setPendingActivationToken] = useState<string | null>(null);
  const [isRegistrationWizardOpen, setIsRegistrationWizardOpen] = useState<boolean>(false);
  const [isMarketingStudioOpen, setIsMarketingStudioOpen] = useState<boolean>(false);
  const [isE2ETestModalOpen, setIsE2ETestModalOpen] = useState<boolean>(false);
  const [isCertificateVerifierOpen, setIsCertificateVerifierOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [adminPasswords, setAdminPasswords] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('complisey_admin_passwords');
      if (saved) {
        return { ...DEFAULT_ADMIN_PASSWORDS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse complisey_admin_passwords:', e);
    }
    return DEFAULT_ADMIN_PASSWORDS;
  });

  const getAdminPassword = (email: string): string => {
    const clean = email.trim().toLowerCase();
    const isEric = clean.includes('eric');
    return adminPasswords[clean] || (isEric ? 'CompliseyEric2026!' : 'CompliseyMalcolm2026!');
  };

  const changeAdminPassword = (
    adminEmail: string,
    currentPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    const clean = adminEmail.trim().toLowerCase();
    const isMalcolm = clean.includes('malcolm') || clean === 'msimonitc@gmail.com';
    const isEric = clean.includes('eric');

    if (!isMalcolm && !isEric) {
      return {
        success: false,
        message: "Unauthorized. Password management is strictly restricted to Malcolm Simon and Eric D'Souza.",
      };
    }

    const targetKey = isEric ? 'eric@complisanc.com' : 'malcolm@complisanc.com';
    const currentExpected = adminPasswords[targetKey] || (isEric ? 'CompliseyEric2026!' : 'CompliseyMalcolm2026!');

    if (currentPass !== currentExpected) {
      return {
        success: false,
        message: 'The current administrator password entered is incorrect.',
      };
    }

    if (newPass.length < 8) {
      return {
        success: false,
        message: 'New administrator password must contain at least 8 characters.',
      };
    }

    const updated = {
      ...adminPasswords,
      [targetKey]: newPass,
      ...(isMalcolm ? { 'msimonitc@gmail.com': newPass, 'malcolm@complisanc.com': newPass } : {}),
    };

    setAdminPasswords(updated);
    try {
      localStorage.setItem('complisey_admin_passwords', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist admin password:', e);
    }

    // Log high-priority security audit event
    systemAuditLogService.logEvent(
      'SECURITY',
      'INFO',
      'ADMIN_PASSWORD_ROTATED',
      isEric ? "Eric D'Souza" : 'Malcolm Simon',
      'admin',
      `Administrator credentials updated for ${targetKey}. Back Office access re-secured under Section 34 standards.`,
      { targetAccount: targetKey, timestamp: new Date().toISOString() }
    );

    return {
      success: true,
      message: `Password updated successfully for ${isEric ? "Eric D'Souza" : "Malcolm Simon"}. Your new credentials are now active.`,
    };
  };

  const [activationTokens, setActivationTokens] = useState<CourseActivationToken[]>(() => {
    return activationTokenService.getAllTokens();
  });

  // Corporate & individual enrollment orders (for Proforma Invoices & Bank Transfers)
  const [orders, setOrders] = useState<EnrollmentOrder[]>(() => {
    const saved = localStorage.getItem('academy_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Auto-synchronize and provision multi-seat tokens for any activated orders (such as corporate 22-seat batches)
  useEffect(() => {
    let tokensChanged = false;
    orders.forEach((ord) => {
      if (ord.status === 'activated' && ord.seatCount > 1) {
        const existing = activationTokenService.getTokensForOrder(ord.id);
        if (existing.length < ord.seatCount) {
          const isAll =
            ord.courseId === 'all-catalogue-seats' ||
            ord.courseId === 'cart-multi-package' ||
            ord.courseTitle.includes('Complete') ||
            ord.courseTitle.includes('Consolidated');
          const isLevel1 = ord.courseTitle.includes('Level 1');
          const isLevel2 = ord.courseTitle.includes('Level 2');
          const targetCourseIds = isAll
            ? ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6']
            : isLevel1
            ? ['c-1', 'c-2', 'c-3']
            : isLevel2
            ? ['c-4', 'c-5', 'c-6']
            : [ord.courseId];

          activationTokenService.generateTokensForOrder({
            orderId: ord.id,
            proformaNumber: ord.proformaNumber,
            ccsBookingId: ord.ccsBookingId,
            taxInvoiceNumber: ord.taxInvoiceNumber,
            companyName: ord.companyName,
            contactName: ord.contactName,
            contactEmail: ord.contactEmail,
            seatCount: ord.seatCount,
            courseIds: targetCourseIds,
            courseTitle: ord.courseTitle,
            issuedBy: (ord.activatedBy as any) || 'Malcolm Simon',
          });
          tokensChanged = true;
        }
      }
    });

    if (tokensChanged) {
      setActivationTokens(activationTokenService.getAllTokens());
    }
  }, [orders]);

  const [selectedProformaForView, setSelectedProformaForView] = useState<EnrollmentOrder | null>(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<EnrollmentOrder | null>(null);

  // Checkout Cart State
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartEnrollmentType, setCartEnrollmentType] = useState<'individual' | 'corporate'>('individual');
  const [lastCartFeedback, setLastCartFeedback] = useState<string | null>(null);

  const [rawCart, setRawCart] = useState<Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    packageType: CoursePackageType;
    seatCount: number;
    description?: string;
    cpdHours?: number;
    modulesCount?: number;
    category?: string;
  }>>(() => {
    const saved = localStorage.getItem('complisey_academy_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    return [];
  });

  // Calculate dynamic line pricing for cart items
  const cart: CartItem[] = rawCart.map((item) => {
    const isCorp = cartEnrollmentType === 'corporate';
    const effectiveSeats = isCorp ? Math.max(1, item.seatCount || 1) : 1;
    const unitPrice = isCorp
      ? getSeatRateSCR(effectiveSeats, true, item.packageType)
      : INDIVIDUAL_PRICING[item.packageType] || 2500;
    const totalPrice = unitPrice * effectiveSeats;

    return {
      ...item,
      seatCount: effectiveSeats,
      unitPrice,
      totalPrice,
    };
  });

  const cartItemsCount = cart.length;
  const cartTotalSeats = cart.reduce((acc, it) => acc + it.seatCount, 0);
  const cartTotalSCR = cart.reduce((acc, it) => acc + it.totalPrice, 0);
  const cartTotalUSD = Math.round(cartTotalSCR / 14.5);
  const cartSavingsSCR = cart.reduce((acc, it) => {
    const regularRate = INDIVIDUAL_PRICING[it.packageType] || 2500;
    const fullPrice = regularRate * it.seatCount;
    return acc + Math.max(0, fullPrice - it.totalPrice);
  }, 0);

  const addToCart = (params: {
    courseId: string;
    courseTitle?: string;
    packageType?: CoursePackageType;
    seatCount?: number;
    description?: string;
    cpdHours?: number;
    modulesCount?: number;
  }) => {
    const resolvedPkg = params.packageType || resolvePackageType(params.courseId);
    let title = params.courseTitle;
    let cpd = params.cpdHours;
    let modules = params.modulesCount;

    if (!title) {
      if (resolvedPkg === 'pack' || params.courseId === 'pkg-both' || params.courseId === 'pkg-all') {
        title = 'CompliSey Academy: Complete 6-Course Curriculum Pack';
        cpd = 12;
        modules = 6;
      } else if (resolvedPkg === 'level1' || params.courseId === 'pkg-level-1') {
        title = 'CompliSey Academy: Level 1 Statutory Foundations';
        cpd = 6;
        modules = 3;
      } else if (resolvedPkg === 'level2' || params.courseId === 'pkg-level-2') {
        title = 'CompliSey Academy: Level 2 Advanced Operations';
        cpd = 6;
        modules = 3;
      } else {
        const found = courses.find((c) => c.id === params.courseId);
        title = found?.title || 'CompliSey AML/CFT Training Course';
        cpd = found?.cpdHours || 2;
        modules = 1;
      }
    }

    setRawCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.courseId === params.courseId);
      let next;
      if (existingIndex >= 0) {
        next = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, seatCount: item.seatCount + (params.seatCount || 1) }
            : item
        );
      } else {
        const newItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          courseId: params.courseId,
          courseTitle: title!,
          packageType: resolvedPkg,
          seatCount: params.seatCount || (cartEnrollmentType === 'corporate' ? 3 : 1),
          description: params.description,
          cpdHours: cpd,
          modulesCount: modules,
        };
        next = [...prev, newItem];
      }
      try {
        localStorage.setItem('complisey_academy_cart', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save cart to localStorage', err);
      }
      return next;
    });

    setLastCartFeedback(`Added "${title}" to your cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setRawCart((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      try {
        localStorage.setItem('complisey_academy_cart', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to update cart in storage', err);
      }
      return next;
    });
  };

  const updateCartItemSeats = (itemId: string, seats: number) => {
    const validSeats = Math.max(1, Math.min(500, Math.floor(seats)));
    setRawCart((prev) => {
      const next = prev.map((i) => (i.id === itemId ? { ...i, seatCount: validSeats } : i));
      try {
        localStorage.setItem('complisey_academy_cart', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to update cart in storage', err);
      }
      return next;
    });
  };

  const clearCart = () => {
    setRawCart([]);
    try {
      localStorage.removeItem('complisey_academy_cart');
    } catch (err) {
      console.warn('Failed to clear cart storage', err);
    }
  };

  const dismissCartFeedback = () => {
    setLastCartFeedback(null);
  };

  const checkoutCart = (params: {
    companyName: string;
    companyAddress?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
    isCorporate?: boolean;
    industrySector?: string;
  }): EnrollmentOrder => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }
    const primaryItem = cart[0];
    const isMulti = cart.length > 1;
    const courseId = isMulti ? 'cart-multi-package' : primaryItem.courseId;
    const seatCount = cartTotalSeats;
    const packageType = isMulti ? 'pack' : primaryItem.packageType;

    const order = createProformaOrder({
      courseId,
      seatCount,
      companyName: params.companyName,
      companyAddress: params.companyAddress,
      contactName: params.contactName,
      contactEmail: params.contactEmail,
      contactPhone: params.contactPhone,
      notes: `${params.notes || ''} [Cart Checkout Items: ${cart.map(c => `${c.courseTitle} (${c.seatCount} seats)`).join(', ')}]`,
      isCorporate: params.isCorporate ?? (seatCount > 1),
      packageType,
    });

    clearCart();
    setIsCartOpen(false);
    return order;
  };

  const [currency, setCurrency] = useState<CurrencyType>('SCR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Enrolled courses state
  const [enrolledProgress, setEnrolledProgress] = useState<Record<string, EnrolledCourseProgress>>(() => {
    const savedUserStr = localStorage.getItem('academy_current_user');
    if (!savedUserStr) {
      try {
        localStorage.removeItem('academy_enrolled_progress');
      } catch (e) {
        // ignore
      }
      return {};
    }

    try {
      const user = JSON.parse(savedUserStr);
      if (!user || !user.email) {
        localStorage.removeItem('academy_enrolled_progress');
        return {};
      }

      const saved = localStorage.getItem('academy_enrolled_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved progress', e);
    }
    return {};
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('academy_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('academy_certificates');
    if (saved) {
      try {
        const parsed: Certificate[] = JSON.parse(saved);
        return parsed.map((c) => ({
          ...c,
          instructorName: 'CompliSey Regulatory Faculty',
        }));
      } catch (e) {
        console.error('Failed to parse saved certificates', e);
      }
    }
    
    // Generate a default certificate that is near expiry (e.g. expiring in 15 days)
    // to demonstrate the 30-day refresher warning system
    const issueDate = new Date();
    issueDate.setMonth(issueDate.getMonth() - 11);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15);

    const demoCert: Certificate = {
      id: "CERT-AML-REF",
      courseId: "course-aml-fundamentals",
      courseTitle: "Seychelles AML/CFT Statutory Fundamentals",
      studentName: "Alex Rivera",
      issueDate: issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      expiryDate: expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      instructorName: "CompliSey Regulatory Faculty",
      gradeScore: "88% (Pass)",
      verificationCode: "VERIFY-EXP-AML-2025",
    };

    return [demoCert];
  });

  // Real-time synchronization state across devices
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Subscribe to progressSyncService status changes
  useEffect(() => {
    const unsubscribe = progressSyncService.onStatusChange((status, time, msg) => {
      setSyncStatus(status);
      if (time) setLastSyncedAt(time);
      if (msg) setSyncMessage(msg);
    });
    return () => unsubscribe();
  }, []);

  // Real-time cross-device listener: subscribe to Firestore progress changes for current authenticated student
  useEffect(() => {
    // Strictly gate: Unauthenticated public visitors or non-enrolled sessions do NOT sync private records
    if (!currentUser || !currentUser.id || currentUser.role === 'visitor') {
      return;
    }
    const studentId = currentUser.id;
    const unsubscribe = progressSyncService.subscribeToStudentProgress(studentId, (records) => {
      setEnrolledProgress((prev) => {
        let updated = false;
        const next = { ...prev };

        records.forEach((rec) => {
          const current = next[rec.courseId];
          const hasMoreLessons = !current || rec.completedLessonIds.length > current.completedLessonIds.length;
          const hasDifferentLessons = current && rec.completedLessonIds.some((id) => !current.completedLessonIds.includes(id));

          if (!current || hasMoreLessons || hasDifferentLessons) {
            updated = true;
            const mergedCompleted = Array.from(
              new Set([...(current?.completedLessonIds || []), ...rec.completedLessonIds])
            );
            next[rec.courseId] = {
              courseId: rec.courseId,
              enrolledAt: current?.enrolledAt || rec.updatedAt,
              lastAccessedAt: rec.updatedAt,
              completedLessonIds: mergedCompleted,
              activeLessonId: current?.activeLessonId || rec.completedLessonIds[0] || 'les-1-1',
              personalNotes: current?.personalNotes || {},
              quizScores: { ...(current?.quizScores || {}), ...(rec.quizScores || {}) },
              isCompleted: rec.isCompleted || (current?.isCompleted ?? false),
            };
          }
        });

        return updated ? next : prev;
      });
    });

    return () => unsubscribe();
  }, [currentUser?.id, student?.id]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('academy_enrolled_progress', JSON.stringify(enrolledProgress));
  }, [enrolledProgress]);

  useEffect(() => {
    localStorage.setItem('academy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('academy_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('academy_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('academy_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('academy_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Session Idle Timeout (25 Minutes) for Strict Attendance and Security Compliance
  useEffect(() => {
    if (!currentUser) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      // 25 minutes in milliseconds = 25 * 60 * 1000 = 1,500,000 ms
      idleTimer = setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('academy_current_user');
        localStorage.removeItem('complisey_registered_session_id');
        setActiveTab('dashboard');
        setLatestNotificationToast({
          id: `idle-timeout-${Date.now()}`,
          senderName: 'CompliSey Security System',
          senderEmail: 'security@complisey.com',
          recipientEmail: currentUser.email,
          subject: 'Session Locked Due to 25 Mins Inactivity',
          message: 'Your session was automatically locked after 25 minutes of inactivity to ensure strict attendance and professional compliance security. Your course progress and certificates are safely saved.',
          timestamp: new Date().toLocaleTimeString(),
          read: false,
          category: 'security',
        });
      }, 25 * 60 * 1000);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [currentUser]);

  // Real-time Academic Integrity Logs
  const [integrityViolations, setIntegrityViolations] = useState<any[]>(() => {
    const saved = localStorage.getItem('complisey_integrity_violations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved violations', e);
      }
    }
    
    // Default demo proctoring logs for the Corporate Audit Dashboard
    return [
      {
        id: 'viol-demo-1',
        studentId: 'mem-2',
        studentName: 'Chantel Dubois',
        studentEmail: 'c.dubois@democorp.sc',
        courseId: 'c-1',
        courseTitle: 'Seychelles AML/CFT Statutory Fundamentals',
        violationType: 'tab_switch',
        violationTitle: 'Browser Tab Switch Detected',
        violationDetail: 'Navigated away from the exam tab to an external window during the active AML competency exam.',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
      {
        id: 'viol-demo-2',
        studentId: 'mem-3',
        studentName: 'Jean-Paul Adam',
        studentEmail: 'jp.adam@democorp.sc',
        courseId: 'c-1',
        courseTitle: 'Seychelles AML/CFT Statutory Fundamentals',
        violationType: 'window_blur',
        violationTitle: 'Window Focus Lost',
        violationDetail: 'Lost active window focus. Potential secondary monitor usage or desktop application switching flagged.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      }
    ];
  });

  const recordIntegrityViolation = (viol: any) => {
    setIntegrityViolations((prev) => {
      const next = [viol, ...prev];
      localStorage.setItem('complisey_integrity_violations', JSON.stringify(next));
      return next;
    });

    systemAuditLogService.logEvent(
      'EXAMS',
      'WARNING',
      'EXAM_INTEGRITY_VIOLATION',
      viol.studentEmail || viol.studentName || 'Student',
      'student',
      `Proctoring flag: ${viol.violationTitle || viol.violationType} in ${viol.courseTitle || viol.courseId}. ${viol.violationDetail || ''}`,
      viol
    );
  };

  // Automated Admin Notifications State & Firestore Sync
  const [adminNotifications, setAdminNotifications] = useState<AdminEmailNotification[]>(() =>
    adminEmailNotificationService.getNotifications()
  );
  const [latestNotificationToast, setLatestNotificationToast] = useState<AdminEmailNotification | null>(null);

  useEffect(() => {
    const unsub = adminEmailNotificationService.subscribe((items) => {
      setAdminNotifications(items);
    });
    adminEmailNotificationService.syncFromFirestore();
    return () => unsub();
  }, []);

  const unreadAdminNotificationsCount = adminNotifications.filter((n) => !n.isRead).length;

  const markAdminNotificationAsRead = (id: string) => {
    adminEmailNotificationService.markAsRead(id);
  };

  const markAllAdminNotificationsAsRead = () => {
    adminEmailNotificationService.markAllAsRead();
  };

  const triggerManualNotificationDispatch = async (order: EnrollmentOrder, recipients?: string[]) => {
    const notif = await adminEmailNotificationService.triggerProformaNotification(order, recipients);
    setLatestNotificationToast(notif);
    return notif;
  };

  const dismissNotificationToast = () => {
    setLatestNotificationToast(null);
  };

  // Client Payment Receipt Confirmations State
  const [clientReceipts, setClientReceipts] = useState<ClientReceiptConfirmation[]>(() =>
    clientReceiptNotificationService.getReceipts()
  );

  useEffect(() => {
    const unsub = clientReceiptNotificationService.subscribe((items) => {
      setClientReceipts(items);
    });
    return () => unsub();
  }, []);

  const getClientReceiptForOrder = (orderId: string): ClientReceiptConfirmation | undefined => {
    return clientReceipts.find((r) => r.orderId === orderId);
  };

  const sendClientReceiptConfirmationEmail = async (
    orderId: string,
    customIssuer?: string
  ): Promise<ClientReceiptConfirmation | null> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return null;

    const invoiceNum = targetOrder.taxInvoiceNumber || `INV-CS-2026-${orderId.replace(/\D/g, '').padStart(5, '0')}`;
    const token = targetOrder.activationToken || `CS-ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const issuer = customIssuer || targetOrder.activatedBy || (currentUser?.name || 'Malcolm Simon');

    const receipt = await clientReceiptNotificationService.triggerReceiptConfirmation(
      targetOrder,
      invoiceNum,
      token,
      issuer
    );

    // Update order status flag
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              receiptConfirmationSent: true,
              receiptConfirmationSentAt: new Date().toISOString(),
            }
          : o
      )
    );

    return receipt;
  };

  const switchAccount = (roleKey: 'admin' | 'corporate' | 'learner') => {
    const target = DEMO_ACCOUNTS[roleKey]?.account;
    if (!target) return;
    setCurrentUser(target);
    setStudent((prev) => ({
      ...prev,
      name: target.name,
      email: target.email,
      avatar: target.avatar,
      title: target.title,
      companyName: target.companyName,
      role: target.role,
      joinCodeRedeemed: target.joinCode || prev.joinCodeRedeemed,
    }));
    if (target.role === 'admin') {
      setActiveTab('admin');
    } else if (target.role === 'corporate') {
      setActiveTab('corporate');
    } else {
      setActiveTab('dashboard');
    }
  };

  const generateSessionId = () =>
    `ses_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;

  const registerUserSession = ({
    name,
    email,
    role = 'learner',
    companyName = 'Individual Learner',
    phone,
  }: {
    name: string;
    email: string;
    role?: UserRole;
    companyName?: string;
    phone?: string;
  }): UserAccount => {
    const cleanEmail = email.trim().toLowerCase();
    const sessionId = generateSessionId();
    const resolvedRole: UserRole = role;
    const isCorp = resolvedRole === 'corporate';
    const newAcc: UserAccount = {
      id: `usr_${Date.now().toString(36)}`,
      sessionId,
      email: cleanEmail,
      name: name.trim(),
      role: resolvedRole,
      title: isCorp ? 'Corporate Compliance Officer' : resolvedRole === 'admin' ? 'Administrator' : 'Accredited Compliance Learner',
      companyName: isCorp ? (companyName.trim() || 'Seychelles Reporting Entity') : 'Individual Learner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      registeredAt: new Date().toISOString(),
    };

    setCurrentUser(newAcc);
    try {
      localStorage.setItem('academy_current_user', JSON.stringify(newAcc));
      localStorage.setItem('complisey_registered_session_id', sessionId);
      const prevUsersStr = localStorage.getItem('academy_registered_users');
      const prevUsers: UserAccount[] = prevUsersStr ? JSON.parse(prevUsersStr) : [];
      const updatedUsers = [newAcc, ...prevUsers.filter((u) => u.email.toLowerCase() !== cleanEmail)];
      localStorage.setItem('academy_registered_users', JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Failed to persist user session registration:', e);
    }

    setStudent((prev) => ({
      ...prev,
      name: newAcc.name,
      email: newAcc.email,
      role: newAcc.role,
      companyName: newAcc.companyName,
    }));

    return newAcc;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('academy_current_user');
    localStorage.removeItem('complisey_registered_session_id');
    // Note: academy_enrolled_progress is intentionally preserved so course progress is never lost across sessions
    setActiveTab('dashboard');
  };

  const loginWithCredentials = (email: string, password: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const sessionId = generateSessionId();
    
    // Check if Malcolm or Eric is logging in as Admin
    if (
      trimmedEmail === 'malcolm@complisanc.com' ||
      trimmedEmail === 'eric@complisanc.com' ||
      trimmedEmail === 'msimonitc@gmail.com'
    ) {
      const isEric = trimmedEmail.includes('eric');
      const adminEmail = isEric ? 'eric@complisanc.com' : 'malcolm@complisanc.com';
      const expectedPassword = adminPasswords[adminEmail] || (isEric ? 'CompliseyEric2026!' : 'CompliseyMalcolm2026!');

      if (password !== expectedPassword) {
        return {
          success: false,
          message: 'Invalid administrator password for this account. Each administrator must use their own unique assigned password.',
        };
      }

      const adminAccount: UserAccount = {
        id: isEric ? 'usr-admin-eric' : 'usr-admin-malcolm',
        sessionId,
        email: adminEmail,
        name: isEric ? "Eric D'Souza" : 'Malcolm Simon',
        role: 'admin',
        title: isEric ? 'Training Inquiries & Lead Instructor' : 'Administration & Support | Managing Director',
        companyName: 'Complisanc Consulting Services (SEY)',
        avatar: isEric
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        registeredAt: new Date().toISOString(),
      };
      setCurrentUser(adminAccount);
      localStorage.setItem('academy_current_user', JSON.stringify(adminAccount));
      localStorage.setItem('complisey_registered_session_id', sessionId);
      setStudent((prev) => ({
        ...prev,
        name: adminAccount.name,
        email: adminAccount.email,
        avatar: adminAccount.avatar,
        title: adminAccount.title,
        companyName: adminAccount.companyName,
        role: 'admin',
      }));
      setActiveTab('admin');

      systemAuditLogService.logEvent(
        'AUTH',
        'INFO',
        'ADMIN_AUTHENTICATED',
        adminAccount.name,
        'admin',
        `Admin back office session initialized for ${adminAccount.name} (${adminAccount.email}).`,
        { sessionId }
      );

      return { success: true, message: `Welcome back, ${adminAccount.name}. Administrator session established.` };
    }

    // Check configured demo or team accounts
    const match = Object.values(DEMO_ACCOUNTS).find(
      (entry) => entry.account.email.toLowerCase() === trimmedEmail && entry.passwordHash === password
    );
    if (match) {
      const sessionAccount: UserAccount = {
        ...match.account,
        sessionId,
      };
      setCurrentUser(sessionAccount);
      localStorage.setItem('academy_current_user', JSON.stringify(sessionAccount));
      localStorage.setItem('complisey_registered_session_id', sessionId);
      setStudent((prev) => ({
        ...prev,
        name: match.account.name,
        email: match.account.email,
        avatar: match.account.avatar,
        title: match.account.title,
        companyName: match.account.companyName,
        role: match.account.role,
        joinCodeRedeemed: match.account.joinCode || prev.joinCodeRedeemed,
      }));
      if (typeof window !== 'undefined' && localStorage.getItem('complisey_onboarding_dismissed') !== 'true') {
        setIsRegistrationWizardOpen(true);
      }
      if (match.account.role === 'admin') {
        setActiveTab('admin');
      } else if (match.account.role === 'corporate') {
        setActiveTab('corporate');
      } else {
        setActiveTab('dashboard');
      }
      return { success: true, message: `Signed in as ${match.account.name}. Session active.` };
    }

    // Check previously registered users saved in browser storage
    try {
      const regUsersStr = localStorage.getItem('academy_registered_users');
      if (regUsersStr) {
        const regUsers: UserAccount[] = JSON.parse(regUsersStr);
        const userFound = regUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
        if (userFound) {
          const sessionUser: UserAccount = {
            ...userFound,
            sessionId,
          };
          setCurrentUser(sessionUser);
          localStorage.setItem('academy_current_user', JSON.stringify(sessionUser));
          localStorage.setItem('complisey_registered_session_id', sessionId);
          setStudent((prev) => ({
            ...prev,
            name: sessionUser.name,
            email: sessionUser.email,
            role: sessionUser.role,
            companyName: sessionUser.companyName,
          }));
          setActiveTab(sessionUser.role === 'corporate' ? 'corporate' : 'dashboard');
          return { success: true, message: `Welcome back, ${sessionUser.name}. Session active.` };
        }
      }
    } catch (e) {
      console.error('Failed to parse registered users', e);
    }

    // Check orders by email for registered students
    const matchingOrder = orders.find((o) => o.contactEmail.toLowerCase() === trimmedEmail);
    if (matchingOrder) {
      const isCorp = matchingOrder.seatCount > 1 || Boolean(matchingOrder.companyName && matchingOrder.companyName !== 'Individual Learner');
      const userAcc: UserAccount = {
        id: `usr_${matchingOrder.id}`,
        sessionId,
        email: matchingOrder.contactEmail,
        name: matchingOrder.contactName,
        role: isCorp ? 'corporate' : 'learner',
        title: isCorp ? 'Corporate MLRO' : 'Staff Learner',
        companyName: matchingOrder.companyName || 'Seychelles Reporting Entity',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        registeredAt: matchingOrder.createdAt,
      };
      setCurrentUser(userAcc);
      localStorage.setItem('academy_current_user', JSON.stringify(userAcc));
      localStorage.setItem('complisey_registered_session_id', sessionId);
      setStudent((prev) => ({
        ...prev,
        name: userAcc.name,
        email: userAcc.email,
        role: userAcc.role,
        companyName: userAcc.companyName,
      }));
      setActiveTab(isCorp ? 'corporate' : 'dashboard');
      return { success: true, message: `Signed in as ${userAcc.name}. Session authenticated.` };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter your registered email address.',
    };
  };

  const redeemJoinCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DEMO2026' || cleanCode === 'COMPLISEY-SEAT-2026' || cleanCode === 'FSA-STAFF-2026' || cleanCode === 'VICTORIA2026') {
      // 1. Unlock all 6 courses in catalogue
      setEnrolledProgress((prev) => {
        const updated = { ...prev };
        courses.forEach((c) => {
          if (!updated[c.id]) {
            const firstLessonId = c.modules[0]?.lessons[0]?.id || 'les-1-1';
            updated[c.id] = {
              courseId: c.id,
              enrolledAt: new Date().toISOString(),
              lastAccessedAt: new Date().toISOString(),
              completedLessonIds: [],
              activeLessonId: firstLessonId,
              personalNotes: {},
              quizScores: {},
              isCompleted: false,
            };
          }
        });
        return updated;
      });

      // 2. Update student profile
      setStudent((prev) => ({
        ...prev,
        companyName: 'Demo Corp Ltd',
        title: 'Compliance Officer · Regulated Entity Staff',
        joinCodeRedeemed: cleanCode,
      }));

      // 3. Add transaction record
      const newTx: Transaction = {
        id: `tx_seat_${Date.now().toString(36)}`,
        courseId: 'course-aml-fundamentals',
        courseTitle: '12-Month Prepaid Seat — Full Catalogue (All 6 Courses)',
        amount: 0,
        currency: 'SCR',
        gateway: 'stripe',
        status: 'succeeded',
        createdAt: new Date().toISOString(),
        invoiceNumber: `SEAT-${cleanCode}-${Math.floor(1000 + Math.random() * 9000)}`,
        couponApplied: cleanCode,
        discountAmount: 1000,
        paymentMethodDetails: {
          brand: 'Corporate Prepaid Voucher (Demo Corp Ltd)',
          last4: 'SEAT',
          payerEmail: student.email,
        },
      };
      setTransactions((prev) => [newTx, ...prev]);

      return {
        success: true,
        message: `Corporate Join Code "${cleanCode}" successfully verified! 12-Month access to all 6 catalogue courses unlocked under Demo Corp Ltd.`,
      };
    }

    return {
      success: false,
      message: 'Invalid seat join code. In this local review build, enter DEMO2026.',
    };
  };

  const createProformaOrder = ({
    courseId,
    seatCount,
    companyName,
    companyAddress,
    contactName,
    contactEmail,
    contactPhone,
    notes,
    isCorporate,
    packageType,
  }: {
    courseId: string;
    seatCount: number;
    companyName: string;
    companyAddress?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
    isCorporate?: boolean;
    packageType?: CoursePackageType;
  }): EnrollmentOrder => {
    const course = courses.find((c) => c.id === courseId);
    const resolvedIsCorporate = isCorporate !== undefined ? isCorporate : (seatCount > 1 || Boolean(companyName && companyName !== 'Individual Learner'));
    const resolvedPackageType = packageType || resolvePackageType(courseId);
    const calculation = calculateOrderTotalSCR(seatCount, resolvedIsCorporate, resolvedPackageType);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const proformaNum = `PRF-CS-2026-${randomSuffix}`;
    const ccsBookingId = `CCS-BK-2026-${randomSuffix}`;

    let defaultTitle = 'CompliSey Academy: Complete Curriculum Pack (Levels 1 & 2 - All 6 Modules)';
    if (resolvedPackageType === 'level1' || courseId === 'level1-bundle') {
      defaultTitle = 'CompliSey Academy: Level 1 Statutory Foundations (3 Modules)';
    } else if (resolvedPackageType === 'level2' || courseId === 'level2-bundle') {
      defaultTitle = 'CompliSey Academy: Level 2 Advanced Operations (3 Modules)';
    }

    const newOrder: EnrollmentOrder = {
      id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      proformaNumber: proformaNum,
      ccsBookingId,
      courseId,
      courseTitle: course ? course.title : defaultTitle,
      seatCount: calculation.seatCount,
      unitPrice: calculation.ratePerSeat,
      totalAmount: calculation.totalSCR,
      currency: 'SCR',
      paymentMethod: 'bank_transfer',
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      companyName,
      companyAddress,
      contactName,
      contactEmail,
      contactPhone,
      bankReferenceCode: ccsBookingId,
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedProformaForView(newOrder);

    // If visitor wasn't logged in, immediately establish accredited session
    if (!currentUser) {
      registerUserSession({
        name: contactName,
        email: contactEmail,
        role: resolvedIsCorporate ? 'corporate' : 'learner',
        companyName: resolvedIsCorporate ? (companyName || 'Seychelles Reporting Entity') : 'Individual Learner',
        phone: contactPhone,
      });
    }

    // Automatically trigger email notification for admins
    adminEmailNotificationService
      .triggerProformaNotification(newOrder)
      .then((notif) => {
        setLatestNotificationToast(notif);
      })
      .catch((err) => {
        console.warn('Failed to trigger admin email notification:', err);
      });

    systemAuditLogService.logEvent(
      'ORDERS',
      'INFO',
      'PROFORMA_ORDER_CREATED',
      contactEmail,
      'corporate_manager',
      `Generated proforma invoice ${proformaNum} for ${companyName} (${calculation.seatCount} seats, SCR ${calculation.totalSCR.toLocaleString()}).`,
      {
        orderId: newOrder.id,
        proformaNumber: proformaNum,
        ccsBookingId,
        courseId,
        companyName,
        seatCount: calculation.seatCount,
        totalAmount: calculation.totalSCR,
      }
    );

    return newOrder;
  };

  const createEnrollmentOrder = (order: EnrollmentOrder) => {
    setOrders((prev) => [order, ...prev]);
    setSelectedProformaForView(order);
  };

  const adminActivateOrder = (orderId: string, adminNote?: string) => {
    const activatedTimestamp = new Date().toISOString();
    let activatedOrderSnapshot: EnrollmentOrder | null = null;
    let primaryToken = '';
    let adminIssuer = currentUser?.name || 'Malcolm Simon (Managing Director)';

    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === orderId) {
          const seatCount = Math.max(1, o.seatCount || 1);
          const isLevel1 = o.courseId === 'pkg-level-1';
          const isLevel2 = o.courseId === 'pkg-level-2';
          const isAll = o.courseId === 'pkg-both' || o.courseId === 'pkg-all' || o.courseId === 'cart-multi-package';
          const targetCourseIds = isAll
            ? ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6']
            : isLevel1
            ? ['c-1', 'c-2', 'c-3']
            : isLevel2
            ? ['c-4', 'c-5', 'c-6']
            : [o.courseId];

          const generatedTokens = activationTokenService.generateTokensForOrder({
            orderId: o.id,
            proformaNumber: o.proformaNumber,
            ccsBookingId: o.ccsBookingId,
            companyName: o.companyName,
            contactName: o.contactName,
            contactEmail: o.contactEmail,
            seatCount,
            courseIds: targetCourseIds,
            courseTitle: o.courseTitle,
            issuedBy: adminIssuer,
          });

          primaryToken = generatedTokens[0]?.token || `CS-ACT-${Math.floor(1000 + Math.random() * 9000)}`;

          const updated: EnrollmentOrder = {
            ...o,
            status: 'activated',
            activatedAt: activatedTimestamp,
            activatedBy: adminIssuer,
            taxInvoiceNumber: `INV-CS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            activationToken: primaryToken,
            activationTokens: generatedTokens.map((t) => t.token),
            receiptConfirmationSent: true,
            receiptConfirmationSentAt: activatedTimestamp,
            notes: adminNote ? `${o.notes || ''} [Admin Activation Note: ${adminNote}]` : o.notes,
          };
          activatedOrderSnapshot = updated;
          return updated;
        }
        return o;
      });

      try {
        localStorage.setItem('academy_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist activated order', e);
      }
      return next;
    });

    setActivationTokens(activationTokenService.getAllTokens());

    if (!activatedOrderSnapshot) return;
    const targetOrder = activatedOrderSnapshot;
    const invoiceNum = targetOrder.taxInvoiceNumber || `INV-CS-2026-${targetOrder.id}`;

    // If single seat, auto-enroll contact email immediately
    if (targetOrder.seatCount === 1) {
      setEnrolledProgress((prev) => {
        const next = { ...prev };
        const isLevel1 = targetOrder.courseId === 'pkg-level-1';
        const isLevel2 = targetOrder.courseId === 'pkg-level-2';
        const isAll = targetOrder.courseId === 'pkg-both' || targetOrder.courseId === 'pkg-all' || targetOrder.courseId === 'cart-multi-package';
        const targetCourseIds = isAll
          ? ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6']
          : isLevel1
          ? ['c-1', 'c-2', 'c-3']
          : isLevel2
          ? ['c-4', 'c-5', 'c-6']
          : [targetOrder.courseId];

        targetCourseIds.forEach((cId) => {
          if (!next[cId]) {
            const crs = courses.find((c) => c.id === cId);
            const firstLessonId = crs?.modules[0]?.lessons[0]?.id || 'les-1-1';
            next[cId] = {
              courseId: cId,
              enrolledAt: activatedTimestamp,
              lastAccessedAt: activatedTimestamp,
              completedLessonIds: [],
              activeLessonId: firstLessonId,
              personalNotes: {},
              quizScores: {},
              isCompleted: false,
            };
          }
        });
        return next;
      });
    }

    clientReceiptNotificationService.triggerReceiptConfirmation(
      targetOrder,
      invoiceNum,
      primaryToken,
      adminIssuer
    );

    systemAuditLogService.logEvent(
      'BILLING',
      'INFO',
      'ORDER_ACTIVATED',
      adminIssuer,
      'admin',
      `Order ${targetOrder.proformaNumber} (${targetOrder.companyName}) confirmed and activated by ${adminIssuer}. Official Tax Invoice ${invoiceNum} generated.`,
      {
        orderId: targetOrder.id,
        proformaNumber: targetOrder.proformaNumber,
        taxInvoiceNumber: invoiceNum,
        companyName: targetOrder.companyName,
        seatCount: targetOrder.seatCount,
        totalAmount: targetOrder.totalAmount,
        currency: targetOrder.currency,
        adminNote,
        adminIssuer,
      }
    );
  };

  const submitWireRemittance = (orderId: string, details: {
    bankName: string;
    referenceNumber: string;
    remittanceDate: string;
    senderNotes?: string;
  }) => {
    const timestamp = new Date().toISOString();
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              remittanceSubmitted: true,
              remittanceSubmittedAt: timestamp,
              remittanceBankName: details.bankName,
              remittanceReference: details.referenceNumber,
              remittanceNotes: details.senderNotes,
              notes: `${o.notes || ''} [Wire Remittance Reported: ${details.bankName} Ref: ${details.referenceNumber}]`,
            }
          : o
      );
      try {
        localStorage.setItem('academy_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist remittance', e);
      }
      return next;
    });

    const target = orders.find((o) => o.id === orderId);
    if (target) {
      adminEmailNotificationService.triggerProformaNotification({
        ...target,
        notes: `[WIRE REMITTANCE NOTIFICATION] Student/Client reported bank remittance of ${target.currency} ${target.totalAmount.toLocaleString()} via ${details.bankName}. Transfer Ref: ${details.referenceNumber}. Date: ${details.remittanceDate}. Notes: ${details.senderNotes || 'N/A'}.`,
      }).catch(console.warn);

      systemAuditLogService.logEvent(
        'BILLING',
        'INFO',
        'WIRE_REMITTANCE_SUBMITTED',
        target.contactEmail,
        'corporate_manager',
        `Client submitted bank remittance proof for ${target.proformaNumber}: ${details.bankName} (Ref: ${details.referenceNumber}).`,
        {
          orderId,
          proformaNumber: target.proformaNumber,
          bankName: details.bankName,
          referenceNumber: details.referenceNumber,
          remittanceDate: details.remittanceDate,
          totalAmount: target.totalAmount,
        }
      );
    }
  };

  const processOnlineOrderPayment = (orderId: string, paymentDetails: {
    cardBrand?: string;
    last4?: string;
    cardholderName?: string;
  }) => {
    adminActivateOrder(
      orderId,
      `Instant Online Card Payment (${paymentDetails.cardBrand || 'Visa/Mastercard'} ending in ${paymentDetails.last4 || '4242'}) - Cardholder: ${paymentDetails.cardholderName || 'Malcolm Simon'}`
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem('academy_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save orders after deletion', e);
      }
      return next;
    });

    systemAuditLogService.logEvent(
      'BILLING',
      'WARNING',
      'ORDER_DELETED',
      currentUser?.name || 'Malcolm Simon',
      'admin',
      `Order ${orderId} was removed from system by administrator.`
    );
  };

  const clearDemoOrders = () => {
    const demoIds = new Set(['ord-prf-9841', 'ord-prf-9842', 'ord-prf-9840']);
    setOrders((prev) => {
      const next = prev.filter((o) => !demoIds.has(o.id));
      try {
        localStorage.setItem('academy_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save orders after clearing demo data', e);
      }
      return next;
    });

    systemAuditLogService.logEvent(
      'SYSTEM',
      'INFO',
      'DEMO_DATA_PURGED',
      currentUser?.name || 'Malcolm Simon',
      'admin',
      'Demo/seed enrollment orders were purged for production launch readiness.'
    );
  };

  const redeemActivationToken = (tokenString: string) => {
    const clean = tokenString.trim().toUpperCase();
    const token = activationTokenService.findToken(clean);
    if (!token) {
      return {
        success: false,
        message: 'Invalid activation token code. Please check the code provided by Malcolm Simon, Eric, or your Compliance Officer.',
      };
    }

    const userEmail = currentUser?.email || token.issuedToEmail || student.email;
    const userName = currentUser?.name || token.issuedToName || student.name;
    const redeemResult = activationTokenService.markTokenRedeemed(clean, userEmail, userName);
    if (!redeemResult.success) {
      return {
        success: false,
        message: redeemResult.message,
      };
    }

    setActivationTokens(activationTokenService.getAllTokens());

    // If guest visitor wasn't logged in, log them in as the accredited learner
    if (!currentUser) {
      const redeemedAccount: UserAccount = {
        id: `usr-${Date.now()}`,
        email: userEmail,
        name: userName,
        role: 'learner',
        title: 'Accredited Compliance Officer',
        companyName: token.companyName || 'Reporting Entity (Seychelles)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      };
      setCurrentUser(redeemedAccount);
      localStorage.setItem('academy_current_user', JSON.stringify(redeemedAccount));
    }

    // Unlock target courses
    setEnrolledProgress((prev) => {
      const updated = { ...prev };
      token.courseIds.forEach((cId) => {
        const c = courses.find((crs) => crs.id === cId);
        const firstLessonId = c?.modules[0]?.lessons[0]?.id || 'les-1-1';
        if (!updated[cId]) {
          updated[cId] = {
            courseId: cId,
            enrolledAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            completedLessonIds: [],
            activeLessonId: firstLessonId,
            personalNotes: {},
            quizScores: {},
            isCompleted: false,
          };
        }
      });
      return updated;
    });

    return {
      success: true,
      message: `Successfully activated ${token.courseTitle}! Your seat is permanently registered to your learner profile.`,
      courseTitle: token.courseTitle,
      activatedCourseIds: token.courseIds,
      issuedBy: token.issuedBy,
    };
  };

  const assignActivationToken = (tokenString: string, name: string, email: string) => {
    const res = activationTokenService.assignToken(tokenString, name, email);
    setActivationTokens(activationTokenService.getAllTokens());
    return res;
  };

  const unassignActivationToken = (tokenString: string) => {
    const res = activationTokenService.unassignToken(tokenString);
    setActivationTokens(activationTokenService.getAllTokens());
    return res;
  };

  const getTokensForOrder = (orderId: string) => {
    return activationTokenService.getTokensForOrder(orderId);
  };

  const issueActivationTokenForOrder = (orderId: string, issuedBy: 'Malcolm Simon' | 'Eric' = 'Malcolm Simon') => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return null;

    const isLevel1 = targetOrder.courseId === 'pkg-level-1';
    const isLevel2 = targetOrder.courseId === 'pkg-level-2';
    const isAll = targetOrder.courseId === 'pkg-both' || targetOrder.courseId === 'pkg-all';
    const targetCourseIds = isAll
      ? ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6']
      : isLevel1
      ? ['c-1', 'c-2', 'c-3']
      : isLevel2
      ? ['c-4', 'c-5', 'c-6']
      : [targetOrder.courseId];

    const seatCount = Math.max(1, targetOrder.seatCount || 1);
    const orderTokens = activationTokenService.generateTokensForOrder({
      orderId: targetOrder.id,
      proformaNumber: targetOrder.proformaNumber,
      ccsBookingId: targetOrder.ccsBookingId,
      companyName: targetOrder.companyName,
      contactName: targetOrder.contactName,
      contactEmail: targetOrder.contactEmail,
      seatCount,
      courseIds: targetCourseIds,
      courseTitle: targetOrder.courseTitle,
      issuedBy,
    });

    setActivationTokens(activationTokenService.getAllTokens());
    const primaryToken = orderTokens[0]?.token;
    const allTokens = orderTokens.map((t) => t.token);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              activationToken: primaryToken,
              activationTokens: allTokens,
            }
          : o
      )
    );

    return orderTokens[0] || null;
  };

  const generateCustomActivationToken = (params: {
    courseIds: string[];
    courseTitle: string;
    issuedBy: 'Malcolm Simon' | 'Eric' | string;
    issuedToName: string;
    issuedToEmail: string;
    orderId?: string;
  }) => {
    const tokenObj = activationTokenService.generateToken(params);
    setActivationTokens(activationTokenService.getAllTokens());
    return tokenObj;
  };

  const formatPrice = (amount: number): string => {
    if (currency === 'SCR') {
      return formatSCR(amount);
    }
    const info = SCR_EXCHANGE_RATES[currency] || SCR_EXCHANGE_RATES.SCR;
    const converted = amount * info.rateFromSCR;
    return `${info.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  const getCourseProgressPercentage = (courseId: string): number => {
    const progress = enrolledProgress[courseId];
    if (!progress) return 0;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    return Math.min(100, Math.round((progress.completedLessonIds.length / totalLessons) * 100));
  };

  const isCourseCompleted = (courseId: string): boolean => {
    const progress = enrolledProgress[courseId];
    if (!progress) return false;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    return progress.completedLessonIds.length >= totalLessons && totalLessons > 0;
  };

  const isCourseUnlocked = useCallback((courseId: string): boolean => {
    // 1. Unauthenticated public visitors never have access to study courses
    if (!currentUser || !currentUser.email) {
      return false;
    }

    // 2. System administrators have full audit and review access
    if (currentUser.role === 'admin') {
      return true;
    }

    const userEmail = currentUser.email.trim().toLowerCase();

    // 3. Check if THIS authenticated user has an activated, paid order for this course
    const hasActivatedOrder = orders.some((ord) => {
      if (ord.status !== 'activated') return false;
      // Strict verification: Order must be bound to this specific user's email
      if (ord.contactEmail?.trim().toLowerCase() !== userEmail) return false;

      const isAll =
        ord.courseId === 'all-catalogue-seats' ||
        ord.courseId === 'cart-multi-package' ||
        ord.courseTitle.includes('Complete') ||
        ord.courseTitle.includes('Consolidated') ||
        ord.courseTitle.includes('All 6');
      const isLevel1 = ord.courseTitle.includes('Level 1');
      const isLevel2 = ord.courseTitle.includes('Level 2');
      const orderCourseIds = isAll
        ? ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6']
        : isLevel1
        ? ['c-1', 'c-2', 'c-3']
        : isLevel2
        ? ['c-4', 'c-5', 'c-6']
        : [ord.courseId];

      return orderCourseIds.includes(courseId);
    });

    if (hasActivatedOrder) return true;

    // 4. Check if THIS authenticated user has redeemed an activation token for this course
    const hasRedeemedToken = activationTokens.some((tok) => {
      if (tok.status !== 'redeemed') return false;
      // Strict verification: Token must be redeemed by this specific user's email
      if (tok.redeemedByEmail?.trim().toLowerCase() !== userEmail) return false;
      return tok.courseIds.includes(courseId);
    });

    if (hasRedeemedToken) return true;

    return false;
  }, [currentUser, orders, activationTokens]);

  const openCoursePlayer = (courseId: string, lessonId?: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    // Hard access control gate: Must be registered and settled / redeemed token / admin
    if (!isCourseUnlocked(courseId)) {
      setSelectedCourseForCheckout(course);
      return;
    }

    setActiveCourseId(courseId);
    const progress = enrolledProgress[courseId];
    if (lessonId) {
      setActiveLessonId(lessonId);
    } else if (progress?.activeLessonId) {
      setActiveLessonId(progress.activeLessonId);
    } else {
      const firstLesson = course.modules[0]?.lessons[0];
      if (firstLesson) {
        setActiveLessonId(firstLesson.id);
      }
    }
    setActiveTab('player');
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;

      const isCompleted = existing.completedLessonIds.includes(lessonId);
      const newCompleted = isCompleted
        ? existing.completedLessonIds.filter((id) => id !== lessonId)
        : [...existing.completedLessonIds, lessonId];

      const course = courses.find((c) => c.id === courseId);
      const totalLessons = course ? course.modules.reduce((s, m) => s + m.lessons.length, 0) : 0;
      const completedAll = totalLessons > 0 && newCompleted.length >= totalLessons;

      return {
        ...prev,
        [courseId]: {
          ...existing,
          completedLessonIds: newCompleted,
          isCompleted: completedAll,
          lastAccessedAt: new Date().toISOString(),
        },
      };
    });
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;
      if (existing.completedLessonIds.includes(lessonId)) return prev;

      const newCompleted = [...existing.completedLessonIds, lessonId];
      const course = courses.find((c) => c.id === courseId);
      const totalLessons = course ? course.modules.reduce((s, m) => s + m.lessons.length, 0) : 0;
      const completedAll = totalLessons > 0 && newCompleted.length >= totalLessons;

      return {
        ...prev,
        [courseId]: {
          ...existing,
          completedLessonIds: newCompleted,
          isCompleted: completedAll,
          lastAccessedAt: new Date().toISOString(),
        },
      };
    });
  };

  const savePersonalNote = (courseId: string, lessonId: string, note: string) => {
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;
      return {
        ...prev,
        [courseId]: {
          ...existing,
          personalNotes: {
            ...existing.personalNotes,
            [lessonId]: note,
          },
        },
      };
    });
  };

  const recordQuizScore = (courseId: string, lessonId: string, score: number) => {
    let updatedCompletedIds: string[] = [];
    let isCourseDone = false;

    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;

      const newScores = {
        ...existing.quizScores,
        [lessonId]: score,
      };

      let newCompleted = existing.completedLessonIds;
      if (score >= 70 && !existing.completedLessonIds.includes(lessonId)) {
        newCompleted = [...existing.completedLessonIds, lessonId];
      }
      updatedCompletedIds = newCompleted;

      const course = courses.find((c) => c.id === courseId);
      const totalLessons = course ? course.modules.reduce((s, m) => s + m.lessons.length, 0) : 0;
      isCourseDone = totalLessons > 0 && newCompleted.length >= totalLessons;

      return {
        ...prev,
        [courseId]: {
          ...existing,
          quizScores: newScores,
          completedLessonIds: newCompleted,
          isCompleted: isCourseDone,
          lastAccessedAt: new Date().toISOString(),
        },
      };
    });

    // Automatically trigger real-time synchronization to database upon finishing quiz module
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
      const completionPercentage = totalLessons > 0
        ? Math.min(100, Math.round((updatedCompletedIds.length / totalLessons) * 100))
        : 0;

      const studentId = currentUser?.id || student?.id || 'learner_alex_rivera';
      const studentName = currentUser?.name || student?.name || 'Alex Rivera';

      progressSyncService.syncProgressOnQuizFinish({
        studentId,
        studentName,
        courseId,
        courseTitle: course.title,
        completionPercentage,
        completedLessonIds: updatedCompletedIds,
        quizScores: { [lessonId]: score },
        lastQuizLessonId: lessonId,
        lastQuizScore: score,
        isCompleted: isCourseDone,
      });
    }
  };

  const recordUnitQuizScore = (courseId: string, unitId: string, score: number) => {
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;
      const updatedUnitScores = {
        ...(existing.unitQuizScores || {}),
        [unitId]: score,
      };
      return {
        ...prev,
        [courseId]: {
          ...existing,
          unitQuizScores: updatedUnitScores,
          quizScores: {
            ...existing.quizScores,
            [unitId]: score,
          },
          lastAccessedAt: new Date().toISOString(),
        },
      };
    });
  };

  const recordExamScore = (courseId: string, score: number) => {
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;
      const passed = score >= 80;
      return {
        ...prev,
        [courseId]: {
          ...existing,
          examScore: score,
          isCompleted: passed || existing.isCompleted,
          lastAccessedAt: new Date().toISOString(),
        },
      };
    });
  };

  const forceSyncProgress = async (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const progress = enrolledProgress[courseId];
    if (!course || !progress) return;

    const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
    const completionPercentage = totalLessons > 0
      ? Math.min(100, Math.round((progress.completedLessonIds.length / totalLessons) * 100))
      : 0;

    const studentId = currentUser?.id || student?.id || 'learner_alex_rivera';
    const studentName = currentUser?.name || student?.name || 'Alex Rivera';

    await progressSyncService.syncProgressOnQuizFinish({
      studentId,
      studentName,
      courseId,
      courseTitle: course.title,
      completionPercentage,
      completedLessonIds: progress.completedLessonIds,
      quizScores: progress.quizScores,
      isCompleted: progress.isCompleted,
    });
  };

  const claimCertificate = (courseId: string): Certificate | null => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return null;

    const existingCert = certificates.find((c) => c.courseId === courseId);
    if (existingCert) return existingCert;

    const issueDateObj = new Date();
    const expiryDateObj = new Date();
    expiryDateObj.setFullYear(issueDateObj.getFullYear() + 1);

    const newCert: Certificate = {
      id: `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      courseId: course.id,
      courseTitle: course.title,
      studentName: student.name,
      issueDate: issueDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      expiryDate: expiryDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      instructorName: course.instructor.name,
      gradeScore: '96% (Distinction)',
      verificationCode: `VERIFY-${Date.now().toString(36).toUpperCase()}-${course.id.substring(0, 4).toUpperCase()}`,
    };

    setCertificates((prev) => [newCert, ...prev]);

    setEnrolledProgress((prev) => {
      const curr = prev[courseId];
      if (!curr) return prev;
      return {
        ...prev,
        [courseId]: {
          ...curr,
          certificateClaimedAt: new Date().toISOString(),
          certificateId: newCert.id,
        },
      };
    });

    return newCert;
  };

  const getCertificateExpiryStatuses = () => {
    return certificates.map(cert => {
      if (!cert.expiryDate) {
        return { certificate: cert, daysRemaining: 365, isExpired: false, isNearExpiry: false };
      }
      try {
        const expiryTime = new Date(cert.expiryDate).getTime();
        const nowTime = new Date().getTime();
        const diffMs = expiryTime - nowTime;
        const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining <= 0;
        const isNearExpiry = !isExpired && daysRemaining <= 30;
        return { certificate: cert, daysRemaining, isExpired, isNearExpiry };
      } catch (e) {
        return { certificate: cert, daysRemaining: 365, isExpired: false, isNearExpiry: false };
      }
    });
  };

  const processPaymentEnrollment = (
    courseId: string,
    gateway: PaymentGatewayType,
    details: { brand?: string; last4?: string; payerEmail?: string },
    couponApplied?: string,
    discountAmount: number = 0
  ): Transaction => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const finalAmount = Math.max(0, course.price - discountAmount);
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payerEmail = details.payerEmail || currentUser?.email || student.email;
    const companyName = currentUser?.companyName || (currentUser?.role === 'corporate' ? 'Seychelles Reporting Entity' : 'Individual Learner');

    const newTx: Transaction = {
      id: `tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      courseId: course.id,
      courseTitle: course.title,
      amount: finalAmount,
      currency,
      gateway,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      companyName,
      paymentMethodDetails: {
        ...details,
        payerEmail,
      },
      couponApplied,
      discountAmount,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If visitor wasn't logged in, register their session
    if (!currentUser && payerEmail) {
      registerUserSession({
        name: payerEmail.split('@')[0],
        email: payerEmail,
        role: 'learner',
        companyName,
      });
    }

    // Enroll student in progress
    const firstLessonId = course.modules[0]?.lessons[0]?.id || 'les-1';
    setEnrolledProgress((prev) => ({
      ...prev,
      [courseId]: {
        courseId,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        completedLessonIds: [],
        activeLessonId: firstLessonId,
        personalNotes: {},
        quizScores: {},
        isCompleted: false,
      },
    }));

    // Update student stats
    setStudent((prev) => ({
      ...prev,
      loggedHoursThisWeek: prev.loggedHoursThisWeek + 1,
    }));

    return newTx;
  };

  return (
    <AcademyContext.Provider
      value={{
        student,
        courses,
        enrolledProgress,
        transactions,
        certificates,
        orders,
        selectedProformaForView,
        setSelectedProformaForView,
        createProformaOrder,
        createEnrollmentOrder,
        adminActivateOrder,
        activeTab,
        setActiveTab,
        activeCourseId,
        setActiveCourseId,
        activeLessonId,
        setActiveLessonId,
        selectedCourseForCheckout,
        setSelectedCourseForCheckout,
        selectedTransactionForReceipt,
        setSelectedTransactionForReceipt,
        selectedCertificateForView,
        setSelectedCertificateForView,
        activeLegalModal,
        setActiveLegalModal,
        isSupportModalOpen,
        setIsSupportModalOpen,
        currency,
        setCurrency,
        formatPrice,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        openCoursePlayer,
        markLessonComplete,
        toggleLessonCompletion,
        savePersonalNote,
        recordQuizScore,
        recordUnitQuizScore,
        recordExamScore,
        claimCertificate,
        getCertificateExpiryStatuses,
        processPaymentEnrollment,
        getCourseProgressPercentage,
        isCourseCompleted,
        isCourseUnlocked,
        syncStatus,
        lastSyncedAt,
        syncMessage,
        forceSyncProgress,
        currentUser,
        logout,
        switchAccount,
        loginWithCredentials,
        registerUserSession,
        redeemJoinCode,
        adminNotifications,
        unreadAdminNotificationsCount,
        markAdminNotificationAsRead,
        markAllAdminNotificationsAsRead,
        triggerManualNotificationDispatch,
        latestNotificationToast,
        dismissNotificationToast,
        clientReceipts,
        sendClientReceiptConfirmationEmail,
        getClientReceiptForOrder,
        integrityViolations,
        recordIntegrityViolation,
        activationTokens,
        redeemActivationToken,
        assignActivationToken,
        unassignActivationToken,
        getTokensForOrder,
        issueActivationTokenForOrder,
        generateCustomActivationToken,
        isRedeemModalOpen,
        setIsRedeemModalOpen,
        pendingActivationToken,
        setPendingActivationToken,
        isRegistrationWizardOpen,
        setIsRegistrationWizardOpen,
        isMarketingStudioOpen,
        setIsMarketingStudioOpen,
        isE2ETestModalOpen,
        setIsE2ETestModalOpen,
        isCertificateVerifierOpen,
        setIsCertificateVerifierOpen,
        // Cart
        cart,
        isCartOpen,
        setIsCartOpen,
        cartEnrollmentType,
        setCartEnrollmentType,
        addToCart,
        removeFromCart,
        updateCartItemSeats,
        clearCart,
        cartItemsCount,
        cartTotalSeats,
        cartTotalSCR,
        cartTotalUSD,
        cartSavingsSCR,
        checkoutCart,
        lastCartFeedback,
        dismissCartFeedback,
        selectedOrderForPayment,
        setSelectedOrderForPayment,
        submitWireRemittance,
        processOnlineOrderPayment,
        deleteOrder,
        clearDemoOrders,
        adminPasswords,
        getAdminPassword,
        changeAdminPassword,
        isChangePasswordOpen,
        setIsChangePasswordOpen,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};
