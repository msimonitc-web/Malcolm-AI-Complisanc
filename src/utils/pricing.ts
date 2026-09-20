import { CurrencyType } from '../types';

export type CoursePackageType = 'level1' | 'level2' | 'pack' | 'both';

export interface SeatPricingTier {
  id: string;
  label: string;
  minSeats: number;
  maxSeats: number | null;
  level1RateSCR: number;
  level2RateSCR: number;
  packRateSCR: number;
  ratePerSeatSCR: number; // For compatibility (defaults to pack rate)
  description: string;
}

/**
 * Individual Student Pricing Schedule
 * Level 1: SCR 1,250
 * Level 2: SCR 1,500
 * Complete Pack (Levels 1 & 2): SCR 2,500
 */
export const INDIVIDUAL_PRICING = {
  level1: 1250,
  level2: 1500,
  pack: 2500,
};

/**
 * Corporate Volume Pricing Schedule (Exclusive Bands)
 * - Tier 1–5 seats: Level 1: SCR 1,100 | Level 2: SCR 1,300 | Pack: SCR 2,250
 * - Tier 6–10 seats: Level 1: SCR 1,000 | Level 2: SCR 1,200 | Pack: SCR 2,050
 * - Tier 11–20 seats: Level 1: SCR 900 | Level 2: SCR 1,100 | Pack: SCR 1,850
 * - Tier 21+ seats: Level 1: SCR 800 | Level 2: SCR 1,000 | Pack: SCR 1,650
 */
export const CORPORATE_TIERS: SeatPricingTier[] = [
  {
    id: 'corp-1-5',
    label: 'Tier 1–5 seats',
    minSeats: 1,
    maxSeats: 5,
    level1RateSCR: 1100,
    level2RateSCR: 1300,
    packRateSCR: 2250,
    ratePerSeatSCR: 2250,
    description: 'Tier 1–5: Level 1: SCR 1,100 | Level 2: SCR 1,300 | Pack: SCR 2,250 per seat',
  },
  {
    id: 'corp-6-10',
    label: 'Tier 6–10 seats',
    minSeats: 6,
    maxSeats: 10,
    level1RateSCR: 1000,
    level2RateSCR: 1200,
    packRateSCR: 2050,
    ratePerSeatSCR: 2050,
    description: 'Tier 6–10: Level 1: SCR 1,000 | Level 2: SCR 1,200 | Pack: SCR 2,050 per seat',
  },
  {
    id: 'corp-11-20',
    label: 'Tier 11–20 seats',
    minSeats: 11,
    maxSeats: 20,
    level1RateSCR: 900,
    level2RateSCR: 1100,
    packRateSCR: 1850,
    ratePerSeatSCR: 1850,
    description: 'Tier 11–20: Level 1: SCR 900 | Level 2: SCR 1,100 | Pack: SCR 1,850 per seat',
  },
  {
    id: 'corp-21-plus',
    label: 'Tier 21+ seats',
    minSeats: 21,
    maxSeats: null,
    level1RateSCR: 800,
    level2RateSCR: 1000,
    packRateSCR: 1650,
    ratePerSeatSCR: 1650,
    description: 'Tier 21+: Level 1: SCR 800 | Level 2: SCR 1,000 | Pack: SCR 1,650 per seat',
  },
];

export const SEAT_PRICING_SCHEDULE: SeatPricingTier[] = [
  {
    id: 'individual',
    label: 'Individual Learner',
    minSeats: 1,
    maxSeats: 1,
    level1RateSCR: INDIVIDUAL_PRICING.level1,
    level2RateSCR: INDIVIDUAL_PRICING.level2,
    packRateSCR: INDIVIDUAL_PRICING.pack,
    ratePerSeatSCR: INDIVIDUAL_PRICING.pack,
    description: 'Individual: Level 1: SCR 1,250 | Level 2: SCR 1,500 | Pack: SCR 2,500',
  },
  ...CORPORATE_TIERS,
];

/**
 * Resolves courseId to its corresponding PackageType
 */
export function resolvePackageType(courseId?: string): CoursePackageType {
  if (!courseId) return 'pack';
  if (courseId === 'level1' || courseId === 'level1-bundle' || ['c-1', 'c-2', 'c-3'].includes(courseId)) {
    return 'level1';
  }
  if (courseId === 'level2' || courseId === 'level2-bundle' || ['c-4', 'c-5', 'c-6'].includes(courseId)) {
    return 'level2';
  }
  return 'pack';
}

/**
 * Calculates the exact unit price per seat in Seychelles Rupees (SCR)
 * Seat bands are exclusive.
 */
