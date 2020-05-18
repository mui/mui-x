import { ColDef } from '../models/colDef';
import React, { useContext } from 'react';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { ColumnHeaderSortIcon } from './column-header-sort-icon';
import { ColumnHeaderTitle } from './column-header-title';
import { ColumnHeaderSeparator } from './column-header-separator';

interface ColumnHeaderItemProps {
  column: ColDef;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
  colIndex: number;
  onResizeColumn: (c: any) => void;
}

export const ColumnHeaderItem = React.memo(
  ({ column, icons, colIndex, headerHeight, onResizeColumn }: ColumnHeaderItemProps) => {
    const api = useContext(ApiContext);

    const cssClass = classnames(
      HEADER_CELL_CSS_CLASS,
      column.headerClass,
      column.headerAlign !== 'left' ? column.headerAlign : '',
      { sortable: column.sortable },
    );

    let headerComponent: React.ReactElement | null = null;
    if (column.headerComponent) {
      headerComponent = column.headerComponent({ api: api!.current!, colDef: column, colIndex });
    }

    const onResize = () => {
      onResizeColumn(column);
    };

    const width = column.width!;
    return (
      <div
        className={cssClass}
        key={column.field}
        data-field={column.field}
        style={{ width: width, minWidth: width, maxWidth: width, maxHeight: headerHeight, minHeight: headerHeight }}
        role={'column-header'}
        tabIndex={-1}
      >
        {headerComponent || (
          <ColumnHeaderTitle
            label={column.headerName || column.field}
            description={column.description}
            columnWidth={width}
          />
        )}
        <ColumnHeaderSortIcon
          direction={column.sortDirection}
          index={column.sortIndex}
          icons={icons}
          hide={column.hideSortIcons}
        />
        <ColumnHeaderSeparator resizable={column.resizable} onResize={onResize} />
      </div>
    );
  },
);
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
