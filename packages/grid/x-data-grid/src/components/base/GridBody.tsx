import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridMainContainer } from '../containers/GridMainContainer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridVirtualScrollerProps } from '../DataGridVirtualScroller';

interface GridBodyProps {
  children?: React.ReactNode;
  ColumnHeadersProps?: Record<string, any>;
  VirtualScrollerComponent: React.JSXElementConstructor<DataGridVirtualScrollerProps>;
}

function GridBody(props: GridBodyProps) {
  const { VirtualScrollerComponent, ColumnHeadersProps, children } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rootRef = React.useRef<HTMLDivElement>(null);

  useEnhancedEffect(() => {
    apiRef.current.computeSizeAndPublishResizeEvent();

    const elementToObserve = rootRef.current;
    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let animationFrame: number;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      animationFrame = requestAnimationFrame(() => {
        apiRef.current.computeSizeAndPublishResizeEvent();
      });
    });

    if (elementToObserve) {
      observer.observe(elementToObserve);
    }

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (elementToObserve) {
        observer.unobserve(elementToObserve);
      }
    };
  }, [apiRef]);

  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.register('private', {
    virtualScrollerRef,
    mainElementRef: rootRef,
  });

  const hasDimensions = !!apiRef.current.getRootDimensions();

  return (
    <GridMainContainer ref={rootRef}>
      {hasDimensions && (
        <VirtualScrollerComponent
          // The content is only rendered after dimensions are computed because
          // the lazy-loading hook is listening to `renderedRowsIntervalChange`,
          // but only does something if the dimensions are also available.
          // If this event is published while dimensions haven't been computed,
          // the `onFetchRows` prop won't be called during mount.
          ref={virtualScrollerRef}
          ColumnHeadersProps={ColumnHeadersProps}
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
  ColumnHeadersProps: PropTypes.object,
  VirtualScrollerComponent: PropTypes.elementType.isRequired,
} as any;

export { GridBody };
