import { GridState } from '../hooks/features/core/gridState';
import { GridApi } from './api/gridApi';

export interface GridControlStateItem<TModel> {
  stateId: string;
  propModel?: TModel;
  stateSelector: (state: GridState) => TModel;
  propOnChange?: (model: TModel, details: { api?: GridApi }) => void;
  changeEvent: string;
}
