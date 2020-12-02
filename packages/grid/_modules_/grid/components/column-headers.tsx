import * as React from 'react';
import { COL_RESIZE_START, COL_RESIZE_STOP } from '../constants/eventsConstants';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { Columns, RenderContextProps } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';
import { GridColumnHeaderMenu } from './menu/columnMenu/GridColumnHeaderMenu';
import { PreferencesPanel } from './tools/PreferencesPanel';
import { containerSizesSelector } from './viewport';
import { OptionsContext } from './options-context';
import { ScrollArea } from './ScrollArea';
import {
  sortColumnLookupSelector,
  useApiEventHandler,
  columnReorderDragColSelector,
} from '../hooks';

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

ColumnHeaderItemCollection.displayName = 'ColumnHeaderItemCollection';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = React.forwardRef<HTMLDivElement, ColumnsHeaderProps>((props, ref) => {
  const { columns, hasScrollX, renderCtx, separatorProps } = props;
  const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;
  const api = React.useContext(ApiContext);
  const { disableColumnReorder } = React.useContext(OptionsContext);
  const containerSizes = useGridSelector(api, containerSizesSelector);

  if (!api) {
    throw new Error('Material-UI: ApiRef was not found in context.');
  }
  const lastRenderedColIndexes = React.useRef({
    first: renderCtx?.firstColIdx,
    last: renderCtx?.lastColIdx,
  });
  const [renderedCols, setRenderedCols] = React.useState(columns);

  React.useEffect(() => {
    if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null) {
      setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));

      if (
        lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
        lastRenderedColIndexes.current.last !== renderCtx.lastColIdx
      ) {
        lastRenderedColIndexes.current = {
          first: renderCtx.firstColIdx,
          last: renderCtx.lastColIdx,
        };
      }
    }
  }, [renderCtx, columns]);

  const handleDragOver = !disableColumnReorder
    ? (event) => api.current.onColHeaderDragOver(event, ref as React.RefObject<HTMLElement>)
    : undefined;

  return (
    <React.Fragment>
      <ScrollArea scrollDirection="left" />
      {/* Header row isn't interactive, cells are, event delegation */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        ref={ref}
        className={wrapperCssClasses}
        aria-rowindex={1}
        role="row"
        style={{ minWidth: containerSizes?.totalSizes?.width }}
        onDragOver={handleDragOver}
      >
        <LeftEmptyCell width={renderCtx?.leftEmptyWidth} />
        <ColumnHeaderItemCollection columns={renderedCols} separatorProps={separatorProps} />
        <RightEmptyCell width={renderCtx?.rightEmptyWidth} />
      </div>
      <ScrollArea scrollDirection="right" />
    </React.Fragment>
  );
});
ColumnsHeader.displayName = 'GridColumnsHeader';
