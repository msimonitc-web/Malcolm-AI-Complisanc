import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../types';
import { COURSES_DATA, INITIAL_STUDENT, INITIAL_TRANSACTIONS } from '../data/courses';
import { INITIAL_ORDERS } from '../data/bankingDetails';
import {
  calculateOrderTotalSCR,
  formatSCR,
  SCR_EXCHANGE_RATES,
} from '../utils/pricing';

interface AcademyContextType {
  student: StudentProfile;
  courses: Course[];
  enrolledProgress: Record<string, EnrolledCourseProgress>;
  transactions: Transaction[];
  certificates: Certificate[];
  orders: EnrollmentOrder[];
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
  }) => EnrollmentOrder;
  adminActivateOrder: (orderId: string, adminNote?: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  activeLegalModal: LegalDocType;
  setActiveLegalModal: (modal: LegalDocType) => void;
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
  claimCertificate: (courseId: string) => Certificate | null;
  processPaymentEnrollment: (
    courseId: string,
    gateway: PaymentGatewayType,
    details: { brand?: string; last4?: string; payerEmail?: string },
    couponApplied?: string,
    discountAmount?: number
  ) => Transaction;
  getCourseProgressPercentage: (courseId: string) => number;
  isCourseCompleted: (courseId: string) => boolean;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

const CURRENCY_RATES: Record<CurrencyType, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  SCR: { rate: 14.5, symbol: 'SCR ' },
};

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses] = useState<Course[]>(COURSES_DATA);
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('academy_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string | null>('course-aml-fundamentals');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('les-1-1');

  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<Certificate | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType>(null);

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

  const [selectedProformaForView, setSelectedProformaForView] = useState<EnrollmentOrder | null>(null);

  const [currency, setCurrency] = useState<CurrencyType>('SCR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Enrolled courses state (pre-enrolled in AML Fundamentals for immediate interactive demonstration)
  const [enrolledProgress, setEnrolledProgress] = useState<Record<string, EnrolledCourseProgress>>(() => {
    const saved = localStorage.getItem('academy_enrolled_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['course-aml-fundamentals']) return parsed;
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    return {
      'course-aml-fundamentals': {
        courseId: 'course-aml-fundamentals',
        enrolledAt: '2026-09-01T10:15:00Z',
        lastAccessedAt: new Date().toISOString(),
        completedLessonIds: ['les-1-1'],
        activeLessonId: 'les-1-2',
        personalNotes: {
          'les-1-1': 'Retain all staff AML/CFT training records on file for 7 years under Section 34 of the Act for FSA/FIU inspection.',
        },
        quizScores: {
          'les-1-1': 100,
        },
        isCompleted: false,
      },
    };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('academy_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('academy_certificates');
    return saved ? JSON.parse(saved) : [];
  });

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
  }): EnrollmentOrder => {
    const course = courses.find((c) => c.id === courseId);
    const resolvedIsCorporate = isCorporate !== undefined ? isCorporate : (seatCount > 1 || Boolean(companyName && companyName !== 'Individual Learner'));
    const calculation = calculateOrderTotalSCR(seatCount, resolvedIsCorporate);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const proformaNum = `PRF-CS-2026-${randomSuffix}`;
    const ccsBookingId = `CCS-BK-2026-${randomSuffix}`;

    const newOrder: EnrollmentOrder = {
      id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      proformaNumber: proformaNum,
      ccsBookingId,
      courseId,
      courseTitle: course ? course.title : '12-Month Prepaid Seat (Full 6-Course Catalogue Access)',
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
    return newOrder;
  };

  const adminActivateOrder = (orderId: string, adminNote?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const invoiceNum = `INV-CS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Update order status to activated
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'activated',
              activatedAt: new Date().toISOString(),
              activatedBy: 'Administrator (Complisey Accounts Desk)',
              taxInvoiceNumber: invoiceNum,
              notes: adminNote ? `${o.notes || ''} [Admin note: ${adminNote}]` : o.notes,
            }
          : o
      )
    );

    // 2. Unlock ALL courses in the catalogue for the student (Prepaid 12-month seat access)
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

    // 3. Create completed Transaction record for billing receipts
    const newTx: Transaction = {
      id: `tx_wire_${Date.now().toString(36)}`,
      courseId: targetOrder.courseId,
      courseTitle: `12-Month Seat (${targetOrder.seatCount} Seat${targetOrder.seatCount > 1 ? 's' : ''}) - Full Catalogue Access`,
      amount: targetOrder.totalAmount,
      currency: targetOrder.currency,
      gateway: 'bank_transfer',
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      paymentMethodDetails: {
        brand: `Seychelles Bank Transfer (Nouvobanq) [Ref: ${targetOrder.ccsBookingId || targetOrder.bankReferenceCode}]`,
        payerEmail: targetOrder.contactEmail,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);
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

  const openCoursePlayer = (courseId: string, lessonId?: string) => {
    setActiveCourseId(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

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
    setEnrolledProgress((prev) => {
      const existing = prev[courseId];
      if (!existing) return prev;
      return {
        ...prev,
        [courseId]: {
          ...existing,
          quizScores: {
            ...existing.quizScores,
            [lessonId]: score,
          },
        },
      };
    });
    if (score >= 70) {
      markLessonComplete(courseId, lessonId);
    }
  };

  const claimCertificate = (courseId: string): Certificate | null => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return null;

    const existingCert = certificates.find((c) => c.courseId === courseId);
    if (existingCert) return existingCert;

    const newCert: Certificate = {
      id: `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      courseId: course.id,
      courseTitle: course.title,
      studentName: student.name,
      issueDate: new Date().toLocaleDateString('en-US', {
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
      paymentMethodDetails: details,
      couponApplied,
      discountAmount,
    };

    setTransactions((prev) => [newTx, ...prev]);

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
        claimCertificate,
        processPaymentEnrollment,
        getCourseProgressPercentage,
        isCourseCompleted,
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
