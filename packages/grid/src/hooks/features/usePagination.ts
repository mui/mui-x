import { useCallback, useEffect, useRef, useState } from 'react';
import { GridApi, GridOptions, PaginationApi, Rows } from '../../models';
import { GridApiRef } from '../../grid';
import { useLogger } from '../utils';
import { PAGE_CHANGED_EVENT, PAGESIZE_CHANGED_EVENT } from '../../constants/eventsConstants';

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface PageChangedParams {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
}

export const usePagination = (
  rows: Rows,
  options: GridOptions,
  setOptions: React.Dispatch<React.SetStateAction<GridOptions>>,
  apiRef: GridApiRef,
): PaginationProps => {
  const logger = useLogger('usePagination');
  const [rowCount, setRowCount] = useState(rows.length);
  const rowCountRef = useRef(rows.length);
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef = useRef(1);

  const getPageCount = useCallback(
    (pageSize: number | undefined = options.paginationPageSize) => {
      return pageSize ? Math.ceil(rowCountRef.current / pageSize!) : 1;
    },
    [rows, options],
  );

  const [pageCount, setPageCount] = useState(getPageCount());
  const pageCountRef = useRef(getPageCount());

  const setPage = (page: number) => {
    if (apiRef && apiRef.current) {
      apiRef.current!.renderPage(page);
      const params: PageChangedParams = {
        page,
        pageCount: pageCountRef.current,
        rowCount: rowCountRef.current,
        pageSize: options.paginationPageSize!,
      };
      apiRef.current!.emit(PAGE_CHANGED_EVENT, params);
    }
    setCurrentPage(page);
    currentPageRef.current = page;
  };

  const setPageSize = (pageSize: number) => {
    const oldPageSize = options.paginationPageSize!;
    setOptions(p => ({ ...p, paginationPageSize: pageSize }));
    const newPageCount = getPageCount(pageSize);
    const firstRowIdx = (currentPageRef.current - 1) * oldPageSize;
    let newPage = Math.floor(firstRowIdx / pageSize) + 1;
    newPage = newPage > newPageCount ? newPageCount : newPage;
    newPage = newPage < 1 ? 1 : newPage;
    logger.info(`PageSize changed to ${pageSize}, setting page to ${newPage}, total page count is ${newPageCount}`);
    const params: PageChangedParams = {
      page: newPage,
      pageCount: newPageCount,
      rowCount: rowCountRef.current,
      pageSize,
    };
    apiRef.current!.emit(PAGESIZE_CHANGED_EVENT, params);

    setPage(newPage);
  };

  const onPageChanged = (handler: (param: PageChangedParams) => void): (() => void) => {
    return apiRef!.current!.registerEvent(PAGE_CHANGED_EVENT, handler);
  };
  const onPageSizeChanged = (handler: (param: PageChangedParams) => void): (() => void) => {
    return apiRef!.current!.registerEvent(PAGESIZE_CHANGED_EVENT, handler);
  };

  useEffect(() => {
    logger.info(`Options or rows changed, recalculating pageCount and rowCount`);
    const newPageCount = getPageCount();

    setPageCount(newPageCount);
    pageCountRef.current = newPageCount;

    setRowCount(rows.length);
    rowCountRef.current = rows.length;
  }, [rows, options]);

  useEffect(() => {
    const subscription: any[] = [];
    if (options.onPageChanged) {
      subscription.push(onPageChanged(options.onPageChanged));
    }
    if (options.onPageSizeChanged) {
      subscription.push(onPageSizeChanged(options.onPageSizeChanged));
    }
    return () => {
      logger.info('Clearing pagination event listeners.');
      subscription.forEach(sub => sub());
    };
  }, [options]);

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding pagination api to apiRef');

      const paginationApi: PaginationApi = {
        setPageSize,
        setPage,
        onPageChanged,
        onPageSizeChanged,
      };

      apiRef.current = Object.assign(apiRef.current, paginationApi) as GridApi;
    }
  }, [apiRef]);

  return { page: currentPage, pageCount, pageSize: options.paginationPageSize!, rowCount, setPage, setPageSize };
};
