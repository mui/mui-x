import * as React from 'react';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';

export interface GridPaginationProps {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  rowsPerPageOptions: number[];
  page: number;
  pageSize: number;
  rowCount: number;
}

export const GridPagination = (props: {}) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);

  const onPageSizeChange = React.useCallback(
    (newPageSize: number) => {
      apiRef.current.setPageSize(newPageSize);
    },
    [apiRef],
  );

  const onPageChange = React.useCallback(
    (page: number) => {
      apiRef.current.setPage(page);
    },
    [apiRef],
  );

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingPageSizeInRowsPerPageOptions = React.useRef(false);
    if (
      !warnedOnceMissingPageSizeInRowsPerPageOptions.current &&
      !rootProps.autoPageSize &&
      !rootProps.rowsPerPageOptions.includes(rootProps.pageSize ?? paginationState.pageSize)
    ) {
      console.warn(
        [
          `MUI: The page size \`${
            rootProps.pageSize ?? paginationState.pageSize
          }\` is not preset in the \`rowsPerPageOptions\``,
          `Add it to show the pagination select.`,
        ].join('\n'),
      );

      warnedOnceMissingPageSizeInRowsPerPageOptions.current = true;
    }
  }

  const rowsPerPageOptions = rootProps.rowsPerPageOptions?.includes(paginationState.pageSize)
    ? rootProps.rowsPerPageOptions
    : [];

  return (
    rootProps.components.Pagination && (
      <rootProps.components.Pagination
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        {...paginationState}
        {...props}
        {...rootProps.componentsProps?.pagination}
      />
    )
  );
};
