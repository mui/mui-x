import { type Store } from '@base-ui/utils/store';
import { type ColumnDef } from '../../../columnDef/columnDef';

// ================================
// Types
// ================================

export type ColumnState<TColumnMeta = {}> = ColumnDef<any, TColumnMeta> & {
  hasBeenResized?: boolean;
  computedSize?: number;
};

export type ColumnLookup<TColumnMeta = {}> = {
  [field: string]: ColumnState<TColumnMeta>;
};

export type ColumnVisibilityModel = Record<string, boolean>;

export interface ColumnsState {
  orderedFields: string[];
  lookup: ColumnLookup;
  columnVisibilityModel: ColumnVisibilityModel;
  initialColumnVisibilityModel: ColumnVisibilityModel;
}

export interface ColumnsInitialState {
  columnVisibilityModel?: ColumnVisibilityModel;
  orderedFields?: string[];
}

// ================================
// Options
// ================================

export interface ColumnsOptions<TData = any, TColumnMeta = {}> {
  columns: ColumnDef<TData, TColumnMeta>[];
  columnVisibilityModel?: ColumnVisibilityModel;
}

// ================================
// API
// ================================

export interface ColumnsApi<TColumnMeta = {}> {
  get: (field: string) => ColumnState<TColumnMeta> | undefined;
  getAll: () => ColumnState<TColumnMeta>[];
  getVisible: () => ColumnState<TColumnMeta>[];
  getIndex: (field: string, useVisibleColumns?: boolean) => number;
  update: (columns: ColumnDef<any>[]) => void;
  setVisibilityModel: (model: ColumnVisibilityModel) => void;
  setVisibility: (field: string, isVisible: boolean) => void;
  setSize: (field: string, size: number) => void;
  setIndex: (field: string, targetIndex: number) => void;
}

// ================================
// Default Column Values
// ================================

const DEFAULT_COLUMN_SIZE = 100;

function getDefaultColumnState(field: string): Partial<ColumnState> {
  return {
    field,
    size: DEFAULT_COLUMN_SIZE,
    hasBeenResized: false,
  };
}

// ================================
// State Initialization
// ================================

/**
 * Create the initial columns state from options.
 */
export function createColumnsState<TData>(
  columns: ColumnDef<TData>[],
  columnVisibilityModel: ColumnVisibilityModel = {},
  initialState?: ColumnsInitialState,
): ColumnsState {
  const orderedFields: string[] = [];
  const lookup: ColumnLookup = {};
  const visibilityModel: ColumnVisibilityModel = {
    ...columnVisibilityModel,
    ...initialState?.columnVisibilityModel,
  };

  // If initialState has orderedFields, use them as base order
  const initialStateOrderedFields = initialState?.orderedFields ?? [];
  const initialStateOrderedFieldsSet = new Set(initialStateOrderedFields);

  // First, add columns from initialState order
  initialStateOrderedFields.forEach((field) => {
    const column = columns.find((col) => getColumnField(col) === field);
    if (column) {
      const fieldName = getColumnField(column);
      orderedFields.push(fieldName);
      lookup[fieldName] = {
        ...getDefaultColumnState(fieldName),
        ...column,
        id: fieldName,
      } as ColumnState;
    }
  });

  // Then add remaining columns
  columns.forEach((column) => {
    const field = getColumnField(column);
    if (!initialStateOrderedFieldsSet.has(field)) {
      orderedFields.push(field);
      lookup[field] = {
        ...getDefaultColumnState(field),
        ...column,
        id: field,
      } as ColumnState;
    }
  });

  return {
    orderedFields,
    lookup,
    columnVisibilityModel: visibilityModel,
    initialColumnVisibilityModel: visibilityModel,
  };
}

/**
 * Get the field name from a column definition.
 * Uses id as primary identifier since it's required in ColumnDef.
 */
function getColumnField<TData>(column: ColumnDef<TData>): string {
  return column.id || String(column.field || '');
}

// ================================
// API Creation
// ================================

interface CoreState {
  columns: ColumnsState;
}

/**
 * Create the columns API methods.
 */
export function createColumnsApi<TData>(
  store: Store<CoreState>,
  _options: ColumnsOptions<TData>,
): ColumnsApi {
  const getColumn = (field: string): ColumnState | undefined => {
    return store.state.columns.lookup[field];
  };

  const getAllColumns = (): ColumnState[] => {
    const { orderedFields, lookup } = store.state.columns;
    return orderedFields.map((field) => lookup[field]).filter(Boolean);
  };

  const getVisibleColumns = (): ColumnState[] => {
    const { orderedFields, lookup, columnVisibilityModel } = store.state.columns;
    return orderedFields
      .filter((field) => columnVisibilityModel[field] !== false)
      .map((field) => lookup[field])
      .filter(Boolean);
  };

  const getColumnIndex = (field: string, useVisibleColumns: boolean = true): number => {
    const columns = useVisibleColumns ? getVisibleColumns() : getAllColumns();
    return columns.findIndex((col) => col.id === field);
  };

  const updateColumns = (columns: ColumnDef<any>[]): void => {
    const newColumnsState = createColumnsState(
      columns,
      store.state.columns.columnVisibilityModel,
      undefined,
    );

    store.setState({
      ...store.state,
      columns: {
        ...newColumnsState,
        initialColumnVisibilityModel: store.state.columns.initialColumnVisibilityModel,
      },
    });
  };

  const setColumnVisibilityModel = (model: ColumnVisibilityModel): void => {
    const currentModel = store.state.columns.columnVisibilityModel;
    if (currentModel !== model) {
      store.setState({
        ...store.state,
        columns: {
          ...store.state.columns,
          columnVisibilityModel: model,
        },
      });
    }
  };

  const setColumnVisibility = (field: string, isVisible: boolean): void => {
    const columnVisibilityModel = store.state.columns.columnVisibilityModel;
    const isCurrentlyVisible: boolean = columnVisibilityModel[field] ?? true;
    if (isVisible !== isCurrentlyVisible) {
      const newModel: ColumnVisibilityModel = {
        ...columnVisibilityModel,
        [field]: isVisible,
      };
      setColumnVisibilityModel(newModel);
    }
  };

  const setColumnSize = (field: string, size: number): void => {
    const columnsState = store.state.columns;
    const column = columnsState.lookup[field];
    if (column) {
      const newColumn: ColumnState = {
        ...column,
        size,
        hasBeenResized: true,
      };

      store.setState({
        ...store.state,
        columns: {
          ...columnsState,
          lookup: {
            ...columnsState.lookup,
            [field]: newColumn,
          },
        },
      });
    }
  };

  const setColumnIndex = (field: string, targetIndex: number): void => {
    const { orderedFields } = store.state.columns;
    const oldIndex = orderedFields.indexOf(field);
    if (oldIndex === targetIndex || oldIndex === -1) {
      return;
    }

    const updatedFields = [...orderedFields];
    const fieldRemoved = updatedFields.splice(oldIndex, 1)[0];
    updatedFields.splice(targetIndex, 0, fieldRemoved);

    store.setState({
      ...store.state,
      columns: {
        ...store.state.columns,
        orderedFields: updatedFields,
      },
    });
  };

  return {
    get: getColumn,
    getAll: getAllColumns,
    getVisible: getVisibleColumns,
    getIndex: getColumnIndex,
    update: updateColumns,
    setVisibilityModel: setColumnVisibilityModel,
    setVisibility: setColumnVisibility,
    setSize: setColumnSize,
    setIndex: setColumnIndex,
  };
}
