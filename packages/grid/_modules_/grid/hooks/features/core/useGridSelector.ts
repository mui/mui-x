import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridState } from './useGridState';
import { GridState } from './gridState';

export const useGridSelector = <State>(
  apiRef: GridApiRef,
  selector: (state: GridState) => State,
) => {
  const [state] = useGridState(apiRef);
  return selector(state);
};
