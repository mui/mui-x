import React from 'react';
import { Grid, GridOptions } from '@material-ui-x/grid';
import { useDemoData } from '@material-ui-x/grid-data-generator';
import '@material-ui-x/grid-data-generator/dist/index-esm.css';

export default {
  title: 'Real data demo',
};

export const Commodity = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
  };

  const data = useDemoData(100);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity500 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    // disableSelectionOnClick: true,
  };

  const data = useDemoData(500);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity1000 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    disableSelectionOnClick: true
  };

  const data = useDemoData(1000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
