import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';
import { useApi } from '../root/useApi';
import { useContainerProps } from '../root/useContainerProps';
import { useEvents } from '../root/useEvents';
import { useErrorHandler } from '../utils/useErrorHandler';
import { useResizeContainer } from '../utils/useResizeContainer';
import { useColumnMenu } from './columnMenu/useColumnMenu';
import { useColumnReorder } from './columnReorder/useColumnReorder';
import { useColumns } from './columns/useColumns';
import { useDensity } from './density/useDensity';
import { useFilter } from './filter/useFilter';
import { useKeyboard } from './keyboard/useKeyboard';
import { useLocaleText } from './localeText/useLocaleText';
import { usePagination } from './pagination/usePagination';
import { usePreferencesPanel } from './preferencesPanel/usePreferencesPanel';
import { useRows } from './rows/useRows';
import { useSelection } from './selection/useSelection';
import { useSorting } from './sorting/useSorting';
import { useColumnResize } from './useColumnResize';
import { useComponents } from './useComponents';
import { useVirtualRows } from './virtualization/useVirtualRows';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
// const noop = () => {};
// const getNewApi: ()=> GridApi = ()=> ({
//   applyFilters(): void {},
//   applySorting(): void {},
//   components: {
//     ColumnFilteredIcon
//   },
//   deleteFilter(): void {},
//   emit(): void {},
//   events: {},
//   forceUpdate(): void {},
//   getAllColumns(): any {
//     return undefined;
//   },
//   getAllRowIds(): any[] {
//     return [];
//   },
//   getColumnFromField(): any {
//     return undefined;
//   },
//   getColumnIndex(): number {
//     return 0;
//   },
//   getColumnPosition(): number {
//     return 0;
//   },
//   getColumnsMeta(): any {
//     return undefined;
//   },
//   getContainerPropsState(): any | null {
//     return undefined;
//   },
//   getLocaleText<T>(): any {
//     return undefined;
//   },
//   getRenderContextState(): any {
//     return undefined;
//   },
//   getRowFromId(): any {
//     return undefined;
//   },
//   getRowIdFromRowIndex(): any {
//     return undefined;
//   },
//   getRowIndexFromId(): number {
//     return 0;
//   },
//   getRowModels(): any[] {
//     return [];
//   },
//   getRowsCount(): number {
//     return 0;
//   },
//   getSelectedRows(): any[] {
//     return [];
//   },
//   getSortModel(): any {
//     return undefined;
//   },
//   getState(): any {
//     return undefined;
//   },
//   getVisibleColumns(): any {
//     return undefined;
//   },
//   hideColumnMenu(): void {},
//   hideFilterPanel(): void {},
//   hidePreferences(): void {},
//   isColumnVisibleInWindow(): boolean {
//     return false;
//   },
//   isInitialised: false,
//   maxListeners: 0,
//   moveColumn(): void {},
//   on(): void {},
//   onColHeaderDragOver(): void {},
//   onColItemDragEnter(): void {},
//   onColItemDragOver(): void {},
//   onColItemDragStart(): void {},
//   onFilterModelChange(): void {},
//   onPageChange() {
//     return function () {};
//   },
//   onPageSizeChange() {
//     return function () {};
//   },
//   onResize(): void {},
//   onRowSelected(){
//     return function () {};
//   },
//   onSelectionChange(){
//     return function () {};
//   },
//   onSortModelChange(){
//     return function () {};
//   },
//   onStateChange(): void {},
//   onUnmount(): void {},
//   once(): void {},
//   publishEvent(): void {},
//   removeAllListeners(): void {},
//   removeListener(): void {},
//   resize(): void {},
//   scroll(): void {},
//   scrollToIndexes(): boolean {
//     return false;
//   },
//   selectRow(): void {},
//   selectRows(): void {},
//   setDensity(): void {},
//   setFilterModel(): void {},
//   setPage(): void {},
//   setPageSize(): void {},
//   setRows(): void {},
//   setSortModel(): void {},
//   setState(): void {},
//   showColumnMenu(): void {},
//   showError(): void {},
//   showFilterPanel(): void {},
//   showPreferences(): void {},
//   sortColumn(): void {},
//   startResizeOnMouseDown(): void {},
//   state: undefined,
//   subscribeEvent(){
//     return function () {};
//   },
//   toggleColumn(): void {},
//   updateColumn(): void {},
//   updateColumns(): void {},
//   updateRows(): void {},
//   updateViewport(): void {},
//   upsertFilter(): void {},
//   warnOnce: false,
//   applyFilter: noop,
//   applyFilterLinkOperator: noop,
// } as GridApi);

function createGridApi(): GridApi {
  // const apiPart = { getLocaleText: ()=> ''};
  // const api = {...new EventEmitter(),  ...apiPart } as unknown as GridApi;
  const api = new EventEmitter() as GridApi;

  return api;
}

export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  const apiRef = React.useRef<GridApi>(createGridApi());

  // useApi(null, null, apiRef);
  // useEvents(null, apiRef);
  useLocaleText(apiRef);
  // useResizeContainer(apiRef);

  // useColumns([], apiRef);
  // useRows([], apiRef);
  // useKeyboard(null, apiRef);
  // useSelection(apiRef);
  // useSorting(apiRef, []);
  // useColumnMenu(apiRef);
  // usePreferencesPanel(apiRef);
  // useFilter(apiRef, []);
  // useContainerProps(null, apiRef);
  // useDensity(apiRef);
  // useVirtualRows(null, null, null, apiRef);
  // useColumnReorder(apiRef);
  // useColumnResize(null, apiRef);
  // usePagination(apiRef);
useComponents(undefined, undefined, apiRef);

  React.useEffect(() => {
    if (apiRefProp?.current) {
      apiRefProp.current = apiRef.current;
    }
  });

  return apiRef;
}
