import * as React from 'react';
import { createSelector } from './createSelector';
import { GridStateCommunity } from '../models/gridStateCommunity';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

interface GridCustomState extends GridStateCommunity {
  customKey: { customKeyBis: number };
}

createSelector(
  // @ts-expect-error The state must be typed with GridState
  (state: unknown) => state.columns.orderedFields,
  (fields: any) => fields,
);

createSelector(
  // @ts-expect-error Missing combiner function
  (state: GridStateCommunity) => state.columns.orderedFields,
  (state: GridStateCommunity) => state.columns.lookup,
);

createSelector(
  (state: GridStateCommunity) => state.columns.orderedFields,
  (fields) => fields,
  // @ts-expect-error Wrong state value
)(null);

createSelector(
  (state: GridStateCommunity) => state.columns.orderedFields,
  (fields) => fields,
)({} as React.MutableRefObject<GridApiCommunity>);

createSelector(
  (state: GridStateCommunity) => state.columns.orderedFields,
  (fields) => fields,
)({} as GridStateCommunity, { id: 1 });

createSelector(
  // @ts-expect-error Wrong state key
  (state: GridStateCommunity) => state.customKey,
  (customKey) => customKey.custmKeyBis,
);

createSelector(
  (state: GridCustomState) => state.customKey,
  (customKey) => customKey.customKeyBis,
);
