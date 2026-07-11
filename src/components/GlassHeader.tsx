import React, { useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';
import { Txt } from './Txt';

interface GlassHeaderProps {
  title: string;
  /** Reports the resting bar height so the screen can pad content beneath it. */
  onHeight?: (height: number) => void;
  /** Extra gap above the title, on top of the safe-area inset. Default 0. */
  topOffset?: number;
  /** Space below the title — counts toward the reported header height. Default 4. */
  bottomGap?: number;
  /**
   * Where the fade reaches 0, as a fraction of the title's own height (measured
   * from its top). 1 = the title's bottom edge. A longer ramp reads smoother;
   * shorter values pull the finish up toward the title but steepen the fade.
   * Default 1.
   */
  fadeEnd?: number;
}

/**
 * Floating Liquid-Glass header: a large title over a gradient-masked blur. The
 * blur's opacity is masked by a vertical gradient, so the frost is full behind
 * the title and fades to a true zero toward the bottom — no hard edge or seam,
 * ever. A light translucent tint keeps the title legible; content underneath
 * stays partially visible and eases away gradually.
 */
export function GlassHeader({
  title,
  onHeight,
  topOffset = 0,
  bottomGap = 4,
  fadeEnd = 1,
}: GlassHeaderProps) {
  const insets = useSafeAreaInsets();
  const { c, isDark } = useTheme();
  const styles = useStyles();

  // Measured title-row height, so the fade band is sized off the real title.
  const [rowH, setRowH] = useState(38);

  const onWrapLayout = (e: LayoutChangeEvent) => onHeight?.(e.nativeEvent.layout.height);
  const onRowLayout = (e: LayoutChangeEvent) => setRowH(e.nativeEvent.layout.height);

  // The frost is full through the status-bar area and above the title, then
  // eases to a true 0 by the fade point (the title's bottom by default). An
  // extra mid stop makes the ramp gentle, so it dissolves with no end line.
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
        pointerEvents="none"
      >
        <Txt variant="hero" numberOfLines={1}>
          {title}
        </Txt>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
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
    justifyContent: 'center',
  },
}));
