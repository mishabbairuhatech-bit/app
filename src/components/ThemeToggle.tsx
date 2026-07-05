import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { gradients, radius, useTheme } from '@/theme';
import { Txt } from './Txt';

const OPTIONS = [
  { mode: 'light' as const, label: 'Light', icon: 'sunny' as const },
  { mode: 'dark' as const, label: 'Dark', icon: 'moon' as const },
];

/** Segmented Light/Dark control for the Profile screen. */
export function ThemeToggle() {
  const { mode, setMode, c } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: c.glass, borderColor: c.glassBorderSoft }]}>
      {OPTIONS.map((o) => {
        const on = mode === o.mode;
        return (
          <Pressable
            key={o.mode}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              setMode(o.mode);
            }}
            style={styles.item}
          >
            {on && <LinearGradient colors={gradients.water} style={StyleSheet.absoluteFill} />}
            <Ionicons name={o.icon} size={16} color={on ? c.white : c.textMuted} />
            <Txt variant="label" color={on ? c.white : c.textMuted}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Compact circular sun/moon button for headers. */
export function ThemeIconButton({ size = 44 }: { size?: number }) {
  const { isDark, toggle, c } = useTheme();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        toggle();
      }}
      style={({ pressed }) => [
        styles.iconBtn,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: c.glass, borderColor: c.glassBorder },
        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
      ]}
    >
      <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={size * 0.46} color={isDark ? c.warning : c.indigo} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: 4,
  },
  item: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
