import * as React from 'react';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridWindow } from './components/containers/GridWindow';
import { GridApiContext } from './components/GridApiContext';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { GRID_RESIZE } from './constants/eventsConstants';
import { GridRootPropsContext } from './context/GridRootPropsContext';
import { GridOverlays } from './GridOverlays';
import { ElementSize } from './models/elementSize';

export function GridBody() {
  const apiRef = React.useContext(GridApiContext)!;
  const rootProps = React.useContext(GridRootPropsContext)!;

  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.columnHeadersContainerElementRef = columnsContainerRef;
  apiRef.current.columnHeadersElementRef = columnsHeaderRef;
  apiRef.current.windowRef = windowRef;
  apiRef.current.renderingZoneRef = renderingZoneRef;

  const handleResize = React.useCallback(
    (size: ElementSize) => apiRef.current.publishEvent(GRID_RESIZE, size),
    [apiRef],
  );

  return (
    <GridMainContainer>
      <GridOverlays />
      <Watermark licenseStatus={rootProps.licenseStatus} />
      <GridColumnsContainer ref={columnsContainerRef}>
        <GridColumnsHeader ref={columnsHeaderRef} />
      </GridColumnsContainer>
      <GridAutoSizer nonce={rootProps.nonce} disableHeight={rootProps.autoHeight} onResize={handleResize}>
        {(size: any) => (
          <GridWindow ref={windowRef} size={size}>
            <GridViewport ref={renderingZoneRef} />
          </GridWindow>
        )}
      </GridAutoSizer>
    </GridMainContainer>
  );
}
