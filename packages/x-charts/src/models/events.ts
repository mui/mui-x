import type * as React from 'react';
import type { HasProperty } from '@mui/x-internals/types';
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
  | (HasProperty<ChartsTypeFeatureFlags, 'keyboardActivationOverride'> extends true
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- The optional keyboard augmentation adds this property only in consumers that import it.
        // @ts-ignore The optional keyboard augmentation adds this property only in consumers that import it.
        ChartsTypeFeatureFlags['keyboardActivationOverride']
      : never);
