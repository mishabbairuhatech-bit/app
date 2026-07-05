import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { Booking, Company, PaymentMethod, Service, Vehicle } from '@/types';
import { SEED_BOOKINGS } from '@/data/bookings';
import { PAYMENT_METHODS, PROMO_CODES, VEHICLES } from '@/data/user';
import { computeBreakdown } from '@/lib/pricing';

interface Draft {
  company?: Company;
  services: Service[];
  vehicle: Vehicle;
  date?: string;
  slot?: string;
  payment: PaymentMethod;
  promo?: string;
  discount: number;
}

const emptyDraft = (): Draft => ({
  services: [],
  vehicle: VEHICLES[0],
  payment: PAYMENT_METHODS[0],
  discount: 0,
});

interface BookingContextValue {
  bookings: Booking[];
  draft: Draft;
  // draft mutations
  startBooking: (company: Company) => void;
  toggleService: (service: Service) => void;
  isSelected: (serviceId: string) => boolean;
  setVehicle: (v: Vehicle) => void;
  setSchedule: (date: string, slot: string) => void;
  setPayment: (p: PaymentMethod) => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  resetDraft: () => void;
  // pricing
  breakdown: ReturnType<typeof computeBreakdown>;
  // commit
  confirmBooking: () => Booking;
  cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

let counter = 8900;
const nextCode = () => `CW-${counter++}`;

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  const startBooking = useCallback((company: Company) => {
    setDraft({ ...emptyDraft(), company });
  }, []);

  const toggleService = useCallback((service: Service) => {
    setDraft((d) => {
      const exists = d.services.some((s) => s.id === service.id);
      return {
        ...d,
        services: exists
          ? d.services.filter((s) => s.id !== service.id)
          : [...d.services, service],
      };
    });
  }, []);

  const isSelected = useCallback(
    (serviceId: string) => draft.services.some((s) => s.id === serviceId),
    [draft.services],
  );

  const setVehicle = useCallback((v: Vehicle) => setDraft((d) => ({ ...d, vehicle: v })), []);
  const setSchedule = useCallback(
    (date: string, slot: string) => setDraft((d) => ({ ...d, date, slot })),
    [],
  );
  const setPayment = useCallback((p: PaymentMethod) => setDraft((d) => ({ ...d, payment: p })), []);

  const applyPromo = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    const promo = PROMO_CODES[key];
    if (!promo) {
      return { ok: false, message: 'That code isn’t valid' };
    }
    setDraft((d) => ({ ...d, promo: key, discount: promo.discount }));
    return { ok: true, message: promo.label };
  }, []);

  const clearPromo = useCallback(
    () => setDraft((d) => ({ ...d, promo: undefined, discount: 0 })),
    [],
  );

  const resetDraft = useCallback(() => setDraft(emptyDraft()), []);

  const breakdown = useMemo(
    () => computeBreakdown(draft.services, draft.discount),
    [draft.services, draft.discount],
  );

  const confirmBooking = useCallback((): Booking => {
    const company = draft.company!;
    const b = computeBreakdown(draft.services, draft.discount);
    const booking: Booking = {
      id: `bk_${counter}`,
      code: nextCode(),
      companyId: company.id,
      companyName: company.name,
      companyImage: company.image,
      companyAddress: company.address,
      vehicle: draft.vehicle,
      services: draft.services,
      date: draft.date ?? new Date().toISOString().slice(0, 10),
      slot: draft.slot ?? '10:00 AM',
      status: 'confirmed',
      baseAmount: b.base,
      platformFee: b.platformFee,
      discount: b.discount,
      total: b.total,
      paymentMethod: draft.payment.label,
      createdAt: '2026-07-05',
    };
    setBookings((list) => [booking, ...list]);
    return booking;
  }, [draft]);

  const cancelBooking = useCallback((id: string) => {
    setBookings((list) =>
      list.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
    );
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      bookings,
      draft,
      startBooking,
      toggleService,
      isSelected,
      setVehicle,
      setSchedule,
      setPayment,
      applyPromo,
      clearPromo,
      resetDraft,
      breakdown,
      confirmBooking,
      cancelBooking,
    }),
    [
      bookings,
      draft,
      startBooking,
      toggleService,
      isSelected,
      setVehicle,
      setSchedule,
      setPayment,
      applyPromo,
      clearPromo,
      resetDraft,
      breakdown,
      confirmBooking,
      cancelBooking,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
