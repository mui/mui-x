import * as React from 'react';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridWindow } from './components/containers/GridWindow';
import { GridApiContext } from './components/GridApiContext';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { GridPropsContext } from './context/GridPropsContext';
import { GridOverlays } from './GridOverlays';

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
