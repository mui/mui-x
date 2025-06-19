import { GridColDef } from '@mui/x-data-grid-pro';

export interface ChartsConfigurationPanelState {
  open: boolean;
}

export type GridChartsIntegrationSection = 'categories' | 'series' | null;

export type GridChartsIntegrationItem = {
  field: GridColDef['field'];
  hidden?: boolean;
};

export interface GridChartsIntegrationState {
  configurationPanel: ChartsConfigurationPanelState;
  categories: GridChartsIntegrationItem[];
  series: GridChartsIntegrationItem[];
}

export interface GridChartsIntegrationInitialState {
  configurationPanel?: Partial<ChartsConfigurationPanelState>;
  categories?: GridChartsIntegrationItem[] | GridColDef['field'][];
  series?: GridChartsIntegrationItem[] | GridColDef['field'][];
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
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} categories - The new categories selection or a function that returns the new categories selection.
   */
  updateCategories: (
    categories:
      | GridChartsIntegrationItem[]
      | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
  ) => void;
  /**
   * Updates the series selection for the charts integration.
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} series - The new series selection or a function that returns the new series selection.
   */
  updateSeries: (
    series:
      | GridChartsIntegrationItem[]
      | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
  ) => void;
}

export interface GridChartsIntegrationPrivateApi {
  chartsIntegration: {
    updateDataReference: (
      field: string,
      originSection: GridChartsIntegrationSection,
      targetSection: GridChartsIntegrationSection,
      targetField?: string,
      placementRelativeToTargetField?: 'top' | 'bottom',
    ) => void;
    getColumnName: (field: string) => string;
  };
}
