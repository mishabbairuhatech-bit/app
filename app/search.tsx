import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, makeStyles, useTheme } from '@/theme';
import { Screen, Txt, CompanyRow, GlassCard } from '@/components';
import { COMPANIES } from '@/data/companies';

// expo-speech-recognition is a native module, so it's absent in Expo Go. Load it
// defensively: importing it statically would throw at module load and crash the
// whole route. If it's missing, the mic degrades to a "needs a dev build" notice.
let SpeechModule: any = null;
let useSpeechEvent: (...args: any[]) => void = () => {};
try {
  const mod = require('expo-speech-recognition');
  SpeechModule = mod.ExpoSpeechRecognitionModule;
  useSpeechEvent = mod.useSpeechRecognitionEvent;
} catch {
  // Native module unavailable (e.g. Expo Go) — voice search stays disabled.
}
const SPEECH_AVAILABLE = !!SpeechModule;

// Ionicons glyphs ignore fontWeight, so thicken the strokes with a matching-
// colour text shadow to give the icons a bolder weight.
const boldIcon = (color: string) => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 0.7,
});

/**
 * Standalone search page (pushed as a stack route). Mirrors the Explore tab's
 * search/sort behaviour but keeps the search input pinned to the bottom of the
 * screen, with results scrolling above it. Reached from the "Search washes"
 * card in the Account menu.
 */
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { c } = useTheme();
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [kbHeight, setKbHeight] = useState(0);
  const [headerH, setHeaderH] = useState(insets.top + 72);

  // Track the keyboard height so the results list can pad its bottom and scroll
  // its content clear of the keyboard (and the search bar above it).
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvt, (e) => setKbHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvt, () => setKbHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Voice search — mirror the recognizer lifecycle into `listening`, and pipe
  // the (interim + final) transcript straight into the query. No-ops in Expo Go.
  useSpeechEvent('start', () => setListening(true));
  useSpeechEvent('end', () => setListening(false));
  useSpeechEvent('result', (e: any) => {
    const transcript = e.results?.[0]?.transcript;
    if (transcript) setQuery(transcript);
  });
  useSpeechEvent('error', (e: any) => {
    setListening(false);
    if (e.error !== 'aborted' && e.error !== 'no-speech') {
      Alert.alert('Voice search unavailable', e.message || 'Please try again.');
    }
  });

  const toggleMic = useCallback(async () => {
    if (!SPEECH_AVAILABLE) {
      Alert.alert(
        'Voice search needs a dev build',
        'Speech recognition isn’t available in Expo Go. Run a development build (npx expo run:ios) to use the mic.',
      );
      return;
    }
    if (listening) {
      SpeechModule.stop();
      return;
    }
    if (!SpeechModule.isRecognitionAvailable()) {
      Alert.alert('Voice search unavailable', 'Speech recognition is not available on this device.');
      return;
    }
    const perm = await SpeechModule.requestPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Microphone access needed', 'Enable microphone & speech recognition in Settings to search by voice.');
      return;
    }
    Keyboard.dismiss();
    SpeechModule.start({ lang: 'en-US', interimResults: true, continuous: false });
  }, [listening]);

  // GlassCard ignores `flex: 1` for width on iOS 26 glass, so size the search
  // pill explicitly. There's always one side button — the home button (left)
  // when the keyboard is closed, or the close button (right) when it's open —
  // so reserve one 44px button + gap in both states.
  const BTN_W = 44;
  const ROW_GAP = 10;
  const searchWidth = width - spacing.lg * 2 - (ROW_GAP + BTN_W);

  const results = useMemo(() => {
    const list = COMPANIES.filter((company) => {
      const q = query.trim().toLowerCase();
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
      <View
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
        }}
      >
        <Txt variant="hero">Search</Txt>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: headerH + spacing.md, paddingBottom: kbHeight + 110 }}
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

      {/* Fixed bottom search input — rises with the keyboard, with a gap above it */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={6}
        style={styles.kav}
      >
        <View style={[styles.bottomBar, { paddingBottom: focused ? 8 : Math.max(insets.bottom, 12) }]}>
        {/* Detached liquid-glass home button — shown when the keyboard is closed */}
        {!focused && (
          <GlassCard onPress={() => router.navigate('/')} radius={22} style={styles.sideBtn}>
            <View style={styles.sideBtnInner}>
              <Ionicons name="home" size={20} color={c.white} style={boldIcon(c.white)} />
            </View>
          </GlassCard>
        )}

        <GlassCard style={[styles.search, { width: searchWidth }]} radius={radius.pill}>
          <View style={[styles.searchInner, { width: searchWidth }]}>
            <Ionicons name="search" size={20} color={c.white} style={boldIcon(c.white)} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search wash, area or service"
              placeholderTextColor={c.textMuted}
              style={[styles.input, { color: c.text }]}
              returnKeyType="search"
              autoFocus
            />
            {!listening && query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8} style={styles.clearBtn}>
                <Ionicons name="close" size={12} color={c.bgDeep} style={boldIcon(c.bgDeep)} />
              </Pressable>
            ) : (
              <Pressable onPress={toggleMic} hitSlop={8} style={styles.micBtn}>
                {/* Icon stays white; a subtle aqua halo signals active recording. */}
                <Ionicons name="mic" size={22} color={c.white} style={boldIcon(listening ? c.aqua : c.white)} />
              </Pressable>
            )}
          </View>
        </GlassCard>

        {/* Detached liquid-glass button — closes the input (dismisses the keyboard) */}
        {focused && (
          <GlassCard onPress={() => Keyboard.dismiss()} radius={22} style={styles.sideBtn}>
            <View style={styles.sideBtnInner}>
              <Ionicons name="close" size={24} color={c.white} style={boldIcon(c.white)} />
            </View>
          </GlassCard>
        )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  kav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  search: {
    padding: 0,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  clearBtn: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: c.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtn: {
    width: 44,
    height: 44,
  },
  sideBtnInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
