import * as React from 'react';

import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { countryData } from '../charts/dataset/countryData';
import { shareOfRenewables } from '../charts/dataset/shareOfRenewables';

const percentageFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});

const sortedShareOfRenewables = shareOfRenewables.toSorted(
  (a, b) => a.renewablesPercentage - b.renewablesPercentage,
);
const barXAxis = {
  id: 'x',
  data: sortedShareOfRenewables.map((d) => countryData[d.code].country),
  tickLabelStyle: { angle: -45 },
  height: 90,
};
const barSettings = {
  series: [
    {
      data: sortedShareOfRenewables.map((d) => d.renewablesPercentage / 100),
      valueFormatter: (v) => percentageFormatter.format(v),
    },
  ],
  height: 400,
};

export default function ZoomSliderPreview() {
  return (
    <BarChartPro
      {...barSettings}
      xAxis={[{ ...barXAxis, zoom: { slider: { enabled: true, preview: true } } }]}
      zoomData={[{ axisId: 'x', start: 10, end: 30 }]}
    />
  );
}
