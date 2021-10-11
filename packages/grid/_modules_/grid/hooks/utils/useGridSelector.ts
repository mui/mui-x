import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridState } from './useGridState';
import { GridState } from '../../models/gridState';

export const useGridSelector = <T>(apiRef: GridApiRef, selector: (state: GridState) => T) => {
  const [state] = useGridState(apiRef);
  return selector(state);
};
