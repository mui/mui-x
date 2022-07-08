import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@mui/material/utils';
import { GridColumnHeaderEventLookup } from '../../models/events';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import {
  GridColumnHeaderSeparator,
  GridColumnHeaderSeparatorProps,
} from './GridColumnHeaderSeparator';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridColumnGroup } from '../../models/gridColumnGrouping';

interface GridGenericColumnHeaderItemProps
  extends Pick<GridStateColDef, 'headerClassName' | 'description' | 'resizable'> {
  classes: Record<
    'root' | 'draggableContainer' | 'titleContainer' | 'titleContainerContent',
    string
  >;
  colIndex: number;
  columnMenuOpen: boolean;
  height: number;
  isResizing: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  disableReorder?: boolean;
  separatorSide?: GridColumnHeaderSeparatorProps['side'];
  headerComponent?: React.ReactNode;
  elementId: GridStateColDef['field'] | GridColumnGroup['groupId'];
  isDraggable: boolean;
  width: number;
  columnMenuIconButton?: React.ReactNode;
  columnMenu?: React.ReactNode;
  columnTitleIconButtons?: React.ReactNode;
  label: string;
}

const GridGenericColumnHeaderItem = React.forwardRef(function GridGenericColumnHeaderItem(
  props: GridGenericColumnHeaderItemProps,
  ref,
) {
  const {
    classes,
    columnMenuOpen,
    colIndex,
    height,
    isResizing,
    sortDirection,
    hasFocus,
    tabIndex,
    separatorSide,
    isDraggable,
    headerComponent,
    description,
    elementId,
    width,
    columnMenuIconButton = null,
    columnMenu = null,
    columnTitleIconButtons = null,
    headerClassName,
    label,
    resizable,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);

  const handleRef = useForkRef(headerCellRef, ref);
  const publish = React.useCallback(
    (eventName: keyof GridColumnHeaderEventLookup) => (event: React.SyntheticEvent) => {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (!event.currentTarget.contains(event.target as Element)) {
        return;
      }
      apiRef.current.publishEvent(
        eventName,
        apiRef.current.getColumnHeaderParams(elementId),
        event as any,
      );
    },
    [apiRef, elementId],
  );

  const mouseEventsHandlers = {
    onClick: publish('columnHeaderClick'),
    onDoubleClick: publish('columnHeaderDoubleClick'),
    onMouseOver: publish('columnHeaderOver'), // TODO remove as it's not used
    onMouseOut: publish('columnHeaderOut'), // TODO remove as it's not used
    onMouseEnter: publish('columnHeaderEnter'), // TODO remove as it's not used
    onMouseLeave: publish('columnHeaderLeave'), // TODO remove as it's not used
    onKeyDown: publish('columnHeaderKeyDown'),
    onFocus: publish('columnHeaderFocus'),
    onBlur: publish('columnHeaderBlur'),
  };

  const draggableEventHandlers = isDraggable
    ? {
        onDragStart: publish('columnHeaderDragStart'),
        onDragEnter: publish('columnHeaderDragEnter'),
        onDragOver: publish('columnHeaderDragOver'),
        onDragEnd: publish('columnHeaderDragEnd'),
      }
    : null;

  let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);

  return (
    <div
      ref={handleRef}
      className={clsx(classes.root, headerClassName)}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
      tabIndex={tabIndex}
      aria-colindex={colIndex + 1}
      aria-sort={ariaSort}
      aria-label={headerComponent == null ? label : undefined}
      {...mouseEventsHandlers}
      {...other}
    >
      <div
        className={classes.draggableContainer}
        draggable={isDraggable}
        {...draggableEventHandlers}
      >
        <div className={classes.titleContainer}>
          <div className={classes.titleContainerContent}>
            {headerComponent !== undefined ? (
              headerComponent
            ) : (
              <GridColumnHeaderTitle label={label} description={description} columnWidth={width} />
            )}
          </div>
          {columnTitleIconButtons}
        </div>
        {columnMenuIconButton}
      </div>
      <GridColumnHeaderSeparator
        resizable={!rootProps.disableColumnResize && !!resizable}
        resizing={isResizing}
        height={height}
        onMouseDown={publish('columnSeparatorMouseDown')}
        side={separatorSide}
      />
      {columnMenu}
    </div>
  );
});

export { GridGenericColumnHeaderItem };
