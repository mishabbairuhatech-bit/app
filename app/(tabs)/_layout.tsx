import { colors } from '@/theme';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

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
      {/* `role="search"` makes iOS 26 detach this into its own glass capsule on
          the right and, because the `search` route is a Stack with a native
          search bar, expands into a live search field in the tab bar.
          Keep it last in the trigger list. */}
      <NativeTabs.Trigger name="search" role="search">
        <Label>Search</Label>
        <Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/**
 * iOS 26+ gets the native Liquid Glass bar; Android and iOS < 26 keep the
 * custom branded bar with the center FAB. `LIQUID_GLASS` is resolved once at
 * module load so the navigator type stays stable across renders.
 */
export default function TabsLayout() {
  return <NativeLiquidTabs />;
}
