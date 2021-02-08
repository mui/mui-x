import * as React from 'react';
import { COLUMN_HEADER_CLICK } from '../../constants/eventsConstants';
import { ColDef, NUMBER_COLUMN_TYPE } from '../../models/colDef/index';
import { GridOptions } from '../../models/gridOptions';
import { ColParams } from '../../models/params/colParams';
import { SortDirection } from '../../models/sortModel';
import { ApiContext } from '../api-context';
import { HEADER_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';
import { classnames } from '../../utils/index';
import { ColumnHeaderSortIcon } from './ColumnHeaderSortIcon';
import { ColumnHeaderTitle } from './ColumnHeaderTitle';
import { ColumnHeaderSeparator } from './ColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';

interface ColumnHeaderItemProps {
  colIndex: number;
  column: ColDef;
  isDragging: boolean;
  isResizing: boolean;
  sortDirection: SortDirection;
  sortIndex?: number;
  options: GridOptions;
  filterItemsCounter?: number;
}

export const ColumnHeaderItem = ({
  column,
  colIndex,
  isDragging,
  isResizing,
  sortDirection,
  sortIndex,
  options,
  filterItemsCounter,
}: ColumnHeaderItemProps) => {
  const apiRef = React.useContext(ApiContext);
  const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);
  const {
    disableColumnReorder,
    showColumnRightBorder,
    disableColumnResize,
    disableColumnMenu,
  } = options;
  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === NUMBER_COLUMN_TYPE;

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
  const onHeaderTitleClick = React.useCallback(() => {
    const colHeaderParams: ColParams = {
      field: column.field,
      colDef: column,
      colIndex,
      api: apiRef!.current,
    };
    apiRef!.current.publishEvent(COLUMN_HEADER_CLICK, colHeaderParams);
  }, [apiRef, colIndex, column]);

  const cssClasses = classnames(
    HEADER_CELL_CSS_CLASS,
    column.headerClassName,
    column.headerAlign === 'center' && 'MuiDataGrid-colCellCenter',
    column.headerAlign === 'right' && 'MuiDataGrid-colCellRight',
    {
      'MuiDataGrid-colCellSortable': column.sortable,
      'MuiDataGrid-colCellMoving': isDragging,
      'MuiDataGrid-colCellSorted': isColumnSorted,
      'MuiDataGrid-colCellNumeric': isColumnNumeric,
      'MuiDataGrid-withBorder': showColumnRightBorder,
    },
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

  const columnTitleIconButtons = (
    <React.Fragment>
      <ColumnHeaderSortIcon
        direction={sortDirection}
        index={sortIndex}
        hide={column.hideSortIcons}
      />
      <ColumnHeaderFilterIcon counter={filterItemsCounter} />
    </React.Fragment>
  );
  const columnMenuIconButton = <ColumnHeaderMenuIcon column={column} />;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={cssClasses}
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
      onClick={onHeaderTitleClick}
    >
      <div className="MuiDataGrid-colCell-draggable" {...dragConfig}>
        {!disableColumnMenu && isColumnNumeric && !column.disableColumnMenu && columnMenuIconButton}
        <div className="MuiDataGrid-colCellTitleContainer">
          {isColumnNumeric && columnTitleIconButtons}
          {headerComponent || (
            <ColumnHeaderTitle
              label={column.headerName || column.field}
              description={column.description}
              columnWidth={width}
            />
          )}
          {!isColumnNumeric && columnTitleIconButtons}
        </div>
        {!isColumnNumeric &&
          !disableColumnMenu &&
          !column.disableColumnMenu &&
          columnMenuIconButton}
      </div>
      <ColumnHeaderSeparator
        resizable={!disableColumnResize && !!column.resizable}
        resizing={isResizing}
        height={headerHeight}
        onMouseDown={apiRef?.current.startResizeOnMouseDown}
      />
    </div>
  );
};
