import type {
  GridColDef,
  GridSingleSelectColDef,
  ValueOptions,
} from '../../../models/colDef/gridColDef';

export function isSingleSelectColDef(colDef: GridColDef | null): colDef is GridSingleSelectColDef {
  return colDef?.type === 'singleSelect';
}

export function getValueOptions(column: GridSingleSelectColDef) {
  if (!column) {
    return undefined;
  }
  return typeof column.valueOptions === 'function'
    ? column.valueOptions({ field: column.field })
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

export const getLabelFromValueOption = (valueOption: ValueOptions) => {
  const label = typeof valueOption === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};
