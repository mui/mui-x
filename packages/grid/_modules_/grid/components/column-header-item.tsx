import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { sortModelSelector } from '../hooks/features/sorting/sortingSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ColDef } from '../models/colDef';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';
import { CursorCoordinates } from '../hooks/features/useColumnReorder';

interface ColumnHeaderItemProps {
  colIndex: number;
  column: ColDef;
  isResizing: boolean;
  onColumnDragEnter?: (event: Event) => void;
  onColumnDragOver?: (col: ColDef, coordinates: CursorCoordinates) => void;
  onColumnDragStart?: (col: ColDef, currentTarget: HTMLElement) => void;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItem = ({
  column,
  colIndex,
  onColumnDragStart,
  onColumnDragEnter,
  onColumnDragOver,
  isResizing,
  separatorProps,
}: ColumnHeaderItemProps) => {
  const apiRef = React.useContext(ApiContext);
  const gridSortModel = useGridSelector(apiRef, sortModelSelector);
  const { disableColumnReorder, showColumnRightBorder, disableColumnResize } = useGridSelector(
    apiRef,
    optionsSelector,
  );

  const columnSortModel = React.useMemo(
    () =>
      gridSortModel
        .filter((model) => model.field === column.field)
        .map((item) => ({
          sortDirection: item.sort,
          ...(gridSortModel.length <= 1 ? {} : { sortIndex: gridSortModel.indexOf(item) + 1 }),
        }))[0] || {},
    [column.field, gridSortModel],
  );

  let headerComponent: React.ReactElement | null = null;
  if (column.renderHeader) {
    headerComponent = column.renderHeader({
      api: apiRef!.current!,
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
  if (columnSortModel.sortDirection != null) {
    ariaSort = {
      'aria-sort': columnSortModel.sortDirection === 'asc' ? 'ascending' : 'descending',
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
            direction={columnSortModel.sortDirection}
            index={columnSortModel.sortIndex}
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
            direction={columnSortModel.sortDirection}
            index={columnSortModel.sortIndex}
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
