import type { HasProperty } from '@mui/x-internals/types';

export interface ChartsTypeFeatureFlags {}

/**
 * The event that activated an item.
 * Defaults to `MouseEvent`. Import `@mui/x-charts/moduleAugmentation/keyboardItemActivation`
 * to widen it to `MouseEvent | KeyboardEvent`, which is what is received at runtime since items
 * can also be activated with the Enter and Space keys.
 */
export type ItemActivationEvent =
  HasProperty<ChartsTypeFeatureFlags, 'itemActivationEvent'> extends true
    ? // @ts-ignore this property is added through module augmentation
      ChartsTypeFeatureFlags['itemActivationEvent']
    : MouseEvent;
