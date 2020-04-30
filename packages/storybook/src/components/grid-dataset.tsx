import React, { useEffect, useState } from 'react';
import { getData, GridData } from '../data/data-service';
import { ElementSize, Grid, GridOptionsProp } from 'fin-ui-grid';

export interface GridDatasetProps {
  nbRows: number;
  nbCols: number;
  options?: GridOptionsProp;
  container?: ElementSize;
  onData?: (data: GridData) => void;
}

export const GridDataSet = ({ nbRows, nbCols, options, container, onData }: GridDatasetProps) => {
  const [data, setData] = useState<GridData>({ rows: [], columns: [] });

  const loadData = async () => {
    const data = await getData(nbRows, nbCols);
    if (onData != null) {
      onData(data);
    }
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const size = container || { width: 800, height: 600 };
  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={data.rows} columns={data.columns} options={options} />
    </div>
  );
};
