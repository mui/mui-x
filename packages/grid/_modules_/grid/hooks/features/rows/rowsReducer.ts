import { createRowModel, RowId, RowModel, RowsProp } from '../../../models/rows';

export interface InternalRowsState {
  idRowsLookup: Record<RowId, RowModel>;
  allRows: RowId[];
  totalRowCount: number;
}

export const getInitialRowState: () => InternalRowsState = () => ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0,
});

// Actions
const UPDATE_ROW_STATE = 'UPDATE_ROW_STATE';
const ROW_PROP_CHANGED_ACTION = 'ROW_PROP_CHANGED';

type UpdateRowStateAction = { type: 'UPDATE_ROW_STATE'; payload: InternalRowsState };
type RowPropChangedAction = {
  type: 'ROW_PROP_CHANGED';
  payload: { rows: RowsProp; totalRowCount?: number };
};

export type RowsActions = UpdateRowStateAction | RowPropChangedAction;

// Actions Creator
export const updateRowStateActionCreator = (state: InternalRowsState): UpdateRowStateAction => ({
  type: UPDATE_ROW_STATE,
  payload: state,
});

export const rowPropChangedActionCreator = (
  rows: RowsProp,
  totalRowCount?: number,
): RowPropChangedAction => ({ type: ROW_PROP_CHANGED_ACTION, payload: { rows, totalRowCount } });

// Pure functions
function convertRowsPropToState({
  rows,
  totalRowCount,
}: {
  rows: RowsProp;
  totalRowCount?: number;
}): InternalRowsState {
  const state: InternalRowsState = { allRows: [], idRowsLookup: {}, totalRowCount: 0 };
  rows.reduce((idLookup, rowData, index) => {
    const model = createRowModel(rowData);
    state.idRowsLookup[model.id] = model;
    state.allRows = [...state.allRows, model.id];
    state.totalRowCount =
      totalRowCount && totalRowCount > state.allRows.length ? totalRowCount : state.allRows.length;
    return state;
  }, state);
  return state;
}

// Reducer
export const rowReducer = (state: InternalRowsState, action: RowsActions): InternalRowsState => {
  switch (action.type) {
    case ROW_PROP_CHANGED_ACTION:
      return convertRowsPropToState(action.payload);
    case UPDATE_ROW_STATE:
      return { ...action.payload };
    default:
      return state;
  }
};
