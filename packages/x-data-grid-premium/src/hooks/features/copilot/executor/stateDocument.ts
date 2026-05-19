import type { RefObject } from '@mui/x-internals/types';
import {
  type GridFilterModel,
  type GridSortModel,
  type GridColumnVisibilityModel,
  type GridPinnedColumnFields,
  type GridDensity,
  type GridPaginationModel,
  type GridRowId,
  gridFilterModelSelector,
  gridSortModelSelector,
  gridColumnVisibilityModelSelector,
  gridPinnedColumnsSelector,
  gridDensitySelector,
  gridPaginationModelSelector,
} from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../../models/gridApiPremium';
import type { GridRowGroupingModel } from '../../rowGrouping/gridRowGroupingInterfaces';
import type { GridAggregationModel } from '../../aggregation/gridAggregationInterfaces';
import type { GridPivotModel } from '../../pivoting/gridPivotingInterfaces';
import type { GridChartsIntegrationItem } from '../../chartsIntegration/gridChartsIntegrationInterfaces';
import type { GridCellSelectionModel } from '../../cellSelection/gridCellSelectionInterfaces';
import type { GridSidebarValue } from '../../sidebar';
import { gridRowGroupingModelSelector } from '../../rowGrouping/gridRowGroupingSelector';
import { gridAggregationModelSelector } from '../../aggregation/gridAggregationSelectors';
import {
  gridPivotModelSelector,
  gridPivotActiveSelector,
} from '../../pivoting/gridPivotingSelectors';
import {
  gridChartsIntegrationActiveChartIdSelector,
  gridChartsIntegrationChartsLookupSelector,
  gridChartsPanelOpenSelector,
} from '../../chartsIntegration/gridChartsIntegrationSelectors';
import { gridSidebarStateSelector } from '../../sidebar/gridSidebarSelector';

export interface ChartSlice {
  type: string;
  dimensions: GridChartsIntegrationItem[];
  values: GridChartsIntegrationItem[];
  synced: boolean;
}

export interface GridStateDocument {
  filter: GridFilterModel;
  sort: GridSortModel;
  grouping: GridRowGroupingModel;
  aggregation: GridAggregationModel;
  pivot: {
    active: boolean;
    model: GridPivotModel;
  };
  columns: {
    visibility: GridColumnVisibilityModel;
    pinned: GridPinnedColumnFields;
    order: string[];
    widths: Record<string, number>;
  };
  charts: Record<string, ChartSlice>;
  selection: {
    rows: { type: 'include' | 'exclude'; ids: GridRowId[] };
    cells?: GridCellSelectionModel;
  };
  view: {
    density: GridDensity;
    pagination: GridPaginationModel;
    sidebar: GridSidebarValue | null;
    chartsPanelOpen: boolean;
    preferences: string | null;
    activeChartId?: string;
  };
}

const EMPTY_PIVOT_MODEL: GridPivotModel = {
  rows: [],
  columns: [],
  values: [],
};

const EMPTY_FILTER_MODEL: GridFilterModel = { items: [] };

const EMPTY_PINNED: GridPinnedColumnFields = { left: [], right: [] };

const EMPTY_SELECTION = { type: 'include' as const, ids: [] };

export function snapshotState(apiRef: RefObject<GridPrivateApiPremium>): GridStateDocument {
  const charts: Record<string, ChartSlice> = {};
  try {
    const chartsLookup = gridChartsIntegrationChartsLookupSelector(apiRef);
    Object.entries(chartsLookup ?? {}).forEach(([id, value]) => {
      charts[id] = {
        type: (value as any).type ?? 'column',
        dimensions: (value as any).dimensions ?? [],
        values: (value as any).values ?? [],
        synced: (value as any).synced ?? true,
      };
    });
  } catch {
    // chartsIntegration disabled; leave empty
  }

  let activeChartId: string | undefined;
  try {
    activeChartId = gridChartsIntegrationActiveChartIdSelector(apiRef) || undefined;
  } catch {
    activeChartId = undefined;
  }

  let chartsPanelOpen = false;
  try {
    chartsPanelOpen = !!gridChartsPanelOpenSelector(apiRef);
  } catch {
    chartsPanelOpen = false;
  }

  let pivotActive = false;
  let pivotModel: GridPivotModel = EMPTY_PIVOT_MODEL;
  try {
    pivotActive = !!gridPivotActiveSelector(apiRef);
    pivotModel = gridPivotModelSelector(apiRef) ?? EMPTY_PIVOT_MODEL;
  } catch {
    pivotActive = false;
    pivotModel = EMPTY_PIVOT_MODEL;
  }

  let grouping: GridRowGroupingModel = [];
  try {
    grouping = (gridRowGroupingModelSelector(apiRef) ?? []) as GridRowGroupingModel;
  } catch {
    grouping = [];
  }

  let aggregation: GridAggregationModel = {};
  try {
    aggregation = gridAggregationModelSelector(apiRef) ?? {};
  } catch {
    aggregation = {};
  }

  const sidebarState = gridSidebarStateSelector(apiRef);

  return {
    filter: gridFilterModelSelector(apiRef) ?? EMPTY_FILTER_MODEL,
    sort: gridSortModelSelector(apiRef) ?? [],
    grouping,
    aggregation,
    pivot: { active: pivotActive, model: pivotModel },
    columns: {
      visibility: gridColumnVisibilityModelSelector(apiRef) ?? {},
      pinned: gridPinnedColumnsSelector(apiRef) ?? EMPTY_PINNED,
      order: apiRef.current.state.columns?.orderedFields ?? [],
      widths: {},
    },
    charts,
    selection: { rows: { ...EMPTY_SELECTION } },
    view: {
      density: gridDensitySelector(apiRef),
      pagination: gridPaginationModelSelector(apiRef) ?? { page: 0, pageSize: 100 },
      sidebar: (sidebarState?.value as GridSidebarValue | undefined) ?? null,
      chartsPanelOpen,
      preferences: null,
      activeChartId,
    },
  };
}
