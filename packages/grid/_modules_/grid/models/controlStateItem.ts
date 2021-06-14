import { GridState } from '../hooks/features/core/gridState';

export interface ControlStateItem<TModel, TState> {
  stateId: string;
  propModel?: any;
  stateSelector: (state: GridState) => TState;
  propOnChange?: (model: TModel) => void;
  onChangeCallback?: (model: TModel) => void;
  mapStateToModel?: (state: TState) => TModel | undefined;
}
