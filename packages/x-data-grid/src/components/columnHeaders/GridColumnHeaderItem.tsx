import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridColumnHeaderSeparatorProps } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { GridColumnHeaderEventLookup } from '../../models/events';
import { isEventTargetInPortal } from '../../utils/domUtils';
import { shouldCellShowLeftBorder, shouldCellShowRightBorder } from '../../utils/cellBorderUtils';
import { GridPinnedColumnPosition } from '../../hooks/features/columns/gridColumnsInterfaces';

interface GridColumnHeaderItemProps {
  colIndex: number;
  colDef: GridStateColDef;
  columnMenuOpen: boolean;
  headerHeight: number;
  isDragging: boolean;
  isResizing: boolean;
  isLast: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  disableReorder?: boolean;
  separatorSide?: GridColumnHeaderSeparatorProps['side'];
  pinnedPosition?: GridPinnedColumnPosition;
  style?: React.CSSProperties;
  indexInSection: number;
  sectionLength: number;
  gridHasFiller: boolean;
  isLastUnpinned: boolean;
  isSiblingFocused: boolean;
}

type OwnerState = GridColumnHeaderItemProps & {
  showRightBorder: boolean;
  showLeftBorder: boolean;
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    colDef,
    classes,
    isDragging,
    sortDirection,
    showRightBorder,
    showLeftBorder,
    filterItemsCounter,
    pinnedPosition,
    isLastUnpinned,
    isSiblingFocused,
  } = ownerState;

  const isColumnSorted = sortDirection != null;
  const isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = colDef.type === 'number';

  const slots = {
    root: [
      'columnHeader',
      colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'columnHeader--alignRight',
      colDef.sortable && 'columnHeader--sortable',
      isDragging && 'columnHeader--moving',
      isColumnSorted && 'columnHeader--sorted',
      isColumnFiltered && 'columnHeader--filtered',
      isColumnNumeric && 'columnHeader--numeric',
      'withBorderColor',
      showRightBorder && 'columnHeader--withRightBorder',
      showLeftBorder && 'columnHeader--withLeftBorder',
      pinnedPosition === 'left' && 'columnHeader--pinnedLeft',
      pinnedPosition === 'right' && 'columnHeader--pinnedRight',
      // TODO: Remove classes below and restore `:has` selectors when they are supported in jsdom
      // See https://github.com/mui/mui-x/pull/14559
      isLastUnpinned && 'columnHeader--lastUnpinned',
      isSiblingFocused && 'columnHeader--siblingFocused',
    ],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    colDef,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    isLast,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
    disableReorder,
    separatorSide,
    style,
    pinnedPosition,
    indexInSection,
    sectionLength,
    gridHasFiller,
  } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);

  const isDraggable = React.useMemo(
    () => !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder,
    [rootProps.disableColumnReorder, disableReorder, colDef.disableReorder],
  );

  let headerComponent: React.ReactNode;
  if (colDef.renderHeader) {
    headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
  }

  const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection);
  const showRightBorder = shouldCellShowRightBorder(
    pinnedPosition,
    indexInSection,
    sectionLength,
    rootProps.showColumnVerticalBorder,
    gridHasFiller,
  );

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showRightBorder,
    showLeftBorder,
  };

  const classes = useUtilityClasses(ownerState);

  const publish = React.useCallback(
    (eventName: keyof GridColumnHeaderEventLookup) => (event: React.SyntheticEvent) => {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (isEventTargetInPortal(event)) {
        return;
      }
      apiRef.current.publishEvent(
        eventName,
        apiRef.current.getColumnHeaderParams(colDef.field),
        event as any,
      );
    },
    [apiRef, colDef.field],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish('columnHeaderClick'),
      onContextMenu: publish('columnHeaderContextMenu'),
      onDoubleClick: publish('columnHeaderDoubleClick'),
      onMouseOver: publish('columnHeaderOver'), // TODO remove as it's not used
      onMouseOut: publish('columnHeaderOut'), // TODO remove as it's not used
      onMouseEnter: publish('columnHeaderEnter'), // TODO remove as it's not used
      onMouseLeave: publish('columnHeaderLeave'), // TODO remove as it's not used
      onKeyDown: publish('columnHeaderKeyDown'),
      onFocus: publish('columnHeaderFocus'),
      onBlur: publish('columnHeaderBlur'),
    }),
    [publish],
  );

  const draggableEventHandlers = React.useMemo(
    () =>
      isDraggable
        ? {
            onDragStart: publish('columnHeaderDragStart'),
            onDragEnter: publish('columnHeaderDragEnter'),
            onDragOver: publish('columnHeaderDragOver'),
            onDragEnd: publish('columnHeaderDragEnd'),
          }
        : {},
    [isDraggable, publish],
  );

  const columnHeaderSeparatorProps = React.useMemo(
    () => ({
      onMouseDown: publish('columnSeparatorMouseDown'),
      onDoubleClick: publish('columnSeparatorDoubleClick'),
    }),
    [publish],
  );

  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);

  const handleExited = React.useCallback(() => {
    setShowColumnMenuIcon(false);
  }, []);

  const columnMenuIconButton = !rootProps.disableColumnMenu && !colDef.disableColumnMenu && (
    <ColumnHeaderMenuIcon
      colDef={colDef}
      columnMenuId={columnMenuId!}
      columnMenuButtonId={columnMenuButtonId!}
      open={showColumnMenuIcon}
      iconButtonRef={iconButtonRef}
    />
  );

  const columnMenu = (
    <GridColumnHeaderMenu
      columnMenuId={columnMenuId!}
      columnMenuButtonId={columnMenuButtonId!}
      field={colDef.field}
      open={columnMenuOpen}
      target={iconButtonRef.current}
      ContentComponent={rootProps.slots.columnMenu}
      contentComponentProps={rootProps.slotProps?.columnMenu}
      onExited={handleExited}
    />
  );

  const sortingOrder: readonly GridSortDirection[] = colDef.sortingOrder ?? rootProps.sortingOrder;
  const showSortIcon =
    (colDef.sortable || sortDirection != null) &&
    !colDef.hideSortIcons &&
    !rootProps.disableColumnSorting;

  const columnTitleIconButtons = (
    <React.Fragment>
      {!rootProps.disableColumnFilter && (
        <rootProps.slots.columnHeaderFilterIconButton
          field={colDef.field}
          counter={filterItemsCounter}
          {...rootProps.slotProps?.columnHeaderFilterIconButton}
        />
      )}

      {showSortIcon && (
        <rootProps.slots.columnHeaderSortIcon
          field={colDef.field}
          direction={sortDirection}
          index={sortIndex}
          sortingOrder={sortingOrder}
          disabled={!colDef.sortable}
          {...rootProps.slotProps?.columnHeaderSortIcon}
        />
      )}
    </React.Fragment>
  );

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      if (apiRef.current.columnHeadersContainerRef?.current) {
        apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
      }
    }
  }, [apiRef, hasFocus]);

  const headerClassName =
    typeof colDef.headerClassName === 'function'
      ? colDef.headerClassName({ field: colDef.field, colDef })
      : colDef.headerClassName;

  const label = colDef.headerName ?? colDef.field;

  return (
    <GridGenericColumnHeaderItem
      ref={headerCellRef}
      classes={classes}
      columnMenuOpen={columnMenuOpen}
      colIndex={colIndex}
      height={headerHeight}
      isResizing={isResizing}
      sortDirection={sortDirection}
      hasFocus={hasFocus}
      tabIndex={tabIndex}
      separatorSide={separatorSide}
      isDraggable={isDraggable}
      headerComponent={headerComponent}
      description={colDef.description}
      elementId={colDef.field}
      width={colDef.computedWidth}
      columnMenuIconButton={columnMenuIconButton}
      columnTitleIconButtons={columnTitleIconButtons}
      headerClassName={clsx(headerClassName, isLast && gridClasses['columnHeader--last'])}
      label={label}
      resizable={!rootProps.disableColumnResize && !!colDef.resizable}
      data-field={colDef.field}
      columnMenu={columnMenu}
      draggableContainerProps={draggableEventHandlers}
      columnHeaderSeparatorProps={columnHeaderSeparatorProps}
      style={style}
      {...mouseEventsHandlers}
    />
  );
}

GridColumnHeaderItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  disableReorder: PropTypes.bool,
  filterItemsCounter: PropTypes.number,
  gridHasFiller: PropTypes.bool.isRequired,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  indexInSection: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  isLastUnpinned: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  isSiblingFocused: PropTypes.bool.isRequired,
  pinnedPosition: PropTypes.oneOf(['left', 'right']),
  sectionLength: PropTypes.number.isRequired,
  separatorSide: PropTypes.oneOf(['left', 'right']),
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
} as any;

const Memoized = fastMemo(GridColumnHeaderItem);

export { Memoized as GridColumnHeaderItem };
