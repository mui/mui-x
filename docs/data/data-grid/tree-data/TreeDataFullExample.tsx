import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function TreeDataFullExample() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 200 },
  });

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.expandAllRows()}>Expand all</Button>
      <Button onClick={() => apiRef.current?.collapseAllRows()}>Collapse all</Button>
      <div style={{ height: 400 }}>
        <DataGridPro loading={loading} {...data} apiRef={apiRef} />
      </div>
    </div>
  );
}
