import { Columns, GridApiRef, GridOptions, RowsProp } from './models';

export type GridOptionsProp = Partial<GridOptions>;

export interface GridComponentProps {
  rows: RowsProp;
  columns: Columns;
  options?: GridOptionsProp;
  apiRef?: GridApiRef;
  loading?: boolean;
  className?: string;
  licenseStatus: string;
}
