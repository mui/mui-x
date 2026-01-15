import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { BarItemIdentifier, PieItemIdentifier } from '@mui/x-charts/models';

const CodeBlock = styled('pre')({
  minHeight: 125,
});
export default function SyncTooltip() {
  const [pieTooltipItem, setPieTooltipItem] =
    React.useState<PieItemIdentifier | null>(null);
  const [barTooltipItem, setBarTooltipItem] =
    React.useState<BarItemIdentifier | null>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Stack direction="column" spacing={1}>
        <BarChart
          {...barChartsProps}
          slotProps={{ tooltip: { trigger: 'item' } }}
          tooltipItem={barTooltipItem}
          onTooltipItemChange={(newItem) => {
            setBarTooltipItem(newItem);
            setPieTooltipItem(
              newItem === null
                ? null
                : ({
                    ...newItem,
                    type: 'pie',
                  } as PieItemIdentifier | null),
            );
          }}
        />
        <CodeBlock>
          Tooltip Item: {JSON.stringify(barTooltipItem, null, 2)}
        </CodeBlock>
      </Stack>
      <Stack direction="column" spacing={1}>
        <PieChart
          {...pieChartProps}
          tooltipItem={pieTooltipItem}
          onTooltipItemChange={(newItem) => {
            setPieTooltipItem(newItem);
            setBarTooltipItem(
              newItem === null
                ? null
                : ({
                    ...newItem,
                    type: 'bar',
                  } as BarItemIdentifier | null),
            );
          }}
        />
        <CodeBlock>
          Tooltip Item: {JSON.stringify(pieTooltipItem, null, 2)}
        </CodeBlock>
      </Stack>
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      id: 'sync',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  xAxis: [{ data: ['A', 'B', 'C', 'D', 'E'] }],
  height: 200,
  hideLegend: true,
};

const pieChartProps: PieChartProps = {
  series: [
    {
      id: 'sync',
      data: [
        { value: 3, label: 'A', id: 'A' },
        { value: 4, label: 'B', id: 'B' },
        { value: 1, label: 'C', id: 'C' },
        { value: 6, label: 'D', id: 'D' },
        { value: 5, label: 'E', id: 'E' },
      ],
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  height: 150,
  hideLegend: true,
};
