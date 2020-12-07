import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { action } from '@storybook/addon-actions';

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
      <XGrid rows={rows} columns={columns} hideToolbar />
    </div>
  );
};
