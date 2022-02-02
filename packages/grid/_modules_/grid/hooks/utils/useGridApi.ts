import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApi';

/**
 * @deprecated Use `apiRef.current` instead.
 */
export const useGridApi = <Api extends GridApiCommon>(apiRef: React.MutableRefObject<Api>): Api =>
  apiRef.current;
