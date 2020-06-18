// This is the grid release date
// each grid version should update this const automatically when a new version of the grid is published to NPM
import { LicenseInfo } from '@material-ui/x-license';
import { Columns, GridApiRef, GridChildrenProp, GridOptions, RowsProp } from '@material-ui/x-grid-modules';

const RELEASE_INFO = '__RELEASE_INFO__';
LicenseInfo.setReleaseInfo(RELEASE_INFO);

export type GridOptionsProp = Partial<GridOptions>;

export interface GridProps {
  rows: RowsProp;
  columns: Columns;
  options?: GridOptionsProp;
  apiRef?: GridApiRef;
  loading?: boolean;
  children?: GridChildrenProp;
}
