import { RefObject } from '@mui/x-internals/types';
import { createSelector } from './createSelector';
import { GridStateCommunity } from '../models/gridStateCommunity';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

interface GridCustomState extends GridStateCommunity {
  customKey: { customKeyBis: number };
}

createSelector(
  // @ts-expect-error The state must be typed with GridState
  (apiRef: unknown) => apiRef.current.state.columns.orderedFields,
  (fields: any) => fields,
);

createSelector(
  // @ts-expect-error Missing combiner function
  (apiRef: RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (apiRef: RefObject<GridApiCommunity>) => apiRef.current.state.columns.lookup,
);

createSelector(
  (apiRef: RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (fields) => fields,
  // @ts-expect-error Wrong state value
)(null);

createSelector(
  (apiRef: RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (fields) => fields,
)({} as RefObject<GridApiCommunity>);

createSelector(
  // @ts-expect-error Wrong state key
  (apiRef: RefObject<GridApiCommunity>) => apiRef.current.state.customKey,
  (customKey) => customKey.custmKeyBis,
);

createSelector(
  (apiRef: RefObject<{ state: GridCustomState }>) => apiRef.current.state.customKey,
  (customKey) => customKey.customKeyBis,
);
