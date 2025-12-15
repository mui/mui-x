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
  // With sorting plugin only
  const grid1 = useDataGrid({
    data: [] as User[],
    columns: [
      { id: 'name', field: 'name', sortable: true },
      { id: 'email', field: 'email' },
    ],
    getRowId: (row) => row.rowId, // Internal plugin options are available
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

  // Sorting API is available
  grid1.api.sorting.sortColumn('name', 'asc');
  grid1.api.sorting.setSortModel([]);

  // @ts-expect-error pagination API does not exist
  grid1.api.pagination.setPage(1);

  // Internal plugins state is available
  grid1.state.rows.tree;

  // With both sorting and pagination plugins
  const grid2 = useDataGrid({
    data: [] as User[],
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

  return;
}
