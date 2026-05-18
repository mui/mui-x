import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsLegend } from '@mui/x-charts-premium/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const continents = {
  Africa: [
    'Algeria',
    'Angola',
    'Egypt',
    'Ethiopia',
    'Kenya',
    'Morocco',
    'Nigeria',
    'South Africa',
    'Sudan',
    'Tanzania',
  ],
  Asia: ['China', 'India', 'Indonesia', 'Iran', 'Japan', 'Kazakhstan', 'Mongolia'],
  Europe: [
    'France',
    'Germany',
    'Italy',
    'Poland',
    'Spain',
    'Sweden',
    'United Kingdom',
  ],
};

export default function VisibleMapShape() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={360}
        series={[
          {
            type: 'mapShape',
            label: 'Africa',
            color: '#ef6c00',
            data: continents.Africa.map((name) => ({ name })),
          },
          {
            type: 'mapShape',
            label: 'Asia',
            color: '#8e24aa',
            data: continents.Asia.map((name) => ({ name })),
          },
          {
            type: 'mapShape',
            label: 'Europe',
            color: '#1e88e5',
            data: continents.Europe.map((name) => ({ name })),
          },
        ]}
      >
        <ChartsLegend toggleVisibilityOnClick />
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapShapePlot />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
