import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset, valueFormatter } from '../dataset/weather';

const series = [
  { dataKey: 'newYork', label: 'New York', valueFormatter, stack: 'a' },
  { dataKey: 'london', label: 'London', valueFormatter, stack: 'a' },
  { dataKey: 'paris', label: 'Paris', valueFormatter, stack: 'a' },
];

export default function StackLineVisibility() {
  const [domainSeries, setDomainSeries] = React.useState<'all' | 'visible'>('all');

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={domainSeries === 'visible'}
            onChange={(event) =>
              setDomainSeries(event.target.checked ? 'visible' : 'all')
            }
          />
        }
        label="y-axis domain considers only visible series"
        labelPlacement="end"
      />
      <LineChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        yAxis={[{ label: 'rainfall (mm)', domainSeries }]}
        series={series}
        height={300}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
      />
    </div>
  );
}
