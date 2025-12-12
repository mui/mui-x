export interface ColumnDef<TData> {
  id: string;
  field?: keyof TData;
  header?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}
