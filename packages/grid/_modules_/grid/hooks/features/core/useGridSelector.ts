import { ApiRef } from '../../../models/api/apiRef';
import { useGridState } from './useGridState';

export const useGridSelector = (apiRef: ApiRef | undefined, selector: (state: any) => any) => {
	const [state,,] = useGridState(apiRef!)

	return selector(state);
}
