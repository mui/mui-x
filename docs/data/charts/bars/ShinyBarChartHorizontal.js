import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { useAnimate } from '@mui/x-charts/hooks';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';

const data = [
  {
    country: 'Romania (2020)',
    turnout: 33.2,
    absence: 66.8,
  },
  {
    country: 'Bulgaria (2024)',
    turnout: 33.4,
    absence: 66.6,
  },
  {
    country: 'Albania (2021)',
    turnout: 46.3,
    absence: 53.7,
  },
  {
    country: 'United Kingdom (2024)',
    turnout: 60.0,
    absence: 40.0,
  },
  {
    country: 'Spain (2023)',
    turnout: 66.0,
    absence: 34.0,
  },
  {
    country: 'France (2024)',
    turnout: 66.7,
    absence: 33.3,
  },
  {
    country: 'Germany (2021)',
    turnout: 76.4,
    absence: 23.6,
  },
  {
    country: 'Sweden (2022)',
    turnout: 83.8,
    absence: 16.2,
  },
  {
    country: 'Malta (2022)',
    turnout: 85.6,
    absence: 14.4,
  },
  {
    country: 'Turkey (2023)',
    turnout: 87.0,
    absence: 13.0,
  },
  {
    country: 'Belgium (2024)',
    turnout: 88.5,
    absence: 11.5,
  },
];

export default function ShinyBarChartHorizontal() {
  const theme = useTheme();

  return (
    <div style={{ width: '100%' }}>
      <Typography>European countries with lowest & highest voter turnout</Typography>
      <BarChart
        height={500}
        dataset={data}
        series={[
          {
            id: 'turnout',
            dataKey: 'turnout',
            stack: 'voter turnout',
          },
          {
            id: 'absence',
            dataKey: 'absence',
            stack: 'voter turnout',
            color: (theme.vars || theme).palette.text.primary,
            xAxisId: 'regular',
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
          },
          {
            id: 'regular',
            min: 0,
            max: 100,
          },
        ]}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'country',
            width: 140,
          },
        ]}
        sx={{
          [`[data-series=absence] .${barElementClasses.root}`]: {
            opacity: 0.1,
          },
        }}
        slots={{ legend: PiecewiseColorLegend, barLabel: BarLabelAtBase }}
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
            sx: { padding: 0 },
          },
        }}
      />
    </div>
  );
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
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
    { x: x + width / 2, y: y - 8 },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return (
    <Text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
  );
}
