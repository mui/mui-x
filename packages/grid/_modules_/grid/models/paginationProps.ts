export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}
