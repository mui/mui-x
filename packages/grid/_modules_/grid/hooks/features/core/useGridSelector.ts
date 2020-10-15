import { ApiRef } from '../../../models/api/apiRef';
import { GridState } from './gridState';
import { useGridState } from './useGridState';

export const useGridSelector = <State>(apiRef: ApiRef | undefined, selector: (state: GridState) => State) => {
  const [state, ,] = useGridState(apiRef!);

  return selector(state);
};
