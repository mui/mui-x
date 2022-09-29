import * as React from 'react';
import { createSelector } from './createSelector';
import { GridStateCommunity } from '../models/gridStateCommunity';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

interface GridCustomState extends GridStateCommunity {
  customKey: { customKeyBis: number };
}

createSelector(
  // @ts-expect-error The state must be typed with GridState
  (state: unknown) => state.columns.all,
  (fields: any) => fields,
);

createSelector(
  // @ts-expect-error Missing combiner function
  (state: GridStateCommunity) => state.columns.all,
  (state: GridStateCommunity) => state.columns.lookup,
);

createSelector(
  (state: GridStateCommunity) => state.columns.all,
  (fields) => fields,
  // @ts-expect-error Wrong state value
)(null);

createSelector(
  (state: GridStateCommunity) => state.columns.all,
  (fields) => fields,
)({} as React.MutableRefObject<GridApiCommunity>);

createSelector(
  (state: GridStateCommunity) => state.columns.all,
  (fields) => fields,
)({} as GridStateCommunity);

createSelector(
  // @ts-expect-error Wrong state key
  (state: GridStateCommunity) => state.customKey,
  (customKey) => customKey.custmKeyBis,
);

createSelector(
  (state: GridCustomState) => state.customKey,
  (customKey) => customKey.customKeyBis,
);
