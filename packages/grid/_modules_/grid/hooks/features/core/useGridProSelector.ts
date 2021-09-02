import { GridApiRef } from '../../../models';
import { GridState } from './gridState';
import { useGridState } from './useGridState';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridSignature } from '../../root/useGridApiEventHandler';

/**
 * Temporary hack
 * TODO: Find a correct way to pass pro-only data to the components without importing their selectors in the component
 */
export const useGridProSelector = <State>(
  apiRef: GridApiRef,
  selector: (state: GridState) => State,
) => {
  const [state] = useGridState(apiRef);
  const rootProps = useGridRootProps();

  if (rootProps.signature !== GridSignature.DataGridPro) {
    return undefined;
  }

  return selector(state);
};
