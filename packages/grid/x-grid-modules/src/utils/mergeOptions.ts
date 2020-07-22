// We intentionally set the types to any to avoid circular deps
import { ColTypeDef, ColumnTypesRecord, DEFAULT_COL_TYPE_KEY } from '../models/colDef';

export function mergeOptions(defaultOptions: any, options?: any) {
  const defaultIcons = defaultOptions.icons;
  const optionsIcons = options?.icons;
  const mergedIcons = { ...defaultIcons, ...optionsIcons };
  const mergedColTypes = mergeColTypes(defaultOptions.columnTypes, options?.columnTypes);
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  mergedOptions.icons = mergedIcons;
  mergedOptions.columnTypes = mergedColTypes;
  return mergedOptions;
}

export function mergeColTypes(
  defaultColumnTypes: ColumnTypesRecord,
  optionsColTypes: ColumnTypesRecord,
): ColumnTypesRecord {
  const mergedColTypes = { ...defaultColumnTypes, ...optionsColTypes };
  const hydratedOptionColTypes: ColumnTypesRecord = {};

  Object.entries(mergedColTypes).forEach(([colType, colTypeDef]: [string, ColTypeDef]) => {
    if (colTypeDef.extendType) {
      colTypeDef = { ...mergedColTypes[colTypeDef.extendType], ...colTypeDef, type: colType };
    } else {
      colTypeDef = { ...mergedColTypes[DEFAULT_COL_TYPE_KEY], ...colTypeDef, type: colType };
    }
    hydratedOptionColTypes[colType] = colTypeDef;
  });

  return hydratedOptionColTypes;
}
