import type { GridComputedColumnDefinition } from './gridComputedColumnsInterfaces';

/**
 * Whether end users can edit or remove a computed column from the grid UI.
 * @param {GridComputedColumnDefinition} definition The definition of the computed column.
 * @returns {boolean} `false` when the definition sets `editable: false`.
 */
export function isComputedColumnEditable(definition: GridComputedColumnDefinition): boolean {
  return definition.editable !== false;
}
