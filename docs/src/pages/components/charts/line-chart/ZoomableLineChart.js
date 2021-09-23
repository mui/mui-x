import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const lineData1 = [
  { x: new Date(2015, 0, 1), y: 4 },
  { x: new Date(2016, 0, 1), y: 14 },
  { x: new Date(2017, 0, 1), y: 36 },
  { x: new Date(2018, 0, 1), y: 38 },
  { x: new Date(2019, 0, 1), y: 54 },
  { x: new Date(2020, 0, 1), y: 47 },
  { x: new Date(2021, 0, 1), y: 70 },
];

export default function ZoomableLineChart() {
  const [domain, setDomain] = React.useState([
    lineData1[0].x.getTime(),
    lineData1[lineData1.length - 1].x.getTime(),
  ]);

  const handleDomainChange = (event, newValue) => {
    setDomain(newValue);
  };

  const domainDate = React.useMemo(() => {
    return [new Date(domain[0]), new Date(domain[1])];
  }, [domain]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Box>
        <LineChart data={lineData1} xScaleType="time" xDomain={domainDate}>
          <Grid />
          <XAxis />
          <YAxis suffix="kg" />
          <Line stroke="rgb(235,97,97)" markerShape="none" />
        </LineChart>
      </Box>
      <Box sx={{ width: '300px', m: '0 auto' }}>
        <Slider
          valueLabelDisplay="off"
          value={domain}
          onChange={handleDomainChange}
          min={lineData1[0].x.getTime()}
          max={lineData1[lineData1.length - 1].x.getTime()}
          size="small"
        />
      </Box>
    </Stack>
  );
}
