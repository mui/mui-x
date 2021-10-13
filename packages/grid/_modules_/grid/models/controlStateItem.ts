import { GridState } from './gridState';
import { GridCallbackDetails } from './api/gridCallbackDetails';

export interface GridControlStateItem<TModel> {
  stateId: string;
  propModel?: TModel;
  stateSelector: (state: GridState) => TModel;
  propOnChange?: (model: TModel, details: GridCallbackDetails) => void;
  changeEvent: string;
}
