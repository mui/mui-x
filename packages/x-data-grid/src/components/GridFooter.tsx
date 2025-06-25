import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridTopLevelRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import {
  gridRowSelectionCountSelector,
  gridRowSelectionStateSelector,
} from '../hooks/features/rowSelection/gridRowSelectionSelector';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter/gridFilterSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer, GridFooterContainerProps } from './containers/GridFooterContainer';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const GridFooter = forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooter(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const totalTopLevelRowCount = useGridSelector(apiRef, gridTopLevelRowCountSelector);
    const selectedRowCount = useGridSelector(apiRef, gridRowSelectionCountSelector);
    const selectionState = useGridSelector(apiRef, gridRowSelectionStateSelector);
    const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);

    // Show selected row count if there are any selected rows, even if the computed count might be 0 due to filtering
    const hasSelectedRows = selectionState.ids.size > 0;
    let displaySelectedRowCount = 0;
    if (selectedRowCount > 0) {
      displaySelectedRowCount = selectedRowCount;
    } else if (hasSelectedRows) {
      displaySelectedRowCount = selectionState.ids.size;
    }

    const selectedRowCountElement =
      !rootProps.hideFooterSelectedRowCount && displaySelectedRowCount > 0 ? (
        <GridSelectedRowCount selectedRowCount={displaySelectedRowCount} />
      ) : (
        <div />
      );

    const rowCountElement =
      !rootProps.hideFooterRowCount && !rootProps.pagination ? (
        <rootProps.slots.footerRowCount
          {...rootProps.slotProps?.footerRowCount}
          rowCount={totalTopLevelRowCount}
          visibleRowCount={visibleTopLevelRowCount}
        />
      ) : null;

    const paginationElement = rootProps.pagination &&
      !rootProps.hideFooterPagination &&
      rootProps.slots.pagination && <rootProps.slots.pagination />;

    return (
      <GridFooterContainer {...props} ref={ref}>
        {selectedRowCountElement}
        {rowCountElement}
        {paginationElement}
      </GridFooterContainer>
    );
  },
);

GridFooter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridFooter };
