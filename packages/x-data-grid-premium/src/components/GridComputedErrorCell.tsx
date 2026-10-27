'use client';
import type { GridLocaleText, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { FormulaErrorCode } from '../hooks/features/formula/engine';

type ComputedCellErrorLocaleKey = {
  [K in keyof GridLocaleText]: K extends `computedCellError${string}` ? K : never;
}[keyof GridLocaleText];

const ERROR_CODE_LOCALE_KEYS: Partial<Record<FormulaErrorCode, ComputedCellErrorLocaleKey>> = {
  '#DIV/0!': 'computedCellErrorDivByZero',
  '#VALUE!': 'computedCellErrorValue',
  '#REF!': 'computedCellErrorRef',
  '#NAME?': 'computedCellErrorName',
  '#CYCLE!': 'computedCellErrorCycle',
};

/**
 * The cell of a computed column whose formula evaluates to an error (D33):
 * the error code, with a tooltip telling the cause and how to fix it.
 */
export function GridComputedErrorCell(props: GridRenderCellParams) {
  const { row, field, value } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();

  const runtime = apiRef.current.caches.formula?.computedColumns;
  const record = runtime?.records.get(field);
  let title: string;
  if (record != null && record.staticResult?.type === 'error') {
    // The formula is invalid: the validation issue says more than the error code.
    title = record.staticResult.message ?? '';
  } else {
    // The result was memoized when the value of the cell was read.
    const result = runtime?.results.get(row)?.get(field);
    const localeKey =
      ERROR_CODE_LOCALE_KEYS[value as FormulaErrorCode] ?? 'computedCellErrorGeneric';
    const cause = apiRef.current.getLocaleText(localeKey);
    const engineMessage = result?.type === 'error' ? result.message : undefined;
    title = engineMessage ? `${cause} ${engineMessage}` : cause;
  }

  return (
    <rootProps.slots.baseTooltip
      title={title}
      material={{ describeChild: true }}
      {...rootProps.slotProps?.baseTooltip}
    >
      <span>{value}</span>
    </rootProps.slots.baseTooltip>
  );
}
