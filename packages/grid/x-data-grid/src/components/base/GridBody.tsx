import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridMainContainer } from '../containers/GridMainContainer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridColumnPositionsSelector,
  gridColumnVisibilityModelSelector,
  gridVisibleColumnDefinitionsSelector,
} from '../../hooks/features/columns/gridColumnsSelector';
import { gridFilterActiveItemsLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
  unstable_gridTabIndexColumnGroupHeaderSelector,
  unstable_gridFocusColumnGroupHeaderSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';
import { gridDensityFactorSelector } from '../../hooks/features/density/densitySelector';
import {
  gridColumnGroupsHeaderMaxDepthSelector,
  gridColumnGroupsHeaderStructureSelector,
} from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { gridColumnMenuSelector } from '../../hooks/features/columnMenu/columnMenuSelector';

interface GridBodyProps {
  children?: React.ReactNode;
  ColumnHeadersProps?: Record<string, any>;
  VirtualScrollerComponent: React.JSXElementConstructor<
    React.HTMLAttributes<HTMLDivElement> & {
      ref: React.Ref<HTMLDivElement>;
    }
  >;
}

function GridBody(props: GridBodyProps) {
  const { VirtualScrollerComponent, ColumnHeadersProps, children } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const columnHeaderTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnGroupHeaderTabIndexState = useGridSelector(
    apiRef,
    unstable_gridTabIndexColumnGroupHeaderSelector,
  );

  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const columnGroupHeaderFocus = useGridSelector(
    apiRef,
    unstable_gridFocusColumnGroupHeaderSelector,
  );

  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);

  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const columnVisibility = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const columnGroupsHeaderStructure = useGridSelector(
    apiRef,
    gridColumnGroupsHeaderStructureSelector,
  );

  const hasOtherElementInTabSequence = !(
    columnGroupHeaderTabIndexState === null &&
    columnHeaderTabIndexState === null &&
    cellTabIndexState === null
  );

  useEnhancedEffect(() => {
    apiRef.current.computeSizeAndPublishResizeEvent();

    const elementToObserve = rootRef.current;
    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let animationFrame: number;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      animationFrame = window.requestAnimationFrame(() => {
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

  const columnHeadersRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.register('private', {
    columnHeadersContainerElementRef: columnsContainerRef,
    columnHeadersElementRef: columnHeadersRef,
    virtualScrollerRef,
    mainElementRef: rootRef,
  });

  const hasDimensions = !!apiRef.current.getRootDimensions();

  return (
    <GridMainContainer ref={rootRef}>
      <rootProps.slots.columnHeaders
        ref={columnsContainerRef}
        innerRef={columnHeadersRef}
        visibleColumns={visibleColumns}
        filterColumnLookup={filterColumnLookup}
        sortColumnLookup={sortColumnLookup}
        columnPositions={columnPositions}
        columnHeaderTabIndexState={columnHeaderTabIndexState}
        columnGroupHeaderTabIndexState={columnGroupHeaderTabIndexState}
        columnHeaderFocus={columnHeaderFocus}
        columnGroupHeaderFocus={columnGroupHeaderFocus}
        densityFactor={densityFactor}
        headerGroupingMaxDepth={headerGroupingMaxDepth}
        columnMenuState={columnMenuState}
        columnVisibility={columnVisibility}
        columnGroupsHeaderStructure={columnGroupsHeaderStructure}
        hasOtherElementInTabSequence={hasOtherElementInTabSequence}
        {...ColumnHeadersProps}
      />
      {hasDimensions && (
        <VirtualScrollerComponent
          // The content is only rendered after dimensions are computed because
          // the lazy-loading hook is listening to `renderedRowsIntervalChange`,
          // but only does something if the dimensions are also available.
          // If this event is published while dimensions haven't been computed,
          // the `onFetchRows` prop won't be called during mount.
          ref={virtualScrollerRef}
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
