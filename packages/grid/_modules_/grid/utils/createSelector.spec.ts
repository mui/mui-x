import { createSelector } from './createSelector';
import { GridState } from '../models/gridState';
import { GridApiRef } from '../models/api/gridApiRef';

createSelector(
  // @ts-expect-error The state must be typed with GridState
  (state: unknown) => state.columns.all,
  (fields: any) => fields,
);

// @ts-expect-error Missing combiner function
createSelector(
  (state: GridState) => state.columns.all,
  (state: GridState) => state.columns.lookup,
);

createSelector(
  (state: GridState) => state.columns.all,
  (fields) => fields,
  // @ts-expect-error Wrong state value
)(null);

createSelector(
  (state: GridState) => state.columns.all,
  (fields) => fields,
)({} as GridApiRef);

createSelector(
  (state: GridState) => state.columns.all,
  (fields) => fields,
)({} as GridState);
