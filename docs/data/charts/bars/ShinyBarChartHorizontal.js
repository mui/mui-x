import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAnimate, useAnimateBar, useDrawingArea } from '@mui/x-charts/hooks';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const data = [
  {
    country: 'Romania (2020)',
    turnout: 33.2,
  },
  {
    country: 'Bulgaria (2024)',
    turnout: 33.4,
  },
  {
    country: 'Albania (2021)',
    turnout: 46.3,
  },
  {
    country: 'United Kingdom (2024)',
    turnout: 60.0,
  },
  {
    country: 'Spain (2023)',
    turnout: 66.0,
  },
  {
    country: 'France (2024)',
    turnout: 66.7,
  },
  {
    country: 'Germany (2021)',
    turnout: 76.4,
  },
  {
    country: 'Sweden (2022)',
    turnout: 83.8,
  },
  {
    country: 'Malta (2022)',
    turnout: 85.6,
  },
  {
    country: 'Turkey (2023)',
    turnout: 87.0,
  },
  {
    country: 'Belgium (2024)',
    turnout: 88.5,
  },
];

export default function ShinyBarChartHorizontal() {
  return (
    <div style={{ width: '100%' }}>
      <Typography>European countries with lowest & highest voter turnout</Typography>
      <BarChart
        height={300}
        dataset={data}
        series={[
          {
            id: 'turnout',
            dataKey: 'turnout',
            stack: 'voter turnout',
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            id: 'color',
            min: 0,
            max: 100,
            colorMap: {
              type: 'piecewise',
              thresholds: [50, 85],
              colors: ['#d32f2f', '#78909c', '#1976d2'],
            },
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        barLabel={(v) => `${v.value}%`}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'country',
            width: 140,
          },
        ]}
        slots={{
          legend: PiecewiseColorLegend,
          barLabel: BarLabelAtBase,
          bar: BarShadedBackground,
        }}
        sx={{
          [`.${axisClasses.tickContainer}:nth-of-type(-n+3) .${axisClasses.tickLabel}`]:
            {
              fontWeight: 600,
            },
          [`.${axisClasses.tickContainer}:nth-last-of-type(-n+4) .${axisClasses.tickLabel}`]:
            {
              fontWeight: 600,
            },
        }}
        slotProps={{
          legend: {
            axisDirection: 'x',
            direction: 'vertical',
            markType: 'square',
            labelPosition: 'start',
            labelFormatter: ({ index }) => {
              if (index === 0) {
                return 'lowest turnout';
              }
              if (index === 1) {
                return 'average';
              }
              return 'highest turnout';
            },
          },
        }}
      />
    </div>
  );
}

export function BarShadedBackground(props) {
  const { ownerState, skipAnimation, id, dataIndex, xOrigin, yOrigin, ...other } =
    props;
  const theme = useTheme();

  const animatedProps = useAnimateBar(props);
  const { width } = useDrawingArea();
  return (
    <React.Fragment>
      <rect
        {...other}
        fill={(theme.vars || theme).palette.text.primary}
        opacity={theme.palette.mode === 'dark' ? 0.05 : 0.1}
        x={other.x}
        width={width}
      />
      <rect
        {...other}
        filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        data-highlighted={ownerState.isHighlighted || undefined}
        data-faded={ownerState.isFaded || undefined}
        {...animatedProps}
      />
    </React.Fragment>
  );
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme).palette.common.white,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'start',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  fontWeight: 600,
}));

function BarLabelAtBase(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: xOrigin + 8, y: y + height / 2 },
    {
      initialProps: { x: xOrigin, y: y + height / 2 },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return <Text {...otherProps} {...animatedProps} />;
}
