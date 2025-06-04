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
  };
}
