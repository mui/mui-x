import * as React from 'react';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { gridResizingColumnFieldSelector } from '../../hooks/features/columnResize/columnResizeSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { filterGridColumnLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridColumns } from '../../models/colDef/gridColDef';
import { GridApiContext } from '../GridApiContext';
import { GridColumnHeaderItem } from './GridColumnHeaderItem';

export interface GridColumnHeadersItemCollectionProps {
  columns: GridColumns;
}

export function GridColumnHeadersItemCollection(props: GridColumnHeadersItemCollectionProps) {
  const { columns } = props;
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const filterColumnLookup = useGridSelector(apiRef, filterGridColumnLookupSelector);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const resizingColumnField = useGridSelector(apiRef, gridResizingColumnFieldSelector);

  const items = columns.map((col, idx) => (
    <GridColumnHeaderItem
      key={col.field}
      {...sortColumnLookup[col.field]}
      filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
      options={options}
      isDragging={col.field === dragCol}
      column={col}
      colIndex={idx}
      isResizing={resizingColumnField === col.field}
    />
  ));

  return <React.Fragment>{items}</React.Fragment>;
}
