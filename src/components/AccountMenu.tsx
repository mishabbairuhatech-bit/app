import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { makeStyles, useTheme } from '@/theme';
import { PAYMENT_METHODS } from '@/data/user';
import { GlassCard } from './GlassCard';
import { Txt } from './Txt';

interface MenuEntry {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  href?: Href;
}

const MENU: MenuEntry[] = [
  { icon: 'search-outline', label: 'Search washes', hint: 'Find nearby', href: '/search' },
  { icon: 'card-outline', label: 'Payment methods', hint: `${PAYMENT_METHODS.length} saved` },
  { icon: 'gift-outline', label: 'Rewards & offers', hint: 'Gold tier' },
  { icon: 'location-outline', label: 'Saved addresses' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'help-buoy-outline', label: 'Help & support' },
  { icon: 'settings-outline', label: 'Settings' },
];

/**
 * The "Account" list of glass menu cards (payment methods, rewards, settings…).
 * Shared by the Profile screen and the Explore screen so both stay in sync.
 */
export function AccountMenu() {
  const { c } = useTheme();
  const styles = useStyles();
  const router = useRouter();
  return (
    <View style={{ gap: 10 }}>
      {MENU.map((m) => (
        <GlassCard
          key={m.label}
          onPress={() => m.href && router.push(m.href)}
          style={styles.menuItem}
        >
          <View style={styles.menuInner}>
            <View style={styles.menuIcon}>
              <Ionicons name={m.icon} size={19} color={c.aquaSoft} />
            </View>
            <Txt variant="title" style={{ flex: 1 }}>
              {m.label}
            </Txt>
            {m.hint && (
              <Txt variant="caption" color={c.textMuted}>
                {m.hint}
              </Txt>
            )}
            <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  menuItem: {
    padding: 0,
  },
  menuInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
