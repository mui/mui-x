import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useResizeObserver } from '../../hooks/utils/useResizeObserver';
import { GridMainContainer } from '../containers/GridMainContainer';
import { GridVirtualScroller } from '../virtualization/GridVirtualScroller';

interface GridBodyProps {
  children?: React.ReactNode;
}

function GridBody(props: GridBodyProps) {
  const { children } = props;
  const apiRef = useGridPrivateApiContext();

  useResizeObserver(apiRef.current.mainElementRef, () => apiRef.current.resize());

  const hasDimensions = apiRef.current.getRootDimensions().isReady;

  return (
    <GridMainContainer ref={apiRef.current.mainElementRef}>
      {hasDimensions && (
        <GridVirtualScroller
          // The content is only rendered after dimensions are computed because
          // the lazy-loading hook is listening to `renderedRowsIntervalChange`,
          // but only does something if the dimensions are also available.
          // If this event is published while dimensions haven't been computed,
          // the `onFetchRows` prop won't be called during mount.
          ref={apiRef.current.virtualScrollerRef}
        />
      )}

      {children}
    </GridMainContainer>
  );
}

GridBody.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
} as any;

export { GridBody };
