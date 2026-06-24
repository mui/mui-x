'use client';
import * as React from 'react';
import clsx from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { GridStateColDef } from '../../models/colDef/gridColDef';
import type { GridSortDirection } from '../../models/gridSortModel';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import type { GridColumnHeaderSeparatorProps } from './GridColumnHeaderSeparator';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridColumnGroup } from '../../models/gridColumnGrouping';

interface GridGenericColumnHeaderItemProps extends Pick<
  GridStateColDef,
  'headerClassName' | 'description' | 'resizable'
> {
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
  /**
   * Optional adornment rendered at the start of the title content, before the
   * title label (used by the Premium formula feature for A1 column letters).
   * Placing it inside the (non-reversed) title content keeps it on the same
   * side of the title for both left- and right-aligned headers.
   */
  adornment?: React.ReactNode;
  label: string;
  draggableContainerProps?: Partial<React.HTMLProps<HTMLDivElement>>;
  columnHeaderSeparatorProps?: Partial<GridColumnHeaderSeparatorProps>;
  style?: React.CSSProperties;
}

const GridGenericColumnHeaderItem = forwardRef<HTMLDivElement, GridGenericColumnHeaderItemProps>(
  function GridGenericColumnHeaderItem(props, ref) {
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
      adornment = null,
      headerClassName,
      label,
      resizable,
      draggableContainerProps,
      columnHeaderSeparatorProps,
      style,
      ...other
    } = props;

    const rootProps = useGridRootProps();
    const headerCellRef = React.useRef<HTMLDivElement>(null);

    const handleRef = useForkRef(headerCellRef, ref);

    let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
    if (sortDirection != null) {
      ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
    }

    return (
      <div
        className={clsx(classes.root, headerClassName)}
        style={{
          ...style,
          width,
        }}
        role="columnheader"
        tabIndex={tabIndex}
        aria-colindex={colIndex + 1}
        aria-sort={ariaSort}
        {...other}
        ref={handleRef}
      >
        <div
          className={classes.draggableContainer}
          draggable={isDraggable}
          role="none"
          {...draggableContainerProps}
        >
          <div className={classes.titleContainer} role="none">
            <div className={classes.titleContainerContent}>
              {adornment}
              {headerComponent !== undefined ? (
                headerComponent
              ) : (
                <GridColumnHeaderTitle
                  label={label}
                  description={description}
                  columnWidth={width}
                />
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
  },
);

export { GridGenericColumnHeaderItem };
