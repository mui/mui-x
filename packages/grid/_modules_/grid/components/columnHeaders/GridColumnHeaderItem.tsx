import * as React from 'react';
import PropTypes from 'prop-types';
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
import { isFunction } from '../../utils/utils';
import { gridClasses } from '../../gridClasses';

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

function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isDragging,
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
  const {
    classes,
    disableColumnReorder,
    showColumnRightBorder,
    disableColumnResize,
    disableColumnMenu,
    disableColumnFilter,
  } = options;
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

  const classNames = [classes?.columnHeader];

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
      [gridClasses.withBorder]: showColumnRightBorder,
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
        draggable={!disableColumnReorder && !column.disableReorder}
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

GridColumnHeaderItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colIndex: PropTypes.number.isRequired,
  column: PropTypes.shape({
    align: PropTypes.oneOf(['center', 'left', 'right']),
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    computedWidth: PropTypes.number.isRequired,
    description: PropTypes.string,
    disableColumnMenu: PropTypes.bool,
    disableExport: PropTypes.bool,
    disableReorder: PropTypes.bool,
    editable: PropTypes.bool,
    field: PropTypes.string.isRequired,
    filterable: PropTypes.bool,
    filterOperators: PropTypes.arrayOf(
      PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.object,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    flex: PropTypes.number,
    headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
    headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    headerName: PropTypes.string,
    hide: PropTypes.bool,
    hideSortIcons: PropTypes.bool,
    minWidth: PropTypes.number,
    renderCell: PropTypes.func,
    renderEditCell: PropTypes.func,
    renderHeader: PropTypes.func,
    resizable: PropTypes.bool,
    sortable: PropTypes.bool,
    sortComparator: PropTypes.func,
    type: PropTypes.string,
    valueFormatter: PropTypes.func,
    valueGetter: PropTypes.func,
    valueOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
    valueParser: PropTypes.func,
    width: PropTypes.number,
  }).isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
} as any;

export { GridColumnHeaderItem };
