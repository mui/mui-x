import * as React from 'react';

/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
} from '../../_modules_';
import { GridApiCommon } from '../../_modules_/grid/models/api/gridApiCommon';
import { GridApiPro } from '../../_modules_/grid/models/api/gridApiPro';

export { LicenseInfo } from '@mui/x-license-pro';
export * from '../../_modules_';
export type { DataGridProProps } from '../../_modules_/grid/models/props/DataGridProProps';
export * from './DataGridPro';

// Typing override to avoid breaking change until `__modules__` is removed

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<Api>;

export * from './typeOverload';
