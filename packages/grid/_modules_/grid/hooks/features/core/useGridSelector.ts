import { ApiRef } from '../../../models/api/apiRef';
import { useGridState } from './useGridState';

export const useGridSelector = <State>(
  apiRef: ApiRef | undefined,
  selector: (state: any) => State,
) => {
  const [state, ,] = useGridState(apiRef!);

  return selector(state);
};
