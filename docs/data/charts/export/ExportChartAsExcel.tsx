import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsDataProviderPremium } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import { ChartsToolbarPremium } from '@mui/x-charts-premium/ChartsToolbarPremium';
import { BAR_CHART_PREMIUM_PLUGINS } from '@mui/x-charts-premium/BarChartPremium';
import type { BarChartPremiumPluginSignatures } from '@mui/x-charts-premium/BarChartPremium';
import { useChartPremiumExport } from '@mui/x-charts-premium/plugins';
import type { UseChartPremiumExportSignature } from '@mui/x-charts-premium/plugins';

type Signatures = [
  ...BarChartPremiumPluginSignatures,
  UseChartPremiumExportSignature,
];

// Defined outside the component: plugins contain hooks, so their order must not change.
const plugins = [...BAR_CHART_PREMIUM_PLUGINS, useChartPremiumExport] as const;

const settings = {
  height: 300,
  xAxis: [{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' as const }],
  series: [
    { type: 'bar' as const, label: 'Revenue', data: [42, 51, 48, 63] },
    { type: 'bar' as const, label: 'Costs', data: [30, 34, 33, 39] },
  ],
};

export default function ExportChartAsExcel() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Open the export menu and pick Download as Excel
      </Typography>
      <ChartsDataProviderPremium<'bar', Signatures> {...settings} plugins={plugins}>
        <ChartsWrapper>
          <ChartsToolbarPremium />
          <ChartsSurface>
            <BarPlot />
            <ChartsXAxis />
            <ChartsYAxis />
          </ChartsSurface>
        </ChartsWrapper>
      </ChartsDataProviderPremium>
    </Stack>
  );
}
