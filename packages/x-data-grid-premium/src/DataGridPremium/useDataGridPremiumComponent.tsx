'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useGridInitialization,
  useGridInitializeState,
  useGridClipboard,
  useGridColumnMenu,
  useGridColumns,
  columnsStateInitializer,
  useGridDensity,
  useGridCsvExport,
  useGridPrintExport,
  useGridFilter,
  filterStateInitializer,
  useGridFocus,
  useGridKeyboardNavigation,
  useGridPagination,
  paginationStateInitializer,
  useGridPreferencesPanel,
  useGridEditing,
  editingStateInitializer,
  useGridRows,
  useGridRowsPreProcessors,
  rowsStateInitializer,
  useGridParamsApi,
  useGridRowSelection,
  useGridSorting,
  sortingStateInitializer,
  useGridScroll,
  useGridEvents,
  dimensionsStateInitializer,
  useGridDimensions,
  useGridStatePersistence,
  useGridRowSelectionPreProcessors,
  columnMenuStateInitializer,
  densityStateInitializer,
  focusStateInitializer,
  preferencePanelStateInitializer,
  rowsMetaStateInitializer,
  rowSelectionStateInitializer,
  useGridColumnReorder,
  columnReorderStateInitializer,
  useGridColumnResize,
  columnResizeStateInitializer,
  useGridTreeData,
  useGridTreeDataPreProcessors,
  useGridColumnPinning,
  columnPinningStateInitializer,
  useGridColumnPinningPreProcessors,
  useGridDetailPanel,
  detailPanelStateInitializer,
  useGridDetailPanelPreProcessors,
  useGridInfiniteLoader,
  useGridColumnSpanning,
  useGridRowReorder,
  useGridRowReorderPreProcessors,
  useGridRowPinning,
  useGridRowPinningPreProcessors,
  rowPinningStateInitializer,
  useGridColumnGrouping,
  columnGroupsStateInitializer,
  useGridLazyLoader,
  useGridLazyLoaderPreProcessors,
  useGridDataSourceLazyLoader,
  useGridDataSourceNestedLazyLoader,
  useGridInfiniteLoadingIntersection,
  headerFilteringStateInitializer,
  useGridHeaderFiltering,
  virtualizationStateInitializer,
  useGridVirtualization,
  useGridDataSourceTreeDataPreProcessors,
  dataSourceStateInitializer,
  useGridRowSpanning,
  rowSpanningStateInitializer,
  useGridListView,
  listViewStateInitializer,
  propsStateInitializer,
  rowReorderStateInitializer,
  type GridConfiguration,
  useFirstRender,
} from '@mui/x-data-grid-pro/internals';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { GridPrivateApiPremium } from '../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';
import { useGridDataSourcePremium as useGridDataSource } from '../hooks/features/dataSource/useGridDataSourcePremium';
// Premium-only features
import {
  useGridAggregation,
  aggregationStateInitializer,
} from '../hooks/features/aggregation/useGridAggregation';
import { useGridAggregationPreProcessors } from '../hooks/features/aggregation/useGridAggregationPreProcessors';
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from '../hooks/features/rowGrouping/useGridRowGrouping';
import { useGridRowGroupingPreProcessors } from '../hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import { useGridDataSourceRowGroupingPreProcessors } from '../hooks/features/rowGrouping/useGridDataSourceRowGroupingPreProcessors';
import { useGridExcelExport } from '../hooks/features/export/useGridExcelExport';
import {
  cellSelectionStateInitializer,
  useGridCellSelection,
} from '../hooks/features/cellSelection/useGridCellSelection';
import { useGridClipboardImport } from '../hooks/features/clipboard/useGridClipboardImport';
import {
  pivotingStateInitializer,
  useGridPivoting,
  useGridPivotingExportState,
} from '../hooks/features/pivoting/useGridPivoting';
import { gridPivotPropsOverridesSelector } from '../hooks/features/pivoting/gridPivotingSelectors';
import {
  useGridAiAssistant,
  aiAssistantStateInitializer,
} from '../hooks/features/aiAssistant/useGridAiAssistant';
import { useGridSidebar, sidebarStateInitializer } from '../hooks/features/sidebar/useGridSidebar';
import {
  chartsIntegrationStateInitializer,
  useGridChartsIntegration,
} from '../hooks/features/chartsIntegration/useGridChartsIntegration';

