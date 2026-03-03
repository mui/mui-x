'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useRtl } from '@mui/system/RtlProvider';
import { doesSupportPreventScroll } from '../../utils/doesSupportPreventScroll';
import type { GridStateColDef } from '../../models/colDef/gridColDef';
import type { GridSortDirection } from '../../models/gridSortModel';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { getColumnMenuItemKeys } from '../../hooks/features/columnMenu/getColumnMenuItemKeys';
import type { GridColumnHeaderSeparatorProps } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import type { GridColumnMenuComponent } from '../menu/columnMenu/GridColumnMenuProps';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import type { GridColumnHeaderEventLookup } from '../../models/events';
import { isEventTargetInPortal } from '../../utils/domUtils';
import { PinnedColumnPosition } from '../../internals/constants';
import { attachPinnedStyle } from '../../internals/utils';

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
  pinnedPosition?: PinnedColumnPosition;
  pinnedOffset?: number;
  style?: React.CSSProperties;
  isSiblingFocused: boolean;
  showLeftBorder: boolean;
  showRightBorder: boolean;
}

type OwnerState = GridColumnHeaderItemProps & {
  showRightBorder: boolean;
  showLeftBorder: boolean;
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { disableColumnSorting } = useGridRootProps();
  const {
    colDef,
    classes,
    isDragging,
    sortDirection,
    showRightBorder,
    showLeftBorder,
    filterItemsCounter,
    pinnedPosition,
    isSiblingFocused,
  } = ownerState;

  const isColumnSortable = colDef.sortable && !disableColumnSorting;
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
      isColumnSortable && 'columnHeader--sortable',
      isDragging && 'columnHeader--moving',
      isColumnSorted && 'columnHeader--sorted',
      isColumnFiltered && 'columnHeader--filtered',
      isColumnNumeric && 'columnHeader--numeric',
      'withBorderColor',
      showRightBorder && 'columnHeader--withRightBorder',
      showLeftBorder && 'columnHeader--withLeftBorder',
      pinnedPosition === PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
      pinnedPosition === PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
      // TODO: Remove classes below and restore `:has` selectors when they are supported in jsdom
      // See https://github.com/mui/mui-x/pull/14559
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
    showLeftBorder,
    showRightBorder,
    pinnedPosition,
    pinnedOffset,
  } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const isRtl = useRtl();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);

  const columnMenuSlotProps = rootProps.slotProps?.columnMenu;
  const columnMenuComponent = rootProps.slots.columnMenu as GridColumnMenuComponent;
  const defaultSlots = columnMenuComponent?.defaultSlots;
  const defaultSlotProps = columnMenuComponent?.defaultSlotProps;
  const hasKnownDefaultColumnMenu = defaultSlots != null && defaultSlotProps != null;

  const columnMenuItemKeys = React.useMemo(() => {
    if (!hasKnownDefaultColumnMenu) {
      return [];
    }
    return getColumnMenuItemKeys({
      apiRef,
      colDef,
      defaultSlots,
      defaultSlotProps,
      slots: columnMenuSlotProps?.slots,
      slotProps: columnMenuSlotProps?.slotProps,
    });
  }, [
    apiRef,
    colDef,
    defaultSlotProps,
    defaultSlots,
    hasKnownDefaultColumnMenu,
    columnMenuSlotProps?.slotProps,
    columnMenuSlotProps?.slots,
  ]);

  // If we don't have a "known" default column menu (i.e. a custom menu component
  // without `defaultSlots` / `defaultSlotProps` statics), we treat it as opaque
  // and assume it has items, so we always show the column menu icon.
  // Only the built-in/default menu path can hide the icon when there are no items.
  const hasColumnMenuItems = !hasKnownDefaultColumnMenu || columnMenuItemKeys.length > 0;

  const isDraggable = !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder;

  let headerComponent: React.ReactNode;
  if (colDef.renderHeader) {
    headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
  }

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
            onDragEndCapture: publish('columnHeaderDragEnd'),
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
    if (!showColumnMenuIcon && columnMenuOpen) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);

  React.useEffect(() => {
    if (hasKnownDefaultColumnMenu && columnMenuOpen && !hasColumnMenuItems) {
      apiRef.current.hideColumnMenu();
    }
  }, [apiRef, columnMenuOpen, hasColumnMenuItems, hasKnownDefaultColumnMenu]);

  const handleExited = React.useCallback(() => {
    setShowColumnMenuIcon(false);
  }, []);

  const columnMenuIconButton = !rootProps.disableColumnMenu &&
    !colDef.disableColumnMenu &&
    hasColumnMenuItems && (
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
      if (!elementToFocus) {
        return;
      }
      if (doesSupportPreventScroll()) {
        elementToFocus.focus({ preventScroll: true });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [apiRef, hasFocus]);

  const headerClassName =
    typeof colDef.headerClassName === 'function'
      ? colDef.headerClassName({ field: colDef.field, colDef })
      : colDef.headerClassName;

  const label = colDef.headerName ?? colDef.field;

  const style = React.useMemo(
    () => attachPinnedStyle({ ...props.style }, isRtl, pinnedPosition, pinnedOffset),
    [pinnedPosition, pinnedOffset, props.style, isRtl],
  );

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
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  isSiblingFocused: PropTypes.bool.isRequired,
  pinnedOffset: PropTypes.number,
  pinnedPosition: PropTypes.oneOf([0, 1, 2, 3]),
  separatorSide: PropTypes.oneOf(['left', 'right']),
  showLeftBorder: PropTypes.bool.isRequired,
  showRightBorder: PropTypes.bool.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
} as any;

const Memoized = fastMemo(GridColumnHeaderItem);

export { Memoized as GridColumnHeaderItem };
