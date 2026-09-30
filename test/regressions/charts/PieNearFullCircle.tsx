import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

// https://github.com/mui/mui-x/issues/14167
// A slice vastly larger than the others spans almost, but not exactly, the full circle.
// Its start and end points used to round to the same path coordinates, making the arc,
// and so virtually the whole pie, invisible.
const dataSets = [
  // Examples where the pie chart used to be hidden
  [
    { id: 0, value: 1, label: 'A' },
    { id: 1, value: 999_999, label: 'B' },
  ],
  [
    { id: 0, value: 1, label: 'A' },
    { id: 1, value: 2_000_000, label: 'B' },
  ],
  // Examples where the pie chart was already visible
  [
    { id: 0, value: 2, label: 'A' },
    { id: 1, value: 999_999, label: 'B' },
  ],
  [
    { id: 0, value: 1, label: 'A' },
    { id: 1, value: 9_999_999, label: 'B' },
  ],
];

export default function PieNearFullCircle(): React.JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      {dataSets.map((data, idx) => (
        <div key={idx} style={{ border: '1px solid red' }}>
          <label>{`Pie Chart: ${idx}`}</label>
          <PieChart width={260} height={260} hideLegend skipAnimation series={[{ data }]} />
        </div>
      ))}
    </div>
  );
}
