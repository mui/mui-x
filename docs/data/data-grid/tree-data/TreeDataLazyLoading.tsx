import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridFetchRowChildrenParams,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const initRows: GridValidRowModel[] = [];

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();
  const { loading, data, lazyLoadTreeRows } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 10 },
  });

  const onFetchRowChildren = React.useCallback(
    async ({ row, helpers, filterModel }: GridFetchRowChildrenParams) => {
      try {
        const path = row ? data.getTreeDataPath!(row) : [];
        const rows = (await lazyLoadTreeRows({
          request: { path, filterModel },
        })) as GridValidRowModel[];
        helpers.success(rows);
      } catch (error) {
        // simulate network error
        helpers.error();
        console.error(error);
      }
    },
    [data.getTreeDataPath, lazyLoadTreeRows],
  );

  if (loading) {
    return null;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        rows={initRows}
        unstable_headerFilters
        onFetchRowChildren={onFetchRowChildren}
        initialState={{
          ...data.initialState,
          columns: {
            ...data.initialState?.columns,
            columnVisibilityModel: {
              ...data.initialState?.columns?.columnVisibilityModel,
              avatar: false,
            },
          },
          filter: {
            filterModel: {
              items: [
                { field: 'website', operator: 'contains', value: 'ab' },
              ]
            }
          }
        }}
        isServerSideRow={(row) => row.hasChildren}
        getDescendantCount={(row) => row.descendantCount}
        rowsLoadingMode="server"
        filterMode="server"
      />
    </div>
  );
}
