import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartsBaseIconButtonProps } from '@mui/x-charts/models';
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

const IconButton = React.forwardRef<HTMLButtonElement, ChartsBaseIconButtonProps>(
  function IconButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

export default function ChartsToolbarCustomElements() {
  return (
    <ScatterChartPro
      {...params}
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      showToolbar
      slots={{
        baseIconButton: IconButton,
      }}
    />
  );
}
