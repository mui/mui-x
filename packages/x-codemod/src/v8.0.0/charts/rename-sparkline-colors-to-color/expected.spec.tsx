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
      <SparkLineChart
        data={data}
        /* mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. */
        color={(mode) => (mode === 'light' ? ['black'] : ['white'])} />
      <SparkLineChart
        data={data}
        /* mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. */
        colors="red" />
    </React.Fragment>)
  );
}
