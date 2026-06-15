import * as React from 'react';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridFormulaColumnHeaderLetter } from '../../../components/GridFormulaColumnHeaderLetter';

/**
 * Premium implementation of the `useColumnHeaderAdornment` configuration hook:
 * the A1 column-letter shown next to each data column's header title.
 *
 * Returns `null` (and so renders nothing, and crucially does not subscribe to
 * the position context) whenever A1 notation is inactive, so the common
 * feature-off path adds no header re-renders. The subscription lives inside
 * `GridFormulaColumnHeaderLetter`, which only mounts when A1 is active.
 */
export function useGridFormulaColumnHeaderAdornment(field: string): React.ReactNode {
  const rootProps = useGridRootProps();
  const a1Active =
    rootProps.formulaA1Notation && !rootProps.disableFormulas && !rootProps.dataSource;
  if (!a1Active) {
    return null;
  }
  return <GridFormulaColumnHeaderLetter field={field} />;
}
