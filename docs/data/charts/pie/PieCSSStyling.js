import { pieArcClasses, PieChart, pieClasses } from '@mui/x-charts/PieChart';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import { useTheme } from '@mui/material/styles';

export default function PieCSSStyling() {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);
  const data1 = [
    { label: 'Group A', value: 400 },
    { label: 'Group B', value: 300 },
    { label: 'Group C', value: 300 },
    { label: 'Group D', value: 200 },
  ];

  const data2 = [
    { label: 'A1', value: 100, color: palette[0] },
    { label: 'A2', value: 300, color: palette[0] },
    { label: 'B1', value: 100, color: palette[1] },
    { label: 'B2', value: 80, color: palette[1] },
    { label: 'B3', value: 40, color: palette[1] },
    { label: 'B4', value: 30, color: palette[1] },
    { label: 'B5', value: 50, color: palette[1] },
    { label: 'C1', value: 100, color: palette[2] },
    { label: 'C2', value: 200, color: palette[2] },
    { label: 'D1', value: 150, color: palette[3] },
    { label: 'D2', value: 50, color: palette[3] },
  ];

  const settings = {
    series: [
      {
        innerRadius: 0,
        outerRadius: 80,
        data: data1,
        highlightScope: { fade: 'global', highlight: 'item' },
      },
      {
        id: 'outer',
        innerRadius: 100,
        outerRadius: 120,
        data: data2,
        highlightScope: { fade: 'global', highlight: 'item' },
      },
    ],
    height: 300,
    hideLegend: true,
  };

  return (
    <PieChart
      {...settings}
      sx={{
        [`.${pieClasses.series}[data-series="outer"] .${pieArcClasses.root}`]: {
          opacity: 0.6,
        },
      }}
    />
  );
}
