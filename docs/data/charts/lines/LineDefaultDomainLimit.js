import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function LineDefaultDomainLimit() {
  const [preferStrictDomainInLineCharts, setPreferStrictDomainInLineCharts] =
    React.useState(false);

  return (
    <Stack alignItems="center">
      <FormControlLabel
        checked={preferStrictDomainInLineCharts}
        control={
          <Checkbox
            onChange={(event) =>
              setPreferStrictDomainInLineCharts(event.target.checked)
            }
          />
        }
        label="Strict domain limit"
        labelPlacement="end"
      />
      <div style={{ width: '100%', maxWidth: 450 }}>
        <LineChart
          dataset={dataset.slice(2, dataset.length)}
          experimentalFeatures={{ preferStrictDomainInLineCharts }}
          xAxis={[
            {
              id: 'Years',
              dataKey: 'date',
              scaleType: 'time',
              valueFormatter: (date) => date.getFullYear().toString(),
            },
          ]}
          yAxis={[{ width: 70 }]}
          series={[
            {
              id: 'France',
              label: 'French GDP per capita',
              dataKey: 'fr',
              stack: 'total',
              area: true,
            },
            {
              id: 'Germany',
              label: 'German GDP per capita',
              dataKey: 'dl',
              stack: 'total',
              area: true,
            },
            {
              id: 'United Kingdom',
              label: 'UK GDP per capita',
              dataKey: 'gb',
              stack: 'total',
              area: true,
            },
          ]}
          height={300}
        />
      </div>
    </Stack>
  );
}
