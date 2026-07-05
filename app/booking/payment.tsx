import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, Header, StepIndicator, GlassCard, BottomBar, PrimaryButton, PriceSummary } from '@/components';
import { useBooking } from '@/store/BookingStore';
import { PAYMENT_METHODS } from '@/data/user';
import { formatCurrency } from '@/lib/pricing';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const { draft, breakdown, setPayment, confirmBooking } = useBooking();
  const [processing, setProcessing] = useState(false);
  const [headerH, setHeaderH] = useState(insets.top + 128);

  const pay = () => {
    setProcessing(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setTimeout(() => {
      const booking = confirmBooking();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      router.replace({ pathname: '/booking/confirmation', params: { id: booking.id } });
    }, 1800);
  };

  return (
    <Screen>
      <Header title="Payment" subtitle={draft.company?.name} onHeight={setHeaderH}>
        <View style={{ paddingHorizontal: spacing.lg, marginTop: 16 }}>
          <StepIndicator current={3} />
        </View>
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.lg, paddingBottom: 170 }}
      >
        {/* Featured card visual */}
        <LinearGradient colors={gradients.water} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={styles.cardRing} />
          <View style={styles.cardTop}>
            <Txt variant="label" color="rgba(255,255,255,0.9)">
              SPARKLE PAY
            </Txt>
            <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.9)" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <View style={styles.chip} />
          <Txt variant="h2" color={c.white} style={{ letterSpacing: 3, marginTop: 14 }}>
            •••• •••• •••• 4821
          </Txt>
          <View style={styles.cardBottom}>
            <View>
              <Txt variant="tiny" color="rgba(255,255,255,0.7)">
                CARDHOLDER
              </Txt>
              <Txt variant="label" color={c.white}>
                ALEX RIVERA
              </Txt>
            </View>
            <Ionicons name="card" size={30} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>

        {/* Methods */}
        <Txt variant="h3" style={styles.section}>
          Payment method
        </Txt>
        <View style={{ gap: 10 }}>
          {PAYMENT_METHODS.map((m) => {
            const on = draft.payment.id === m.id;
            return (
              <Pressable key={m.id} onPress={() => setPayment(m)}>
                <GlassCard style={[styles.method, on && styles.methodOn]} padded>
                  <View style={styles.methodInner}>
                    <LinearGradient colors={m.gradient} style={styles.methodIcon}>
                      <Ionicons name={m.icon as any} size={19} color={c.white} />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Txt variant="title">{m.label}</Txt>
                      <Txt variant="caption" color={c.textMuted}>
                        {m.detail}
                      </Txt>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on && <View style={styles.radioDot} />}
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}
        </View>

        {/* Breakdown */}
        <Txt variant="h3" style={styles.section}>
          Order total
        </Txt>
        <GlassCard padded>
          <PriceSummary breakdown={breakdown} promoLabel={draft.promo} />
        </GlassCard>
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label={processing ? 'Processing…' : `Pay ${formatCurrency(breakdown.total)}`}
          icon={processing ? undefined : 'lock-closed'}
          loading={processing}
          onPress={pay}
        />
      </BottomBar>

      {processing && (
        <View style={[styles.overlay, { backgroundColor: c.overlay }]}>
          <GlassCard glow padded style={styles.processing}>
            <ActivityIndicator size="large" color={c.aqua} />
            <Txt variant="h3" style={{ marginTop: 14 }}>
              Confirming your booking
            </Txt>
            <Txt variant="caption" color={c.textMuted} center style={{ marginTop: 4 }}>
              Securing your slot & processing payment…
            </Txt>
          </GlassCard>
        </View>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  card: {
    borderRadius: radius.xl,
    padding: 22,
    height: 200,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 34,
    borderColor: 'rgba(255,255,255,0.10)',
    top: -90,
    right: -60,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    width: 42,
    height: 32,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginTop: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: 22,
    marginBottom: 12,
  },
  method: {
    padding: 0,
  },
  methodOn: {
    borderColor: c.aqua,
  },
  methodInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: c.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: c.aqua,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: c.aqua,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  processing: {
    alignItems: 'center',
    width: '100%',
  },
}));
