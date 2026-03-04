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
