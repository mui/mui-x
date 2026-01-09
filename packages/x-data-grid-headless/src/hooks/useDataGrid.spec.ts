import { createPlugin, type Plugin } from '../plugins/core/plugin';
import paginationPlugin, { type PaginationModel } from '../plugins/pagination';
import sortingPlugin, { type SortModel } from '../plugins/sorting';
import { useDataGrid } from './useDataGrid';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export function Example() {
  const rows: User[] = [];
  // With sorting plugin only
  const grid1 = useDataGrid({
    rows,
    columns: [
      { id: 'name', field: 'name', sortable: true },
      { id: 'email', field: 'email' },
    ],
    // Internal plugin options are available
    getRowId: (row) => {
      row.name;
      // @ts-expect-error
      row.nonExistingProperty;
      return row.id;
    },
    plugins: [sortingPlugin],

    // ✓ These properties are available (from sortingPlugin)
    sortModel: [{ field: 'name', sort: 'asc' }],
    onSortModelChange: (_model: SortModel) => {
      // Handle sort model change
    },
    enableSorting: true,
    enableMultiSort: false,

    // @ts-expect-error Property 'paginationModel' does not exist
    paginationModel: { page: 0, pageSize: 10 },
  });

  // Internal plugins API is available
  grid1.api.rows.getRowNode(1);
  {
    const row = grid1.api.rows.getRow(1);
    if (row) {
      row.name;
      // @ts-expect-error
      row.nonExistingProperty;
    }
  }

  // Sorting API is available
  grid1.api.sorting.sortColumn('name', 'asc');
  grid1.api.sorting.setSortModel([]);

  // @ts-expect-error pagination API does not exist
  grid1.api.pagination.setPage(1);

  // Internal plugins state is available
  grid1.state.rows.tree;

  // Hooks - Internal plugins (rows, columns)
  grid1.hooks.rows.useRowIds;
  grid1.hooks.rows.useTree;
  grid1.hooks.rows.useLoading;
  grid1.hooks.columns.useOrderedFields;
  grid1.hooks.columns.useVisibleColumns;
  grid1.hooks.columns.useAllColumns;

  grid1.hooks.sorting.useSortModel;
  // @ts-expect-error pagination hooks do not exist
  grid1.hooks.pagination.usePaginationModel;

  // With both sorting and pagination plugins
  const grid2 = useDataGrid({
    rows: [] as User[],
    columns: [
      { id: 'name', field: 'name', sortable: true },
      { id: 'email', field: 'email' },
    ],
    plugins: [sortingPlugin, paginationPlugin],

    // ✓ All properties available
    sortModel: [{ field: 'name', sort: 'asc' }],
    onSortModelChange: (_model: SortModel) => {
      // Handle sort model change
    },
    paginationModel: { page: 0, pageSize: 10 },
    onPaginationModelChange: (_model: PaginationModel) => {
      // Handle pagination model change
    },
  });

  // Internal plugins API is available
  grid2.api.rows.getRowNode(1);

  // ✓ Both APIs available
  grid2.api.sorting.sortColumn('name', 'asc');
  grid2.api.pagination.setPage(1);

  // Hooks - Internal plugins (rows, columns)
  grid2.hooks.rows.useRowIds;
  grid2.hooks.rows.useTree;
  grid2.hooks.rows.useRowIdToModelLookup;
  grid2.hooks.columns.useOrderedFields;
  grid2.hooks.columns.useVisibleColumns;
  grid2.hooks.columns.useLookup;

  grid2.hooks.sorting.useSortModel;
  grid2.hooks.pagination.usePaginationModel;

  // Extract grid options type
  const plugins = [sortingPlugin, paginationPlugin] as const;
  type GridOptions = Parameters<typeof useDataGrid<typeof plugins, User>>[0];

  const getRowId: GridOptions['getRowId'] = (row) => {
    {
      type Test = Expect<Equal<typeof row, User>>;
    }
    return row.id;
  };

  const columns: GridOptions['columns'] = [{ id: 'name', field: 'name', sortable: true }];

  const gridOptions: GridOptions = {
    rows,
    columns,
    getRowId,
    plugins,
  };

  const grid3 = useDataGrid(gridOptions);

  return;
}

type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

// Test plugins with dependencies

type PluginA = Plugin<
  'pluginA',
  { pluginA: { a: string } },
  { pluginA: { getA: () => string } },
  { enableA?: boolean; aValue?: string; onAChange?: (value: string) => void }
>;

const pluginA = createPlugin<PluginA>()({
  name: 'pluginA',
  initialize: (params) => ({ pluginA: { a: params.aValue ?? 'A' } }),
  use: (_store, params) => ({
    pluginA: { getA: () => (params.enableA !== false ? 'A' : 'disabled') },
  }),
});

type PluginB = Plugin<
  'pluginB',
  { pluginB: { b: string } },
  { pluginB: { getB: () => string } },
  { bMode?: 'fast' | 'slow'; onBEvent?: () => void }
>;

const pluginB = createPlugin<PluginB>()({
  name: 'pluginB',
  initialize: () => ({ pluginB: { b: 'B' } }),
  use: (_store, params, api) => {
    // @ts-expect-error pluginA is not declared as a dependency
    api.pluginA;
    return { pluginB: { getB: () => (params.bMode === 'fast' ? 'B-fast' : 'B') } };
  },
});

