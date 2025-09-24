import { GridColDef } from '@mui/x-data-grid-pro';
import type { ChartState } from '../../../models/gridChartsIntegration';

export type GridChartsIntegrationSection = 'dimensions' | 'values' | null;

export type GridChartsIntegrationItem = {
  field: GridColDef['field'];
  hidden?: boolean;
};

export interface GridChartsIntegrationState {
  activeChartId: string;
  charts: Record<
    string,
    {
      dimensions: GridChartsIntegrationItem[];
      values: GridChartsIntegrationItem[];
    }
  >;
}

export interface GridChartsIntegrationInitialState {
  activeChartId?: string;
  charts?: Record<
    string,
    {
      dimensions?: GridChartsIntegrationItem[] | GridColDef['field'][];
      values?: GridChartsIntegrationItem[] | GridColDef['field'][];
      chartType?: ChartState['type'];
      configuration?: ChartState['configuration'];
    }
  >;
}

export interface GridChartsIntegrationApi {
  /**
   * Sets whether the charts side panel is open.
   * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the charts side panel open state.
   */
  setChartsPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  /**
   * Sets the active chart id.
   * @param {string} chartId - The id of the chart to set as active.
   */
  setActiveChartId: (chartId: string) => void;
  /**
   * Sets the chart type for the active chart.
   * @param {string} chartId - The id of the chart to set the type for.
   * @param {string} type - The new type of the chart.
   */
  setChartType: (chartId: string, type: string) => void;
  /**
   * Sets the synchronization state for a chart.
   * @param {string} chartId - The id of the chart to set the synchronization state for.
   * @param {boolean} synced - The new synchronization state.
   */
  setChartSynchronizationState: (chartId: string, synced: boolean) => void;
  /**
   * Updates the dimensions data selection for the charts integration.
   * @param {string} chartId - The id of the chart to update the dimensions for.
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} dimensions - The new dimensions selection or a function that returns the new dimensions selection.
   */
  updateChartDimensionsData: (
    chartId: string,
    dimensions:
      | GridChartsIntegrationItem[]
      | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
  ) => void;
  /**
   * Updates the values data selection for the charts integration.
   * @param {string} chartId - The id of the chart to update the values for.
   * @param {GridChartsIntegrationItem[] | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[])} values - The new values selection or a function that returns the new values selection.
   */
  updateChartValuesData: (
    chartId: string,
    values:
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
