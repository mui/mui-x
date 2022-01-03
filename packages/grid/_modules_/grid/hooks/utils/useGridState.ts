import { GridApiRef } from '../../models/api/gridApiRef';

/**
 * @deprecated Use `apiRef.current.state`, `apiRef.current.setState` and `apiRef.current.forceUpdate` instead.
 */
export const useGridState = (apiRef: GridApiRef) =>
  [apiRef.current.state, apiRef.current.setState, apiRef.current.forceUpdate] as const;
