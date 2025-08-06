import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Link } from '@mui/docs/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';

function getComponents() {
  return [
    {
      title: 'Bar Chart',
      srcLight: '/static/x/component-illustrations/bar-light.png',
      srcDark: '/static/x/component-illustrations/bar-dark.png',
      href: '/x/react-charts/bars/',
    },
    {
      title: 'Line Chart',
      srcLight: '/static/x/component-illustrations/lines-light.png',
      srcDark: '/static/x/component-illustrations/lines-dark.png',
      href: '/x/react-charts/lines/',
    },
    {
      title: 'Pie Chart',
      srcLight: '/static/x/component-illustrations/pie-light.png',
      srcDark: '/static/x/component-illustrations/pie-dark.png',
      href: '/x/react-charts/pie/',
    },
    {
      title: 'Scatter Chart',
      srcLight: '/static/x/component-illustrations/scatter-light.png',
      srcDark: '/static/x/component-illustrations/scatter-dark.png',
      href: '/x/react-charts/scatter/',
    },
    {
      title: 'Sparkline',
      srcLight: '/static/x/component-illustrations/sparkline-light.png',
      srcDark: '/static/x/component-illustrations/sparkline-dark.png',
      href: '/x/react-charts/sparkline/',
    },
    {
      title: 'Gauge',
      srcLight: '/static/x/component-illustrations/gauge-light.png',
      srcDark: '/static/x/component-illustrations/gauge-dark.png',
      href: '/x/react-charts/gauge/',
    },
    {
      title: 'Radar Chart',
      srcLight: '/static/x/component-illustrations/radar-light.png',
      srcDark: '/static/x/component-illustrations/radar-dark.png',
      href: '/x/react-charts/radar/',
    },
    {
      title: 'Heatmap',
      srcLight: '/static/x/component-illustrations/heatmap-light.png',
      srcDark: '/static/x/component-illustrations/heatmap-dark.png',
      href: '/x/react-charts/heatmap/',
      pro: true,
    },
    {
      title: 'Funnel Chart',
      srcLight: '/static/x/component-illustrations/funnel-light.png',
      srcDark: '/static/x/component-illustrations/funnel-dark.png',
      href: '/x/react-charts/funnel/',
      pro: true,
    },
    {
      title: 'Sankey Chart',
      srcLight: '/static/x/component-illustrations/sankey-light.png',
      srcDark: '/static/x/component-illustrations/sankey-dark.png',
      href: '/x/react-charts/sankey/',
      planned: true,
      pro: true,
    },
    {
      title: 'Treemap',
      srcLight: '/static/x/component-illustrations/treemap-light.png',
      srcDark: '/static/x/component-illustrations/treemap-dark.png',
      href: '/x/react-charts/treemap/',
      planned: true,
      pro: true,
    },
    {
      title: 'Gantt Chart',
      srcLight: '/static/x/component-illustrations/gantt-light.png',
      srcDark: '/static/x/component-illustrations/gantt-dark.png',
      href: '/x/react-charts/gantt/',
      planned: true,
      pro: true,
    },
    {
      title: 'Linear Gauge',
      href: 'https://github.com/mui/mui-x/issues/13084',
      planned: true,
    },
    {
      title: 'Bubble Chart',
      href: 'https://github.com/mui/mui-x/issues/17275',
      planned: true,
    },
    {
      title: 'Maps',
      href: 'https://github.com/mui/mui-x/issues/12690',
      pro: true,
      planned: true,
    },
    {
      title: 'Polar Line Chart',
      href: 'https://github.com/mui/mui-x/issues/17305',
      planned: true,
      pro: true,
    },
    {
      title: 'Chord Chart',
      href: 'https://github.com/mui/mui-x/issues/19070',
      pro: true,
      planned: true,
    },
    {
      title: 'Waterfall Chart',
      href: 'https://github.com/mui/mui-x/issues/11318',
      planned: true,
      premium: true,
    },
    {
      title: 'Candlestick Chart',
      href: 'https://github.com/mui/mui-x/issues/13044',
      premium: true,
      planned: true,
    },
    {
      title: 'Boxplot Chart',
      href: 'https://github.com/mui/mui-x/issues/15025',
      premium: true,
      planned: true,
    },
    {
      title: 'OHLC Chart',
      href: 'https://github.com/mui/mui-x/issues/13045',
      premium: true,
      planned: true,
    },
    {
      title: 'Sunburst Chart',
      href: 'https://github.com/mui/mui-x/issues/11319',
      premium: true,
      planned: true,
    },
    {
      title: '3D Chart',
      href: 'https://github.com/mui/mui-x/issues/18825',
      premium: true,
      planned: true,
    },
  ];
}

export default function ChartComponentsGrid() {
  return (
    <List dense>
      {getComponents().map((component) => (
        <ListItem key={component.title}>
          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircleIcon sx={{ fontSize: 10 }} />
                <Link
                  href={component.href}
                  underline="hover"
                  sx={{ fontWeight: 500, fontSize: 16 }}
                  pl={0.5}
                >
                  {component.title}
                </Link>
                {component.pro && <span className="plan-pro" />}
                {component.premium && <span className="plan-premium" />}
                {component.planned && (
                  <Chip
                    label="Planned"
                    size="small"
                    variant="outlined"
                    color="grey"
                    sx={(theme) => ({
                      height: 20,
                      backgroundColor: 'grey.50',
                      borderColor: 'grey.200',
                      '.MuiChip-label': {
                        px: '6px',
                        fontSize: '0.65rem',
                        letterSpacing: '.04rem',
                        textTransform: 'uppercase',
                        color: 'text.primary',
                      },
                      ...theme.applyDarkStyles({
                        backgroundColor: 'divider',
                        borderColor: 'divider',
                      }),
                    })}
                  />
                )}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
