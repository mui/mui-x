import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
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
const seriesValueFormatter = (value) => percentageFormatter.format(value / 100);

const xAxis = [
  {
    data: inflationData.map((p) => p.year),
    valueFormatter: (value) => `${value}`,
    zoom: true,
  },
];

const yAxis = [{ valueFormatter: (value) => yAxisFormatter.format(value / 100) }];

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

function createOnBeforeExport(titleRef, captionRef) {
  return function onBeforeExport(iframe) {
    // Apply default modification (removing the toolbar)
    defaultOnBeforeExport(iframe);
    const document = iframe.contentDocument;

    const stack = document.createElement('div');
    const chart = document.body.firstElementChild;

    stack.style.display = 'flex';
    stack.style.flexDirection = 'column';
    stack.style.width = 'fit-content';
    stack.style.margin = 'auto';

    document.body.appendChild(stack);

    const title = titleRef.current;
    if (title) {
      const titleClone = title.cloneNode(true);
      stack.appendChild(titleClone);
    }

    document.body.removeChild(chart);
    stack.appendChild(chart);

    const caption = captionRef.current;
    if (caption) {
      const captionClone = caption.cloneNode(true);
      captionClone.style.alignSelf = 'start';
      stack.appendChild(captionClone);
    }
  };
}

export default function ExportChartOnBeforeExport() {
  const titleRef = React.useRef(null);
  const captionRef = React.useRef(null);
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
      />
      <Typography ref={captionRef} variant="caption">
        Source: World Bank
      </Typography>
    </Stack>
  );
}
