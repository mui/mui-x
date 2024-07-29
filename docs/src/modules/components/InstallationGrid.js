import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { InfoCard } from '@mui/docs/InfoCard';
import AccountTreeRounded from '@mui/icons-material/AccountTreeRounded';
import PivotTableChartRoundedIcon from '@mui/icons-material/PivotTableChartRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

const content = [
  {
    title: 'Data Grid',
    description: 'Fast, feature-rich data table.',
    link: '/x/react-data-grid/getting-started/#installation',
    icon: <PivotTableChartRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Date and Time Pickers',
    description: 'A suite of components for selecting dates, times, and ranges.',
    link: '/x/react-date-pickers/getting-started/#installation',
    icon: <CalendarMonthRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Charts',
    link: '/x/react-charts/getting-started/#installation',
    description:
      'A collection of data visualization graphs, including bar, line, pie, scatter, and more.',
    icon: <BarChartRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Tree View',
    description: 'Display hierarchical data, such as a file system navigator.',
    link: '/x/react-tree-view/getting-started/#installation',
    icon: <AccountTreeRounded fontSize="small" color="primary" />,
  },
];

export default function InstallationGrid() {
  return (
    <Grid container spacing={2}>
      {content.map(({ icon, title, description, link }) => (
        <Grid key={title} xs={12} sm={6}>
          <InfoCard
            classNameTitle="algolia-lvl3"
            link={link}
            title={title}
            description={description}
            icon={icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}
