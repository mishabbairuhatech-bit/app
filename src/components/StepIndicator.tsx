import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gradients, makeStyles, useTheme } from '@/theme';
import { Txt } from './Txt';

const STEPS = ['Services', 'Schedule', 'Review', 'Pay'];

export function StepIndicator({ current }: { current: number }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <View style={styles.step}>
              {done || active ? (
                <LinearGradient colors={gradients.water} style={styles.dot}>
                  {done ? (
                    <Ionicons name="checkmark" size={14} color={c.white} />
                  ) : (
                    <Txt variant="label" color={c.white}>
                      {i + 1}
                    </Txt>
                  )}
                </LinearGradient>
              ) : (
                <View style={[styles.dot, styles.dotIdle]}>
                  <Txt variant="label" color={c.textMuted}>
                    {i + 1}
                  </Txt>
                </View>
              )}
              <Txt variant="tiny" color={active ? c.aqua : c.textMuted} style={{ marginTop: 5 }}>
                {label}
              </Txt>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.bar, i < current && styles.barDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  step: {
    alignItems: 'center',
    width: 56,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIdle: {
    backgroundColor: c.glass,
    borderWidth: 1,
    borderColor: c.glassBorder,
  },
  bar: {
    flex: 1,
    height: 2,
    backgroundColor: c.glassBorder,
    marginBottom: 18,
    marginHorizontal: -6,
  },
  barDone: {
    backgroundColor: c.aqua,
  },
}));
