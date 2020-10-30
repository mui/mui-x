import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import '../style/grid-stories.css';

export default {
  title: 'X-Grid Tests/Fluid Column Width',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const FewColumns = () => {
  const rows = [
    {
      id: 1,
      '2M': '2',
      '3M': '3',
    },
  ];
  const columns = [
    {
      field: 'id',
      flex: 3,
    },
    {
      field: '2M',
      width: 200,
    },
    {
      field: '3M',
      flex: 1,
    },
  ];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={columns} />
    </div>
  );
};

export const SeveralColumn = () => {
  const rows = [
    {
      id: 1,
      '2M': '2',
      '3M': '3',
      '4M': '4',
      '5M': '5',
      '6M': '6',
      '7M': '7',
    },
  ];
  const columns = [
    {
      field: 'id',
      flex: 3,
    },
    {
      field: '2M',
      width: 200,
    },
    {
      field: '3M',
      flex: 1,
    },
    {
      field: '4M',
      flex: 1,
    },
    {
      field: '5M',
      flex: 2,
    },
    {
      field: '6M',
      flex: 1,
    },
    {
      field: '7M',
      flex: 1,
    },
  ];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={columns} />
    </div>
  );
};

export const FlexWithColumnWidth2000 = () => {
  const rows = [
    {
      id: 1,
      '2M': '2',
      '3M': '3',
    },
  ];
  const columns = [
    {
      field: 'id',
      flex: 3,
    },
    {
      field: '2M',
      width: 2000,
    },
    {
      field: '3M',
      flex: 1,
    },
  ];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={columns} />
    </div>
  );
};