export function getSeatRateSCR(
  seatCount: number,
  isCorporate: boolean = true,
  packageType: CoursePackageType = 'pack'
): number {
  const seats = Math.max(1, Math.floor(seatCount));
  const pkg: 'level1' | 'level2' | 'pack' = packageType === 'both' ? 'pack' : packageType;

  // Individual purchase
  if (!isCorporate && seats === 1) {
    if (pkg === 'level1') return INDIVIDUAL_PRICING.level1;
    if (pkg === 'level2') return INDIVIDUAL_PRICING.level2;
    return INDIVIDUAL_PRICING.pack;
  }

  // Corporate volume tiers
  if (seats <= 5) {
    if (pkg === 'level1') return 1100;
    if (pkg === 'level2') return 1300;
    return 2250;
  }
  if (seats <= 10) {
    if (pkg === 'level1') return 1000;
    if (pkg === 'level2') return 1200;
    return 2050;
  }
  if (seats <= 20) {
    if (pkg === 'level1') return 900;
    if (pkg === 'level2') return 1100;
    return 1850;
  }

  // 21+ seats
  if (pkg === 'level1') return 800;
  if (pkg === 'level2') return 1000;
  return 1650;
}

/**
 * Calculates total SCR for an order based on customer category, seat count, and curriculum package
 */
export function calculateOrderTotalSCR(
  seatCount: number,
  isCorporate: boolean = true,
  packageType: CoursePackageType = 'pack'
): {
  seatCount: number;
  ratePerSeat: number;
  totalSCR: number;
  bandLabel: string;
  tierId: string;
  packageType: CoursePackageType;
  packageLabel: string;
  level1Rate: number;
  level2Rate: number;
  packRate: number;
} {
  const seats = Math.max(1, Math.floor(seatCount));
  const pkg: CoursePackageType = packageType === 'both' ? 'pack' : packageType;
  const ratePerSeat = getSeatRateSCR(seats, isCorporate, pkg);
  const totalSCR = seats * ratePerSeat;

  const packageLabel =
    pkg === 'level1'
      ? 'Level 1: Statutory Foundations'
      : pkg === 'level2'
      ? 'Level 2: Advanced Operations'
      : 'Complete Curriculum Pack (Levels 1 & 2)';

  let bandLabel = `Corporate Tier 21+ (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  let tierId = 'corp-21-plus';
  let level1Rate = 800;
  let level2Rate = 1000;
  let packRate = 1650;

  if (!isCorporate && seats === 1) {
    tierId = 'individual';
    level1Rate = INDIVIDUAL_PRICING.level1;
    level2Rate = INDIVIDUAL_PRICING.level2;
    packRate = INDIVIDUAL_PRICING.pack;
    bandLabel = `Individual (${packageLabel} - SCR ${ratePerSeat.toLocaleString()})`;
  } else if (seats <= 5) {
    tierId = 'corp-1-5';
    level1Rate = 1100;
    level2Rate = 1300;
    packRate = 2250;
    bandLabel = `Corporate Tier 1–5 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  } else if (seats <= 10) {
    tierId = 'corp-6-10';
    level1Rate = 1000;
    level2Rate = 1200;
    packRate = 2050;
    bandLabel = `Corporate Tier 6–10 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  } else if (seats <= 20) {
    tierId = 'corp-11-20';
    level1Rate = 900;
    level2Rate = 1100;
    packRate = 1850;
    bandLabel = `Corporate Tier 11–20 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  }

  return {
    seatCount: seats,
    ratePerSeat,
    totalSCR,
    bandLabel,
    tierId,
    packageType: pkg,
    packageLabel,
    level1Rate,
    level2Rate,
    packRate,
  };
}

/**
 * Format Seychelles Rupees with commas (e.g. SCR 1,250)
 */
export function formatSCR(amount: number): string {
  return `SCR ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Exchange rate conversions if user views in foreign currency (SCR is base currency)
 * 1 USD ~ 14.5 SCR, 1 EUR ~ 15.8 SCR, 1 GBP ~ 18.5 SCR
 */
export const SCR_EXCHANGE_RATES: Record<CurrencyType, { rateFromSCR: number; symbol: string }> = {
  SCR: { rateFromSCR: 1.0, symbol: 'SCR ' },
  USD: { rateFromSCR: 1 / 14.5, symbol: '$' },
  EUR: { rateFromSCR: 1 / 15.8, symbol: '€' },
  GBP: { rateFromSCR: 1 / 18.5, symbol: '£' },
};
