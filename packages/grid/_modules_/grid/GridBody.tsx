import NoSsr from '@material-ui/core/NoSsr';
import { useForkRef } from '@material-ui/core/utils';
import clsx from 'clsx';
import * as React from 'react';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridRoot } from './components/containers/GridRoot';
import { GridWindow } from './components/containers/GridWindow';
import { GridApiContext } from './components/GridApiContext';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { ErrorHandler } from './ErrorHandler';
import { GridComponentProps } from './GridComponentProps';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { visibleGridRowCountSelector } from './hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from './hooks/features/rows/gridRowsSelector';
import { optionsSelector } from './hooks/utils/optionsSelector';
import { GridRootContainerRef } from './models/gridRootContainerRef';

//TODO split this
export const GridBody = React.forwardRef<HTMLDivElement, GridComponentProps>(function GridBody(
  props,
  ref,
) {
  const apiRef = React.useContext(GridApiContext)!;
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const showNoRowsOverlay = !props.loading && totalRowCount === 0;
  const showNoResultsOverlay = !props.loading && totalRowCount > 0 && visibleRowCount === 0;

  apiRef.current.rootElementRef = rootContainerRef;
  apiRef.current.columnHeadersContainerElementRef = columnsContainerRef;
  apiRef.current.columnHeadersElementRef = columnsHeaderRef;
  apiRef.current.windowRef = windowRef;
  apiRef.current.renderingZoneRef = renderingZoneRef;
  apiRef.current.headerRef = headerRef;
  apiRef.current.footerRef = footerRef;

  if (!apiRef.current) {
    return null;
  }
  return (
    <NoSsr>
      <GridRoot ref={handleRef} className={clsx(options.classes?.root, props.className)}>
        <ErrorHandler>
          <div ref={headerRef}>
            <apiRef.current.components.Header {...props.componentsProps?.header} />
          </div>
          <GridMainContainer>
            <Watermark licenseStatus={props.licenseStatus} />
            <GridColumnsContainer ref={columnsContainerRef}>
              <GridColumnsHeader ref={columnsHeaderRef} />
            </GridColumnsContainer>
            {showNoRowsOverlay && (
              <apiRef.current.components.NoRowsOverlay {...props.componentsProps?.noRowsOverlay} />
            )}
            {showNoResultsOverlay && (
              <apiRef.current.components.NoResultsOverlay
                {...props.componentsProps?.noResultsOverlay}
              />
            )}
            {props.loading && (
              <apiRef.current.components.LoadingOverlay
                {...props.componentsProps?.loadingOverlay}
              />
            )}
            <GridAutoSizer nonce={props.nonce} disableHeight={props.autoHeight}>
              {(size: any) => (
                <GridWindow ref={windowRef} size={size}>
                  <GridViewport ref={renderingZoneRef} />
                </GridWindow>
              )}
            </GridAutoSizer>
          </GridMainContainer>
          {!options.hideFooter && (
            <div ref={footerRef}>
              <apiRef.current.components.Footer {...props.componentsProps?.footer} />
            </div>
          )}
        </ErrorHandler>
      </GridRoot>
    </NoSsr>
  );
});
