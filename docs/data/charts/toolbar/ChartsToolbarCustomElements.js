import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

import Button from '@mui/material/Button';
import { chartsToolbarClasses } from '@mui/x-charts/Toolbar';
import { data } from './randomData';

const params = {
  height: 300,
  series: [
    {
      label: 'Series A',
      data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    },
    {
      label: 'Series B',
      data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    },
  ],
};

const CustomIconButton = React.forwardRef(function CustomIconButton(props, ref) {
  return <Button ref={ref} {...props} variant="contained" />;
});

export default function ChartsToolbarCustomElements() {
  return (
    <ScatterChartPro
      {...params}
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      showToolbar
      slots={{ baseIconButton: CustomIconButton }}
      slotProps={{
        baseIconButton: {
          material: {
            loading: true,
          },
        },
      }}
      sx={{
        [`& .${chartsToolbarClasses.root}`]: {
          gap: 1,
          padding: 1,
          minHeight: 52,
        },
      }}
    />
  );
}
