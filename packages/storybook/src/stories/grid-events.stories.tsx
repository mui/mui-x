import React from 'react';
import { action } from '@storybook/addon-actions';
import { GridOptionsProp } from '@material-ui-x/grid';
import { GridDataSet } from '../components/grid-dataset';

export default {
  title: 'Grid Events',
};

export const onRowClicked = () => {
  const options: GridOptionsProp = {
    onRowClicked: params => action('row clicked')(params),
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

export const onCellClicked = () => {
  const options: GridOptionsProp = {
    onCellClicked: params => action('cell clicked')(params),
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

export const onColumnHeaderClicked = () => {
  const options: GridOptionsProp = {
    onColumnHeaderClicked: params => action('Header clicked')(params),
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};
