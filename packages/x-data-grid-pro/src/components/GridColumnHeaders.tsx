import * as React from 'react';
import PropTypes from 'prop-types';
import { css } from '@mui/x-internals/css';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars, GridBaseColumnHeaders, UseGridColumnHeadersProps } from '@mui/x-data-grid/internals';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';

const fillerClassName = css('MuiDataGrid-columnHeadersFiller', {
  root: {
    flex: 1,
    backgroundColor: vars.header.background.base,
  },
}).root;

export interface GridColumnHeadersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseGridColumnHeadersProps {}

const GridColumnHeaders = forwardRef<HTMLDivElement, GridColumnHeadersProps>(
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
      <GridBaseColumnHeaders className={className} {...other} {...getInnerProps()} ref={ref}>
        {getColumnGroupHeadersRows()}
        {getColumnHeadersRow()}
        {getColumnFiltersRow()}
        <div className={fillerClassName} />
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
