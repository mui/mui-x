import * as React from 'react';
import PropTypes from 'prop-types';
import { refType, unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/material/styles';
import {
  getDataGridUtilityClass,
  gridClasses,
  GridColumnHeaderSeparatorSides,
  useGridSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
} from '@mui/x-data-grid';
import {
  GridBaseColumnHeaders,
  GridColumnHeadersInner,
  GridPinnedColumnFields,
  UseGridColumnHeadersProps,
} from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { GridScrollArea } from './GridScrollArea';

type OwnerState = DataGridProProcessedProps & {
  leftPinnedColumns: GridPinnedColumnFields['left'];
  rightPinnedColumns: GridPinnedColumnFields['right'];
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
  overridesResolver: (_, styles) => [
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
    boxSizing: 'border-box',
    boxShadow: theme.shadows[2],
    backgroundColor: 'var(--DataGrid-pinnedBackground)',
    borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
    ...(ownerState.side === GridPinnedPosition.left && { left: 0 }),
    ...(ownerState.side === GridPinnedPosition.right && { right: 0 }),
    [`&.${gridClasses['pinnedColumnHeaders--left']}`]: {
      left: 0,
      width: 'var(--DataGrid-leftPinnedWidth)',
    },
    [`&.${gridClasses['pinnedColumnHeaders--right']}`]: {
      right: 0,
      width: 'var(--DataGrid-rightPinnedWidth)',
      '& > [role="row"] > [role="columnheader"]:first-of-type': {
        ...(ownerState.showCellVerticalBorder && {
          borderLeft: '1px solid var(--DataGrid-rowBorderColor)',
        }),
      },
    },
  }),
);

const Filler = styled('div')({
  flex: 1,
  backgroundColor: 'var(--unstable_DataGrid-containerBackground)',
});

GridColumnHeadersPinnedColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.object.isRequired,
} as any;

interface DataGridProColumnHeadersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseGridColumnHeadersProps, 'innerRef'> {
  innerRef?: React.Ref<HTMLDivElement>;
}

const GridColumnHeaders = React.forwardRef<HTMLDivElement, DataGridProColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const {
      style,
      className,
      innerRef,
      visibleColumns,
      sortColumnLookup,
      filterColumnLookup,
      columnHeaderTabIndexState,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      hasOtherElementInTabSequence,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();

    const visiblePinnedColumns = useGridSelector(
      apiRef,
      gridVisiblePinnedColumnDefinitionsSelector,
    );

    const {
      isDragging,
      renderContext,
      getInnerProps,
      getColumnHeaders,
      getColumnFilters,
      getColumnGroupHeaders,
    } = useGridColumnHeaders({
      innerRef,
      visibleColumns,
      sortColumnLookup,
      filterColumnLookup,
      columnHeaderTabIndexState,
      hasOtherElementInTabSequence,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      minColumnIndex: visiblePinnedColumns.left.length,
    });

    const ownerState = {
      ...rootProps,
      leftPinnedColumns: visiblePinnedColumns.left.map((c) => c.field),
      rightPinnedColumns: visiblePinnedColumns.right.map((c) => c.field),
      classes: rootProps.classes,
    };
    const classes = useUtilityClasses(ownerState);

    const leftRenderContext =
      renderContext && visiblePinnedColumns.left.length
        ? {
            ...renderContext,
            firstColumnIndex: 0,
            lastColumnIndex: visiblePinnedColumns.left.length,
          }
        : null;

    const rightRenderContext =
      renderContext && visiblePinnedColumns.right.length
        ? {
            ...renderContext,
            firstColumnIndex: visibleColumns.length - visiblePinnedColumns.right.length,
            lastColumnIndex: visibleColumns.length,
          }
        : null;

    const innerProps = getInnerProps();

    const pinnedColumnHeadersProps = {
      role: innerProps.role,
    };

    return (
      <GridBaseColumnHeaders ref={ref} className={className} {...other}>
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
            minFirstColumn: visiblePinnedColumns.left.length,
            maxLastColumn: visibleColumns.length - visiblePinnedColumns.right.length,
          })}
          {getColumnHeaders({
            renderContext,
            minFirstColumn: visiblePinnedColumns.left.length,
            maxLastColumn: visibleColumns.length - visiblePinnedColumns.right.length,
          })}
          {getColumnFilters({
            renderContext,
            minFirstColumn: visiblePinnedColumns.left.length,
            maxLastColumn: visibleColumns.length - visiblePinnedColumns.right.length,
          })}
        </GridColumnHeadersInner>
        <GridScrollArea scrollDirection="right" />
        <Filler />
        {rightRenderContext && (
          <GridColumnHeadersPinnedColumnHeaders
            ownerState={{
              ...ownerState,
              side: GridPinnedPosition.right,
              showCellVerticalBorder: rootProps.showCellVerticalBorder,
            }}
            className={classes.rightPinnedColumns}
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
  columnVisibility: PropTypes.object.isRequired,
  filterColumnLookup: PropTypes.object.isRequired,
  hasOtherElementInTabSequence: PropTypes.bool.isRequired,
  headerGroupingMaxDepth: PropTypes.number.isRequired,
  innerRef: refType,
  minColumnIndex: PropTypes.number,
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridColumnHeaders };
