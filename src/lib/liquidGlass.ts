import { Platform } from 'react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

/**
 * Whether the OS provides Apple's native Liquid Glass material (iOS 26+).
 *
 * Device capability is fixed for the lifetime of the process, so we resolve it
 * once here and import the constant wherever we branch between the real glass
 * material (`GlassView` / native tabs) and the `expo-blur` + gradient fallback.
 * Resolving once also keeps navigator/component types stable across renders.
 */
export const LIQUID_GLASS: boolean = (() => {
  try {
    return Platform.OS === 'ios' && isLiquidGlassAvailable();
  } catch {
    return false;
  }
})();
