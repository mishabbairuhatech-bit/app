import React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { radius as R, shadow } from '@/theme';
import { useTheme } from '@/theme';
import { LIQUID_GLASS } from '@/lib/liquidGlass';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  /**
   * Glass material style on iOS 26. `regular` is frosted/opaque; `clear` is
   * transparent so the content behind shows through. Defaults to `clear` in
   * dark mode (so cards don't dim the dark canvas into near-black slabs) and
   * `regular` in light mode. On the blur fallback, `clear` drops the tint fill
   * and softens the blur.
   */
  variant?: 'regular' | 'clear';
  radius?: number;
  bordered?: boolean;
  sheen?: boolean;
  glow?: boolean;
  padded?: boolean;
  onPress?: () => void;
}

/**
 * The signature liquid-glass surface. On iOS 26 it renders Apple's native
 * Liquid Glass material (`GlassView`) with real refraction; everywhere else it
 * falls back to the frosted `expo-blur` + gradient stack. Both paths keep a
 * subtle top sheen and a 1px border, so the look is consistent across devices
 * and the public API is unchanged.
 */
export function GlassCard({
  children,
  style,
  intensity = 30,
  tint,
  variant,
  radius: r = R.lg,
  bordered = true,
  sheen = true,
  glow = false,
  padded = false,
  onPress,
}: GlassCardProps) {
  const { c, isDark } = useTheme();
  const Container: any = onPress ? Pressable : View;

  // Default to the transparent "clear" material in dark mode — the "regular"
  // material dims dark backdrops into near-black slabs. Light mode keeps
  // "regular"; callers can override either via `variant`.
  const effectiveVariant = variant ?? (isDark ? 'clear' : 'regular');

  // Sheen highlight + rim border + content — shared by both paths so the
  // glassy specular edge reads the same with or without the native material.
  const overlays = (
    <>
      {sheen && (
        <LinearGradient
          colors={c.sheenGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        />
      )}
      {bordered && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: r, borderWidth: 1, borderColor: c.glassBorder },
          ]}
        />
      )}
      <View style={padded ? styles.padded : undefined}>{children}</View>
    </>
  );

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.wrap,
        // A transparent wrap lets the native glass sample the real screen
        // content behind the card; the fallback keeps its base tint.
        { borderRadius: r, backgroundColor: LIQUID_GLASS ? 'transparent' : c.cardWrapBg },
        glow && { ...shadow.glow, shadowColor: c.aqua },
        !glow && shadow.card,
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      {LIQUID_GLASS ? (
        <GlassView
          glassEffectStyle={effectiveVariant}
          // Pin the material to the app theme so the glass can't render dark
          // while the content uses light-theme text colours (or vice versa).
          colorScheme={isDark ? 'dark' : 'light'}
          isInteractive={!!onPress}
          style={[styles.blur, { borderRadius: r }]}
        >
          {overlays}
        </GlassView>
      ) : (
        <BlurView
          intensity={effectiveVariant === 'clear' ? Math.round(intensity * 0.6) : intensity}
          tint={tint ?? c.blurTint}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          style={[styles.blur, { borderRadius: r }]}
        >
          {/* Tint + inner fill only the blur fallback needs to look like glass. */}
          <LinearGradient
            colors={c.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {effectiveVariant !== 'clear' && (
            <View style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: c.glass }]} />
          )}
          {overlays}
        </BlurView>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
  },
  padded: {
    padding: 16,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
