'use client';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { gridClasses } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import {
  getFormulaColumnLetter,
  gridFormulaA1PositionContextSelector,
} from '../hooks/features/formula/gridFormulaPositionContext';

const GridFormulaColumnHeaderLetterRoot = styled('span', {
  name: 'MuiDataGrid',
  slot: 'FormulaColumnHeaderLetter',
})(({ theme }) => ({
  flexShrink: 0,
  marginInlineEnd: theme.spacing(0.75),
  color: theme.palette.text.disabled,
  fontSize: theme.typography.pxToRem(11),
  fontWeight: theme.typography.fontWeightMedium,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: 0.5,
  lineHeight: 1,
  userSelect: 'none',
}));

/**
 * Column-letter adornment (`A`, `B`, …) rendered in the header title container
 * next to the title, in a dimmed colour. Subscribes to the shared A1 position
 * context so the letters stay in sync on reorder/visibility changes. Hidden from
 * assistive tech (the letter is editor sugar, not column meaning) and blank for
 * columns with no position (utility/grouping/hidden).
 */
export function GridFormulaColumnHeaderLetter({ field }: { field: string }) {
  const apiRef = useGridApiContext();
  const positionContext = useGridSelector(apiRef, gridFormulaA1PositionContextSelector);
  const letter = getFormulaColumnLetter(positionContext, field);
  if (letter === '') {
    return null;
  }
  return (
    <GridFormulaColumnHeaderLetterRoot
      aria-hidden
      className={gridClasses.formulaColumnHeaderLetter}
    >
      {letter}
    </GridFormulaColumnHeaderLetterRoot>
  );
}
