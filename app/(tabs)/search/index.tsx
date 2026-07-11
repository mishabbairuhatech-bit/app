import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { spacing } from '@/theme';
import { CompanyRow, Screen, Txt, GlassCard } from '@/components';
import { COMPANIES } from '@/data/companies';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

/**
 * Search tab. The search field is the *native* iOS search bar declared via
 * `headerSearchBarOptions`. On iOS 26 the `role="search"` tab (see the tabs
 * `_layout`) hoists it into the Liquid Glass tab bar as the expanding search
 * capsule; on older iOS it sits in the large-title navigation header. Its
 * `onChangeText` drives the live filtering below.
 */
export default function SearchScreen() {
  const { c } = useTheme();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COMPANIES.filter((company) => {
      if (!q) return true;
      return (
        company.name.toLowerCase().includes(q) ||
        company.area.toLowerCase().includes(q) ||
        company.tags.some((t) => t.toLowerCase().includes(q)) ||
        company.services.some((s) => s.name.toLowerCase().includes(q))
      );
    });
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [query]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Search',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placement: 'automatic',
            placeholder: 'Search wash, area or service',
            onChangeText: (e) => setQuery(e.nativeEvent.text),
          },
        }}
      />

      <ScrollView
        // Let the native header + search bar inset the content automatically.
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 130 }}
      >
        {results.length === 0 ? (
          <GlassCard padded style={styles.empty}>
            <Ionicons name="sad-outline" size={40} color={c.textMuted} />
            <Txt variant="h3" style={{ marginTop: 10 }}>
              No matches
            </Txt>
            <Txt variant="caption" color={c.textMuted} center style={{ marginTop: 4 }}>
              Try a different service or area name
            </Txt>
          </GlassCard>
        ) : (
          <View style={{ paddingTop: spacing.md }}>
            {results.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = {
  empty: {
    marginTop: 40,
    alignItems: 'center' as const,
  },
};
