import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme } from '@/theme';

/**
 * Full-bleed aquatic canvas with floating ambient light "orbs" that give the
 * liquid-glass surfaces something colourful to refract. Adapts to light/dark.
 */
export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={c.canvas} style={StyleSheet.absoluteFill} />
      {/* Ambient glow orbs — fixed to the viewport so transparent glass always
          has colour to refract at every scroll position. */}
      <View style={[styles.orb, styles.orbTop, { backgroundColor: c.orb1 }]} />
      <View style={[styles.orb, styles.orbMid, { backgroundColor: c.orb2 }]} />
      <View style={[styles.orb, styles.orbLower, { backgroundColor: c.orb1 }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: c.orb3 }]} />
      {children}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
    backgroundColor: c.bg,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.75,
  },
  orbTop: {
    width: 400,
    height: 400,
    top: -150,
    right: -110,
  },
  orbMid: {
    width: 360,
    height: 360,
    top: 200,
    left: -150,
  },
  orbLower: {
    width: 360,
    height: 360,
    top: 470,
    right: -140,
  },
  orbBottom: {
    width: 440,
    height: 440,
    bottom: -180,
    left: -120,
  },
}));
