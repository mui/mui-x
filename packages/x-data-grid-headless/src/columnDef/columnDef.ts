// Check if a type is an empty object
type IsEmptyObject<T> = keyof T extends never ? true : false;

// Make plugin namespaces optional while keeping inner type strict
// Maps { sorting: { sortable?: boolean } } to { sorting?: { sortable?: boolean } }
type PartialPluginMeta<T> = {
  [K in keyof T]?: T[K];
};

// Base column definition without plugins
type BaseColumnDef<TData> = {
  id: string;
  field?: keyof TData;
  header?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
};

// Column definition with optional plugins metadata
// When TPluginMeta is empty, plugins property is not allowed
// When TPluginMeta has keys, plugins property is optional
export type ColumnDef<TData, TPluginMeta = {}> =
  IsEmptyObject<TPluginMeta> extends true
    ? BaseColumnDef<TData>
    : BaseColumnDef<TData> & {
        /**
         * Plugin-specific column metadata.
         * Each plugin can define its own metadata under `plugins.[pluginName]`.
         * @example
         * ```ts
         * {
         *   plugins: {
         *     sorting: { sortable: true },
         *   }
         * }
         * ```
         */
        plugins?: PartialPluginMeta<TPluginMeta>;
      };
