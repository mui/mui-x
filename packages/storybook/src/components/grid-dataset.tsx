import React, { useEffect, useState } from 'react';
import { getData, GridData } from '../data/data-service';
import { ElementSize, Grid, GridOptionsProp, GridChildrenProp } from '@material-ui-x/grid';

export interface GridDatasetProps {
  nbRows: number;
  nbCols: number;
  options?: GridOptionsProp;
  container?: ElementSize;
  onData?: (data: GridData) => void;
  loading?: boolean;
  children?: GridChildrenProp;
}

export const useData = (nbRows: number, nbCols: number, onData?: (data: GridData) => void) => {
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
  }, [nbRows, nbCols]);

  return data;
};

export const GridDataSet = ({ nbRows, nbCols, options, container, onData, children, loading }: GridDatasetProps) => {
  const data = useData(nbRows, nbCols);
  const size = container || { width: 800, height: 600 };
  return (
    <div style={{ width: size.width, height: size.height }}>
      <Grid rows={data.rows} columns={data.columns} options={options} loading={loading}>
        {children}
      </Grid>
    </div>
  );
};
