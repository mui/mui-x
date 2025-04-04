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
   * Icon used for the AI Assistant button
   * @default GridAssistantIcon
   */
  aiAssistantIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the AI Assistant close button
   * @default GridCloseIcon
   */
  aiAssistantCloseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the prompt
   * @default GridPromptIcon
   */
  promptIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the button that sends a prompt
   * @default GridSendIcon
   */
  promptSendIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the button that starts and stops recording the prompt
   * @default GridMicIcon
   */
  promptSpeechRecognitionIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for when speech recognition is not supported
   * @default GridMicOffIcon
   */
  promptSpeechRecognitionOffIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used for the button that reruns a prompt
   * @default GridRerunIcon
   */
  promptRerunIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display sort ascending changes
   * @default GridArrowUpwardIcon
   */
  promptSortAscIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display sort descending changes
   * @default GridArrowDownwardIcon
   */
  promptSortDescIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display group changes
   * @default GridGroupWorkIcon
   */
  promptGroupIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display filter changes
   * @default GridFilterAltIcon
   */
  promptFilterIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display pivot changes
   * @default GridPivotIcon
   */
  promptPivotIcon: React.JSXElementConstructor<any>;
  /**
   * Icon used to display aggregation changes
   * @default GridFunctionsIcon
   */
  promptAggregationIcon: React.JSXElementConstructor<any>;
}
