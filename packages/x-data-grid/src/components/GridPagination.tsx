import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import type { GridSlotProps } from '../models/gridSlotsComponent';
import { NotRendered } from '../utils/assert';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridPaginationModelSelector,
  gridPaginationRowCountSelector,
  gridPageCountSelector,
} from '../hooks/features/pagination/gridPaginationSelector';

type PaginationProps = GridSlotProps['basePagination'];

const GridPaginationRoot = styled(NotRendered<GridSlotProps['basePagination']>)({
  maxHeight: 'calc(100% + 1px)', // border width
  flexGrow: 1,
});

function GridPagination() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const rowCount = useGridSelector(apiRef, gridPaginationRowCountSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const { paginationMode, loading } = rootProps;

  const disabled = rowCount === -1 && paginationMode === 'server' && loading;

  const lastPage = React.useMemo(() => Math.max(0, pageCount - 1), [pageCount]);

  const computedPage = React.useMemo(() => {
    if (rowCount === -1) {
      return paginationModel.page;
    }
    return paginationModel.page <= lastPage ? paginationModel.page : lastPage;
  }, [lastPage, paginationModel.page, rowCount]);

  const handlePageSizeChange = React.useCallback(
    (pageSize: number) => {
      apiRef.current.setPageSize(pageSize);
    },
    [apiRef],
  );

  const handlePageChange = React.useCallback<PaginationProps['onPageChange']>(
    (_, page) => {
      apiRef.current.setPage(page);
    },
    [apiRef],
  );

  const isPageSizeIncludedInPageSizeOptions = (pageSize: number) => {
    for (let i = 0; i < rootProps.pageSizeOptions.length; i += 1) {
      const option = rootProps.pageSizeOptions[i];
      if (typeof option === 'number') {
        if (option === pageSize) {
          return true;
        }
      } else if (option.value === pageSize) {
        return true;
      }
    }
    return false;
  };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingInPageSizeOptions = React.useRef(false);

    const pageSize = rootProps.paginationModel?.pageSize ?? paginationModel.pageSize;
    if (
      !warnedOnceMissingInPageSizeOptions.current &&
      !rootProps.autoPageSize &&
      !isPageSizeIncludedInPageSizeOptions(pageSize)
    ) {
      console.warn(
        [
          `MUI X: The page size \`${paginationModel.pageSize}\` is not present in the \`pageSizeOptions\`.`,
          `Add it to show the pagination select.`,
        ].join('\n'),
      );

      warnedOnceMissingInPageSizeOptions.current = true;
    }
  }

  const pageSizeOptions = isPageSizeIncludedInPageSizeOptions(paginationModel.pageSize)
    ? rootProps.pageSizeOptions
    : [];

  return (
    <GridPaginationRoot
      as={rootProps.slots.basePagination}
      count={rowCount}
      page={computedPage}
      rowsPerPageOptions={pageSizeOptions}
      rowsPerPage={paginationModel.pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange as any}
      disabled={disabled}
    />
  );
}

GridPagination.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  component: PropTypes.elementType,
} as any;

export { GridPagination };
