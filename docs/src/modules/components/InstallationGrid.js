import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import InfoCard from 'docs/src/components/action/InfoCard';
import TableChartRounded from '@mui/icons-material/TableChartRounded';
import DateRangeRounded from '@mui/icons-material/DateRangeRounded';
import AccountTreeRounded from '@mui/icons-material/AccountTreeRounded';
import ShowChartRounded from '@mui/icons-material/ShowChartRounded';

const content = [
  {
    title: 'Data Grid',
    link: '/x/react-data-grid/getting-started/#installation',
    icon: <TableChartRounded fontSize="small" color="primary" />,
  },
  {
    title: 'Date and Time Pickers',
    link: '/x/react-date-pickers/getting-started/#installation',
    icon: <DateRangeRounded fontSize="small" color="primary" />,
  },
  {
    title: 'Charts',
    link: '/x/react-charts/#getting-started',
    icon: <ShowChartRounded fontSize="small" color="primary" />,
  },
  {
    title: 'Tree View',
    link: '/x/react-tree-view/getting-started/#installation',
    icon: <AccountTreeRounded fontSize="small" color="primary" />,
  },
];

export default function InstallationGrid() {
  return (
    <Grid container spacing={2}>
      {content.map(({ icon, title, link }) => (
        <Grid key={title} xs={12} sm={6}>
          <InfoCard classNameTitle="algolia-lvl3" link={link} title={title} icon={icon} />
        </Grid>
      ))}
    </Grid>
  );
}
