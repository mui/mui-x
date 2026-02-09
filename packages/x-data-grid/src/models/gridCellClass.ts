import type { GridValidRowModel } from './gridRows';
import type { GridCellParams } from './params/gridCellParams';

/**
 * A function used to process cellClassName params.
 * @param {GridCellParams<R, V>} params The parameters of the cell.
 * @returns {string} The class name to be added to the cell.
 */
export type GridCellClassFn<R extends GridValidRowModel = any, V = unknown> = (
  params: GridCellParams<R, V>,
) => string;

/**
 * The union type representing the [[GridColDef]] cell class type.
 */
export type GridCellClassNamePropType<R extends GridValidRowModel = any, V = unknown> =
  | string
  | GridCellClassFn<R, V>;
