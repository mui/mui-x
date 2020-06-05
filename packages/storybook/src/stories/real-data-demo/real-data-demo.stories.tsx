import React from 'react';
import { Grid, GridOptions, GridOptionsProp } from '@material-ui-x/grid';
import { useDemoData } from '@material-ui-x/grid-data-generator';
import '@material-ui-x/grid-data-generator/dist/demo-style.css';
import { Button } from '@material-ui/core';
import { randomInt } from '../../data/random-generator';

export default {
  title: 'Real data demo',
};

export const Commodity = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
  };

  const { data, setSize, loadNewData } = useDemoData('Commodity', 100);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color={'primary'} onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color={'primary'} onClick={() => setSize(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div style={{ padding: 10, flexGrow: 1 }}>
        <Grid rows={data.rows} columns={data.columns} options={options} />
      </div>
    </>
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

export const Commodity1000WithAutoPagination = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    pagination: true,
    paginationAutoPageSize: true,
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
export const Commodity10000WithPagination = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    paginationPageSize: 100,
    pagination: true,
    paginationRowsPerPageOptions: [100, 200, 1000],
  };

  const { data } = useDemoData('Commodity', 10000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
export const Commodity10000NoCheckbox = () => {
  const { data } = useDemoData('Commodity', 10000);
  const options: GridOptionsProp = {
    checkboxSelection: false,
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
