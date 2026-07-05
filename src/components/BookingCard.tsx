import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { Booking } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { prettyDate } from '@/lib/schedule';
import { Txt } from './Txt';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './Badges';

export function BookingCard({ booking, onPress }: { booking: Booking; onPress?: () => void }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <GlassCard onPress={onPress} style={styles.card} padded>
      <View style={styles.head}>
        <Image source={{ uri: booking.companyImage }} transition={200} style={styles.thumb} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Txt variant="h3" numberOfLines={1} style={{ flex: 1 }}>
              {booking.companyName}
            </Txt>
            <StatusBadge status={booking.status} />
          </View>
          <Txt variant="caption" color={c.textMuted} numberOfLines={1} style={{ marginTop: 3 }}>
            {booking.code} · {booking.vehicle.make} {booking.vehicle.model}
          </Txt>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={14} color={c.aqua} />
          <Txt variant="label" color={c.textSoft}>
            {prettyDate(booking.date)}
          </Txt>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={c.aqua} />
          <Txt variant="label" color={c.textSoft}>
            {booking.slot}
          </Txt>
        </View>
        <View style={styles.meta}>
          <Ionicons name="cube-outline" size={14} color={c.aqua} />
          <Txt variant="label" color={c.textSoft}>
            {booking.services.length} service{booking.services.length > 1 ? 's' : ''}
          </Txt>
        </View>
      </View>

      <View style={styles.footer}>
        <Txt variant="caption" color={c.textMuted}>
          Total paid
        </Txt>
        <Txt variant="h3" color={c.aquaSoft}>
          {formatCurrency(booking.total)}
        </Txt>
      </View>
    </GlassCard>
  );
}

const useStyles = makeStyles((c) => ({
  card: {
    marginBottom: 14,
  },
  head: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: c.hairline,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
}));
