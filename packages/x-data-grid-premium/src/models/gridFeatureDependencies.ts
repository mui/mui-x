import type * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridStateInitializer } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from './gridApiPremium';
import type { DataGridPremiumProps, DataGridPremiumProcessedProps } from './dataGridPremiumProps';

/**
 * The injectable runtime of the formula feature.
 * The grid only holds type-level references to the feature — the implementation
 * is imported from `@mui/x-data-grid-premium/formula` and passed through the
 * `featureDependencies` prop, so grids that do not use formulas do not bundle
 * the formula engine, editor and components.
 */
export interface GridFormulaFeature {
  /**
   * Initializes the `formula` state slice and the internal evaluation cache,
   * and runs the initial evaluation pass.
   * Wired after the rows state initializer — the initial pass reads the rows lookup.
   */
  stateInitializer: GridStateInitializer<
    Pick<DataGridPremiumProcessedProps, 'formulaFunctions' | 'disableFormulas' | 'dataSource'>,
    GridPrivateApiPremium
  >;
  /**
   * Registers the `hydrateColumns` pipe processor that wraps `allowFormulas`
   * columns and injects the A1 row-number column.
   * Wired before the column pinning pre-processors.
   */
  usePreProcessors: (
    apiRef: RefObject<GridPrivateApiPremium>,
    props: DataGridPremiumProcessedProps,
  ) => void;
  /**
   * The main feature hook: event handlers, private API methods and effects.
   * Wired before `useGridFilter`/`useGridSorting` — the formula `rowsSet`
   * handler must run before filtering and sorting read cell values.
   */
  useFeature: (
    apiRef: RefObject<GridPrivateApiPremium>,
    props: DataGridPremiumProcessedProps,
  ) => void;
  /**
   * The `useColumnHeaderAdornment` configuration hook implementation:
   * the A1 column-letter adornment next to each column header title.
   */
  useColumnHeaderAdornment: (field: string) => React.ReactNode;
  /**
   * The reference-highlight overlay, rendered as a child of the grid root.
   */
  ReferenceOverlay: React.ComponentType;
  /**
   * The formula bar, rendered by the default toolbar when
   * `slotProps.toolbar.formulaBar` is `true`.
   */
  FormulaBar: React.ComponentType;
  /**
   * Transforms the themed props before defaults are applied — pins the A1
   * row-number column to the left when A1 notation is active.
   * @param {DataGridPremiumProps} themedProps The themed props.
   * @returns {Partial<DataGridPremiumProps> | null} Prop overrides, or `null` when none apply.
   */
  transformProps: (themedProps: DataGridPremiumProps) => Partial<DataGridPremiumProps> | null;
}

/**
 * Injectable feature implementations, keyed by feature.
 * See {@link GridFormulaFeature}.
 */
export interface GridPremiumFeatureDependencies {
  /**
   * The formula feature runtime, imported from `@mui/x-data-grid-premium/formula`.
   */
  formula?: GridFormulaFeature;
}
