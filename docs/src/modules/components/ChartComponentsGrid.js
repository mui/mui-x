import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Link from 'docs/src/modules/components/Link';

function components() {
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
      title: 'Sparkline Chart',
      srcLight: '/static/x/component-illustrations/sparkline-light.png',
      srcDark: '/static/x/component-illustrations/sparkline-dark.png',
      href: '/x/react-charts/sparkline/',
    },
    {
      title: 'Gauge Chart',
      srcLight: '/static/x/component-illustrations/gauge-light.png',
      srcDark: '/static/x/component-illustrations/gauge-dark.png',
      href: '/x/react-charts/gauge/',
      planned: true,
    },
    {
      title: 'Heat map Chart',
      srcLight: '/static/x/component-illustrations/heatmap-light.png',
      srcDark: '/static/x/component-illustrations/heatmap-dark.png',
      href: '/x/react-charts/heat-map/',
      planned: true,
    },
    {
      title: 'Radar Chart',
      srcLight: '/static/x/component-illustrations/radar-light.png',
      srcDark: '/static/x/component-illustrations/radar-dark.png',
      href: '/x/react-charts/radar/',
      planned: true,
    },
    {
      title: 'Treemap Chart',
      srcLight: '/static/x/component-illustrations/treemap-light.png',
      srcDark: '/static/x/component-illustrations/treemap-dark.png',
      href: '/x/react-charts/tree-map/',
      planned: true,
    },
    {
      title: 'Funnel Chart',
      srcLight: '/static/x/component-illustrations/funnel-light.png',
      srcDark: '/static/x/component-illustrations/funnel-dark.png',
      href: '/x/react-charts/funnel/',
      planned: true,
    },
    {
      title: 'Gantt Chart',
      srcLight: '/static/x/component-illustrations/gantt-light.png',
      srcDark: '/static/x/component-illustrations/gantt-dark.png',
      href: '/x/react-charts/gantt/',
      planned: true,
    },
    {
      title: 'Sankey Chart',
      srcLight: '/static/x/component-illustrations/sankey-light.png',
      srcDark: '/static/x/component-illustrations/sankey-dark.png',
      href: '/x/react-charts/sankey/',
      planned: true,
    },
  ];
}

export default function ChartComponentsGrid({ planned }) {
  return (
    <Grid container spacing={2} sx={{ pt: 2, pb: 4 }}>
      {components().map((component) => (
        <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }} key={component.title}>
          <Card
            component={Link}
            noLinkStyle
            prefetch={false}
            variant="outlined"
            href={component.href}
            sx={(theme) => ({
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 1,
              borderColor: 'divider',
              ...theme.applyDarkStyles({
                backgroundColor: `${alpha(theme.palette.primaryDark[700], 0.3)}`,
                borderColor: 'divider',
              }),
            })}
          >
            <CardMedia
              component="img"
              alt=""
              image={component.srcLight}
              sx={(theme) => ({
                aspectRatio: '16 / 9',
                background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
                borderBottom: '1px solid',
                borderColor: 'divider',
                ...theme.applyDarkStyles({
                  content: `url(${component.srcDark})`,
                  background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
                  borderColor: 'divider',
                }),
              })}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              useFlexGap
              sx={{ p: 1.5 }}
            >
              <Typography component="h3" variant="body2" fontWeight="semiBold">
                {component.title}
              </Typography>
              {component.planned && (
                <Chip
                  label="Planned"
                  size="small"
                  variant="outlined"
                  color="grey"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    '.MuiChip-label': {
                      px: '6px',
                    },
                  }}
                />
              )}
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
