import * as React from 'react';
import clsx from 'clsx';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridStateColDef, GRID_NUMBER_COLUMN_TYPE } from '../../models/colDef/index';
import { GridOptions } from '../../models/gridOptions';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
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
  options: GridOptions;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
}

type OwnerState = GridColumnHeaderItemProps & {
  showColumnRightBorder: GridOptions['showColumnRightBorder'];
  classes?: GridOptions['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { column, classes, isDragging, sortDirection, showColumnRightBorder } = ownerState;

  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === GRID_NUMBER_COLUMN_TYPE;

  const slots = {
    root: [
      'columnHeader',
      column.headerAlign === 'left' && 'columnHeader__alignLeft',
      column.headerAlign === 'center' && 'columnHeader__alignCenter',
      column.headerAlign === 'right' && 'columnHeader__alignRight',
      column.sortable && 'columnHeader__sortable',
      isDragging && 'columnHeader__moving',
      isColumnSorted && 'columnHeader__sorted',
      isColumnNumeric && 'columnHeader__numeric',
      showColumnRightBorder && 'withBorder',
    ],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    sortDirection,
    sortIndex,
    options,
    filterItemsCounter,
    hasFocus,
    tabIndex,
  } = props;
  const apiRef = useGridApiContext();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId: string = useId();
  const columnMenuButtonId: string = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);
  const rootProps = useGridRootProps();
  const { disableColumnReorder, disableColumnResize, disableColumnMenu, disableColumnFilter } =
    options;

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

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showColumnRightBorder: rootProps.showColumnRightBorder,
  };
  const classes = useUtilityClasses(ownerState);

  const width = column.computedWidth;

  let ariaSort: any;
  if (sortDirection != null) {
    ariaSort = {
      'aria-sort': sortDirection === 'asc' ? 'ascending' : 'descending',
    };
  }

  const columnMenuIconButton = !disableColumnMenu && !column.disableColumnMenu && (
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
      {!disableColumnFilter && <ColumnHeaderFilterIcon counter={filterItemsCounter} />}
      {column.sortable && !column.hideSortIcons && (
        <GridColumnHeaderSortIcon direction={sortDirection} index={sortIndex} />
      )}
    </React.Fragment>
  );

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
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

  const headerClassName =
    typeof column.headerClassName === 'function'
      ? column.headerClassName({ field: column.field, colDef: column })
      : column.headerClassName;

  return (
    <div
      ref={headerCellRef}
      className={clsx(classes.root, headerClassName)}
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
        className={classes.draggableContainer}
        draggable={!disableColumnReorder && !column.disableReorder}
        {...draggableEventHandlers}
      >
        <div className={classes.titleContainer}>
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
        resizable={!disableColumnResize && !!column.resizable}
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
        ContentComponent={apiRef!.current.components.ColumnMenu}
        contentComponentProps={apiRef!.current.componentsProps?.columnMenu}
      />
    </div>
  );
}
