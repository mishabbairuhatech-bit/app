import React from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';
import { LIQUID_GLASS } from '@/lib/liquidGlass';
import { Txt } from './Txt';
import { IconButton } from './Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  /** Extra content rendered inside the glass bar, below the title row (e.g. a StepIndicator). */
  children?: React.ReactNode;
  /** Reports the measured bar height so the screen can pad its scroll content to clear it. */
  onHeight?: (height: number) => void;
}

/**
 * Liquid-glass header pinned to the top of the screen. Content scrolls beneath
 * the translucent bar (frosted on iOS 26, blurred everywhere else).
 */
export function Header({ title, subtitle, right, onBack, showBack = true, children, onHeight }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c, isDark } = useTheme();
  const styles = useStyles();

  const report = (e: LayoutChangeEvent) => onHeight?.(e.nativeEvent.layout.height);

  const inner = (
    <>
      <View style={styles.row}>
        {showBack ? (
          <IconButton icon="chevron-back" onPress={onBack ?? (() => router.back())} />
        ) : (
          <View style={{ width: 42 }} />
        )}
        <View style={styles.center}>
          {!!title && (
            <Txt variant="h3" center numberOfLines={1}>
              {title}
            </Txt>
          )}
          {!!subtitle && (
            <Txt variant="caption" color={c.textMuted} center numberOfLines={1}>
              {subtitle}
            </Txt>
          )}
        </View>
        <View style={styles.right}>{right ?? <View style={{ width: 42 }} />}</View>
      </View>
      {children}
      <View style={styles.hairline} />
    </>
  );

  const pad = { paddingTop: insets.top + 6 };

  if (LIQUID_GLASS) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={isDark ? 'dark' : 'light'}
        style={[styles.wrap, pad]}
        onLayout={report}
      >
        {inner}
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={40}
      tint={c.blurTint}
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      style={[styles.wrap, pad, { backgroundColor: c.bottomBarBg }]}
      onLayout={report}
    >
      {inner}
    </BlurView>
  );
}

const useStyles = makeStyles((c) => ({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  hairline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: c.glassBorderSoft,
  },
}));
