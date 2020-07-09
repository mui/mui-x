import { PageChangedParams } from '../params/pageChangedParams';

export interface PaginationApi {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  onPageChanged: (handler: (param: PageChangedParams) => void) => () => void;
  onPageSizeChanged: (handler: (param: PageChangedParams) => void) => () => void;
}
