import { Booking } from '@/types';
import { COMPANIES } from './companies';
import { CATALOG } from './services';
import { VEHICLES } from './user';
import { computeBreakdown } from '@/lib/pricing';

function seed(
  id: string,
  code: string,
  companyId: string,
  serviceIds: string[],
  vehicleIdx: number,
  date: string,
  slot: string,
  status: Booking['status'],
  discount = 0,
): Booking {
  const company = COMPANIES.find((c) => c.id === companyId)!;
  const services = serviceIds.map((s) => CATALOG[s]);
  const b = computeBreakdown(services, discount);
  return {
    id,
    code,
    companyId,
    companyName: company.name,
    companyImage: company.image,
    companyAddress: company.address,
    vehicle: VEHICLES[vehicleIdx],
    services,
    date,
    slot,
    status,
    baseAmount: b.base,
    platformFee: b.platformFee,
    discount: b.discount,
    total: b.total,
    paymentMethod: 'Visa •••• 4821',
    createdAt: date,
  };
}

/** Pre-populated booking history so the app feels lived-in. */
export const SEED_BOOKINGS: Booking[] = [
  seed('b1', 'CW-8842', 'aqua-lux', ['fullValet', 'leatherCare'], 0, '2026-07-06', '10:30 AM', 'confirmed'),
  seed('b2', 'CW-8790', 'splash-hub', ['express'], 2, '2026-07-05', '02:00 PM', 'in_progress'),
  seed('b3', 'CW-8654', 'mirror-finish', ['ceramicCoat'], 1, '2026-06-28', '09:00 AM', 'completed'),
  seed('b4', 'CW-8571', 'aqua-lux', ['premiumExterior', 'interiorDetail'], 0, '2026-06-19', '04:30 PM', 'completed'),
  seed('b5', 'CW-8420', 'turbo-bay', ['express', 'engineBay'], 1, '2026-06-02', '11:00 AM', 'cancelled'),
];
