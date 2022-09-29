import { GridCellParams } from './params/gridCellParams';

/**
 * A function used to process cellClassName params.
 */
export type GridCellClassFn = (params: GridCellParams) => string;

/**
 * The union type representing the [[GridColDef]] cell class type.
 */
export type GridCellClassNamePropType = string | GridCellClassFn;
