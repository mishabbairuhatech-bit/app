import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { gradients, radius, spacing, useTheme, makeStyles } from '@/theme';
import {
  Screen,
  Txt,
  Chip,
  SectionHeader,
  FeaturedCompanyCard,
  CompanyRow,
  OfferCard,
  GlassHeader,
  type HeaderAction,
} from '@/components';
import { COMPANIES, CATEGORIES } from '@/data/companies';
import { OFFERS, USER } from '@/data/user';

export default function HomeScreen() {
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();
  const [category, setCategory] = useState('all');
  const [headerH, setHeaderH] = useState(120);

  const featured = [...COMPANIES].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const firstName = USER.name.split(' ')[0];

  const actions: HeaderAction[] = [
    { key: 'bell', icon: 'notifications-outline', badge: true, onPress: () => {} },
    {
      key: 'avatar',
      onPress: () => router.push('/profile'),
      node: <Image source={{ uri: USER.avatar }} style={styles.avatar} />,
    },
  ];

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerH + spacing.md, paddingBottom: 130 }}
      >
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
          <SectionHeader title="Offers for you" actionLabel="See all" onAction={() => router.push('/search')} />
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
          <SectionHeader title="Top rated near you" actionLabel="Map" onAction={() => router.push('/search')} />
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
      </ScrollView>

      <GlassHeader
        title={`Hi, ${firstName}`}
        subtitle={USER.location}
        subtitleColor={c.textSoft}
        subtitleSize={12.5}
        titleSize={28}
        actions={actions}
        onHeight={setHeaderH}
      />
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
