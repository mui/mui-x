import * as React from 'react';
import { ColDef } from '../models/colDef';
import { GridOptions } from '../models/gridOptions';
import { SortModel } from '../models/sortModel';
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
  sortModel: SortModel;
  options: GridOptions;
  onColumnDragEnter?: (event: Event) => void;
  onColumnDragOver?: (col: ColDef, coordinates: CursorCoordinates) => void;
  onColumnDragStart?: (col: ColDef, currentTarget: HTMLElement) => void;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItem = React.memo(
  ({
    column,
    colIndex,
    onColumnDragStart,
    onColumnDragEnter,
    onColumnDragOver,
    isResizing,
    separatorProps,
    sortModel,
    options,
  }: ColumnHeaderItemProps) => {
    const apiRef = React.useContext(ApiContext);
    const { disableColumnReorder, showColumnRightBorder, disableColumnResize } = options;

    const columnSortModel = React.useMemo(
      () =>
        sortModel
          .filter((model) => model.field === column.field)
          .map((item) => ({
            sortDirection: item.sort,
            ...(sortModel.length <= 1 ? {} : { sortIndex: sortModel.indexOf(item) + 1 }),
          }))[0] || {},
      [column.field, sortModel],
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
  },
);
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
