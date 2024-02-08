import * as React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

export default function GaugeValueRangeNoSnap() {
  return (
    <React.Fragment>
      <Gauge value={50} />
      <Gauge value={50} valueMin={10} valueMax={60} />
    </React.Fragment>
  );
}
