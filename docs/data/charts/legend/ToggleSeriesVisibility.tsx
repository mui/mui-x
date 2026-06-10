import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const series = [
  { dataKey: 'london', label: 'London', valueFormatter },
  { dataKey: 'paris', label: 'Paris', valueFormatter },
  { dataKey: 'newYork', label: 'New York', valueFormatter },
];

export default function ToggleSeriesVisibility() {
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
        label="x-axis domain considers only visible series"
        labelPlacement="end"
      />
      <BarChart
        dataset={dataset}
        yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        xAxis={[{ label: 'rainfall (mm)', domainSeries }]}
        series={series}
        layout="horizontal"
        height={300}
        slotProps={{ legend: { toggleVisibilityOnClick: true } }}
      />
    </div>
  );
}
