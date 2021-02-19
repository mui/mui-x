import { GridColumnTypesRecord } from '../models/colDef/gridColTypeDef';
import { DEFAULT_GRID_COL_TYPE_KEY } from '../models/colDef/gridDefaultColumnTypes';

export function mergeGridColTypes(
  defaultColumnTypes: GridColumnTypesRecord,
  optionsColTypes: GridColumnTypesRecord,
): GridColumnTypesRecord {
  const mergedColTypes = { ...defaultColumnTypes, ...optionsColTypes };
  const hydratedOptionColTypes: GridColumnTypesRecord = {};

  Object.entries(mergedColTypes).forEach(([colType, colTypeDef]: [string, any]) => {
    if (colTypeDef.extendType) {
      colTypeDef = { ...mergedColTypes[colTypeDef.extendType], ...colTypeDef, type: colType };
    } else {
      colTypeDef = { ...mergedColTypes[DEFAULT_GRID_COL_TYPE_KEY], ...colTypeDef, type: colType };
    }
    hydratedOptionColTypes[colType] = colTypeDef;
  });

  return hydratedOptionColTypes;
}

export function removeUndefinedProps(options: Object) {
  const cleanedOptions = { ...options };
  Object.keys(options).forEach((key) => {
    if (options.hasOwnProperty(key) && options[key] === undefined) {
      delete cleanedOptions[key];
    }
  });
  return cleanedOptions;
}

// We intentionally set the types to any to avoid circular deps
export function mergeGridOptions(defaultOptions: any, options?: any) {
  options = removeUndefinedProps(options);
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  return mergedOptions;
}
