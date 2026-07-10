import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, GlassCard, SectionHeader, ThemeToggle, AccountMenu } from '@/components';
import { USER, VEHICLES } from '@/data/user';
import { useBooking } from '@/store/BookingStore';

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  sedan: 'car-sport',
  suv: 'car',
  hatchback: 'car-outline',
  bike: 'bicycle',
  truck: 'bus',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const { bookings } = useBooking();
  const completed = bookings.filter((b) => b.status === 'completed').length;

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 56], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [0, 56], [0, -12], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Screen>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 130 }}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Txt variant="hero">Profile</Txt>
          <Pressable style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={c.aqua} />
          </Pressable>
        </Animated.View>

        {/* Profile card */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <GlassCard glow padded>
            <View style={styles.profileRow}>
              <View>
                <LinearGradient colors={gradients.water} style={styles.avatarRing}>
                  <Image source={{ uri: USER.avatar }} style={styles.avatar} />
                </LinearGradient>
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="h2" numberOfLines={1}>
                  {USER.name}
                </Txt>
                <Txt variant="caption" color={c.textMuted}>
                  {USER.email}
                </Txt>
                <View style={styles.tier}>
                  <Ionicons name="medal" size={12} color={c.warning} />
                  <Txt variant="tiny" color={c.warning}>
                    {USER.tier.toUpperCase()}
                  </Txt>
                </View>
              </View>
            </View>

            <View style={styles.stats}>
              <Stat value={String(bookings.length)} label="Bookings" />
              <View style={styles.statDivider} />
              <Stat value={String(completed)} label="Completed" />
              <View style={styles.statDivider} />
              <Stat value={USER.points.toLocaleString()} label="Points" accent />
            </View>
          </GlassCard>
        </View>

        {/* Vehicles */}
        <View style={styles.section}>
          <SectionHeader title="My Garage" actionLabel="Add" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {VEHICLES.map((v) => (
            <GlassCard key={v.id} padded style={styles.vehicle}>
              <View style={styles.vehicleTop}>
                <LinearGradient colors={gradients.aurora} style={styles.vehicleIcon}>
                  <Ionicons name={TYPE_ICON[v.type]} size={20} color={c.white} />
                </LinearGradient>
                <View style={styles.plate}>
                  <Txt variant="tiny" color={c.text}>
                    {v.plate}
                  </Txt>
                </View>
              </View>
              <Txt variant="title" style={{ marginTop: 12 }} numberOfLines={1}>
                {v.make} {v.model}
              </Txt>
              <Txt variant="caption" color={c.textMuted} numberOfLines={1}>
                {v.label} · {v.color}
              </Txt>
            </GlassCard>
          ))}
        </ScrollView>

        {/* Appearance */}
        <View style={styles.section}>
          <SectionHeader title="Appearance" />
        </View>
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ThemeToggle />
        </View>

        {/* Menu */}
        <View style={[styles.section, { marginBottom: spacing.md }]}>
          <SectionHeader title="Account" />
        </View>
        <View style={{ paddingHorizontal: spacing.lg, gap: 10 }}>
          <AccountMenu />

          <Pressable style={styles.logout}>
            <Ionicons name="log-out-outline" size={19} color={c.danger} />
            <Txt variant="title" color={c.danger}>
              Sign out
            </Txt>
          </Pressable>
          <Txt variant="caption" color={c.textFaint} center style={{ marginTop: 6 }}>
            Sparkle Wash · v1.0.0 · {USER.memberSince}
          </Txt>
        </View>
      </Animated.ScrollView>
    </Screen>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.stat}>
      <Txt variant="h2" color={accent ? c.aquaSoft : c.text}>
        {value}
      </Txt>
      <Txt variant="caption" color={c.textMuted}>
        {label}
      </Txt>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  editBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glass,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  tier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(251,191,36,0.14)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: c.hairline,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: c.hairline,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  hList: {
    gap: 12,
    paddingHorizontal: spacing.lg,
  },
  vehicle: {
    width: 190,
  },
  vehicleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    backgroundColor: c.softFill,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    backgroundColor: 'rgba(248,113,113,0.08)',
  },
}));
