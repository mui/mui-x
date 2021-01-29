import * as React from 'react';
import {
  DataGrid,
  PreferencesPanel,
  GridHeader,
  ColumnsToolbarButton,
  FilterToolbarButton,
} from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid';
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
        components={{
          Header: GridHeader,
        }}
        density="compact"
      />
    </div>
  );
};
export const DensitySelectorComfortable = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <XGrid
        rows={data.rows}
        columns={data.columns}
        components={{
          Header: GridHeader,
        }}
        density="comfortable"
      />
    </div>
  );
};
export const CustomToolbar = () => {
  const data = useData(100, 50);

  const CustomGridToolbar = () => {
    return (
      <div className="my-custom-toolbar">
        <PreferencesPanel />
        <ColumnsToolbarButton />
        <FilterToolbarButton />
      </div>
    );
  };

  return (
    <div style={{ height: 600 }}>
      <DataGrid
        rows={data.rows}
        columns={data.columns}
        components={{
          Header: CustomGridToolbar,
        }}
      />
    </div>
  );
};
