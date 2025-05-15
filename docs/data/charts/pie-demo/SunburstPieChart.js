import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const data = [
  {
    label: 'Search',
    children: [
      { label: 'Organic', value: 5000 },
      { label: 'Paid', value: 3000 },
    ],
  },
  {
    label: 'Social',
    children: [
      { label: 'Facebook', value: 1200 },
      { label: 'Twitter', value: 800 },
    ],
  },
  {
    label: 'Referral',
    children: [
      { label: 'Product Blog', value: 400 },
      { label: 'Tech Blog', value: 600 },
    ],
  },
  {
    label: 'Direct',
    children: [{ label: 'Direct', value: 2000 }],
  },
];

export default function SunburstPieChart() {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);

  const innerData = data.map((item, index) => ({
    label: item.label,
    value: item.children.reduce((a, b) => a + b.value, 0),
    color: palette[index],
  }));
  const outerData = data.flatMap((category, index) =>
    category.children.map((item) => ({
      label: item.label,
      value: item.value,
      color: palette[index],
    })),
  );

  return (
    <Stack width="100%" alignItems="center">
      <Typography variant="h6">Website Traffic Sources</Typography>
      <Typography variant="caption">
        Categorization of traffic sources for this website
      </Typography>
      <PieChart
        series={[
          {
            innerRadius: 0,
            outerRadius: 80,
            data: innerData,
            arcLabel: 'label',
            arcLabelMinAngle: 20,
            arcLabelRadius: 50,
          },
          {
            innerRadius: 80,
            outerRadius: 140,
            data: outerData,
            arcLabel: 'label',
            arcLabelMinAngle: 15,
          },
        ]}
        height={300}
        hideLegend
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontSize: 12,
          },
        }}
      />
    </Stack>
  );
}
