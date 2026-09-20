export type PaymentGatewayType = 'bank_transfer' | 'direct_bank_online' | 'stripe' | 'paypal';

export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'SCR';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ShortAnswerQuestion {
  id: string;
  question: string;
  sampleAnswer: string;
  gradingRubric: string;
}

export interface FinalExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sourceUnit?: string;
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
  transcript?: string;
  audioUrl?: string;
  resources: ResourceItem[];
  quiz?: QuizQuestion[];
  comments?: LessonComment[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  unitQuiz?: QuizQuestion[];
  shortAnswerQuestions?: ShortAnswerQuestion[];
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
  finalExam?: FinalExamQuestion[];
  caseStudy?: {
    id: string;
    title: string;
    scenario: string;
    tasks: string[];
  };
}

export interface EnrolledCourseProgress {
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessonIds: string[];
  activeLessonId: string;
  personalNotes: Record<string, string>; // lessonId -> markdown note
  quizScores: Record<string, number>; // lessonId or unitId -> percentage score
  unitQuizScores?: Record<string, number>; // unitId -> score %
  examScore?: number; // Final exam percentage score
  isCompleted: boolean;
  certificateClaimedAt?: string;
  certificateId?: string;
}

export interface CourseTranscriptTopic {
  moduleTitle: string;
  durationMinutes: number;
  topics: string[];
  learningOutcomes: string[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentTitle?: string;
  companyName?: string;
  issueDate: string;
  expiryDate?: string;
  instructorName: string;
  gradeScore: string;
  verificationCode: string;
  cpdHours?: number;
  transcriptTopics?: CourseTranscriptTopic[];
  statutoryCompetencies?: string[];
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
  companyName?: string;
  orderId?: string;
  proformaNumber?: string;
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
  sessionId?: string;
  registeredAt?: string;
  passwordHash?: string;
}

export interface StaffAssessmentWeakness {
  id: string;
  topicTitle: string;
  category: string;
  score: number; // percentage
  status: 'critical' | 'moderate' | 'satisfactory';
  conceptTested: string;
  errorIdentified: string;
  statutoryReference: string;
  recommendedAction: string;
}

export interface StaffAssessmentProfile {
  memberId: string;
  memberName: string;
  memberEmail: string;
  role: string;
  overallScore: number;
  completedCertificates: {
    certificateId: string;
    courseId: string;
    courseTitle: string;
    issueDate: string;
    gradeScore: string;
    verificationCode: string;
    cpdHours: number;
  }[];
  domainScores: Record<string, number>;
  weaknesses: StaffAssessmentWeakness[];
  hrRemediationStatus: 'completed' | 'in_progress' | 'action_required';
  hrNotes?: string;
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
  assessmentProfile?: StaffAssessmentProfile;
}

export type CourseCartPackageType = 'level1' | 'level2' | 'pack' | 'both';

export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  packageType: CourseCartPackageType;
  seatCount: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  cpdHours?: number;
  modulesCount?: number;
  description?: string;
}

export interface OrderLineItem {
  courseId: string;
  courseTitle: string;
  packageType: CourseCartPackageType;
  seatCount: number;
  unitPrice: number;
  totalAmount: number;
  cpdHours?: number;
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
  activationToken?: string;
  activationTokens?: string[];
  companyName: string;
  companyAddress?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  bankReferenceCode: string;
  notes?: string;
  taxInvoiceNumber?: string;
  items?: OrderLineItem[];
  isCorporate?: boolean;
  receiptConfirmationSent?: boolean;
  receiptConfirmationSentAt?: string;
  remittanceSubmitted?: boolean;
  remittanceSubmittedAt?: string;
  remittanceBankName?: string;
  remittanceReference?: string;
  remittanceNotes?: string;
}

export interface CourseActivationToken {
  token: string;
  courseIds: string[];
  courseTitle: string;
  issuedBy: 'Malcolm Simon' | "Eric D'Souza" | 'Eric' | string;
  issuedToName: string;
  issuedToEmail: string;
  orderId?: string;
  proformaNumber?: string;
  taxInvoiceNumber?: string;
  companyName?: string;
  seatNumber?: number; // e.g. Seat 1 of 22
  totalSeatsInOrder?: number; // e.g. 22
  issuedAt: string;
  status: 'active' | 'assigned' | 'redeemed' | 'revoked';
  redeemedAt?: string;
  redeemedByEmail?: string;
  redeemedByName?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedAt?: string;
  isNonTransferable?: boolean;
  notes?: string;
}

export interface AdminEmailNotification {
  id: string;
  orderId: string;
  proformaNumber: string;
  ccsBookingId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  companyName: string;
  companyAddress?: string;
  coursePackageTitle: string;
  courseId: string;
  seatCount: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  recipientEmails: string[];
  subject: string;
  htmlContent: string;
  textContent: string;
  status: 'sent' | 'delivered';
  notes?: string;
  sentAt: string;
  isRead?: boolean;
}

export type ActiveTab = 'dashboard' | 'explore' | 'player' | 'certificates' | 'billing' | 'admin' | 'corporate' | 'wizard' | 'marketing';

export type LegalDocType = 'privacy' | 'terms' | null;
