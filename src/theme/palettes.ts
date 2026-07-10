/**
 * Two full colour palettes for the light/dark toggle. The vivid accent colours
 * (aqua → indigo water gradient, status colours) stay identical across modes;
 * only the neutral surfaces, text and glass tints flip.
 */

type Grad = readonly [string, string, ...string[]];

export interface Palette {
  // accents (shared)
  aqua: string;
  aquaSoft: string;
  sky: string;
  blue: string;
  indigo: string;
  violet: string;
  success: string;
  warning: string;
  danger: string;
  pending: string;
  info: string;
  white: string;
  black: string;

  // neutrals (per-mode)
  bg: string;
  bgElevated: string;
  bgDeep: string;
  text: string;
  textSoft: string;
  textMuted: string;
  textFaint: string;
  glass: string;
  glassStrong: string;
  glassBorder: string;
  glassBorderSoft: string;
  hairline: string;
  overlay: string;
  shade: string;
  softFill: string;

  // component fills (per-mode)
  cardWrapBg: string;
  tabBarBg: string;
  bottomBarBg: string;
  fabBorder: string;

  // gradients & blur (per-mode)
  canvas: Grad;
  cardGradient: Grad;
  sheenGradient: Grad;
  orb1: string;
  orb2: string;
  orb3: string;
  blurTint: 'dark' | 'light';
}

const accents = {
  aqua: '#22D3EE',
  aquaSoft: '#67E8F9',
  sky: '#38BDF8',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  pending: '#FBBF24',
  info: '#60A5FA',
  white: '#FFFFFF',
  black: '#000000',
};

export const darkColors: Palette = {
  ...accents,
  // Pure-black (AMOLED) dark background family — elevated surfaces get a
  // faint lift so cards stay distinguishable against the black canvas.
  bg: '#000000',
  bgElevated: '#161616',
  bgDeep: '#000000',
  text: '#F8FAFC',
  textSoft: '#CBD5E1',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  glass: 'rgba(255,255,255,0.06)',
  glassStrong: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassBorderSoft: 'rgba(255,255,255,0.08)',
  hairline: 'rgba(148,163,184,0.16)',
  overlay: 'rgba(4,6,15,0.6)',
  shade: 'rgba(2,6,23,0.55)',
  softFill: 'rgba(255,255,255,0.08)',
  cardWrapBg: 'rgba(12,18,38,0.35)',
  tabBarBg: 'rgba(9,14,30,0.6)',
  bottomBarBg: 'rgba(7,11,24,0.72)',
  fabBorder: 'rgba(7,11,24,0.9)',
  canvas: ['#000000', '#000000', '#000000'],
  cardGradient: ['rgba(255,255,255,0.09)', 'rgba(255,255,255,0.03)'],
  sheenGradient: ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.02)'],
  orb1: 'rgba(34,211,238,0.48)',
  orb2: 'rgba(99,102,241,0.42)',
  orb3: 'rgba(139,92,246,0.40)',
  blurTint: 'dark',
};

export const lightColors: Palette = {
  ...accents,
  // Telegram light background family — clean white with a faint grey backdrop.
  bg: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgDeep: '#F0F2F5',
  text: '#0B1220',
  textSoft: '#334155',
  textMuted: '#5B6B84',
  textFaint: '#94A3B8',
  glass: 'rgba(255,255,255,0.55)',
  glassStrong: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(15,23,42,0.10)',
  glassBorderSoft: 'rgba(15,23,42,0.06)',
  hairline: 'rgba(15,23,42,0.08)',
  overlay: 'rgba(226,232,245,0.6)',
  shade: 'rgba(203,213,225,0.55)',
  softFill: 'rgba(15,23,42,0.05)',
  cardWrapBg: 'rgba(255,255,255,0.5)',
  tabBarBg: 'rgba(255,255,255,0.7)',
  bottomBarBg: 'rgba(238,242,250,0.82)',
  fabBorder: 'rgba(255,255,255,0.95)',
  canvas: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
  cardGradient: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.45)'],
  sheenGradient: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.05)'],
  orb1: 'rgba(34,211,238,0.32)',
  orb2: 'rgba(99,102,241,0.24)',
  orb3: 'rgba(139,92,246,0.20)',
  blurTint: 'light',
};
