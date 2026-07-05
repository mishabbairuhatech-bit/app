import { Offer, PaymentMethod, Vehicle } from '@/types';

export const USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@email.com',
  avatar: 'https://i.pravatar.cc/200?img=68',
  memberSince: 'Since 2023',
  tier: 'Gold Member',
  points: 2480,
  location: 'Bayfront, Marina District',
};

export const VEHICLES: Vehicle[] = [
  { id: 'v1', label: 'Daily Driver', make: 'Tesla', model: 'Model 3', plate: 'SPK 3421', type: 'sedan', color: 'Midnight Blue' },
  { id: 'v2', label: 'Weekend SUV', make: 'BMW', model: 'X5', plate: 'WKD 8890', type: 'suv', color: 'Alpine White' },
  { id: 'v3', label: 'City Hatch', make: 'Mini', model: 'Cooper', plate: 'MNI 1207', type: 'hatchback', color: 'Racing Green' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'card', label: 'Visa •••• 4821', detail: 'Expires 08/27', icon: 'card', gradient: ['#3B82F6', '#6366F1'] },
  { id: 'pm2', type: 'wallet', label: 'Sparkle Wallet', detail: '$142.50 balance', icon: 'wallet', gradient: ['#22D3EE', '#3B82F6'] },
  { id: 'pm3', type: 'upi', label: 'Apple Pay', detail: 'Default device', icon: 'logo-apple', gradient: ['#8B5CF6', '#6366F1'] },
  { id: 'pm4', type: 'cash', label: 'Pay at Location', detail: 'Cash / card on arrival', icon: 'cash', gradient: ['#34D399', '#10B981'] },
];

export const OFFERS: Offer[] = [
  {
    id: 'o1',
    title: '30% off your first valet',
    subtitle: 'New customers only • all locations',
    code: 'SPARKLE30',
    discountLabel: '30% OFF',
    gradient: ['#22D3EE', '#6366F1'],
    icon: 'sparkles',
    expires: 'Jul 31',
  },
  {
    id: 'o2',
    title: 'Free Interior with Ceramic',
    subtitle: 'Add ceramic coating, get interior free',
    code: 'CERAMICFREE',
    discountLabel: 'BUNDLE',
    gradient: ['#8B5CF6', '#EC4899'],
    icon: 'gift',
    expires: 'Aug 15',
  },
  {
    id: 'o3',
    title: 'Midweek Express $9',
    subtitle: 'Tue–Thu express foam wash',
    code: 'MIDWEEK9',
    discountLabel: '$9 WASH',
    gradient: ['#34D399', '#3B82F6'],
    icon: 'flash',
    expires: 'Ongoing',
  },
];

/** Map promo codes to a flat discount amount (mock). */
export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  SPARKLE30: { discount: 12, label: 'SPARKLE30 applied' },
  MIDWEEK9: { discount: 5, label: 'MIDWEEK9 applied' },
  CERAMICFREE: { discount: 20, label: 'CERAMICFREE applied' },
  WELCOME: { discount: 8, label: 'WELCOME applied' },
};
