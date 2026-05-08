import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';
import { dataset, valueFormatter } from '../dataset/weather';

export default function BandHighlight() {
  const [scaleType, setScaleType] = React.useState('point');
  const [rotationHighlight, setRotationHighlight] = React.useState('band');
  const [radiusHighlight, setRadiusHighlight] = React.useState('none');

  const handleChange = (direction) => (event) => {
    if (direction === 'rotation') {
      setRotationHighlight(event.target.value);
    }
    if (direction === 'radius') {
      setRadiusHighlight(event.target.value);
    }
    if (direction === 'scaleType') {
      setScaleType(event.target.value);
    }
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%', m: 2 }}>
      <div style={{ flexGrow: 1 }}>
        <RadialLineChart
          dataset={
            scaleType === 'linear'
              ? dataset.map((item, index) => ({ ...item, month: index + 1 }))
              : dataset
          }
          radiusAxis={[{ minRadius: 10, min: 0 }]}
          rotationAxis={[{ dataKey: 'month', scaleType }]}
          series={[
            {
              dataKey: 'london',
              curve: 'linear',
              label: 'London',
              valueFormatter,
              showMark: true,
            },
            {
              dataKey: 'paris',
              curve: 'linear',
              label: 'Paris',
              valueFormatter,
              showMark: true,
            },
            {
              dataKey: 'newYork',
              curve: 'linear',
              label: 'New York',
              valueFormatter,
              showMark: true,
            },
          ]}
          margin={10}
          height={300}
          grid={{ rotation: true, radius: true }}
          axisHighlight={{ rotation: rotationHighlight, radius: radiusHighlight }}
        />
      </div>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={2}
        sx={{ justifyContent: { xs: 'space-around', md: 'flex-start' }, m: 2 }}
      >
        <FormControl>
          <FormLabel id="scaleType-highlight-label">scale type</FormLabel>
          <RadioGroup
            aria-labelledby="scaleType-highlight-label"
            value={scaleType}
            onChange={handleChange('scaleType')}
          >
            <FormControlLabel value="band" control={<Radio />} label="Band" />
            <FormControlLabel value="point" control={<Radio />} label="Point" />
            <FormControlLabel value="linear" control={<Radio />} label="Linear" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="rotation-highlight-label">rotation highlight</FormLabel>
          <RadioGroup
            aria-labelledby="rotation-highlight-label"
            value={rotationHighlight}
            onChange={handleChange('rotation')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
            <FormControlLabel value="band" control={<Radio />} label="Band" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="radius-highlight-label">radius highlight</FormLabel>
          <RadioGroup
            aria-labelledby="radius-highlight-label"
            value={radiusHighlight}
            onChange={handleChange('radius')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
