import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { defaultOnBeforeExport } from '@mui/x-charts-pro/models';
import { inflationData } from '../dataset/inflationRates';

const yAxisFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  maximumSignificantDigits: 1,
});
const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const seriesValueFormatter = (value: number | null) =>
  percentageFormatter.format(value! / 100);

const xAxis = [
  {
    data: inflationData.map((p) => p.year),
    valueFormatter: (value: number) => `${value}`,
    zoom: true,
  },
];

const yAxis = [
  { valueFormatter: (value: number) => yAxisFormatter.format(value / 100) },
];

const series = [
  {
    label: 'Germany',
    data: inflationData.map((p) => p.rateDE),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'United Kingdom',
    data: inflationData.map((p) => p.rateUK),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'France',
    data: inflationData.map((p) => p.rateFR),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
];

const settings = {
  height: 300,
  xAxis,
  yAxis,
  series,
  grid: { horizontal: true },
};

function createOnBeforeExport(
  titleRef: React.RefObject<HTMLSpanElement | null>,
  captionRef: React.RefObject<HTMLSpanElement | null>,
) {
  return function onBeforeExport(iframe: HTMLIFrameElement) {
    // Apply default modification (removing the toolbar)
    defaultOnBeforeExport(iframe);
    const document = iframe.contentDocument!;

    // Show legend
    const legend = document.querySelector(
      `.${legendClasses.root}`,
    ) as HTMLElement | null;

    if (legend) {
      legend.style.display = 'flex';
    }

    const stack = document.createElement('div');
    const chart = document.body.firstElementChild!;

    stack.style.margin = 'auto';
    stack.style.display = 'flex';
    stack.style.flexDirection = 'column';
    stack.style.alignItems = 'center';

    document.body.appendChild(stack);

    const title = titleRef.current;
    if (title) {
      const titleClone = title.cloneNode(true) as HTMLSpanElement;
      stack.appendChild(titleClone);
    }

    document.body.removeChild(chart);
    stack.appendChild(chart);

    const caption = captionRef.current;
    if (caption) {
      const captionClone = caption.cloneNode(true) as HTMLSpanElement;
      captionClone.style.alignSelf = 'start';
      stack.appendChild(captionClone);
    }
  };
}

export default function ExportChartOnBeforeExport() {
  const titleRef = React.useRef<HTMLSpanElement>(null);
  const captionRef = React.useRef<HTMLSpanElement>(null);
  const onBeforeExport = React.useMemo(
    () => createOnBeforeExport(titleRef, captionRef),
    [],
  );

  return (
    <Stack width="100%">
      <Typography ref={titleRef} sx={{ alignSelf: 'center', my: 1 }}>
        Inflation rate in France, Germany and the UK, 1960-2024
      </Typography>
      <LineChartPro
        {...settings}
        showToolbar
        slotProps={{
          toolbar: {
            printOptions: { onBeforeExport },
            imageExportOptions: [{ type: 'image/png', onBeforeExport }],
          },
        }}
        sx={{ [`& .${legendClasses.root}`]: { display: 'none' } }}
      />
      <Typography ref={captionRef} variant="caption">
        Source: World Bank
      </Typography>
    </Stack>
  );
}
