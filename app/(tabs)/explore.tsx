import React, { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, Chip, CompanyRow, GlassCard } from '@/components';
import { COMPANIES } from '@/data/companies';

const SORTS = [
  { key: 'rating', label: 'Top rated', icon: 'star' },
  { key: 'distance', label: 'Nearest', icon: 'navigate' },
  { key: 'price', label: 'Cheapest', icon: 'pricetag' },
  { key: 'open', label: 'Open now', icon: 'time' },
] as const;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<string>('rating');

  const results = useMemo(() => {
    let list = COMPANIES.filter((company) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        company.name.toLowerCase().includes(q) ||
        company.area.toLowerCase().includes(q) ||
        company.tags.some((t) => t.toLowerCase().includes(q)) ||
        company.services.some((s) => s.name.toLowerCase().includes(q))
      );
    });
    if (sort === 'open') list = list.filter((company) => company.open);
    const priceOf = (company: (typeof COMPANIES)[number]) => Math.min(...company.services.map((s) => s.basePrice));
    list = [...list].sort((a, b) => {
      if (sort === 'distance') return a.distanceKm - b.distanceKm;
      if (sort === 'price') return priceOf(a) - priceOf(b);
      return b.rating - a.rating;
    });
    return list;
  }, [query, sort]);

  return (
    <Screen>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg }}>
        <Txt variant="hero">Explore</Txt>
        <Txt variant="body" color={c.textMuted} style={{ marginTop: 2 }}>
          {COMPANIES.length} car washes around you
        </Txt>

        <GlassCard style={styles.search} radius={radius.pill}>
          <View style={styles.searchInner}>
            <Ionicons name="search" size={19} color={c.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search wash, area or service"
              placeholderTextColor={c.textFaint}
              style={[styles.input, { color: c.text }]}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Ionicons name="close-circle" size={18} color={c.textMuted} onPress={() => setQuery('')} />
            )}
          </View>
        </GlassCard>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {SORTS.map((s) => (
            <Chip key={s.key} label={s.label} icon={s.icon as any} active={sort === s.key} onPress={() => setSort(s.key)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 130 }}
      >
        {results.length === 0 ? (
          <GlassCard padded style={{ marginTop: 40, alignItems: 'center' }}>
            <Ionicons name="sad-outline" size={40} color={c.textMuted} />
            <Txt variant="h3" style={{ marginTop: 10 }}>
              No matches
            </Txt>
            <Txt variant="caption" color={c.textMuted} center style={{ marginTop: 4 }}>
              Try a different service or area name
            </Txt>
          </GlassCard>
        ) : (
          results.map((company) => <CompanyRow key={company.id} company={company} />)
        )}
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  search: {
    marginTop: spacing.lg,
    padding: 0,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  chips: {
    gap: 9,
    paddingVertical: spacing.lg,
  },
}));
