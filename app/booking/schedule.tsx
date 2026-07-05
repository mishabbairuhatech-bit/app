import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, Header, StepIndicator, GlassCard, BottomBar, PrimaryButton } from '@/components';
import { useBooking } from '@/store/BookingStore';
import { VEHICLES } from '@/data/user';
import { upcomingDays, slotGroups } from '@/lib/schedule';
import { formatDuration, sumDuration } from '@/lib/pricing';

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  sedan: 'car-sport',
  suv: 'car',
  hatchback: 'car-outline',
  bike: 'bicycle',
  truck: 'bus',
};

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const { draft, setVehicle, setSchedule } = useBooking();
  const days = upcomingDays();
  const groups = slotGroups();

  const [date, setDate] = useState<string>(draft.date ?? days[0].iso);
  const [slot, setSlot] = useState<string | undefined>(draft.slot);
  const [headerH, setHeaderH] = useState(insets.top + 128);

  const duration = sumDuration(draft.services);

  const onContinue = () => {
    if (!slot) return;
    setSchedule(date, slot);
    router.push('/booking/summary');
  };

  return (
    <Screen>
      <Header title="Schedule" subtitle={draft.company?.name} onHeight={setHeaderH}>
        <View style={{ paddingHorizontal: spacing.lg, marginTop: 16 }}>
          <StepIndicator current={1} />
        </View>
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.lg, paddingBottom: 150 }}
      >
        {/* Vehicle */}
        <Txt variant="h3" style={styles.label}>
          Which vehicle?
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {VEHICLES.map((v) => {
            const on = draft.vehicle.id === v.id;
            return (
              <Pressable key={v.id} onPress={() => setVehicle(v)}>
                <GlassCard style={[styles.vehicle, on && styles.selected]} padded>
                  <LinearGradient
                    colors={on ? gradients.water : c.cardGradient}
                    style={styles.vehicleIcon}
                  >
                    <Ionicons name={TYPE_ICON[v.type]} size={20} color={on ? c.white : c.aquaSoft} />
                  </LinearGradient>
                  <Txt variant="title" style={{ marginTop: 10 }} numberOfLines={1}>
                    {v.make} {v.model}
                  </Txt>
                  <Txt variant="caption" color={c.textMuted}>
                    {v.plate}
                  </Txt>
                  {on && (
                    <View style={styles.vehicleCheck}>
                      <Ionicons name="checkmark-circle" size={20} color={c.aqua} />
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Date */}
        <Txt variant="h3" style={styles.label}>
          Pick a date
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
          {days.map((d) => {
            const on = date === d.iso;
            return (
              <Pressable key={d.iso} onPress={() => setDate(d.iso)}>
                {on ? (
                  <LinearGradient colors={gradients.water} style={styles.day}>
                    <Txt variant="tiny" color={c.white}>
                      {d.label === 'Today' || d.label === 'Tomorrow' ? d.label : d.weekday}
                    </Txt>
                    <Txt variant="h2" color={c.white}>
                      {d.day}
                    </Txt>
                    <Txt variant="tiny" color="rgba(255,255,255,0.8)">
                      {d.month}
                    </Txt>
                  </LinearGradient>
                ) : (
                  <View style={[styles.day, styles.dayIdle]}>
                    <Txt variant="tiny" color={c.textMuted}>
                      {d.label === 'Today' || d.label === 'Tomorrow' ? d.label : d.weekday}
                    </Txt>
                    <Txt variant="h2">{d.day}</Txt>
                    <Txt variant="tiny" color={c.textMuted}>
                      {d.month}
                    </Txt>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Slots */}
        <Txt variant="h3" style={styles.label}>
          Available times
        </Txt>
        {groups.map((g) => (
          <View key={g.period} style={{ marginBottom: 18 }}>
            <View style={styles.periodRow}>
              <Ionicons name={g.icon as any} size={15} color={c.aquaSoft} />
              <Txt variant="label" color={c.textSoft}>
                {g.period}
              </Txt>
            </View>
            <View style={styles.slotWrap}>
              {g.slots.map((s) => {
                const on = slot === s.time;
                if (!s.available) {
                  return (
                    <View key={s.time} style={[styles.slot, styles.slotOff]}>
                      <Txt variant="label" color={c.textFaint}>
                        {s.time}
                      </Txt>
                    </View>
                  );
                }
                return (
                  <Pressable key={s.time} onPress={() => setSlot(s.time)}>
                    {on ? (
                      <LinearGradient colors={gradients.water} style={styles.slot}>
                        <Txt variant="label" color={c.white}>
                          {s.time}
                        </Txt>
                      </LinearGradient>
                    ) : (
                      <View style={[styles.slot, styles.slotIdle]}>
                        <Txt variant="label" color={c.textSoft}>
                          {s.time}
                        </Txt>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <GlassCard padded style={styles.durationNote}>
          <Ionicons name="hourglass-outline" size={16} color={c.aqua} />
          <Txt variant="caption" color={c.textSoft}>
            Estimated service time · {formatDuration(duration)}. We hold your bay for 15 min after your slot.
          </Txt>
        </GlassCard>
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label={slot ? 'Review booking' : 'Select a time slot'}
          iconRight={slot ? 'arrow-forward' : undefined}
          icon={!slot ? 'time-outline' : undefined}
          disabled={!slot}
          onPress={onContinue}
        />
      </BottomBar>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  label: {
    marginBottom: 12,
    marginTop: 22,
  },
  vehicle: {
    width: 150,
  },
  selected: {
    borderColor: c.aqua,
  },
  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  day: {
    width: 66,
    height: 88,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayIdle: {
    backgroundColor: c.glass,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  slotWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  slot: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotIdle: {
    backgroundColor: c.glass,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
  },
  slotOff: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  durationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
}));
