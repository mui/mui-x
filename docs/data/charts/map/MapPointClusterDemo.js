import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapPointPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';

const countries = topojsonFeature(countriesTopology, 'countries');

// A scatter of stations clustered around a few European hubs.
const hubs = [
  [2.35, 48.85], // Paris
  [13.4, 52.52], // Berlin
  [12.5, 41.9], // Rome
  [-3.7, 40.42], // Madrid
];

const stations = hubs.flatMap(([lon, lat], hubIndex) =>
  Array.from({ length: 12 }, (_, i) => ({
    coordinates: [
      lon + Math.cos(i + hubIndex) * 1.5,
      lat + Math.sin(i * 1.7 + hubIndex) * 1.2,
    ],
    value: 1,
  })),
);

export default function MapPointClusterDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={400}
        series={[
          {
            type: 'mapPoint',
            label: 'Stations',
            color: '#7b1fa2',
            data: stations,
          },
        ]}
      >
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapPointPlot cluster={{ radius: 32 }} size={120} />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
