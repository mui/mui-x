import * as React from 'react';
import { COL_RESIZE_START, COL_RESIZE_STOP } from '../../constants/eventsConstants';
import { columnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { filterColumnLookupSelector } from '../../hooks/features/filter/filterSelector';
import { sortColumnLookupSelector } from '../../hooks/features/sorting/sortingSelector';
import { useApiEventHandler } from '../../hooks/root/useApiEventHandler';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { Columns } from '../../models/colDef/colDef';
import { ApiContext } from '../api-context';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { PreferencesPanel } from '../panel/PreferencesPanel';
import { ColumnHeaderItem } from './ColumnHeaderItem';

export interface ColumnHeadersItemCollectionProps {
  columns: Columns;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItemCollection: React.FC<ColumnHeadersItemCollectionProps> = ({
  separatorProps,
  columns,
}) => {
  const [resizingColField, setResizingColField] = React.useState('');
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const sortColumnLookup = useGridSelector(apiRef, sortColumnLookupSelector);
  const filterColumnLookup = useGridSelector(apiRef, filterColumnLookupSelector);
  const dragCol = useGridSelector(apiRef, columnReorderDragColSelector);

  const handleResizeStart = React.useCallback((params) => {
    setResizingColField(params.field);
  }, []);
  const handleResizeStop = React.useCallback(() => {
    setResizingColField('');
  }, []);

  // TODO refactor by putting resizing in the state so we avoid adding listeners.
  useApiEventHandler(apiRef!, COL_RESIZE_START, handleResizeStart);
  useApiEventHandler(apiRef!, COL_RESIZE_STOP, handleResizeStop);

  const items = columns.map((col, idx) => (
    <ColumnHeaderItem
      key={col.field}
      {...sortColumnLookup[col.field]}
      filterItemsCounter={filterColumnLookup[col.field] && filterColumnLookup[col.field].length}
      options={options}
      isDragging={col.field === dragCol}
      column={col}
      colIndex={idx}
      isResizing={resizingColField === col.field}
      separatorProps={separatorProps}
    />
  ));

  return (
    <React.Fragment>
      <GridColumnHeaderMenu />
      <PreferencesPanel />
      {items}
    </React.Fragment>
  );
};
