import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients, radius, spacing, useTheme, makeStyles } from '@/theme';
import {
  Screen,
  Txt,
  Chip,
  SectionHeader,
  FeaturedCompanyCard,
  CompanyRow,
  OfferCard,
  ThemeIconButton,
} from '@/components';
import { COMPANIES, CATEGORIES } from '@/data/companies';
import { OFFERS, USER } from '@/data/user';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const [category, setCategory] = useState('all');
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  // Apple-Music-style large header: fades and lifts away as content scrolls up.
  const topbarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 56], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [0, 56], [0, -12], Extrapolation.CLAMP) },
    ],
  }));

  const featured = [...COMPANIES].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <Screen>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 130 }}
      >
        {/* Top bar — large title that animates out on scroll */}
        <Animated.View style={[styles.topbar, topbarStyle]}>
          <View style={{ flex: 1 }}>
            <Txt variant="caption" color={c.textMuted}>
              Good morning ✨
            </Txt>
            <Pressable style={styles.location}>
              <Ionicons name="location" size={16} color={c.aqua} />
              <Txt variant="h3">{USER.location.split(',')[0]}</Txt>
              <Ionicons name="chevron-down" size={15} color={c.textMuted} />
            </Pressable>
          </View>
          <ThemeIconButton />
          <Pressable style={styles.bell}>
            <Ionicons name="notifications-outline" size={21} color={c.text} />
            <View style={styles.bellDot} />
          </Pressable>
          <Pressable onPress={() => router.push('/profile')}>
            <Image source={{ uri: USER.avatar }} style={styles.avatar} />
          </Pressable>
        </Animated.View>


        {/* Smart booking hero */}
        <Pressable style={styles.heroWrap} onPress={() => router.push(`/company/${featured[0].id}`)}>
          <LinearGradient colors={gradients.water} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroRing} />
            <View style={{ flex: 1 }}>
              <View style={styles.heroBadge}>
                <Ionicons name="flash" size={12} color={c.white} />
                <Txt variant="tiny" color={c.white}>
                  SMART BOOKING
                </Txt>
              </View>
              <Txt variant="h1" color={c.white} style={{ marginTop: 10 }}>
                Book a wash in{'\n'}under 30 seconds
              </Txt>
              <Txt variant="caption" color="rgba(255,255,255,0.9)" style={{ marginTop: 6 }}>
                Live slots · travel-time aware · instant confirm
              </Txt>
              <View style={styles.heroCta}>
                <Txt variant="label" color={c.blue}>
                  Find nearby
                </Txt>
                <Ionicons name="arrow-forward" size={14} color={c.blue} />
              </View>
            </View>
            <Ionicons name="car-sport" size={72} color="rgba(255,255,255,0.28)" style={styles.heroCar} />
          </LinearGradient>
        </Pressable>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={{ marginTop: spacing.xl }}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              icon={cat.icon as any}
              active={category === cat.key}
              onPress={() => setCategory(cat.key)}
            />
          ))}
        </ScrollView>

        {/* Offers */}
        <View style={styles.section}>
          <SectionHeader title="Offers for you" actionLabel="See all" onAction={() => router.push('/explore')} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {OFFERS.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </ScrollView>

        {/* Top rated */}
        <View style={styles.section}>
          <SectionHeader title="Top rated near you" actionLabel="Map" onAction={() => router.push('/explore')} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {featured.map((company) => (
            <FeaturedCompanyCard key={company.id} company={company} />
          ))}
        </ScrollView>

        {/* All list */}
        <View style={[styles.section, { marginBottom: spacing.md }]}>
          <SectionHeader title="All car washes" />
        </View>
        <View style={{ paddingHorizontal: spacing.lg }}>
          {COMPANIES.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </View>
      </Animated.ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glass,
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.aqua,
    borderWidth: 1.5,
    borderColor: c.bg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: c.glassBorder,
  },
  heroWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 168,
  },
  heroRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 30,
    borderColor: 'rgba(255,255,255,0.10)',
    top: -80,
    right: -50,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: c.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    marginTop: 16,
  },
  heroCar: {
    position: 'absolute',
    right: 10,
    bottom: 8,
  },
  chips: {
    gap: 9,
    paddingHorizontal: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  hList: {
    gap: 14,
    paddingHorizontal: spacing.lg,
  },
}));
