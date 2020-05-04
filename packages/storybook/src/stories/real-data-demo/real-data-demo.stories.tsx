import React from 'react';
import {Grid, GridOptions, GridOptionsProp} from '@material-ui-x/grid';
import { useDemoData } from '@material-ui-x/grid-data-generator';
import '@material-ui-x/grid-data-generator/dist/demo-style.css';
import {action} from "@storybook/addon-actions";

export default {
  title: 'Real data demo',
};

export const Commodity = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
  };

  const { data } = useDemoData('Commodity', 100);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity500 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
  };

  const { data } = useDemoData('Commodity', 500);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity1000 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
  };

  const { data } = useDemoData('Commodity', 1000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity10000 = () => {
  const { data } = useDemoData('Commodity', 10000);
  const options: GridOptionsProp = {
    checkboxSelection: true,
  };

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Employee100 = () => {
  const { data } = useDemoData('Employee', 100);
  const options: GridOptionsProp = {
    checkboxSelection: true,
  };

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
