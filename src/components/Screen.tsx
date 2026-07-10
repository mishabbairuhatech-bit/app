import React from 'react';
import { View, ViewStyle } from 'react-native';
import { makeStyles } from '@/theme';

/**
 * Plain, minimal canvas in the spirit of Telegram: a single flat background
 * colour that flips cleanly between light and dark modes. No gradients or
 * ambient orbs — just a calm, uniform surface.
 */
export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const styles = useStyles();
  return <View style={[styles.root, style]}>{children}</View>;
}

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
    backgroundColor: c.bg,
  },
}));
