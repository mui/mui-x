import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ItemTooltip } from './ItemTooltip';
import { ItemTooltipFixedY } from './ItemTooltipFixedY';
import { ItemTooltipTopElement } from './ItemTooltipTopElement';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomTooltipPosition() {
  const [tooltipType, setTootltipType] = React.useState<
    'mouse' | 'fixedY' | 'itemTop'
  >('itemTop');

  const id = React.useId();
  const clipPathId = `${id}-clip-path`;
  return (
    <div style={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="tooltip-placement-radio-buttons-group-label">
          tooltip placement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="tooltip-placement-radio-buttons-group-label"
          name="tooltip-placement"
          value={tooltipType}
          onChange={(event) =>
            setTootltipType(event.target.value as 'mouse' | 'fixedY' | 'itemTop')
          }
        >
          <FormControlLabel value="mouse" control={<Radio />} label="mouse" />
          <FormControlLabel
            value="fixedY"
            control={<Radio />}
            label="top of chart"
          />
          <FormControlLabel value="itemTop" control={<Radio />} label="top of bar" />
        </RadioGroup>
      </FormControl>
      <ChartContainer
        height={300}
        dataset={dataset}
        series={[
          { type: 'bar', dataKey: 'seoul', label: 'Seoul', valueFormatter },
          { type: 'bar', dataKey: 'paris', label: 'Paris', valueFormatter },
        ]}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      >
        <g clipPath={`url(#${clipPathId})`}>
          <BarPlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />

        {tooltipType === 'mouse' && <ItemTooltip />}
        {tooltipType === 'fixedY' && <ItemTooltipFixedY />}
        {tooltipType === 'itemTop' && <ItemTooltipTopElement />}
        <ChartsClipPath id={clipPathId} />
      </ChartContainer>
    </div>
  );
}
