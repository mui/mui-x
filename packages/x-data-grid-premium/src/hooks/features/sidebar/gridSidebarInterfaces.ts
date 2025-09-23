export enum GridSidebarValue {
  Pivot = 'pivot',
  Charts = 'charts',
}

export interface GridSidebarApi {
  /**
   * Displays the sidebar. The `newValue` argument controls the content of the sidebar.
   * @param {GridSidebarValue} newValue The sidebar to open.
   * @param {string} sidebarId The unique sidebar id
   * @param {string} labelId The unique button id
   */
  showSidebar: (newValue: GridSidebarValue, sidebarId?: string, labelId?: string) => void;
  /**
   * Hides the sidebar.
   */
  hideSidebar: () => void;
}
