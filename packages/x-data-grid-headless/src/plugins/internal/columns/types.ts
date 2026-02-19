/**
 * The column type used to determine default behaviors (e.g. filter operators).
 */
export type ColumnType = 'string' | 'number' | 'date' | 'dateTime' | 'boolean' | 'singleSelect';

// Base column definition
type BaseColumnDef<TData> = {
  id: string;
  field?: keyof TData;
  header?: string;
  size?: number;
  type?: ColumnType;
};

// Column definition with plugin metadata
// Plugin column metadata (like { sortable?: boolean }) is merged with BaseColumnDef
export type ColumnDef<TData, TPluginMeta = {}> = BaseColumnDef<TData> & Partial<TPluginMeta>;

export type ColumnState<TColumnMeta = {}> = ColumnDef<any, TColumnMeta> & {
  dirty?: boolean;
  computedSize?: number;
};

export type ColumnLookup<TColumnMeta = {}> = {
  [field: string]: ColumnState<TColumnMeta>;
};

export type ColumnVisibilityState = 'visible' | 'collapsed' | 'hidden';

export type ColumnVisibilityModel = Record<string, ColumnVisibilityState>;

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

export interface ColumnsOptions<TData = any, TColumnMeta = {}> {
  columns: ColumnDef<TData, TColumnMeta>[];
  columnVisibilityModel?: ColumnVisibilityModel;
}

export interface ColumnsApi<TColumnMeta = {}> {
  get: (field: string) => ColumnState<TColumnMeta> | undefined;
  getAll: () => ColumnState<TColumnMeta>[];
  getVisible: (includeCollapsed?: boolean) => ColumnState<TColumnMeta>[];
  getIndex: (field: string, useVisibleColumns?: boolean) => number;
  update: (columns: ColumnDef<any>[]) => void;
  setVisibilityModel: (model: ColumnVisibilityModel) => void;
  setVisibility: (field: string, state: ColumnVisibilityState) => void;
  setSize: (field: string, size: number) => void;
  setIndex: (field: string, targetIndex: number) => void;
}

export interface ColumnsPluginState {
  columns: ColumnsState;
}

export interface ColumnsPluginOptions<TData = any, TColumnMeta = {}> extends ColumnsOptions<
  TData,
  TColumnMeta
> {
  initialState?: {
    columns?: Partial<ColumnsState>;
  };
}

export interface ColumnsPluginApi<TColumnMeta = {}> {
  columns: ColumnsApi<TColumnMeta>;
}
