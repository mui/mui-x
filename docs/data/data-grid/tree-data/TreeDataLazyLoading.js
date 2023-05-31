import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const initRows = [];

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();
  const { loading, data, lazyLoadTreeRows } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 4, groupingField: 'name', averageChildren: 5 },
  });

  const onFetchRowChildren = React.useCallback(
    async ({ row, helpers }) => {
      try {
        const path = row ? data.getTreeDataPath(row) : [];
        const rows = await lazyLoadTreeRows({ path });
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
        onFetchRowChildren={onFetchRowChildren}
        isServerSideRow={(row) => row.hasChildren}
        getDescendantCount={(row) => row.descendantCount}
        rowsLoadingMode="server"
      />
    </div>
  );
}
