import type {
  GridColDef,
  GridSingleSelectColDef,
  ValueOptions,
} from '../../../models/colDef/gridColDef';

export function isSingleSelectColDef(colDef: GridColDef | null): colDef is GridSingleSelectColDef {
  return colDef?.type === 'singleSelect';
}

export function getValueFromOption(option: any | undefined) {
  if (typeof option === 'object' && option !== null) {
    return option.value;
  }
  return option;
}

export function getValueFromValueOptions(value: string, valueOptions?: any[]) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getValueFromOption(option);
    return String(optionValue) === String(value);
  });
  return getValueFromOption(result);
}

export const getLabelFromValueOption = (valueOption: ValueOptions) => {
  const label = typeof valueOption === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};
