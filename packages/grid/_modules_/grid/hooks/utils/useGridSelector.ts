import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';

export const useGridSelector = <T>(apiRef: GridApiRef, selector: (state: GridState) => T) => {
  return selector(apiRef.current.state);
};
