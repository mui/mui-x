import { useCallback, useEffect, useState } from 'react';
import { GridOptions, Rows } from '../../models';
import { GridApiRef } from '../../grid';

type ReturnType = [number, (page: number) => void, (pageSize: number) => void];
export const usePagination = (
  rows: Rows,
  options: GridOptions,
  setOptions: React.Dispatch<React.SetStateAction<GridOptions>>,
  apiRef: GridApiRef,
): ReturnType => {
  const getPageCount = useCallback(() => {
    return options.pagination && options.paginationPageSize ? Math.ceil(rows.length / options.paginationPageSize!) : 1;
  }, [options, rows]);

  const [pageCount, setPageCount] = useState(getPageCount());

  const setPageSize = useCallback(
    (pageSize: number) => {
      setOptions(p => ({ ...p, paginationPageSize: pageSize }));
    },
    [setOptions],
  );

  const setPage = useCallback(
    (page: number) => {
      if (apiRef && apiRef.current) {
        apiRef.current!.setPage(page);
      }
    },
    [apiRef],
  );

  useEffect(() => {
    setPageCount(getPageCount());
  }, [rows, options]);

  return [pageCount, setPage, setPageSize];
};
