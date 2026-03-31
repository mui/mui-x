import { createSelector } from './createSelector';
createSelector(
// @ts-expect-error The state must be typed with GridState
(apiRef) => apiRef.current.state.columns.orderedFields, (fields) => fields);
createSelector((apiRef) => apiRef.current.state.columns.orderedFields, 
// @ts-expect-error Missing combiner function
(apiRef) => apiRef.current.state.columns.lookup);
createSelector((apiRef) => apiRef.current.state.columns.orderedFields, (fields) => fields)(null);
createSelector((apiRef) => apiRef.current.state.columns.orderedFields, (fields) => fields)({});
createSelector(
// @ts-expect-error Wrong state key
(apiRef) => apiRef.current.state.customKey, (customKey) => customKey.custmKeyBis);
createSelector((apiRef) => apiRef.current.state.customKey, (customKey) => customKey.customKeyBis);
