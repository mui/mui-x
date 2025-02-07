/* eslint-disable no-restricted-imports, @typescript-eslint/no-shadow */
import * as React from 'react';
import { SparkLineChart } from '@mui/x-charts';

const data = [1, 2];

function Chart() {
  const fn = (mode) => (mode === 'light' ? ['black'] : ['white']);

  // prettier-ignore
  return (
    <React.Fragment>
      <SparkLineChart data={data} colors={['red']} />
      <SparkLineChart data={data} colors={fn} />
      <SparkLineChart data={data} colors={(mode) => (mode === 'light' ? ['black'] : ['white'])} />
    </React.Fragment>
  );
}
