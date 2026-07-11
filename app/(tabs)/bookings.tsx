import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, BookingCard, GlassCard, GlassHeader, PrimaryButton } from '@/components';
import { useBooking } from '@/store/BookingStore';
import { useRouter } from 'expo-router';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
] as const;

const UPCOMING = new Set(['pending', 'confirmed', 'checked_in', 'in_progress']);

export default function BookingsScreen() {
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();
  const { bookings } = useBooking();
  const [filter, setFilter] = useState<string>('upcoming');
  const [headerH, setHeaderH] = useState(120);

  const list = useMemo(() => {
    if (filter === 'all') return bookings;
    if (filter === 'completed') return bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
    return bookings.filter((b) => UPCOMING.has(b.status));
  }, [bookings, filter]);

  const active = bookings.find((b) => b.status === 'in_progress');

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.md, paddingBottom: 130 }}
      >
        {/* Live tracking banner */}
        {active && (
          <GlassCard glow style={styles.live} padded>
            <View style={styles.liveRow}>
              <View style={styles.pulse}>
                <Ionicons name="sync" size={18} color={c.violet} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="title">Wash in progress</Txt>
                <Txt variant="caption" color={c.textMuted}>
                  {active.companyName} · {active.slot}
                </Txt>
              </View>
              <Txt variant="label" color={c.violet}>
                LIVE
              </Txt>
            </View>
            <View style={styles.track}>
              {['Checked in', 'Washing', 'Drying', 'Ready'].map((s, i) => (
                <View key={s} style={styles.trackStep}>
                  <View style={[styles.trackDot, i <= 1 && styles.trackDotOn]} />
                  <Txt variant="tiny" color={i <= 1 ? c.aqua : c.textMuted}>
                    {s}
                  </Txt>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Segmented control */}
        <View style={styles.segment}>
          {FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <Pressable key={f.key} onPress={() => setFilter(f.key)} style={styles.segItem}>
                {on && <LinearGradient colors={gradients.water} style={StyleSheet.absoluteFill} />}
                <Txt variant="label" color={on ? c.white : c.textMuted}>
                  {f.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {list.length === 0 ? (
            <GlassCard padded style={styles.empty}>
              <LinearGradient colors={gradients.water} style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={30} color={c.white} />
              </LinearGradient>
              <Txt variant="h3" style={{ marginTop: 14 }}>
                Nothing here yet
              </Txt>
              <Txt variant="caption" color={c.textMuted} center style={{ marginTop: 4, marginBottom: 18 }}>
                Book your first sparkle wash to see it here
              </Txt>
              <PrimaryButton label="Browse car washes" icon="car-sport" onPress={() => router.push('/search')} />
            </GlassCard>
          ) : (
            list.map((b) => <BookingCard key={b.id} booking={b} onPress={() => {}} />)
          )}
        </View>
      </ScrollView>

      <GlassHeader
        title="My Bookings"
        subtitle="Track and manage your washes"
        onHeight={setHeaderH}
      />
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  live: {
    marginTop: spacing.lg,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  trackStep: {
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  trackDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.glassBorder,
  },
  trackDotOn: {
    backgroundColor: c.aqua,
  },
  segment: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    backgroundColor: c.glass,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    padding: 4,
  },
  segItem: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
