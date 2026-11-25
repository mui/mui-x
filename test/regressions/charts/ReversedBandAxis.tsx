import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import type { HighlightItemIdentifier } from '@mui/x-charts/models';

const letters = ['A', 'B', 'C', 'D'];
const groups = Array.from({ length: 20 }, (_, index) => `G${index}`);

export default function ReversedBandAxis() {
  // The clicked bar stays highlighted, so the screenshot doesn't depend on the pointer staying put.
  const [clicked, setClicked] = React.useState<HighlightItemIdentifier<'bar'> | null>(null);

  return (
    <Stack direction="row" spacing={4} sx={{ p: 2 }}>
      <Stack>
        <BarChart
          width={300}
          height={250}
          xAxis={[{ scaleType: 'band', data: letters, reverse: true }]}
          series={[
            {
              id: 'series',
              data: [1, 2, 3, 4],
              highlightScope: { highlight: 'item', fade: 'global' },
            },
          ]}
          highlightedItem={clicked}
          onItemClick={(_, item) =>
            setClicked({ seriesId: item.seriesId, dataIndex: item.dataIndex })
          }
          slotProps={{ tooltip: { trigger: 'none' } }}
          hideLegend
        />
        <Typography>
          Clicked: {clicked?.dataIndex === undefined ? 'none' : letters[clicked.dataIndex]}
        </Typography>
      </Stack>
      <BarChartPro
        width={300}
        height={250}
        layout="horizontal"
        yAxis={[
          {
            id: 'y',
            scaleType: 'band',
            data: groups,
            reverse: true,
            zoom: { minSpan: 5, slider: { enabled: true, showTooltip: 'always' } },
          },
        ]}
        series={[{ data: groups.map((_, index) => index + 1) }]}
        initialZoom={[{ axisId: 'y', start: 10, end: 35 }]}
        hideLegend
      />
    </Stack>
  );
}
