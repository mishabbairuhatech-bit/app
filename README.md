# ✨ Sparkle Wash — Car Wash Booking App

A polished **Expo (React Native)** app for booking car-wash & detailing services,
built to match the *Car Wash Booking System* working-flow diagram. It uses a
**Liquid Glass Morphism** design language — a dark aquatic canvas, frosted-glass
surfaces, and cyan→indigo "water" gradients — and runs entirely on **mock data**.

## What it does

Implements the full customer booking journey from the flow diagram:

`Open app → Search nearby wash → Select company → Select services → Pick date & time → Review billing → Pay → Booking confirmed`

Key business rule from the diagram is faithfully modelled: the customer pays the
company's **base price plus a 5% platform charge** (see `src/lib/pricing.ts`).

## Screens

| Area | Screens |
|------|---------|
| **Tabs** | Home (nearby washes, offers, smart-booking hero), Explore (live search + sort/filter), Bookings (live wash tracker + history), Profile (garage, rewards, account) |
| **Booking flow** | Company detail + service selection, Schedule (vehicle/date/slot with real-time availability), Review (promo codes + billing breakdown), Payment (methods + mock processing), Confirmation (animated success ticket) |

## Highlights

- **Liquid glass UI kit** — `GlassCard` (blur + sheen + border), gradient buttons,
  glass tab bar with a raised center **Book** FAB, ambient glow orbs, step indicator, status badges.
- **Light / dark theme toggle** — a `ThemeProvider` swaps two full palettes (neutral
  surfaces flip, vivid accents stay); initialises from the system scheme. Toggle from the
  Home header (sun/moon) or the Profile → Appearance segmented control. Styles are wired
  via a `makeStyles((c) => …)` hook so colours re-evaluate live.
- **Real booking state** — a `BookingProvider` context drives the multi-step draft
  (services, vehicle, schedule, promo, payment) and commits to a bookings list.
- **Working promo codes** — try `SPARKLE30`, `MIDWEEK9`, `CERAMICFREE`.
- **Haptics, animations** (Reanimated), and `expo-image` remote imagery.
- Fully typed (**TypeScript strict**) and passes `tsc --noEmit`; the iOS bundle
  exports cleanly via `expo export`.

## Tech stack

Expo SDK 54 (Expo Go compatible) · React 19 · React Native 0.81 · expo-router (file-based) ·
expo-blur · expo-linear-gradient · react-native-reanimated · expo-haptics · expo-image ·
Inter + Space Grotesk fonts.

## Run it

```bash
npm install
npx expo start        # then press i (iOS), a (Android), or w (web)
```

> Web needs the web deps (already installed): `react-native-web`, `react-dom`.

## Project structure

```
app/                     # expo-router routes
  _layout.tsx            # fonts, providers, stack
  (tabs)/                # home, explore, bookings, profile + glass tab bar
  company/[id].tsx       # company detail & service selection
  booking/               # schedule, summary, payment, confirmation
src/
  components/            # GlassCard, buttons, cards, badges, PriceSummary…
  data/                  # mock companies, services, user, offers, seed bookings
  store/BookingStore.tsx # booking flow state (React context)
  lib/                   # pricing (5% platform fee), schedule helpers
  theme/                 # colors, gradients, typography, spacing tokens
```

All data is mock — no backend required.
