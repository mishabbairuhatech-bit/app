import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import {
  Screen,
  Txt,
  Header,
  StepIndicator,
  GlassCard,
  BottomBar,
  PrimaryButton,
  PriceSummary,
} from '@/components';
import { useBooking } from '@/store/BookingStore';
import { formatCurrency, formatDuration, sumDuration } from '@/lib/pricing';
import { prettyDate } from '@/lib/schedule';
import { OFFERS } from '@/data/user';

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const { draft, breakdown, applyPromo, clearPromo } = useBooking();
  const [code, setCode] = useState(draft.promo ?? '');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    draft.promo ? { ok: true, message: `${draft.promo} applied` } : null,
  );
  const [headerH, setHeaderH] = useState(insets.top + 128);

  const onApply = () => {
    if (!code.trim()) return;
    const res = applyPromo(code);
    setFeedback(res);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        res.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
      ).catch(() => {});
    }
  };

  const onClear = () => {
    clearPromo();
    setCode('');
    setFeedback(null);
  };

  return (
    <Screen>
      <Header title="Review" subtitle={draft.company?.name} onHeight={setHeaderH}>
        <View style={{ paddingHorizontal: spacing.lg, marginTop: 16 }}>
          <StepIndicator current={2} />
        </View>
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.lg, paddingBottom: 160 }}
      >
        {/* Company + schedule */}
        <GlassCard padded>
          <View style={styles.companyRow}>
            <Image source={{ uri: draft.company?.image }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Txt variant="h3" numberOfLines={1}>
                {draft.company?.name}
              </Txt>
              <Txt variant="caption" color={c.textMuted} numberOfLines={1}>
                {draft.company?.address}
              </Txt>
            </View>
          </View>
          <View style={styles.scheduleRow}>
            <InfoPill icon="calendar" label={prettyDate(draft.date)} />
            <InfoPill icon="time" label={draft.slot ?? '—'} />
          </View>
          <View style={styles.vehicleRow}>
            <Ionicons name="car-sport" size={16} color={c.aquaSoft} />
            <Txt variant="bodyMed" color={c.textSoft}>
              {draft.vehicle.make} {draft.vehicle.model}
            </Txt>
            <View style={styles.plate}>
              <Txt variant="tiny" color={c.text}>
                {draft.vehicle.plate}
              </Txt>
            </View>
          </View>
        </GlassCard>

        {/* Services */}
        <Txt variant="h3" style={styles.section}>
          Services ({draft.services.length})
        </Txt>
        <GlassCard padded>
          {draft.services.map((s, i) => (
            <View key={s.id}>
              {i > 0 && <View style={styles.itemDivider} />}
              <View style={styles.serviceItem}>
                <LinearGradient colors={c.cardGradient} style={styles.serviceIcon}>
                  <Ionicons name={s.icon as any} size={18} color={c.aquaSoft} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Txt variant="title" numberOfLines={1}>
                    {s.name}
                  </Txt>
                  <Txt variant="caption" color={c.textMuted}>
                    {formatDuration(s.durationMin)}
                  </Txt>
                </View>
                <Txt variant="title">{formatCurrency(s.basePrice)}</Txt>
              </View>
            </View>
          ))}
          <View style={styles.totalDuration}>
            <Ionicons name="hourglass-outline" size={14} color={c.textMuted} />
            <Txt variant="caption" color={c.textMuted}>
              Total time approx {formatDuration(sumDuration(draft.services))}
            </Txt>
          </View>
        </GlassCard>

        {/* Promo */}
        <Txt variant="h3" style={styles.section}>
          Promo code
        </Txt>
        <GlassCard style={styles.promoCard} radius={radius.lg}>
          <View style={styles.promoInner}>
            <Ionicons name="pricetag-outline" size={18} color={c.aqua} />
            <TextInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              placeholder="Enter code (try SPARKLE30)"
              placeholderTextColor={c.textFaint}
              style={[styles.promoInput, { color: c.text }]}
              editable={!draft.promo}
            />
            {draft.promo ? (
              <Pressable onPress={onClear} style={styles.promoBtn}>
                <Txt variant="label" color={c.danger}>
                  Remove
                </Txt>
              </Pressable>
            ) : (
              <Pressable onPress={onApply}>
                <LinearGradient colors={gradients.water} style={styles.promoApply}>
                  <Txt variant="label" color={c.white}>
                    Apply
                  </Txt>
                </LinearGradient>
              </Pressable>
            )}
          </View>
          {feedback && (
            <View style={styles.feedback}>
              <Ionicons
                name={feedback.ok ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={feedback.ok ? c.success : c.danger}
              />
              <Txt variant="caption" color={feedback.ok ? c.success : c.danger}>
                {feedback.message}
              </Txt>
            </View>
          )}
        </GlassCard>

        {/* Suggested offer chips */}
        {!draft.promo && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offerChips}>
            {OFFERS.map((o) => (
              <Pressable
                key={o.id}
                onPress={() => {
                  setCode(o.code);
                  const res = applyPromo(o.code);
                  setFeedback(res);
                }}
                style={styles.offerChip}
              >
                <Ionicons name="gift-outline" size={13} color={c.aquaSoft} />
                <Txt variant="tiny" color={c.textSoft}>
                  {o.code}
                </Txt>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Price breakdown */}
        <Txt variant="h3" style={styles.section}>
          Billing breakdown
        </Txt>
        <GlassCard padded>
          <PriceSummary breakdown={breakdown} promoLabel={draft.promo ? `${draft.promo}` : undefined} />
        </GlassCard>
      </ScrollView>

      <BottomBar>
        <View style={styles.barContent}>
          <View>
            <Txt variant="caption" color={c.textMuted}>
              Total payable
            </Txt>
            <Txt variant="h2" color={c.aquaSoft}>
              {formatCurrency(breakdown.total)}
            </Txt>
          </View>
          <PrimaryButton
            label="Proceed to pay"
            iconRight="arrow-forward"
            onPress={() => router.push('/booking/payment')}
            style={{ flex: 1, marginLeft: 16 }}
          />
        </View>
      </BottomBar>
    </Screen>
  );
}

function InfoPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.infoPill}>
      <Ionicons name={icon} size={14} color={c.aqua} />
      <Txt variant="label" color={c.textSoft}>
        {label}
      </Txt>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: c.glass,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  plate: {
    backgroundColor: c.softFill,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  section: {
    marginTop: 22,
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
  },
  itemDivider: {
    height: 1,
    backgroundColor: c.hairline,
    marginVertical: 12,
  },
  totalDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: c.hairline,
  },
  promoCard: {
    padding: 0,
  },
  promoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 6,
    height: 56,
  },
  promoInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  promoApply: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  promoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  offerChips: {
    gap: 8,
    marginTop: 12,
  },
  offerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: c.glass,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
