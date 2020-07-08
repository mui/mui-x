import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { XGrid, GridOptionsProp } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Events',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const AllEvents = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClicked: params => action('onRowClicked')(params),
    onCellClicked: params => action('onCellClicked')(params),
    onColumnHeaderClicked: params => action('onColumnHeaderClicked')(params),
    onRowSelected: params => action('onRowSelected')(params),
    onSelectionChanged: params => action('onSelectionChanged', { depth: 1 })(params),
    onColumnsSorted: params => action('onColumnsSorted')(params),
    onPageChanged: params => action('onPageChanged')(params),
    onPageSizeChanged: params => action('onPageSizeChanged')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

export const onRowClicked = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClicked: params => action('row clicked')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

export const onCellClicked = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellClicked: params => action('cell clicked')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

export const onColumnHeaderClicked = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onColumnHeaderClicked: params => action('Header clicked')(params),
  };
  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};
