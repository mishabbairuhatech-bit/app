import React from 'react';
import { ActivityIndicator, Platform, Pressable, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { gradients, radius, shadow, makeStyles, useTheme } from '@/theme';
import { LIQUID_GLASS } from '@/lib/liquidGlass';
import { Txt } from './Txt';

function haptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }
}

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  gradient?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  size?: 'md' | 'lg';
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  iconRight,
  disabled,
  loading,
  gradient = gradients.water,
  style,
  size = 'lg',
}: PrimaryButtonProps) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={({ pressed }) => [
        { borderRadius: radius.pill },
        shadow.glow,
        disabled && { opacity: 0.5 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primary, size === 'md' && styles.primaryMd]}
      >
        {loading ? (
          <ActivityIndicator color={c.white} />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={19} color={c.white} />}
            <Txt variant="h3" color={c.white}>
              {label}
            </Txt>
            {iconRight && <Ionicons name={iconRight} size={19} color={c.white} />}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

interface GhostButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  active?: boolean;
}

export function GhostButton({ label, onPress, icon, style, active }: GhostButtonProps) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.ghost,
        active && styles.ghostActive,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={18} color={active ? c.aqua : c.textSoft} />
      )}
      <Txt variant="title" color={active ? c.aqua : c.textSoft}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** Circular glass icon button (used for back / favourite / share). */
export function IconButton({
  icon,
  onPress,
  size = 42,
  color,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
  active?: boolean;
}) {
  const { c, isDark } = useTheme();
  const styles = useStyles();
  const dim = { width: size, height: size, borderRadius: size / 2 };
  const glyph = (
    <Ionicons name={icon} size={size * 0.46} color={active ? c.aqua : color ?? c.text} />
  );
  return (
    <Pressable
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {LIQUID_GLASS ? (
        <GlassView
          glassEffectStyle="regular"
          colorScheme={isDark ? 'dark' : 'light'}
          isInteractive
          tintColor={active ? 'rgba(34,211,238,0.22)' : undefined}
          style={[styles.iconGlass, dim, active && { borderColor: c.aqua }]}
        >
          {glyph}
        </GlassView>
      ) : (
        <View
          style={[
            styles.iconBtn,
            dim,
            active && { backgroundColor: 'rgba(34,211,238,0.18)', borderColor: c.aqua },
          ]}
        >
          {glyph}
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  primary: {
    height: 56,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 24,
  },
  primaryMd: {
    height: 48,
  },
  ghost: {
    height: 52,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glass,
  },
  ghostActive: {
    borderColor: c.aqua,
    backgroundColor: 'rgba(34,211,238,0.12)',
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.softFill,
  },
  iconGlass: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorder,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
}));
