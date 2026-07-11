import { Stack } from 'expo-router';

/**
 * The Search tab needs its own Stack so iOS 26 can host a native search field.
 * Combined with `role="search"` on the tab trigger, the search bar renders as
 * the expanding capsule inside the Liquid Glass tab bar (the Apple Music look).
 */
export default function SearchLayout() {
  return <Stack />;
}
