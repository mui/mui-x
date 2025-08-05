/* eslint-disable react/no-danger */
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SectionTitle } from '@mui/docs/SectionTitle';
import { MarkdownElement } from '@mui/docs/MarkdownElement';
import BrandingCssVarsProvider from 'docs/src/BrandingCssVarsProvider';
import AppLayoutDocs from 'docs/src/modules/components/AppLayoutDocs';

// Bar chart demo
import PositiveAndNegativeBarChart from '../../../data/charts/bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../../../data/charts/bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../../../data/charts/bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../../../data/charts/bar-demo/PopulationPyramidBarChart';

// Area Demo
import SimpleAreaChart from '../../../data/charts/areas-demo/SimpleAreaChart';
import StackedAreaChart from '../../../data/charts/areas-demo/StackedAreaChart';
import PercentAreaChart from '../../../data/charts/areas-demo/PercentAreaChart';
import AreaChartConnectNulls from '../../../data/charts/areas-demo/AreaChartConnectNulls';

// Line chart Demo
import SimpleLineChart from '../../../data/charts/line-demo/SimpleLineChart';
import DashedLineChart from '../../../data/charts/line-demo/DashedLineChart';
import BiaxialLineChart from '../../../data/charts/line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from '../../../data/charts/line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from '../../../data/charts/line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from '../../../data/charts/line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from '../../../data/charts/line-demo/LineWithUncertaintyArea';
import CustomLineMarks from '../../../data/charts/line-demo/CustomLineMarks';

// Pie chart
import TwoLevelPieChart from '../../../data/charts/pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from '../../../data/charts/pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from '../../../data/charts/pie-demo/PieChartWithCustomizedLabel';
import PieChartWithCenterLabel from '../../../data/charts/pie-demo/PieChartWithCenterLabel';
import PieChartWithPaddingAngle from '../../../data/charts/pie-demo/PieChartWithPaddingAngle';
import PieChartWithCustomLegendAndTooltip from '../../../data/charts/pie-demo/PieChartWithCustomLegendAndTooltip';

// Scatter chart
import SimpleScatterChart from '../../../data/charts/scatter-demo/SimpleScatterChart';
import MultipleYAxesScatterChart from '../../../data/charts/scatter-demo/MultipleYAxesScatterChart';

// Other chart
import BasicGauges from '../../../data/charts/gauge/BasicGauges';
import ArcDesign from '../../../data/charts/gauge/ArcDesign';
import CompositionExample from '../../../data/charts/gauge/CompositionExample';
import BasicSparkLine from '../../../data/charts/sparkline/BasicSparkLine';
import AreaSparkLine from '../../../data/charts/sparkline/AreaSparkLine';

