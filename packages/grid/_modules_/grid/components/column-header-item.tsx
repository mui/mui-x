import * as React from 'react';
import { ColDef } from '../models/colDef';
import { GridOptions } from '../models/gridOptions';
import { SortDirection } from '../models/sortModel';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';

interface ColumnHeaderItemProps {
  colIndex: number;
  column: ColDef;
  isDragging: boolean;
  isResizing: boolean;
  sortDirection: SortDirection;
  sortIndex?: number;
  options: GridOptions;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItem = ({
  column,
  colIndex,
  isDragging,
  isResizing,
  separatorProps,
  sortDirection,
  sortIndex,
  options,
}: ColumnHeaderItemProps) => {
  const apiRef = React.useContext(ApiContext);
  const { disableColumnReorder, showColumnRightBorder, disableColumnResize } = options;

  let headerComponent: React.ReactElement | null = null;
  if (column.renderHeader) {
    headerComponent = column.renderHeader({
      api: apiRef!.current!,
      colDef: column,
      colIndex,
      field: column.field,
    });
  }

  const onDragStart = React.useCallback(
    (event) => apiRef!.current.onColItemDragStart(column, event.currentTarget),
    [apiRef, column],
  );
  const onDragEnter = React.useCallback((event) => apiRef!.current.onColItemDragEnter(event), [
    apiRef,
  ]);
  const onDragOver = React.useCallback(
    (event) =>
      apiRef!.current.onColItemDragOver(column, {
        x: event.clientX,
        y: event.clientY,
      }),
    [apiRef, column],
  );

  const dragConfig = {
    draggable: !disableColumnReorder,
    onDragStart,
    onDragEnter,
    onDragOver,
  };
  const width = column.width!;

  let ariaSort: any;
  if (sortDirection != null) {
    ariaSort = {
      'aria-sort': sortDirection === 'asc' ? 'ascending' : 'descending',
    };
  }

  return (
    <div
      className={classnames(
        HEADER_CELL_CSS_CLASS,
        showColumnRightBorder ? 'MuiDataGrid-withBorder' : '',
        column.headerClassName,
        column.headerAlign === 'center' && 'MuiDataGrid-colCellCenter',
        column.headerAlign === 'right' && 'MuiDataGrid-colCellRight',
        {
          'MuiDataGrid-colCellSortable': column.sortable,
          'MuiDataGrid-colCellMoving': isDragging,
        },
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
            direction={sortDirection}
            index={sortIndex}
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
            direction={sortDirection}
            index={sortIndex}
            hide={column.hideSortIcons}
          />
        )}
      </div>
      <ColumnHeaderSeparator
        resizable={!disableColumnResize && !!column.resizable}
        resizing={isResizing}
        {...separatorProps}
      />
    </div>
  );
};
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
