export type PaymentGatewayType = 'bank_transfer' | 'direct_bank_online' | 'stripe' | 'paypal';

export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'SCR';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'zip' | 'code' | 'doc';
  url: string;
}

export interface LessonComment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  upvotes: number;
  isInstructor?: boolean;
  replies?: {
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    content: string;
    isInstructor?: boolean;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'article' | 'quiz';
  videoUrl?: string; // YouTube or direct MP4 preview video
  previewAllowed?: boolean;
  summary: string;
  notes: string;
  resources: ResourceItem[];
  quiz?: QuizQuestion[];
  comments?: LessonComment[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  company: string;
  rating: number;
  studentsCount: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor: Instructor;
  rating: number;
  reviewsCount: number;
  totalHours: number;
  lessonsCount: number;
  thumbnail: string;
  price: number;
  originalPrice: number;
  currency: CurrencyType;
  tags: string[];
  featured?: boolean;
  modules: CourseModule[];
}

export interface EnrolledCourseProgress {
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessonIds: string[];
  activeLessonId: string;
  personalNotes: Record<string, string>; // lessonId -> markdown note
  quizScores: Record<string, number>; // lessonId -> percentage score
  isCompleted: boolean;
  certificateClaimedAt?: string;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  instructorName: string;
  gradeScore: string;
  verificationCode: string;
}

export interface Transaction {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: CurrencyType;
  gateway: PaymentGatewayType;
  status: 'succeeded' | 'processing' | 'refunded';
  createdAt: string;
  invoiceNumber: string;
  paymentMethodDetails: {
    brand?: string;
    last4?: string;
    payerEmail?: string;
  };
  couponApplied?: string;
  discountAmount?: number;
}

export interface StudentProfile {
  name: string;
  email: string;
  avatar: string;
  title: string;
  weeklyGoalHours: number;
  loggedHoursThisWeek: number;
  streakDays: number;
  role?: UserRole;
  companyName?: string;
  joinCodeRedeemed?: string;
}

export type UserRole = 'learner' | 'corporate' | 'admin';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  title: string;
  companyName: string;
  avatar: string;
  joinCode?: string;
}

export interface CorporateTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  completedCourses: number;
  totalCourses: number;
  overallScore: number;
  lastActive: string;
  certificatesCount: number;
}

export interface EnrollmentOrder {
  id: string;
  proformaNumber: string;
  ccsBookingId: string;
  courseId: string;
  courseTitle: string;
  seatCount: number;
  unitPrice: number;
  totalAmount: number;
  currency: CurrencyType;
  paymentMethod: 'bank_transfer' | 'direct_bank_online';
  status: 'pending_payment' | 'activated' | 'cancelled';
  createdAt: string;
  activatedAt?: string;
  activatedBy?: string;
  companyName: string;
  companyAddress?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  bankReferenceCode: string;
  notes?: string;
  taxInvoiceNumber?: string;
}

export type ActiveTab = 'dashboard' | 'explore' | 'player' | 'certificates' | 'billing' | 'admin' | 'corporate';

export type LegalDocType = 'privacy' | 'terms' | null;
