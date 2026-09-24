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
  packageType: CoursePackageType = 'pack',
  percentageAdjustment: number = 0
): number {
  const seats = Math.max(1, Math.floor(seatCount));
  const pkg: 'level1' | 'level2' | 'pack' = packageType === 'both' ? 'pack' : packageType;

  let baseRate = 2500;
  // Individual purchase
  if (!isCorporate && seats === 1) {
    if (pkg === 'level1') baseRate = INDIVIDUAL_PRICING.level1;
    else if (pkg === 'level2') baseRate = INDIVIDUAL_PRICING.level2;
    else baseRate = INDIVIDUAL_PRICING.pack;
  } else {
    // Corporate volume tiers
    if (seats <= 5) {
      if (pkg === 'level1') baseRate = 1100;
      else if (pkg === 'level2') baseRate = 1300;
      else baseRate = 2250;
    } else if (seats <= 10) {
      if (pkg === 'level1') baseRate = 1000;
      else if (pkg === 'level2') baseRate = 1200;
      else baseRate = 2050;
    } else if (seats <= 20) {
      if (pkg === 'level1') baseRate = 900;
      else if (pkg === 'level2') baseRate = 1100;
      else baseRate = 1850;
    } else {
      // 21+ seats
      if (pkg === 'level1') baseRate = 800;
      else if (pkg === 'level2') baseRate = 1000;
      else baseRate = 1650;
    }
  }

  const adjusted = baseRate * (1 + percentageAdjustment / 100);
  return Math.round(adjusted);
}

/**
 * Calculates total SCR for an order based on customer category, seat count, and curriculum package
 */
export function calculateOrderTotalSCR(
  seatCount: number,
  isCorporate: boolean = true,
  packageType: CoursePackageType = 'pack',
  percentageAdjustment: number = 0
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
  const ratePerSeat = getSeatRateSCR(seats, isCorporate, pkg, percentageAdjustment);
  const totalSCR = seats * ratePerSeat;

  const packageLabel =
    pkg === 'level1'
      ? 'Level 1: Statutory Foundations'
      : pkg === 'level2'
      ? 'Level 2: Advanced Operations'
      : 'Complete Curriculum Pack (Levels 1 & 2)';

  let rawL1 = 800;
  let rawL2 = 1000;
  let rawPack = 1650;
  let tierId = 'corp-21-plus';
  let bandLabel = '';

  if (!isCorporate && seats === 1) {
    tierId = 'individual';
    rawL1 = INDIVIDUAL_PRICING.level1;
    rawL2 = INDIVIDUAL_PRICING.level2;
    rawPack = INDIVIDUAL_PRICING.pack;
    bandLabel = `Individual (${packageLabel} - SCR ${ratePerSeat.toLocaleString()})`;
  } else if (seats <= 5) {
    tierId = 'corp-1-5';
    rawL1 = 1100;
    rawL2 = 1300;
    rawPack = 2250;
    bandLabel = `Corporate Tier 1–5 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  } else if (seats <= 10) {
    tierId = 'corp-6-10';
    rawL1 = 1000;
    rawL2 = 1200;
    rawPack = 2050;
    bandLabel = `Corporate Tier 6–10 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  } else if (seats <= 20) {
    tierId = 'corp-11-20';
    rawL1 = 900;
    rawL2 = 1100;
    rawPack = 1850;
    bandLabel = `Corporate Tier 11–20 (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  } else {
    bandLabel = `Corporate Tier 21+ (${packageLabel} - SCR ${ratePerSeat.toLocaleString()}/seat)`;
  }

  const factor = 1 + percentageAdjustment / 100;
  const level1Rate = Math.round(rawL1 * factor);
  const level2Rate = Math.round(rawL2 * factor);
  const packRate = Math.round(rawPack * factor);

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
 * 1 USD ~ 15.0 SCR (Pegged), 1 EUR ~ 15.8 SCR, 1 GBP ~ 18.5 SCR
 */
export const SCR_EXCHANGE_RATES: Record<CurrencyType, { rateFromSCR: number; symbol: string }> = {
  SCR: { rateFromSCR: 1.0, symbol: 'SCR ' },
  USD: { rateFromSCR: 1 / 15.0, symbol: '$' },
  EUR: { rateFromSCR: 1 / 15.8, symbol: '€' },
  GBP: { rateFromSCR: 1 / 18.5, symbol: '£' },
};
