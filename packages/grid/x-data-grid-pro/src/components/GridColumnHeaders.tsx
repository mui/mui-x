import * as React from 'react';
import PropTypes from 'prop-types';
import {
  refType,
  unstable_composeClasses as composeClasses,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  getDataGridUtilityClass,
  gridClasses,
  useGridApiEventHandler,
  GridColumnHeaderSeparatorSides,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  GridBaseColumnHeaders,
  GridColumnHeadersInner,
  UseGridColumnHeadersProps,
} from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import {
  GridPinnedPosition,
  GridPinnedColumns,
  gridPinnedColumnsSelector,
  gridVisiblePinnedColumnsSelector,
} from '../hooks/features/columnPinning';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { filterColumns } from './DataGridProVirtualScroller';
import { GridScrollArea } from './GridScrollArea';

type OwnerState = DataGridProProcessedProps & {
  leftPinnedColumns: GridPinnedColumns['left'];
  rightPinnedColumns: GridPinnedColumns['right'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { leftPinnedColumns, rightPinnedColumns, classes } = ownerState;

  const slots = {
    leftPinnedColumns: [
      'pinnedColumnHeaders',
      leftPinnedColumns && leftPinnedColumns.length > 0 && `pinnedColumnHeaders--left`,
    ],
    rightPinnedColumns: [
      'pinnedColumnHeaders',
      rightPinnedColumns && rightPinnedColumns.length > 0 && `pinnedColumnHeaders--right`,
      'withBorderColor',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridColumnHeadersPinnedColumnHeadersProps {
  side: GridPinnedPosition;
  showCellVerticalBorder: boolean;
}

const GridColumnHeadersPinnedColumnHeaders = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumnHeaders',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pinnedColumnHeaders--left']}`]: styles['pinnedColumnHeaders--left'] },
    { [`&.${gridClasses['pinnedColumnHeaders--right']}`]: styles['pinnedColumnHeaders--right'] },
    styles.pinnedColumnHeaders,
  ],
})<{ ownerState: OwnerState & GridColumnHeadersPinnedColumnHeadersProps }>(
  ({ theme, ownerState }) => ({
    position: 'sticky',
    zIndex: 5,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[2],
    backgroundColor: 'var(--unstable_DataGrid-pinnedBackground)',
    ...(ownerState.side === GridPinnedPosition.left && { left: 0 }),
    ...(ownerState.side === GridPinnedPosition.right && { right: 0 }),
    ...(ownerState.side === GridPinnedPosition.right &&
      ownerState.showCellVerticalBorder && {
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
      }),
    [`&.${gridClasses['pinnedColumnHeaders--left']}`]: {
      left: 0,
    },
    [`&.${gridClasses['pinnedColumnHeaders--right']}`]: {
      right: 0,
    },
  }),
);

GridColumnHeadersPinnedColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.object.isRequired,
} as any;

interface Props extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseGridColumnHeadersProps, 'innerRef'> {
  innerRef?: React.Ref<HTMLDivElement>;
}

const GridColumnHeaders = React.forwardRef<HTMLDivElement, Props>(
  function GridColumnHeaders(props, ref) {
    const {
      style,
      className,
      innerRef,
      visibleColumns,
      visiblePinnedColumns: _,
      sortColumnLookup,
      filterColumnLookup,
      columnPositions,
      columnHeaderTabIndexState,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      densityFactor,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      hasOtherElementInTabSequence,
      ...other
    } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const [scrollbarSize, setScrollbarSize] = React.useState(0);
    const theme = useTheme();
    const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
    const visiblePinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnsSelector);
    // const scrollbarSize = useGridSelector(apiRef, (state: GridStatePro) => state.dimensions.hasScrollY ? state.dimensions.scrollBarSize : 0);

    const handleContentSizeChange = useEventCallback(() => {
      const dimensions = apiRef.current.getDimensions();
      const newScrollbarSize = dimensions.hasScrollY ? dimensions.scrollBarSize : 0;
      if (scrollbarSize !== newScrollbarSize) {
        setScrollbarSize(newScrollbarSize);
      }
    });

    useGridApiEventHandler(apiRef, 'virtualScrollerContentSizeChange', handleContentSizeChange);

    const visibleColumnFields = React.useMemo(
      () => visibleColumns.map(({ field }) => field),
      [visibleColumns],
    );

    const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
      pinnedColumns,
      visibleColumnFields,
      theme.direction === 'rtl',
    );

    const {
      isDragging,
      renderContext,
      getRootProps,
      getInnerProps,
      getColumnHeaders,
      getColumnFilters,
      getColumnGroupHeaders,
    } = useGridColumnHeaders({
      innerRef,
      visibleColumns,
      visiblePinnedColumns,
      sortColumnLookup,
      filterColumnLookup,
      columnPositions,
      columnHeaderTabIndexState,
      hasOtherElementInTabSequence,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      densityFactor,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      minColumnIndex: leftPinnedColumns.length,
    });

    const ownerState = {
      ...rootProps,
      leftPinnedColumns,
      rightPinnedColumns,
      classes: rootProps.classes,
    };
    const classes = useUtilityClasses(ownerState);

    const leftRenderContext =
      renderContext && leftPinnedColumns.length
        ? {
            ...renderContext,
            firstColumnIndex: 0,
            lastColumnIndex: leftPinnedColumns.length,
          }
        : null;

    const rightRenderContext =
      renderContext && rightPinnedColumns.length
        ? {
            ...renderContext,
            firstColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
            lastColumnIndex: visibleColumnFields.length,
          }
        : null;

    const innerProps = getInnerProps();

    const pinnedColumnHeadersProps = {
      role: innerProps.role,
    };

    return (
      <GridBaseColumnHeaders ref={ref} className={className} {...getRootProps(other)}>
        {leftRenderContext && (
          <GridColumnHeadersPinnedColumnHeaders
            className={classes.leftPinnedColumns}
            ownerState={{
              ...ownerState,
              side: GridPinnedPosition.left,
              showCellVerticalBorder: rootProps.showCellVerticalBorder,
            }}
            {...pinnedColumnHeadersProps}
          >
            {getColumnGroupHeaders({
              renderContext: leftRenderContext,
              minFirstColumn: leftRenderContext.firstColumnIndex,
              maxLastColumn: leftRenderContext.lastColumnIndex,
            })}
            {getColumnHeaders(
              {
                renderContext: leftRenderContext,
                minFirstColumn: leftRenderContext.firstColumnIndex,
                maxLastColumn: leftRenderContext.lastColumnIndex,
              },
              { disableReorder: true },
            )}

            {getColumnFilters({
              renderContext: leftRenderContext,
              minFirstColumn: leftRenderContext.firstColumnIndex,
              maxLastColumn: leftRenderContext.lastColumnIndex,
            })}
          </GridColumnHeadersPinnedColumnHeaders>
        )}

        <GridScrollArea scrollDirection="left" />
        <GridColumnHeadersInner isDragging={isDragging} {...innerProps}>
          {getColumnGroupHeaders({
            renderContext,
            minFirstColumn: leftPinnedColumns.length,
            maxLastColumn: visibleColumnFields.length - rightPinnedColumns.length,
          })}
          {getColumnHeaders({
            renderContext,
            minFirstColumn: leftPinnedColumns.length,
            maxLastColumn: visibleColumnFields.length - rightPinnedColumns.length,
          })}
          {getColumnFilters({
            renderContext,
            minFirstColumn: leftPinnedColumns.length,
            maxLastColumn: visibleColumnFields.length - rightPinnedColumns.length,
          })}
        </GridColumnHeadersInner>
        <GridScrollArea scrollDirection="right" />
        {rightRenderContext && (
          <GridColumnHeadersPinnedColumnHeaders
            ownerState={{
              ...ownerState,
              side: GridPinnedPosition.right,
              showCellVerticalBorder: rootProps.showCellVerticalBorder,
            }}
            className={classes.rightPinnedColumns}
            style={{ paddingRight: scrollbarSize }}
            {...pinnedColumnHeadersProps}
          >
            {getColumnGroupHeaders({
              renderContext: rightRenderContext,
              minFirstColumn: rightRenderContext.firstColumnIndex,
              maxLastColumn: rightRenderContext.lastColumnIndex,
            })}
            {getColumnHeaders(
              {
                renderContext: rightRenderContext,
                minFirstColumn: rightRenderContext.firstColumnIndex,
                maxLastColumn: rightRenderContext.lastColumnIndex,
              },
              { disableReorder: true, separatorSide: GridColumnHeaderSeparatorSides.Left },
            )}

            {getColumnFilters({
              renderContext: rightRenderContext,
              minFirstColumn: rightRenderContext.firstColumnIndex,
              maxLastColumn: rightRenderContext.lastColumnIndex,
            })}
          </GridColumnHeadersPinnedColumnHeaders>
        )}
      </GridBaseColumnHeaders>
    );
  },
);

GridColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnGroupHeaderFocus: PropTypes.shape({
    depth: PropTypes.number.isRequired,
    field: PropTypes.string.isRequired,
  }),
  columnGroupHeaderTabIndexState: PropTypes.shape({
    depth: PropTypes.number.isRequired,
    field: PropTypes.string.isRequired,
  }),
  columnGroupsHeaderStructure: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        columnFields: PropTypes.arrayOf(PropTypes.string).isRequired,
        groupId: PropTypes.string,
      }),
    ),
  ).isRequired,
  columnHeaderFocus: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }),
  columnHeaderTabIndexState: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }),
  columnMenuState: PropTypes.shape({
    field: PropTypes.string,
    open: PropTypes.bool.isRequired,
  }).isRequired,
  columnPositions: PropTypes.arrayOf(PropTypes.number).isRequired,
  columnVisibility: PropTypes.object.isRequired,
  densityFactor: PropTypes.number.isRequired,
  filterColumnLookup: PropTypes.object.isRequired,
  hasOtherElementInTabSequence: PropTypes.bool.isRequired,
  headerGroupingMaxDepth: PropTypes.number.isRequired,
  innerRef: refType,
  minColumnIndex: PropTypes.number,
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridColumnHeaders };
