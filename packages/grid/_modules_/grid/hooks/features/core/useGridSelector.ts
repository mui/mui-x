import { ApiRef } from '../../../models/api/apiRef';
import { GridApi } from '../../../models/api/gridApi';
import { useGridState } from './useGridState';

export const useGridSelector = <State>(
  apiRef: ApiRef | GridApi | undefined,
  selector: (state: any) => State,
) => {
  const [state, ,] = useGridState(apiRef!.hasOwnProperty('current') ? apiRef! as ApiRef : {current: (<GridApi>apiRef!)});

  return selector(state);
};

