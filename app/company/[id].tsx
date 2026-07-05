import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, makeStyles, useTheme } from '@/theme';
import {
  Screen,
  Txt,
  IconButton,
  ServiceCard,
  Tag,
  Rating,
  PriceLevel,
  GlassCard,
  BottomBar,
  PrimaryButton,
} from '@/components';
import { getCompany } from '@/data/companies';
import { useBooking } from '@/store/BookingStore';
import { formatCurrency, formatDuration } from '@/lib/pricing';

export default function CompanyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const company = getCompany(id);
  const { startBooking, toggleService, isSelected, breakdown, draft } = useBooking();
  const [fav, setFav] = useState(false);
  const { c } = useTheme();
  const styles = useStyles();

  useEffect(() => {
    if (company) startBooking(company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.id]);

  if (!company) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Txt variant="h2">Car wash not found</Txt>
          <PrimaryButton label="Go back" onPress={() => router.back()} style={{ marginTop: 16 }} />
        </View>
      </Screen>
    );
  }

  const selectedCount = draft.services.length;
  const grouped = groupByCategory(company.services);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: company.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          <LinearGradient
            colors={['rgba(4,6,15,0.5)', 'transparent', 'rgba(7,11,24,1)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroInfo}>
            {company.open ? (
              <View style={styles.openPill}>
                <View style={styles.openDot} />
                <Txt variant="tiny" color={c.success}>
                  OPEN · closes {company.closeTime}
                </Txt>
              </View>
            ) : (
              <View style={[styles.openPill, { backgroundColor: 'rgba(148,163,184,0.15)' }]}>
                <Txt variant="tiny" color={c.textMuted}>
                  CLOSED · opens {company.openTime}
                </Txt>
              </View>
            )}
            {/* Hero text sits over a dark photo scrim, so keep it light in both modes */}
            <Txt variant="hero" color="#F8FAFC" style={{ marginTop: 10 }}>
              {company.name}
            </Txt>
            <Txt variant="body" color="#CBD5E1">
              {company.tagline}
            </Txt>
          </View>
        </View>

        {/* Meta bar */}
        <View style={styles.body}>
          <GlassCard padded style={styles.metaCard}>
            <View style={styles.metaRow}>
              <MetaItem icon="star" color={c.warning} value={company.rating.toFixed(1)} label={`${company.reviewCount} reviews`} />
              <View style={styles.vline} />
              <MetaItem icon="navigate" color={c.aqua} value={`${company.distanceKm} km`} label={`${company.etaMin} min away`} />
              <View style={styles.vline} />
              <MetaItem icon="pricetag" color={c.success} value={'$'.repeat(company.priceLevel)} label="Price" />
            </View>
          </GlassCard>

          {/* Address */}
          <GlassCard padded style={{ marginTop: 14 }}>
            <View style={styles.addressRow}>
              <View style={styles.pin}>
                <Ionicons name="location" size={18} color={c.aqua} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="title">{company.area}</Txt>
                <Txt variant="caption" color={c.textMuted}>
                  {company.address}
                </Txt>
              </View>
              <Pressable style={styles.dirBtn}>
                <Ionicons name="navigate" size={16} color={c.aqua} />
                <Txt variant="label" color={c.aqua}>
                  Directions
                </Txt>
              </Pressable>
            </View>
            <View style={styles.tagRow}>
              {company.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </View>
          </GlassCard>

          {/* Gallery */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18 }} contentContainerStyle={{ gap: 10 }}>
            {company.gallery.map((g, i) => (
              <Image key={i} source={{ uri: g }} style={styles.galleryImg} contentFit="cover" transition={200} />
            ))}
          </ScrollView>

          {/* Services */}
          <View style={styles.serviceHead}>
            <Txt variant="h2">Select services</Txt>
            <Txt variant="caption" color={c.textMuted}>
              Base price · +5% platform fee at checkout
            </Txt>
          </View>

          {grouped.map((group) => (
            <View key={group.category} style={{ marginTop: 6 }}>
              <Txt variant="label" color={c.textMuted} style={styles.groupLabel}>
                {CATEGORY_LABEL[group.category] ?? group.category}
              </Txt>
              <View style={{ gap: 10 }}>
                {group.services.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    selected={isSelected(s.id)}
                    onToggle={() => toggleService(s)}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Reviews */}
          <View style={styles.serviceHead}>
            <Txt variant="h2">Reviews</Txt>
            <Rating value={company.rating} count={company.reviewCount} />
          </View>
          <View style={{ gap: 12 }}>
            {company.reviews.map((r) => (
              <GlassCard key={r.id} padded>
                <View style={styles.reviewHead}>
                  <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="title">{r.author}</Txt>
                    <Txt variant="tiny" color={c.textMuted}>
                      {r.date}
                    </Txt>
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color={i < r.rating ? c.warning : c.textFaint} />
                    ))}
                  </View>
                </View>
                <Txt variant="body" color={c.textSoft} style={{ marginTop: 8 }}>
                  {r.text}
                </Txt>
              </GlassCard>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating glass controls pinned over the hero */}
      <View style={[styles.floatBar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <IconButton icon="share-social-outline" />
          <IconButton icon={fav ? 'heart' : 'heart-outline'} active={fav} onPress={() => setFav(!fav)} />
        </View>
      </View>

      {/* Sticky continue bar */}
      <BottomBar>
        {selectedCount > 0 ? (
          <View style={styles.barContent}>
            <View>
              <Txt variant="caption" color={c.textMuted}>
                {selectedCount} service{selectedCount > 1 ? 's' : ''} · {formatDuration(totalDuration(draft.services))}
              </Txt>
              <Txt variant="h2" color={c.aquaSoft}>
                {formatCurrency(breakdown.base)}
              </Txt>
            </View>
            <PrimaryButton
              label="Continue"
              iconRight="arrow-forward"
              onPress={() => router.push('/booking/schedule')}
              style={{ flex: 1, marginLeft: 16 }}
            />
          </View>
        ) : (
          <View style={styles.barEmpty}>
            <Ionicons name="hand-left-outline" size={18} color={c.textMuted} />
            <Txt variant="bodyMed" color={c.textMuted}>
              Select one or more services to continue
            </Txt>
          </View>
        )}
      </BottomBar>
    </Screen>
  );
}

function MetaItem({ icon, color, value, label }: { icon: any; color: string; value: string; label: string }) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={16} color={color} />
      <Txt variant="h3" style={{ marginTop: 4 }}>
        {value}
      </Txt>
      <Txt variant="tiny" color={c.textMuted}>
        {label}
      </Txt>
    </View>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  exterior: 'Exterior wash',
  interior: 'Interior care',
  detailing: 'Detailing',
  protection: 'Paint protection',
  addon: 'Add-ons',
};

function groupByCategory(services: (typeof getCompany extends any ? any : never)[]) {
  const order = ['exterior', 'interior', 'detailing', 'protection', 'addon'];
  const map = new Map<string, any[]>();
  services.forEach((s: any) => {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category)!.push(s);
  });
  return order
    .filter((c) => map.has(c))
    .map((category) => ({ category, services: map.get(category)! }));
}

function totalDuration(services: any[]) {
  return services.reduce((sum, s) => sum + s.durationMin, 0);
}

const useStyles = makeStyles((c) => ({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    height: 320,
    justifyContent: 'space-between',
  },
  floatBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  heroInfo: {
    padding: spacing.lg,
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52,211,153,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  openDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: c.success,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -6,
  },
  metaCard: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  vline: {
    width: 1,
    height: 40,
    backgroundColor: c.hairline,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,211,238,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 14,
  },
  galleryImg: {
    width: 130,
    height: 92,
    borderRadius: radius.md,
  },
  serviceHead: {
    marginTop: 26,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupLabel: {
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
}));
