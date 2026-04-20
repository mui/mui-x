import type { GridColumnHeaderParams } from './params/gridColumnHeaderParams';

/**
 * A function used to process headerClassName params.
 * @param {GridColumnHeaderParams} params The parameters of the column header.
 * @returns {string} The class name to be added to the column header cell.
 */
export type GridColumnHeaderClassFn = (params: GridColumnHeaderParams) => string;

/**
 * The union type representing the [[GridColDef]] column header class type.
 */
export type GridColumnHeaderClassNamePropType = string | GridColumnHeaderClassFn;
