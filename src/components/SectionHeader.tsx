import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Txt } from './Txt';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { c } = useTheme();
  return (
    <View style={styles.row}>
      <Txt variant="h2">{title}</Txt>
      {actionLabel && (
        <Pressable onPress={onAction} style={styles.action} hitSlop={8}>
          <Txt variant="label" color={c.aqua}>
            {actionLabel}
          </Txt>
          <Ionicons name="chevron-forward" size={14} color={c.aqua} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
