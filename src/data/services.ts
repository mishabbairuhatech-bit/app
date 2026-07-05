import { Service } from '@/types';

/** Master catalog of wash & detailing services (base prices set by companies). */
export const CATALOG: Record<string, Service> = {
  express: {
    id: 'express',
    name: 'Express Foam Wash',
    category: 'exterior',
    description: 'Snow-foam pre-soak, contactless rinse & spot-free dry in a flash.',
    basePrice: 14,
    durationMin: 20,
    icon: 'water',
    popular: true,
  },
  premiumExterior: {
    id: 'premiumExterior',
    name: 'Premium Exterior',
    category: 'exterior',
    description: 'Hand wash, wheel deep-clean, tire shine and streak-free towel dry.',
    basePrice: 26,
    durationMin: 40,
    icon: 'car-sport',
    popular: true,
  },
  interiorDetail: {
    id: 'interiorDetail',
    name: 'Interior Detail',
    category: 'interior',
    description: 'Full vacuum, dashboard conditioning, glass & console sanitising.',
    basePrice: 32,
    durationMin: 50,
    icon: 'sparkles',
  },
  fullValet: {
    id: 'fullValet',
    name: 'Full Valet',
    category: 'detailing',
    description: 'Complete inside-out treatment — our signature showroom finish.',
    basePrice: 59,
    durationMin: 90,
    icon: 'diamond',
    popular: true,
  },
  ceramicCoat: {
    id: 'ceramicCoat',
    name: 'Ceramic Coating',
    category: 'protection',
    description: '9H nano-ceramic layer for months of hydrophobic gloss & protection.',
    basePrice: 149,
    durationMin: 180,
    icon: 'shield-checkmark',
  },
  clayPolish: {
    id: 'clayPolish',
    name: 'Clay Bar & Polish',
    category: 'detailing',
    description: 'Decontaminate paintwork and machine-polish to a mirror shine.',
    basePrice: 79,
    durationMin: 120,
    icon: 'color-wand',
  },
  engineBay: {
    id: 'engineBay',
    name: 'Engine Bay Clean',
    category: 'addon',
    description: 'Degrease and dress the engine bay for a factory-fresh look.',
    basePrice: 24,
    durationMin: 30,
    icon: 'construct',
  },
  petHair: {
    id: 'petHair',
    name: 'Pet Hair Removal',
    category: 'addon',
    description: 'Specialist tools to lift stubborn pet hair from every fibre.',
    basePrice: 18,
    durationMin: 25,
    icon: 'paw',
  },
  headlight: {
    id: 'headlight',
    name: 'Headlight Restore',
    category: 'addon',
    description: 'Cut back yellowed lenses for brighter, clearer night driving.',
    basePrice: 29,
    durationMin: 35,
    icon: 'bulb',
  },
  leatherCare: {
    id: 'leatherCare',
    name: 'Leather Care',
    category: 'interior',
    description: 'Clean, feed and protect leather seats with premium balm.',
    basePrice: 34,
    durationMin: 45,
    icon: 'briefcase',
  },
};

export const allServices = Object.values(CATALOG);

export function pick(ids: string[], overrides: Record<string, number> = {}): Service[] {
  return ids.map((id) => {
    const base = CATALOG[id];
    return overrides[id] != null ? { ...base, basePrice: overrides[id] } : base;
  });
}
