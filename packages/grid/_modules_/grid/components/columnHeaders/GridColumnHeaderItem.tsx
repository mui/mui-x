import * as React from 'react';
import { GRID_COLUMN_HEADER_CLICK } from '../../constants/eventsConstants';
import { GridColDef, GRID_NUMBER_COLUMN_TYPE } from '../../models/colDef/index';
import { GridOptions } from '../../models/gridOptions';
import { GridColParams } from '../../models/params/gridColParams';
import { GridSortDirection } from '../../models/gridSortModel';
import { GridApiContext } from '../GridApiContext';
import { GRID_HEADER_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';
import { classnames } from '../../utils/index';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';

interface GridColumnHeaderItemProps {
  colIndex: number;
  column: GridColDef;
  isDragging: boolean;
  isResizing: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  options: GridOptions;
  filterItemsCounter?: number;
}

export const GridColumnHeaderItem = ({
  column,
  colIndex,
  isDragging,
  isResizing,
  sortDirection,
  sortIndex,
  options,
  filterItemsCounter,
}: GridColumnHeaderItemProps) => {
  const apiRef = React.useContext(GridApiContext);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const {
    disableColumnReorder,
    showColumnRightBorder,
    disableColumnResize,
    disableColumnMenu,
  } = options;
  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === GRID_NUMBER_COLUMN_TYPE;

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
    const colHeaderParams: GridColParams = {
      field: column.field,
      colDef: column,
      colIndex,
      api: apiRef!.current,
    };
    apiRef!.current.publishEvent(GRID_COLUMN_HEADER_CLICK, colHeaderParams);
  }, [apiRef, colIndex, column]);

  const cssClasses = classnames(
    GRID_HEADER_CELL_CSS_CLASS,
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
      <GridColumnHeaderSortIcon
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
            <GridColumnHeaderTitle
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
      <GridColumnHeaderSeparator
        resizable={!disableColumnResize && !!column.resizable}
        resizing={isResizing}
        height={headerHeight}
        onMouseDown={apiRef?.current.startResizeOnMouseDown}
      />
    </div>
  );
};
