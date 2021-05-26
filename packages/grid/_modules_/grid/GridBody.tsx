import * as React from 'react';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridWindow } from './components/containers/GridWindow';
import { GridApiContext } from './components/GridApiContext';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { GridPropsContext } from './GridComponent';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { visibleGridRowCountSelector } from './hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from './hooks/features/rows/gridRowsSelector';

export function GridOverlays() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

  const showNoRowsOverlay = !props.loading && totalRowCount === 0;
  const showNoResultsOverlay = !props.loading && totalRowCount > 0 && visibleRowCount === 0;

  return (
    <React.Fragment>
      {showNoRowsOverlay && (
        <apiRef.current.components.NoRowsOverlay {...props.componentsProps?.noRowsOverlay} />
      )}
      {showNoResultsOverlay && (
        <apiRef.current.components.NoResultsOverlay {...props.componentsProps?.noResultsOverlay} />
      )}
      {props.loading && (
        <apiRef.current.components.LoadingOverlay {...props.componentsProps?.loadingOverlay} />
      )}
    </React.Fragment>
  );
}

export function GridBody() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;

  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.columnHeadersContainerElementRef = columnsContainerRef;
  apiRef.current.columnHeadersElementRef = columnsHeaderRef;
  apiRef.current.windowRef = windowRef;
  apiRef.current.renderingZoneRef = renderingZoneRef;

  return (
    <GridMainContainer>
      <GridOverlays />
      <Watermark licenseStatus={props.licenseStatus} />
      <GridColumnsContainer ref={columnsContainerRef}>
        <GridColumnsHeader ref={columnsHeaderRef} />
      </GridColumnsContainer>
      <GridAutoSizer nonce={props.nonce} disableHeight={props.autoHeight}>
        {(size: any) => (
          <GridWindow ref={windowRef} size={size}>
            <GridViewport ref={renderingZoneRef} />
          </GridWindow>
        )}
      </GridAutoSizer>
    </GridMainContainer>
  );
}
