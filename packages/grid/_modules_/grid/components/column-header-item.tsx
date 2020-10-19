import * as React from 'react';
import { ColDef } from '../models/colDef';
import { ApiRef } from '../models/api';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { COL_RESIZE_START, COL_RESIZE_STOP } from '../constants/eventsConstants';
import { classnames } from '../utils';
import { useApiEventHandler } from '../hooks/root/useApiEventHandler';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';
import { OptionsContext } from './options-context';
import { CursorCoordinates } from '../hooks/features/useColumnReorder';

interface ColumnHeaderItemProps {
  colIndex: number;
  column: ColDef;
  onColumnDragEnter?: (event: Event) => void;
  onColumnDragOver?: (col: ColDef, coordinates: CursorCoordinates) => void;
  onColumnDragStart?: (col: ColDef, currentTarget: HTMLElement) => void;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItem = React.memo((props: ColumnHeaderItemProps) => {
  const {
    colIndex,
    column,
    onColumnDragEnter,
    onColumnDragOver,
    onColumnDragStart,
    separatorProps,
  } = props;
  const apiRef = React.useContext(ApiContext) as ApiRef;
  const { showColumnRightBorder, disableColumnResize, disableColumnReorder } = React.useContext(
    OptionsContext,
  );

  const [resizing, setResizing] = React.useState(false);
  const handleResizeStart = React.useCallback(
    (params) => {
      if (column.field === params.field) {
        setResizing(true);
      }
    },
    [column.field],
  );
  const handleResizeStop = React.useCallback(() => {
    setResizing(false);
  }, []);
  useApiEventHandler(apiRef, COL_RESIZE_START, handleResizeStart);
  useApiEventHandler(apiRef, COL_RESIZE_STOP, handleResizeStop);

  let headerComponent: React.ReactElement | null = null;
  if (column.renderHeader) {
    headerComponent = column.renderHeader({
      api: apiRef.current!,
      colDef: column,
      colIndex,
      field: column.field,
    });
  }

  const dragConfig = {
    draggable:
      !disableColumnReorder && !!onColumnDragStart && !!onColumnDragEnter && !!onColumnDragOver,
    onDragStart: onColumnDragStart && ((event) => onColumnDragStart(column, event.currentTarget)),
    onDragEnter: onColumnDragEnter && ((event) => onColumnDragEnter(event)),
    onDragOver:
      onColumnDragOver &&
      ((event) => {
        onColumnDragOver(column, {
          x: event.clientX,
          y: event.clientY,
        });
      }),
  };
  const width = column.width!;

  let ariaSort: any;
  if (column.sortDirection != null) {
    ariaSort = { 'aria-sort': column.sortDirection === 'asc' ? 'ascending' : 'descending' };
  }

  return (
    <div
      className={classnames(
        HEADER_CELL_CSS_CLASS,
        showColumnRightBorder ? 'MuiDataGrid-withBorder' : '',
        column.headerClassName,
        column.headerAlign === 'center' && 'MuiDataGrid-colCellCenter',
        column.headerAlign === 'right' && 'MuiDataGrid-colCellRight',
        { 'MuiDataGrid-colCellSortable': column.sortable },
      )}
      key={column.field}
      data-field={column.field}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
      tabIndex={-1}
      aria-colindex={colIndex + 1}
      {...ariaSort}
    >
      <div className="MuiDataGrid-colCell-draggable" {...dragConfig}>
        {column.type === 'number' && (
          <ColumnHeaderSortIcon
            direction={column.sortDirection}
            index={column.sortIndex}
            hide={column.hideSortIcons}
          />
        )}
        {headerComponent || (
          <ColumnHeaderTitle
            label={column.headerName || column.field}
            description={column.description}
            columnWidth={width}
          />
        )}
        {column.type !== 'number' && (
          <ColumnHeaderSortIcon
            direction={column.sortDirection}
            index={column.sortIndex}
            hide={column.hideSortIcons}
          />
        )}
      </div>
      <ColumnHeaderSeparator
        resizable={disableColumnResize ? false : Boolean(column.resizable)}
        resizing={resizing}
        {...separatorProps}
      />
    </div>
  );
});
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
