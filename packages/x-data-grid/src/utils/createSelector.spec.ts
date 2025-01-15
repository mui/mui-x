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
  (apiRef: React.RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (apiRef: React.RefObject<GridApiCommunity>) => apiRef.current.state.columns.lookup,
);

createSelector(
  (apiRef: React.RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (fields) => fields,
  // @ts-expect-error Wrong state value
)(null);

createSelector(
  (apiRef: React.RefObject<GridApiCommunity>) => apiRef.current.state.columns.orderedFields,
  (fields) => fields,
)({} as RefObject<GridApiCommunity>);

createSelector(
  // @ts-expect-error Wrong state key
  (apiRef: React.RefObject<GridApiCommunity>) => apiRef.current.state.customKey,
  (customKey) => customKey.custmKeyBis,
);

createSelector(
  (apiRef: React.RefObject<{ state: GridCustomState }>) => apiRef.current.state.customKey,
  (customKey) => customKey.customKeyBis,
);
