import * as React from 'react';
import { ColDef } from '../models/colDef';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';
import { OptionsContext } from './options-context';
import { CursorCoordinates } from '../hooks/features/useColumnReorder';

interface ColumnHeaderItemProps {
  column: ColDef;
  colIndex: number;
  onResizeColumn?: (c: any) => void;
  onColumnDragStart?: (c: ColDef, h: HTMLElement) => void;
  onColumnDragEnter?: (c: ColDef, p: CursorCoordinates) => void;
}
const headerAlignPropToCss = {
  center: 'MuiDataGrid-colCellCenter',
  right: 'MuiDataGrid-colCellRight',
};
export const ColumnHeaderItem = React.memo(
  ({
    column,
    colIndex,
    onResizeColumn,
    onColumnDragStart,
    onColumnDragEnter,
  }: ColumnHeaderItemProps) => {
    const api = React.useContext(ApiContext);
    const { showColumnRightBorder, disableColumnResize, disableColumnReorder } = React.useContext(
      OptionsContext,
    );

    const cssClass = classnames(
      HEADER_CELL_CSS_CLASS,
      showColumnRightBorder ? 'MuiDataGrid-withBorder' : '',
      column.headerClassName,
      column.headerAlign &&
        column.headerAlign !== 'left' &&
        headerAlignPropToCss[column.headerAlign],
      { 'MuiDataGrid-colCellSortable': column.sortable },
    );

    let headerComponent: React.ReactElement | null = null;
    if (column.renderHeader) {
      headerComponent = column.renderHeader({
        api: api!.current!,
        colDef: column,
        colIndex,
        field: column.field,
      });
    }

    const handleResize =
      onResizeColumn && !disableColumnReorder ? () => onResizeColumn(column) : undefined;
    const onDragStart =
      onColumnDragStart && !disableColumnReorder
        ? (event) => onColumnDragStart(column, event.target)
        : undefined;
    const onDragEnter = onColumnDragEnter ? (event) => {
      onColumnDragEnter(column, {
        x: event.clientX,
        y: event.clientY,
      });
    } : undefined;

    const width = column.width!;

    let ariaSort: any;
    if (column.sortDirection != null) {
      ariaSort = { 'aria-sort': column.sortDirection === 'asc' ? 'ascending' : 'descending' };
    }

    return (
      <div
        className={cssClass}
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
        <div
          className="MuiDataGrid-colCell-draggable"
          draggable={!disableColumnReorder && !!onDragStart && !!onDragEnter}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
        >
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
          resizable={!disableColumnResize && column.resizable}
          onResize={handleResize}
        />
      </div>
    );
  },
);
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
