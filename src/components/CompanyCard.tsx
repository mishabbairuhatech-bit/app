import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { radius, shadow, spacing, makeStyles, useTheme } from '@/theme';
import { Company } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { Txt } from './Txt';
import { GlassCard } from './GlassCard';
import { Rating, Tag } from './Badges';

const BLUR_HASH = 'L36ROlof00ay~qofj[fQ00WB-;of';

// Fixed light colours for text that sits over the dark photo scrim (both modes).
const ON_PHOTO = '#F8FAFC';
const ON_PHOTO_SOFT = 'rgba(255,255,255,0.82)';
const ON_PHOTO_MUTED = 'rgba(255,255,255,0.7)';

/** Large featured card used in the "Top rated" carousel. */
export function FeaturedCompanyCard({ company }: { company: Company }) {
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();
  const from = Math.min(...company.services.map((s) => s.basePrice));
  return (
    <Pressable
      onPress={() => router.push(`/company/${company.id}`)}
      style={({ pressed }) => [styles.featured, shadow.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: company.image }}
        placeholder={BLUR_HASH}
        transition={300}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(4,6,15,0.35)', 'rgba(4,6,15,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.featuredTop}>
        <View style={styles.floatBadge}>
          <Rating value={company.rating} count={company.reviewCount} />
        </View>
        {company.verified && (
          <View style={styles.verified}>
            <Ionicons name="shield-checkmark" size={13} color={c.aqua} />
            <Txt variant="tiny" color={c.aqua}>
              VERIFIED
            </Txt>
          </View>
        )}
      </View>
      <View style={styles.featuredBody}>
        <Txt variant="h2" color={ON_PHOTO} numberOfLines={1}>
          {company.name}
        </Txt>
        <Txt variant="caption" color={ON_PHOTO_SOFT} numberOfLines={1} style={{ marginTop: 2 }}>
          {company.tagline}
        </Txt>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={13} color={c.aqua} />
            <Txt variant="label" color={ON_PHOTO_SOFT}>
              {company.distanceKm} km
            </Txt>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={13} color={c.aqua} />
            <Txt variant="label" color={ON_PHOTO_SOFT}>
              {company.etaMin} min away
            </Txt>
          </View>
          <View style={styles.metaItem}>
            <Txt variant="label" color={ON_PHOTO_MUTED}>
              from {formatCurrency(from)}
            </Txt>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/** Row card used in the main vertical list. */
export function CompanyRow({ company }: { company: Company }) {
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();
  const from = Math.min(...company.services.map((s) => s.basePrice));
  return (
    <GlassCard onPress={() => router.push(`/company/${company.id}`)} style={styles.row} radius={radius.lg}>
      <View style={styles.rowInner}>
        <View style={styles.thumbWrap}>
          <Image
            source={{ uri: company.image }}
            placeholder={BLUR_HASH}
            transition={250}
            style={styles.thumb}
            contentFit="cover"
          />
          <View style={[styles.statusDot, { backgroundColor: company.open ? c.success : c.textFaint }]} />
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowHead}>
            <Txt variant="h3" numberOfLines={1} style={{ flex: 1 }}>
              {company.name}
            </Txt>
            <Rating value={company.rating} count={company.reviewCount} />
          </View>
          <Txt variant="caption" color={c.textMuted} numberOfLines={1}>
            {company.area} · {company.open ? 'Open now' : 'Opens ' + company.openTime}
          </Txt>
          <View style={styles.tagRow}>
            {company.tags.slice(0, 2).map((t) => (
              <Tag key={t} label={t} />
            ))}
            <View style={styles.dot} />
            <Txt variant="label" color={c.textSoft}>
              {company.etaMin} min
            </Txt>
          </View>
          <View style={styles.rowFooter}>
            <Txt variant="label" color={c.textMuted}>
              from <Txt variant="title" color={c.aquaSoft}>{formatCurrency(from)}</Txt>
            </Txt>
            <View style={styles.bookMini}>
              <Txt variant="label" color={c.white}>
                Book
              </Txt>
              <Ionicons name="arrow-forward" size={13} color={c.white} />
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const useStyles = makeStyles((c) => ({
  featured: {
    width: 300,
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  floatBadge: {
    backgroundColor: 'rgba(4,6,15,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,211,238,0.14)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
  },
  featuredBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  row: {
    marginBottom: spacing.md,
  },
  rowInner: {
    flexDirection: 'row',
    padding: 10,
    gap: 12,
  },
  thumbWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(4,6,15,0.7)',
  },
  rowContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: c.textFaint,
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(34,211,238,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
}));
