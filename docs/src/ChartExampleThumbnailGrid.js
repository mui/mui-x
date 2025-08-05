import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

import SimpleBarChart from '../data/charts/bar-demo/SimpleBarChart';
import StackedBarChart from '../data/charts/bar-demo/StackedBarChart';
import MixedBarChart from '../data/charts/bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from '../data/charts/bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../data/charts/bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../data/charts/bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../data/charts/bar-demo/PopulationPyramidBarChart';

import SimpleLineChart from '../data/charts/line-demo/SimpleLineChart';
import DashedLineChart from '../data/charts/line-demo/DashedLineChart';
import BiaxialLineChart from '../data/charts/line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from '../data/charts/line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from '../data/charts/line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from '../data/charts/line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from '../data/charts/line-demo/LineWithUncertaintyArea';
import CustomLineMarks from '../data/charts/line-demo/CustomLineMarks';

import SimpleAreaChart from '../data/charts/areas-demo/SimpleAreaChart';
import StackedAreaChart from '../data/charts/areas-demo/StackedAreaChart';
import PercentAreaChart from '../data/charts/areas-demo/PercentAreaChart';
import AreaChartConnectNulls from '../data/charts/areas-demo/AreaChartConnectNulls';

import SimpleScatterChart from '../data/charts/scatter-demo/SimpleScatterChart';
import MultipleYAxesScatterChart from '../data/charts/scatter-demo/MultipleYAxesScatterChart';

import TwoLevelPieChart from '../data/charts/pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from '../data/charts/pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from '../data/charts/pie-demo/PieChartWithCustomizedLabel';
import PieChartWithCenterLabel from '../data/charts/pie-demo/PieChartWithCenterLabel';
import PieChartWithPaddingAngle from '../data/charts/pie-demo/PieChartWithPaddingAngle';
import PieChartWithCustomLegendAndTooltip from '../data/charts/pie-demo/PieChartWithCustomLegendAndTooltip';

import BasicGauges from '../data/charts/gauge/BasicGauges';
import ArcDesign from '../data/charts/gauge/ArcDesign';
import CompositionExample from '../data/charts/gauge/CompositionExample';
import BasicSparkLine from '../data/charts/sparkline/BasicSparkLine';
import AreaSparkLine from '../data/charts/sparkline/AreaSparkLine';

