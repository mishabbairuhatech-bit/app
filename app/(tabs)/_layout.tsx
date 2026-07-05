import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigationRoute, ParamListBase } from '@react-navigation/native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors, gradients, makeStyles, useTheme } from '@/theme';
import { LIQUID_GLASS } from '@/lib/liquidGlass';
import { Txt } from '@/components';

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  explore: { on: 'search', off: 'search-outline', label: 'Search' },
  map: { on: 'map', off: 'map-outline', label: 'Map' },
  bookings: { on: 'calendar', off: 'calendar-outline', label: 'Bookings' },
  profile: { on: 'person', off: 'person-outline', label: 'Profile' },
};

function haptic() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();

  const renderTab = (route: NavigationRoute<ParamListBase, string>, index: number) => {
    const meta = ICONS[route.name];
    if (!meta) return null;
    const focused = state.index === index;
    const onPress = () => {
      haptic();
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    return (
      <Pressable key={route.key} onPress={onPress} style={styles.tab}>
        {focused && <LinearGradient colors={gradients.water} style={styles.activePill} />}
        <Ionicons name={focused ? meta.on : meta.off} size={22} color={focused ? c.white : c.textMuted} />
        <Txt variant="tiny" color={focused ? c.white : c.textMuted} style={{ marginTop: 3 }}>
          {meta.label}
        </Txt>
      </Pressable>
    );
  };

  // Route order: [index, explore, bookings, profile] → split around the center FAB.
  const routes = state.routes.filter((r) => ICONS[r.name]);
  const left = routes.slice(0, 2);
  const right = routes.slice(2);
  const indexOf = (r: NavigationRoute<ParamListBase, string>) => state.routes.findIndex((x) => x.key === r.key);

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12), pointerEvents: 'box-none' }]}>
      <View style={styles.barContainer}>
        <BlurView
          intensity={50}
          tint={c.blurTint}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          style={styles.bar}
        >
          <LinearGradient colors={c.cardGradient} style={StyleSheet.absoluteFill} />
          {left.map((r) => renderTab(r, indexOf(r)))}
          <View style={styles.tab} />
          {right.map((r) => renderTab(r, indexOf(r)))}
        </BlurView>

        {/* Raised center "Book" action */}
        <Pressable
          onPress={() => {
            haptic();
            router.push('/explore');
          }}
          style={({ pressed }) => [styles.fabWrap, pressed && { opacity: 0.9, transform: [{ scale: 0.94 }] }]}
        >
          <View style={styles.fabHalo} />
          <LinearGradient colors={gradients.water} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
            <Ionicons name="add" size={30} color={c.white} />
          </LinearGradient>
          <Txt variant="tiny" color={c.aquaSoft} style={styles.fabLabel}>
            Book
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Real iOS 26 Liquid Glass tab bar via Expo Router native tabs — the exact
 * native effect Expo Go itself uses. SF Symbols mean no custom icon assets are
 * needed, and leaving `backgroundColor` unset lets the system glass material
 * (with its refraction/lensing) show through. `tintColor` colours the selected
 * tab with the brand accent.
 */
function NativeLiquidTabs() {
  return (
    <NativeTabs tintColor={colors.indigo}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <Label>Map</Label>
        <Icon sf={{ default: 'map', selected: 'map.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookings">
        <Label>Bookings</Label>
        <Icon sf={{ default: 'calendar', selected: 'calendar' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Label>Search</Label>
        <Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/** Custom glass bar (with the raised center "Book" FAB) used as the fallback. */
function CustomGlassTabs() {
  const { c } = useTheme();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg } }}
      tabBar={(props) => <GlassTabBar {...(props as unknown as BottomTabBarProps)} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}

/**
 * iOS 26+ gets the native Liquid Glass bar; Android and iOS < 26 keep the
 * custom branded bar with the center FAB. `LIQUID_GLASS` is resolved once at
 * module load so the navigator type stays stable across renders.
 */
export default function TabsLayout() {
  return LIQUID_GLASS ? <NativeLiquidTabs /> : <CustomGlassTabs />;
}

const FAB_SIZE = 64;

const useStyles = makeStyles((c) => ({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    position: 'relative',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.glassBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    backgroundColor: c.tabBarBg,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
  },
  activePill: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 8,
    right: 8,
    borderRadius: 18,
    opacity: 0.22,
  },
  fabWrap: {
    position: 'absolute',
    left: '50%',
    top: -26,
    marginLeft: -32,
    width: FAB_SIZE,
    alignItems: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: c.fabBorder,
    shadowColor: c.aqua,
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },
  fabHalo: {
    position: 'absolute',
    top: -4,
    width: FAB_SIZE + 12,
    height: FAB_SIZE + 12,
    borderRadius: (FAB_SIZE + 12) / 2,
    backgroundColor: 'rgba(34,211,238,0.18)',
  },
  fabLabel: {
    marginTop: 3,
  },
}));
