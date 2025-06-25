import { GridColDef } from '@mui/x-data-grid-pro';
import type { ChartState } from '../../../models/gridChartsIntegration';

export interface ChartsConfigurationPanelState {
  open: boolean;
}

export type GridChartsIntegrationSection = 'categories' | 'series' | null;

export type GridChartsIntegrationItem = {
  field: GridColDef['field'];
  hidden?: boolean;
};

export interface GridChartsIntegrationState {
  activeChartId: string;
  configurationPanel: ChartsConfigurationPanelState;
  charts: Record<
    string,
    {
      categories: GridChartsIntegrationItem[];
      series: GridChartsIntegrationItem[];
    }
  >;
}

export interface GridChartsIntegrationInitialState {
  configurationPanel?: Partial<ChartsConfigurationPanelState>;
  activeChartId?: string;
  charts?: Record<
    string,
    {
      categories?: GridChartsIntegrationItem[] | GridColDef['field'][];
      series?: GridChartsIntegrationItem[] | GridColDef['field'][];
      chartType?: ChartState['type'];
      configuration?: ChartState['configuration'];
    }
  >;
}

export interface GridChartsIntegrationApi {
  /**
   * Sets whether the charts configuration side panel is open.
   * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the charts configuration side panel open state.
   */
  setChartsConfigurationPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  /**
   * Sets the active chart id.
   * @param {string} chartId - The id of the chart to set as active.
   */
  setActiveChartId: (chartId: string) => void;
  /**
   * Updates the categories selection for the charts integration.
   * @param {string} chartId - The id of the chart to update the categories for.
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} categories - The new categories selection or a function that returns the new categories selection.
   */
  updateCategories: (
    chartId: string,
    categories:
      | GridChartsIntegrationItem[]
      | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
  ) => void;
  /**
   * Updates the series selection for the charts integration.
   * @param {string} chartId - The id of the chart to update the series for.
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} series - The new series selection or a function that returns the new series selection.
   */
  updateSeries: (
    chartId: string,
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
