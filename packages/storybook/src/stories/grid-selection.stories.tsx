import React, { useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import {Grid, GridApi , GridOptionsProp} from '@material-ui-x/grid';
import { getData, GridData } from '../data/data-service';
import { GridDataSet } from '../components/grid-dataset';

export default {
  title: 'Grid Selection',
};

export const PreSelectedRows = () => {
  const apiRef = useRef<GridApi>();
  const [data, setData] = useState<GridData>({ rows: [], columns: [] });

  useEffect(() => {
    if (apiRef && apiRef.current != null && data.rows.length > 0) {
      apiRef.current.selectRows([1, 3, 5]);
      apiRef.current.selectRow(8, true);
    }
  }, [data]);

  const loadData = async () => {
    const data = await getData(50, 5);
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ width: 800, height: 600 }}>
      <Grid rows={data.rows} columns={data.columns} apiRef={apiRef} />
    </div>
  );
};

export const WithSelectedEvents = () => {
  const options: GridOptionsProp = {
    onSelectionChanged: params => action('onSelectionChanged')(params),
    onRowSelected: params => action('onRowSelected')(params),
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

export const SingleSelect = () => {
  const options: GridOptionsProp = {
    enableMultipleSelection: false,
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

export const MultipleSelect = () => {
  const options: GridOptionsProp = {
    enableMultipleSelection: true,
  };

  return (
    <>
      <p>Maintain CTRL or Command to select multiple rows</p>
      <GridDataSet nbRows={200} nbCols={200} options={options} />
    </>
  );
};
export const MultipleSelectWithCheckbox = () => {
  const options: GridOptionsProp = {
    checkboxSelection: true,
    disableSelectionOnClick: true,
  };

  return (
    <>
      <GridDataSet nbRows={200} nbCols={200} options={options} />
    </>
  );
};
