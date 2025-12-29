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

  // Selectors
  grid1.selectors.rows.tree;
  grid1.selectors.columns.orderedFields;
  grid1.selectors.sorting.sortModel;
  // @ts-expect-error pagination selector does not exist
  grid1.selectors.pagination.model;

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

  // Selectors
  grid2.selectors.rows.tree;
  grid2.selectors.columns.orderedFields;
  grid2.selectors.sorting.sortModel;
  grid2.selectors.pagination.model;

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
