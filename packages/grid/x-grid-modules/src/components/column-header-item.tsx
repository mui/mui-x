import * as React from 'react';
import { ColDef } from '../models/colDef';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';
import { OptionsContext } from './options-context';

interface ColumnHeaderItemProps {
  column: ColDef;
  colIndex: number;
  onResizeColumn?: (c: any) => void;
}
const headerAlignPropToCss = {
  center: 'MuiDataGrid-colCellCenter',
  right: 'MuiDataGrid-colCellRight',
};
export const ColumnHeaderItem = React.memo(
  ({ column, colIndex, onResizeColumn }: ColumnHeaderItemProps) => {
    const api = React.useContext(ApiContext);
    const { headerHeight, showColumnRightBorder, disableColumnResize } = React.useContext(
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

    const handleResize = onResizeColumn ? () => onResizeColumn(column) : undefined;

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
          maxHeight: headerHeight,
          minHeight: headerHeight,
        }}
        role="columnheader"
        tabIndex={-1}
        aria-colindex={colIndex + 1}
        {...ariaSort}
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
        <ColumnHeaderSeparator
          resizable={!disableColumnResize && column.resizable}
          onResize={handleResize}
        />
      </div>
    );
  },
);
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
