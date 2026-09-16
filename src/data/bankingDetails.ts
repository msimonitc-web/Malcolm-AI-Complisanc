import { EnrollmentOrder } from '../types';

export interface SeychellesBankDetail {
  currency: 'USD' | 'EUR' | 'GBP' | 'SCR';
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  swiftBic: string;
  branch: string;
  routingOrClearing?: string;
}

export const SEYCHELLES_BANK_ACCOUNTS: Record<string, SeychellesBankDetail> = {
  SCR: {
    currency: 'SCR',
    bankName: 'Nouvobanq (Seychelles International Mercantile Banking Corp.)',
    accountName: 'Complisanc Consulting Services (SEY) - Complisey',
    accountNumber: '109-204-884-001',
    swiftBic: 'SIMBSCSC',
    branch: 'Victoria Main Branch, Francis Rachel St, Mahé, Seychelles',
    routingOrClearing: 'Local Clearing: Central Bank of Seychelles (CBS)',
  },
  USD: {
    currency: 'USD',
    bankName: 'Nouvobanq (Seychelles International Mercantile Banking Corp.)',
    accountName: 'Complisanc Consulting Services (SEY) - Complisey',
    accountNumber: '109-204-884-010',
    swiftBic: 'SIMBSCSC',
    branch: 'Victoria Main Branch, Francis Rachel St, Mahé, Seychelles',
    routingOrClearing: 'Correspondent: Standard Chartered Bank NY',
  },
  EUR: {
    currency: 'EUR',
    bankName: 'MCB Seychelles (Mauritius Commercial Bank Seychelles Ltd)',
    accountName: 'Complisanc Consulting Services (SEY) - Complisey',
    accountNumber: '000-112-984-020',
    swiftBic: 'MCBLSCSC',
    branch: 'Caravelle House, Manglier Street, Victoria, Mahé, Seychelles',
    routingOrClearing: 'Correspondent: BNP Paribas Paris',
  },
  GBP: {
    currency: 'GBP',
    bankName: 'MCB Seychelles (Mauritius Commercial Bank Seychelles Ltd)',
    accountName: 'Complisanc Consulting Services (SEY) - Complisey',
    accountNumber: '000-112-984-030',
    swiftBic: 'MCBLSCSC',
    branch: 'Caravelle House, Manglier Street, Victoria, Mahé, Seychelles',
  },
};

export const INITIAL_ORDERS: EnrollmentOrder[] = [
  {
    id: 'ord-prf-9841',
    proformaNumber: 'PRF-CS-2026-00412',
    ccsBookingId: 'CCS-BK-2026-00412',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Access)',
    seatCount: 5,
    unitPrice: 900,
    totalAmount: 4500,
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
    notes: 'Corporate 1–5 seats band (SCR 900/seat). Awaiting bank transfer in Seychelles rupees quoting CCS booking ID.',
  },
  {
    id: 'ord-prf-9842',
    proformaNumber: 'PRF-CS-2026-00413',
    ccsBookingId: 'CCS-BK-2026-00413',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Access)',
    seatCount: 2,
    unitPrice: 900,
    totalAmount: 1800,
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
    notes: 'Corporate 1–5 seats band (SCR 900/seat). Transfer initiated via Nouvobanq local clearing.',
  },
  {
    id: 'ord-prf-9840',
    proformaNumber: 'PRF-CS-2026-00389',
    ccsBookingId: 'CCS-BK-2026-00389',
    courseId: 'all-catalogue-seats',
    courseTitle: '12-Month Prepaid Staff Training Seat (Full 6-Course Catalogue Access)',
    seatCount: 1,
    unitPrice: 1000,
    totalAmount: 1000,
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
    notes: 'Payment confirmed via Nouvobanq ref #TXN-77391. All 6 catalogue courses unlocked for 12 months.',
  },
];
