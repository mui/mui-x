// @ts-nocheck
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { ChartsOnAxisClickHandler, BarPlot } from '@mui/x-charts-pro';
import { ResponsiveChartContainerPro } from '@mui/x-charts-pro/ResponsiveChartContainerPro';
import { ChartContainerPro } from '@mui/x-charts-ChartContainerPro';

// prettier-ignore
<div>
  <ChartContainerPro>
    {/* ... */}
    <ChartsOnAxisClickHandler
      onAxisClick={(event, data) => {
        console.log(data);
      }}
    />
    <BarPlot onItemClick={onItemClick} />
  </ChartContainerPro>
  <ResponsiveChartContainerPro>
    {/* ... */}
    <ChartsOnAxisClickHandler onAxisClick={onAxisClick} />
    <BarPlot onItemClick={onItemClick} />
  </ResponsiveChartContainerPro>
</div>;
