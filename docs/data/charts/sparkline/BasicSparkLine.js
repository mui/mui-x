import * as React from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLine() {
  return <SparkLineChart data={[1, 2, 3, 5, 7, 2, 4, 6]} />;
}
