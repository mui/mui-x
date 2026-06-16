import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { interpolateBlues } from 'd3-scale-chromatic';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import {
  ContinuousColorLegend,
  PiecewiseColorLegend,
} from '@mui/x-charts-premium/ChartsLegend';

import { internetUsageByCountry } from '../dataset/internetUsageByCountry';
import { withCountryCodeAsName, countryData } from '../dataset/countryData';

const countries = withCountryCodeAsName(
  topojsonFeature(countriesTopology, 'countries'),
);

const data = Object.keys(countryData).map((code) => ({
  name: code,
  label: countryData[code].country,
  colorValue: internetUsageByCountry[code],
}));

export default function ColorScaleMapShape() {
  const [colorMap, setColorMap] = React.useState('continuous');
  const [unknownShape, setUnknownShape] = React.useState('color');

  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const orientation = isLargeScreen ? 'horizontal' : 'vertical';

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 800 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 0 }}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={colorMap}
          onChange={(_, value) => value && setColorMap(value)}
          aria-label="color map"
        >
          <ToggleButton value="continuous">continuous</ToggleButton>
          <ToggleButton value="piecewise">piecewise</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={unknownShape}
          onChange={(_, value) => value && setUnknownShape(value)}
          aria-label="unknown shape"
        >
          <ToggleButton value="color">unknown Color</ToggleButton>
          <ToggleButton value="geoData">Geo Data</ToggleButton>
          <ToggleButton value="none">none</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Typography variant="body2" component="h6" sx={{ textAlign: 'end' }}>
        Share of the population using the Internet in 2020
      </Typography>
      <Box sx={{ width: '100%' }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          projection="naturalEarth1"
          height={360}
          series={[
            {
              type: 'mapShape',
              label: 'Internet usage',
              data,
              valueFormatter: (point) =>
                point.colorValue == null
                  ? 'No data'
                  : `${point.colorValue.toFixed(1)}%`,
            },
          ]}
          zAxis={[
            {
              id: 'internet-usage',
              colorMap:
                colorMap === 'continuous'
                  ? {
                      type: 'continuous',
                      min: 0,
                      max: 100,
                      color: ['#e3f2fd', '#0d47a1'],
                      unknownColor: unknownShape === 'color' ? 'gray' : undefined,
                    }
                  : {
                      type: 'piecewise',
                      thresholds: [25, 50, 75],
                      colors: [0.25, 0.5, 0.75, 1].map(interpolateBlues),
                      unknownColor: unknownShape === 'color' ? 'gray' : undefined,
                    },
            },
          ]}
        >
          <ChartsSurface>
            {unknownShape === 'geoData' && (
              <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
            )}
            <MapShapePlot stroke="#fff" strokeWidth={0.3} />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
          {colorMap === 'continuous' ? (
            <ContinuousColorLegend axisDirection="z" sx={{ maxWidth: 150 }} />
          ) : (
            <PiecewiseColorLegend axisDirection="z" direction="horizontal" />
          )}
        </ChartsGeoDataProviderPremium>
      </Box>
    </Stack>
  );
}
