import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapPointPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const cities: { coordinates: [number, number]; label: string }[] = [
  { coordinates: [-0.13, 51.51], label: 'London' },
  { coordinates: [-74.01, 40.71], label: 'New York' },
  { coordinates: [139.69, 35.69], label: 'Tokyo' },
  { coordinates: [151.21, -33.87], label: 'Sydney' },
  { coordinates: [31.24, 30.04], label: 'Cairo' },
];

export default function MapPointPlotDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={360}
        series={[
          {
            type: 'mapPoint',
            label: 'Cities',
            color: '#d32f2f',
            data: cities,
            valueFormatter: (point) => point.label ?? '',
          },
        ]}
      >
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapPointPlot showLabels />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
