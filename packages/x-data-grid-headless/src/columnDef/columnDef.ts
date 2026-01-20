// Base column definition
type BaseColumnDef<TData> = {
  id: string;
  field?: keyof TData;
  header?: string;
  width?: number;
};

// Column definition with plugin metadata
// Plugin column metadata (like { sortable?: boolean }) is merged with BaseColumnDef
export type ColumnDef<TData, TPluginMeta = {}> = BaseColumnDef<TData> & Partial<TPluginMeta>;
