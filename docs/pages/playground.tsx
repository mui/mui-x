import { useData } from 'storybook/src/hooks/useData';
import { DataGridPro } from '@mui/x-data-grid-pro';
import * as React from 'react';

export default function Page2PropSnap() {
  const data = useData(2000, 200);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro rows={data.rows} columns={data.columns} pagination pageSize={50} page={1} />
    </div>
  );
}
