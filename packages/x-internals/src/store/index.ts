// TODO v10: remove. Published `@mui/x-*` 9.0.0 to 9.14.0 import this entry point.
// https://github.com/mui/mui-x/issues/23905
import { createSelectorMemoized as baseCreateSelectorMemoized } from '@base-ui/utils/store';

export {
  Store,
  createSelector,
  createSelectorMemoizedWithOptions,
  useStore,
} from '@base-ui/utils/store';
export type { CreateSelectorFunction, ReadonlyStore } from '@base-ui/utils/store';
export { useStoreEffect } from '../useStoreEffect';

// Base UI throws when the combiner has fewer parameters than input selectors. The old version
// accepted this, and `@mui/x-charts` 9.4.0 uses it, so give such a combiner the full length.
export const createSelectorMemoized = ((...items: unknown[]) => {
  const combiner = items[items.length - 1];
  const inputCount = items.length - 1;
  if (typeof combiner === 'function' && combiner.length > 0 && combiner.length < inputCount) {
    items[items.length - 1] = Object.defineProperty(
      (...values: unknown[]) => combiner(...values),
      'length',
      { value: inputCount },
    );
  }
  return (baseCreateSelectorMemoized as (...args: unknown[]) => unknown)(...items);
}) as typeof baseCreateSelectorMemoized;
