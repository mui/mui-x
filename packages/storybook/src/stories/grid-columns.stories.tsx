import React from 'react';
import { GridDataSet } from '../components/grid-dataset';
import { GridData } from '../data/data-service';
import { random } from '../data/random-generator';

export default {
  title: 'Grid Columns',
};

export const SmallColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = 60));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const VerySmallColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = 30));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const RandomColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = Number(random(30, 300).toFixed())));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const HideCols = () => {
  const transformColSizes = (data: GridData) => data.columns.map((c, idx) => (c.hide = idx % 2 === 0));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};
