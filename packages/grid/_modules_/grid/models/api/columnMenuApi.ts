/**
 * The columnMenu API interface that is available in the grid [[apiRef]].
 */
export interface ColumnMenuApi {
  /**
   * Display the column menu under the field column.
   * @param field
   */
  showColumnMenu: (field: string) => void;
  /**
   * Hide the column menu.
   */
  hideColumnMenu: () => void;
}
