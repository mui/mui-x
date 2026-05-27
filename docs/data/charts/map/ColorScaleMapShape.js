import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
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
import { blue } from '@mui/material/colors';

const countries = withCountryCodeAsName(
  topojsonFeature(countriesTopology, 'countries'),
);

const data = Object.keys(countryData).map((code) => ({
  name: countryData[code].country,
  colorValue: internetUsageByCountry[code],
}));

export default function ColorScaleMapShape() {
  const [colorMap, setColorMap] = React.useState('continuous');

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 800 }}>
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
                    }
                  : {
                      type: 'piecewise',
                      thresholds: [25, 50, 75],
                      colors: [blue[100], blue[300], blue[500], blue[700]],
                    },
            },
          ]}
        >
          <ChartsSurface>
            <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
            <MapShapePlot stroke="#fff" strokeWidth={0.3} />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
          {colorMap === 'continuous' ? (
            <ContinuousColorLegend axisDirection="z" />
          ) : (
            <PiecewiseColorLegend axisDirection="z" direction="horizontal" />
          )}
        </ChartsGeoDataProviderPremium>
      </Box>
    </Stack>
  );
}
