/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { AutoSizer } from './components/AutoSizer';
import { ColumnsHeader } from './components/columnHeaders/ColumnHeaders';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridColumnHeaderMenu } from './components/menu/columnMenu/GridColumnHeaderMenu';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridRoot } from './components/containers/GridRoot';
import { GridWindow } from './components/containers/GridWindow';
import { Viewport } from './components/Viewport';
import { Watermark } from './components/Watermark';
import { COLUMN_HEADER_CLICK } from './constants/eventsConstants';
import { GridComponentProps } from './GridComponentProps';
import { useColumnMenu } from './hooks/features/columnMenu/useColumnMenu';
import { visibleColumnsSelector } from './hooks/features/columns/columnsSelector';
import { useColumns } from './hooks/features/columns/useColumns';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { useGridState } from './hooks/features/core/useGridState';
import { usePagination } from './hooks/features/pagination/usePagination';
import { usePreferencesPanel } from './hooks/features/preferencesPanel/usePreferencesPanel';
import { useRows } from './hooks/features/rows/useRows';
import { useSorting } from './hooks/features/sorting/useSorting';
import { useApiRef } from './hooks/features/useApiRef';
import { useColumnReorder } from './hooks/features/columnReorder';
import { useBaseComponentProps } from './hooks/features/useBaseComponentProps';
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
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useVirtualRows } from './hooks/features/virtualization/useVirtualRows';
import { useDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { ColParams } from './models/params/colParams';
import { RootContainerRef } from './models/rootContainerRef';
import { ApiContext, StateContext } from './components/api-context';
import { useFilter } from './hooks/features/filter/useFilter';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';

function ItemFoo(props) {
  const apiRef = React.useContext(ApiContext);
  const [gridState, setGridState, update] = useGridState(apiRef!)
  const [originalState, setState] = React.useState<any>();
  // const columns = useGridSelector(apiRef, visibleColumnsSelector);
  const onHeaderTitleClick = React.useCallback((field) => {

    setGridState(old => {
      const newState = {...old, ...{sorting: {...old.sorting, sortModel: [{field, sort: 'asc' as 'asc'}]}}};
      // setState(() => newState);
      return newState;
    });
update();
  }, [setGridState, update]);

  // const sortModel = gridState.sorting.sortModel;
  // const sortBy = sortModel.length > 0 ? sortModel[0].field : '';
  return (
    <div>
      This is ITemFoo
      sort: {props.sortBy}
      <br />
      {...gridState.columns.all.map(c=> (
        <li key={c} onClick = {()=> onHeaderTitleClick(c) }>{c}</li>
      ))}
    </div>
  )
}

export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);
    const [dummyState, setDummyState] = React.useState<any>();

    const footerRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const apiRef = useApiRef(props.apiRef);
    const [gridState] = useGridState(apiRef);

    const internalOptions = useOptionsProp(apiRef, props);

    useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
    const logger = useLogger('GridComponent');

    useApi(rootContainerRef, columnsContainerRef, apiRef);
    // const errorState = useErrorHandler(apiRef, props);
    useEvents(rootContainerRef, apiRef);
    // const onResize = useResizeContainer(apiRef);

    useColumns(props.columns, apiRef);
    useRows(props.rows, apiRef);
    // useKeyboard(rootContainerRef, apiRef);
    // useSelection(apiRef);
    useSorting(apiRef, props.rows);
    // useColumnMenu(apiRef);
    // usePreferencesPanel(apiRef);
    // useFilter(apiRef, props.rows);
    // useContainerProps(windowRef, apiRef);
    // useDensity(apiRef);
    // useVirtualRows(columnsHeaderRef, windowRef, renderingZoneRef, apiRef);
    // useLocaleText(apiRef);
    // useColumnReorder(apiRef);
    // useColumnResize(columnsHeaderRef, apiRef);
    // usePagination(apiRef);

    // const components = useComponents(props.components, props.componentsProps, apiRef);
    // useStateProp(apiRef, props.state);
    // useRenderInfoLog(apiRef, logger);
    // const componentBaseProps = useBaseComponentProps(apiRef);

    // const showNoRowsOverlay = !props.loading && gridState.rows.totalRowCount === 0;
    // React.useEffect(()=> {
    //     setDummyState(()=> gridState);
    // }, [gridState])

    const testLog = JSON.stringify(gridState?.sorting?.sortModel);
    console.log(testLog);
    const sortModel = gridState.sorting.sortModel;
    const sortBy = sortModel.length > 0 ? sortModel[0].field : '';
    console.log(`sortBy: ${sortBy} `);

    React.useEffect(()=> {
      console.log('sortmodel changed', gridState.sorting.sortModel)
    }, [gridState.sorting.sortModel]);

    return (
      <div>
        <ApiContext.Provider value={props.apiRef || apiRef}>
          <div>{testLog} & {sortBy}</div>
          <div>
            <ItemFoo sortBy={sortBy}/>
            <GridColumnsContainer ref={columnsContainerRef}>
              <ColumnsHeader ref={columnsHeaderRef}/>
            </GridColumnsContainer>
          </div>
        </ApiContext.Provider>
      </div>
    );
  },
);
export function ApiRefProvider(props) {
  const apiRef = useApiRef(props.apiRef);
  return (
    <ApiContext.Provider value={props.apiRef || apiRef}>
      {props.children}
    </ApiContext.Provider>
    )
}

// export function GridComponent(props) {
// return (
//     <GridInternalComponent {...props} />
//
// )
// }
