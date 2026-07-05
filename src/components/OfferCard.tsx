import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { radius, shadow, useTheme } from '@/theme';
import { Offer } from '@/types';
import { Txt } from './Txt';

export function OfferCard({ offer, wide, onPress }: { offer: Offer; wide?: boolean; onPress?: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}>
      <LinearGradient
        colors={offer.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, wide ? styles.wide : styles.compact, shadow.card]}
      >
        {/* decorative rings */}
        <View style={styles.ring} />
        <View style={styles.ring2} />

        <View style={styles.head}>
          <View style={styles.iconWrap}>
            <Ionicons name={offer.icon as any} size={18} color={c.white} />
          </View>
          <View style={styles.discountPill}>
            <Txt variant="tiny" color={c.white}>
              {offer.discountLabel}
            </Txt>
          </View>
        </View>

        <View style={{ marginTop: wide ? 14 : 10 }}>
          <Txt variant={wide ? 'h2' : 'h3'} color={c.white} numberOfLines={2}>
            {offer.title}
          </Txt>
          <Txt variant="caption" color="rgba(255,255,255,0.85)" numberOfLines={1} style={{ marginTop: 3 }}>
            {offer.subtitle}
          </Txt>
        </View>

        <View style={styles.footer}>
          <View style={styles.code}>
            <Ionicons name="pricetag" size={12} color={c.white} />
            <Txt variant="label" color={c.white}>
              {offer.code}
            </Txt>
          </View>
          <Txt variant="tiny" color="rgba(255,255,255,0.8)">
            Ends {offer.expires}
          </Txt>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  compact: {
    width: 260,
    height: 150,
  },
  wide: {
    width: '100%',
    minHeight: 160,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountPill: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 26,
    borderColor: 'rgba(255,255,255,0.10)',
    top: -70,
    right: -40,
  },
  ring2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    right: 40,
  },
});
