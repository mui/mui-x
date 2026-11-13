import type * as React from 'react';
import type { ChartsTypeFeatureFlags } from './featureFlags';

/**
 * The event a click callback receives.
 *
 * It only describes the pointer event by default. Add
 * `import type {} from '@mui/x-charts/moduleAugmentation/keyboardActivation'` to also get the
 * `KeyboardEvent` fired by the `keyboardActivation` experimental feature.
 */
export type ChartsActivationEvent<Element = never> =
  | ([Element] extends [never] ? MouseEvent : React.MouseEvent<Element, MouseEvent>)
  // The optional keyboard augmentation adds this property only in consumers that import it.
  | (ChartsTypeFeatureFlags extends { keyboardActivationOverride: infer KeyboardActivationEvent }
      ? KeyboardActivationEvent
      : never);
