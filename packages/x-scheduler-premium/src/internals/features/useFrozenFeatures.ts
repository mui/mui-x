'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';

function hasChanged<TFeatures extends object>(frozen: TFeatures, current: TFeatures) {
  const keys = new Set([...Object.keys(frozen), ...Object.keys(current)]);
  for (const key of keys) {
    if (frozen[key as keyof TFeatures] !== current[key as keyof TFeatures]) {
      return true;
    }
  }
  return false;
}

/**
 * Reads the features once, on mount, and derives the features of the store from them.
 * Warns in development when a feature changes afterwards.
 */
export function useFrozenFeatures<TFeatures extends object, TStoreFeatures>(
  features: TFeatures | undefined,
  componentName: string,
  deriveStoreFeatures: (features: TFeatures) => TStoreFeatures,
): { features: TFeatures; storeFeatures: TStoreFeatures } {
  const frozen = useLazyRef(() => {
    const value: TFeatures = features ?? (EMPTY_OBJECT as TFeatures);
    return { features: value, storeFeatures: deriveStoreFeatures(value) };
  }).current;

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      hasChanged(frozen.features, features ?? (EMPTY_OBJECT as TFeatures))
    ) {
      warnOnce(
        [
          `MUI X Scheduler: The \`features\` prop of <${componentName} /> changed after the first render.`,
          'The features are read once when the component mounts, so the change is ignored.',
          'Pass stable feature values, or remount the component (for example, with a `key`) to apply the change.',
        ].join('\n'),
      );
    }
  }, [frozen, features, componentName]);

  return frozen;
}
