import * as React from 'react';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { createSelector } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { gridComputedColumnsSelector } from '../computedColumns/gridComputedColumnsSelectors';
import { GridFormulaColumnHeaderLetter } from '../../../components/GridFormulaColumnHeaderLetter';
import { GridComputedColumnHeaderBadge } from '../../../components/GridComputedColumnHeaderBadge';

const gridHasComputedColumnsSelector = createSelector(
  gridComputedColumnsSelector,
  (model) => model.length > 0,
);

/**
 * Premium implementation of the `useColumnHeaderAdornment` configuration hook:
 * the `ƒx` badge of the computed columns, followed by the A1 column-letter
 * shown next to each data column's header title. The
 * adornment hook is used instead of wrapping `colDef.renderHeader` because
 * aggregation already reserves the `renderHeader` wrapping for its own header
 * decoration.
 *
 * Returns `null` (and so renders nothing, and crucially does not subscribe to
 * the position context) whenever A1 notation is inactive, so the common
 * feature-off path adds no header re-renders. The subscription lives inside
 * `GridFormulaColumnHeaderLetter`, which only mounts when A1 is active.
 * The badge only mounts when the model has computed columns.
 */
export function useGridFormulaColumnHeaderAdornment(field: string): React.ReactNode {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const hasComputedColumns = useGridSelector(apiRef, gridHasComputedColumnsSelector);
  const a1Active =
    rootProps.formulaA1Notation && !rootProps.disableFormulas && !rootProps.dataSource;
  if (!a1Active && !hasComputedColumns) {
    return null;
  }
  return (
    <React.Fragment>
      {hasComputedColumns && <GridComputedColumnHeaderBadge field={field} />}
      {a1Active && <GridFormulaColumnHeaderLetter field={field} />}
    </React.Fragment>
  );
}
