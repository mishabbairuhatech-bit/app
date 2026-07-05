/**
 * Sparkle Wash — Liquid Glass design tokens.
 * A dark, aquatic glass-morphism system: deep navy canvas, frosted glass
 * surfaces, and cyan→indigo "water" gradients.
 */

export const colors = {
  // Canvas
  bg: '#070B18',
  bgElevated: '#0C1226',
  bgDeep: '#04060F',

  // Aqua / water accent
  aqua: '#22D3EE',
  aquaSoft: '#67E8F9',
  sky: '#38BDF8',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',

  // Status
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  pending: '#FBBF24',
  info: '#60A5FA',

  // Text
  text: '#F8FAFC',
  textSoft: '#CBD5E1',
  textMuted: '#94A3B8',
  textFaint: '#64748B',

  // Glass surfaces
  glass: 'rgba(255,255,255,0.06)',
  glassStrong: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassBorderSoft: 'rgba(255,255,255,0.08)',
  hairline: 'rgba(148,163,184,0.16)',

  // Overlays
  overlay: 'rgba(4,6,15,0.6)',
  shade: 'rgba(2,6,23,0.55)',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const gradients = {
  // Primary water gradient (aqua → blue → indigo)
  water: ['#22D3EE', '#3B82F6', '#6366F1'] as const,
  waterSoft: ['#38BDF8', '#6366F1'] as const,
  aurora: ['#22D3EE', '#8B5CF6'] as const,
  canvas: ['#0A1024', '#070B18', '#04060F'] as const,
  heroGlow: ['rgba(34,211,238,0.28)', 'rgba(99,102,241,0.05)', 'transparent'] as const,
  gold: ['#FBBF24', '#F59E0B'] as const,
  success: ['#34D399', '#10B981'] as const,
  glassSheen: ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.02)'] as const,
  card: ['rgba(255,255,255,0.09)', 'rgba(255,255,255,0.03)'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  pill: 999,
} as const;

export const font = {
  // Loaded via expo-font in the root layout
  display: 'SpaceGrotesk_700Bold',
  bold: 'Inter_700Bold',
  semibold: 'Inter_600SemiBold',
  medium: 'Inter_500Medium',
  regular: 'Inter_400Regular',
} as const;

export const typography = {
  hero: { fontFamily: font.display, fontSize: 32, lineHeight: 38 },
  h1: { fontFamily: font.display, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: font.bold, fontSize: 21, lineHeight: 27 },
  h3: { fontFamily: font.semibold, fontSize: 17, lineHeight: 23 },
  title: { fontFamily: font.semibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
  bodyMed: { fontFamily: font.medium, fontSize: 14, lineHeight: 21 },
  label: { fontFamily: font.medium, fontSize: 12, lineHeight: 16 },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 16 },
  tiny: { fontFamily: font.medium, fontSize: 10.5, lineHeight: 14 },
} as const;

export const shadow = {
  glow: {
    shadowColor: colors.aqua,
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;

export const theme = { colors, gradients, spacing, radius, font, typography, shadow };
export type Theme = typeof theme;

// Theming (light/dark)
export { ThemeProvider, useTheme, makeStyles } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';
export { darkColors, lightColors } from './palettes';
export type { Palette } from './palettes';
