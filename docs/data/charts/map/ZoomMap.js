import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { ContinuousColorLegend } from '@mui/x-charts-premium/ChartsLegend';

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

export default function ZoomMap() {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 800 }}>
      <Typography variant="body2" component="h6" sx={{ textAlign: 'end' }}>
        Share of the population using the Internet in 2020
      </Typography>
      <Box sx={{ width: '100%' }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          projection="naturalEarth1"
          height={360}
          zoom
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
              colorMap: {
                type: 'continuous',
                min: 0,
                max: 100,
                color: ['#e3f2fd', '#0d47a1'],
                unownedColor: '#f5f5f5',
              },
            },
          ]}
        >
          <ChartsSurface>
            <MapShapePlot stroke="#fff" strokeWidth={0.3} />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
          <ContinuousColorLegend axisDirection="z" sx={{ maxWidth: 150 }} />
        </ChartsGeoDataProviderPremium>
      </Box>
    </Stack>
  );
}
