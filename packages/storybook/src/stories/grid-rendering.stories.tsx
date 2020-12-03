import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
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
  // eslint-disable-next-line no-console
  const handleInputKeyDown = (event) => console.log(event.target.value);

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
