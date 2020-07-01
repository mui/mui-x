import React, { useContext, useEffect, useState } from 'react';
import { GridOptions } from '../models';
import { PaginationProps } from '../hooks/features/usePagination';
import { Footer } from './styled-wrappers';
import { RowCount } from './row-count';
import { Pagination } from './pagination';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';

export interface DefaultFooterProps {
  options: GridOptions;
  paginationProps: PaginationProps;
  rowCount: number;
}

export const DefaultFooter: React.FC<DefaultFooterProps> = ({
  options,
  paginationProps,
  rowCount,
}) => {
  const api = useContext(ApiContext);
  const [selectedRowCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (api && api.current) {
      return api.current!.onSelectionChanged(({ rows }) => setSelectedCount(rows.length));
    }
  }, [api, setSelectedCount]);

  if (options.hideFooter) {
    return null;
  }

  return (
    <Footer>
      {!options.hideFooterRowCount && <RowCount rowCount={rowCount} />}
      {!options.hideFooterSelectedRowCount && (
        <SelectedRowCount selectedRowCount={selectedRowCount} />
      )}
      {options.pagination &&
        paginationProps.pageSize != null &&
        !options.hideFooterPagination &&
        ((options.paginationComponent && options.paginationComponent(paginationProps)) || (
          <Pagination
            setPage={paginationProps.setPage}
            currentPage={paginationProps.page}
            pageCount={paginationProps.pageCount}
            pageSize={paginationProps.pageSize}
            rowCount={paginationProps.rowCount}
            setPageSize={paginationProps.setPageSize}
            rowsPerPageOptions={options.paginationRowsPerPageOptions}
          />
        ))}
    </Footer>
  );
};