function textToHash(text: string) {
  return encodeURI(
    text
      .toLowerCase()
      .replace(/<\/?[^>]+(>|$)/g, '') // remove HTML
      .replace(/=&gt;|&lt;| \/&gt;|<code>|<\/code>|&#39;/g, '')
      .replace(/[!@#$%^&*()=_+[\]{}`~;:'"|,.<>/?\s]+/g, '-')
      .replace(
        /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\uFE0F?/g,
        '',
      ) // remove emojis
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
  );
}

const chartData: {
  title: string;
  hash: string;
  demos: {
    title: string;
    link: string;
    ChartComponent: () => React.JSX.Element;
  }[];
}[] = [
  {
    title: 'Bar Chart',
    demos: [
      {
        title: 'Positive and Negative Bar Chart',
        link: '/x/react-charts/bar-demo/#PositiveAndNegativeBarChart',
        ChartComponent: PositiveAndNegativeBarChart,
      },
      {
        title: 'Bar Chart Stacked by Sign',
        link: '/x/react-charts/bar-demo/#BarChartStackedBySign',
        ChartComponent: BarChartStackedBySign,
      },
      {
        title: 'Biaxial Bar Chart',
        link: '/x/react-charts/bar-demo/#BiaxialBarChart',
        ChartComponent: BiaxialBarChart,
      },
      {
        title: 'Population Pyramid Bar Chart',
        link: '/x/react-charts/bar-demo/#PopulationPyramidBarChart',
        ChartComponent: PopulationPyramidBarChart,
      },
    ],
  },
  {
    title: 'Area Chart',
    demos: [
      {
        title: 'Simple Area',
        link: '/x/react-charts/areas-demo/#SimpleAreaChart',
        ChartComponent: SimpleAreaChart,
      },
      {
        title: 'Stacked Area',
        link: '/x/react-charts/areas-demo/#StackedAreaChart',
        ChartComponent: StackedAreaChart,
      },
      {
        title: 'Percent Area',
        link: '/x/react-charts/areas-demo/#PercentAreaChart',
        ChartComponent: PercentAreaChart,
      },
      {
        title: 'AreaChartConnectNulls',
        link: '/x/react-charts/areas-demo/#AreaChartConnectNulls',
        ChartComponent: AreaChartConnectNulls,
      },
    ],
  },

  {
    title: 'Line chart Demo',
    demos: [
      {
        title: 'SimpleLineChart',
        link: '/x/react-charts/line-demo/#SimpleLineChart',
        ChartComponent: SimpleLineChart,
      },
      {
        title: 'DashedLineChart',
        link: '/x/react-charts/line-demo/#DashedLineChart',
        ChartComponent: DashedLineChart,
      },
      {
        title: 'BiaxialLineChart',
        link: '/x/react-charts/line-demo/#BiaxialLineChart',
        ChartComponent: BiaxialLineChart,
      },
      {
        title: 'LineChartWithReferenceLines',
        link: '/x/react-charts/line-demo/#LineChartWithReferenceLines',
        ChartComponent: LineChartWithReferenceLines,
      },
      {
        title: 'LineChartConnectNulls',
        link: '/x/react-charts/line-demo/#LineChartConnectNulls',
        ChartComponent: LineChartConnectNulls,
      },
      {
        title: 'LiveLineChartNoSnap',
        link: '/x/react-charts/line-demo/#LiveLineChartNoSnap',
        ChartComponent: LiveLineChartNoSnap,
      },
      {
        title: 'LineWithUncertaintyArea',
        link: '/x/react-charts/line-demo/#LineWithUncertaintyArea',
        ChartComponent: LineWithUncertaintyArea,
      },
      {
        title: 'CustomLineMarks',
        link: '/x/react-charts/line-demo/#CustomLineMarks',
        ChartComponent: CustomLineMarks,
      },
    ],
  },

  {
    title: 'Pie chart',
    demos: [
      {
        title: 'TwoLevelPieChart',
        link: '/x/react-charts/pie-demo/#TwoLevelPieChart',
        ChartComponent: TwoLevelPieChart,
      },
      {
        title: 'StraightAnglePieChart',
        link: '/x/react-charts/pie-demo/#StraightAnglePieChart',
        ChartComponent: StraightAnglePieChart,
      },
      {
        title: 'PieChartWithCustomizedLabel',
        link: '/x/react-charts/pie-demo/#PieChartWithCustomizedLabel',
        ChartComponent: PieChartWithCustomizedLabel,
      },
      {
        title: 'PieChartWithCenterLabel',
        link: '/x/react-charts/pie-demo/#PieChartWithCenterLabel',
        ChartComponent: PieChartWithCenterLabel,
      },
      {
        title: 'PieChartWithPaddingAngle',
        link: '/x/react-charts/pie-demo/#PieChartWithPaddingAngle',
        ChartComponent: PieChartWithPaddingAngle,
      },
      {
        title: 'PieChartWithCustomLegendAndTooltip',
        link: '/x/react-charts/pie-demo/#PieChartWithCustomLegendAndTooltip',
        ChartComponent: PieChartWithCustomLegendAndTooltip,
      },
    ],
  },

  {
    title: 'Scatter chart',
    demos: [
      {
        title: 'SimpleScatterChart',
        link: '/x/react-charts/scatter-demo/#SimpleScatterChart',
        ChartComponent: SimpleScatterChart,
      },
      {
        title: 'MultipleYAxesScatterChart',
        link: '/x/react-charts/scatter-demo/#MultipleYAxesScatterChart',
        ChartComponent: MultipleYAxesScatterChart,
      },
    ],
  },
  {
    title: 'More demo',
    demos: [
      {
        title: 'BasicGauges',
        link: '/x/react-charts/gauge/#BasicGauges',
        ChartComponent: BasicGauges,
      },
      {
        title: 'ArcDesign',
        link: '/x/react-charts/gauge/#ArcDesign',
        ChartComponent: ArcDesign,
      },
      {
        title: 'CompositionExample',
        link: '/x/react-charts/gauge/#CompositionExample',
        ChartComponent: CompositionExample,
      },
      {
        title: 'BasicSparkLine',
        link: '/x/react-charts/sparkline/#BasicSparkLine',
        ChartComponent: BasicSparkLine,
      },
      {
        title: 'AreaSparkLine',
        link: '/x/react-charts/sparkline/#AreaSparkLine',
        ChartComponent: AreaSparkLine,
      },
    ],
  },
].map((item) => ({ ...item, hash: textToHash(item.title) }));

function DemoList(props: {
  demos: {
    title: string;
    link: string;
    ChartComponent: () => React.JSX.Element;
  }[];
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        mt: 4,
        mb: 10,
        width: '100%',
        '&>div': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: { xs: '100%', lg: '50%' },
          padding: 2,
        },
      }}
    >
      {props.demos.map((demo) => (
        <div key={demo.link}>
          <Typography variant="h4" sx={{ pb: 2 }}>
            {demo.title}
          </Typography>
          <demo.ChartComponent />
          <Typography component="a" href={demo.link} sx={{ mb: 2, alignSelf: 'end' }}>
            Go to the demo
          </Typography>
        </div>
      ))}
    </Box>
  );
}
export default function Page() {
  const toc = chartData.map(({ hash, title }) => ({ hash, text: title, children: [] }));

  return (
    <BrandingCssVarsProvider>
      <AppLayoutDocs
        title="Charts examples"
        description="A collection of charts examples"
        disableAd
        disableToc={false}
        location=""
        toc={toc}
      >
        <MarkdownElement>
          <h1>Charts examples</h1>
          {chartData.map((section) => (
            <React.Fragment key={section.hash}>
              <SectionTitle title={section.title} hash={section.hash} level="h2" />
              <DemoList demos={section.demos} />
            </React.Fragment>
          ))}
        </MarkdownElement>
        <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <symbol id="anchor-link-icon" viewBox="0 0 12 6">
            <path d="M8.9176 0.083252H7.1676C6.84677 0.083252 6.58427 0.345752 6.58427 0.666585C6.58427 0.987419 6.84677 1.24992 7.1676 1.24992H8.9176C9.8801 1.24992 10.6676 2.03742 10.6676 2.99992C10.6676 3.96242 9.8801 4.74992 8.9176 4.74992H7.1676C6.84677 4.74992 6.58427 5.01242 6.58427 5.33325C6.58427 5.65409 6.84677 5.91659 7.1676 5.91659H8.9176C10.5276 5.91659 11.8343 4.60992 11.8343 2.99992C11.8343 1.38992 10.5276 0.083252 8.9176 0.083252ZM3.6676 2.99992C3.6676 3.32075 3.9301 3.58325 4.25094 3.58325H7.75094C8.07177 3.58325 8.33427 3.32075 8.33427 2.99992C8.33427 2.67909 8.07177 2.41659 7.75094 2.41659H4.25094C3.9301 2.41659 3.6676 2.67909 3.6676 2.99992ZM4.83427 4.74992H3.08427C2.12177 4.74992 1.33427 3.96242 1.33427 2.99992C1.33427 2.03742 2.12177 1.24992 3.08427 1.24992H4.83427C5.1551 1.24992 5.4176 0.987419 5.4176 0.666585C5.4176 0.345752 5.1551 0.083252 4.83427 0.083252H3.08427C1.47427 0.083252 0.167603 1.38992 0.167603 2.99992C0.167603 4.60992 1.47427 5.91659 3.08427 5.91659H4.83427C5.1551 5.91659 5.4176 5.65409 5.4176 5.33325C5.4176 5.01242 5.1551 4.74992 4.83427 4.74992Z" />
          </symbol>
        </svg>
      </AppLayoutDocs>
    </BrandingCssVarsProvider>
  );
}
