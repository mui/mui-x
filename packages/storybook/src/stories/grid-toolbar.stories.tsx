import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import * as React from 'react';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Toolbar',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const DensitySelectorCompact = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <DataGridPro
        rows={data.rows}
        columns={data.columns}
        density="compact"
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};
export const DensitySelectorComfortable = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <DataGridPro
        columns={data.columns}
        rows={data.rows}
        density="comfortable"
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};
export const CsvExport = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <DataGridPro
        columns={data.columns}
        rows={data.rows}
        checkboxSelection
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

export function AutoHeightComfortableGridSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 4,
  });

  return (
    <div style={{ width: '100%' }}>
      <DataGrid autoHeight {...data} density={'comfortable'} />
      <p>more content</p>
    </div>
  );
}
