import { GridState } from '../../hooks/features/core/gridState';
import { ControlStateItem } from '../controlStateItem';

export interface GridControlStateApi {
  registerControlState: <TModel, TState>(controlState: ControlStateItem<TModel, TState>) => void;
  applyControlStateConstraint: (state: GridState) => {
    shouldUpdate: boolean;
    postUpdate: () => void;
  };
}
