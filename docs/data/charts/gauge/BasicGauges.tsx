import * as React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

export default function BasicGauges() {
  return (
    <React.Fragment>
      <Gauge value={60} />
      <Gauge value={60} startAngle={-90} endAngle={90} />
    </React.Fragment>
  );
}
