import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
export const useApiRef = (): ApiRef => React.useRef<GridApi | null | undefined>();
