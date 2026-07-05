import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';
import { darkColors, lightColors, Palette } from './palettes';

export type ThemeMode = 'dark' | 'light';

interface ThemeValue {
  mode: ThemeMode;
  isDark: boolean;
  c: Palette;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeCtx = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(system === 'light' ? 'light' : 'dark');

  // Make the JS theme authoritative: push it to the native appearance so native
  // surfaces (the Liquid Glass tab bar, system controls) follow the toggle
  // instead of tracking the device independently and desyncing from the UI.
  useEffect(() => {
    Appearance.setColorScheme(mode);
  }, [mode]);

  const toggle = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      c: mode === 'dark' ? darkColors : lightColors,
      toggle,
      setMode,
    }),
    [mode, toggle],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error('useTheme must be used within ThemeProvider');
  return v;
}

/**
 * Factory that turns a palette-aware style definition into a hook. Layout stays
 * static; only colours re-evaluate when the active palette changes.
 *
 *   const useStyles = makeStyles((c) => ({ box: { backgroundColor: c.glass } }));
 *   // inside component:  const styles = useStyles();
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (c: Palette) => T) {
  return function useStyles(): T {
    const { c } = useTheme();
    return useMemo(() => StyleSheet.create(factory(c)), [c]);
  };
}
