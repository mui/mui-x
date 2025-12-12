import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store } from '@base-ui/utils/store';
import { ColumnDef } from '../columnDef/columnDef';
import { Plugin } from '../plugins/core/plugin';
import { PluginsApi, PluginsOptions, PluginsState } from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';

type GridRowId = string | number;

interface CoreDataGridOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData) => GridRowId;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CoreDataGridState<TData> {
  // rows: {
  //   rowsLookup: Map<GridRowId, TData>;
  // };
}

// Full options = Core + Plugin options
type UseDataGridOptions<
  TData,
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
> = CoreDataGridOptions<TData> &
  PluginsOptions<TPlugins> & {
    plugins: TPlugins;
    initialState?: Partial<PluginsState<TPlugins>>;
  };

interface DataGridInstance<TData, TPlugins extends readonly Plugin<any, any, any, any, any>[]> {
  options: UseDataGridOptions<TData, TPlugins>;
  state: CoreDataGridState<TData> & PluginsState<TPlugins>;
  api: PluginsApi<TPlugins>;
}

export const useDataGrid = <
  TData,
  const TPlugins extends readonly Plugin<any, any, any, any, any>[],
>(
  options: UseDataGridOptions<TData, TPlugins>,
): DataGridInstance<TData, TPlugins> => {
  const { pluginRegistry, stateStore } = useRefWithInit(() => {
    const registry = new PluginRegistry(options.plugins);
    let initState: CoreDataGridState<TData> = {};
    registry.forEach((plugin) => {
      initState = { ...initState, ...plugin.initialize(options) };
    });
    const store = new Store<CoreDataGridState<TData>>(initState);
    return { pluginRegistry: registry, stateStore: store };
  }).current;

  const api = useRefWithInit(() => ({}) as PluginsApi<TPlugins>);

  pluginRegistry.forEach((plugin) => {
    const pluginApi = plugin.use(stateStore, options, options.initialState);
    Object.assign(api, pluginApi);
  });

  return { store: stateStore, api, options } as any;
};
