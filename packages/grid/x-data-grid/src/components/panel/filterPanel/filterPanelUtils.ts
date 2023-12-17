import type { GridColDef, GridSingleSelectColDef } from '../../../models/colDef/gridColDef';
import type { GridValueOptionsParams } from '../../../models/params/gridValueOptionsParams';

export function isSingleSelectColDef(colDef: GridColDef | null): colDef is GridSingleSelectColDef {
  return colDef?.type === 'singleSelect';
}

export function getValueOptions(
  column: GridSingleSelectColDef,
  additionalParams?: Omit<GridValueOptionsParams, 'field'>,
) {
  if (!column) {
    return undefined;
  }
  return typeof column.valueOptions === 'function'
    ? column.valueOptions({ field: column.field, ...additionalParams })
    : column.valueOptions;
}

export function getValueFromValueOptions(
  value: string,
  valueOptions: any[] | undefined,
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>,
) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });
  return getOptionValue(result);
}
