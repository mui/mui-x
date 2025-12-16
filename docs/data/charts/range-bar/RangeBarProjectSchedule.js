import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RangeBarPlot } from '@mui/x-charts-premium/BarChartPremium';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import * as React from 'react';
import { useDataset } from '@mui/x-charts/hooks';
import { useTheme, styled } from '@mui/system';
import {
  ChartsTooltipContainer,
  useAxesTooltip,
  useItemTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import { ChartsWrapper } from '@mui/x-charts-pro/ChartsWrapper';
import { ChartsSurface } from '@mui/x-charts-pro/ChartsSurface';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';

const importantHappeningsLabels = [
  'Exploratory archaeology digs begin.',
  'South Boston Haul Road opens.',
  'New Broadway Bridge opens.\nLeverett Circle Connector Bridge opens.',
  'Leonard P. Zakim Bunker Hill Bridge completed.',
  'I-90 Connector from South Boston to Rt. 1A in East Boston opens in January.\nI-93 Northbound opens in March.\nI-93 Southbound opens in December.',
  'Tunnel from Storrow Drive to Leverett Circle Connector opens.',
  [
    'Full opening of I-93 South.',
    'Opening of Dewey Square Tunnel, including new entrance and exit ramps.',
    'Opening of the two cantilevered lanes on Leonard P. Zakim Bunker Hill Bridge.',
    'Opening of permanent ramps and roadways at I-90/I-93 Interchange and in other areas.',
  ].join('\n'),
  'Spectacle Island Park opens to the public.',
  'Restoration of Boston city streets.',
];

const importantHappenings = [
  { x: 1988, y: 3 },
  { x: 1993, y: 4 },
  { x: 1999, y: 5 },
  { x: 2002, y: 5 },
  { x: 2003, y: 5 },
  { x: 2004, y: 6 },
  { x: 2005, y: 6 },
  { x: 2006, y: 7 },
  { x: 2007, y: 8 },
];

// Source: https://www.mass.gov/info-details/the-big-dig-project-background
const bigDigDataset = [
  {
    phase: 1,
    name: 'Conception & Initial Planning',
    startYear: 1970,
    endYear: 1982,
    duration: '~10 years',
    keyMilestones: [
      'Concept development to address Central Artery congestion',
      'Federal Highway Administration involvement',
    ],
  },
  {
    phase: 2,
    name: 'Planning & Federal Approval',
    startYear: 1982,
    endYear: 1987,
    duration: '5 years',
    keyMilestones: [
      '1982: Official planning begins',
      'Environmental Impact Statement preparation',
      '1985: Final EIS approval by FHWA',
      'April 1987: Congress approves federal funding and project scope',
    ],
  },
  {
    phase: 3,
    name: 'Design Development',
    startYear: 1987,
    endYear: 1991,
    duration: '4 years',
    keyMilestones: [
      'Detailed engineering and design work',
      'Permits and approvals',
      'Contract procurement preparation',
      'Route and interchange finalization',
    ],
  },
  {
    phase: 4,
    name: 'Ted Williams Tunnel Construction',
    startYear: 1991,
    endYear: 1995,
    duration: '4 years',
    keyMilestones: [
      'December 19, 1991: Official groundbreaking',
      'Underwater tunnel sections (steel tubes lowered by barges)',
      'December 1995: Ted Williams Tunnel opens (I-90 to Logan Airport)',
    ],
  },
  {
    phase: 5,
    name: 'Major Underground Construction',
    startYear: 1995,
    endYear: 2003,
    duration: '8 years',
    keyMilestones: [
      'Central Artery tunnel excavation',
      'Tunnel-jacking operations (freezing soil beneath rail lines)',
      'Bridge construction (Zakim Bunker Hill Bridge)',
      'Four major highway interchanges',
    ],
  },
  {
    phase: 6,
    name: 'Systems Installation & Testing',
    startYear: 2003,
    endYear: 2005,
    duration: '2-3 years',
    keyMilestones: [
      'Tunnel systems (ventilation, lighting, fire safety)',
      'Traffic management systems (1,400+ loop detectors, 430 CCTV cameras)',
      'Operations Control Center setup',
    ],
  },
  {
    phase: 7,
    name: 'Final Construction & Opening',
    startYear: 2005,
    endYear: 2006,
    duration: '1-2 years',
    keyMilestones: [
      'January 13, 2006: Final ramp opens (Exit 20B)',
      'Elevated highway demolition begins',
      "O'Neill Tunnel dedication",
    ],
  },
  {
    phase: 8,
    name: 'Rose Kennedy Greenway Development',
    startYear: 2006,
    endYear: 2007,
    duration: '1-2 years',
    keyMilestones: [
      'Creation of 300+ acres of open space',
      'Park and public space development',
      'December 31, 2007: Official project completion',
    ],
  },
  {
    phase: 9,
    name: 'Claims Resolution & Final Closeout',
    startYear: 2007,
    endYear: 2008,
    duration: '1 year',
    keyMilestones: [
      'Legal settlements ($407M from Bechtel/Parsons Brinckerhoff)',
      'Documentation finalization',
      'Warranty period begins',
    ],
  },
];

const xAxis = [
  {
    id: 'x',
    scaleType: 'linear',
    valueFormatter: (value) => value.toString(),
    label: 'Year',
  },
];

const yAxis = [
  {
    id: 'y',
    scaleType: 'band',
    dataKey: 'phase',
    label: 'Project Phase',
    width: 40,
  },
];

export default function RangeBarProjectSchedule() {
  const clipPathId = React.useId();
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);
  const colors = [palette[4], palette[1], palette[0]];

  const series = [
    {
      type: 'rangeBar',
      datasetKeys: { start: 'startYear', end: 'endYear' },
      xAxisId: 'x',
      yAxisId: 'y',
      layout: 'horizontal',
      colorGetter: (data) => {
        if (data.dataIndex < 3) {
          return colors[0];
        }

        if (data.dataIndex < 8) {
          return colors[1];
        }

        return colors[2];
      },
    },
    {
      type: 'scatter',
      data: importantHappenings,
      color: palette[2],
    },
  ];

  return (
    <ChartDataProviderPremium
      dataset={bigDigDataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
    >
      <ChartsWrapper legendPosition={{ vertical: 'bottom' }}>
        <ChartsSurface>
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsClipPath id={clipPathId} />
          <g clipPath={`url(#${clipPathId})`}>
            <RangeBarPlot skipAnimation />
            <ScatterPlot />
            <ChartsAxisHighlight y="band" />
          </g>
          <ChartsTooltipContainer>
            <TooltipContent />
          </ChartsTooltipContainer>
        </ChartsSurface>
        <Legend
          series={[
            {
              label: 'Phases 1-3: Planning & Initial Construction',
              color: colors[0],
            },
            {
              label: 'Phases 4-8: Major Construction',
              color: colors[1],
            },
            {
              label: 'Phase 9: Finalization & Closeout',
              color: colors[2],
            },
          ]}
        />
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}

const TooltipContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

function TooltipContent() {
  const dataset = useDataset();
  const itemTooltipData = useItemTooltip();
  const axesTooltipData = useAxesTooltip();

  if (itemTooltipData) {
    return <HappeningTooltip />;
  }

  const dataIndex = axesTooltipData?.[0]?.dataIndex;

  if (dataIndex === undefined) {
    return null;
  }

  const phase = dataset[dataIndex];

  return (
    <TooltipContainer>
      <Typography>
        Phase {phase.phase}: <strong>{phase.name}</strong> ({phase.startYear} -{' '}
        {phase.endYear})
      </Typography>
      <Typography variant="body2">Key Milestones:</Typography>
      <ul>
        {phase.keyMilestones.map((milestone, index) => (
          <li key={index}>
            <Typography variant="body2">{milestone}</Typography>
          </li>
        ))}
      </ul>
    </TooltipContainer>
  );
}

function HappeningTooltip() {
  const tooltipData = useItemTooltip();
  const dataIndex = tooltipData?.identifier.dataIndex;

  if (dataIndex === undefined) {
    return null;
  }

  const happening = importantHappenings[dataIndex];

  return (
    <TooltipContainer>
      <Typography fontWeight="bold">{happening.x}</Typography>
      <Typography>
        {importantHappeningsLabels[dataIndex].split('\n').map((line, index) => (
          <React.Fragment key={index}>
            <span>{line}</span>
            <br />
          </React.Fragment>
        ))}
      </Typography>
    </TooltipContainer>
  );
}

function Legend({ series }) {
  return (
    <Stack direction="row" flexWrap="wrap" columnGap={2} justifyContent="center">
      {series.map((aSeries, index) => (
        <Stack key={index} alignItems="center" direction="row" marginBottom={0.5}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: aSeries.color,
              marginRight: 8,
              borderRadius: 4,
            }}
          />
          <Typography variant="caption">{aSeries.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
