import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, GlassCard, PrimaryButton, GhostButton } from '@/components';
import { useBooking } from '@/store/BookingStore';
import { formatCurrency } from '@/lib/pricing';
import { prettyDate } from '@/lib/schedule';

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const { bookings, resetDraft } = useBooking();
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];

  useEffect(() => {
    return () => resetDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booking) return null;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 30, paddingHorizontal: spacing.lg, paddingBottom: 40, flexGrow: 1 }}
      >
        {/* Success mark */}
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.checkWrap}>
          <View style={styles.glowRing}>
            <LinearGradient colors={gradients.success} style={styles.checkCircle}>
              <Ionicons name="checkmark" size={54} color={c.white} />
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)}>
          <Txt variant="hero" center>
            Booking Confirmed!
          </Txt>
          <Txt variant="body" color={c.textMuted} center style={{ marginTop: 8, paddingHorizontal: 20 }}>
            Your wash is locked in. We’ve sent the details and a receipt to your email.
          </Txt>
        </Animated.View>

        {/* Ticket */}
        <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 28 }}>
          <GlassCard padded glow>
            <View style={styles.ticketHead}>
              <View>
                <Txt variant="caption" color={c.textMuted}>
                  Booking code
                </Txt>
                <Txt variant="h2" color={c.aquaSoft}>
                  {booking.code}
                </Txt>
              </View>
              <View style={styles.qr}>
                <Ionicons name="qr-code" size={46} color={c.black} />
              </View>
            </View>

            <View style={styles.dashed} />

            <Row icon="business" label={booking.companyName} sub={booking.companyAddress} />
            <Row icon="car-sport" label={`${booking.vehicle.make} ${booking.vehicle.model}`} sub={booking.vehicle.plate} />
            <Row icon="calendar" label={prettyDate(booking.date)} sub={booking.slot} />
            <Row
              icon="construct"
              label={`${booking.services.length} service${booking.services.length > 1 ? 's' : ''}`}
              sub={booking.services.map((s) => s.name).join(', ')}
            />
            <Row icon="card" label={booking.paymentMethod} sub="Paid securely" />

            <View style={styles.dashed} />

            <View style={styles.totalRow}>
              <Txt variant="h3">Total paid</Txt>
              <Txt variant="h1" color={c.aquaSoft}>
                {formatCurrency(booking.total)}
              </Txt>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Next steps */}
        <Animated.View entering={FadeIn.delay(450)} style={styles.tips}>
          <View style={styles.tip}>
            <Ionicons name="navigate-circle" size={18} color={c.aqua} />
            <Txt variant="caption" color={c.textSoft} style={{ flex: 1 }}>
              We’ll notify you when it’s time to leave, based on live travel time.
            </Txt>
          </View>
          <View style={styles.tip}>
            <Ionicons name="notifications-circle" size={18} color={c.aqua} />
            <Txt variant="caption" color={c.textSoft} style={{ flex: 1 }}>
              Track your wash status live from the Bookings tab.
            </Txt>
          </View>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(550)} style={{ gap: 12, marginTop: 28 }}>
          <PrimaryButton
            label="View my bookings"
            icon="calendar"
            onPress={() => router.replace('/bookings')}
          />
          <GhostButton label="Back to home" icon="home" onPress={() => router.replace('/')} />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, label, sub }: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={17} color={c.aquaSoft} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt variant="title" numberOfLines={1}>
          {label}
        </Txt>
        <Txt variant="caption" color={c.textMuted} numberOfLines={1}>
          {sub}
        </Txt>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  checkWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  glowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52,211,153,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  checkCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.success,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  ticketHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qr: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: c.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashed: {
    height: 1,
    borderBottomWidth: 1.5,
    borderColor: c.glassBorder,
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tips: {
    marginTop: 20,
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
}));
