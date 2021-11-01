import * as React from 'react';
import { DataGridPro, GridOverlay } from '@mui/x-data-grid-pro';
import LinearProgress from '@mui/material/LinearProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import '../style/grid-stories.css';
import { action } from '@storybook/addon-actions';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default {
  title: 'DataGridPro Test/Rendering',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const RenderInputInCell = () => {
  const handleInputKeyDown = (event) => action('InputChange')(event.target.value);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <input type="text" placeholder={params.value} onKeyDown={handleInputKeyDown} />
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'John',
    },
  ];

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={columns} />
    </div>
  );
};
export const InfiniteLoading = () => {
  const { loading, data, setRowLength } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 20,
  });

  const handleOnRowsScrollEnd = (params) => {
    const newRowLength = params.virtualRowsCount + params.viewportPageSize;
    setRowLength(newRowLength);
  };

  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        loading={loading}
        onRowsScrollEnd={handleOnRowsScrollEnd}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
};

// The visual counterpart of
// "it('should not have a horizontal scrollbar if not needed', () => {""
export function ScrollbarOverflowVerticalSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 2,
  });

  return (
    <div className="grid-container">
      <DataGridPro pagination {...data} />
    </div>
  );
}
