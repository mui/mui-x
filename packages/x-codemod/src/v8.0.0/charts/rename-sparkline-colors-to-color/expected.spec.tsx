/* eslint-disable no-restricted-imports, @typescript-eslint/no-shadow */
import * as React from 'react';
import { SparkLineChart } from '@mui/x-charts';

const data = [1, 2];

function Chart() {
  const fn = (mode) => (mode === 'light' ? ['black'] : ['white']);

  // prettier-ignore
  return (
    (<React.Fragment>
      <SparkLineChart data={data} color={['red']?.[0]} />
      <SparkLineChart data={data} color={typeof fn === "function" ? mode => fn(mode)?.[0] : fn} />
      <SparkLineChart data={data} color={mode => (mode => (mode === 'light' ? ['black'] : ['white']))(mode)?.[0]} />
    </React.Fragment>)
  );
}
