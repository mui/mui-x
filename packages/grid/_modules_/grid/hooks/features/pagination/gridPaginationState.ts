export interface GridPaginationState {
  pageSize: number;
  page: number;
  pageCount: number;
  rowCount: number;
}

export const getInitialPaginationState = (): GridPaginationState => ({
  page: 0,
  pageCount: 0,
  rowCount: 0,
  pageSize: 100,
});
