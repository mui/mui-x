import * as React from 'react';
import PropTypes from 'prop-types';
import { fastMemo } from '../utils/fastMemo';
import {
  useGridColumnHeaders,
  UseGridColumnHeadersProps,
} from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { GridBaseColumnHeaders } from './columnHeaders/GridBaseColumnHeaders';
import { GridColumnHeadersInner } from './columnHeaders/GridColumnHeadersInner';

interface GridColumnHeadersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseGridColumnHeadersProps, 'innerRef'> {
  innerRef?: React.Ref<HTMLDivElement>;
}

const GridColumnHeaders = React.forwardRef<HTMLDivElement, GridColumnHeadersProps>(
  function GridColumnsHeaders(props, ref) {
    const {
      innerRef,
      className,
      visibleColumns,
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

    const { isDragging, getRootProps, getInnerProps, getColumnHeaders, getColumnGroupHeaders } =
      useGridColumnHeaders({
        innerRef,
        visibleColumns,
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
      });

    return (
      <GridBaseColumnHeaders ref={ref} {...getRootProps(other)}>
        <GridColumnHeadersInner isDragging={isDragging} {...getInnerProps()}>
          {getColumnGroupHeaders()}
          {getColumnHeaders()}
        </GridColumnHeadersInner>
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
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  minColumnIndex: PropTypes.number,
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

const MemoizedGridColumnHeaders = fastMemo(GridColumnHeaders);

export { MemoizedGridColumnHeaders as GridColumnHeaders };
