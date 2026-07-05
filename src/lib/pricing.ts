import { PLATFORM_FEE_RATE, Service } from '@/types';

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function sumBase(services: Service[]): number {
  return services.reduce((sum, s) => sum + s.basePrice, 0);
}

export function sumDuration(services: Service[]): number {
  return services.reduce((sum, s) => sum + s.durationMin, 0);
}

export interface PriceBreakdown {
  base: number;
  platformFee: number;
  discount: number;
  total: number;
}

/**
 * Mirrors the billing logic from the flow diagram:
 * customer pays base price + a 5% platform charge (minus any discount).
 */
export function computeBreakdown(services: Service[], discount = 0): PriceBreakdown {
  const base = sumBase(services);
  const platformFee = Math.round(base * PLATFORM_FEE_RATE * 100) / 100;
  const total = Math.max(0, base + platformFee - discount);
  return { base, platformFee, discount, total };
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
