import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Link } from '@mui/docs/Link';

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
      planned: true,
    },
    {
      title: 'Treemap',
      srcLight: '/static/x/component-illustrations/treemap-light.png',
      srcDark: '/static/x/component-illustrations/treemap-dark.png',
      href: '/x/react-charts/treemap/',
      planned: true,
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
      planned: true,
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
      title: 'Gantt Chart',
      srcLight: '/static/x/component-illustrations/gantt-light.png',
      srcDark: '/static/x/component-illustrations/gantt-dark.png',
      href: '/x/react-charts/gantt/',
      planned: true,
      pro: true,
    },
  ];
}

export default function ChartComponentsGrid() {
  return (
    <Grid container spacing={2} sx={{ pt: 2, pb: 4 }}>
      {getComponents().map((component) => (
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
              loading="lazy"
              sx={(theme) => ({
                aspectRatio: '16 / 9',
                background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
                opacity: component.planned ? 0.4 : 1,
                filter: component.planned ? 'grayscale(100%)' : undefined,
                ...theme.applyDarkStyles({
                  opacity: component.planned ? 0.4 : 1,
                  content: `url(${component.srcDark})`,
                  background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
                }),
              })}
            />
            <Stack
              direction="row"
              alignItems="center"
              sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
            >
              <Typography component="h3" variant="body2" fontWeight="semiBold" mr={0.5}>
                {component.title}
              </Typography>
              {component.pro && <span className="plan-pro" />}
              {component.planned && (
                <Chip
                  label="Planned"
                  size="small"
                  variant="outlined"
                  color="grey"
                  sx={(theme) => ({
                    ml: 'auto',
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
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
