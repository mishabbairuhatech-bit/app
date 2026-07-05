import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';

/** Frosted glass bar pinned to the bottom of a screen for primary actions. */
export function BottomBar({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <BlurView
      intensity={40}
      tint={c.blurTint}
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}
    >
      <View style={styles.hairline} />
      {children}
    </BlurView>
  );
}

const useStyles = makeStyles((c) => ({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: c.bottomBarBg,
    overflow: 'hidden',
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: c.glassBorderSoft,
  },
}));
