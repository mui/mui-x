import React, { useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Grid, GridApi, GridOptionsProp } from '@material-ui-x/grid';
import { getData, GridData } from '../data/data-service';
import { useData } from '../components/grid-dataset';

export default {
  title: 'Grid Selection',
};

export const PreSelectedRows = () => {
  const apiRef = useRef<GridApi>();
  const [data, setData] = useState<GridData>({ rows: [], columns: [] });

  useEffect(() => {
    if (apiRef && apiRef.current != null && data.rows.length > 0) {
      apiRef.current.selectRows([1, 3, 5]);
      apiRef.current.selectRow(8, true, true);
    }
  }, [data]);

  const loadData = async () => {
    const data = await getData(50, 5);
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return <Grid rows={data.rows} columns={data.columns} apiRef={apiRef} />;
};

export const WithSelectedEvents = () => {
  const data = useData(200, 200);

  const options: GridOptionsProp = {
    onSelectionChanged: params => action('onSelectionChanged')(params),
    onRowSelected: params => action('onRowSelected')(params),
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

export const SingleSelect = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    enableMultipleSelection: false,
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

export const MultipleSelect = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    enableMultipleSelection: true,
  };

  return (
    <>
      <p>Maintain CTRL or Command to select multiple rows</p>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </>
  );
};
export const MultipleSelectWithCheckbox = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    checkboxSelection: true,
    disableSelectionOnClick: true,
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};
