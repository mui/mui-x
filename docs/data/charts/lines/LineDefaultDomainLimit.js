import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function LineDefaultDomainLimit() {
  const [strictDomainLimit, setStrictDomainLimit] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(false);
  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row">
        <FormControlLabel
          checked={strictDomainLimit}
          control={
            <Checkbox
              onChange={(event) => setStrictDomainLimit(event.target.checked)}
            />
          }
          label="Strict domain limit"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={fullWidth}
          control={
            <Checkbox onChange={(event) => setFullWidth(event.target.checked)} />
          }
          label="full width"
          labelPlacement="end"
        />
      </Stack>
      <div style={{ width: '100%', maxWidth: fullWidth ? undefined : 450 }}>
        <LineChart
          dataset={dataset}
          experimentalFeatures={{ strictDomainLimit }}
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
              showMark: false,
            },
            {
              id: 'Germany',
              label: 'German GDP per capita',
              dataKey: 'dl',
              stack: 'total',
              area: true,
              showMark: false,
            },
            {
              id: 'United Kingdom',
              label: 'UK GDP per capita',
              dataKey: 'gb',
              stack: 'total',
              area: true,
              showMark: false,
            },
          ]}
          height={300}
        />
      </div>
    </Stack>
  );
}
