import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { gradients, makeStyles, useTheme } from '@/theme';
import { Service } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/pricing';
import { Txt } from './Txt';

export function ServiceCard({
  service,
  selected,
  onToggle,
}: {
  service: Service;
  selected: boolean;
  onToggle: () => void;
}) {
  const { c } = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onToggle();
      }}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && { opacity: 0.9 },
      ]}
    >
      <LinearGradient
        colors={selected ? ['rgba(34,211,238,0.16)', 'rgba(99,102,241,0.08)'] : c.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={selected ? gradients.water : c.cardGradient}
        style={styles.iconWrap}
      >
        <Ionicons name={service.icon as any} size={22} color={selected ? c.white : c.aquaSoft} />
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Txt variant="title" numberOfLines={1} style={{ flex: 1 }}>
            {service.name}
          </Txt>
          {service.popular && (
            <View style={styles.popular}>
              <Ionicons name="flame" size={10} color={c.warning} />
              <Txt variant="tiny" color={c.warning}>
                POPULAR
              </Txt>
            </View>
          )}
        </View>
        <Txt variant="caption" color={c.textMuted} numberOfLines={2} style={{ marginTop: 2 }}>
          {service.description}
        </Txt>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={13} color={c.textMuted} />
            <Txt variant="label" color={c.textSoft}>
              {formatDuration(service.durationMin)}
            </Txt>
          </View>
          <Txt variant="h3" color={selected ? c.aquaSoft : c.text}>
            {formatCurrency(service.basePrice)}
          </Txt>
        </View>
      </View>

      <View style={[styles.check, selected && styles.checkOn]}>
        {selected && <Ionicons name="checkmark" size={15} color={c.white} />}
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.glassBorderSoft,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  cardSelected: {
    borderColor: c.aqua,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popular: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251,191,36,0.14)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: c.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkOn: {
    backgroundColor: c.aqua,
    borderColor: c.aqua,
  },
}));
