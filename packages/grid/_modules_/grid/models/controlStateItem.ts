import { GridState } from '../hooks/features/core/gridState';
import { GridApiDetails } from './api/gridApiDetails';

export interface GridControlStateItem<TModel> {
  stateId: string;
  propModel?: TModel;
  stateSelector: (state: GridState) => TModel;
  propOnChange?: (model: TModel, details: GridApiDetails) => void;
  changeEvent: string;
}
