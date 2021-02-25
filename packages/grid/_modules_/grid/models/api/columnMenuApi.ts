/**
 * The columnMenu API interface that is available in the grid [[apiRef]].
 */
export interface ColumnMenuApi {
  /**
   * Display the column menu under the field column.
   * @param field
   * @param id
   * @param labelledby
   */
  showColumnMenu: (field: string, id: string, labelledby: string) => void;
  /**
   * Hide the column menu.
   */
  hideColumnMenu: () => void;
}
