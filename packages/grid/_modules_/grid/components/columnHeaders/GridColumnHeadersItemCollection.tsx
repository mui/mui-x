import * as React from 'react';
import { GRID_COL_RESIZE_START, GRID_COL_RESIZE_STOP } from '../../constants/eventsConstants';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { filterGridColumnLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import {
  gridTabIndexCellSelector,
  gridTabIndexColumnHeaderSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import { renderStateSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { useGridApiEventHandler } from '../../hooks/root/useGridApiEventHandler';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridColumns } from '../../models/colDef/gridColDef';
import { GridApiContext } from '../GridApiContext';
import { GridColumnHeaderItem } from './GridColumnHeaderItem';

export interface GridColumnHeadersItemCollectionProps {
  columns: GridColumns;
}

export function GridColumnHeadersItemCollection(props: GridColumnHeadersItemCollectionProps) {
  const { columns } = props;
  const [resizingColField, setResizingColField] = React.useState('');
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const filterColumnLookup = useGridSelector(apiRef, filterGridColumnLookupSelector);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const renderCtx = useGridSelector(apiRef, renderStateSelector).renderContext;
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);

  const handleResizeStart = React.useCallback((params) => {
    setResizingColField(params.field);
  }, []);
  const handleResizeStop = React.useCallback(() => {
    setResizingColField('');
  }, []);

  // TODO refactor by putting resizing in the state so we avoid adding listeners.
  useGridApiEventHandler(apiRef!, GRID_COL_RESIZE_START, handleResizeStart);
  useGridApiEventHandler(apiRef!, GRID_COL_RESIZE_STOP, handleResizeStop);

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
      (tabIndexState !== null && tabIndexState.colIndex === colIndex) ||
      (isFirstColumn && !hasTabbableElement)
        ? 0
        : -1;
    const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.colIndex === colIndex;
    return (
      <GridColumnHeaderItem
        key={col.field}
        {...sortColumnLookup[col.field]}
        filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
        options={options}
        isDragging={col.field === dragCol}
        column={col}
        colIndex={getColIndex(idx)}
        isResizing={resizingColField === col.field}
        hasFocus={hasFocus}
        tabIndex={tabIndex}
      />
    );
  });

  return <React.Fragment>{items}</React.Fragment>;
}
