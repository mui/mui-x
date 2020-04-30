import React, {useEffect, useState} from 'react';
import {Grid, GridOptions, RowData} from 'fin-ui-grid';
import './real-data-stories.css';

import {getRealData} from "./real-data-service";
import {commodityGeneratableColumns} from "./real-data-demo.columns";

export default {
  title: 'Real data demo',
};

const useData = (nbRows: number)=> {
  const [rows, setRows] = useState<RowData[]>([]);

  const loadData = async () => {
    const data = await getRealData(nbRows, commodityGeneratableColumns);
    setRows(data.rows);
  };

  useEffect(() => {
    loadData();
  }, []);

  return rows;
};

export const Commodity = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true
  };

  const rows = useData(100);

  return (
    <div style={{ padding: 10, flexGrow:1 }}>
      <Grid rows={rows} columns={commodityGeneratableColumns}  options={options} />
    </div>
  );
};
export const Commodity500 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    disableSelectionOnClick: true
  };

  const rows = useData(500);

  return (
    <div style={{ padding: 10, flexGrow:1 }}>
      <Grid rows={rows} columns={commodityGeneratableColumns}  options={options} />
    </div>
  );
};
export const Commodity1000 = () => {
  const options: Partial<GridOptions> = {
    checkboxSelection: true,
    // disableSelectionOnClick: true
  };

  const rows = useData(1000);

  return (
    <div style={{ padding: 10, flexGrow:1 }}>
      <Grid rows={rows} columns={commodityGeneratableColumns}  options={options} />
    </div>
  );
};