import * as React from 'react';
import clsx from 'clsx';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
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
  draggableContainerProps?: Partial<React.HTMLProps<HTMLDivElement>>;
  columnHeaderSeparatorProps?: Partial<GridColumnHeaderSeparatorProps>;
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
    draggableContainerProps,
    columnHeaderSeparatorProps,
    ...other
  } = props;

  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);

  const handleRef = useForkRef(headerCellRef, ref);

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
        height,
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
      tabIndex={tabIndex}
      aria-colindex={colIndex + 1}
      aria-sort={ariaSort}
      aria-label={headerComponent == null ? label : undefined}
      {...other}
    >
      <div
        className={classes.draggableContainer}
        draggable={isDraggable}
        role="presentation"
        {...draggableContainerProps}
      >
        <div className={classes.titleContainer} role="presentation">
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
        side={separatorSide}
        {...columnHeaderSeparatorProps}
      />
      {columnMenu}
    </div>
  );
});

export { GridGenericColumnHeaderItem };
