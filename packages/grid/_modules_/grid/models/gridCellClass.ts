import { GridCellParams } from './params/gridCellParams';

/**
 * Alias of GridCellParams.
 */
export type GridCellClassParams = GridCellParams;
/**
 * A function used to process cellClassParams.
 */
export type GridCellClassFn = (params: GridCellClassParams) => string | string[];
/**
 * The union type representing the [[GridColDef]] cell class type.
 */
export type GridCellClassNamePropType = string | string[] | GridCellClassFn;
/**
 * An object representing the cell class rules.
 */
export type GridCellClassRules = {
  [cssClass: string]: ((params: GridCellClassParams) => boolean) | boolean;
};
