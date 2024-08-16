import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { InfoCard } from '@mui/docs/InfoCard';
import LineAxisRoundedIcon from '@mui/icons-material/LineAxisRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import LegendToggleRoundedIcon from '@mui/icons-material/LegendToggleRounded';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';

const content = [
  {
    title: 'Axis',
    link: '/x/react-charts/axis/',
    icon: <LineAxisRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Custom components',
    link: '/x/react-charts/components/',
    icon: <DashboardCustomizeRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Legend',
    link: '/x/react-charts/legend/',
    icon: <LegendToggleRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Stacking',
    link: '/x/react-charts/stacking/',
    icon: <StackedBarChartRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Styling',
    link: '/x/react-charts/styling/',
    icon: <StyleRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Tooltips and highlights',
    link: '/x/react-charts/tooltip/',
    icon: <TipsAndUpdatesRoundedIcon fontSize="small" color="primary" />,
  },
];

export default function ChartFeaturesGrid() {
  return (
    <Grid container spacing={2}>
      {content.map(({ icon, title, link }) => (
        <Grid key={title} xs={12} sm={4}>
          <InfoCard dense classNameTitle="algolia-lvl3" link={link} title={title} icon={icon} />
        </Grid>
      ))}
    </Grid>
  );
}
