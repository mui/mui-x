import React from 'react';
import { action } from '@storybook/addon-actions';
import { Grid, GridOptionsProp } from '@material-ui-x/grid';
import { useData } from '../components/grid-dataset';

export default {
  title: 'Grid Events',
};

export const onRowClicked = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClicked: params => action('row clicked')(params),
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

export const onCellClicked = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellClicked: params => action('cell clicked')(params),
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

export const onColumnHeaderClicked = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onColumnHeaderClicked: params => action('Header clicked')(params),
  };
  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};
