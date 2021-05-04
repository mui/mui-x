import * as React from 'react';
import {
  GRID_COLUMN_HEADER_KEYDOWN,
  GRID_COLUMN_HEADER_CLICK,
  GRID_COLUMN_HEADER_DOUBLE_CLICK,
  GRID_COLUMN_HEADER_ENTER,
  GRID_COLUMN_HEADER_LEAVE,
  GRID_COLUMN_HEADER_OUT,
  GRID_COLUMN_HEADER_OVER,
  GRID_COLUMN_HEADER_DRAG_ENTER,
  GRID_COLUMN_HEADER_DRAG_OVER,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_COLUMN_HEADER_DRAG_END,
  GRID_COLUMN_SEPARATOR_MOUSE_DOWN,
  GRID_COLUMN_HEADER_FOCUS,
  GRID_COLUMN_HEADER_BLUR,
} from '../../constants/eventsConstants';
import { GridColDef, GRID_NUMBER_COLUMN_TYPE } from '../../models/colDef/index';
import { GridOptions } from '../../models/gridOptions';
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
  hasFocus?: boolean;
  tabIndex: 0 | -1;
}

export const GridColumnHeaderItem = React.memo(
  ({
    column,
    colIndex,
    isDragging,
    isResizing,
    sortDirection,
    sortIndex,
    options,
    filterItemsCounter,
    hasFocus,
    tabIndex,
  }: GridColumnHeaderItemProps) => {
    const apiRef = React.useContext(GridApiContext);
    const headerCellRef = React.useRef<HTMLDivElement>(null);
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
    if (column.renderHeader && apiRef!.current) {
      headerComponent = column.renderHeader(apiRef!.current.getColumnHeaderParams(column.field));
    }

    const publish = React.useCallback(
      (eventName: string) => (event: React.MouseEvent | React.DragEvent) =>
        apiRef!.current.publishEvent(
          eventName,
          apiRef!.current.getColumnHeaderParams(column.field),
          event,
        ),
      [apiRef, column.field],
    );

    const mouseEventsHandlers = React.useMemo(
      () => ({
        onClick: publish(GRID_COLUMN_HEADER_CLICK),
        onDoubleClick: publish(GRID_COLUMN_HEADER_DOUBLE_CLICK),
        onMouseOver: publish(GRID_COLUMN_HEADER_OVER),
        onMouseOut: publish(GRID_COLUMN_HEADER_OUT),
        onMouseEnter: publish(GRID_COLUMN_HEADER_ENTER),
        onMouseLeave: publish(GRID_COLUMN_HEADER_LEAVE),
        onKeyDown: publish(GRID_COLUMN_HEADER_KEYDOWN),
        onFocus: publish(GRID_COLUMN_HEADER_FOCUS),
        onBlur: publish(GRID_COLUMN_HEADER_BLUR),
      }),
      [publish],
    );

    const draggableEventHandlers = React.useMemo(
      () => ({
        onDragStart: publish(GRID_COLUMN_HEADER_DRAG_START),
        onDragEnter: publish(GRID_COLUMN_HEADER_DRAG_ENTER),
        onDragOver: publish(GRID_COLUMN_HEADER_DRAG_OVER),
        onDragEnd: publish(GRID_COLUMN_HEADER_DRAG_END),
      }),
      [publish],
    );

    const resizeEventHandlers = React.useMemo(
      () => ({
        onMouseDown: publish(GRID_COLUMN_SEPARATOR_MOUSE_DOWN),
      }),
      [publish],
    );

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

    React.useLayoutEffect(() => {
      const columnMenuState = apiRef!.current.getState().columnMenu;
      if (hasFocus && !columnMenuState.open) {
        const focusableElement = headerCellRef.current!.querySelector(
          '[tabindex="0"]',
        ) as HTMLElement;
        if (focusableElement) {
          focusableElement!.focus();
        } else {
          headerCellRef.current!.focus();
        }
      }
    });

    return (
      <div
        ref={headerCellRef}
        className={cssClasses}
        key={column.field}
        data-field={column.field}
        style={{
          width,
          minWidth: width,
          maxWidth: width,
        }}
        role="columnheader"
        tabIndex={tabIndex}
        aria-colindex={colIndex + 1}
        {...ariaSort}
        {...mouseEventsHandlers}
      >
        <div
          className="MuiDataGrid-colCell-draggable"
          draggable={!disableColumnReorder}
          {...draggableEventHandlers}
        >
          {!disableColumnMenu &&
            isColumnNumeric &&
            !column.disableColumnMenu &&
            columnMenuIconButton}
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
          {...resizeEventHandlers}
        />
      </div>
    );
  },
);
