import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapPointPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';

const countries = topojsonFeature(countriesTopology, 'countries');

// `value` is the city population, in millions.
const cities = [
  { coordinates: [139.69, 35.69], label: 'Tokyo', value: 37 },
  { coordinates: [77.21, 28.61], label: 'Delhi', value: 32 },
  { coordinates: [-99.13, 19.43], label: 'Mexico City', value: 22 },
  { coordinates: [-46.63, -23.55], label: 'São Paulo', value: 22 },
  { coordinates: [-0.13, 51.51], label: 'London', value: 9 },
  { coordinates: [-74.01, 40.71], label: 'New York', value: 8 },
  { coordinates: [31.24, 30.04], label: 'Cairo', value: 21 },
  { coordinates: [151.21, -33.87], label: 'Sydney', value: 5 },
];

export default function MapPointPlotDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={360}
        zAxis={[
          {
            id: 'population',
            min: 0,
            max: 40,
            sizeMap: { type: 'continuous', size: [40, 900] },
            colorMap: { type: 'continuous', color: ['#90caf9', '#0d47a1'] },
          },
        ]}
        series={[
          {
            type: 'mapPoint',
            label: 'Population (millions)',
            sizeAxisId: 'population',
            colorAxisId: 'population',
            data: cities,
            valueFormatter: (point, { dataIndex }) =>
              `${cities[dataIndex].label}: ${point.value}M`,
          },
        ]}
      >
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapPointPlot stroke="#fff" strokeWidth={1} />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