export const useDataGridPremiumComponent = (
  apiRef: RefObject<GridPrivateApiPremium>,
  inProps: DataGridPremiumProcessedProps,
  configuration: GridConfiguration,
) => {
  const pivotPropsOverrides = useGridSelector(apiRef, gridPivotPropsOverridesSelector);

  const props = React.useMemo(() => {
    if (pivotPropsOverrides) {
      return {
        ...inProps,
        ...pivotPropsOverrides,
        initialState: {
          ...inProps.initialState,
          columns: undefined,
        },
      };
    }
    return inProps;
  }, [inProps, pivotPropsOverrides]);

  useGridInitialization<GridPrivateApiPremium>(apiRef, props);

  const key = pivotPropsOverrides ? 'pivoting' : undefined;

  /**
   * Register all pre-processors called during state initialization here.
   * Some pre-processors are changing the same part of the state (like the order of the columns).
   * Order them in descending order of priority.
   * For example, left pinned columns should always render first from the left, so the `hydrateColumns` pre-processor from `useGridColumnPinningPreProcessors` should be called last (after all other `hydrateColumns` pre-processors).
   * Similarly, the `hydrateColumns` pre-processor from `useGridRowSelectionPreProcessors` should be called after `useGridRowGroupingPreProcessors` because the selection checkboxes should appear before the grouping columns.
   * Desired autogenerated columns order is:
   * left pinned columns -> row reordering column -> checkbox column -> tree data / row grouping column -> master detail column -> rest of the columns
   */
  useGridDetailPanelPreProcessors(apiRef, props);
  useGridRowGroupingPreProcessors(apiRef, props);
  useGridDataSourceRowGroupingPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDataSourceTreeDataPreProcessors(apiRef, props);
  useGridRowSelectionPreProcessors(apiRef, props);
  useGridLazyLoaderPreProcessors(apiRef, props);
  useGridRowPinningPreProcessors(apiRef);
  useGridAggregationPreProcessors(apiRef, props);
  useGridRowReorderPreProcessors(apiRef, props);
  useGridColumnPinningPreProcessors(apiRef, props);
  useGridRowsPreProcessors(apiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(propsStateInitializer, apiRef, props);
  useGridInitializeState(headerFilteringStateInitializer, apiRef, props, key);
  useGridInitializeState(rowGroupingStateInitializer, apiRef, props, key);
  useGridInitializeState(aggregationStateInitializer, apiRef, props, key);
  useGridInitializeState(rowSelectionStateInitializer, apiRef, props);
  useGridInitializeState(rowReorderStateInitializer, apiRef, props);
  useGridInitializeState(cellSelectionStateInitializer, apiRef, props);
  useGridInitializeState(detailPanelStateInitializer, apiRef, props);
  useGridInitializeState(columnPinningStateInitializer, apiRef, props, key);
  useGridInitializeState(columnsStateInitializer, apiRef, props, key);
  useGridInitializeState(sidebarStateInitializer, apiRef, props);
  useGridInitializeState(pivotingStateInitializer, apiRef, props);
  useGridInitializeState(rowPinningStateInitializer, apiRef, props);
  useGridInitializeState(rowsStateInitializer, apiRef, props);
  useGridInitializeState(paginationStateInitializer, apiRef, props);
  useGridInitializeState(editingStateInitializer, apiRef, props);
  useGridInitializeState(focusStateInitializer, apiRef, props);
  useGridInitializeState(sortingStateInitializer, apiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, apiRef, props);
  useGridInitializeState(filterStateInitializer, apiRef, props);
  useGridInitializeState(rowSpanningStateInitializer, apiRef, props);
  useGridInitializeState(densityStateInitializer, apiRef, props);
  useGridInitializeState(columnReorderStateInitializer, apiRef, props);
  useGridInitializeState(columnResizeStateInitializer, apiRef, props);
  useGridInitializeState(columnMenuStateInitializer, apiRef, props);
  useGridInitializeState(columnGroupsStateInitializer, apiRef, props, key);
  useGridInitializeState(virtualizationStateInitializer, apiRef, props);
  useGridInitializeState(dataSourceStateInitializer, apiRef, props);
  useGridInitializeState(dimensionsStateInitializer, apiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, apiRef, props);
  useGridInitializeState(listViewStateInitializer, apiRef, props);
  useGridInitializeState(aiAssistantStateInitializer, apiRef, props);
  useGridInitializeState(chartsIntegrationStateInitializer, apiRef, props);

  useGridSidebar(apiRef, props);
  useGridPivoting(apiRef, props, inProps.columns, inProps.rows);
  useGridRowGrouping(apiRef, props);
  useGridHeaderFiltering(apiRef, props);
  useGridTreeData(apiRef, props);
  useGridAggregation(apiRef, props);
  useGridKeyboardNavigation(apiRef, props);
  useGridRowSelection(apiRef, props);
  useGridCellSelection(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridRowPinning(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props, configuration);
  useGridRowSpanning(apiRef, props);
  useGridParamsApi(apiRef, props, configuration);
  useGridDetailPanel(apiRef, props);
  useGridColumnSpanning(apiRef);
  useGridColumnGrouping(apiRef, props);
  useGridClipboardImport(apiRef, props);
  useGridEditing(apiRef, props, configuration);
  useGridFocus(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props, configuration);
  useGridSorting(apiRef, props);
  useGridDensity(apiRef, props);
  useGridColumnReorder(apiRef, props);
  useGridColumnResize(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowReorder(apiRef, props);
  useGridScroll(apiRef, props);
  useGridInfiniteLoader(apiRef, props);
  useGridLazyLoader(apiRef, props);
  useGridDataSourceLazyLoader(apiRef, props);
  useGridDataSourceNestedLazyLoader(apiRef, props);
  useGridInfiniteLoadingIntersection(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridCsvExport(apiRef, props);
  useGridPrintExport(apiRef, props);
  useGridExcelExport(apiRef, props);
  useGridClipboard(apiRef, props);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);
  useGridDataSource(apiRef, props);
  useGridVirtualization(apiRef, props);
  useGridListView(apiRef, props);
  useGridAiAssistant(apiRef, props);
  useGridChartsIntegration(apiRef, props);
  useGridPivotingExportState(apiRef);

  // Should be the last thing to run, because all pre-processors should have been registered by now.
  useFirstRender(() => {
    apiRef.current.runAppliersForPendingProcessors();
  });
  React.useEffect(() => {
    apiRef.current.runAppliersForPendingProcessors();
  });

  return props;
};
