import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme, Palette } from '@/theme';
import { BookingStatus } from '@/types';
import { Txt } from './Txt';

const STATUS_META: Record<
  BookingStatus,
  { label: string; colorKey: keyof Palette; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: { label: 'Pending', colorKey: 'warning', bg: 'rgba(251,191,36,0.15)', icon: 'time' },
  confirmed: { label: 'Confirmed', colorKey: 'aqua', bg: 'rgba(34,211,238,0.15)', icon: 'checkmark-circle' },
  checked_in: { label: 'Checked In', colorKey: 'info', bg: 'rgba(96,165,250,0.15)', icon: 'log-in' },
  in_progress: { label: 'In Progress', colorKey: 'violet', bg: 'rgba(139,92,246,0.18)', icon: 'sync' },
  completed: { label: 'Completed', colorKey: 'success', bg: 'rgba(52,211,153,0.15)', icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelled', colorKey: 'danger', bg: 'rgba(248,113,113,0.15)', icon: 'close-circle' },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { c } = useTheme();
  const styles = useStyles();
  const m = STATUS_META[status];
  const color = c[m.colorKey] as string;
  return (
    <View style={[styles.badge, { backgroundColor: m.bg }]}>
      <Ionicons name={m.icon} size={13} color={color} />
      <Txt variant="tiny" color={color}>
        {m.label.toUpperCase()}
      </Txt>
    </View>
  );
}

export function Tag({ label, style }: { label: string; style?: ViewStyle }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.tag, style]}>
      <Txt variant="tiny" color={c.textSoft}>
        {label}
      </Txt>
    </View>
  );
}

export function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.rating}>
      <Ionicons name="star" size={size} color={c.warning} />
      <Txt variant="label" color={c.text}>
        {value.toFixed(1)}
      </Txt>
      {count != null && (
        <Txt variant="caption" color={c.textMuted}>
          ({count > 999 ? `${(count / 1000).toFixed(1)}k` : count})
        </Txt>
      )}
    </View>
  );
}

export function PriceLevel({ level }: { level: 1 | 2 | 3 }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.rating}>
      {[1, 2, 3].map((i) => (
        <Txt key={i} variant="label" color={i <= level ? c.success : c.textFaint}>
          $
        </Txt>
      ))}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: c.softFill,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
}));
