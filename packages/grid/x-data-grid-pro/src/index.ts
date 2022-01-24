/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
} from '../../_modules_';

export { LicenseInfo } from '@mui/x-license-pro';
export * from '../../_modules_';
export type { DataGridProProps } from '../../_modules_/grid/models/props/DataGridProProps';
export * from './DataGridPro';

export const useGridApiContext =
  useUntypedGridApiContext as () => import('../../_modules_').GridApiRefPro;
export const useGridApiRef = useUntypedGridApiRef as () => import('../../_modules_').GridApiRefPro;
