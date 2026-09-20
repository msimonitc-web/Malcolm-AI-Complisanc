import { EnrollmentOrder } from '../types';

export interface SeychellesBankDetail {
  currency: 'USD' | 'EUR' | 'GBP' | 'SCR';
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  swiftBic: string;
  swift?: string;
  swiftCode?: string;
  branch: string;
  bankAddress?: string;
  routingOrClearing?: string;
}

export const SEYCHELLES_BANK_ACCOUNTS: Record<string, SeychellesBankDetail> = {
  SCR: {
    currency: 'SCR',
    bankName: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
    bankAddress: 'Eden Plaza, Eden Island, Mahé, Seychelles',
    branch: 'Eden Branch',
    accountName: 'Complisanc Consulting Services (SEY)',
    accountNumber: '00001073508',
    iban: 'SC32MCBL06070000000001073508SCR',
    swiftBic: 'MCBLSCSC',
    swift: 'MCBLSCSC',
    swiftCode: 'MCBLSCSC',
    routingOrClearing: 'MCB Seychelles Clearing (SCR)',
  },
  USD: {
    currency: 'USD',
    bankName: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
    bankAddress: 'Eden Plaza, Eden Island, Mahé, Seychelles',
    branch: 'Eden Branch',
    accountName: 'Complisanc Consulting Services (SEY)',
    accountNumber: '00001073508',
    iban: 'SC32MCBL06070000000001073508SCR',
    swiftBic: 'MCBLSCSC',
    swift: 'MCBLSCSC',
    swiftCode: 'MCBLSCSC',
    routingOrClearing: 'MCB Seychelles USD Correspondent Clearing',
  },
  EUR: {
    currency: 'EUR',
    bankName: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
    bankAddress: 'Eden Plaza, Eden Island, Mahé, Seychelles',
    branch: 'Eden Branch',
    accountName: 'Complisanc Consulting Services (SEY)',
    accountNumber: '00001073508',
    iban: 'SC32MCBL06070000000001073508SCR',
    swiftBic: 'MCBLSCSC',
    swift: 'MCBLSCSC',
    swiftCode: 'MCBLSCSC',
    routingOrClearing: 'MCB Seychelles EUR Correspondent Clearing',
  },
  GBP: {
    currency: 'GBP',
    bankName: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
    bankAddress: 'Eden Plaza, Eden Island, Mahé, Seychelles',
    branch: 'Eden Branch',
    accountName: 'Complisanc Consulting Services (SEY)',
    accountNumber: '00001073508',
    iban: 'SC32MCBL06070000000001073508SCR',
    swiftBic: 'MCBLSCSC',
    swift: 'MCBLSCSC',
    swiftCode: 'MCBLSCSC',
  },
};

export const BANKING_DETAILS = SEYCHELLES_BANK_ACCOUNTS.SCR;

export const DEMO_ORDERS: EnrollmentOrder[] = [
  {
    id: 'ord-prf-malcolm-simon',
    proformaNumber: 'PRF-CS-2026-00418',
    ccsBookingId: 'CCS-BK-2026-00418',
    courseId: 'all-catalogue-seats',
    courseTitle: 'CompliSey Academy: Complete 6-Course Curriculum Pack (Levels 1 & 2)',
    seatCount: 1,
    unitPrice: 2500,
    totalAmount: 2500,
    currency: 'SCR',
    paymentMethod: 'bank_transfer',
    status: 'pending_payment',
    createdAt: '2026-09-17T18:45:00Z',
    companyName: 'Individual Learner',
    companyAddress: 'Victoria, Mahé, Republic of Seychelles',
    contactName: 'Malcolm Simon',
    contactEmail: 'malcolm@complisanc.com',
    contactPhone: '+248 2 511 200',
    bankReferenceCode: 'CCS-BK-2026-00418',
    notes: 'Individual Learner Registration. Sector: Financial Services & Compliance Advisory. Awaiting bank remittance via MCB Seychelles or direct online card payment.',
    isCorporate: false,
  },
  {
    id: 'ord-prf-9841',
    proformaNumber: 'PRF-CS-2026-00412',
    ccsBookingId: 'CCS-BK-2026-00412',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Pack)',
    seatCount: 5,
    unitPrice: 2250,
    totalAmount: 11250,
    currency: 'SCR',
    paymentMethod: 'bank_transfer',
    status: 'pending_payment',
    createdAt: '2026-09-14T14:30:00Z',
    companyName: 'Victoria Fiduciary Services Ltd',
    companyAddress: 'Suite 204, Premier Building, Albert Street, Victoria, Mahé, Seychelles',
    contactName: 'Jean-Luc Payet',
    contactEmail: 'jl.payet@victoriafiduciary.sc',
    contactPhone: '+248 4 380 000',
    bankReferenceCode: 'CCS-BK-2026-00412',
    notes: 'Corporate Tier 1–5 seats pack (SCR 2,250/seat). Awaiting bank transfer in Seychelles rupees quoting CCS booking ID.',
  },
  {
    id: 'ord-prf-9842',
    proformaNumber: 'PRF-CS-2026-00413',
    ccsBookingId: 'CCS-BK-2026-00413',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Pack)',
    seatCount: 2,
    unitPrice: 2250,
    totalAmount: 4500,
    currency: 'SCR',
    paymentMethod: 'bank_transfer',
    status: 'pending_payment',
    createdAt: '2026-09-15T09:15:00Z',
    companyName: 'Eden Island Capital Management (Pty) Ltd',
    companyAddress: 'Eden Plaza, 1st Floor, Eden Island, Seychelles',
    contactName: 'Sarah Ah-Time',
    contactEmail: 'compliance@edencapital.sc',
    contactPhone: '+248 4 346 500',
    bankReferenceCode: 'CCS-BK-2026-00413',
    notes: 'Corporate Tier 1–5 seats pack (SCR 2,250/seat). Transfer initiated via MCB Seychelles local clearing.',
  },
  {
    id: 'ord-prf-9840',
    proformaNumber: 'PRF-CS-2026-00389',
    ccsBookingId: 'CCS-BK-2026-00389',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Pack)',
    seatCount: 1,
    unitPrice: 2500,
    totalAmount: 2500,
    currency: 'SCR',
    paymentMethod: 'bank_transfer',
    status: 'activated',
    createdAt: '2026-09-01T10:15:00Z',
    activatedAt: '2026-09-01T14:00:00Z',
    activatedBy: 'Admin (Complisey Accounts Desk)',
    companyName: 'Victoria Fiduciary Services Ltd',
    contactName: 'Marcus Delpech',
    contactEmail: 'm.delpech@fiduciary-sey.sc',
    bankReferenceCode: 'CCS-BK-2026-00389',
    taxInvoiceNumber: 'INV-CS-2026-00389',
    notes: 'Payment confirmed via MCB Seychelles ref #TXN-77391. Complete 6-course curriculum pack unlocked for 12 months.',
  },
];

// In production, start with a pristine slate of genuine orders
export const INITIAL_ORDERS: EnrollmentOrder[] = [];
