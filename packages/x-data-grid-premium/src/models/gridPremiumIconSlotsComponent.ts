import * as React from 'react';
import { BaseSlots } from '@mui/x-data-grid/internals';

type IconProps = BaseSlots.IconProps;

export interface GridPremiumIconSlotsComponent {
  /**
   * Icon displayed in column menu for ungrouping
   * @default GridWorkspacesIcon
   */
  columnMenuUngroupIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for grouping
   * @default GridGroupWorkIcon
   */
  columnMenuGroupIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for aggregation
   * @default GridFunctionsIcon
   */
  columnMenuAggregationIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the pivot icon
   * @default GridPivotIcon
   */
  pivotIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the search icon in the sidebar search field
   * @default GridSearchIcon
   */
  pivotSearchIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the clear button in the sidebar search field
   * @default GridClearIcon
   */
  pivotSearchClearIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for adding a field to a pivot section.
   * @default GridAddIcon
   */
  pivotMenuAddIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for moving a field up.
   * @default GridExpandLessIcon
   */
  pivotMenuMoveUpIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for moving a field down.
   * @default GridExpandMoreIcon
   */
  pivotMenuMoveDownIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for moving a field to the top.
   * @default GridMoveToTopIcon
   */
  pivotMenuMoveToTopIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for moving a field to the bottom.
   * @default GridMoveToBottomIcon
   */
  pivotMenuMoveToBottomIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu to signify a pivot section is selected.
   * @default GridCheckIcon
   */
  pivotMenuCheckIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the pivot menu for removing a field from the pivot.
   * @default GridDeleteIcon
   */
  pivotMenuRemoveIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the sidebar close button.
   * @default GridCloseIcon
   */
  sidebarCloseIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in the collapsible to indicate if it is open or closed.
   * @default GridExpandMoreIcon
   */
  collapsibleIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the AI Assistant button
   * @default GridAssistantIcon
   */
  aiAssistantIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the AI Assistant panel close button
   * @default GridCloseIcon
   */
  aiAssistantPanelCloseIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the AI Assistant panel new conversation button
   * @default GridAddIcon
   */
  aiAssistantPanelNewConversationIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the AI Assistant panel history icon
   * @default GridHistoryIcon
   */
  aiAssistantPanelHistoryIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the prompt
   * @default GridPromptIcon
   */
  promptIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the button that sends a prompt
   * @default GridSendIcon
   */
  promptSendIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the button that starts and stops recording the prompt
   * @default GridMicIcon
   */
  promptSpeechRecognitionIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for when speech recognition is not supported
   * @default GridMicOffIcon
   */
  promptSpeechRecognitionOffIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the button that reruns a prompt
   * @default GridRerunIcon
   */
  promptRerunIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display sort ascending changes
   * @default GridArrowUpwardIcon
   */
  promptSortAscIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display sort descending changes
   * @default GridArrowDownwardIcon
   */
  promptSortDescIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display group changes
   * @default GridGroupWorkIcon
   */
  promptGroupIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display filter changes
   * @default GridFilterAltIcon
   */
  promptFilterIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display pivot changes
   * @default GridPivotIcon
   */
  promptPivotIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used to display aggregation changes
   * @default GridFunctionsIcon
   */
  promptAggregationIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used on the toggle button of the changes list
   * @default GridExpandMoreIcon
   */
  promptChangesToggleIcon: React.JSXElementConstructor<IconProps>;
}