type PluginC = Plugin<
  'pluginC',
  { pluginC: { c: string } },
  { pluginC: { getC: () => string; getCombined: () => string } },
  { cPrefix?: string; enableCombined?: boolean }
>;

// Plugin C depends on A and B (required dependencies)
const pluginC = createPlugin<PluginC>()({
  name: 'pluginC',
  dependencies: [pluginA, pluginB],
  initialize: (params) => ({ pluginC: { c: params.cPrefix ?? 'C' } }),
  use: (_store, params, api) => {
    // api.pluginA and api.pluginB are automatically typed from dependencies
    return {
      pluginC: {
        getC: () => params.cPrefix ?? 'C',
        getCombined: () => {
          if (params.enableCombined === false) {
            return 'combined-disabled';
          }
          return `${api.pluginA.getA()}-${api.pluginB.getB()}-C`;
        },
      },
    };
  },
});

type PluginD = Plugin<
  'pluginD',
  { pluginD: { d: string } },
  { pluginD: { getD: () => string; getDWithA: () => string } },
  { dFallback?: string }
>;

// Plugin D has optional dependency on pluginA
// Use `import type` for optional plugins - type-only imports don't affect bundle
const pluginD = createPlugin<PluginD>()({
  name: 'pluginD',
  initialize: () => ({ pluginD: { d: 'D' } }),
  use: (_store, params, api) => {
    // @ts-expect-error pluginA is not declared as a dependency
    api.pluginA;

    return {
      pluginD: {
        getD: () => 'D',
        getDWithA: () => {
          if (api.pluginRegistry.hasPlugin<PluginA>(api, 'pluginA')) {
            // api.pluginA is now typed
            return `${api.pluginA.getA()}-D`;
          }
          return params.dFallback ?? 'D-alone';
        },
      },
    };
  },
});

export function RequiredDependenciesExample() {
  const rows: User[] = [];

  const grid = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    // Required dependencies: pluginC requires pluginA and pluginB
    // Only pluginC is specified, but pluginA and pluginB APIs are available
    // because they are auto-registered as dependencies
    plugins: [pluginC],
    enableA: true,
    bMode: 'fast',
  });

  // All dependency APIs are available
  grid.api.pluginA.getA();
  grid.api.pluginB.getB();
  grid.api.pluginC.getC();
  grid.api.pluginC.getCombined();

  return;
}

// Optional dependencies: pluginD optionally uses pluginA
export function OptionalDependenciesExample() {
  const rows: User[] = [];

  // Without pluginA
  const grid1 = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginD],
    // @ts-expect-error pluginA not added
    enableA: true,
    dFallback: 'fallback-value',
  });

  grid1.api.pluginD.getD();
  grid1.api.pluginD.getDWithA();

  // @ts-expect-error pluginA not added
  grid1.api.pluginA.getA();

  // With pluginA
  const grid2 = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginA, pluginD],
    enableA: true,
  });

  grid2.api.pluginA.getA();
  grid2.api.pluginD.getD();
  grid2.api.pluginD.getDWithA();

  return;
}

// Combining required + optional dependencies
export function CombinedDependenciesExample() {
  const rows: User[] = [];

  const grid = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginC, pluginD],
  });

  grid.api.pluginA.getA();
  grid.api.pluginB.getB();
  grid.api.pluginC.getC();
  grid.api.pluginC.getCombined();
  grid.api.pluginD.getD();
  grid.api.pluginD.getDWithA();

  return;
}

// Test that plugin options are properly typed and available
export function PluginOptionsExample() {
  const rows: User[] = [];

  // All plugin options should be available based on the plugins array
  const grid = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginA, pluginB, pluginC, pluginD],

    // ✓ PluginA options
    enableA: true,
    aValue: 'custom-A',
    onAChange: (_value) => {},

    // ✓ PluginB options
    bMode: 'fast',
    onBEvent: () => {},

    // ✓ PluginC options (also includes A and B options from dependencies)
    cPrefix: 'prefix-',
    enableCombined: true,

    // ✓ PluginD options
    dFallback: 'fallback-value',
  });

  grid.api.pluginA.getA();

  return;
}

// Test that only relevant plugin options are available
export function PluginOptionsSubsetExample() {
  const rows: User[] = [];

  // Only pluginA - should only have A options
  const grid1 = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginA],
    enableA: true,
    aValue: 'test',
    // @ts-expect-error bMode is not available (pluginB not added)
    bMode: 'fast',
  });

  grid1.api.pluginA.getA();

  // pluginC includes A and B dependencies, so their options should be available
  const grid2 = useDataGrid({
    rows,
    columns: [{ id: 'name', field: 'name' }],
    plugins: [pluginC],

    // ✓ PluginC's own options
    cPrefix: 'test',
    enableCombined: false,

    // ✓ PluginA options (from dependency)
    enableA: true,
    aValue: 'from-dep',

    // ✓ PluginB options (from dependency)
    bMode: 'slow',
  });

  // All APIs available (including dependencies)
  grid2.api.pluginA.getA();
  grid2.api.pluginB.getB();
  grid2.api.pluginC.getC();

  return;
}
