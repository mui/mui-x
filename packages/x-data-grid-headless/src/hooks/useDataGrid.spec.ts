import {
  createPlugin,
  sortingPlugin,
  paginationPlugin,
  rowsPlugin,
  columnsPlugin,
  type Plugin,
  type GridSortModel,
  type PaginationModel,
} from '../plugins';
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
    onSortModelChange: (_model: GridSortModel) => {
      // Handle sort model change
    },
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
  grid1.getState().rows.tree;

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
    onSortModelChange: (_model: GridSortModel) => {
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

// Plugin Column Metadata Extension
// Test that column definition is typed correctly based on plugins used
export function ColumnMetadataTypingExample() {
  const rows: User[] = [];

  // Without any plugins - columns should not have plugin-specific metadata
  const grid1 = useDataGrid({
    rows,
    columns: [
      {
        id: 'name',
        field: 'name',
        // @ts-expect-error sortable should not exist without sorting plugin
        sortable: true,
      },
    ],
    plugins: [],
  });

  // With sorting plugin - columns should have sortable metadata available
  const grid2 = useDataGrid({
    rows,
    columns: [
      {
        id: 'name',
        field: 'name',
        // ✓ sortable is available with sortingPlugin
        sortable: true,
      },
      {
        id: 'email',
        field: 'email',
        // ✓ sortable is optional
      },
      {
        id: 'age',
        field: 'age',
        // @ts-expect-error cannot use non-existing plugin property
        nonExistingProperty: true,
      },
    ],
    plugins: [sortingPlugin],
  });

  return;
}

// Test plugin column metadata with dependencies
type PluginWithColumnMeta = Plugin<
  'pluginWithColumnMeta',
  { pluginWithColumnMeta: { value: string } },
  Record<string, never>, // no selectors
  { pluginWithColumnMeta: { getValue: () => string } },
  { enable?: boolean },
  { highlight?: boolean; priority?: number } // column metadata
>;

const pluginWithColumnMeta = createPlugin<PluginWithColumnMeta>()({
  name: 'pluginWithColumnMeta',
  getInitialState: (state) => ({ ...state, pluginWithColumnMeta: { value: 'test' } }),
  use: () => ({ pluginWithColumnMeta: { getValue: () => 'test' } }),
});

type PluginDependsOnPluginWithColumnMeta = Plugin<
  'pluginDependsOnPluginWithColumnMeta',
  { pluginDependsOnPluginWithColumnMeta: { derived: string } },
  Record<string, never>, // no selectors
  { pluginDependsOnPluginWithColumnMeta: { getDerived: () => string } },
  { enable?: boolean },
  { moreMeta?: boolean }, // column metadata
  readonly [typeof pluginWithColumnMeta] // depends on pluginWithColumnMeta
>;

const pluginDependsOnPluginWithColumnMeta = createPlugin<PluginDependsOnPluginWithColumnMeta>()({
  name: 'pluginDependsOnPluginWithColumnMeta',
  dependencies: [pluginWithColumnMeta],
  getInitialState: (state) => ({
    ...state,
    pluginDependsOnPluginWithColumnMeta: { derived: 'derived' },
  }),
  use: () => ({ pluginDependsOnPluginWithColumnMeta: { getDerived: () => 'derived' } }),
});

export function ColumnMetadataWithDependenciesExample() {
  const rows: User[] = [];

  // Plugin with column metadata
  const grid1 = useDataGrid({
    rows,
    columns: [
      {
        id: 'name',
        field: 'name',
        // ✓ Column metadata from pluginWithColumnMeta
        highlight: true,
        priority: 1,
      },
    ],
    plugins: [pluginWithColumnMeta],
  });

  // Plugin that depends on another plugin with column metadata
  // Both plugin's column metadata should be available
  const grid2 = useDataGrid({
    rows,
    columns: [
      {
        id: 'name',
        field: 'name',
        // ✓ Column metadata from dependency + plugin itself
        highlight: true,
        priority: 1,
        moreMeta: true,
      },
      {
        id: 'email',
        field: 'email',
        // ✓ All metadata is optional
      },
    ],
    plugins: [pluginDependsOnPluginWithColumnMeta],
  });

  // Should error on column metadata from non-included plugins
  const grid3 = useDataGrid({
    rows,
    columns: [
      {
        id: 'name',
        field: 'name',
        // @ts-expect-error moreMeta not available
        moreMeta: true,
      },
    ],
    plugins: [pluginWithColumnMeta],
  });

  return;
}

// Test plugins with dependencies
type PluginA = Plugin<
  'pluginA',
  { pluginA: { a: string } },
  Record<string, never>,
  { pluginA: { getA: () => string } },
  { enableA?: boolean; aValue?: string; onAChange?: (value: string) => void }
>;

const pluginA = createPlugin<PluginA>()({
  name: 'pluginA',
  getInitialState: (state, params) => {
    // @ts-expect-error Not initialized yet
    state.pluginA;

    // Can access internal plugins state here
    state.rows.tree;
    state.columns.orderedFields;
    return { ...state, pluginA: { a: params.aValue ?? 'A' } };
  },
  use: (_store, params) => ({
    pluginA: { getA: () => (params.enableA !== false ? 'A' : 'disabled') },
  }),
});

type PluginB = Plugin<
  'pluginB',
  { pluginB: { b: string } },
  Record<string, never>,
  { pluginB: { getB: () => string } },
  { bMode?: 'fast' | 'slow'; onBEvent?: () => void }
>;

const pluginB = createPlugin<PluginB>()({
  name: 'pluginB',
  getInitialState: (state) => {
    // Can access internal plugins state here
    state.rows.tree;
    state.columns.orderedFields;

    return { ...state, pluginB: { b: 'B' } };
  },
  use: (_store, params, api) => {
    // @ts-expect-error pluginA is not declared as a dependency
    api.pluginA;
    return { pluginB: { getB: () => (params.bMode === 'fast' ? 'B-fast' : 'B') } };
  },
});

type PluginC = Plugin<
  'pluginC',
  { pluginC: { c: string } },
  Record<string, never>,
  { pluginC: { getC: () => string; getCombined: () => string } },
  { cPrefix?: string; enableCombined?: boolean }
>;

// Plugin C depends on A and B (required dependencies)
const pluginC = createPlugin<PluginC>()({
  name: 'pluginC',
  dependencies: [pluginA, pluginB],
  getInitialState: (state, params) => {
    // Can access internal plugins state here
    state.rows.tree;
    state.columns.orderedFields;

    // Can access dependencies' state here
    state.pluginA.a;
    state.pluginB.b;
    // @ts-expect-error pluginD is not a dependency
    state.pluginD.d;

    return { ...state, pluginC: { c: params.cPrefix ?? 'C' } };
  },
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
  Record<string, never>,
  { pluginD: { getD: () => string; getDWithA: () => string } },
  { dFallback?: string }
>;

// Plugin D has optional dependency on pluginA
// Use `import type` for optional plugins - type-only imports don't affect bundle
const pluginD = createPlugin<PluginD>()({
  name: 'pluginD',
  getInitialState: (state) => {
    // Can access internal plugins state here
    state.rows.tree;
    state.columns.orderedFields;

    // @ts-expect-error Not declared as dependency
    state.pluginD.d;
    // @ts-expect-error Not declared as dependency
    state.pluginA.a;
    // @ts-expect-error Not declared as dependency
    state.pluginB.b;
    return { ...state, pluginD: { d: 'D' } };
  },
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

export function SelectorsExample() {
  const rows: User[] = [];
  const grid1 = useDataGrid({
    rows,
    columns: [
      { id: 'name', field: 'name', sortable: true },
      { id: 'email', field: 'email' },
    ],
    plugins: [sortingPlugin],
  });

  // Selectors - accessed via static plugin properties
  rowsPlugin.selectors.rowIds;
  rowsPlugin.selectors.tree;
  rowsPlugin.selectors.loading;
  columnsPlugin.selectors.orderedFields;
  columnsPlugin.selectors.visibleColumns;
  columnsPlugin.selectors.allColumns;

  sortingPlugin.selectors.sortModel;
  paginationPlugin.selectors.paginationModel;

  // Should be able to call selectors imperatively
  rowsPlugin.selectors.rowIds(grid1.getState());

  // Should be able to use with grid.use()
  grid1.use(sortingPlugin.selectors.sortModel);
  grid1.use(rowsPlugin.selectors.rowIds);

  // @ts-expect-error paginationPlugin is not added
  grid1.use(paginationPlugin.selectors.paginationModel);
}
