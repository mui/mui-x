import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridFilterActiveItemsLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import {
  gridFocusColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridTabIndexColumnHeaderSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import { gridRenderingSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnMenuSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderItem } from './GridColumnHeaderItem';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridScrollBarSizeSelector } from '../../hooks/features/container/gridContainerSizesSelector';

export interface GridColumnHeadersItemCollectionProps {
  columns: GridStateColDef[];
  dragCol: string;
  resizeCol: string;
}

function GridColumnHeadersItemCollection(props: GridColumnHeadersItemCollectionProps) {
  const { columns, dragCol, resizeCol } = props;
  const apiRef = useGridApiContext();
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const renderCtx = useGridSelector(apiRef, gridRenderingSelector).renderContext;
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const scrollBarState = useGridSelector(apiRef, gridScrollBarSizeSelector);
  const rootProps = useGridRootProps();

  const getColIndex = (index) => {
    if (renderCtx == null) {
      return index;
    }

    return index + renderCtx.firstColIdx;
  };

  const items = columns.map((col, idx) => {
    const colIndex = getColIndex(idx);
    const isFirstColumn = colIndex === 0;
    const hasTabbableElement = !(tabIndexState === null && cellTabIndexState === null);
    const tabIndex =
      (tabIndexState !== null && tabIndexState.field === col.field) ||
      (isFirstColumn && !hasTabbableElement)
        ? 0
        : -1;
    const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === col.field;
    const open = columnMenuState.open && columnMenuState.field === col.field;

    return (
      <GridColumnHeaderItem
        key={idx}
        {...sortColumnLookup[col.field]}
        columnMenuOpen={open}
        filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
        headerHeight={headerHeight}
        isDragging={col.field === dragCol}
        column={col}
        colIndex={colIndex}
        isResizing={resizeCol === col.field}
        isLastColumn={colIndex === columns.length - 1}
        extendRowFullWidth={!rootProps.disableExtendRowFullWidth}
        hasScrollX={scrollBarState.hasScrollX}
        hasScrollY={scrollBarState.hasScrollY}
        hasFocus={hasFocus}
        tabIndex={tabIndex}
      />
    );
  });

  return <React.Fragment>{items}</React.Fragment>;
}

GridColumnHeadersItemCollection.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dragCol: PropTypes.string.isRequired,
  resizeCol: PropTypes.string.isRequired,
} as any;

export { GridColumnHeadersItemCollection };
