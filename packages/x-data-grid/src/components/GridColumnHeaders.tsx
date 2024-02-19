import * as React from 'react';
import PropTypes from 'prop-types';
import { refType } from '@mui/utils';
import { fastMemo } from '../utils/fastMemo';
import {
  useGridColumnHeaders,
  UseGridColumnHeadersProps,
} from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { GridBaseColumnHeaders } from './columnHeaders/GridBaseColumnHeaders';
import { GridColumnHeadersInner } from './columnHeaders/GridColumnHeadersInner';

export interface GridColumnHeadersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseGridColumnHeadersProps, 'innerRef'> {
  ref?: React.Ref<HTMLDivElement>;
  innerRef?: React.Ref<HTMLDivElement>;
}

const GridColumnHeaders = React.forwardRef<HTMLDivElement, GridColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const {
      innerRef,
      className,
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

    const { isDragging, getInnerProps, getColumnHeaders, getColumnGroupHeaders } =
      useGridColumnHeaders({
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
      });

    return (
      <GridBaseColumnHeaders ref={ref} {...other}>
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
  columnVisibility: PropTypes.object.isRequired,
  filterColumnLookup: PropTypes.object.isRequired,
  hasOtherElementInTabSequence: PropTypes.bool.isRequired,
  headerGroupingMaxDepth: PropTypes.number.isRequired,
  innerRef: refType,
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

const MemoizedGridColumnHeaders = fastMemo(GridColumnHeaders);

export { MemoizedGridColumnHeaders as GridColumnHeaders };
