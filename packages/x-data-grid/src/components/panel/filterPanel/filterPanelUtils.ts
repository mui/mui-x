import type {
  GridColDef,
  GridSingleSelectColDef,
  ValueOptions,
} from '../../../models/colDef/gridColDef';
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
  valueOptions: ValueOptions[] | undefined,
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>,
) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });

  if (result === undefined) {
    return undefined;
  }

  return getOptionValue(result);
}

/**
 * Find the option matching the given value in valueOptions and get its label
 * @param {string} value is used to extract label from valueOptions.
 * @param {ValueOptions[] | undefined} valueOptions is used to extract label.
 * @param {NonNullable<GridSingleSelectColDef['getOptionLabel']>} getOptionLabel is used to get label from valueOption
 * @param {NonNullable<GridSingleSelectColDef['getOptionValue']>} getOptionValue is used to get value from valueOption
 * @returns {string | undefined} The label matching with the value.
 */
export function getLabelFromValueOptions(
  value: string,
  valueOptions: ValueOptions[] | undefined,
  getOptionLabel: NonNullable<GridSingleSelectColDef['getOptionLabel']> = (
    valueOption: ValueOptions,
  ) => (typeof valueOption === 'object' ? valueOption.label : valueOption),
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']> = (
    valueOption: ValueOptions,
  ) => (typeof valueOption === 'object' ? valueOption.value : valueOption),
) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });

  if (result === undefined) {
    return undefined;
  }

  return getOptionLabel(result);
}
