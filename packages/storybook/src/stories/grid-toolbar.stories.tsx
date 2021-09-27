import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import * as React from 'react';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Toolbar',
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

export const Export = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 60,
  });

  return (
    <div style={{ height: 600 }}>
      <DataGridPro
        {...data}
        checkboxSelection
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

export const PrintExportSnap = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', height: 600 }}>
        <DataGrid
          {...data}
          checkboxSelection
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
      <div id="grid-print-container" />
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
