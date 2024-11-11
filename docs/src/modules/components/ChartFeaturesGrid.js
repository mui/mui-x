import * as React from 'react';
import Grid from '@mui/material/Grid';
import { InfoCard } from '@mui/docs/InfoCard';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubble';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import ExtensionRoundedIcon from '@mui/icons-material/Extension';
import HighlightRoundedIcon from '@mui/icons-material/Highlight';
import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportant';
import LegendToggleRoundedIcon from '@mui/icons-material/LegendToggleRounded';
import LineAxisRoundedIcon from '@mui/icons-material/LineAxisRounded';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomIn';

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
    title: 'Composition',
    link: '/x/react-charts/composition/',
    icon: <ExtensionRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Label',
    link: '/x/react-charts/label/',
    icon: <LabelImportantRoundedIcon fontSize="small" color="primary" />,
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
    title: 'Tooltips',
    link: '/x/react-charts/tooltip/',
    icon: <ChatBubbleRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Highlighting',
    link: '/x/react-charts/highlighting/',
    icon: <HighlightRoundedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Zoom and pan',
    link: '/x/react-charts/zoom-and-pan/',
    icon: <ZoomInRoundedIcon fontSize="small" color="primary" />,
  },
];

export default function ChartFeaturesGrid() {
  return (
    <Grid container spacing={2}>
      {content.map(({ icon, title, link }) => (
        <Grid item key={title} xs={12} sm={6} lg={3}>
          <InfoCard dense classNameTitle="algolia-lvl3" link={link} title={title} icon={icon} />
        </Grid>
      ))}
    </Grid>
  );
}
