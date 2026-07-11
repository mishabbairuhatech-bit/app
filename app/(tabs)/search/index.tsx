import { CompanyRow, GlassHeader, Screen } from '@/components';
import { COMPANIES } from '@/data/companies';
import { spacing } from '@/theme';
import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

export default function SearchScreen() {
  // Height the floating glass header reports back, so content clears it.
  const [headerH, setHeaderH] = useState(120);

  const results = useMemo(() => [...COMPANIES].sort((a, b) => b.rating - a.rating), []);

  return (
    <Screen>
      {/* This tab hosts its own floating glass header instead of a nav bar. */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: headerH + spacing.md,
          paddingBottom: 130,
        }}
      >
        {results.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </ScrollView>

      <GlassHeader title="Search" onHeight={setHeaderH} />
    </Screen>
  );
}
