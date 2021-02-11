import * as React from 'react';
import { XGrid, GridToolbar } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Toolbar',
  component: XGrid,
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
      <XGrid
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
      <XGrid
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
      <XGrid
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
