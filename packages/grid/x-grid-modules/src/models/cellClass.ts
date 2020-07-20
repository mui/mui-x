import { CellParams } from './params/cellParams';

/**
 * Alias of CellParams.
 */
export type CellClassParams = CellParams;
/**
 * A function used to process cellClassParams.
 */
export type CellClassFn = (params: CellClassParams) => string | string[];
/**
 * The union type representing the [[ColDef]] cell class type.
 */
export type CellClassPropType = string | string[] | CellClassFn;
/**
 * An object representing the cell class rules.
 */
export type CellClassRules = { [cssClass: string]: (params: CellClassParams) => boolean };
