/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { GridComponentProps } from './GridComponentProps';
import { GridBody } from './GridImplementation';
import { useGridColumnMenu } from './hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns } from './hooks/features/columns/useGridColumns';
import { useGridFocus } from './hooks/features/focus/useGridFocus';
import { useGridKeyboardNavigation } from './hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from './hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from './hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridParamsApi } from './hooks/features/rows/useGridParamsApi';
import { useGridRows } from './hooks/features/rows/useGridRows';
import { useGridEditRows } from './hooks/features/rows/useGridEditRows';
import { useGridSorting } from './hooks/features/sorting/useGridSorting';
import { useGridApiRef } from './hooks/features/useGridApiRef';
import { useGridColumnReorder } from './hooks/features/columnReorder';
import { useGridColumnResize } from './hooks/features/columnResize';
import { useGridComponents } from './hooks/features/useGridComponents';
import { useGridSelection } from './hooks/features/selection/useGridSelection';
import { useApi } from './hooks/root/useApi';
import { useGridContainerProps } from './hooks/root/useGridContainerProps';
import { useEvents } from './hooks/root/useEvents';
import { useGridKeyboard } from './hooks/features/keyboard/useGridKeyboard';
import { useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useGridVirtualRows } from './hooks/features/virtualization/useGridVirtualRows';
import { useGridDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { GridApiContext, GridPropsContext } from './components/GridApiContext';
import { useGridFilter } from './hooks/features/filter/useGridFilter';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';
import { useGridCsvExport } from './hooks/features/export';
import { useGridInfiniteLoader } from './hooks/features/infiniteLoader';
import { useGridFreezeRows } from './hooks/features/rows/useGridFreezeRows';

const useXGrid = (apiRef, props) => {
  useLoggerFactory(apiRef, props);
  useOptionsProp(apiRef, props);
  useApi(apiRef);
  useEvents(apiRef);
  useLocaleText(apiRef);
  useResizeContainer(apiRef);
  useGridFreezeRows(apiRef, props);
  useGridColumns(apiRef, props);
  useGridParamsApi(apiRef);
  useGridRows(apiRef, props);
  useGridEditRows(apiRef);
  useGridFocus(apiRef);
  useGridKeyboard(apiRef);
  useGridKeyboardNavigation(apiRef);
  useGridSelection(apiRef);
  useGridSorting(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridPreferencesPanel(apiRef);
  useGridFilter(apiRef, props);
  useGridContainerProps(apiRef);
  useGridDensity(apiRef);
  useGridVirtualRows(apiRef);
  useGridColumnReorder(apiRef);
  useGridColumnResize(apiRef);
  useGridPagination(apiRef);
  useGridCsvExport(apiRef);
  useGridInfiniteLoader(apiRef);
  useGridComponents(apiRef, props);
  useStateProp(apiRef, props);
  useRenderInfoLog(apiRef);
}

export const GridContextProvider = (props)=> {
  // const apiRef = useGridApiRef(props.apiRef);
  return (
  <GridPropsContext.Provider value={props}>
    <GridApiContext.Provider value={props.apiRef }>
      {props.children}
    </GridApiContext.Provider>
  </GridPropsContext.Provider>
  )
};
// XGRID DEFINITION Option 1
// export const XGridWrapperComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
//   function XGridWrapperComponent(props, ref) {
//     const apiRef = useGridApiRef(props.apiRef);
//     useXGrid(apiRef, props);
//     return (
//       <GridContextProvider {...props} apiRef={apiRef} >
//         <GridBody {...props} ref={ref}/>
//       </GridContextProvider>
//     );
//   },
// );
// XGRID DEFINITION Option 2
export const XGridBody = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function XGridBody(props, ref) {
    const apiRef  = React.useContext(GridApiContext);
    useXGrid(apiRef, props);
    return (
      <GridBody {...props} ref={ref}/>
    );
  },
);
// Not working but my favourite option
export const XGridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function XGridComponent(props, ref) {
    return (
      <GridContextProvider {...props} >
        <XGridBody {...props} ref={ref}/>
      </GridContextProvider>
    );
  },
);
// How to recompose the api type?
// How to register new api method?

// export const GridComponent = XGridComponent;
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const apiRef = useGridApiRef(props.apiRef);

    useXGrid(apiRef, props);

    return (
      <GridContextProvider {...props} apiRef={apiRef}  >
          <GridBody {...props} ref={ref}/>
        {/*<XGridBody {...props} ref={ref}/>*/}
      </GridContextProvider>
    );
  },
);
