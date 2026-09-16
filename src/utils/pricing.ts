import { CurrencyType } from '../types';

export interface SeatPricingTier {
  id: string;
  label: string;
  minSeats: number;
  maxSeats: number | null;
  ratePerSeatSCR: number;
  description: string;
}

export const SEAT_PRICING_SCHEDULE: SeatPricingTier[] = [
  {
    id: 'individual',
    label: 'Individual',
    minSeats: 1,
    maxSeats: 1,
    ratePerSeatSCR: 1000,
    description: 'SCR 1,000 per seat (Individual purchase)',
  },
  {
    id: 'corp-1-5',
    label: 'Corporate 1–5 seats',
    minSeats: 1,
    maxSeats: 5,
    ratePerSeatSCR: 900,
    description: 'SCR 900 per seat (1–5 seats exclusive band)',
  },
  {
    id: 'corp-6-10',
    label: 'Corporate 6–10 seats',
    minSeats: 6,
    maxSeats: 10,
    ratePerSeatSCR: 800,
    description: 'SCR 800 per seat (6–10 seats exclusive band)',
  },
  {
    id: 'corp-11-20',
    label: 'Corporate 11–20 seats',
    minSeats: 11,
    maxSeats: 20,
    ratePerSeatSCR: 750,
    description: 'SCR 750 per seat (11–20 seats exclusive band)',
  },
  {
    id: 'corp-21-plus',
    label: 'Corporate 21+ seats',
    minSeats: 21,
    maxSeats: null,
    ratePerSeatSCR: 600,
    description: 'SCR 600 per seat (21+ seats volume band)',
  },
];

/**
 * Calculates the exact unit price per seat in Seychelles Rupees (SCR)
 * Seat bands are exclusive: 5 seats fall in the 1–5 band.
 */
export function getSeatRateSCR(seatCount: number, isCorporate: boolean = true): number {
  const seats = Math.max(1, Math.floor(seatCount));

  if (!isCorporate && seats === 1) {
    return 1000;
  }

  if (seats <= 5) {
    return 900;
  }
  if (seats <= 10) {
    return 800;
  }
  if (seats <= 20) {
    return 750;
  }
  return 600;
}

/**
 * Calculates total SCR for an order
 */
export function calculateOrderTotalSCR(seatCount: number, isCorporate: boolean = true): {
  seatCount: number;
  ratePerSeat: number;
  totalSCR: number;
  bandLabel: string;
} {
  const seats = Math.max(1, Math.floor(seatCount));
  const ratePerSeat = getSeatRateSCR(seats, isCorporate);
  const totalSCR = seats * ratePerSeat;

  let bandLabel = 'Corporate 21+ seats (SCR 600/seat)';
  if (!isCorporate && seats === 1) {
    bandLabel = 'Individual Seat (SCR 1,000/seat)';
  } else if (seats <= 5) {
    bandLabel = 'Corporate 1–5 seats (SCR 900/seat)';
  } else if (seats <= 10) {
    bandLabel = 'Corporate 6–10 seats (SCR 800/seat)';
  } else if (seats <= 20) {
    bandLabel = 'Corporate 11–20 seats (SCR 750/seat)';
  }

  return {
    seatCount: seats,
    ratePerSeat,
    totalSCR,
    bandLabel,
  };
}

/**
 * Format Seychelles Rupees with commas (e.g. SCR 1,000)
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
