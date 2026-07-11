import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, GlassCard, GlassHeader, Rating } from '@/components';
import { COMPANIES } from '@/data/companies';
import { formatCurrency } from '@/lib/pricing';
import type { Company } from '@/types';

const CANVAS_HEIGHT = 380;

// The data has no real coordinates, so we derive a stable pseudo-position for
// each wash from its id (angle) and distance (radius from the "you" marker in
// the centre). Deterministic — same layout on every render.
function hashAngle(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return (h / 360) * Math.PI * 2;
}

function usePins() {
  return useMemo(() => {
    const maxKm = Math.max(...COMPANIES.map((co) => co.distanceKm));
    return COMPANIES.map((co) => {
      const angle = hashAngle(co.id);
      // Normalise distance to 18%–42% of the canvas radius.
      const r = 0.18 + (co.distanceKm / maxKm) * 0.24;
      return {
        company: co,
        x: 0.5 + Math.cos(angle) * r,
        y: 0.5 + Math.sin(angle) * r * 0.82,
      };
    });
  }, []);
}

export default function MapScreen() {
  const { c } = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const pins = usePins();
  const [selectedId, setSelectedId] = useState<string>(COMPANIES[0]?.id ?? '');
  const [headerH, setHeaderH] = useState(120);

  const selected = COMPANIES.find((co) => co.id === selectedId);
  const nearby = useMemo(() => [...COMPANIES].sort((a, b) => a.distanceKm - b.distanceKm), []);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.md, paddingBottom: 130 }}
      >
        {/* Stylised map canvas */}
        <GlassCard radius={radius.xl} style={styles.canvasCard}>
          <View style={styles.canvas}>
            <LinearGradient
              colors={['rgba(34,211,238,0.10)', 'rgba(99,102,241,0.06)', 'rgba(4,6,15,0.35)']}
              style={StyleSheet.absoluteFill}
            />
            {/* Grid lines to read as a map */}
            {[0.25, 0.5, 0.75].map((p) => (
              <View key={`h${p}`} style={[styles.gridLine, styles.gridH, { top: `${p * 100}%` }]} />
            ))}
            {[0.25, 0.5, 0.75].map((p) => (
              <View key={`v${p}`} style={[styles.gridLine, styles.gridV, { left: `${p * 100}%` }]} />
            ))}

            {/* "You are here" marker with radar rings */}
            <View style={styles.youWrap} pointerEvents="none">
              <View style={styles.radarRingOuter} />
              <View style={styles.radarRingInner} />
              <View style={styles.youDot}>
                <View style={styles.youCore} />
              </View>
            </View>

            {/* Company pins */}
            {pins.map(({ company, x, y }) => {
              const active = company.id === selectedId;
              return (
                <Pressable
                  key={company.id}
                  onPress={() => setSelectedId(company.id)}
                  style={[styles.pin, { left: `${x * 100}%`, top: `${y * 100}%` }]}
                  hitSlop={8}
                >
                  <View style={[styles.pinBubble, active && styles.pinBubbleActive]}>
                    {active ? (
                      <Image source={{ uri: company.logo }} style={styles.pinImg} contentFit="cover" />
                    ) : (
                      <Ionicons name="water" size={13} color={company.open ? c.aqua : c.textMuted} />
                    )}
                  </View>
                  <View style={[styles.pinStem, active && { backgroundColor: c.aqua }]} />
                </Pressable>
              );
            })}
          </View>

          {/* Selected wash preview docked at the bottom of the canvas */}
          {selected && <MapPreview company={selected} onOpen={() => router.push(`/company/${selected.id}`)} />}
        </GlassCard>

        <Txt variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
          Nearest to you
        </Txt>
        {nearby.map((company) => {
          const active = company.id === selectedId;
          return (
            <Pressable key={company.id} onPress={() => setSelectedId(company.id)}>
              <GlassCard radius={radius.lg} style={[styles.nearRow, active && styles.nearRowActive]}>
                <View style={styles.nearInner}>
                  <View style={styles.nearIcon}>
                    <Ionicons name="location" size={16} color={active ? c.aqua : c.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt variant="title" numberOfLines={1}>
                      {company.name}
                    </Txt>
                    <Txt variant="caption" color={c.textMuted} numberOfLines={1}>
                      {company.area} · {company.distanceKm} km · {company.etaMin} min
                    </Txt>
                  </View>
                  <View style={[styles.openPill, { backgroundColor: company.open ? 'rgba(52,211,153,0.16)' : c.glass }]}>
                    <Txt variant="tiny" color={company.open ? c.success : c.textMuted}>
                      {company.open ? 'OPEN' : 'CLOSED'}
                    </Txt>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          );
        })}
      </ScrollView>

      <GlassHeader
        title="Map"
        subtitle={`${COMPANIES.length} washes near your location`}
        onHeight={setHeaderH}
      />
    </Screen>
  );
}

function MapPreview({ company, onOpen }: { company: Company; onOpen: () => void }) {
  const { c } = useTheme();
  const styles = useStyles();
  const from = Math.min(...company.services.map((s) => s.basePrice));
  return (
    <Pressable onPress={onOpen} style={styles.preview}>
      <Image source={{ uri: company.image }} style={styles.previewImg} contentFit="cover" transition={200} />
      <View style={{ flex: 1 }}>
        <Txt variant="title" numberOfLines={1}>
          {company.name}
        </Txt>
        <View style={styles.previewMeta}>
          <Rating value={company.rating} count={company.reviewCount} />
          <View style={styles.previewDot} />
          <Txt variant="caption" color={c.textMuted}>
            {company.distanceKm} km away
          </Txt>
        </View>
        <Txt variant="label" color={c.textMuted} style={{ marginTop: 2 }}>
          from <Txt variant="title" color={c.aquaSoft}>{formatCurrency(from)}</Txt>
        </Txt>
      </View>
      <View style={styles.previewGo}>
        <Ionicons name="arrow-forward" size={18} color={c.white} />
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  canvasCard: {
    padding: 0,
    overflow: 'hidden',
  },
  canvas: {
    height: CANVAS_HEIGHT,
    width: '100%',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(148,163,184,0.10)',
  },
  gridH: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  youWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRingOuter: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
    backgroundColor: 'rgba(34,211,238,0.04)',
  },
  radarRingInner: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.28)',
  },
  youDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(34,211,238,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: c.aqua,
    borderWidth: 2,
    borderColor: c.white,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -17,
    marginTop: -40,
  },
  pinBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: c.bgElevated,
    borderWidth: 1.5,
    borderColor: c.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pinBubbleActive: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderColor: c.aqua,
    borderWidth: 2,
    marginTop: -8,
  },
  pinImg: {
    width: '100%',
    height: '100%',
  },
  pinStem: {
    width: 2,
    height: 8,
    backgroundColor: c.glassBorder,
    marginTop: -1,
  },
  preview: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: radius.lg,
    backgroundColor: c.tabBarBg,
    borderWidth: 1,
    borderColor: c.glassBorder,
  },
  previewImg: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  previewDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: c.textFaint,
  },
  previewGo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearRow: {
    marginBottom: spacing.sm,
  },
  nearRowActive: {
    borderColor: c.aqua,
  },
  nearInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  nearIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: c.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
}));
