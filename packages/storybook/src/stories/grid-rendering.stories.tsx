import * as React from 'react';
import { ElementSize, XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';

export default {
  title: 'X-Grid Tests/Rendering',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const RenderInputInCell = () => {
  const size: ElementSize = { width: 800, height: 600 };

  const handleInputKeyDown = () => {};

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <input type="text" placeholder={params.value} onKeyDown={() => handleInputKeyDown()} />
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'John',
    },
    {
      id: 2,
      name: 'Jane',
    },
  ];

  return (
    <div style={{ width: size.width, height: size.height, display: 'flex' }}>
      <XGrid rows={rows} columns={columns} hideToolbar />
    </div>
  );
};
