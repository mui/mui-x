/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { AutoSizer } from './components/AutoSizer';
import { ColumnsHeader } from './components/columnHeaders/ColumnHeaders';
import { DefaultFooter } from './components/DefaultFooter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Pagination } from './components/Pagination';
import { GridColumnsContainer } from './components/styled-wrappers/GridColumnsContainer';
import { GridDataContainer } from './components/styled-wrappers/GridDataContainer';
import { GridRoot } from './components/styled-wrappers/GridRoot';
import { GridWindow } from './components/styled-wrappers/GridWindow';
import { GridToolbar } from './components/styled-wrappers/GridToolbar';
import { ColumnsToolbarButton } from './components/toolbar/ColumnsToolbarButton';
import { FilterToolbarButton } from './components/toolbar/FilterToolbarButton';
import { Viewport } from './components/Viewport';
import { Watermark } from './components/Watermark';
import { GridComponentProps } from './GridComponentProps';
import { useColumnMenu } from './hooks/features/columnMenu/useColumnMenu';
import { visibleColumnsLengthSelector } from './hooks/features/columns/columnsSelector';
import { useColumns } from './hooks/features/columns/useColumns';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { useGridState } from './hooks/features/core/useGridState';
import { usePagination } from './hooks/features/pagination/usePagination';
import { usePreferencesPanel } from './hooks/features/preferencesPanel/usePreferencesPanel';
import { useRows } from './hooks/features/rows/useRows';
import { useSorting } from './hooks/features/sorting/useSorting';
import { useApiRef } from './hooks/features/useApiRef';
import { useColumnReorder } from './hooks/features/columnReorder';
import { useColumnResize } from './hooks/features/useColumnResize';
import { useComponents } from './hooks/features/useComponents';
import { useSelection } from './hooks/features/selection/useSelection';
import { useApi } from './hooks/root/useApi';
import { useContainerProps } from './hooks/root/useContainerProps';
import { useEvents } from './hooks/root/useEvents';
import { useKeyboard } from './hooks/features/keyboard/useKeyboard';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { useLogger, useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useVirtualRows } from './hooks/features/virtualization/useVirtualRows';
import { useDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { RootContainerRef } from './models/rootContainerRef';
import { getCurryTotalHeight } from './utils/getTotalHeight';
import { ApiContext } from './components/api-context';
import { DensitySelector } from './components/toolbar/DensitySelector';
import { useFilter } from './hooks/features/filter/useFilter';

export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);

    const footerRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const gridRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const apiRef = useApiRef(props.apiRef);
    const [gridState] = useGridState(apiRef);

    const internalOptions = useOptionsProp(apiRef, props);

    useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
    const logger = useLogger('GridComponent');

    useApi(rootContainerRef, columnsContainerRef, apiRef);
    const errorState = useErrorHandler(apiRef, props);
    useEvents(rootContainerRef, apiRef);
    const onResize = useResizeContainer(apiRef);

    useColumns(props.columns, apiRef);
    useRows(props.rows, apiRef);
    useKeyboard(rootContainerRef, apiRef);
    useSelection(apiRef);
    useSorting(apiRef, props.rows);
    useColumnMenu(apiRef);
    usePreferencesPanel(apiRef);
    useFilter(apiRef, props.rows);
    useContainerProps(windowRef, apiRef);
    useDensity(apiRef);
    useVirtualRows(columnsHeaderRef, windowRef, renderingZoneRef, apiRef);

    useColumnReorder(apiRef);
    useColumnResize(columnsHeaderRef, apiRef);
    usePagination(apiRef);

    const customComponents = useComponents(props.components, apiRef, rootContainerRef);
    useStateProp(apiRef, props.state);

    const visibleColumnsLength = useGridSelector(apiRef, visibleColumnsLengthSelector);

    // TODO move that to renderCtx
    const getTotalHeight = React.useCallback(
      (size) =>
        getCurryTotalHeight(
          gridState.options,
          gridState.containerSizes,
          headerRef,
          footerRef,
        )(size),
      [gridState.options, gridState.containerSizes],
    );

    if (gridState.rendering.renderContext != null) {
      const {
        page,
        firstColIdx,
        lastColIdx,
        firstRowIdx,
        lastRowIdx,
      } = gridState.rendering.renderContext!;
      logger.info(
        `Rendering, page: ${page}, col: ${firstColIdx}-${lastColIdx}, row: ${firstRowIdx}-${lastRowIdx}`,
      );
    }

    return (
      <AutoSizer onResize={onResize}>
        {(size: any) => (
          <GridRoot
            ref={handleRef}
            className={props.className}
            style={{ width: size.width, height: getTotalHeight(size) }}
            role="grid"
            aria-colcount={visibleColumnsLength}
            aria-rowcount={gridState.rows.totalRowCount}
            tabIndex={0}
            aria-label="grid"
            aria-multiselectable={!gridState.options.disableMultipleSelection}
          >
            <ErrorBoundary
              hasError={errorState != null}
              componentProps={errorState}
              api={apiRef!}
              logger={logger}
              render={(errorProps) => (
                <div className="MuiDataGrid-mainGridContainer">
                  {customComponents.renderError(errorProps)}
                </div>
              )}
            >
              <ApiContext.Provider value={apiRef}>
                <div ref={headerRef}>
                  {customComponents.headerComponent || (
                    <React.Fragment>
                      {gridState.options.showToolbar &&
                        (!gridState.options.disableColumnFilter ||
                          !gridState.options.disableColumnSelector ||
                          !gridState.options.disableDensitySelector) && (
                          <GridToolbar>
                            {!gridState.options.disableColumnSelector && <ColumnsToolbarButton />}
                            {!gridState.options.disableColumnFilter && <FilterToolbarButton />}
                            {!gridState.options.disableDensitySelector && <DensitySelector />}
                          </GridToolbar>
                        )}
                    </React.Fragment>
                  )}
                </div>
                <div className="MuiDataGrid-mainGridContainer">
                  <Watermark licenseStatus={props.licenseStatus} />
                  <GridColumnsContainer ref={columnsContainerRef}>
                    <ColumnsHeader ref={columnsHeaderRef} />
                  </GridColumnsContainer>
                  {!props.loading &&
                    gridState.rows.totalRowCount === 0 &&
                    customComponents.noRowsComponent}
                  {props.loading && customComponents.loadingComponent}
                  <GridWindow ref={windowRef}>
                    <GridDataContainer
                      ref={gridRef}
                      style={{
                        minHeight: gridState.containerSizes?.dataContainerSizes?.height,
                        minWidth: gridState.containerSizes?.dataContainerSizes?.width,
                      }}
                    >
                      {gridState.rendering.renderContext != null && (
                        <Viewport ref={renderingZoneRef} />
                      )}
                    </GridDataContainer>
                  </GridWindow>
                </div>
                <div ref={footerRef}>
                  {customComponents.footerComponent || (
                    <DefaultFooter
                      paginationComponent={
                        !!gridState.options.pagination &&
                        gridState.pagination.pageSize != null &&
                        !gridState.options.hideFooterPagination &&
                        (customComponents.paginationComponent || <Pagination />)
                      }
                    />
                  )}
                </div>
              </ApiContext.Provider>
            </ErrorBoundary>
          </GridRoot>
        )}
      </AutoSizer>
    );
  },
);
