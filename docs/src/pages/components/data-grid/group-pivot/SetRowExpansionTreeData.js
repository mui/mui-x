import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function SetRowExpansionTreeData() {
  const { data, loading } = useDemoTreeData({
    rowLength: [10, 5, 3],
    randomLength: true,
  });
  const apiRef = useGridApiRef();

  const toggleFirstRow = () => {
    const rowId = apiRef.current.getRowIdFromRowIndex(0);
    apiRef.current.UNSTABLE_setRowExpansion(
      rowId,
      !apiRef.current.UNSTABLE_getRowNode(rowId)?.expanded,
    );
  };

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <Button onClick={toggleFirstRow}>Toggle 1st row expansion</Button>
      <div style={{ height: 300, width: '100%' }}>
        <DataGridPro
          apiRef={apiRef}
          loading={loading}
          treeData
          disableSelectionOnClick
          {...data}
        />
      </div>
    </Stack>
  );
}
