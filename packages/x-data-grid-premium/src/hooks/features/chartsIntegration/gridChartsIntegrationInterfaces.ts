export interface ChartsConfigurationPanelState {
  open: boolean;
}

export interface GridChartsIntegrationState {
  configurationPanel: ChartsConfigurationPanelState;
}

export interface GridChartsIntegrationInitialState {
  configurationPanel?: Partial<ChartsConfigurationPanelState>;
}

export interface GridChartsIntegrationApi {
  /**
   * Sets whether the charts configuration side panel is open.
   * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the charts configuration side panel open state.
   */
  setChartsConfigurationPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}
