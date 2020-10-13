import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { GridApi } from '../../../models/api/gridApi';
import { getInitialState } from './gridState';

export const useGridApi = (apiRef: ApiRef): GridApi => {
  if (!apiRef.current.isInitialised) {
    apiRef.current.state = getInitialState();
  }

  return apiRef.current;
};
