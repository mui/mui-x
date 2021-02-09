import * as React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { XGrid, GridToolbar } from '@material-ui/x-grid';
import { DataGrid, bgBG } from '@material-ui/data-grid';
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
        showToolbar
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
        showToolbar
        density="comfortable"
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};
export const ThemeProps = () => {
  const data = useData(100, 50);
  const theme = createMuiTheme({}, bgBG);

  return (
    <div style={{ height: 600 }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          columns={data.columns}
          rows={data.rows}
          showToolbar
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </ThemeProvider>
    </div>
  );
};
