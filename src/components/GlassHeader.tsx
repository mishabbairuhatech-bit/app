import React, { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LIQUID_GLASS } from '@/lib/liquidGlass';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';
import { Txt } from './Txt';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BTN = 42; // circular action-button diameter
const SPRING = { damping: 18, stiffness: 220, mass: 0.9 } as const;

/** A single header action, passed in via props. */
export interface HeaderAction {
  key?: string;
  /** Ionicon name — rendered inside a circular glass button. */
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  /** `true` shows a dot; a number shows a small count pill. */
  badge?: boolean | number;
  /** Tint the icon with the accent colour instead of the text colour. */
  accent?: boolean;
  /** Fully custom content (e.g. an avatar) rendered in place of a glass button. */
  node?: React.ReactNode;
}

interface GlassHeaderProps {
  title: string;
  /** Optional second line under the title. */
  subtitle?: string;
  /** Colour of the subtitle text. Defaults to the muted text colour. */
  subtitleColor?: string;
  /** Override the subtitle font size (default is the `body` size, 14). */
  subtitleSize?: number;
  /** Override the title font size (default is the large `hero` size, 32). */
  titleSize?: number;
  /** Right-aligned action buttons — all supplied via props. */
  actions?: HeaderAction[];
  /** Reports the resting bar height so the screen can pad content beneath it. */
  onHeight?: (height: number) => void;
  /** Extra gap above the title, on top of the safe-area inset. Default 0. */
  topOffset?: number;
  /** Space below the title — counts toward the reported header height. Default 4. */
  bottomGap?: number;
  /**
   * Where the fade reaches 0, as a fraction of the header row's height (measured
   * from its top). 1 = the row's bottom edge. A longer ramp reads smoother;
   * shorter values pull the finish up but steepen the fade. Default 1.
   */
  fadeEnd?: number;
}

/**
 * Floating Liquid-Glass header shared across every tab. A large title (with an
 * optional subtitle) sits over a gradient-masked blur: the frost is full behind
 * the title and eases to a true zero toward the bottom — no hard edge or seam.
 * Actions are supplied entirely via the `actions` prop and render as circular
 * glass buttons (or custom nodes) on the right.
 */
export function GlassHeader({
  title,
  subtitle,
  subtitleColor,
  subtitleSize,
  titleSize,
  actions,
  onHeight,
  topOffset = 0,
  bottomGap = 4,
  fadeEnd = 1,
}: GlassHeaderProps) {
  const insets = useSafeAreaInsets();
  const { c, isDark } = useTheme();
  const styles = useStyles();

  // Measured header-row height, so the fade band is sized off the real content.
  const [rowH, setRowH] = useState(38);

  const onWrapLayout = (e: LayoutChangeEvent) => onHeight?.(e.nativeEvent.layout.height);
  const onRowLayout = (e: LayoutChangeEvent) => setRowH(e.nativeEvent.layout.height);

  // The frost is full through the status-bar area and above the title, then
  // eases to a true 0 by the fade point (the row's bottom by default). An extra
  // mid stop makes the ramp gentle, so it dissolves with no end line.
  const topGap = insets.top + topOffset;
  const total = topGap + rowH * fadeEnd;
  const opaqueFrac = Math.min(0.85, topGap / total);
  const midFrac = opaqueFrac + (1 - opaqueFrac) * 0.5;

  const rgb = isDark ? '0,0,0' : '255,255,255';

  return (
    <View
      style={[styles.wrap, { paddingBottom: bottomGap }]}
      onLayout={onWrapLayout}
      pointerEvents="box-none"
    >
      {/* Blur masked by an alpha gradient: full frost through the status bar
          and above the title, fading to a genuine 0 up at the title — the blur
          itself disappears, so there is no line where it ends. */}
      <MaskedView
        style={[styles.scrim, { height: total }]}
        pointerEvents="none"
        maskElement={
          <LinearGradient
            colors={[
              'rgba(0,0,0,1)',
              'rgba(0,0,0,1)',
              'rgba(0,0,0,0.4)',
              'rgba(0,0,0,0)',
            ]}
            locations={[0, opaqueFrac, midFrac, 1]}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView
          intensity={38}
          tint={c.blurTint}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          style={StyleSheet.absoluteFill}
        />
      </MaskedView>

      {/* Light tint for title legibility, easing to fully transparent */}
      <LinearGradient
        colors={[
          `rgba(${rgb},0.4)`,
          `rgba(${rgb},0.4)`,
          `rgba(${rgb},0.16)`,
          `rgba(${rgb},0)`,
        ]}
        locations={[0, opaqueFrac, midFrac, 1]}
        style={[styles.scrim, { height: total }]}
        pointerEvents="none"
      />

      <View
        style={[styles.row, { marginTop: topGap }]}
        onLayout={onRowLayout}
        pointerEvents="box-none"
      >
        <View style={styles.titleCol} pointerEvents="none">
          <Txt
            variant="hero"
            numberOfLines={1}
            style={titleSize ? { fontSize: titleSize, lineHeight: titleSize + 6 } : undefined}
          >
            {title}
          </Txt>
          {!!subtitle && (
            <Txt
              variant="body"
              color={subtitleColor ?? c.textMuted}
              numberOfLines={1}
              style={
                subtitleSize
                  ? [styles.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize + 5 }]
                  : styles.subtitle
              }
            >
              {subtitle}
            </Txt>
          )}
        </View>

        {!!actions?.length && (
          <View style={styles.actions}>
            {actions.map((a, i) => (
              <GlassButton key={a.key ?? a.icon ?? i} action={a} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * A circular Liquid-Glass action button with a springy press and badge. Uses
 * Apple's native Liquid Glass material (with interactive lensing) on iOS 26,
 * and a frosted `expo-blur` fallback everywhere else.
 */
function GlassButton({ action }: { action: HeaderAction }) {
  const { c, isDark } = useTheme();
  const styles = useStyles();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const press = () => {
    Haptics.selectionAsync();
    action.onPress?.();
  };

  if (action.node) {
    return (
      <Pressable onPress={action.onPress} hitSlop={4}>
        {action.node}
      </Pressable>
    );
  }

  return (
    <AnimatedPressable
      style={[styles.btn, aStyle]}
      onPress={press}
      onPressIn={() => (scale.value = withSpring(0.86, SPRING))}
      onPressOut={() => (scale.value = withSpring(1, SPRING))}
      hitSlop={4}
    >
      {LIQUID_GLASS ? (
        <GlassView
          glassEffectStyle="regular"
          colorScheme={isDark ? 'dark' : 'light'}
          isInteractive
          style={styles.btnGlass}
        />
      ) : (
        <BlurView
          intensity={28}
          tint={c.blurTint}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          style={styles.btnBlur}
        />
      )}
      <View style={styles.btnBorder} pointerEvents="none" />
      {!!action.icon && (
        <Ionicons name={action.icon} size={20} color={action.accent ? c.aqua : c.text} />
      )}
      {action.badge != null && action.badge !== false && (
        <View style={[styles.badge, typeof action.badge === 'number' && styles.badgeCount]}>
          {typeof action.badge === 'number' && (
            <Txt variant="tiny" color={c.white}>
              {action.badge > 99 ? '99+' : action.badge}
            </Txt>
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}

const useStyles = makeStyles((c) => ({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btn: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  btnBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: c.glass,
  },
  btnGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BTN / 2,
  },
  btnBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BTN / 2,
    borderWidth: 1,
    borderColor: c.glassBorder,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.aqua,
    borderWidth: 1.5,
    borderColor: c.bg,
  },
  badgeCount: {
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.danger,
  },
}));
