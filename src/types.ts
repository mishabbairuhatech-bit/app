/** Domain types for the Sparkle Wash car-wash booking app. */

export type ServiceCategory =
  | 'exterior'
  | 'interior'
  | 'detailing'
  | 'protection'
  | 'addon';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number; // company's base price
  durationMin: number;
  icon: string; // Ionicons name
  popular?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  image: string;
  logo: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMin: number; // travel time to reach
  address: string;
  area: string;
  open: boolean;
  openTime: string;
  closeTime: string;
  priceLevel: 1 | 2 | 3;
  tags: string[];
  gallery: string[];
  services: Service[];
  reviews: Review[];
  verified: boolean;
  bookingsToday: number;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Vehicle {
  id: string;
  label: string; // "My Sedan"
  make: string;
  model: string;
  plate: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'bike' | 'truck';
  color: string;
}

export interface BookingLine {
  service: Service;
}

/** Platform charge is 5% of the service base amount (per the flow diagram). */
export const PLATFORM_FEE_RATE = 0.05;

export interface Booking {
  id: string;
  code: string; // e.g. CW-8842
  companyId: string;
  companyName: string;
  companyImage: string;
  companyAddress: string;
  vehicle: Vehicle;
  services: Service[];
  date: string; // ISO date
  slot: string; // "10:30 AM"
  status: BookingStatus;
  baseAmount: number;
  platformFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'upi' | 'cash';
  label: string;
  detail: string;
  icon: string;
  gradient: readonly [string, string, ...string[]];
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discountLabel: string;
  gradient: readonly [string, string, ...string[]];
  icon: string;
  expires: string;
}
