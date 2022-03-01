import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { buildWarning } from '../../utils/warning';

const deprecationWarning = buildWarning([
  'MUI: The hook useGridApi is deprecated and will be removed in the next major version.',
  'Access the ref content with apiRef.current instead',
]);

/**
 * @deprecated Use `apiRef.current` instead.
 */
export const useGridApi = <Api extends GridApiCommon>(apiRef: React.MutableRefObject<Api>): Api => {
  if (process.env.NODE_ENV !== 'production') {
    deprecationWarning();
  }
  return apiRef.current;
};
