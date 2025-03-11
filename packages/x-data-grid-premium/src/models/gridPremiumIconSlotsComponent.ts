import * as React from 'react';

export interface GridPremiumIconSlotsComponent {
  /**
   * Icon displayed in column menu for ungrouping
   * @default GridWorkspacesIcon
   */
  columnMenuUngroupIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for grouping
   * @default GridGroupWorkIcon
   */
  columnMenuGroupIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for aggregation
   * @default GridFunctionsIcon
   */
  columnMenuAggregationIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the button that sends a prompt
   * @default GridFunctionsIcon
   */
  toolbarPromptSendIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the button that starts/stops recording the prompt
   * @default GridFunctionsIcon
   */
  toolbarPromptRecordIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the search icon in the sidebar search field
   * @default GridSearchIcon
   */
  pivotSearchIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the clear button in the sidebar search field
   * @default GridClearIcon
   */
  pivotSearchClearIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for adding a field to a pivot section.
   * @default GridAddIcon
   */
  pivotMenuAddIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for moving a field up.
   * @default GridExpandLessIcon
   */
  pivotMenuMoveUpIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for moving a field down.
   * @default GridExpandMoreIcon
   */
  pivotMenuMoveDownIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for moving a field to the top.
   * @default GridMoveToTopIcon
   */
  pivotMenuMoveToTopIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for moving a field to the bottom.
   * @default GridMoveToBottomIcon
   */
  pivotMenuMoveToBottomIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu to signify a pivot section is selected.
   * @default GridCheckIcon
   */
  pivotMenuCheckIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the pivot menu for removing a field from the pivot.
   * @default GridDeleteIcon
   */
  pivotMenuRemoveIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in the sidebar close button.
   * @default GridCloseIcon
   */
  sidebarCloseIcon: React.JSXElementConstructor<any>;
}