const chartCategories = [
  {
    title: 'Bar Charts',
    description: 'Vertical and horizontal bars, stacked and grouped variations',
    charts: [
      {
        title: 'Simple Bar Chart',
        link: '/x/react-charts/examples/simplebarchart/',
        ChartComponent: SimpleBarChart,
      },
      {
        title: 'Stacked Bar Chart',
        link: '/x/react-charts/examples/stackedbarchart/',
        ChartComponent: StackedBarChart,
      },
      {
        title: 'Mixed Bar Chart',
        link: '/x/react-charts/examples/mixedbarchart/',
        ChartComponent: MixedBarChart,
      },
      {
        title: 'Positive and Negative Bar Chart',
        link: '/x/react-charts/bar-demo/#positive-and-negative-bar-chart',
        ChartComponent: PositiveAndNegativeBarChart,
      },
      {
        title: 'Bar Chart Stacked by Sign',
        link: '/x/react-charts/bar-demo/#bar-chart-stacked-by-sign',
        ChartComponent: BarChartStackedBySign,
      },
      {
        title: 'Biaxial Bar Chart',
        link: '/x/react-charts/bar-demo/#biaxial-bar-chart',
        ChartComponent: BiaxialBarChart,
      },
      {
        title: 'Population Pyramid Bar Chart',
        link: '/x/react-charts/bar-demo/#population-pyramid',
        ChartComponent: PopulationPyramidBarChart,
      },
    ],
  },
  {
    title: 'Line Charts',
    description: 'Connected data points showing trends over time',
    charts: [
      {
        title: 'Simple Line Chart',
        link: '/x/react-charts/examples/simplelinechart/',
        ChartComponent: SimpleLineChart,
      },
      {
        title: 'Dashed Line Chart',
        link: '/x/react-charts/examples/dashedlinechart/',
        ChartComponent: DashedLineChart,
      },
      {
        title: 'Biaxial Line Chart',
        link: '/x/react-charts/examples/biaxiallinechart/',
        ChartComponent: BiaxialLineChart,
      },
      {
        title: 'Line Chart with Reference Lines',
        link: '/x/react-charts/line-demo/#line-chart-with-reference-lines',
        ChartComponent: LineChartWithReferenceLines,
      },
      {
        title: 'Line Chart Connect Nulls',
        link: '/x/react-charts/line-demo/#line-chart-connect-nulls',
        ChartComponent: LineChartConnectNulls,
      },
      {
        title: 'Live Line Chart',
        link: '/x/react-charts/line-demo/#line-chart-with-live-data',
        ChartComponent: LiveLineChartNoSnap,
      },
      {
        title: 'Line with Uncertainty Area',
        link: '/x/react-charts/line-demo/#line-with-forecast',
        ChartComponent: LineWithUncertaintyArea,
      },
      {
        title: 'Custom Line Marks',
        link: '/x/react-charts/line-demo/#custom-line-marks',
        ChartComponent: CustomLineMarks,
      },
    ],
  },
  {
    title: 'Area Charts',
    description: 'Filled areas below lines for cumulative data',
    charts: [
      {
        title: 'Simple Area Chart',
        link: '/x/react-charts/areas-demo/#simple-area-chart',
        ChartComponent: SimpleAreaChart,
      },
      {
        title: 'Stacked Area Chart',
        link: '/x/react-charts/areas-demo/#stacked-area-chart',
        ChartComponent: StackedAreaChart,
      },
      {
        title: 'Percent Area Chart',
        link: '/x/react-charts/areas-demo/#percent-area-chart',
        ChartComponent: PercentAreaChart,
      },
      {
        title: 'Area Chart Connect Nulls',
        link: '/x/react-charts/areas-demo/#area-chart-connect-nulls',
        ChartComponent: AreaChartConnectNulls,
      },
    ],
  },
  {
    title: 'Scatter Charts',
    description: 'Plot points to show relationships between variables',
    charts: [
      {
        title: 'Simple Scatter Chart',
        link: '/x/react-charts/scatter-demo/#simple-scatter-chart',
        ChartComponent: SimpleScatterChart,
      },
      {
        title: 'Multiple Y Axes Scatter Chart',
        link: '/x/react-charts/scatter-demo/#multiple-y-axes',
        ChartComponent: MultipleYAxesScatterChart,
      },
    ],
  },
  {
    title: 'Pie Charts',
    description: 'Circular slices showing proportional data',
    charts: [
      {
        title: 'Two Level Pie Chart',
        link: '/x/react-charts/pie-demo/#two-level-pie-chart',
        ChartComponent: TwoLevelPieChart,
      },
      {
        title: 'Straight Angle Pie Chart',
        link: '/x/react-charts/pie-demo/#straight-angle-pie-chart',
        ChartComponent: StraightAnglePieChart,
      },
      {
        title: 'Pie Chart with Customized Label',
        link: '/x/react-charts/pie-demo/#pie-chart-with-customized-label',
        ChartComponent: PieChartWithCustomizedLabel,
      },
      {
        title: 'Pie Chart with Center Label',
        link: '/x/react-charts/pie-demo/#pie-chart-with-center-label',
        ChartComponent: PieChartWithCenterLabel,
      },
      {
        title: 'Pie Chart with Padding Angle',
        link: '/x/react-charts/pie-demo/#pie-chart-with-padding-angle',
        ChartComponent: PieChartWithPaddingAngle,
      },
      {
        title: 'Pie Chart with Custom Legend',
        link: '/x/react-charts/pie-demo/#pie-chart-with-custom-legend-and-tooltip',
        ChartComponent: PieChartWithCustomLegendAndTooltip,
      },
    ],
  },
  {
    title: 'Other Charts',
    description: 'Gauge, sparkline, and specialized chart types',
    charts: [
      {
        title: 'Basic Gauges',
        link: '/x/react-charts/gauge/#basics',
        ChartComponent: BasicGauges,
      },
      {
        title: 'Arc Design',
        link: '/x/react-charts/gauge/#arc-design',
        ChartComponent: ArcDesign,
      },
      {
        title: 'Customized Gauge with Pointer',
        link: '/x/react-charts/gauge/#composition',
        ChartComponent: CompositionExample,
      },
      {
        title: 'Basic Sparkline',
        link: '/x/react-charts/sparkline/#basics',
        ChartComponent: BasicSparkLine,
      },
      {
        title: 'Area Sparkline',
        link: '/x/react-charts/sparkline/#line-customization',
        ChartComponent: AreaSparkLine,
      },
    ],
  },
];

function ChartThumbnailCard({ title, link, ChartComponent }) {
  return (
    <Link
      href={link}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        width: '100%',
      }}
    >
      <Paper
        variant="outlined"
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '10px',
          border: 1,
          borderColor: 'secondary.main',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            opacity: 1,
            boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[50], 0.3)} inset, 0px 1px 6px 0px ${theme.palette.primary[100]}`,
            borderColor: 'primary.100',
          },
          ...theme.applyDarkStyles({
            '&:hover': {
              boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[800], 0.1)} inset, 0px 1px 6px 0px ${theme.palette.primary[900]}`,
            },
          }),
        })}
      >
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: '60%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& > div': {
                width: '100% !important',
                height: '100% !important',
                minHeight: 'unset !important',
              },
              '& svg': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
              pointerEvents: 'none',
            }}
          >
            <ChartComponent />
          </Box>
        </Box>

        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            fontFamily={'IBM Plex Sans'}
            fontWeight="medium"
            variant="body2"
            color="text.main"
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
}

ChartThumbnailCard.propTypes = {
  ChartComponent: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function ChartCategoryGrid({ categoryName }) {
  const category = chartCategories.find((cat) => cat.title === categoryName);

  if (!category) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        mb: 5,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr',
        },
        gap: 3,
      }}
    >
      {category.charts.map((chart) => (
        <ChartThumbnailCard
          key={chart.title}
          title={chart.title}
          link={chart.link}
          ChartComponent={chart.ChartComponent}
        />
      ))}
    </Box>
  );
}

ChartCategoryGrid.propTypes = {
  categoryName: PropTypes.string.isRequired,
};

export default function ChartExampleThumbnailGrid() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        This component has been replaced by individual category grids.
      </Typography>
    </Box>
  );
}

export { ChartCategoryGrid };
