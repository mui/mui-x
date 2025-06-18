export interface ChartsConfigurationPanelState {
  open: boolean;
}

export interface GridChartsIntegrationState {
  configurationPanel: ChartsConfigurationPanelState;
  categories: string[];
  series: string[];
}

export interface GridChartsIntegrationInitialState {
  configurationPanel?: Partial<ChartsConfigurationPanelState>;
  categories?: string[];
  series?: string[];
  chartType?: string;
}

export interface GridChartsIntegrationApi {
  /**
   * Sets whether the charts configuration side panel is open.
   * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the charts configuration side panel open state.
   */
  setChartsConfigurationPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  /**
   * Updates the categories selection for the charts integration.
   * @param {string[] | ((prev: string[]) => string[])} categories - The new categories selection or a function that returns the new categories selection.
   */
  updateCategories: (categories: string[] | ((prev: string[]) => string[])) => void;
  /**
   * Updates the series selection for the charts integration.
   * @param {string[] | ((prev: string[]) => string[])} series - The new series selection or a function that returns the new series selection.
   */
  updateSeries: (series: string[] | ((prev: string[]) => string[])) => void;
}

export interface GridChartsIntegrationPrivateApi {
  chartsIntegration: {
    updateDataReference: (
      field: string,
      originSection: 'categories' | 'series' | null,
      targetSection: 'categories' | 'series' | null,
      targetField?: string,
      placementRelativeToTargetField?: 'top' | 'bottom',
    ) => void;
    getColumnName: (field: string) => string;
  };
}
