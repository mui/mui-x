import { ControlStateItem } from '../controlStateItem';

export interface GridControlStateApi {
  registerControlState: <TModel, TState>(controlState: ControlStateItem<TModel, TState>) => void;
}
