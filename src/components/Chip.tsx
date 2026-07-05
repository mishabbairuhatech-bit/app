import React from 'react';
import { Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { gradients, makeStyles, useTheme } from '@/theme';
import { Txt } from './Txt';

interface ChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress?: () => void;
}

export function Chip({ label, icon, active, onPress }: ChipProps) {
  const { c } = useTheme();
  const styles = useStyles();
  const content = (
    <>
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color={active ? c.white : c.textMuted}
        />
      )}
      <Txt variant="label" color={active ? c.white : c.textSoft}>
        {label}
      </Txt>
    </>
  );

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [pressed && { opacity: 0.85 }]}
    >
      {active ? (
        <LinearGradient
          colors={gradients.water}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chip}
        >
          {content}
        </LinearGradient>
      ) : (
        <LinearGradient colors={c.cardGradient} style={[styles.chip, styles.inactive]}>
          {content}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
  },
  inactive: {
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
  },
}));
