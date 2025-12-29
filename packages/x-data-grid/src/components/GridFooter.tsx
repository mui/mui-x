import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridTopLevelRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { gridRowSelectionCountSelector } from '../hooks/features/rowSelection/gridRowSelectionSelector';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter/gridFilterSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer, GridFooterContainerProps } from './containers/GridFooterContainer';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const GridFooter = forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooter(props, ref) {
    const apiRef = useGridApiContext();
    const {
      slots,
      slotProps,
      hideFooterSelectedRowCount,
      hideFooterRowCount,
      pagination,
      hideFooterPagination,
    } = useGridRootProps();
    const totalTopLevelRowCount = useGridSelector(apiRef, gridTopLevelRowCountSelector);
    const selectedRowCount = useGridSelector(apiRef, gridRowSelectionCountSelector);
    const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);

    const selectedRowCountElement =
      !hideFooterSelectedRowCount && selectedRowCount > 0 ? (
        <GridSelectedRowCount selectedRowCount={selectedRowCount} />
      ) : (
        <div />
      );

    const rowCountElement =
      !hideFooterRowCount && !pagination ? (
        <slots.footerRowCount
          {...slotProps?.footerRowCount}
          rowCount={totalTopLevelRowCount}
          visibleRowCount={visibleTopLevelRowCount}
        />
      ) : null;

    const paginationElement = pagination && !hideFooterPagination && slots.pagination && (
      <slots.pagination {...slotProps?.pagination} />
    );

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
