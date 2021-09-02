import { GridApiRef } from '../../models/api/gridApiRef';
import { GridControlStateItem } from '../../models/controlStateItem';

export const useGridRegisterControlState = <TModel>(
  apiRef: GridApiRef,
  controlStateItem: GridControlStateItem<TModel>,
) => {
  apiRef.current.updateControlState(controlStateItem);
};
