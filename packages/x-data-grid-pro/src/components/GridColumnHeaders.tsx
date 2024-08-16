import * as React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  GridBaseColumnHeaders,
  UseGridColumnHeadersProps,
} from '@mui/x-data-grid/internals';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';

const Filler = styled('div')({
  flex: 1,
  backgroundColor: 'var(--DataGrid-containerBackground)',
});

export interface GridColumnHeadersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseGridColumnHeadersProps {}

const GridColumnHeaders = React.forwardRef<HTMLDivElement, GridColumnHeadersProps>(
  function GridColumnHeaders(props, ref) {
    const {
      style,
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

    const { getInnerProps, getColumnHeadersRow, getColumnFiltersRow, getColumnGroupHeadersRows } =
      useGridColumnHeaders({
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
      });

    return (
      <GridBaseColumnHeaders ref={ref} className={className} {...other} {...getInnerProps()}>
        {getColumnGroupHeadersRows()}
        {getColumnHeadersRow()}
        {getColumnFiltersRow()}
        <Filler />
      </GridBaseColumnHeaders>
    );
  },
);

GridColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridColumnHeaders };
