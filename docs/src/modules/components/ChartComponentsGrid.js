import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
  ];
}

export default function ChartComponentsGrid() {
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
            <Typography
              component="h2"
              variant="body2"
              fontWeight="semiBold"
              sx={{ px: 2, py: 1.5 }}
            >
              {component.title}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
