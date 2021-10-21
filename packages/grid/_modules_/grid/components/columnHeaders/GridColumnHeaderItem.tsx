import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridStateColDef } from '../../models/colDef/index';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

interface GridColumnHeaderItemProps {
  colIndex: number;
  column: GridStateColDef;
  columnMenuOpen: boolean;
  headerHeight: number;
  isDragging: boolean;
  isResizing: boolean;
  isLastColumn: boolean;
  extendRowFullWidth: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  hasScrollX: boolean;
  hasScrollY: boolean;
  tabIndex: 0 | -1;
}

type OwnerState = GridColumnHeaderItemProps & {
  showRightBorder: boolean;
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { column, classes, isDragging, sortDirection, showRightBorder } = ownerState;

  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === 'number';

  const slots = {
    root: [
      'columnHeader',
      column.headerAlign === 'left' && 'columnHeader--alignLeft',
      column.headerAlign === 'center' && 'columnHeader--alignCenter',
      column.headerAlign === 'right' && 'columnHeader--alignRight',
      column.sortable && 'columnHeader--sortable',
      isDragging && 'columnHeader--moving',
      isColumnSorted && 'columnHeader--sorted',
      isColumnNumeric && 'columnHeader--numeric',
      showRightBorder && 'withBorder',
    ],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    isLastColumn,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
    hasScrollX,
    hasScrollY,
    extendRowFullWidth,
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);

  let headerComponent: React.ReactNode = null;
  if (column.renderHeader) {
    headerComponent = column.renderHeader(apiRef.current.getColumnHeaderParams(column.field));
  }

  const publish = React.useCallback(
    (eventName: string) => (event: React.SyntheticEvent) =>
      apiRef.current.publishEvent(
        eventName,
        apiRef.current.getColumnHeaderParams(column.field),
        event,
      ),
    [apiRef, column.field],
  );

  const mouseEventsHandlers = {
    onClick: publish(GridEvents.columnHeaderClick),
    onDoubleClick: publish(GridEvents.columnHeaderDoubleClick),
    onMouseOver: publish(GridEvents.columnHeaderOver), // TODO remove as it's not used
    onMouseOut: publish(GridEvents.columnHeaderOut), // TODO remove as it's not used
    onMouseEnter: publish(GridEvents.columnHeaderEnter), // TODO remove as it's not used
    onMouseLeave: publish(GridEvents.columnHeaderLeave), // TODO remove as it's not used
    onKeyDown: publish(GridEvents.columnHeaderKeyDown),
    onFocus: publish(GridEvents.columnHeaderFocus),
    onBlur: publish(GridEvents.columnHeaderBlur),
  };

  const draggableEventHandlers = {
    onDragStart: publish(GridEvents.columnHeaderDragStart),
    onDragEnter: publish(GridEvents.columnHeaderDragEnter),
    onDragOver: publish(GridEvents.columnHeaderDragOver),
    onDragEnd: publish(GridEvents.columnHeaderDragEnd),
  };

  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn
    ? rootProps.showColumnRightBorder
    : !removeLastBorderRight && !extendRowFullWidth;

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showRightBorder,
  };

  const classes = useUtilityClasses(ownerState);

  const width = column.computedWidth;

  let ariaSort: 'ascending' | 'descending' | undefined;
  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && (
    <ColumnHeaderMenuIcon
      column={column}
      columnMenuId={columnMenuId!}
      columnMenuButtonId={columnMenuButtonId!}
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

  const headerClassName =
    typeof column.headerClassName === 'function'
      ? column.headerClassName({ field: column.field, colDef: column })
      : column.headerClassName;

  return (
    <div
      ref={headerCellRef}
      className={clsx(classes.root, headerClassName)}
      data-field={column.field}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
      tabIndex={tabIndex}
      aria-colindex={colIndex + 1}
      aria-sort={ariaSort}
      {...mouseEventsHandlers}
    >
      <div
        className={classes.draggableContainer}
        draggable={!rootProps.disableColumnReorder && !column.disableReorder}
        {...draggableEventHandlers}
      >
        <div className={classes.titleContainer}>
          {headerComponent || (
            <GridColumnHeaderTitle
              label={column.headerName ?? column.field}
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
        onMouseDown={publish(GridEvents.columnSeparatorMouseDown)}
      />
      <GridColumnHeaderMenu
        columnMenuId={columnMenuId!}
        columnMenuButtonId={columnMenuButtonId!}
        field={column.field}
        open={columnMenuOpen}
        target={iconButtonRef.current}
        ContentComponent={rootProps.components.ColumnMenu}
        contentComponentProps={rootProps.componentsProps?.columnMenu}
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
    shouldRenderAutoGeneratedRows: PropTypes.bool,
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
  extendRowFullWidth: PropTypes.bool.isRequired,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  hasScrollX: PropTypes.bool.isRequired,
  hasScrollY: PropTypes.bool.isRequired,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isLastColumn: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
} as any;

export { GridColumnHeaderItem };
