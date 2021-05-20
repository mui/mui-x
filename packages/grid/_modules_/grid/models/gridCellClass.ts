import { GridCellParams } from './params/gridCellParams';

/**
 * A function used to process cellClassParams.
 */
export type GridCellClassFn = (params: GridCellParams) => string | string[];

/**
 * The union type representing the [[GridColDef]] cell class type.
 */
export type GridCellClassNamePropType = string | string[] | GridCellClassFn;
