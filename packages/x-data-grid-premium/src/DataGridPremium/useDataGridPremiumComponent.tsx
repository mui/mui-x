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
  useGridRowsMeta,
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
} from '../hooks/features/pivoting/useGridPivoting';
import { gridPivotPropsOverridesSelector } from '../hooks/features/pivoting/gridPivotingSelectors';
import {
  useGridAiAssistant,
  aiAssistantStateInitializer,
} from '../hooks/features/aiAssistant/useGridAiAssistant';

export const useDataGridPremiumComponent = (
  apiRef: RefObject<GridPrivateApiPremium>,
  inProps: DataGridPremiumProcessedProps,
) => {
  const pivotPropsOverrides = useGridSelector(apiRef, gridPivotPropsOverridesSelector);

  const props = React.useMemo(() => {
    if (pivotPropsOverrides) {
      return {
        ...inProps,
        ...pivotPropsOverrides,
      };
    }
    return inProps;
  }, [inProps, pivotPropsOverrides]);

  useGridInitialization<GridPrivateApiPremium>(apiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridRowSelectionPreProcessors(apiRef, props);
  useGridRowReorderPreProcessors(apiRef, props);
  useGridRowGroupingPreProcessors(apiRef, props);
  useGridDataSourceRowGroupingPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDataSourceTreeDataPreProcessors(apiRef, props);
  useGridLazyLoaderPreProcessors(apiRef, props);
  useGridRowPinningPreProcessors(apiRef);
  useGridAggregationPreProcessors(apiRef, props);
  useGridDetailPanelPreProcessors(apiRef, props);
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  useGridColumnPinningPreProcessors(apiRef, props);
  useGridRowsPreProcessors(apiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(propsStateInitializer, apiRef, props);
  useGridInitializeState(headerFilteringStateInitializer, apiRef, props);
  useGridInitializeState(rowGroupingStateInitializer, apiRef, props);
  useGridInitializeState(aggregationStateInitializer, apiRef, props);
  useGridInitializeState(rowSelectionStateInitializer, apiRef, props);
  useGridInitializeState(cellSelectionStateInitializer, apiRef, props);
  useGridInitializeState(detailPanelStateInitializer, apiRef, props);
  useGridInitializeState(columnPinningStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);
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
  useGridInitializeState(columnGroupsStateInitializer, apiRef, props);
  useGridInitializeState(virtualizationStateInitializer, apiRef, props);
  useGridInitializeState(dataSourceStateInitializer, apiRef, props);
  useGridInitializeState(dimensionsStateInitializer, apiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, apiRef, props);
  useGridInitializeState(listViewStateInitializer, apiRef, props);
  useGridInitializeState(aiAssistantStateInitializer, apiRef, props);

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
  useGridRows(apiRef, props);
  useGridRowSpanning(apiRef, props);
  useGridParamsApi(apiRef, props);
  useGridDetailPanel(apiRef, props);
  useGridColumnSpanning(apiRef);
  useGridColumnGrouping(apiRef, props);
  useGridClipboardImport(apiRef, props);
  useGridEditing(apiRef, props);
  useGridFocus(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridSorting(apiRef, props);
  useGridDensity(apiRef, props);
  useGridColumnReorder(apiRef, props);
  useGridColumnResize(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowsMeta(apiRef, props);
  useGridRowReorder(apiRef, props);
  useGridScroll(apiRef, props);
  useGridInfiniteLoader(apiRef, props);
  useGridLazyLoader(apiRef, props);
  useGridDataSourceLazyLoader(apiRef, props);
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

  return props;
};
