import * as React from 'react';
import PropTypes from 'prop-types';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { gridResizingColumnFieldSelector } from '../../hooks/features/columnResize/columnResizeSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { filterGridColumnLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import {
  gridFocusColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridTabIndexColumnHeaderSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import { renderStateSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnMenuStateSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridColumnHeaderItem } from './GridColumnHeaderItem';

export interface GridColumnHeadersItemCollectionProps {
  columns: GridStateColDef[];
}

function GridColumnHeadersItemCollection(props: GridColumnHeadersItemCollectionProps) {
  const { columns } = props;
  const apiRef = useGridApiContext();
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const filterColumnLookup = useGridSelector(apiRef, filterGridColumnLookupSelector);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const resizingColumnField = useGridSelector(apiRef, gridResizingColumnFieldSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const renderCtx = useGridSelector(apiRef, renderStateSelector).renderContext;
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuStateSelector);

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
        key={col.field}
        {...sortColumnLookup[col.field]}
        columnMenuOpen={open}
        filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
        headerHeight={headerHeight}
        isDragging={col.field === dragCol}
        column={col}
        colIndex={colIndex}
        isResizing={resizingColumnField === col.field}
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
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.oneOf(['center', 'left', 'right']),
      cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      computedWidth: PropTypes.number.isRequired,
      description: PropTypes.string,
      disableColumnMenu: PropTypes.bool,
      disableExport: PropTypes.bool,
      disableReorder: PropTypes.bool,
      editable: PropTypes.bool,
      field: PropTypes.string.isRequired,
      filterable: PropTypes.bool,
      filterOperators: PropTypes.arrayOf(
        PropTypes.shape({
          getApplyFilterFn: PropTypes.func.isRequired,
          InputComponent: PropTypes.elementType,
          InputComponentProps: PropTypes.object,
          label: PropTypes.string,
          value: PropTypes.string.isRequired,
        }),
      ),
      flex: PropTypes.number,
      headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
      headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      headerName: PropTypes.string,
      hide: PropTypes.bool,
      hideSortIcons: PropTypes.bool,
      minWidth: PropTypes.number,
      renderCell: PropTypes.func,
      renderEditCell: PropTypes.func,
      renderHeader: PropTypes.func,
      resizable: PropTypes.bool,
      sortable: PropTypes.bool,
      sortComparator: PropTypes.func,
      type: PropTypes.string,
      valueFormatter: PropTypes.func,
      valueGetter: PropTypes.func,
      valueOptions: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
          }),
          PropTypes.string,
        ]).isRequired,
      ),
      valueParser: PropTypes.func,
      width: PropTypes.number,
    }),
  ).isRequired,
} as any;

export { GridColumnHeadersItemCollection };
