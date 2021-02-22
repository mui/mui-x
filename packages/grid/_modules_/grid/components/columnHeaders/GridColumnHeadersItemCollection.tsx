import * as React from 'react';
import { GRID_COL_RESIZE_START, GRID_COL_RESIZE_STOP } from '../../constants/eventsConstants';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { filterGridColumnLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
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

  const handleResizeStart = React.useCallback((params) => {
    setResizingColField(params.field);
  }, []);
  const handleResizeStop = React.useCallback(() => {
    setResizingColField('');
  }, []);

  // TODO refactor by putting resizing in the state so we avoid adding listeners.
  useGridApiEventHandler(apiRef!, GRID_COL_RESIZE_START, handleResizeStart);
  useGridApiEventHandler(apiRef!, GRID_COL_RESIZE_STOP, handleResizeStop);

  const items = columns.map((col, idx) => (
    <GridColumnHeaderItem
      key={col.field}
      {...sortColumnLookup[col.field]}
      filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
      options={options}
      isDragging={col.field === dragCol}
      column={col}
      colIndex={idx}
      isResizing={resizingColField === col.field}
    />
  ));

  return <React.Fragment>{items}</React.Fragment>;
}
