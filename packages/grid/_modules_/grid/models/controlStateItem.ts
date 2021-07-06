import { GridState } from '../hooks/features/core/gridState';

export interface ControlStateItem<TModel> {
  stateId: string;
  propModel?: any;
  stateSelector: (state: GridState) => TModel;
  propOnChange?: (model: TModel) => void;
  onChangeCallback?: (model: TModel) => void;
}
