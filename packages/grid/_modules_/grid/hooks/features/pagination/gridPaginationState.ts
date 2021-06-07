import { GridFeatureMode } from '../../../models/gridFeatureMode';

export interface GridPaginationState {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  paginationMode: GridFeatureMode;
}
