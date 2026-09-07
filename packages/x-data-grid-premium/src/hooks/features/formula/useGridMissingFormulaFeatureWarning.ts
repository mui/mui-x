'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

/**
 * Dev-only diagnostic for grids that use formula-related props without
 * providing the formula feature through `featureDependencies`. Deliberately
 * kept free of any formula-runtime import — it is bundled with the grid and
 * runs precisely when the feature is absent.
 */
export function useGridMissingFormulaFeatureWarning(
  props: DataGridPremiumProcessedProps,
  hasFormulaFeature: boolean,
) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production' || hasFormulaFeature) {
      return;
    }
    const usesFormulaProps =
      !!props.formulaA1Notation ||
      !!props.disableFormulaAutocomplete ||
      props.formulaFunctions !== undefined ||
      !!props.slotProps?.toolbar?.formulaBar ||
      props.columns?.some((column) => column.allowFormulas === true) === true;
    if (usesFormulaProps) {
      warnOnce([
        'MUI X Data Grid: Formula-related props were provided, but the formula feature is missing.',
        'Without it, `=` cell values render as raw strings and the formula props have no effect.',
        'Import the feature from `@mui/x-data-grid-premium/formula` and pass it to the grid:',
        '`<DataGridPremium featureDependencies={{ formula: formulaFeature }} />`.',
        'See https://mui.com/x/react-data-grid/formulas/.',
      ]);
    }
  }, [
    hasFormulaFeature,
    props.formulaA1Notation,
    props.disableFormulaAutocomplete,
    props.formulaFunctions,
    props.slotProps,
    props.columns,
  ]);
}
