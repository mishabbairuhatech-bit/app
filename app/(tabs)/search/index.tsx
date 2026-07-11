import { CompanyRow, Screen } from '@/components';
import { COMPANIES } from '@/data/companies';
import { spacing } from '@/theme';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();

  const results = useMemo(() => [...COMPANIES].sort((a, b) => b.rating - a.rating), []);

  return (
    <Screen>
      {/* No header on this screen. */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          paddingBottom: 130,
        }}
      >
        {results.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </ScrollView>
    </Screen>
  );
}
