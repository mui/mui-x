import * as React from 'react';
import clsx from 'clsx';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridStateColDef, GRID_NUMBER_COLUMN_TYPE } from '../../models/colDef/index';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { isFunction } from '../../utils/utils';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridColumnHeaderItemProps {
  colIndex: number;
  column: GridStateColDef;
  columnMenuOpen: boolean;
  headerHeight: number;
  isDragging: boolean;
  isResizing: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
}

export function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isDragging,
    isResizing,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId: string = useId();
  const columnMenuButtonId: string = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);
  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === GRID_NUMBER_COLUMN_TYPE;

  let headerComponent: React.ReactNode = null;
  if (column.renderHeader) {
    headerComponent = column.renderHeader(apiRef.current.getColumnHeaderParams(column.field));
  }

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent | React.DragEvent) =>
      apiRef.current.publishEvent(
        eventName,
        apiRef.current.getColumnHeaderParams(column.field),
        event,
      ),
    [apiRef, column.field],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GridEvents.columnHeaderClick),
      onDoubleClick: publish(GridEvents.columnHeaderDoubleClick),
      onMouseOver: publish(GridEvents.columnHeaderOver),
      onMouseOut: publish(GridEvents.columnHeaderOut),
      onMouseEnter: publish(GridEvents.columnHeaderEnter),
      onMouseLeave: publish(GridEvents.columnHeaderLeave),
      onKeyDown: publish(GridEvents.columnHeaderKeyDown),
      onFocus: publish(GridEvents.columnHeaderFocus),
      onBlur: publish(GridEvents.columnHeaderBlur),
    }),
    [publish],
  );

  const draggableEventHandlers = React.useMemo(
    () => ({
      onDragStart: publish(GridEvents.columnHeaderDragStart),
      onDragEnter: publish(GridEvents.columnHeaderDragEnter),
      onDragOver: publish(GridEvents.columnHeaderDragOver),
      onDragEnd: publish(GridEvents.columnHeaderDragEnd),
    }),
    [publish],
  );

  const resizeEventHandlers = React.useMemo(
    () => ({
      onMouseDown: publish(GridEvents.columnSeparatorMouseDown),
    }),
    [publish],
  );

  const classNames = [rootProps.classes.columnHeader];

  if (column.headerClassName) {
    const headerClassName = isFunction(column.headerClassName)
      ? column.headerClassName({ field: column.field, colDef: column })
      : column.headerClassName;

    classNames.push(headerClassName);
  }

  const cssClasses = clsx(
    column.headerAlign === 'center' && gridClasses['columnHeader--alignCenter'],
    column.headerAlign === 'right' && gridClasses['columnHeader--alignRight'],
    {
      [gridClasses['columnHeader--sortable']]: column.sortable,
      [gridClasses['columnHeader--moving']]: isDragging,
      [gridClasses['columnHeader--sorted']]: isColumnSorted,
      [gridClasses['columnHeader--numeric']]: isColumnNumeric,
      [gridClasses.withBorder]: rootProps.showColumnRightBorder,
    },
    ...classNames,
  );

  const width = column.computedWidth;

  let ariaSort: any;
  if (sortDirection != null) {
    ariaSort = {
      'aria-sort': sortDirection === 'asc' ? 'ascending' : 'descending',
    };
  }

  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && (
    <ColumnHeaderMenuIcon
      column={column}
      columnMenuId={columnMenuId}
      columnMenuButtonId={columnMenuButtonId}
      open={columnMenuOpen}
      iconButtonRef={iconButtonRef}
    />
  );

  const columnTitleIconButtons = (
    <React.Fragment>
      {!rootProps.disableColumnFilter && <ColumnHeaderFilterIcon counter={filterItemsCounter} />}
      {column.sortable && !column.hideSortIcons && (
        <GridColumnHeaderSortIcon direction={sortDirection} index={sortIndex} />
      )}
    </React.Fragment>
  );

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
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
        className={gridClasses.columnHeaderDraggableContainer}
        draggable={!rootProps.disableColumnReorder && !column.disableReorder}
        {...draggableEventHandlers}
      >
        <div className={gridClasses.columnHeaderTitleContainer}>
          {headerComponent || (
            <GridColumnHeaderTitle
              label={column.headerName || column.field}
              description={column.description}
              columnWidth={width}
            />
          )}
          {columnTitleIconButtons}
        </div>
        {columnMenuIconButton}
      </div>
      <GridColumnHeaderSeparator
        resizable={!rootProps.disableColumnResize && !!column.resizable}
        resizing={isResizing}
        height={headerHeight}
        {...resizeEventHandlers}
      />
      <GridColumnHeaderMenu
        columnMenuId={columnMenuId}
        columnMenuButtonId={columnMenuButtonId}
        field={column.field}
        open={columnMenuOpen}
        target={iconButtonRef.current}
        ContentComponent={rootProps.components.ColumnMenu}
        contentComponentProps={rootProps.componentsProps?.columnMenu}
      />
    </div>
  );
}
