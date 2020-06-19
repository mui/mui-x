// This is the grid release date
// each grid version should update this const automatically when a new version of the grid is published to NPM
import { Columns, GridApiRef, GridOptions, RowsProp } from './index';
export type GridOptionsProp = Partial<GridOptions>;

export interface GridProps {
  rows: RowsProp;
  columns: Columns;
  options?: GridOptionsProp;
  apiRef?: GridApiRef;
  loading?: boolean;
  licenseStatus: string;
}
